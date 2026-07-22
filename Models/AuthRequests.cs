namespace PersonalRssReader.Models;

public sealed class RegisterRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}

public sealed class LoginRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public bool RememberMe { get; set; }
}

public sealed class VerifyEmailRequest
{
    public string Email { get; set; } = "";
    public string Code { get; set; } = "";
}

public sealed class ResendVerificationCodeRequest
{
    public string Email { get; set; } = "";
}
