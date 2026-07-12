using PersonalRssReader.Models;
using Rocket.Syndication;
using System.Text.RegularExpressions;

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
            var articleUrl = item.Link?.ToString();
            var contentHtml = item.Content?.Html;
            articles.Add(new Article
            {
                Title = item.Title,
                Link = articleUrl,
                PublishedAt = item.PublishedDate,
                Author = item.Authors.FirstOrDefault()?.Name,
                ContentHtml = _sanitizer.Sanitize(contentHtml),
                Summary = item.Content?.PlainText,
                ImageUrl = GetImageUrl(item, contentHtml, articleUrl, feed.Url),
                SourceFeedId = feed.Id,
                SourceFeedName = feed.Name,
                SourceFeedUrl = feed.Url
            });
        }

        return articles;
    }

    private static string? GetImageUrl(
        Rocket.Syndication.Models.FeedItem item,
        string? contentHtml,
        string? articleUrl,
        string feedUrl)
    {
        var baseUri = GetHttpUri(articleUrl) ?? GetHttpUri(feedUrl);

        var candidates = new List<Uri?>
        {
            item.Media?.ThumbnailUrl,
            item.Media?.Url
        };
        candidates.AddRange(item.Enclosures
            .Where(e => e.MimeType?.StartsWith("image/", StringComparison.OrdinalIgnoreCase) == true)
            .Select(e => e.Url));

        foreach (var candidate in candidates)
        {
            var resolved = ResolveHttpUrl(candidate?.ToString(), baseUri);
            if (resolved is not null)
                return resolved;
        }

        if (string.IsNullOrWhiteSpace(contentHtml))
            return null;

        var images = Regex.Matches(
            contentHtml,
            "<img\\b[^>]*?\\bsrc\\s*=\\s*['\\\"](?<url>[^'\\\"]+)['\\\"]",
            RegexOptions.IgnoreCase);
        foreach (Match image in images)
        {
            var resolved = ResolveHttpUrl(image.Groups["url"].Value, baseUri);
            if (resolved is not null)
                return resolved;
        }

        return null;
    }

    private static Uri? GetHttpUri(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) && IsHttp(uri) ? uri : null;

    private static string? ResolveHttpUrl(string? value, Uri? baseUri)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        value = System.Net.WebUtility.HtmlDecode(value.Trim());
        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) &&
            (baseUri is null || !Uri.TryCreate(baseUri, value, out uri)))
            return null;

        return IsHttp(uri) ? uri.AbsoluteUri : null;
    }

    private static bool IsHttp(Uri uri) =>
        uri.Scheme.Equals(Uri.UriSchemeHttp, StringComparison.OrdinalIgnoreCase) ||
        uri.Scheme.Equals(Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase);
}

public class FeedFetchException : Exception
{
    public FeedFetchException(string message) : base(message) { }
}
