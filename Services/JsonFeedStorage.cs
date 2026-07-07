using System.Text.Json;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public class JsonFeedStorage
{
    private readonly string _filePath;

    public JsonFeedStorage(string filePath)
    {
        _filePath = filePath;
    }

    public async Task<List<RssFeed>> LoadAsync()
    {
        if (!File.Exists(_filePath))
            return [];

        await using var stream = File.OpenRead(_filePath);
        return await JsonSerializer.DeserializeAsync<List<RssFeed>>(stream) ?? [];
    }

    public async Task SaveAsync(List<RssFeed> feeds)
    {
        var directory = Path.GetDirectoryName(_filePath);
        if (directory is not null)
            Directory.CreateDirectory(directory);

        await using var stream = File.Create(_filePath);
        await JsonSerializer.SerializeAsync(stream, feeds, new JsonSerializerOptions { WriteIndented = true });
    }
}
