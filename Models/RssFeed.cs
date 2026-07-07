namespace PersonalRssReader.Models;

public class RssFeed
{
    public Guid Id { get; set; }
    public string Url { get; set; }
    public string Name { get; set; }
    public DateTime AddedAt { get; set; }
}
