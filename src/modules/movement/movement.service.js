import prisma from "../../config/db.js";
import * as repo from "./movement.repository.js";
import * as repoProduct from "../product/product.repository.js";
import * as repoCompany from "../company/company.repository.js";
import { Prisma } from "../../generated/prisma/client.js";

export const getAll = async (filters) => {
  const { companyId, page, limit, search, date, type } = filters;

  const where = {
    companyId,

    ...(search && {
      transactionDetails: {
        some: {
          product: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    }),

    ...(date?.from &&
      date?.to && {
        createdAt: {
          gte: date?.from,
          lt: new Date(date?.to.getTime() + 86400000), // +1 día
        },
      }),

    ...(type &&
      type && {
        type,
      }),
  };

  const response = await repo.getAll(where, page, limit);

  const formData = response?.data?.map((item) => {
    const quantity = item?.transactionDetails[0].quantity;

    const change =
      item?.type === "STOCK_OUT" ? -Number(quantity) : Number(quantity);

    return {
      createdAt: item?.createdAt,
      movementDate: item?.movementDate,
      reference: item?.reference,
      product: item?.transactionDetails[0].product,
      type: item?.type,
      change: change,
      stockBefore: item?.transactionDetails[0]?.stockBefore,
      stockAfter: item?.transactionDetails[0]?.stockAfter,
      user: item?.user,
    };
  });

  return {
    data: formData,
    ...response?.pagination,
  };
};

export const getStats = async (companyId, period) => {
  // let gte;
  let createdAt;

  if (period === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    createdAt = {
      gte: start,
      lte: end,
    };
  }

  if (period === "week") {
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay());

    createdAt = {
      gte: firstDay,
    };
  }

  if (period === "month") {
    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    createdAt = {
      gte: firstDayMonth,
      lte: lastDayMonth,
    };
  }

  if (period === "year") {
    const now = new Date(); // Fecha actual
    const startYear = new Date(now.getFullYear(), 0, 1); // Enero 1
    const endYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // Dic 31

    createdAt = {
      gte: startYear,
      lte: endYear,
    };
  }

  const where = {
    companyId,
    createdAt,
  };

  const response = await repo.getStats(where);

  return {
    input: response?.input,
    output: response?.output,
    balance: (response?.input || 0) - (response?.output || 0),
    movement: (response?.input || 0) + (response?.output || 0),
  };
};

export const getById = async (id) => {
  return await repo.getById(id);
};

export const create = async (data) => {
  if (!data.companyId) throw new Error("El companyId es Requerido");

  if (!data.userId) throw new Error("El companyId es Requerido");

  if (!data.productId) throw new Error("El companyId es Requerido");

  return await prisma.$transaction(async (tx) => {
    // 1. Obtener product y lógica de negocio (stock)
    const product = await repoProduct.findById(
      tx,
      data.productId,
      data.companyId,
    );

    if (!product?.id) throw new Error("El Product no existe");

    const stockBefore = Number(product.currentStock);
    const quantity = Number(data.quantity);

    if (data.type === "STOCK_OUT" && stockBefore < quantity)
      throw new Error("La cantidad supera el stock actual");

    // STOCK_IN -- Entrada
    // STOCK_OUT -- Salida

    const stockAfter =
      data.type === "STOCK_IN"
        ? stockBefore + quantity
        : stockBefore - quantity;

    if (stockAfter < 0) throw new Error("Stock insuficiente");

    // Generate referencia
    const lastMovement = await repo.getFindFirst(tx, data.companyId);

    const company = await repoCompany.getById(tx, data.companyId);

    const nextSequence = lastMovement ? lastMovement.sequence + 1 : 1;

    const companyCode = company.name.substring(0, 2).toUpperCase();

    const reference = `MOV-${companyCode}-${String(nextSequence).padStart(6, "0")}`;

    // 1. crear movimiento y detalles
    const movement = await repo.create(tx, {
      type: data.type,
      companyId: data.companyId,
      userId: data.userId,
      reference,
      sequence: nextSequence,
      observation: data.observation,
    });

    await repo.createDetail(tx, {
      movementId: movement?.id,
      productId: data.productId,
      quantity: data.quantity,
      stockBefore,
      stockAfter,
      unitCost: product.purchasePrice,
      unitPrice: product.salePrice,
    });

    await repo.createLog(tx, {
      userId: data.userId,
      activity: data.observation,
    });

    const response = await repoProduct.update(tx, data.productId, {
      body: { currentStock: new Prisma.Decimal(stockAfter) },
    });

    return movement;
  });
};

export const update = async (id, data) => {
  return await repo.update(id, data);
};

export const remove = async (id) => {
  return await repo.remove(id);
};
