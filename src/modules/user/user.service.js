import * as repo from "./user.repository.js";
import * as repoCompany from "../company/company.repository.js";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError.js";
import { generateTempPassword } from "../../utils/generateTempPassword.js";
import { generateToken } from "../../utils/generateToken.js";
import emailService from "../../services/email.service.js";

export const getAll = async ({ companyId, id, page, limit }) => {
  return await repo.getAll({ companyId, id, page, limit });
};

export const getStats = async (companyId) => {
  return await repo.getStats(companyId);
};

export const getById = async (id) => {
  const response = await repo.getById(id);
  if (!response) {
    throw new AppError("User not found", 404);
  }

  return response;
};

export const create = async ({
  firstName,
  lastName,
  email,
  isActive,
  status,
  rol,
  brandColor,
  companyId,
}) => {
  // find a user by their email
  const user = await repo.findUser({
    email,
  });

  if (user) throw new Error("email already exists");

  // find a company by its ID
  const company = await repoCompany.getById(undefined, companyId);
  if (!company) throw new Error("The company does not exist");

  // ROLE
  const role = await repo.findRoleByName(rol);

  if (!role) {
    throw new AppError("Role not found", 404);
  }

  // BLOCK ROOT
  if (role.name === "ROOT") {
    throw new AppError("Cannot create ROOT users", 403);
  }

  // Generar contraseña temporal
  const tempPassword = generateTempPassword();

  const hashed = await bcrypt.hash(tempPassword, 10);

  // SEND EMAIL FIRST
  await emailService.sendTemporaryPassword(email, tempPassword);

  // ONLY save if email worked
  const data = {
    firstName,
    lastName,
    email,
    password: hashed,
    mustChangePassword: true,
    roleId: rol,
    brandColor,
    isActive,
    status,
    companyId,
  };

  //saving the user
  const newUser = await repo.create(data);

  return newUser;
};

// zs887cjwvq

export const update = async (data, user) => {
  //find a user by their email
  const findUser = await repo.findUser({
    id: user?.id,
  });

  const roleId = user?.role?.id;

  if (user?.id === findUser?.id && findUser?.role?.id !== roleId) {
    throw new AppError("You can't change your own role", 403);
  }

  return await repo.update(user?.id, data);
};

export const updateStatus = async ({ id, status, user }) => {
  //find a user by their email
  const findUser = await repo.findUser({
    id,
  });

  if (user?.id === id && findUser?.status !== status) {
    throw new AppError("You cannot change your own user status", 403);
  }

  return await repo.updateStatus(id, status);
};

export const remove = async (id) => {
  return await repo.remove(id);
};
