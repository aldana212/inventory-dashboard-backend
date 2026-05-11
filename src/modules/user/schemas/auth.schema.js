import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.email("This is not a valid email."),
    // .transform((val) => val.toLowerCase()),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password cannot exceed 20 characters" }),
  }),
});
