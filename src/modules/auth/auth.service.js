import * as repo from "./auth.repository.js";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError.js";
import { generateToken } from "../../utils/generateToken.js";
import {
  createAccessToken,
  createPasswordSetupToken,
  validateUserStatus,
} from "./auth.utils.js";

export const login = async ({ email, password }) => {
  //find a user by their email
  const user = await repo.findByEmail(email);

  if (!user) throw new AppError("User does not exist", 404);

  // STATUS
  validateUserStatus(user);

  // Validar las password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError("Incorrect username or password", 401);

  // 🔴 CASO: DEBE CAMBIAR PASSWORD
  if (user.mustChangePassword) {
    const token = createPasswordSetupToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
      token,
    };
  }

  // ACCESS TOKEN
  const token = createAccessToken(user);

  // UPDATE LAST LOGIN
  await repo.update(user.id, {
    lastLogin: new Date(),
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    },
    token,
  };
};

export const completePasswordSetup = async ({
  id,
  currentPassword,
  newPassword,
}) => {
  //find a user by their email
  const user = await repo.findById(id);

  if (!user) throw new AppError("User does not exist", 404);

  // STATUS
  validateUserStatus(user);

  // Validar las password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) throw new AppError("Your current password is incorrect", 401);

  const hashed = await bcrypt.hash(newPassword, 10);

  const response = await repo.update(user.id, {
    mustChangePassword: false,
    password: hashed,
  });

  const token = createAccessToken(user);

  return {
    user: {
      ...response,
    },
    token,
  };
};

export const changePassword = async ({ id, currentPassword, newPassword }) => {
  //find a user by their email
  const user = await repo.findById(id);

  if (!user) throw new AppError("User does not exist", 404);

  // Validar las password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) throw new AppError("Your current password is incorrect", 401);

  const hashed = await bcrypt.hash(newPassword, 10);

  return await repo.update(id, {
    password: hashed,
  });
};
