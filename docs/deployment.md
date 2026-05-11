# Deployment Guide

---

# Stack 

```txt
Backend → Render
Database → Neon
```

---

# 1. Crear base de datos en Neon

Ir a:

Neon → https://neon.tech

---

# Crear proyecto

Ejemplo:

```txt
inventory-db
```

---

# Copiar DATABASE_URL pooled

Debe incluir:

```txt
pgbouncer=true
```

Ejemplo:

```env
DATABASE_URL=postgresql://...?sslmode=require&pgbouncer=true&connection_limit=1
```

---

# 2. Configurar Render

Ir a:

Render → https://render.com

---

# Crear Web Service

* Connect GitHub
* Seleccionar repositorio

---

# Configuración

## Runtime

```txt
Node
```

---

# Build Command

```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

---

# Start Command

```bash
npm start
```

---

# Plan

```txt
Free
```

---

# Variables de entorno

```env

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

```

---

# 3. Deploy automático

Cada push a GitHub ejecutará:

```txt
npm install
↓
prisma generate
↓
prisma migrate deploy
↓
npm start
```

---

# 4. Ejecutar seed producción

Render Free no tiene shell.

Ejecutar LOCAL apuntando a Neon:

```bash
npx prisma db seed
``