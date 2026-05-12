import nodemailer from "nodemailer";
import dns from "dns";

// FORZAR IPV4
dns.setDefaultResultOrder("ipv4first");

export const transporter = nodemailer.createTransport({
  // service: "gmail", // o usa SMTP real en producción
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
