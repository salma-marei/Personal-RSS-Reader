using System.Net;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace PersonalRssReader.Services;

public sealed class SendGridOptions
{
    public const string SectionName = "SendGrid";
    public string ApiKey { get; set; } = "";
    public string FromEmail { get; set; } = "";
    public string FromName { get; set; } = "Personal RSS Reader";
}

public interface IVerificationEmailSender
{
    bool IsConfigured { get; }
    Task SendCodeAsync(string email, string code, CancellationToken cancellationToken);
}

public sealed class VerificationEmailSender(
    IOptions<SendGridOptions> options,
    ILogger<VerificationEmailSender> logger) : IVerificationEmailSender
{
    private readonly SendGridOptions _options = options.Value;

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_options.ApiKey) &&
        !string.IsNullOrWhiteSpace(_options.FromEmail);

    public async Task SendCodeAsync(string email, string code, CancellationToken cancellationToken)
    {
        if (!IsConfigured)
            throw new InvalidOperationException("Verification email delivery is not configured.");

        var safeCode = WebUtility.HtmlEncode(code);
        var message = new SendGridMessage
        {
            From = new EmailAddress(_options.FromEmail, _options.FromName),
            Subject = "Verify your email for Personal RSS Reader",
            PlainTextContent = $"""
                Welcome to Personal RSS Reader

                Use this verification code to finish creating your account:

                {code}

                This code expires in 10 minutes and can only be used once.

                If you did not create a Personal RSS Reader account, you can safely ignore this email.
                """,
            HtmlContent = $"""
                <!doctype html>
                <html lang="en">
                <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#17212b">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:32px 16px">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
                          <tr>
                            <td style="padding:24px 30px;background:#111827;color:#ffffff;font-size:18px;font-weight:700">
                              <span style="display:inline-block;padding:4px 6px;border-radius:6px;background:#5eead4;color:#0f172a;font-size:11px;line-height:1;font-weight:800;vertical-align:2px">PR</span>&nbsp; Personal RSS Reader
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:32px 30px">
                              <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#111827">Verify your email</h1>
                              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6">Use the code below to finish creating your account.</p>
                              <div style="margin:0 0 24px;padding:18px 20px;border-radius:10px;background:#ecfeff;color:#0f766e;font-size:30px;font-weight:700;letter-spacing:8px;text-align:center">{safeCode}</div>
                              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6">This code expires in <strong>10 minutes</strong> and can only be used once.</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:20px 30px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6">
                              If you did not create a Personal RSS Reader account, you can safely ignore this email.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """
        };
        message.AddTo(new EmailAddress(email));
        message.SetClickTracking(false, false);

        var response = await new SendGridClient(_options.ApiKey)
            .SendEmailAsync(message, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            logger.LogError("SendGrid rejected verification email with status {StatusCode}.", response.StatusCode);
            throw new InvalidOperationException("Verification email could not be sent.");
        }
    }
}
