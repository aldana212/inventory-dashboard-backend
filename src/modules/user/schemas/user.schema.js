import z from "zod";

export const createUserSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre es demasiado largo"),

    lastName: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido es demasiado largo"),

    email: z.string().email("Email inválido"),
    //   .transform((val) => val.toLowerCase()),
    // status: z.string().min(1),

    rol: z
      .number({
        required_error: "El rol es requerido",
        invalid_type_error: "El rol debe ser un número",
      })
      .int("El rol debe ser un entero")
      .min(1, "Rol inválido")
      .max(4, "Rol inválido"),

    brandColor: z.string(),
  }),
});
