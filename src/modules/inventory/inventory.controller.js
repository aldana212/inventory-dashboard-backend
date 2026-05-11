import * as service from "./inventory.service.js";

export const getById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const companyId = req?.user?.companyId;
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    const data = await service.getById({
      productId: Number(productId),
      companyId,
      page,
      limit,
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
