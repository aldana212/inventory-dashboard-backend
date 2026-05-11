import * as service from "./movement.service.js";

export const getAll = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId

    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    const search = req.query?.search;

    const from = req.query.from;
    const to = req.query.to;

    const start = new Date(`${from}T00:00:00.000Z`);
    const end = new Date(`${to}T00:00:00.000Z`);

    const date = {
      from: from && start,
      to: to && end,
    };

    const type = req.query?.type;

    const data = await service.getAll({
      companyId,
      page,
      limit,
      search,
      date,
      type,
    });

    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId

    const period = req.query?.period;

    const data = await service.getStats(companyId, period);

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
    const data = await service.create(req.body);
    res.json(data);
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
