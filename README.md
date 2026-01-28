# Pastebin Lite

A simple Pastebin-like web application that allows users to create and share text pastes with optional expiry and view limits.

## Tech Stack
- Next.js
- PostgreSQL (Neon)
- Prisma ORM
- Vercel

## Run Locally

1. Install dependencies
   npm install

2. Set environment variable
   DATABASE_URL=your_postgres_url

3. Initialize database
   npx prisma generate
   npx prisma db push

4. Start app
   npm run dev

## Persistence Layer
PostgreSQL (Neon) is used to ensure persistence across serverless requests.

## Design Decisions
- Expiry and view limits enforced at read time
- Atomic transactions to prevent race conditions
- Deterministic time support using x-test-now-ms for testing
