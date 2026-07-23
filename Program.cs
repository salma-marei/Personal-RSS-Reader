using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PersonalRssReader.Data;
using PersonalRssReader.Models;
using PersonalRssReader.Services;
using Rocket.Syndication;                     // ISyndicationClient
using Rocket.Syndication.DependencyInjection; // AddSyndicationClient
using Rocket.Syndication.Parsing;             // IFeedParser, AtomFeedParser

var builder = WebApplication.CreateBuilder(args);

// Honor the port the hosting platform assigns (Railway/containers set PORT).
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var databasePath = builder.Configuration.GetConnectionString("ReaderDatabase")
    ?? "Data Source=Data/reader.db";
builder.Services.AddDbContextFactory<ReaderDbContext>(options =>
    options.UseSqlite(databasePath));
builder.Services.AddScoped<FeedStorage>();
builder.Services.AddScoped<FeedDatabaseInitializer>();
builder.Services.AddScoped<SubscriptionService>();
builder.Services.AddScoped<CustomFeedService>();
builder.Services.AddScoped<ArticleStateService>();
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.SignIn.RequireConfirmedEmail = true;
    })
    .AddEntityFrameworkStores<ReaderDbContext>()
    .AddDefaultTokenProviders();
builder.Services
    .AddAuthentication()
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? string.Empty;
        options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? string.Empty;
        options.ClaimActions.MapJsonKey("urn:google:email_verified", "email_verified");
    });
builder.Services.AddAuthorization();
builder.Services.Configure<SendGridOptions>(builder.Configuration.GetSection(SendGridOptions.SectionName));
builder.Services.AddScoped<IVerificationEmailSender, VerificationEmailSender>();
builder.Services.AddScoped<IPasswordHasher<EmailVerificationCode>, PasswordHasher<EmailVerificationCode>>();
builder.Services.AddScoped<EmailVerificationService>();
builder.Services.AddHostedService<UnverifiedAccountCleanupService>();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "PersonalRssReader.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
    options.SlidingExpiration = true;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});
builder.Services.AddSyndicationClient();
builder.Services.AddSingleton<IFeedParser, AtomFeedParser>();
builder.Services.AddScoped<FeedArticleService>();
builder.Services.AddSingleton<ArticleCache>();
builder.Services.AddSingleton<HtmlContentSanitizer>();
builder.Services.AddSingleton<DailyBriefCache>();
builder.Services.Configure<DailyBriefRateLimitOptions>(
    builder.Configuration.GetSection(DailyBriefRateLimitOptions.SectionName));
builder.Services.AddSingleton<DailyBriefRateLimitService>();
builder.Services.AddHttpClient<DailyBriefService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["DeepSeek:BaseUrl"] ?? "https://api.deepseek.com/");
    client.Timeout = TimeSpan.FromSeconds(60);
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<FeedDatabaseInitializer>();
    await initializer.InitializeAsync();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/register", async (
    RegisterRequest request,
    UserManager<ApplicationUser> userManager,
    EmailVerificationService verification,
    CancellationToken ct) =>
{
    var email = request.Email.Trim();
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["credentials"] = ["Email and password are required."]
        });

    if (!verification.IsConfigured)
        return Results.Problem(
            "Email verification is not configured.",
            statusCode: StatusCodes.Status503ServiceUnavailable);

    var existingUser = await userManager.FindByEmailAsync(email);
    if (existingUser is not null && !existingUser.EmailConfirmed)
    {
        if (!await userManager.CheckPasswordAsync(existingUser, request.Password))
        {
            return Results.Json(new
            {
                error = "This email is awaiting verification. Sign in with the password you originally chose to continue."
            }, statusCode: StatusCodes.Status409Conflict);
        }

        try
        {
            var resent = await verification.SendAsync(existingUser, ct);
            return Results.Accepted(value: new
            {
                requiresVerification = true,
                email,
                retryAfterSeconds = resent.RetryAfterSeconds
            });
        }
        catch
        {
            return Results.Problem(
                "The verification email could not be sent. Please try again.",
                statusCode: StatusCodes.Status502BadGateway);
        }
    }

    var user = new ApplicationUser
    {
        Id = Guid.NewGuid(),
        UserName = email,
        Email = email,
        CreatedAt = DateTime.UtcNow
    };
    var result = await userManager.CreateAsync(user, request.Password);
    if (!result.Succeeded)
        return IdentityValidationProblem(result);

    try
    {
        var sent = await verification.SendAsync(user, ct);
        return Results.Accepted(value: new
        {
            requiresVerification = true,
            email,
            retryAfterSeconds = sent.RetryAfterSeconds
        });
    }
    catch
    {
        await userManager.DeleteAsync(user);
        return Results.Problem(
            "The verification email could not be sent. Please try again.",
            statusCode: StatusCodes.Status502BadGateway);
    }
});

app.MapPost("/api/auth/login", async (
    LoginRequest request,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    EmailVerificationService verification,
    CancellationToken ct) =>
{
    var email = request.Email.Trim();
    var user = await userManager.FindByEmailAsync(email);
    if (user is null)
        return Results.Json(
            new { error = "Invalid email or password." },
            statusCode: StatusCodes.Status401Unauthorized);

    if (!await userManager.CheckPasswordAsync(user, request.Password))
        return Results.Json(
            new { error = "Invalid email or password." },
            statusCode: StatusCodes.Status401Unauthorized);

    if (!user.EmailConfirmed)
    {
        if (!verification.IsConfigured)
            return Results.Problem(
                "Email verification is not configured.",
                statusCode: StatusCodes.Status503ServiceUnavailable);
        var sent = await verification.SendAsync(user, ct);
        return Results.Json(new
        {
            error = "Verify your email before signing in.",
            requiresVerification = true,
            email,
            retryAfterSeconds = sent.RetryAfterSeconds
        }, statusCode: StatusCodes.Status403Forbidden);
    }

    var result = await signInManager.PasswordSignInAsync(
        user,
        request.Password,
        request.RememberMe,
        lockoutOnFailure: false);
    if (!result.Succeeded)
        return Results.Json(
            new { error = "Invalid email or password." },
            statusCode: StatusCodes.Status401Unauthorized);

    return Results.Ok(AuthResponse(user));
});

app.MapPost("/api/auth/verify-email", async (
    VerifyEmailRequest request,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    EmailVerificationService verification,
    CancellationToken ct) =>
{
    var email = request.Email.Trim();
    var code = request.Code.Trim();
    if (code.Length != 6 || code.Any(character => !char.IsAsciiDigit(character)))
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["code"] = ["Enter the six-digit code from your email."]
        });

    var user = await userManager.FindByEmailAsync(email);
    if (user is null || user.EmailConfirmed)
        return Results.Json(
            new { error = "This verification code is invalid or expired." },
            statusCode: StatusCodes.Status400BadRequest);

    var result = await verification.VerifyAsync(user, code, ct);
    if (result != VerificationResult.Succeeded)
    {
        var message = result switch
        {
            VerificationResult.TooManyAttempts => "Too many attempts. Request a new code.",
            VerificationResult.Expired => "This code has expired. Request a new one.",
            _ => "That verification code is incorrect."
        };
        return Results.Json(new { error = message }, statusCode: StatusCodes.Status400BadRequest);
    }

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Ok(AuthResponse(user));
});

app.MapPost("/api/auth/resend-verification", async (
    ResendVerificationCodeRequest request,
    UserManager<ApplicationUser> userManager,
    EmailVerificationService verification,
    CancellationToken ct) =>
{
    var user = await userManager.FindByEmailAsync(request.Email.Trim());
    if (user is null || user.EmailConfirmed)
        return Results.Accepted();
    if (!verification.IsConfigured)
        return Results.Problem(
            "Email verification is not configured.",
            statusCode: StatusCodes.Status503ServiceUnavailable);

    var sent = await verification.SendAsync(user, ct);
    if (!sent.Sent)
    {
        return Results.Json(
            new { error = "Please wait before requesting another code.", retryAfterSeconds = sent.RetryAfterSeconds },
            statusCode: StatusCodes.Status429TooManyRequests);
    }
    return Results.Accepted(value: new { retryAfterSeconds = sent.RetryAfterSeconds });
});

app.MapPost("/api/auth/logout", async (SignInManager<ApplicationUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.NoContent();
});

app.MapGet("/api/auth/google", (
    IConfiguration configuration,
    SignInManager<ApplicationUser> signInManager) =>
{
    if (string.IsNullOrWhiteSpace(configuration["Authentication:Google:ClientId"]) ||
        string.IsNullOrWhiteSpace(configuration["Authentication:Google:ClientSecret"]))
    {
        return Results.Problem(
            "Google sign-in is not configured.",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }

    var properties = signInManager.ConfigureExternalAuthenticationProperties(
        GoogleDefaults.AuthenticationScheme,
        "/api/auth/google/callback");
    return Results.Challenge(properties, [GoogleDefaults.AuthenticationScheme]);
});

app.MapGet("/api/auth/google/callback", async (
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager) =>
{
    const string errorRedirect = "/?authError=google";
    var info = await signInManager.GetExternalLoginInfoAsync();
    if (info is null)
        return Results.LocalRedirect(errorRedirect);

    var signInResult = await signInManager.ExternalLoginSignInAsync(
        info.LoginProvider,
        info.ProviderKey,
        isPersistent: true,
        bypassTwoFactor: false);
    if (signInResult.Succeeded)
        return Results.LocalRedirect("/");

    var email = info.Principal.FindFirstValue(ClaimTypes.Email)?.Trim();
    var emailVerified = string.Equals(
        info.Principal.FindFirstValue("urn:google:email_verified"),
        "true",
        StringComparison.OrdinalIgnoreCase);
    if (string.IsNullOrWhiteSpace(email) || !emailVerified)
        return Results.LocalRedirect(errorRedirect);

    var linkedUser = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
    var user = linkedUser ?? await userManager.FindByEmailAsync(email);
    if (user is null)
    {
        user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow
        };
        var createResult = await userManager.CreateAsync(user);
        if (!createResult.Succeeded)
            return Results.LocalRedirect(errorRedirect);
    }
    else if (!user.EmailConfirmed)
    {
        user.EmailConfirmed = true;
        var confirmResult = await userManager.UpdateAsync(user);
        if (!confirmResult.Succeeded)
            return Results.LocalRedirect(errorRedirect);
    }

    if (linkedUser is null)
    {
        var addLoginResult = await userManager.AddLoginAsync(user, info);
        if (!addLoginResult.Succeeded)
            return Results.LocalRedirect(errorRedirect);
    }

    await signInManager.SignInAsync(user, isPersistent: true);
    return Results.LocalRedirect("/");
});

app.MapGet("/api/auth/me", async (
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager) =>
{
    if (httpContext.User.Identity?.IsAuthenticated != true)
        return Results.Ok(new { isAuthenticated = false });

    var user = await userManager.GetUserAsync(httpContext.User);
    return user is null
        ? Results.Ok(new { isAuthenticated = false })
        : Results.Ok(AuthResponse(user));
});

app.MapGet("/api/subscriptions", async (
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    SubscriptionService subscriptions,
    CancellationToken ct) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null)
        return Results.Unauthorized();

    var items = await subscriptions.GetAsync(user.Id, ct);
    return Results.Ok(items.Select(item => new
    {
        feedId = item.FeedId,
        subscribedAt = item.SubscribedAt,
        customDisplayName = item.CustomDisplayName
    }));
}).RequireAuthorization();

app.MapPost("/api/subscriptions/{feedId:guid}", async (
    Guid feedId,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    SubscriptionService subscriptions,
    CancellationToken ct) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null)
        return Results.Unauthorized();

    var result = await subscriptions.SubscribeAsync(user.Id, feedId, ct);
    return result switch
    {
        SubscriptionResult.FeedNotFound => Results.NotFound(new { error = "Feed not found." }),
        SubscriptionResult.AlreadySubscribed => Results.Ok(new { feedId, subscribed = true }),
        _ => Results.Created($"/api/subscriptions/{feedId}", new { feedId, subscribed = true })
    };
}).RequireAuthorization();

app.MapDelete("/api/subscriptions/{feedId:guid}", async (
    Guid feedId,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    SubscriptionService subscriptions,
    CancellationToken ct) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null)
        return Results.Unauthorized();

    await subscriptions.UnsubscribeAsync(user.Id, feedId, ct);
    return Results.NoContent();
}).RequireAuthorization();

app.MapGet("/api/article-states", async (
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    ArticleStateService articleStates,
    CancellationToken ct) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    return user is null
        ? Results.Unauthorized()
        : Results.Ok(await articleStates.GetAsync(user.Id, ct));
}).RequireAuthorization();

app.MapPost("/api/article-states/read", async (
    ArticleStateRequest request,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    ArticleStateService articleStates,
    CancellationToken ct) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null) return Results.Unauthorized();
    try
    {
        return Results.Ok(await articleStates.MarkReadAsync(user.Id, request, ct));
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
}).RequireAuthorization();

app.MapPost("/api/article-states/read-later", async (
    ArticleStateRequest request,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    ArticleStateService articleStates,
    CancellationToken ct) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null) return Results.Unauthorized();
    try
    {
        return Results.Ok(await articleStates.SetReadLaterAsync(user.Id, request, ct));
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
}).RequireAuthorization();

app.MapGet("/feeds", async (FeedStorage storage, CancellationToken ct) =>
{
    var feeds = await storage.LoadAsync(ct);
    return Results.Ok(feeds);
});

app.MapPost("/feeds", async (
    CreateFeedRequest request,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    CustomFeedService customFeeds,
    CancellationToken ct) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null)
        return Results.Unauthorized();

    var result = await customFeeds.AddAndSubscribeAsync(user.Id, request.Url, ct);
    if (result.Feed is null)
        return Results.BadRequest(new { error = result.Error });

    var response = new
    {
        feed = result.Feed,
        subscribed = true,
        alreadySubscribed = result.AlreadySubscribed
    };
    return result.FeedCreated
        ? Results.Created($"/feeds/{result.Feed.Id}", response)
        : Results.Ok(response);
}).RequireAuthorization();

app.MapPost("/feeds/topics", async (
    CreateTopicFeedRequest request,
    HttpContext httpContext,
    UserManager<ApplicationUser> userManager,
    CustomFeedService customFeeds,
    CancellationToken ct) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null)
        return Results.Unauthorized();

    string feedUrl;
    try
    {
        feedUrl = GoogleNewsTopicFeed.CreateUrl(request.Query, request.Language, request.Country);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }

    var result = await customFeeds.AddAndSubscribeAsync(user.Id, feedUrl, ct);
    if (result.Feed is null)
        return Results.BadRequest(new { error = result.Error });

    var response = new
    {
        feed = result.Feed,
        subscribed = true,
        alreadySubscribed = result.AlreadySubscribed,
        topic = request.Query.Trim()
    };
    return result.FeedCreated
        ? Results.Created($"/feeds/{result.Feed.Id}", response)
        : Results.Ok(response);
}).RequireAuthorization();

app.MapGet("/feeds/{id:guid}/articles", async (Guid id, FeedStorage storage, FeedArticleService articleService, ArticleCache cache, CancellationToken ct) =>
{
    var feed = await storage.FindAsync(id, ct);
    if (feed is null)
        return Results.NotFound($"No feed with id {id}.");

    var cached = cache.Get(feed.Id);
    if (cached is not null)
        return Results.Ok(cached);

    try
    {
        var articles = await articleService.GetArticlesAsync(feed, ct);
        cache.Set(feed.Id, articles);
        return Results.Ok(articles);
    }
    catch (FeedFetchException ex)
    {
        return Results.BadRequest($"Could not fetch articles: {ex.Message}");
    }
});

app.MapPost("/feeds/{id:guid}/refresh", async (Guid id, FeedStorage storage, FeedArticleService articleService, ArticleCache cache, CancellationToken ct) =>
{
    var feed = await storage.FindAsync(id, ct);
    if (feed is null)
        return Results.NotFound($"No feed with id {id}.");

    try
    {
        var articles = await articleService.GetArticlesAsync(feed, ct);
        cache.Set(feed.Id, articles);
        await storage.MarkRefreshedAsync(feed.Id, ct);
        return Results.Ok(articles);
    }
    catch (FeedFetchException ex)
    {
        return Results.BadRequest($"Could not refresh feed: {ex.Message}");
    }
});

app.MapGet("/river", async (FeedStorage storage, FeedArticleService articleService, ArticleCache cache, CancellationToken ct) =>
{
    var feeds = await storage.LoadAsync(ct);

    // Fetch all uncached feeds concurrently so cold load takes ~one feed's time, not the sum.
    var tasks = feeds.Select(async feed =>
    {
        var cached = cache.Get(feed.Id);
        if (cached is not null)
            return cached;

        try
        {
            var articles = await articleService.GetArticlesAsync(feed, ct);
            cache.Set(feed.Id, articles);
            return articles;
        }
        catch (FeedFetchException)
        {
            return []; // feed unreachable right now — skip it, keep the rest
        }
    });

    var results = await Task.WhenAll(tasks);

    var river = results
        .SelectMany(articles => articles)
        .OrderByDescending(a => a.PublishedAt ?? DateTimeOffset.MinValue)
        .ToList();

    return Results.Ok(river);
});

app.MapPost("/feeds/refresh", async (FeedStorage storage, FeedArticleService articleService, ArticleCache cache, CancellationToken ct) =>
{
    var feeds = await storage.LoadAsync(ct);

    // Refresh all feeds concurrently.
    var tasks = feeds.Select(async feed =>
    {
        try
        {
            var articles = await articleService.GetArticlesAsync(feed, ct);
            cache.Set(feed.Id, articles);
            return (Guid?)feed.Id;
        }
        catch (FeedFetchException)
        {
            // skip feeds that fail; keep refreshing the others
            return null;
        }
    });

    var refreshedFeedIds = (await Task.WhenAll(tasks))
        .Where(id => id.HasValue)
        .Select(id => id!.Value);
    await storage.MarkRefreshedAsync(refreshedFeedIds, ct);

    return Results.NoContent();
});

app.MapPost("/daily-brief", async (
    DailyBriefRequest request,
    FeedStorage storage,
    FeedArticleService articleService,
    ArticleCache articleCache,
    DailyBriefService briefService,
    DailyBriefCache briefCache,
    DailyBriefRateLimitService rateLimitService,
    UserManager<ApplicationUser> userManager,
    SubscriptionService subscriptions,
    HttpContext httpContext,
    ILogger<Program> logger,
    CancellationToken ct) =>
{
    var language = request.Language == "ar" ? "ar" : "en";
    if (request.CoverageHours is not (0 or 6 or 12 or 24))
        return Results.BadRequest(new { error = "Coverage must be automatic, 6, 12, or 24 hours." });
    var dayStartUtc = request.DayStartUtc.ToUniversalTime();
    var dayEndUtc = request.DayEndUtc.ToUniversalTime();
    var dayLength = dayEndUtc - dayStartUtc;
    var clientIp = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

    // Browser-local calendar days can be 23 or 25 hours around daylight-saving changes.
    if (dayLength < TimeSpan.FromHours(20) || dayLength > TimeSpan.FromHours(26))
        return Results.BadRequest(new { error = "The requested day range is invalid." });

    var now = DateTimeOffset.UtcNow;
    if (dayStartUtc < now.AddHours(-48) || dayEndUtc > now.AddHours(48))
        return Results.BadRequest(new { error = "Only recent articles can be summarized." });

    // Reuse a generated brief within the current UTC hour while allowing it to
    // naturally refresh as the rolling article window moves forward.
    var briefCacheStartUtc = new DateTimeOffset(
        now.Year, now.Month, now.Day, now.Hour, 0, 0, TimeSpan.Zero);
    var briefCacheEndUtc = briefCacheStartUtc.AddHours(1);

    var user = await userManager.GetUserAsync(httpContext.User);
    if (request.Regenerate && user is null)
        return Results.Json(
            new { error = "Sign in to regenerate the daily brief." },
            statusCode: StatusCodes.Status403Forbidden);

    HashSet<Guid>? subscribedFeedIds = null;
    var cacheScope = "public";
    if (user is not null)
    {
        subscribedFeedIds = (await subscriptions.GetAsync(user.Id, ct))
            .Select(item => item.FeedId)
            .ToHashSet();
        if (subscribedFeedIds.Count == 0)
            return Results.BadRequest(new { error = "Subscribe to at least one feed before creating your brief." });

        cacheScope = $"user:{user.Id}:feeds:{string.Join(',', subscribedFeedIds.Order())}";
    }
    cacheScope += $":coverage:{request.CoverageHours}";

    if (!request.Regenerate)
    {
        var cachedBrief = briefCache.Get(briefCacheStartUtc, briefCacheEndUtc, language, cacheScope);
        if (cachedBrief is not null)
        {
            ApplyRateLimitHeaders(httpContext.Response, rateLimitService.GetStatus(clientIp));
            return Results.Ok(cachedBrief);
        }
    }

    var feeds = await storage.LoadAsync(ct);
    if (subscribedFeedIds is not null)
        feeds = feeds.Where(feed => subscribedFeedIds.Contains(feed.Id)).ToList();
    var tasks = feeds.Select(async feed =>
    {
        var cachedArticles = articleCache.Get(feed.Id);
        if (cachedArticles is not null)
            return cachedArticles;

        try
        {
            var articles = await articleService.GetArticlesAsync(feed, ct);
            articleCache.Set(feed.Id, articles);
            return articles;
        }
        catch (FeedFetchException)
        {
            return [];
        }
    });

    var articlesFromFeeds = await Task.WhenAll(tasks);
    var allArticles = articlesFromFeeds.SelectMany(articles => articles).ToList();
    var briefNow = DateTimeOffset.UtcNow;
    var briefSelection = RecentBriefArticleSelector.Select(
        allArticles,
        briefNow,
        request.CoverageHours == 0 ? null : request.CoverageHours);
    var todaysArticles = briefSelection.Articles;

    if (todaysArticles.Count == 0)
        return Results.NotFound(new { error = "No articles were published in the last 24 hours." });

    DailyBriefLimitResult? acquiredLimit = null;
    if (request.Regenerate)
    {
        acquiredLimit = rateLimitService.TryAcquireRegeneration(clientIp);
        ApplyRateLimitHeaders(httpContext.Response, acquiredLimit);
        if (!acquiredLimit.Allowed)
            return RateLimitExceeded(httpContext.Response, acquiredLimit);
    }

    await rateLimitService.GenerationLock.WaitAsync(ct);
    try
    {
        // A second first-generation request may have arrived while the first was running.
        // Recheck the cache after entering the generation lock so it can reuse that result.
        if (!request.Regenerate)
        {
            var cachedBrief = briefCache.Get(briefCacheStartUtc, briefCacheEndUtc, language, cacheScope);
            if (cachedBrief is not null)
            {
                ApplyRateLimitHeaders(httpContext.Response, rateLimitService.GetStatus(clientIp));
                return Results.Ok(cachedBrief);
            }

            acquiredLimit = rateLimitService.TryAcquireInitialGeneration(clientIp);
            ApplyRateLimitHeaders(httpContext.Response, acquiredLimit);
            if (!acquiredLimit.Allowed)
                return RateLimitExceeded(httpContext.Response, acquiredLimit);
        }

        try
        {
            var brief = await briefService.GenerateAsync(todaysArticles, language, ct);
            brief.CoverageHours = briefSelection.CoverageHours;
            brief.CoverageOptions = new[] { 6, 12, 24 }
                .Select(hours => new DailyBriefCoverageOption
                {
                    Hours = hours,
                    ArticleCount = allArticles.Count(article =>
                        article.PublishedAt >= briefNow.AddHours(-hours) &&
                        article.PublishedAt <= briefNow)
                })
                .ToList();
            briefCache.Set(briefCacheStartUtc, briefCacheEndUtc, language, brief, cacheScope);
            ApplyRateLimitHeaders(httpContext.Response, acquiredLimit!);
            return Results.Ok(brief);
        }
        catch (DailyBriefConfigurationException ex)
        {
            logger.LogWarning(ex, "Daily brief generation is not configured.");
            return Results.Json(new { error = ex.Message }, statusCode: StatusCodes.Status503ServiceUnavailable);
        }
        catch (DailyBriefGenerationException ex)
        {
            logger.LogError(ex, "Daily brief generation failed.");
            return Results.Json(
                new { error = "The AI News Brief could not be generated. Please try again." },
                statusCode: StatusCodes.Status502BadGateway);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Could not reach DeepSeek while generating the daily brief.");
            return Results.Json(
                new { error = "The AI service is unavailable right now. Please try again." },
                statusCode: StatusCodes.Status502BadGateway);
        }
        catch (TaskCanceledException ex) when (!ct.IsCancellationRequested)
        {
            logger.LogError(ex, "DeepSeek timed out while generating the daily brief.");
            return Results.Json(
                new { error = "The AI service took too long to respond. Please try again." },
                statusCode: StatusCodes.Status504GatewayTimeout);
        }
    }
    finally
    {
        rateLimitService.GenerationLock.Release();
    }
});

app.MapDelete("/feeds/{id:guid}", () => Results.Json(
    new { error = "Shared feeds cannot be deleted by reader users." },
    statusCode: StatusCodes.Status403Forbidden));

// Warm the article cache in the background at startup so the first page load is fast:
// feeds get fetched while the user is still opening the browser, and it primes the
// fetch/parse code paths (JIT) too.
_ = Task.Run(async () =>
{
    try
    {
        using var scope = app.Services.CreateScope();
        var storage = scope.ServiceProvider.GetRequiredService<FeedStorage>();
        var articleService = scope.ServiceProvider.GetRequiredService<FeedArticleService>();
        var cache = scope.ServiceProvider.GetRequiredService<ArticleCache>();

        var feeds = await storage.LoadAsync();
        await Task.WhenAll(feeds.Select(async feed =>
        {
            try
            {
                var articles = await articleService.GetArticlesAsync(feed, CancellationToken.None);
                cache.Set(feed.Id, articles);
            }
            catch (FeedFetchException) { /* skip a feed that's down */ }
        }));
    }
    catch { /* best-effort warm-up; never let it crash startup */ }
});

app.MapFallbackToFile("index.html");

app.Run();

static void ApplyRateLimitHeaders(HttpResponse response, DailyBriefLimitResult limit)
{
    response.Headers["X-AI-Regenerations-Limit"] = limit.DailyRegenerationLimit.ToString();
    response.Headers["X-AI-Regenerations-Remaining"] = limit.RemainingRegenerations.ToString();
    response.Headers["X-AI-Regenerate-After"] = limit.RetryAfterSeconds.ToString();
    response.Headers["X-AI-Rate-Limit-Reason"] = limit.Reason.ToString();
}

static IResult RateLimitExceeded(HttpResponse response, DailyBriefLimitResult limit)
{
    response.Headers.RetryAfter = limit.RetryAfterSeconds.ToString();

    var message = limit.Reason switch
    {
        DailyBriefLimitReason.Cooldown =>
            "Please wait at least one minute between regenerations.",
        DailyBriefLimitReason.DailyIpLimit =>
            "You have used all 5 brief regenerations for today.",
        DailyBriefLimitReason.GlobalDailyLimit =>
            "The AI News Brief has reached its generation limit for today. Please try again tomorrow.",
        _ => "Too many AI News Brief requests. Please try again later."
    };

    return Results.Json(new
    {
        error = message,
        reason = limit.Reason.ToString(),
        retryAfterSeconds = limit.RetryAfterSeconds,
        remainingRegenerations = limit.RemainingRegenerations,
        dailyRegenerationLimit = limit.DailyRegenerationLimit
    }, statusCode: StatusCodes.Status429TooManyRequests);
}

static object AuthResponse(ApplicationUser user) => new
{
    isAuthenticated = true,
    id = user.Id,
    email = user.Email,
    createdAt = user.CreatedAt
};

static IResult IdentityValidationProblem(IdentityResult result)
{
    var errors = result.Errors
        .GroupBy(error => error.Code)
        .ToDictionary(
            group => group.Key,
            group => group.Select(error => error.Description).ToArray());
    return Results.ValidationProblem(errors);
}
