namespace PersonalRssReader.Models;

public class Article
{
    public string? Title { get; set; }
    public string? Link { get; set; }
    public DateTimeOffset? PublishedAt { get; set; }
    public string? Author { get; set; }
    public string? ContentHtml { get; set; }
    public string? Summary { get; set; }
    public string SourceFeedName { get; set; } = "";
    public string SourceFeedUrl { get; set; } = "";
}
