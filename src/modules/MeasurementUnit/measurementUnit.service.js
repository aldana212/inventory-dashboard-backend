import * as repo from "./measurementUnit.repository.js";

export const getAll = async () => {
  return await repo.getAll();
};
export const getById = async (id) => {
  return await repo.getById(id);
};
export const create = async (data) => {
  return await repo.create(data);
};
export const update = async (id, data) => {
  return await repo.update(id, data);
};
export const remove = async (id) => {
  return await repo.remove(id);
};
