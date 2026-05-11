import prisma from "../../config/db.js";

export const getSummary = async (companyId) => {
  return await prisma.$transaction(async (tx) => {
    // Total productos
    const totalProducts = await prisma.Product.count({
      where: {
        companyId,
      },
    });

    // Stock bajo
    const lowStock = await prisma.Product.count({
      where: {
        currentStock: {
          lte: prisma.Product.fields.minimumStock,
        },
      },
    });

    // Sin stock
    const outStock = await prisma.Product.count({
      where: {
        currentStock: 0,
      },
    });

    // Valor total
    const total = await tx.Product.aggregate({
      where: {
        companyId,
      },
      _sum: {
        purchasePrice: true,
      },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Encuentra todo lo creado hoy:
    const createdToday = await prisma.Movement.count({
      where: {
        createdAt: {
          gte: startOfToday, // Greater than or equal to 00:00:00 today
        },
      },
    });

    return {
      total: total?._sum?.purchasePrice,
      totalProducts,
      lowStock,
      outStock,
      createdToday,
    };
  });
};

export const getMovementsBar = async (companyId) => {
  return await prisma.$queryRaw`
  SELECT 
    d.dia_semana,
    COALESCE(COUNT(m.*) FILTER (WHERE m.type = 'STOCK_IN'), 0)::int AS entradas,
    COALESCE(COUNT(m.*) FILTER (WHERE m.type = 'STOCK_OUT'), 0)::int AS salidas
    FROM generate_series(0, 6) AS d(dia_semana)
    LEFT JOIN "Movement" m
      ON EXTRACT(DOW FROM m."createdAt") = d.dia_semana
      AND m."companyId" = ${companyId}
    GROUP BY d.dia_semana
    ORDER BY (d.dia_semana + 6) % 7;
`;
};

export const getPopularCategories = async (companyId) => {
  return await prisma.$queryRaw`
    SELECT 
      c.name,
      SUM(td."quantity" * td."unitCost") as total
    FROM "TransactionDetail" td
    JOIN "Product" p ON td."productId" = p.id
    JOIN "Category" c ON p."categoryId" = c.id
    JOIN "Movement" m ON td."movementId" = m.id
    WHERE m."companyId" = ${companyId}
    GROUP BY c.name
    ORDER BY total DESC
  `;
};
