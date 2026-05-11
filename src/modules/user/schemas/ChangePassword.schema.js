import z from "zod";

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6, "La contraseña actual es inválida"),

    newPassword: z
      .string()
      .min(8, "Debe tener mínimo 8 caracteres")
      .max(64, "Máximo 64 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo"),
  }),
});

export const passwordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6, "La contraseña actual es inválida"),
    newPassword: z
      .string()
      .min(8, "Debe tener mínimo 8 caracteres")
      .max(64, "Máximo 64 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo"),
  }),
});
