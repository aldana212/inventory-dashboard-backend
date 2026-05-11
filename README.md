# Inventory Dashboard Backend

Backend SaaS multi-tenant para gestión de inventario.

---

# Stack
- Node.js
- Express
- Prisma
- PostgreSQL
- Neon
- Render

## Instalación
npm install

## Desarrollo
npm run dev

## Documentación
- docs/deployment.md
- docs/prisma.md

---

# Arquitectura
ROUTES
  ↓
CONTROLLERS
  ↓
SERVICES
  ↓
REPOSITORIES
  ↓
PRISMA

---

# Variables de entorno

Crear .env
DATABASE_URL=
ROOT_EMAIL=
ROOT_PASSWORD=
JWT_SECRET=
CLOUDINARY_KEY=
CLOUDINARY_NAME=
CLOUDINARY_SECRET=
MAIL_PASS=
MAIL_USER=
RESEND_API_KEY=

# Roles del sistema
ROOT
ADMIN
SUPERVISOR
OPERADOR
VIEWER

# Flujo SaaS
ROOT
  ↓
Crea Company
  ↓
Se crea ADMIN
  ↓
ADMIN crea usuarios
  ↓
Usuarios gestionan inventario

# Auth
Autenticación mediante JWT.
Header requerido:
Authorization: Bearer TOKEN

# Tipos de token
FULL_ACCESS:
Usuario autenticado normal.

PASSWORD_RESET:
Usuario obligado a cambiar contraseña.

# Estados de usuario
ACTIVE
INACTIVE
SUSPENDED
TERMINATED