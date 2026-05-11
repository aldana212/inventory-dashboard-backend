import prisma from "../../config/db.js";

export const getAll = async (companyId, page, limit) => {
  const [data, total] = await Promise.all([
    prisma.Category.findMany({
      where: {
        companyId,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            products: true, // 👈 cuenta productos relacionados
          },
        },
      },
    }),

    prisma.Category.count({
      where: {
        companyId,
      },
    }),
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

// total, active, inactive, empty
export const getStats = async (companyId) => {
  return await prisma.$transaction(async (tx) => {
    // total
    const total = await prisma.Category.count({
      where: {
        companyId,
      },
    });

    // active
    const active = await prisma.Category.count({
      where: {
        companyId,
        isActive: true,
      },
    });

    // inactive
    const inactive = await prisma.Category.count({
      where: {
        companyId,
        isActive: false,
      },
    });

    // empty
    const empty = await prisma.Category.count({
      where: {
        companyId,
        products: {
          none: {},
        },
      },
    });

    return {
      total,
      active,
      inactive,
      empty,
    };
  });
};

export const getById = async (id) => {
  return await prisma.Category.findUnique({
    where: { id },
  });
};

export const create = async (data) => {
  return await prisma.Category.create({
    data,
  });
};

export const update = async (id, companyId, data) => {
  return await prisma.Category.update({
    where: { id, companyId },
    data,
  });
};

export const updateStatus = async (id, isActive) => {
  return prisma.Category.update({
    where: { id: Number(id) },
    data: { isActive },
  });
};

export const remove = async (id) => {
  return await prisma.Category.delete({
    where: { id },
  });
};
