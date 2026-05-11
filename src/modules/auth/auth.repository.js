import prisma from "../../config/db.js";
import bcrypt from "bcrypt";

export const findByEmail = async (email) => {
  return prisma.User.findUnique({
    where: {
      email,
    },

    include: {
      role: true,
    },
  });
};

export const findById = async (id) => {
  return prisma.User.findUnique({
    where: {
      id,
    },

    include: {
      role: true,
    },
  });
};

export const update = async (id, data) => {
  return prisma.User.update({
    where: {
      id,
    },

    data,
  });
};
