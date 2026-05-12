import { BrevoClient } from "@getbrevo/brevo";

export const brevoClient = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});