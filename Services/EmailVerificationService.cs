using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PersonalRssReader.Data;
using PersonalRssReader.Models;

namespace PersonalRssReader.Services;

public enum VerificationResult { Succeeded, Invalid, Expired, TooManyAttempts }

public sealed record SendVerificationResult(bool Sent, int RetryAfterSeconds);

public sealed class EmailVerificationService(
    ReaderDbContext db,
    IPasswordHasher<EmailVerificationCode> hasher,
    IVerificationEmailSender emailSender,
    UserManager<ApplicationUser> userManager)
{
    private static readonly TimeSpan CodeLifetime = TimeSpan.FromMinutes(10);
    private static readonly TimeSpan ResendCooldown = TimeSpan.FromSeconds(60);
    private const int MaximumAttempts = 5;

    public bool IsConfigured => emailSender.IsConfigured;

    public async Task<SendVerificationResult> SendAsync(
        ApplicationUser user,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var record = await db.EmailVerificationCodes.FindAsync([user.Id], cancellationToken);
        if (record is not null && record.SentAt.Add(ResendCooldown) > now)
        {
            var retryAfter = (int)Math.Ceiling((record.SentAt.Add(ResendCooldown) - now).TotalSeconds);
            return new SendVerificationResult(false, Math.Max(1, retryAfter));
        }

        var code = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
        record ??= new EmailVerificationCode { UserId = user.Id };
        record.CodeHash = hasher.HashPassword(record, code);
        record.ExpiresAt = now.Add(CodeLifetime);
        record.SentAt = now;
        record.FailedAttempts = 0;
        if (db.Entry(record).State == EntityState.Detached)
            db.EmailVerificationCodes.Add(record);
        await db.SaveChangesAsync(cancellationToken);

        try
        {
            await emailSender.SendCodeAsync(user.Email!, code, cancellationToken);
        }
        catch
        {
            db.EmailVerificationCodes.Remove(record);
            await db.SaveChangesAsync(cancellationToken);
            throw;
        }

        return new SendVerificationResult(true, (int)ResendCooldown.TotalSeconds);
    }

    public async Task<VerificationResult> VerifyAsync(
        ApplicationUser user,
        string code,
        CancellationToken cancellationToken = default)
    {
        var record = await db.EmailVerificationCodes.FindAsync([user.Id], cancellationToken);
        if (record is null || record.ExpiresAt <= DateTime.UtcNow)
            return VerificationResult.Expired;
        if (record.FailedAttempts >= MaximumAttempts)
            return VerificationResult.TooManyAttempts;

        var result = hasher.VerifyHashedPassword(record, record.CodeHash, code);
        if (result == PasswordVerificationResult.Failed)
        {
            record.FailedAttempts++;
            await db.SaveChangesAsync(cancellationToken);
            return record.FailedAttempts >= MaximumAttempts
                ? VerificationResult.TooManyAttempts
                : VerificationResult.Invalid;
        }

        user.EmailConfirmed = true;
        var update = await userManager.UpdateAsync(user);
        if (!update.Succeeded)
            throw new InvalidOperationException("The verified account could not be updated.");
        db.EmailVerificationCodes.Remove(record);
        await db.SaveChangesAsync(cancellationToken);
        return VerificationResult.Succeeded;
    }
}
