import * as repo from "./user.repository.js";
import * as repoCompany from "../company/company.repository.js";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError.js";
import { generateTempPassword } from "../../utils/generateTempPassword.js";
// import { sendEmail } from "../../services/email.service.js";
import { generateToken } from "../../utils/generateToken.js";
import emailService from "../../services/email.service.js";

export const getAll = async (companyId, id, page, limit) => {
  return await repo.getAll(companyId, id, page, limit);
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

export const login = async ({ email, password }) => {
  //find a user by their email
  const user = await repo.findUser({
    email,
  });


  if (!user) throw new AppError("User does not exist", 404);
  if (user?.status === "INACTIVE") throw new AppError("Account disabled", 403);
  if (user?.status !== "INACTIVE" && user?.status !== "ACTIVE")
    throw new AppError("Account blocked", 423);

  // Validar las password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError("Incorrect username or password", 401);


  // 🔴 CASO: DEBE CAMBIAR PASSWORD
  if (user.mustChangePassword) {
    const token = generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.roleRel,
        type: "PASSWORD_RESET",
      },
      { expiresIn: "15m" },
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.roleRel,
        mustChangePassword: user.mustChangePassword,
      },
      token,
    };
  }

  const token = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.roleRel,
      companyId: user.companyId,
      type: "FULL_ACCESS",
    },
    {
      expiresIn: 1 * 24 * 60 * 60 * 1000,
    },
  );

  //
  await repo.update(user.id, {
    lastLogin: new Date(),
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.roleRel,
      companyId: user.companyId,
    },
    token,
  };
};

export const signup = async ({
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

  // Generar contraseña temporal
  const tempPassword = generateTempPassword();

  const hashed = await bcrypt.hash(tempPassword, 10);

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

  await emailService.sendTemporaryPassword(email, tempPassword);

  return newUser;
  // return await repo.signup({});
};

// zs887cjwvq

export const update = async (id, data, user) => {
  //find a user by their email
  const findUser = await repo.findUser({
    id: id,
  });

  const roleId = user?.role?.id;

  if (user?.id === id && findUser?.roleRel?.id !== roleId) {
    throw new AppError("You can't change your own role", 403);
  }

  return await repo.update(id, data);
};

export const updateStatus = async ({ id, status, user }) => {
  //find a user by their email
  const findUser = await repo.findUser({
    id: id,
  });

  if (user?.id === id && findUser?.status !== status) {
    throw new AppError("You cannot change your own user status", 403);
  }

  return await repo.updateStatus(id, status);
};

export const completePasswordSetup = async (id, data) => {
  //find a user by their email
  const user = await repo.findUser({
    id,
  });

  if (!user) throw new AppError("User does not exist", 404);
  if (user?.status === "INACTIVE") throw new AppError("Account disabled", 403);
  if (user?.status !== "INACTIVE" && user?.status !== "ACTIVE")
    throw new AppError("Account blocked", 423);

  // Validar las password
  const isMatch = await bcrypt.compare(data.currentPassword, user.password);

  if (!isMatch) throw new AppError("Your current password is incorrect", 401);

  const hashed = await bcrypt.hash(data?.newPassword, 10);

  const response = await repo.update(user.id, {
    mustChangePassword: false,
    password: hashed,
  });

  // const response = await repo.completePasswordSetup(id, hashed);

  const token = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.roleRel,
      companyId: user.companyId,
      type: "FULL_ACCESS",
    },
    {
      expiresIn: 1 * 24 * 60 * 60 * 1000,
    },
  );

  return {
    user: {
      ...response,
    },
    token,
  };
};

export const changePassword = async (id, data) => {
  //find a user by their email
  const user = await repo.findUser({
    id,
  });

  if (!user) throw new AppError("User does not exist", 404);

  // Validar las password
  const isMatch = await bcrypt.compare(data.currentPassword, user.password);

  if (!isMatch) throw new AppError("Your current password is incorrect", 401);

  const hashed = await bcrypt.hash(data?.newPassword, 10);

  return await repo.changePassword(id, hashed);
};

export const remove = async (id) => {
  return await repo.remove(id);
};
