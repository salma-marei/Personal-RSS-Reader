using Microsoft.EntityFrameworkCore;
using PersonalRssReader.Data;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public sealed class FeedStorage(IDbContextFactory<ReaderDbContext> contextFactory)
{
    public async Task<List<RssFeed>> LoadAsync(CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        return await db.Feeds
            .AsNoTracking()
            .OrderBy(feed => feed.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<RssFeed?> FindAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        return await db.Feeds.AsNoTracking()
            .FirstOrDefaultAsync(feed => feed.Id == id, cancellationToken);
    }

    public async Task<bool> UrlExistsAsync(string url, CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        return await db.Feeds.AnyAsync(
            feed => feed.Url.ToLower() == url.ToLower(),
            cancellationToken);
    }

    public async Task<RssFeed?> FindByUrlAsync(
        string url,
        CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        return await db.Feeds.AsNoTracking().FirstOrDefaultAsync(
            feed => feed.Url.ToLower() == url.ToLower(),
            cancellationToken);
    }

    public async Task AddAsync(RssFeed feed, CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        db.Feeds.Add(feed);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        var deleted = await db.Feeds
            .Where(feed => feed.Id == id)
            .ExecuteDeleteAsync(cancellationToken);
        return deleted > 0;
    }

    public async Task MarkRefreshedAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await MarkRefreshedAsync([id], cancellationToken);
    }

    public async Task MarkRefreshedAsync(
        IEnumerable<Guid> ids,
        CancellationToken cancellationToken = default)
    {
        var feedIds = ids.Distinct().ToList();
        if (feedIds.Count == 0)
            return;

        var refreshedAt = DateTime.UtcNow;
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        await db.Feeds
            .Where(feed => feedIds.Contains(feed.Id))
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(
                    feed => feed.LastRefreshedAt,
                    refreshedAt),
                cancellationToken);
    }
}
