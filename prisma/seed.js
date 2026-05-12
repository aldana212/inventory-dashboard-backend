import prisma from "../src/config/db.js";
import bcrypt from "bcrypt";

const DEMO_PASSWORD = "Demo@123";

const hash = (pwd) => bcrypt.hash(pwd, 10);

async function main() {
  console.log("🌱 Seed iniciando...");

  // =====================
  // 1. ROLES
  // =====================
  const roles = ["ROOT", "ADMIN", "SUPERVISOR", "OPERADOR", "VIEWER"];

  await Promise.all(
    roles.map((name) =>
      prisma.Role.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const getRole = (name) => prisma.Role.findUnique({ where: { name } });

  // =====================
  // 2. ROOT USER
  // =====================
  const rootRole = await getRole("ROOT");

  await prisma.User.upsert({
    where: { email: process.env.ROOT_EMAIL },
    update: {},
    create: {
      firstName: "System",
      lastName: "Admin",
      email: process.env.ROOT_EMAIL,
      password: await hash(process.env.ROOT_PASSWORD),
      roleId: rootRole.id,
      brandColor: "#3B82F6",
      mustChangePassword: false,
    },
  });

  // =====================
  // 3. COMPANY DEMO
  // =====================
  const company = await prisma.Company.upsert({
    where: { nit: "900000001" },
    update: {},
    create: {
      name: "Demo Company",
      nit: "900000001",
    },
  });

  // =====================
  // 4. ROLES
  // =====================
  const adminRole = await getRole("ADMIN");
  const supervisorRole = await getRole("SUPERVISOR");
  const operadorRole = await getRole("OPERADOR");

  // =====================
  // 5. USERS DEMO
  // =====================
  const users = [
    {
      firstName: "Admin",
      lastName: "Demo",
      email: "admin@demo.com",
      roleId: adminRole.id,
    },
    {
      firstName: "Supervisor",
      lastName: "Demo",
      email: "supervisor@demo.com",
      roleId: supervisorRole.id,
    },
    {
      firstName: "Operador",
      lastName: "Demo",
      email: "operador@demo.com",
      roleId: operadorRole.id,
    },
  ];

  for (const u of users) {
    await prisma.User.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        companyId: company.id,
        password: await hash(DEMO_PASSWORD),
        mustChangePassword: false,
        brandColor: "#3B82F6",
      },
    });
  }

  // =====================
  // 6. CATEGORY
  // =====================

  const unit = await prisma.measurementUnit.upsert({
    where: { name: "Unidad" },
    update: {},
    create: {
      name: "Unidad",
      abbreviation: "ud",
    },
  });

  const category = await prisma.Category.upsert({
    where: {
      companyId_name: {
        companyId: company.id,
        name: "Electrónica",
      },
    },
    update: {},
    create: {
      name: "Electrónica",
      companyId: company.id,
    },
  });

  // =====================
  // 7. PRODUCT
  // =====================
  const product = await prisma.Product.upsert({
    where: {
      companyId_sku: {
        companyId: company.id,
        sku: "DEMO-001",
      },
    },
    update: {},
    create: {
      name: "Laptop Dell",
      sku: "DEMO-001",
      company: {
        connect: { id: company.id },
      },

      category: {
        connect: { id: category.id },
      },

      unit: {
        connect: { id: unit.id },
      },

      purchasePrice: 800,
      salePrice: 1000,
      currentStock: 10,
      minimumStock: 2,
    },
  });

  // =====================
  // 8. MOVEMENT (INICIAL)
  // =====================
  const admin = await prisma.User.findUnique({
    where: { email: "admin@demo.com" },
  });

  await prisma.movement.upsert({
    where: {
      companyId_reference: {
        companyId: company.id,
        reference: "INIT-001",
      },
    },
    update: {},
    create: {
      type: "STOCK_IN",
      companyId: company.id,
      userId: admin.id,
      reference: "INIT-001",
      sequence: 1,
      observation: "Stock inicial demo",
      transactionDetails: {
        create: [
          {
            productId: product.id,
            quantity: 10,
            unitCost: 800,
            unitPrice: 1000,
            stockBefore: 0,
            stockAfter: 10,
          },
        ],
      },
    },
  });

  console.log("🚀 Seed completado correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Error seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
