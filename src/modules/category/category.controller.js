import * as service from "./category.service.js";

export const getAll = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId;

     const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;


    const data = await service.getAll(companyId, page, limit);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId;
    const data = await service.getStats(companyId);
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
    const companyId = req?.user?.companyId;

    const { id } = req.params;

    const data = await service.update(Number(id), companyId, req.body);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { isActive } = req.body;

    const data = await service.updateStatus({
      id: Number(id),
      isActive,
    });
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
