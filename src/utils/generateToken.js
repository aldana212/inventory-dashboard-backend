import jwt from "jsonwebtoken";

export const generateToken = (data, config) => {
  const token = jwt.sign(data, process.env.JWT_SECRET, config);

  return token;
};
