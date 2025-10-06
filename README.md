# Backend Technical Assessment — Product Management API

## Overview

This project implements a **RESTful Product Management API** built with **NestJS & TypeScript**.  
It provides CRUD endpoints for product data, attachment upload APIs, and a recursive JSON tree representation of uploaded files.

---

## Tech Stack / Tools Used

| Purpose              | Library / Tool                                            |
| -------------------- | --------------------------------------------------------- |
| Backend Framework    | NestJS. Tested Node version 22.12.0 in Ubuntu 24.04.2 LTS |
| Language             | TypeScript                                                |
| ORM                  | TypeORM                                                   |
| Database             | PostgreSQL 16 (via Docker Compose)                        |
| API Documentation    | Swagger (`@nestjs/swagger`)                               |
| File Upload          | Multer (integrated in Nest)                               |
| Custom DSA           | Custom-built `HashMap` and `AttachmentTree` classes       |
| Environment Config   | `.env` + `@nestjs/config`                                 |
| Node Package Manager | pnpm (tested: v10.18.0)                                   |

---

## Setup, Build, & Run

### Install dependencies

```bash
pnpm install
```

### Start database using Docker

Database compose file is located in **`/db/compose.yaml`**.

```bash
cd db
docker compose up -d
```

This spins up a PostgreSQL container with name `owen-be-assignnment`  
and default credentials defined in `.env.example`.

### Configure environment

Copy `.env.example` → `.env`

```bash
cp .env.example .env
```

Modify ports or credentials if needed.

### Run the backend

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

Server will start on [http://localhost:3000](http://localhost:3000)

### Swagger API Docs

Once running, open: **[http://localhost:3000/api](http://localhost:3000/api)**

### Run tests

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

---

## Implemented Features

All required features are implemented

### Product Module

- Full CRUD operations for products (`/products`), including pagination and sorting
- Input validation via `class-validator`
- Supports enabling/disabling products, `createdAt`, `updatedAt` timestamps
- Auto-generated schema via Swagger

### Attachment Module

- File upload API: `POST /products/:productId/attachments/upload`
- Files are stored under `/uploads/<productId>/...`
- Metadata persisted to PostgreSQL
- Recursive JSON tree output:  
  `GET /products/:productId/attachments/tree`

### Custom Data Structures

- **HashMap**
  - Implemented from scratch using separate chaining
  - Provides O(1) average-case lookups
  - Used as in-memory index of `productId → folder tree`
- **Attachment Tree**
  - Recursively models folder ⇢ files hierarchy
  - Supports unlimited nested folders
  - Generates JSON representation for API responses
- **Singleton Pattern (Nest provider)**
  - `AttachmentIndexService` acts as a singleton cache of all attachments in memory
  - Rebuilds from DB on server boot

### Swagger Documentation

- REST endpoints annotated with `@nestjs/swagger`
- Supports file uploads directly from UI

### Dockerized Database

- PostgreSQL 16 managed via Docker Compose
- Persistent volume mounted (`pg_assignment_data`)
- Preconfigured credentials:
  - **DB:** `product-mgnt`
  - **USER:** `test-user`
  - **PASSWORD:** `cyberpsychosis`

---

## Future Improvements / Missing Features

| Area                   | Description / Reason                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit Tests             | Unit testing implemented for `HashMap`, `AttachmentNode`, `Products` service and controller, `Attachments` service and controller . No integration or E2E test yet. |
| File Deletion          | Current version doesn’t delete physical files when removing a product or attachment.                                                                                |
| Advanced MIME Handling | Currently only uses file extension; no content-type detection implemented.                                                                                          |
| Authentication         | Not required for assessment.                                                                                                                                        |
