import prisma from "../../config/db.js";

export const getAll = async (where, page, limit) => {
  const [data, total] = await Promise.all([
    prisma.Movement.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        movementDate: true,
        createdAt: true,
        reference: true,
        observation: true,
        // 👇 relación
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            companyId: true,
            status: true,
            brandColor: true,
          },
        },
        transactionDetails: {
          include: {
            product: {
              include: {
                productImages: {
                  where: {
                    position: 0,
                  },
                  select: {
                    productId: true,
                    url: true,
                    position: true,
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.Movement.count({ where }),
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

export const getStats = async (where) => {
  return await prisma.$transaction(async (tx) => {
    // Entrantes
    const input = await prisma.Movement.count({
      where: {
        ...where,
        type: "STOCK_IN",
      },
    });

    // Salientes
    const output = await prisma.Movement.count({
      where: {
        ...where,
        type: "STOCK_OUT",
      },
    });

    return {
      input,
      output,
    };
  });

  return await prisma.Movement.count({
    where,
  });
};

export const getById = async (id) => {
  return await prisma.Movement.findUnique({
    where: { id },
  });
};

export const getProductTransactions = async (id) => {
  return await prisma.Movement.findUnique({
    where: { id },
  });
};

export const getFindFirst = async (tx, companyId) => {
  return await tx.Movement.findFirst({
    where: { companyId },
    orderBy: { sequence: "desc" },
  });
};

export const create = async (tx, data) => {
  return tx.Movement.create({
    data: {
      type: data.type,
      companyId: data.companyId,
      userId: data.userId,
      reference: data.reference,
      sequence: data.sequence,
      observation: data.observation,
    },
  });
};

export const createDetail = async (tx, data) => {
  return tx.TransactionDetail.create({
    data,
  });
};

export const createLog = async (tx, data) => {
  return tx.ActivityLog.create({
    data: {
      userId: data.userId,
      activity: data.activity,
    },
  });
};

export const update = async (id, data) => {
  return await prisma.Movement.update({
    where: { id },
    data,
  });
};
