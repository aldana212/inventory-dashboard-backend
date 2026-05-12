# 📦 Inventory Dashboard Backend

Backend SaaS multi-tenant para la gestión de inventario, usuarios y control de operaciones.

Este sistema está diseñado como una plataforma escalable tipo SaaS, con arquitectura modular, control de acceso por roles y auditoría completa de movimientos.

---

# 🧠 Descripción general

Este backend permite gestionar un sistema completo de inventario con:

- Gestión de empresas (multi-tenant)
- Control de usuarios con roles
- Administración de productos y categorías
- Registro de movimientos de inventario (entradas y salidas)
- Historial completo de auditoría de acciones
- Autenticación segura basada en JWT

---

# 🛠️ Stack tecnológico

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Neon Database
- Render (deploy)

---

# 📁 Arquitectura del sistema

Routes → Controllers → Services → Repositories → Prisma

Responsabilidades:
- Routes: definición de endpoints
- Controllers: manejo de requests/responses
- Services: lógica de negocio
- Repositories: acceso a base de datos
- Prisma: ORM

---

# 🧩 Roles del sistema

- ROOT → super administrador del SaaS
- ADMIN → administrador de empresa
- SUPERVISOR → gestión operativa
- OPERADOR → registro de movimientos
- VIEWER → solo lectura

---

# 🏢 Flujo SaaS (multi-tenant)

ROOT
  ↓
Crea empresa (Company)
  ↓
Se crea ADMIN
  ↓
ADMIN gestiona usuarios
  ↓
Usuarios operan inventario

---

# 🔐 Autenticación

JWT basado en tokens

Header requerido:
Authorization: Bearer <TOKEN>

---

# 🎟️ Tipos de token

- FULL_ACCESS → usuario normal autenticado
- PASSWORD_RESET → cambio de contraseña

---

# 👤 Estados de usuario

- ACTIVE
- INACTIVE
- SUSPENDED
- TERMINATED

---

# 🚀 Instalación

npm install  
npm run dev  

---

# 🌱 Seed demo

Incluye datos demo listos para usar:

- usuarios
- productos
- movimientos
- categorías

Login demo:
admin@demo.com / Demo@123

---

# 🔐 Variables de entorno

DATABASE_URL=  
ROOT_EMAIL=  
ROOT_PASSWORD=  
JWT_SECRET=  
CLOUDINARY_NAME=  
CLOUDINARY_KEY=  
CLOUDINARY_SECRET=  
MAIL_USER=  
MAIL_PASS=  
RESEND_API_KEY=  

---

# 🧠 Objetivo

Simular un sistema SaaS real de gestión de inventario con arquitectura escalable y control de acceso por roles.