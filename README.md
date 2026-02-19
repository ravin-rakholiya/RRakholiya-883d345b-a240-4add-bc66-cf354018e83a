# Secure Task Management System

Production-grade **Secure Task Management System** built with an **NX monorepo**: **Angular 19 + NgRx**, **NestJS**, **PostgreSQL**, **Prisma**, **JWT authentication**, and **Role-Based Access Control (RBAC)**.

---


## Setup Instructions

### Prerequisites

- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** 16

### 1. Clone and install

```bash
git clone <repo-url>
cd TurboVets
npm ci
# If you hit peer dependency conflicts:
# npm install --legacy-peer-deps
```

### 2. Environment configuration (.env)

Copy the example env and set values (required: `DATABASE_URL`, `JWT_SECRET`).

```bash
cp .env.example .env
```

Edit `.env` with your settings. **JWT and database config** are required:

| Variable | Description | Example |
|----------|-------------|---------|
| **JWT_SECRET** | Secret for signing JWTs; **must be at least 32 characters**. | `your-super-secret-key-min-32-chars-change-in-production` |
| **JWT_EXPIRES_IN** | Access token lifetime. | `15m` |
| **DATABASE_URL** | PostgreSQL connection string. | `postgresql://postgres:postgres@localhost:5432/task_management?schema=public` |
| **PORT** | API server port. | `3333` |
| **API_PREFIX** | Global API path prefix. | `api` |
| **CORS_ORIGINS** | Allowed origins (comma-separated). | `http://localhost:4200,http://localhost:3333` |
| **BCRYPT_ROUNDS** | bcrypt cost for password hashing (optional). | `12` |
| **RATE_LIMIT_TTL** / **RATE_LIMIT_MAX** | Rate limit window (seconds) and max requests (optional). | `60`, `100` |

**Security:** In production, use a long random value for `JWT_SECRET` (e.g. `openssl rand -base64 32`) and never commit `.env`.

### 3. Database and Prisma

```bash
# Generate Prisma client
npm run prisma:generate

# Create DB
createdb task_management

# Run migrations
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

# Seed roles (Owner, Admin, Viewer) and optional demo data
npm run db:seed
```

### 4. How to run backend and frontend

**Option A – Two terminals (development)**

```bash
# Terminal 1 – Backend (NestJS API)
npm run serve:api

# Terminal 2 – Frontend (Angular dashboard)
npm run serve:dashboard
```

- **API:** http://localhost:3333 (base path `/api`)
- **Dashboard:** http://localhost:4200

**Option B – Single command (concurrent)**

```bash
npm run run:dev
```

Runs Prisma generate, then both API and dashboard.

---

## Access Control Implementation

### Roles, permissions, and organization hierarchy

**Roles (from Prisma `RoleEnum`):**

| Role | Capabilities |
|------|--------------|
| **Owner** | Full access within the organization; can view **audit log**; CRUD tasks; assign tasks. |
| **Admin** | Same as Owner for tasks and audit log within the organization; CRUD and assign tasks. |
| **Viewer** | **Read-only** within the organization; list/view tasks only; no create/update/delete, no audit log. |




---

## API Documentation

PostMan Collection: `https://documenter.getpostman.com/view/27946057/2sBXcEif2F`
DataBase Architecture: `https://drive.google.com/file/d/1dhcY4k8W7Wa5zmzaL3S8B7Wr4i0EF7so/view?usp=sharing`
ERD Diagram: `https://drive.google.com/file/d/1DThfg2GsK2lCdlEnP8iZnRH45mwoSJg4/view?usp=sharing`

Base URL: `http://localhost:3333/api` (or your `PORT` and `API_PREFIX`).


---


---

## Summary

This repo provides a **modular, secure, and scalable** task management system: NX monorepo, NestJS + Prisma + PostgreSQL, Angular + NgRx, JWT + RBAC, shared libs, DTO validation, guards, and CI. Use the [Setup Instructions](#setup-instructions) to run backend and frontend and the [API Documentation](#api-documentation) for integration.
