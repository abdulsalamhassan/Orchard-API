# Orchard API

NestJS REST API for multi-tenant project and task management.

## Overview

This service provides:
- JWT authentication with access + refresh tokens
- Organization membership and tenant scoping
- CRUD for projects within an organization
- CRUD for tasks within a project
- Pagination support on list endpoints
- Request validation, centralized exception handling, and structured logging
- OpenAPI/Swagger docs

Tech stack:
- NestJS 11
- Prisma ORM
- PostgreSQL
- Passport JWT
- Swagger (`/docs`)
- Winston logging

## Architecture

Core modules:
- `auth`: register, login, refresh, logout
- `organizations`: create organizations and membership handling
- `projects`: organization-scoped project CRUD
- `tasks`: project-scoped task CRUD
- `users`: user persistence and auth support
- `prisma`: database client and connection lifecycle

Data model highlights:
- `User`
- `Organization`
- `OrganizationMember` (with `OWNER | ADMIN | MEMBER` role)
- `Project` (belongs to organization)
- `Task` (belongs to project + organization)

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+

Optional: run PostgreSQL via Docker Compose.

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env` in the project root

```env
DATABASE_URL="postgresql://taskflow:taskflow@localhost:5437/taskflow"
JWT_ACCESS_SECRET="replace-with-strong-secret"
JWT_ACCESS_TTL="15m"
JWT_REFRESH_SECRET="replace-with-strong-secret"
PORT=3000
LOG_LEVEL=info
```

3. Start PostgreSQL (optional, Docker)

```bash
docker compose up -d
```

4. Run Prisma migrations

```bash
npx prisma migrate dev
```

5. Start the API

```bash
npm run start:dev
```

## API Docs

Swagger UI is available at:

- `http://localhost:3000/docs`

## Authentication and Tenant Scope

- Protected routes require: `Authorization: Bearer <accessToken>`
- Organization-scoped routes require: `x-organization-id: <organizationId>`

Typical flow:
1. `POST /auth/register`
2. `POST /auth/login`
3. `POST /organizations` (authenticated)
4. Use returned org id in `x-organization-id`
5. Call `/projects` and `/projects/:projectId/tasks`

## Endpoint Summary

Auth:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Organizations:
- `POST /organizations`
- `GET /organizations/debug`

Projects (auth + org header):
- `POST /projects`
- `GET /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

Tasks (auth + org header):
- `POST /projects/:projectId/tasks`
- `GET /projects/:projectId/tasks`
- `GET /projects/:projectId/tasks/:id`
- `PATCH /projects/:projectId/tasks/:id`
- `DELETE /projects/:projectId/tasks/:id`

## Pagination

List endpoints support `page` and `limit` query params:

- `GET /projects?page=1&limit=10`
- `GET /projects/:projectId/tasks?page=1&limit=20`

## Scripts

```bash
npm run start         # start server
npm run start:dev     # start in watch mode
npm run build         # build
npm run start:prod    # run built app
npm run lint          # lint
npm run test          # unit tests
npm run test:e2e      # e2e tests
npm run test:cov      # coverage
```

## Testing

Run all tests:

```bash
npm run test && npm run test:e2e
```

## License

UNLICENSED
