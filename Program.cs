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

app.Run();
