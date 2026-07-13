namespace PersonalRssReader.Models;

public sealed class DailyBriefRequest
{
    public DateTimeOffset DayStartUtc { get; set; }
    public DateTimeOffset DayEndUtc { get; set; }
    public string Language { get; set; } = "en";
    public bool Regenerate { get; set; }
}

public sealed class DailyBrief
{
    public string Introduction { get; set; } = "";
    public List<DailyBriefSection> Sections { get; set; } = [];
    public int ArticleCount { get; set; }
    public int FeedCount { get; set; }
    public DateTimeOffset GeneratedAt { get; set; }
}

public sealed class DailyBriefSection
{
    public string Title { get; set; } = "";
    public List<string> Bullets { get; set; } = [];
}
