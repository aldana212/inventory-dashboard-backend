import prisma from "../src/config/db.js";

import bcrypt from "bcrypt";

async function main() {
  // Roles
  const roles = ["ROOT", "ADMIN", "SUPERVISOR", "OPERADOR", "VIEWER"];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: {
        name: roleName,
      },

      update: {},

      create: {
        name: roleName,
      },
    });
  }

  // ROOT ROLE
  const rootRole = await prisma.role.findUnique({
    where: {
      name: "ROOT",
    },
  });

  // EXISTING ROOT
  const existingRoot = await prisma.User.findUnique({
    where: {
      email: process.env.ROOT_EMAIL,
    },
  });

  // CREATE ROOT
  if (!existingRoot) {
    const hashedPassword = await bcrypt.hash(process.env.ROOT_PASSWORD, 10);

    await prisma.User.create({
      data: {
        firstName: "System",
        lastName: "Admin",

        email: process.env.ROOT_EMAIL,
        password: hashedPassword,
        mustChangePassword: false,
        roleId: rootRole.id,
      },
    });

    console.log("ROOT created");
  }

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
