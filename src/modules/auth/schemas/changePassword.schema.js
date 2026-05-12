import z from "zod";
import { passwordSchema } from "../../../shared/schemas/password.schema.js";

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string(),
     newPassword: passwordSchema,
  }),
});
