# Prisma Guide

---

# Generar Prisma Client

```bash
npx prisma generate
```

---

# Crear migración

```bash
npx prisma migrate dev --name init
```

---

# Aplicar migraciones producción

```bash
npx prisma migrate deploy
```

---

# Ejecutar seed

```bash
npx prisma db seed
```

---

# Reset database

```bash
npx prisma migrate reset
```

---

# Abrir Prisma Studio

```bash
npx prisma studio
```

---

# Buenas prácticas

* Nunca usar `migrate dev` en producción
* Usar `migrate deploy` en Render
* Mantener migraciones en Git
* Usar `upsert` en seed
* Siempre generar Prisma Client después de cambios

---

# Seed

El seed crea:

* Roles
* ROOT user
---

# Roles iniciales

```txt
ROOT
ADMIN
SUPERVISOR
OPERADOR
VIEWER
```
