import prisma from "../../config/db.js";

export const getAll = async () => {
  return await prisma.Company.findMany();
};
export const getById = async (tx = prisma, id) => {
  return await tx.Company.findUnique({
    where: { id },
  });
};
export const create = async (data) => {
  return await prisma.Company.create({
    data,
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
