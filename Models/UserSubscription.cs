namespace PersonalRssReader.Models;

public sealed class UserSubscription
{
    public Guid UserId { get; set; }
    public Guid FeedId { get; set; }
    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
    public string? CustomDisplayName { get; set; }

    public ApplicationUser User { get; set; } = null!;
    public RssFeed Feed { get; set; } = null!;
}
