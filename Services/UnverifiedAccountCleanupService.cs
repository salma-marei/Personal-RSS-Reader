using Microsoft.EntityFrameworkCore;
using PersonalRssReader.Data;

namespace PersonalRssReader.Services;

public sealed class UnverifiedAccountCleanupService(
    IDbContextFactory<ReaderDbContext> dbFactory,
    ILogger<UnverifiedAccountCleanupService> logger) : BackgroundService
{
    private static readonly TimeSpan AccountLifetime = TimeSpan.FromHours(24);
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromHours(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await DeleteExpiredAccountsAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception exception)
            {
                logger.LogError(exception, "Could not clean up expired unverified accounts.");
            }

            await Task.Delay(CleanupInterval, stoppingToken);
        }
    }

    private async Task DeleteExpiredAccountsAsync(CancellationToken cancellationToken)
    {
        var cutoff = DateTime.UtcNow.Subtract(AccountLifetime);
        await using var db = await dbFactory.CreateDbContextAsync(cancellationToken);
        var deleted = await db.Users
            .Where(user => !user.EmailConfirmed && user.CreatedAt <= cutoff)
            .ExecuteDeleteAsync(cancellationToken);

        if (deleted > 0)
            logger.LogInformation("Deleted {AccountCount} expired unverified accounts.", deleted);
    }
}
