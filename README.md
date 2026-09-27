# LABUBUSTORE

Tienda de Labubus para el taller: storefront en Next.js, backend Medusa JS v2 y PostgreSQL en Supabase.

## Arquitectura

Next.js Storefront → Medusa JS backend → Supabase PostgreSQL

- **Next.js** es la interfaz de la tienda (catálogo, carrito, checkout, cuenta).
- **Medusa** gestiona productos, carrito, inventario, checkout y órdenes.
- **Supabase** se usa únicamente como host de **PostgreSQL**. No hay cliente de Supabase en el frontend.

Por qué **no** usamos `@supabase/supabase-js` en el storefront: la tienda habla solo con la Store API de Medusa. Auth, catálogo, carrito y checkout viven en Medusa. Supabase no interviene en el navegador (ni Auth, ni Storage, ni RLS custom para esta práctica).

## Requisitos

- Node 22
- pnpm

## Instalación

```bash
cd store
pnpm install
```

## Variables de entorno

Copia los ejemplos y completa los valores reales en local. **No** subas secretos al repositorio.

```bash
cp store/apps/backend/.env.example store/apps/backend/.env
cp store/apps/storefront/.env.example store/apps/storefront/.env.local
```

En el backend, `DATABASE_URL` debe apuntar a PostgreSQL en Supabase (Session Pooler, puerto **5432**) e incluir `sslmode=no-verify`. El storefront necesita la publishable key de Medusa Admin (Settings → Publishable API Keys).

## Arranque

Terminal backend:

```bash
cd store/apps/backend
pnpm dev
```

Terminal storefront:

```bash
cd store/apps/storefront
pnpm dev
```

## URLs

Admin: http://localhost:9000/app

Storefront: http://localhost:8000

Ecuador: http://localhost:8000/ec/store

## Región

- **Ecuador** (`ec`) es la región por defecto y vende en **USD**.
- **Europe** (`dk` y el resto de países de esa región) permanece disponible en **EUR**.

## Stack

- Medusa JS v2
- Next.js
- PostgreSQL
- Supabase como host de PostgreSQL
