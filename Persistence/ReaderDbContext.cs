using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PersonalRssReader.Models;

namespace PersonalRssReader.Data;

public sealed class ReaderDbContext(DbContextOptions<ReaderDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<RssFeed> Feeds => Set<RssFeed>();
    public DbSet<UserSubscription> UserSubscriptions => Set<UserSubscription>();
    public DbSet<UserArticleState> UserArticleStates => Set<UserArticleState>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var feed = modelBuilder.Entity<RssFeed>();

        feed.ToTable("Feeds");
        feed.HasKey(item => item.Id);
        feed.Property(item => item.Url).IsRequired().HasMaxLength(2048);
        feed.Property(item => item.Name).IsRequired().HasMaxLength(300);
        feed.Property(item => item.WebsiteUrl).HasMaxLength(2048);
        feed.Property(item => item.Description).HasMaxLength(2000);
        feed.Property(item => item.ImageUrl).HasMaxLength(2048);
        feed.Property(item => item.Language).HasMaxLength(12);
        feed.Property(item => item.Category).HasMaxLength(100);
        feed.HasIndex(item => item.Url).IsUnique();
        feed.HasIndex(item => new { item.IsSuggested, item.Category, item.Language });

        var subscription = modelBuilder.Entity<UserSubscription>();
        subscription.ToTable("UserSubscriptions");
        subscription.HasKey(item => new { item.UserId, item.FeedId });
        subscription.Property(item => item.CustomDisplayName).HasMaxLength(300);
        subscription.HasOne(item => item.User)
            .WithMany(user => user.Subscriptions)
            .HasForeignKey(item => item.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        subscription.HasOne(item => item.Feed)
            .WithMany(feedItem => feedItem.Subscriptions)
            .HasForeignKey(item => item.FeedId)
            .OnDelete(DeleteBehavior.Cascade);
        subscription.HasIndex(item => item.FeedId);

        var articleState = modelBuilder.Entity<UserArticleState>();
        articleState.ToTable("UserArticleStates");
        articleState.HasKey(item => new { item.UserId, item.ArticleKey });
        articleState.Property(item => item.ArticleKey).HasMaxLength(2048);
        articleState.Property(item => item.Title).HasMaxLength(500);
        articleState.Property(item => item.Link).HasMaxLength(2048);
        articleState.Property(item => item.SourceFeedName).HasMaxLength(300);
        articleState.Property(item => item.SourceFeedUrl).HasMaxLength(2048);
        articleState.Property(item => item.Summary).HasMaxLength(4000);
        articleState.Property(item => item.ImageUrl).HasMaxLength(2048);
        articleState.HasOne(item => item.User)
            .WithMany(user => user.ArticleStates)
            .HasForeignKey(item => item.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        articleState.HasIndex(item => new { item.UserId, item.ReadLaterAt });
    }
}
