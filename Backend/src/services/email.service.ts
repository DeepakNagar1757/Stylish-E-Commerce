// src/services/email.service.ts
import SibApiV3Sdk from "sib-api-v3-sdk";

// Initialize Brevo client lazily
const getBrevoClient = () => {
  const client = SibApiV3Sdk.ApiClient.instance;
  client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY as string;
  client.defaultHeaders = {
    "api-key": process.env.BREVO_API_KEY as string,
  };
  return new SibApiV3Sdk.TransactionalEmailsApi();
};

/**
 * Send OTP email using Brevo
 */
export const sendOtpEmail = async (
  email: string,
  otp: string,
  type: "registration" | "forgot-password" = "registration",
) => {
  try {
    const brevo = getBrevoClient();
    const response = await brevo.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Your App",
        email: process.env.BREVO_SENDER_EMAIL || "noreply@yourapp.com",
      },
      to: [{ email }],
      subject:
        type === "registration"
          ? "Verify Your Email - OTP Code"
          : "Reset Your Password - OTP Code",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #4CAF50;
              margin: 0;
            }
            .otp-box {
              background-color: white;
              border: 2px dashed #4CAF50;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #4CAF50;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .info {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${type === "registration" ? "✉️ Email Verification" : "🔐 Password Reset"}</h1>
            </div>
            
            <p>Hello,</p>
            <p>${type === "registration" ? "Thank you for registering! Please use the OTP code below to verify your email address:" : "You requested to reset your password. Use the OTP code below to proceed:"}</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="info">
              <strong>⏱️ Important:</strong> This code will expire in <strong>5 minutes</strong>.
            </div>
            
            <p>If you didn't request this code, please ignore this email or contact our support team.</p>
            
            <div class="footer">
              <p>This is an automated email, please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} ${process.env.BREVO_SENDER_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Email sent successfully:", response.messageId);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error("❌ Brevo email error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send welcome email after successful registration
 */
export const sendWelcomeEmail = async (email: string, userName?: string) => {
  try {
    const brevo = getBrevoClient();
    await brevo.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Your App",
        email: process.env.BREVO_SENDER_EMAIL || "noreply@yourapp.com",
      },
      to: [{ email }],
      subject: "Welcome to Our Platform! 🎉",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">Welcome${userName ? ", " + userName : ""}! 🎉</h1>
            <p>Your account has been successfully created.</p>
            <p>You can now log in and start exploring our platform.</p>
            <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
              <h3>Getting Started:</h3>
              <ul>
                <li>Complete your profile</li>
                <li>Browse our products</li>
                <li>Start shopping!</li>
              </ul>
            </div>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>${process.env.BREVO_SENDER_NAME}</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Welcome email sent");
  } catch (error) {
    console.error("❌ Welcome email error:", error);
    // Don't throw - welcome email is optional
  }
};
