import * as services from "./company.service.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await services.getAll();
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await services.getById(Number(id));
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const create = async (req, res, next) => {
  try {
    const data = await services.create(req.body);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await services.update(Number(id), req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await services.remove(Number(id));
    res.json({ messge: "company deleted" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
