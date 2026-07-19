using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalRssReader.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserArticleStates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserArticleStates",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ArticleKey = table.Column<string>(type: "TEXT", maxLength: 2048, nullable: false),
                    ReadAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ReadLaterAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Link = table.Column<string>(type: "TEXT", maxLength: 2048, nullable: true),
                    PublishedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    SourceFeedId = table.Column<Guid>(type: "TEXT", nullable: false),
                    SourceFeedName = table.Column<string>(type: "TEXT", maxLength: 300, nullable: true),
                    SourceFeedUrl = table.Column<string>(type: "TEXT", maxLength: 2048, nullable: true),
                    Summary = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", maxLength: 2048, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserArticleStates", x => new { x.UserId, x.ArticleKey });
                    table.ForeignKey(
                        name: "FK_UserArticleStates_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserArticleStates_UserId_ReadLaterAt",
                table: "UserArticleStates",
                columns: new[] { "UserId", "ReadLaterAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserArticleStates");
        }
    }
}
