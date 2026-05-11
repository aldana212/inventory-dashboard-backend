import cloudinary from "../../config/cloudinary.js";
import AppError from "../../errors/AppError.js";
import * as repo from "./product.repository.js";

export const getAll = async (filters) => {
  const { companyId, page, limit, search, categoryId, stockStatus, isActive } =
    filters;

  const where = {
    companyId,

    ...(categoryId && {
      categoryId: Number(categoryId),
    }),
    ...(isActive && {
      isActive: isActive === "true",
    }),

    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const response = await repo.findAll(where, page, limit);

  // 👇 aquí calculas stock status en memoria
  const data = response.data.map((product) => {
    const stock = Number(product.currentStock);
    const min = Number(product.minimumStock);

    let status = "in_stock";

    if (stock === 0) status = "out_of_stock";
    else if (stock <= min * 0.5) status = "critical";
    else if (stock <= min) status = "low_stock";
    else status = "in_stock";

    return {
      ...product,
      isActive: product?.isActive ? "active" : "inactive",
      stockStatus: status,
    };
  });

  // 👇 filtras si viene stockStatus
  const filtered = stockStatus
    ? data.filter((p) => p.stockStatus === stockStatus)
    : data;

  // Logica
  return {
    ...response,
    data: filtered,
  };
};

export const getStats = async (companyId) => {
  return await repo.getStats(companyId);
};

export const getById = async (id, companyId) => {
  const response = await repo.findById(undefined, id, companyId);

  const salePrice = Number(response?.salePrice);
  const purchasePrice = Number(response?.purchasePrice);

  const margin = salePrice - purchasePrice;

  const marginPercent = salePrice ? (margin / salePrice) * 100 : 0;

  return {
    ...response,
    margin,
    marginPercent,
  };
};

export const create = async ({ body, files }) => {

  const salePrice = Number(body?.salePrice)
  const purchasePrice = Number(body?.purchasePrice)

  if (salePrice < purchasePrice) {
    throw new AppError(
      "The selling price cannot be lower than the purchase price",
      400,
    );
  }

  const uploadedImages = await Promise.all(
    files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "uploads",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto" },
              { format: "webp" },
            ],
          },
          (error, result) => {
            if (error) {
              return reject(
                new Error(`Error subiendo imagen ${index}: ${error.message}`),
              );
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          },
        );

        stream.end(file.buffer); // 👈 clave: buffer de multer
      });
    }),
  );

  return await repo.create({
    body,
    images: uploadedImages,
  });
};

export const update = async ({ id, body, files }) => {
  const newImages = JSON.parse(body?.newImages || "[]");
  const deletedImages = JSON.parse(body?.deletedImages || "[]");
  const replacedImages = JSON.parse(body?.replacedImages || "[]");

  // Eliminar Img de cloudinary si eliminan o actualizan
  for (const img of [...deletedImages, ...replacedImages]) {
    await cloudinary.uploader.destroy(img.publicId);
  }

  let uploadedImages = [];

  // Subir las Img para Actualizar
  if (files?.length > 0) {
    uploadedImages = await Promise.all(
      files.map((file, index) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads",
              transformation: [
                { width: 800, height: 800, crop: "limit" },
                { quality: "auto" },
                { format: "webp" },
              ],
            },
            (error, result) => {
              if (error) {
                return reject(
                  new Error(`Error subiendo imagen ${index}: ${error.message}`),
                );
              }

              resolve({
                id: replacedImages?.[index]?.id,
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            },
          );

          stream.end(file.buffer); // 👈 clave: buffer de multer
        });
      }),
    );
  }

  //
  return await repo.update(undefined, id, {
    body,
    images: uploadedImages,
    deletedImages: deletedImages,
  });
};

export const updateStatus = async ({ id, isActive }) => {
  return await repo.updateStatus(id, isActive);
};

export const remove = async (id) => {
  return await repo.remove(id);
};
