using PersonalRssReader.Models;
using Rocket.Syndication;

namespace PersonalRssReader.Services;

public class FeedArticleService
{
    private readonly ISyndicationClient _syndication;
    private readonly HtmlContentSanitizer _sanitizer;

    public FeedArticleService(ISyndicationClient syndication, HtmlContentSanitizer sanitizer)
    {
        _syndication = syndication;
        _sanitizer = sanitizer;
    }

    public async Task<List<Article>> GetArticlesAsync(RssFeed feed, CancellationToken ct)
    {
        var result = await _syndication.GetFeedAsync(feed.Url, ct);
        if (!result.IsSuccess)
            throw new FeedFetchException(result.Error?.Message ?? "Unknown error fetching feed.");

        var articles = new List<Article>();
        foreach (var item in result.Feed!.Items)
        {
            articles.Add(new Article
            {
                Title = item.Title,
                Link = item.Link?.ToString(),
                PublishedAt = item.PublishedDate,
                Author = item.Authors.FirstOrDefault()?.Name,
                ContentHtml = _sanitizer.Sanitize(item.Content?.Html),
                Summary = item.Content?.PlainText,
                SourceFeedName = feed.Name,
                SourceFeedUrl = feed.Url
            });
        }

        return articles;
    }
}

public class FeedFetchException : Exception
{
    public FeedFetchException(string message) : base(message) { }
}
