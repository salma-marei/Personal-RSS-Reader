using Ganss.Xss;

namespace PersonalRssReader.Services;

public class HtmlContentSanitizer
{
    private readonly HtmlSanitizer _sanitizer = new();

    public string? Sanitize(string? html) =>
        string.IsNullOrEmpty(html) ? html : _sanitizer.Sanitize(html);
}
