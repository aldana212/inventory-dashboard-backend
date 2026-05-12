import { transporter } from "../config/mailer.js";
import { temporaryPasswordTemplate } from "../templates/emails.js";

class EmailService {
  async sendMail({ to, subject, html, text }) {
    try {
      if (!to) throw new AppError("EMAIL_RECIPIENT_MISSING", 404);

      const result = await transporter.sendMail({
        from: `"Inventario App" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
        text,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
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
  
  getErrorMessage(error) {
    // Gmail / Nodemailer common errors mapping
    if (error?.code === "EAUTH") {
      return "AUTH_ERROR_INVALID_CREDENTIALS";
    }

    if (error?.code === "ESOCKET") {
      return "NETWORK_ERROR_CONNECTION_FAILED";
    }

    if (error?.responseCode === 550) {
      return "EMAIL_REJECTED_BY_PROVIDER";
    }

    if (error?.message?.includes("self email")) {
      return "TEST_MODE_ONLY_SELF_EMAIL_ALLOWED";
    }

    return error?.message || "UNKNOWN_EMAIL_ERROR";
  }
}

export default new EmailService();
