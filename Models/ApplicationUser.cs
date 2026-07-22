using Microsoft.AspNetCore.Identity;

namespace PersonalRssReader.Models;

public sealed class ApplicationUser : IdentityUser<Guid>
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<UserSubscription> Subscriptions { get; set; } = [];
    public ICollection<UserArticleState> ArticleStates { get; set; } = [];
    public EmailVerificationCode? EmailVerificationCode { get; set; }
}
