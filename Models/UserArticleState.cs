namespace PersonalRssReader.Models;

public sealed class UserArticleState
{
    public Guid UserId { get; set; }
    public string ArticleKey { get; set; } = "";
    public DateTime? ReadAt { get; set; }
    public DateTime? ReadLaterAt { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? Title { get; set; }
    public string? Link { get; set; }
    public DateTimeOffset? PublishedAt { get; set; }
    public Guid SourceFeedId { get; set; }
    public string? SourceFeedName { get; set; }
    public string? SourceFeedUrl { get; set; }
    public string? Summary { get; set; }
    public string? ImageUrl { get; set; }
    public ApplicationUser User { get; set; } = null!;
}

public sealed class ArticleStateRequest
{
    public string ArticleKey { get; set; } = "";
    public bool Value { get; set; }
    public string? Title { get; set; }
    public string? Link { get; set; }
    public DateTimeOffset? PublishedAt { get; set; }
    public Guid SourceFeedId { get; set; }
    public string? SourceFeedName { get; set; }
    public string? SourceFeedUrl { get; set; }
    public string? Summary { get; set; }
    public string? ImageUrl { get; set; }
}
