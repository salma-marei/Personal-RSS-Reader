using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalRssReader.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialFeedDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Feeds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Url = table.Column<string>(type: "TEXT", maxLength: 2048, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 300, nullable: false),
                    WebsiteUrl = table.Column<string>(type: "TEXT", maxLength: 2048, nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", maxLength: 2048, nullable: true),
                    Language = table.Column<string>(type: "TEXT", maxLength: 12, nullable: true),
                    Category = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    IsSuggested = table.Column<bool>(type: "INTEGER", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastRefreshedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feeds", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Feeds_IsSuggested_Category_Language",
                table: "Feeds",
                columns: new[] { "IsSuggested", "Category", "Language" });

            migrationBuilder.CreateIndex(
                name: "IX_Feeds_Url",
                table: "Feeds",
                column: "Url",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feeds");
        }
    }
}
