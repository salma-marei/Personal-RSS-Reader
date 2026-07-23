using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public static class RecentBriefArticleSelector
{
    public const int MinimumArticles = 10;
    private static readonly int[] WindowHours = [6, 12, 24];

    public static RecentBriefSelection Select(
        IEnumerable<Article> articles,
        DateTimeOffset now,
        int? requestedCoverageHours = null)
    {
        var availableArticles = articles.ToList();
        if (requestedCoverageHours is 6 or 12 or 24)
            return SelectWindow(availableArticles, now, requestedCoverageHours.Value);

        foreach (var hours in WindowHours)
        {
            var selection = SelectWindow(availableArticles, now, hours);

            if (selection.Articles.Count >= MinimumArticles || hours == WindowHours[^1])
                return selection;
        }

        return new RecentBriefSelection([], WindowHours[^1]);
    }

    private static RecentBriefSelection SelectWindow(
        IEnumerable<Article> articles,
        DateTimeOffset now,
        int hours)
    {
        var start = now.AddHours(-hours);
        var selected = articles
            .Where(article => article.PublishedAt >= start && article.PublishedAt <= now)
            .ToList();
        return new RecentBriefSelection(selected, hours);
    }
}

public sealed record RecentBriefSelection(List<Article> Articles, int CoverageHours);
