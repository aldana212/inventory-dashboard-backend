import prisma from "../../config/db.js";
import bcrypt from "bcrypt";

export const getAll = async ({ companyId, id, page, limit }) => {
  const [data, total] = await Promise.all([
    prisma.User.findMany({
      where: {
        companyId,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      omit: {
        password: true, // Esta columna se excluye
      },
      include: {
        role: true,
      },
    }),
    prisma.User.count({
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

export const getStats = async (companyId) => {
  return await prisma.$transaction(async (tx) => {
    // Valor total de usurios
    const total = await tx.User.count({
      where: {
        companyId,
      },
    });

    // Valor total de usurios
    const active = await tx.User.count({
      where: {
        companyId,
        status: "ACTIVE",
      },
    });

    // Valor total de usurios
    const inactive = await tx.User.count({
      where: {
        companyId,
        status: "INACTIVE",
      },
    });

    // Valor total de usurios
    const administrators = await tx.User.count({
      where: {
        companyId,
        role: {
          name: "ADMIN", // Filtra por el campo 'name' dentro de la relación 'role'
        },
      },
    });

    return {
      total,
      active,
      inactive,
      administrators,
    };
  });
};

export const getById = async (id) => {
  return await prisma.User.findUnique({
    where: { id },
    omit: {
      password: true, // Esta columna se excluye
    },
    include: {
      role: true,
    },
  });
};

export const findUser = async (where) => {
  return await prisma.User.findUnique({
    where,
    include: {
      role: true,
    },
  });
};

export const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findRoleByName = async (id) => {
  return prisma.Role.findUnique({
    where: {
      id,
    },
  });
};

export const create = async (data) => {
  return await prisma.User.create({
    data,
  });
};

export const update = async (id, data) => {
  return await prisma.User.update({
    where: { id },
    data,
  });
};

export const updateStatus = async (id, status) => {
  return prisma.User.update({
    where: { id: Number(id) },
    data: { status },
  });
};

export const completePasswordSetup = async (id, password) => {
  return await prisma.User.update({
    where: { id },
    data: {
      password,
    },
  });
};

export const changePassword = async (id, password) => {
  return await prisma.User.update({
    where: { id },
    data: {
      password,
    },
  });
};

export const remove = async (id) => {
  return await prisma.User.delete({
    where: { id },
  });
};
