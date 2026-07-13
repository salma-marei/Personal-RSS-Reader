using System.Collections.Concurrent;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public sealed class DailyBriefCache
{
    private readonly ConcurrentDictionary<string, DailyBrief> _briefs = new();

    public DailyBrief? Get(DateTimeOffset dayStartUtc, DateTimeOffset dayEndUtc, string language)
    {
        _briefs.TryGetValue(Key(dayStartUtc, dayEndUtc, language), out var brief);
        return brief;
    }

    public void Set(DateTimeOffset dayStartUtc, DateTimeOffset dayEndUtc, string language, DailyBrief brief)
    {
        _briefs[Key(dayStartUtc, dayEndUtc, language)] = brief;
    }

    private static string Key(DateTimeOffset start, DateTimeOffset end, string language) =>
        $"{start.UtcDateTime:O}|{end.UtcDateTime:O}|{language}";
}
