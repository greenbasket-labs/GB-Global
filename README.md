# Green Basket Global

Green Basket Global is a digital services and technology management platform for clients, partners, and company operations.

> **Portfolio context:** This repository demonstrates full-stack product engineering across customer workflows, company operations, infrastructure assets, billing, support, and auditability.

## What it demonstrates

- Public service marketplace
- Client accounts and organizations
- Service requests and lifecycle management
- Domains and infrastructure assets
- Client billing and invoice ledger
- Client/company support workflows
- Partner applications and work assignment
- Company operations and attention center
- Audit logging
- Integration with the wider Green Basket / SkulGo product ecosystem

## Architecture

The application is built as a modern full-stack web application with a relational data model and server-side authentication.

### Stack

- Next.js 15
- React 19
- TypeScript
- Prisma 6
- PostgreSQL
- Secure session authentication

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and configure the required values:

- `DATABASE_URL`
- `SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_NAME`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SCHOOL_DEMO_URL` (optional)

Never commit `.env` or real credentials.

### 3. Prepare the database

```bash
npx prisma generate
npm run db:push
npm run db:seed
```

### 4. Create the first company admin

```bash
npm run admin:create
```

### 5. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

Production environments should provide a real PostgreSQL database and a strong session secret through platform environment variables.

## Product relationship

Green Basket Global is the company/platform context around several technology projects. It should not be confused with SkulGo itself: **SkulGo is a school-management product with its own product identity and architecture.**

## School system demo

The public school-system entry can use `NEXT_PUBLIC_SCHOOL_DEMO_URL`. Keep demo environments separated from real school data.

## Deployment

The project is designed for managed deployment platforms such as Render. Production configuration belongs in environment variables rather than source control.

## Security note

This is an operational application, so authentication, authorization, database access, secrets, billing, and audit trails should be treated as security-sensitive areas. Do not use real customer credentials or personal data in development fixtures.

## Author

**Mohammed Musbahu Abdullahi**
