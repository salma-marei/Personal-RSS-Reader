using System.Net;
using System.Net.Sockets;
using PersonalRssReader.Models;
using Rocket.Syndication;

namespace PersonalRssReader.Services;

public sealed class CustomFeedService(
    ISyndicationClient syndication,
    FeedStorage feeds,
    SubscriptionService subscriptions,
    IConfiguration configuration)
{
    public async Task<CustomFeedResult> AddAndSubscribeAsync(
        Guid userId,
        string? suppliedUrl,
        CancellationToken cancellationToken = default)
    {
        if (!Uri.TryCreate(suppliedUrl?.Trim(), UriKind.Absolute, out var uri) ||
            (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps) ||
            !string.IsNullOrEmpty(uri.UserInfo))
            return CustomFeedResult.Invalid("Enter a valid public HTTP or HTTPS feed URL.");

        if (!configuration.GetValue("FeedSecurity:AllowPrivateNetworks", false) &&
            !await IsPublicDestinationAsync(uri, cancellationToken))
            return CustomFeedResult.Invalid("Feed URLs cannot point to this device or a private network.");

        var normalizedUrl = uri.AbsoluteUri;
        var existing = await feeds.FindByUrlAsync(normalizedUrl, cancellationToken);
        if (existing is not null)
        {
            var subscription = await subscriptions.SubscribeAsync(userId, existing.Id, cancellationToken);
            return new CustomFeedResult(existing, false, subscription == SubscriptionResult.AlreadySubscribed, null);
        }

        var fetched = await syndication.GetFeedAsync(normalizedUrl, cancellationToken);
        if (!fetched.IsSuccess || fetched.Feed is null)
            return CustomFeedResult.Invalid(
                $"Not a valid RSS/Atom feed: {fetched.Error?.Message ?? "The feed could not be read."}");

        var discoveredName = ReadStringProperty(fetched.Feed, "Title");
        var feed = new RssFeed
        {
            Id = Guid.NewGuid(),
            Url = normalizedUrl,
            Name = string.IsNullOrWhiteSpace(discoveredName) ? uri.Host : discoveredName.Trim(),
            WebsiteUrl = ReadUriProperty(fetched.Feed, "Link") ?? ReadUriProperty(fetched.Feed, "WebsiteUrl"),
            Description = ReadStringProperty(fetched.Feed, "Description"),
            Language = ReadStringProperty(fetched.Feed, "Language"),
            IsSuggested = false,
            AddedAt = DateTime.UtcNow
        };

        await feeds.AddAsync(feed, cancellationToken);
        await subscriptions.SubscribeAsync(userId, feed.Id, cancellationToken);
        return new CustomFeedResult(feed, true, false, null);
    }

    private static string? ReadStringProperty(object value, string name) =>
        value.GetType().GetProperty(name)?.GetValue(value)?.ToString();

    private static string? ReadUriProperty(object value, string name)
    {
        var candidate = value.GetType().GetProperty(name)?.GetValue(value)?.ToString();
        return Uri.TryCreate(candidate, UriKind.Absolute, out var uri) &&
               (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps)
            ? uri.AbsoluteUri
            : null;
    }

    private static async Task<bool> IsPublicDestinationAsync(Uri uri, CancellationToken cancellationToken)
    {
        if (uri.IsLoopback || uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase))
            return false;

        try
        {
            var addresses = await Dns.GetHostAddressesAsync(uri.DnsSafeHost, cancellationToken);
            return addresses.Length > 0 && addresses.All(IsPublicAddress);
        }
        catch (SocketException)
        {
            return false;
        }
    }

    private static bool IsPublicAddress(IPAddress address)
    {
        if (address.IsIPv4MappedToIPv6) address = address.MapToIPv4();
        if (IPAddress.IsLoopback(address) || address.Equals(IPAddress.Any) ||
            address.Equals(IPAddress.IPv6Any) || address.Equals(IPAddress.None))
            return false;

        var bytes = address.GetAddressBytes();
        if (address.AddressFamily == AddressFamily.InterNetwork)
            return !(bytes[0] == 10 || bytes[0] == 127 || bytes[0] == 0 ||
                     bytes[0] == 169 && bytes[1] == 254 ||
                     bytes[0] == 172 && bytes[1] is >= 16 and <= 31 ||
                     bytes[0] == 192 && bytes[1] == 168 ||
                     bytes[0] >= 224);

        return !address.IsIPv6LinkLocal && !address.IsIPv6SiteLocal && !address.IsIPv6Multicast &&
               (bytes[0] & 0xfe) != 0xfc;
    }
}

public sealed record CustomFeedResult(
    RssFeed? Feed,
    bool FeedCreated,
    bool AlreadySubscribed,
    string? Error)
{
    public static CustomFeedResult Invalid(string error) => new(null, false, false, error);
}
