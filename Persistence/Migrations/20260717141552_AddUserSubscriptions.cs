using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalRssReader.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserSubscriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserSubscriptions",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    FeedId = table.Column<Guid>(type: "TEXT", nullable: false),
                    SubscribedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CustomDisplayName = table.Column<string>(type: "TEXT", maxLength: 300, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSubscriptions", x => new { x.UserId, x.FeedId });
                    table.ForeignKey(
                        name: "FK_UserSubscriptions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSubscriptions_Feeds_FeedId",
                        column: x => x.FeedId,
                        principalTable: "Feeds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserSubscriptions_FeedId",
                table: "UserSubscriptions",
                column: "FeedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSubscriptions");
        }
    }
}
