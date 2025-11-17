# Database Setup Guide

## VPS Database Information

**Production Database (VPS):**
- **PostgreSQL Version:** 17.7 (Docker container)
- **VPS IP:** 46.202.147.75
- **Port:** 5432
- **Database Name:** `digitaldog_db` ✅ (created)
- **Username:** `postgres`
- **Password:** `ZRETYFfw3oRrMbvpecaOHiT7ee56A9f9InwAVaU6iZTqkscdwb2UvOI9Xfpyn0UD`
- **Container:** `xccsc0okc88k008o8s8gwc88` (postgres:17-alpine)

## Setup Steps

### 1. Database Status

The database `digitaldog_db` has been created on the VPS PostgreSQL server. No additional database creation is needed.

### 2. Configure Environment Variables

Create `.env.local` file in the project root with the VPS connection:

```bash
# Production (VPS)
DATABASE_URL="postgresql://postgres:ZRETYFfw3oRrMbvpecaOHiT7ee56A9f9InwAVaU6iZTqkscdwb2UvOI9Xfpyn0UD@46.202.147.75:5432/digitaldog_db"
```

**For Local Development:**
If you want to use a local PostgreSQL instance instead:

```bash
# Local Development
DATABASE_URL="postgresql://username:password@localhost:5432/digitaldog_db"
```

### 3. Run Migration

```bash
npm run db:migrate
```

This will:
- Create the initial migration
- Apply it to your database
- Generate Prisma Client

### 4. Verify Setup

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

Or use the test script (requires tsx):

```bash
npx tsx scripts/test-db-connection.ts
```

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Example:
```
postgresql://digitaldog:password@localhost:5432/digitaldog_db
```

## Available Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Troubleshooting

### Error: Can't reach database server

- Ensure PostgreSQL is running
- Check connection string in `.env.local`
- Verify database exists

### Error: Migration failed

- Check database permissions
- Ensure user has CREATE TABLE permissions
- Review migration files in `prisma/migrations/`

