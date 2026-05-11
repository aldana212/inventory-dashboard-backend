import prisma from "../../config/db.js";

export const getById = async (productId, page, limit) => {
  const [data, total] = await Promise.all([
    prisma.TransactionDetail.findMany({
      where: { productId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { movement: { movementDate: "desc" } },
      include: {
        product: true,
        movement: {
          include: { user: true },
        },
      },
    }),
    prisma.TransactionDetail.count({ where: { productId } }),
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
