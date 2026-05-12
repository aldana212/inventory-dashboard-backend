import { brevoClient } from "../config/mailer.js";
import AppError from "../errors/AppError.js";
import { temporaryPasswordTemplate } from "../templates/emails.js";

class EmailService {
  async sendMail({ to, subject, html }) {
    try {
      if (!to) throw new AppError("EMAIL_RECIPIENT_MISSING", 404);

      const result = await brevoClient.transactionalEmails.sendTransacEmail({
        htmlContent: html,
        subject,
        sender: {
          email: process.env.MAIL_USER,
          name: "Inventario App",
        },
        to: [
          {
            email: to,
          },
        ],
      });

      return {
        success: true,
        messageId: result?.messageId || null,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendTemporaryPassword(to, password) {
    const html = temporaryPasswordTemplate(to, password);

    return this.sendMail({
      to,
      subject: "Acceso a tu cuenta",
      html,
    });
  }

  handleError(error) {
    console.error("EMAIL ERROR:", error);

    const status = error?.response?.statusCode;

    if (status === 401) {
      return new AppError("INVALID_BREVO_API_KEY", 401);
    }

    if (status === 402) {
      return new AppError("QUOTA_EXCEEDED", 402);
    }

    if (status === 400) {
      return new AppError("BAD_REQUEST_EMAIL", 400);
    }

    return new AppError(error?.message || "UNKNOWN_EMAIL_ERROR", 500);
  }
}

export default new EmailService();
