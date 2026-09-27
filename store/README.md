# LABUBUSTORE

Monorepo de la tienda. La guía completa del taller está en el [README raíz](../README.md).

## Arquitectura

Next.js Storefront → Medusa JS backend → Supabase PostgreSQL

- **Next.js** (`apps/storefront`): interfaz de la tienda.
- **Medusa JS v2** (`apps/backend`): productos, carrito, inventario, checkout y órdenes.
- **Supabase**: únicamente PostgreSQL. El storefront **no** usa `@supabase/supabase-js`.

## Requisitos

- Node 22
- pnpm

## Instalación

```bash
pnpm install
```

## Variables de entorno

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/storefront/.env.example apps/storefront/.env.local
```

Completa los valores. No copies secretos reales a Git.

## Arranque

Terminal backend:

```bash
cd apps/backend
pnpm dev
```

Terminal storefront:

```bash
cd apps/storefront
pnpm dev
```

## URLs

- Admin: http://localhost:9000/app
- Storefront: http://localhost:8000
- Ecuador: http://localhost:8000/ec/store

## Región

- Ecuador / `ec` / USD (default)
- Europe / `dk` / EUR permanece disponible
