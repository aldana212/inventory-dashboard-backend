import prisma from "../../config/db.js";
import * as repo from "./category.repository.js";

export const getAll = async (companyId, page, limit) => {
  const response = await repo.getAll(companyId, page, limit);

  const result = response.data.map((cat) => ({
    ...cat,
    id: cat.id,
    name: cat.name,
    description: cat.description,
    isActive: cat.isActive ? "active" : "inactive",
    productCount: cat._count.products, // 👈 lo importante
  }));

  // return res.json(response);

  return {
    ...response,
    data: result
  };
};

export const getStats = async (companyId) => {
  const response = await repo.getStats(companyId);

  return response;
};

export const getById = async (id) => {
  return await repo.getById(id);
};

export const create = async (data) => {
  return await repo.create(data);
};

export const update = async (id, companyId, data) => {
  return await repo.update(id, companyId, data);
};

export const updateStatus = async ({ id, isActive }) => {
  return await repo.updateStatus(id, isActive);
};

export const remove = async (id) => {
  return await repo.remove(id);
};
