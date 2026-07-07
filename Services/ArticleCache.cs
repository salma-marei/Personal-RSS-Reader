using System.Collections.Concurrent;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public class ArticleCache
{
    private readonly ConcurrentDictionary<Guid, List<Article>> _cache = new();

    public List<Article>? Get(Guid feedId) =>
        _cache.TryGetValue(feedId, out var articles) ? articles : null;

    public void Set(Guid feedId, List<Article> articles) => _cache[feedId] = articles;

    public void Remove(Guid feedId) => _cache.TryRemove(feedId, out _);
}
