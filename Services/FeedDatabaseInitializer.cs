using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PersonalRssReader.Data;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public sealed class FeedDatabaseInitializer(
    ReaderDbContext db,
    IWebHostEnvironment environment,
    ILogger<FeedDatabaseInitializer> logger)
{
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        Directory.CreateDirectory(Path.Combine(environment.ContentRootPath, "Data"));
        await db.Database.MigrateAsync(cancellationToken);

        if (await db.Feeds.AnyAsync(cancellationToken))
            return;

        var curatedSeedPath = Path.Combine(
            environment.ContentRootPath,
            "Seed",
            "suggested-feeds.json");
        var legacyJsonPath = Path.Combine(environment.ContentRootPath, "Data", "feeds.json");
        var jsonPath = File.Exists(curatedSeedPath) ? curatedSeedPath : legacyJsonPath;
        if (!File.Exists(jsonPath))
        {
            logger.LogInformation("No suggested-feed seed or legacy feeds.json was found; the feed database starts empty.");
            return;
        }

        await using var stream = File.OpenRead(jsonPath);
        var feeds = await JsonSerializer.DeserializeAsync<List<RssFeed>>(
            stream,
            cancellationToken: cancellationToken) ?? [];

        foreach (var feed in feeds)
            ApplySuggestedMetadata(feed);

        db.Feeds.AddRange(feeds);
        await db.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Imported {FeedCount} suggested feeds into SQLite.", feeds.Count);
    }

    private static void ApplySuggestedMetadata(RssFeed feed)
    {
        feed.IsSuggested = true;
        feed.Category = "News";

        var name = feed.Name.ToLowerInvariant();
        var url = feed.Url.ToLowerInvariant();
        feed.Language =
            name.Contains("arabic") ||
            name.Contains("العربي") ||
            url.Contains("/arabic") ||
            url.Contains("almasryalyoum")
                ? "ar"
                : url.Contains("express.pk")
                    ? "ur"
                    : "en";
    }
}
