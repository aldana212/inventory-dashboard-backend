import AppError from "../../errors/AppError.js";
import * as repo from "./company.repository.js";
import bcrypt from "bcrypt";

export const getAll = async () => {
  return await repo.getAll();
};
export const getById = async (id) => {
  return await repo.getById(undefined, id);
};
export const create = async ({ companyName, nit, admin }) => {
  // COMPANY
  const existingCompany = await repo.findByNit(nit);
  if (existingCompany) throw new AppError("Company already exists", 400);

  // USER
  const existingUser = await repo.findUserByEmail(admin.email);

  if (existingUser) throw new AppError("Email already exists", 400);

  // ADMIN ROLE
  const adminRole = await repo.findRoleByName("ADMIN");

  if (!adminRole) throw new AppError("ADMIN role missing", 500);

  // PASSWORD
  const hashedPassword = await bcrypt.hash(admin.password, 10);

  return await repo.createCompanyWithAdmin({
    company: {
      name: companyName,
      nit,
    },
    admin: {
      firstName: admin.firstName,

      lastName: admin.lastName,

      email: admin.email,

      password: hashedPassword,
      mustChangePassword: false,
      roleId: adminRole.id,
    },
  });

  // return await repo.create(data);
};
export const update = async (id, data) => {
  return await repo.update(id, data);
};
export const remove = async (id) => {
  return await repo.remove(id);
};
