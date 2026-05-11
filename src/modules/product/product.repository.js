import prisma from "../../config/db.js";
// import * as repoProduct from "../product/product.";

export const findAll = async (where, page, limit) => {
  const [data, total] = await Promise.all([
    prisma.Product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        unit: true,
        productImages: true,
      },
    }),

    prisma.product.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getStats = async (companyId) => {
  return await prisma.$transaction(async (tx) => {
    // Valor total
    const total = await tx.Product.aggregate({
      where: {
        companyId,
      },
      _sum: {
        purchasePrice: true,
      },
    });

    // Total productos
    const totalProducts = await prisma.Product.count({
      where: {
        companyId,
      },
    });

    // Stock bajo
    const lowStock = await prisma.Product.count({
      where: {
        currentStock: {
          lte: prisma.Product.fields.minimumStock,
        },
      },
    });

    // Sin stock
    const outStock = await prisma.Product.count({
      where: {
        currentStock: 0,
      },
    });

    return {
      total: total?._sum?.purchasePrice,
      totalProducts,
      lowStock,
      outStock,
    };
  });
};

export const findById = async (tx = prisma, id, companyId) => {
  return await prisma.Product.findUnique({
    where: { id, companyId },
    include: {
      category: true,
      unit: true,
      productImages: true,
    },
  });
};

export const create = async ({ body, images }) => {
  return await prisma.Product.create({
    data: {
      name: body.name,
      sku: body.sku,
      isActive: Boolean(body.isActive),
      description: body.description,
      companyId: Number(body.companyId),
      categoryId: Number(body.category),
      unitId: Number(body.unitId),
      purchasePrice: body.purchasePrice,
      salePrice: body.salePrice,
      currentStock: body.currentStock,
      minimumStock: body.minimumStock,
      ...(images?.length > 0 && {
        productImages: {
          create: images.map((img, index) => ({
            url: img.secure_url,
            publicId: img.public_id,
            position: index,
            isPrimary: index === 0,
          })),
        },
      }),
    },
    include: {
      productImages: true,
    },
  });
};

export const update = async (tx = prisma, id, data) => {
  return await tx.$transaction(async (txs) => {
    // 🧹 1. Eliminar imágenes
    if (data?.deletedImages?.length > 0) {
      await txs.ProductImage.deleteMany({
        where: {
          id: { in: data.deletedImages.map((img) => img.id) },
          productId: id,
        },
      });
    }

    const { isActive, category, companyId, unitId, ...rest } = data?.body || {};

    // 🧾 2. Actualizar producto
    await txs.Product.update({
      where: { id },
      data: {
        ...rest,
        ...(isActive !== undefined && { isActive: isActive === "true" }),
        ...(category !== undefined && { categoryId: Number(category) }),
        ...(companyId !== undefined && { companyId: Number(companyId) }),
        ...(unitId !== undefined && { unitId: Number(unitId) }),
      },
    });

    // 🔄 3. Crear o actualizar imágenes (SIN confiar en position)
    if (data.images?.length > 0) {
      await Promise.all(
        data.images.map((img, index) => {
          if (img.id) {
            return txs.ProductImage.update({
              where: { id: img.id },
              data: {
                url: img.secure_url,
                publicId: img.public_id,
              },
            });
          }

          return txs.ProductImage.create({
            data: {
              url: img.secure_url,
              publicId: img.public_id,
              position: index,
              productId: id,
            },
          });
        }),
      );

      // 🔥 4. Reordenar TODAS las imágenes (CLAVE)
      const images = await txs.ProductImage.findMany({
        where: { productId: id },
        orderBy: { createdAt: "asc" }, // puedes cambiar criterio
      });

      await Promise.all(
        images.map((img, index) =>
          txs.ProductImage.update({
            where: { id: img.id },
            data: {
              position: index,
              isPrimary: index === 0,
            },
          }),
        ),
      );
    }

    return true;
  });
};

export const updateStatus = async (id, isActive) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data: { isActive },
  });
};

export const remove = async (id) => {
  return await prisma.Product.delete({
    where: { id },
  });
};
