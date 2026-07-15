using Microsoft.Extensions.Options;

namespace PersonalRssReader.Services;

public sealed class DailyBriefRateLimitOptions
{
    public const string SectionName = "DailyBriefRateLimit";

    public int CooldownSeconds { get; set; } = 60;
    public int RegenerationsPerIpPerDay { get; set; } = 5;
    public int GlobalGenerationsPerDay { get; set; } = 25;
}

public enum DailyBriefLimitReason
{
    None,
    Cooldown,
    DailyIpLimit,
    GlobalDailyLimit
}

public sealed record DailyBriefLimitResult(
    bool Allowed,
    DailyBriefLimitReason Reason,
    int RemainingRegenerations,
    int DailyRegenerationLimit,
    int RetryAfterSeconds);

public sealed class DailyBriefRateLimitService
{
    private readonly object _gate = new();
    private readonly DailyBriefRateLimitOptions _options;
    private readonly Dictionary<string, IpUsage> _usageByIp = new(StringComparer.Ordinal);
    private DateOnly _currentUtcDay = DateOnly.FromDateTime(DateTime.UtcNow);
    private int _globalGenerationCount;

    public DailyBriefRateLimitService(IOptions<DailyBriefRateLimitOptions> options)
    {
        _options = options.Value;
        _options.CooldownSeconds = Math.Max(1, _options.CooldownSeconds);
        _options.RegenerationsPerIpPerDay = Math.Max(1, _options.RegenerationsPerIpPerDay);
        _options.GlobalGenerationsPerDay = Math.Max(1, _options.GlobalGenerationsPerDay);
    }

    // Serializing DeepSeek calls prevents simultaneous requests from multiplying AI cost.
    public SemaphoreSlim GenerationLock { get; } = new(1, 1);

    public DailyBriefLimitResult GetStatus(string ipAddress)
    {
        lock (_gate)
        {
            var now = DateTimeOffset.UtcNow;
            ResetForNewUtcDay(now);
            var usage = GetIpUsage(ipAddress);

            if (usage.RegenerationCount >= _options.RegenerationsPerIpPerDay)
                return RejectedResult(usage, DailyBriefLimitReason.DailyIpLimit, SecondsUntilNextUtcDay(now));

            if (usage.LastRegenerationAt is not null)
            {
                var availableAt = usage.LastRegenerationAt.Value.AddSeconds(_options.CooldownSeconds);
                if (availableAt > now)
                {
                    var wait = (int)Math.Ceiling((availableAt - now).TotalSeconds);
                    return RejectedResult(usage, DailyBriefLimitReason.Cooldown, wait);
                }
            }

            if (_globalGenerationCount >= _options.GlobalGenerationsPerDay)
                return RejectedResult(usage, DailyBriefLimitReason.GlobalDailyLimit, SecondsUntilNextUtcDay(now));

            return AllowedResult(usage);
        }
    }

    public DailyBriefLimitResult TryAcquireInitialGeneration(string ipAddress)
    {
        lock (_gate)
        {
            var now = DateTimeOffset.UtcNow;
            ResetForNewUtcDay(now);
            var usage = GetIpUsage(ipAddress);

            if (_globalGenerationCount >= _options.GlobalGenerationsPerDay)
                return RejectedResult(usage, DailyBriefLimitReason.GlobalDailyLimit, SecondsUntilNextUtcDay(now));

            _globalGenerationCount++;
            return AllowedResult(usage);
        }
    }

    public DailyBriefLimitResult TryAcquireRegeneration(string ipAddress)
    {
        lock (_gate)
        {
            var now = DateTimeOffset.UtcNow;
            ResetForNewUtcDay(now);
            var usage = GetIpUsage(ipAddress);

            if (usage.RegenerationCount >= _options.RegenerationsPerIpPerDay)
                return RejectedResult(usage, DailyBriefLimitReason.DailyIpLimit, SecondsUntilNextUtcDay(now));

            if (usage.LastRegenerationAt is not null)
            {
                var availableAt = usage.LastRegenerationAt.Value.AddSeconds(_options.CooldownSeconds);
                if (availableAt > now)
                {
                    var wait = (int)Math.Ceiling((availableAt - now).TotalSeconds);
                    return RejectedResult(usage, DailyBriefLimitReason.Cooldown, wait);
                }
            }

            if (_globalGenerationCount >= _options.GlobalGenerationsPerDay)
                return RejectedResult(usage, DailyBriefLimitReason.GlobalDailyLimit, SecondsUntilNextUtcDay(now));

            usage.RegenerationCount++;
            usage.LastRegenerationAt = now;
            _globalGenerationCount++;
            return AllowedResult(usage, _options.CooldownSeconds);
        }
    }

    private IpUsage GetIpUsage(string ipAddress)
    {
        if (!_usageByIp.TryGetValue(ipAddress, out var usage))
        {
            usage = new IpUsage();
            _usageByIp[ipAddress] = usage;
        }

        return usage;
    }

    private void ResetForNewUtcDay(DateTimeOffset now)
    {
        var today = DateOnly.FromDateTime(now.UtcDateTime);
        if (today == _currentUtcDay) return;

        _currentUtcDay = today;
        _globalGenerationCount = 0;
        _usageByIp.Clear();
    }

    private DailyBriefLimitResult AllowedResult(IpUsage usage, int retryAfterSeconds = 0) => new(
        true,
        DailyBriefLimitReason.None,
        Math.Max(0, _options.RegenerationsPerIpPerDay - usage.RegenerationCount),
        _options.RegenerationsPerIpPerDay,
        retryAfterSeconds);

    private DailyBriefLimitResult RejectedResult(
        IpUsage usage,
        DailyBriefLimitReason reason,
        int retryAfterSeconds) => new(
            false,
            reason,
            Math.Max(0, _options.RegenerationsPerIpPerDay - usage.RegenerationCount),
            _options.RegenerationsPerIpPerDay,
            Math.Max(1, retryAfterSeconds));

    private static int SecondsUntilNextUtcDay(DateTimeOffset now)
    {
        var nextDay = new DateTimeOffset(now.UtcDateTime.Date.AddDays(1), TimeSpan.Zero);
        return (int)Math.Ceiling((nextDay - now).TotalSeconds);
    }

    private sealed class IpUsage
    {
        public int RegenerationCount { get; set; }
        public DateTimeOffset? LastRegenerationAt { get; set; }
    }
}
