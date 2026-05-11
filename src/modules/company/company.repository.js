import prisma from "../../config/db.js";

export const getAll = async () => {
  return await prisma.Company.findMany();
};
export const getById = async (tx = prisma, id) => {
  return await tx.Company.findUnique({
    where: { id },
  });
};

export const findByNit = async (nit) => {
  return prisma.Company.findUnique({
    where: {
      nit,
    },
  });
};

export const findUserByEmail = async (email) => {
  return prisma.User.findUnique({
    where: {
      email,
    },
  });
};

export const findRoleByName = async (name) => {
  return prisma.Role.findUnique({
    where: {
      name,
    },
  });
};

export const createCompanyWithAdmin = async ({ company, admin }) => {
  return prisma.$transaction(async (tx) => {
    // COMPANY
    const newCompany = await tx.Company.create({
      data: company,
    });

    // ADMIN USER
    const newAdmin = await tx.User.create({
      data: {
        ...admin,

        companyId: newCompany.id,
      },
    });

    return {
      company: newCompany,

      admin: newAdmin,
    };
  });
};

export const update = async (id, data) => {
  return await prisma.Company.update({
    where: { id },
    data,
  });
};
export const remove = async (id) => {
  return await prisma.Company.delete({
    where: { id },
  });
};
