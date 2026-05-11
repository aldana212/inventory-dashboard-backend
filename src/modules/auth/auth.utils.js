import jwt from "jsonwebtoken";
import AppError from "../../errors/AppError.js";

export const validateUserStatus = (user) => {
  if (user.status === "INACTIVE") {
    throw new AppError("Account disabled", 403);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Account blocked", 423);
  }
};

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,

      email: user.email,

      role: user.role,

      companyId: user.companyId,

      type: "FULL_ACCESS",
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "1d",
    },
  );
};

export const createPasswordSetupToken = (user) => {
  return jwt.sign(
    {
      id: user.id,

      email: user.email,

      role: user.role,

      type: "PASSWORD_RESET",
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "15m",
    },
  );
};
