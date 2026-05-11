import prisma from "../../config/db.js";

export const getAll = async () => {
  return await prisma.MeasurementUnit.findMany();
};
export const getById = async (id) => {
  return await prisma.MeasurementUnit.findUnique({
    where: { id },
  });
};
export const create = async (data) => {
  return await prisma.MeasurementUnit.create({
    data,
  });
};
export const update = async (id, data) => {
  return await prisma.MeasurementUnit.update({
    where: { id },
    data,
  });
};
export const remove = async (id) => {
  return await prisma.MeasurementUnit.delete({
    where: { id },
  });
};
