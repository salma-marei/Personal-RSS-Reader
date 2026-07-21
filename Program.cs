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
        options.SignIn.RequireConfirmedEmail = false;
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
    SignInManager<ApplicationUser> signInManager) =>
{
    var email = request.Email.Trim();
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["credentials"] = ["Email and password are required."]
        });

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

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Ok(AuthResponse(user));
});

app.MapPost("/api/auth/login", async (
    LoginRequest request,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager) =>
{
    var email = request.Email.Trim();
    var user = await userManager.FindByEmailAsync(email);
    if (user is null)
        return Results.Json(
            new { error = "Invalid email or password." },
            statusCode: StatusCodes.Status401Unauthorized);

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

    var user = await userManager.FindByEmailAsync(email);
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

    var addLoginResult = await userManager.AddLoginAsync(user, info);
    if (!addLoginResult.Succeeded)
        return Results.LocalRedirect(errorRedirect);

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
    var dayStartUtc = request.DayStartUtc.ToUniversalTime();
    var dayEndUtc = request.DayEndUtc.ToUniversalTime();
    var dayLength = dayEndUtc - dayStartUtc;
    var clientIp = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

    // Browser-local calendar days can be 23 or 25 hours around daylight-saving changes.
    if (dayLength < TimeSpan.FromHours(20) || dayLength > TimeSpan.FromHours(26))
        return Results.BadRequest(new { error = "The requested day range is invalid." });

    var now = DateTimeOffset.UtcNow;
    if (dayStartUtc < now.AddHours(-48) || dayEndUtc > now.AddHours(48))
        return Results.BadRequest(new { error = "Only the current day can be summarized." });

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

    if (!request.Regenerate)
    {
        var cachedBrief = briefCache.Get(dayStartUtc, dayEndUtc, language, cacheScope);
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
    var todaysArticles = articlesFromFeeds
        .SelectMany(articles => articles)
        .Where(article => article.PublishedAt >= dayStartUtc && article.PublishedAt < dayEndUtc)
        .ToList();

    if (todaysArticles.Count == 0)
        return Results.NotFound(new { error = "No articles were published today." });

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
            var cachedBrief = briefCache.Get(dayStartUtc, dayEndUtc, language, cacheScope);
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
            briefCache.Set(dayStartUtc, dayEndUtc, language, brief, cacheScope);
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
                new { error = "The AI Daily Brief could not be generated. Please try again." },
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
            "The AI Daily Brief has reached its generation limit for today. Please try again tomorrow.",
        _ => "Too many AI Daily Brief requests. Please try again later."
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
