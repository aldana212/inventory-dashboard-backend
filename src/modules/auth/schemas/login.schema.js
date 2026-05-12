import z from "zod";
import { passwordSchema } from "../../../shared/schemas/password.schema.js";

export const loginSchema = z.object({
  body: z.object({
    email: z.email("This is not a valid email."),
    // .transform((val) => val.toLowerCase()),

    password: passwordSchema,
  }),
});
