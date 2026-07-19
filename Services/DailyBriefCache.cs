using System.Collections.Concurrent;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public sealed class DailyBriefCache
{
    private readonly ConcurrentDictionary<string, DailyBrief> _briefs = new();

    public DailyBrief? Get(
        DateTimeOffset dayStartUtc,
        DateTimeOffset dayEndUtc,
        string language,
        string scope = "public")
    {
        _briefs.TryGetValue(Key(dayStartUtc, dayEndUtc, language, scope), out var brief);
        return brief;
    }

    public void Set(
        DateTimeOffset dayStartUtc,
        DateTimeOffset dayEndUtc,
        string language,
        DailyBrief brief,
        string scope = "public")
    {
        _briefs[Key(dayStartUtc, dayEndUtc, language, scope)] = brief;
    }

    private static string Key(DateTimeOffset start, DateTimeOffset end, string language, string scope) =>
        $"{start.UtcDateTime:O}|{end.UtcDateTime:O}|{language}|{scope}";
}
