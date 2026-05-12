import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  // service: "gmail", // o usa SMTP real en producción
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
