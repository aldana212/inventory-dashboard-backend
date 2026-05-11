import { z } from "zod";

export const productoSchema = z.object({
  name: z.string().min(3, "Nombre muy corto"),
  sku: z.string().min(2),
  companyId: z.number(),
  categoryId: z.number(),
  unitId: z.number(),
  purchasePrice: z.number().positive(),
  salePrice: z.number().positive(),
});