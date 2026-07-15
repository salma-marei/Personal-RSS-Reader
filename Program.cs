using PersonalRssReader.Models;
using PersonalRssReader.Services;
using Rocket.Syndication;                     // ISyndicationClient
using Rocket.Syndication.DependencyInjection; // AddSyndicationClient

var builder = WebApplication.CreateBuilder(args);

// Honor the port the hosting platform assigns (Railway/containers set PORT).
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddSingleton(new JsonFeedStorage("Data/feeds.json"));
builder.Services.AddSyndicationClient();
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

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/feeds", async (JsonFeedStorage storage) =>
{
    var feeds = await storage.LoadAsync();
    return Results.Ok(feeds);
});

app.MapPost("/feeds", async (JsonFeedStorage storage, ISyndicationClient syndication, CreateFeedRequest request, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(request.Url))
        return Results.BadRequest("URL is required.");

    var url = request.Url.Trim();

    var feeds = await storage.LoadAsync();
    if (feeds.Any(f => string.Equals(f.Url, url, StringComparison.OrdinalIgnoreCase)))
        return Results.Conflict("This feed is already in your subscriptions.");

    var result = await syndication.GetFeedAsync(url, ct);
    if (!result.IsSuccess)
        return Results.BadRequest($"Not a valid RSS/Atom feed: {result.Error?.Message}");

    var feed = new RssFeed
    {
        Id = Guid.NewGuid(),
        Url = url,
        Name = string.IsNullOrWhiteSpace(result.Feed!.Title) ? url : result.Feed.Title,
        AddedAt = DateTime.UtcNow
    };
    feeds.Add(feed);
    await storage.SaveAsync(feeds);

    return Results.Created($"/feeds/{feed.Id}", feed);
});

app.MapGet("/feeds/{id:guid}/articles", async (Guid id, JsonFeedStorage storage, FeedArticleService articleService, ArticleCache cache, CancellationToken ct) =>
{
    var feeds = await storage.LoadAsync();
    var feed = feeds.FirstOrDefault(f => f.Id == id);
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

app.MapPost("/feeds/{id:guid}/refresh", async (Guid id, JsonFeedStorage storage, FeedArticleService articleService, ArticleCache cache, CancellationToken ct) =>
{
    var feeds = await storage.LoadAsync();
    var feed = feeds.FirstOrDefault(f => f.Id == id);
    if (feed is null)
        return Results.NotFound($"No feed with id {id}.");

    try
    {
        var articles = await articleService.GetArticlesAsync(feed, ct);
        cache.Set(feed.Id, articles);
        return Results.Ok(articles);
    }
    catch (FeedFetchException ex)
    {
        return Results.BadRequest($"Could not refresh feed: {ex.Message}");
    }
});

app.MapGet("/river", async (JsonFeedStorage storage, FeedArticleService articleService, ArticleCache cache, CancellationToken ct) =>
{
    var feeds = await storage.LoadAsync();

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

app.MapPost("/feeds/refresh", async (JsonFeedStorage storage, FeedArticleService articleService, ArticleCache cache, CancellationToken ct) =>
{
    var feeds = await storage.LoadAsync();

    // Refresh all feeds concurrently.
    var tasks = feeds.Select(async feed =>
    {
        try
        {
            var articles = await articleService.GetArticlesAsync(feed, ct);
            cache.Set(feed.Id, articles);
        }
        catch (FeedFetchException)
        {
            // skip feeds that fail; keep refreshing the others
        }
    });

    await Task.WhenAll(tasks);

    return Results.NoContent();
});

app.MapPost("/daily-brief", async (
    DailyBriefRequest request,
    JsonFeedStorage storage,
    FeedArticleService articleService,
    ArticleCache articleCache,
    DailyBriefService briefService,
    DailyBriefCache briefCache,
    DailyBriefRateLimitService rateLimitService,
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

    if (!request.Regenerate)
    {
        var cachedBrief = briefCache.Get(dayStartUtc, dayEndUtc, language);
        if (cachedBrief is not null)
        {
            ApplyRateLimitHeaders(httpContext.Response, rateLimitService.GetStatus(clientIp));
            return Results.Ok(cachedBrief);
        }
    }

    var feeds = await storage.LoadAsync();
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
            var cachedBrief = briefCache.Get(dayStartUtc, dayEndUtc, language);
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
            briefCache.Set(dayStartUtc, dayEndUtc, language, brief);
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

app.MapDelete("/feeds/{id:guid}", async (Guid id, JsonFeedStorage storage, ArticleCache cache) =>
{
    var feeds = await storage.LoadAsync();
    var feed = feeds.FirstOrDefault(f => f.Id == id);
    if (feed is null)
        return Results.NotFound($"No feed with id {id}.");

    feeds.Remove(feed);
    await storage.SaveAsync(feeds);
    cache.Remove(feed.Id);
    return Results.NoContent();
});

// Warm the article cache in the background at startup so the first page load is fast:
// feeds get fetched while the user is still opening the browser, and it primes the
// fetch/parse code paths (JIT) too.
_ = Task.Run(async () =>
{
    try
    {
        using var scope = app.Services.CreateScope();
        var storage = scope.ServiceProvider.GetRequiredService<JsonFeedStorage>();
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
