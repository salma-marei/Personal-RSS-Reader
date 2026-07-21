namespace PersonalRssReader.Models;

public sealed class CreateTopicFeedRequest
{
    public string Query { get; set; } = "";
    public string Language { get; set; } = "en";
    public string Country { get; set; } = "EG";
}
