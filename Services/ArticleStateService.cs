using Microsoft.EntityFrameworkCore;
using PersonalRssReader.Data;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public sealed class ArticleStateService(IDbContextFactory<ReaderDbContext> contextFactory)
{
    public async Task<List<UserArticleState>> GetAsync(Guid userId, CancellationToken ct = default)
    {
        await using var db = await contextFactory.CreateDbContextAsync(ct);
        return await db.UserArticleStates.AsNoTracking()
            .Where(item => item.UserId == userId)
            .OrderByDescending(item => item.ReadLaterAt ?? item.UpdatedAt)
            .ToListAsync(ct);
    }

    public Task<UserArticleState?> MarkReadAsync(
        Guid userId, ArticleStateRequest request, CancellationToken ct = default)
    {
        request.Value = true;
        return SetAsync(userId, request, setRead: true, ct);
    }

    public Task<UserArticleState?> SetReadLaterAsync(
        Guid userId, ArticleStateRequest request, CancellationToken ct = default) =>
        SetAsync(userId, request, setRead: false, ct);

    private async Task<UserArticleState?> SetAsync(
        Guid userId,
        ArticleStateRequest request,
        bool setRead,
        CancellationToken ct)
    {
        var key = request.ArticleKey.Trim();
        if (key.Length is 0 or > 2048)
            throw new ArgumentException("A valid article key is required.");

        await using var db = await contextFactory.CreateDbContextAsync(ct);
        var state = await db.UserArticleStates.FindAsync([userId, key], ct);
        if (state is null && !request.Value)
            return null;

        state ??= new UserArticleState { UserId = userId, ArticleKey = key };
        if (db.Entry(state).State == EntityState.Detached)
            db.UserArticleStates.Add(state);

        var now = DateTime.UtcNow;
        if (setRead) state.ReadAt = request.Value ? now : null;
        else state.ReadLaterAt = request.Value ? now : null;
        state.UpdatedAt = now;
        CopySnapshot(state, request);

        if (state.ReadAt is null && state.ReadLaterAt is null)
        {
            db.UserArticleStates.Remove(state);
            await db.SaveChangesAsync(ct);
            return null;
        }

        await db.SaveChangesAsync(ct);
        return state;
    }

    private static void CopySnapshot(UserArticleState state, ArticleStateRequest request)
    {
        state.Title = Limit(request.Title, 500);
        state.Link = Limit(request.Link, 2048);
        state.PublishedAt = request.PublishedAt;
        state.SourceFeedId = request.SourceFeedId;
        state.SourceFeedName = Limit(request.SourceFeedName, 300);
        state.SourceFeedUrl = Limit(request.SourceFeedUrl, 2048);
        state.Summary = Limit(request.Summary, 4000);
        state.ImageUrl = Limit(request.ImageUrl, 2048);
    }

    private static string? Limit(string? value, int max) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim()[..Math.Min(value.Trim().Length, max)];
}
