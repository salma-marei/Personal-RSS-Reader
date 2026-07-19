namespace PersonalRssReader.Models;

public class RssFeed
{
    public Guid Id { get; set; }
    public string Url { get; set; } = "";
    public string Name { get; set; } = "";
    public string? WebsiteUrl { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Language { get; set; }
    public string? Category { get; set; }
    public bool IsSuggested { get; set; }
    public DateTime AddedAt { get; set; }
    public DateTime? LastRefreshedAt { get; set; }
    public ICollection<UserSubscription> Subscriptions { get; set; } = [];
}
