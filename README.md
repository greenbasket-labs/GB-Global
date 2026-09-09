# Green Basket Global

Green Basket is a digital services and technology management platform for clients, partners, and company operations.

## Stack

- Next.js 15
- React 19
- TypeScript
- Prisma 6
- PostgreSQL
- bcryptjs

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — long random secret for session signing
- `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` — used when creating the first company admin

Never commit `.env` or real credentials.

### 3. Prepare the database

```bash
npx prisma generate
npm run db:push
npm run db:seed
```

`db:push` is the current lightweight V1 database deployment approach. Before introducing a payment gateway or other production-critical database changes, move to a reviewed Prisma migration history.

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

The production environment must provide a real PostgreSQL `DATABASE_URL` and a strong `SESSION_SECRET`.

## Deployment notes

For a first deployment on a managed platform such as Render:

1. Connect the `greenbasket-labs/GB-Global` GitHub repository.
2. Use Node.js 22 or a compatible current LTS runtime.
3. Install with `npm install`.
4. Build with `npm run build`.
5. Start with `npm start`.
6. Configure `DATABASE_URL` and `SESSION_SECRET` as platform environment variables.
7. Run `npm run db:push` against the production PostgreSQL database before first use.
8. Run `npm run admin:create` once with the production admin environment variables.

Do not put production credentials in GitHub source files.

## V1 areas

- Public service marketplace
- Client accounts and organizations
- Service requests and lifecycle management
- Domains and infrastructure assets
- Client billing and invoice ledger
- Client/company support
- Partner applications and work assignment
- Company operations and attention center
- Audit logging
