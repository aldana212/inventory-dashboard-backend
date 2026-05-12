import { transporter } from "../config/mailer.js";
import AppError from "../errors/AppError.js";
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
    // Si ya es AppError, lo dejamos pasar
    if (error instanceof AppError) {
      return error;
    }

    if (error?.code === "EAUTH") {
      return new AppError("AUTH_ERROR_INVALID_CREDENTIALS", 401);
    }

    if (error?.code === "ESOCKET") {
      return new AppError("NETWORK_ERROR_CONNECTION_FAILED", 503);
    }

    if (error?.responseCode === 550) {
      return new AppError("EMAIL_REJECTED_BY_PROVIDER", 400);
    }

    if (error?.message?.includes("self email")) {
      return new AppError("TEST_MODE_ONLY_SELF_EMAIL_ALLOWED", 403);
    }

    return new AppError("UNKNOWN_EMAIL_ERROR", 500);
  }
}

export default new EmailService();
