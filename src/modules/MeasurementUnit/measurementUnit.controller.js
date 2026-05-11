import * as service from "./measurementUnit.service.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.getById(Number(id));
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const create = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await service.create(data);
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.update(Number(id), req.body);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.remove(Number(id));
    res.json({ message: "Deleted" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
