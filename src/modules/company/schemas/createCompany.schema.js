import z from "zod";
import { passwordSchema } from "../../../shared/schemas/password.schema.js";

export const createCompanySchema = z.object({
  body: z.object({
    companyName: z.string().min(2),
    nit: z.string().min(5),
    admin: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.email(),
       password: passwordSchema,
    }),
  }),
});
