import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // o usa SMTP real en producción
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
