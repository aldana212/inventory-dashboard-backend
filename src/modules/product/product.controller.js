import * as services from "./product.service.js";

export const getAll = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId;

    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    const search = req.query?.search;
    const categoryId = req.query?.categoryId;
    const stockStatus = req.query?.stockStatus;
    const isActive = req.query?.isActive;

    const data = await services.getAll({
      companyId,
      page,
      limit,
      search,
      categoryId,
      stockStatus,
      isActive,
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId;

    const data = await services.getStats(companyId);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req?.user?.companyId;

    const data = await services.getById(Number(id), companyId);
    res.json(data);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = await services.create({
      body: req.body,
      files: req.files,
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await services.update({
      id: Number(id),
      body: req.body,
      files: req.files,
    });
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

    const data = await services.updateStatus({
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

    const data = await services.remove(Number(id));
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
