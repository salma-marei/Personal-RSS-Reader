using System.Text.RegularExpressions;

namespace PersonalRssReader.Services;

public static partial class GoogleNewsTopicFeed
{
    private const int MaximumQueryLength = 120;

    public static string CreateUrl(string? query, string? language, string? country)
    {
        var normalizedQuery = query?.Trim();
        if (string.IsNullOrWhiteSpace(normalizedQuery))
            throw new ArgumentException("Enter a news topic to follow.", nameof(query));
        if (normalizedQuery.Length > MaximumQueryLength)
            throw new ArgumentException($"Topics cannot be longer than {MaximumQueryLength} characters.", nameof(query));

        var normalizedLanguage = string.IsNullOrWhiteSpace(language) ? "en" : language.Trim().ToLowerInvariant();
        var normalizedCountry = string.IsNullOrWhiteSpace(country) ? "EG" : country.Trim().ToUpperInvariant();
        if (!LanguageCode().IsMatch(normalizedLanguage))
            throw new ArgumentException("Language must be a two-letter code such as en or ar.", nameof(language));
        if (!CountryCode().IsMatch(normalizedCountry))
            throw new ArgumentException("Country must be a two-letter code such as EG or US.", nameof(country));

        return "https://news.google.com/rss/search" +
               $"?q={Uri.EscapeDataString(normalizedQuery)}" +
               $"&hl={normalizedLanguage}" +
               $"&gl={normalizedCountry}" +
               $"&ceid={normalizedCountry}:{normalizedLanguage}";
    }

    [GeneratedRegex("^[a-z]{2}$", RegexOptions.CultureInvariant)]
    private static partial Regex LanguageCode();

    [GeneratedRegex("^[A-Z]{2}$", RegexOptions.CultureInvariant)]
    private static partial Regex CountryCode();
}
