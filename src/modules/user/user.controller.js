import * as service from "./user.service.js";

export const getAll = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId;
    const id = req?.user?.id;

    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    const data = await service.getAll({ companyId, id, page, limit });
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
    const companyId = req?.user?.companyId || 1;

    const data = await service.create({
      firstName: req.body?.firstName,
      lastName: req.body?.lastName,
      email: req.body?.email,
      isActive: req.body?.isActive,
      status: req.body?.status,
      // password: req.body?.password,
      rol: req.body?.rol,
      brandColor: req.body?.brandColor,
      companyId: companyId,
    });
    res.json(data);
  } catch (error) {
    console.log("error");
    console.log(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    // const { id } = req.params;
    const user = req?.user || {};
    const data = await service.update(req.body, user);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req?.user || {};
    const { status } = req.body;

    const data = await service.updateStatus({
      id: Number(id),
      status,
      user,
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
    res.json({ message: "Delete" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
