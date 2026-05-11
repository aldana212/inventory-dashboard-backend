import { transporter } from "../config/mailer.js";
import { resend } from "../config/resend.js";
import { temporaryPasswordTemplate } from "../templates/emails.js";

class EmailService {
  async sendMail({ to, subject, html }) {
    return transporter.sendMail({
      from: `"Inventario App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  }

  async sendTemporaryPassword(to, password) {
    const html = temporaryPasswordTemplate(to, password);

    return this.sendMail({
      to,
      subject: "Acceso a tu cuenta",
      html,
    });
  }
}

export default new EmailService();
