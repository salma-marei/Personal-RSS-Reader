using Microsoft.EntityFrameworkCore;
using PersonalRssReader.Data;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public sealed class SubscriptionService(IDbContextFactory<ReaderDbContext> contextFactory)
{
    public async Task<List<UserSubscription>> GetAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        return await db.UserSubscriptions
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .OrderBy(item => item.SubscribedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<SubscriptionResult> SubscribeAsync(
        Guid userId,
        Guid feedId,
        CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        if (!await db.Feeds.AnyAsync(feed => feed.Id == feedId, cancellationToken))
            return SubscriptionResult.FeedNotFound;

        if (await db.UserSubscriptions.AnyAsync(
                item => item.UserId == userId && item.FeedId == feedId,
                cancellationToken))
            return SubscriptionResult.AlreadySubscribed;

        db.UserSubscriptions.Add(new UserSubscription
        {
            UserId = userId,
            FeedId = feedId,
            SubscribedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync(cancellationToken);
        return SubscriptionResult.Created;
    }

    public async Task<bool> UnsubscribeAsync(
        Guid userId,
        Guid feedId,
        CancellationToken cancellationToken = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(cancellationToken);
        var deleted = await db.UserSubscriptions
            .Where(item => item.UserId == userId && item.FeedId == feedId)
            .ExecuteDeleteAsync(cancellationToken);
        return deleted > 0;
    }
}

public enum SubscriptionResult
{
    Created,
    AlreadySubscribed,
    FeedNotFound
}
