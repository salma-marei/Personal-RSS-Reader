namespace PersonalRssReader.Models;

public sealed class EmailVerificationCode
{
    public Guid UserId { get; set; }
    public string CodeHash { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
    public DateTime SentAt { get; set; }
    public int FailedAttempts { get; set; }
    public ApplicationUser User { get; set; } = null!;
}
