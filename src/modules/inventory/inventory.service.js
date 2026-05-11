import prisma from "../../config/db.js";
import * as repo from "./inventory.repository.js";

export const getById = async (filters) => {
  const { productId, companyId, page, limit } = filters;

  const response = await repo.getById(productId, page, limit);

  const formData = response?.data?.map((item) => {
    const quantity = item?.quantity;

    const change =
      item?.movement?.type === "STOCK_OUT"
        ? -Number(quantity)
        : Number(quantity);

    return {
      movementDate: item?.movement?.movementDate,
      reference: item?.movement?.reference,
      product: item?.product,
      type: item?.movement?.type,
      change: change,
      stockAfter: item?.stockAfter,
      user: item?.movement?.user,
    };
  });

  return {
    ...response,
    data: formData,
  };
};
