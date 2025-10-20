# Dokan - Minimal Account Manager

A minimalistic white-background account management web app built with **Next.js 14 (App Router)**, **TypeScript**, **TailwindCSS**, **Prisma + PostgreSQL (Neon)**, and **NextAuth.js** for authentication.

## Features

- **Secure login** - Only authenticated user (premnarayanbh@gmail.com) can access the app
- Manage customers who buy goods on credit
- Track purchases and payments per customer
- View running totals and transaction history
- Clean, minimal white design with Tailwind utilities

## Local Setup (PowerShell)

1. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update with your values:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `NEXTAUTH_SECRET` - Random secret for authentication
     - `ADMIN_EMAIL` - Admin user email
     - `ADMIN_PASSWORD` - Admin user password

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Generate Prisma client:**
   ```powershell
   npx prisma generate
   ```

4. **Run database migration (to Neon PostgreSQL):**
   ```powershell
   npx prisma migrate dev --name init
   ```

5. **Seed user:**
   ```powershell
   npx tsx prisma/seed.ts
   ```
   This creates the admin user from your `.env` file

6. **Start dev server:**
   ```powershell
   npm run dev
   ```

7. **Login:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You'll be redirected to `/login`
   - Login with credentials from your `.env` file (ADMIN_EMAIL / ADMIN_PASSWORD)

## Authentication

- **Login page:** Public access at `/login`
- **All other routes:** Protected (requires authentication)
- **Logout:** Click "Logout" button in header
- **Single admin account:** Configured via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

## PWA (Progressive Web App)

This app is a **fully installable PWA** that works offline!

### 📱 Install on Mobile (Android/iOS)

1. Open the app in Chrome/Safari: `https://your-domain.com`
2. Look for the browser prompt: **"Add to Home Screen"** or **"Install"**
3. Tap **Install** or **Add**
4. The app icon appears on your home screen
5. Launch it like a native app!

**Manual installation:**
- **Android Chrome:** Menu (⋮) → "Add to Home screen"
- **iOS Safari:** Share button → "Add to Home Screen"

### 💻 Install on Desktop (Chrome/Edge)

1. Open the app in Chrome or Edge
2. Look for the **install icon** (➕) in the address bar
3. Click **Install**
4. The app opens in its own window
5. Access it from your Start Menu/Applications folder

**Manual installation:**
- Chrome: Menu (⋮) → "Install Dokan..."
- Edge: Menu (⋯) → "Apps" → "Install this site as an app"

### ✨ PWA Features

- ✅ **Offline Support** - Service worker caches the app
- ✅ **Installable** - Works like a native app
- ✅ **Standalone Mode** - No browser UI, just the app
- ✅ **Auto-updates** - Gets latest version automatically
- ✅ **Fast Loading** - Cached assets load instantly

## Project Structure

```
dokan/
├── app/
│   ├── layout.tsx              # Root layout with header
│   ├── page.tsx                # Dashboard (customer list)
│   ├── globals.css             # Tailwind imports
│   ├── customers/
│   │   └── [id]/
│   │       └── page.tsx        # Customer detail & transaction forms
│   └── api/
│       └── customers/
│           ├── route.ts        # GET all customers, POST new customer
│           └── [id]/
│               ├── route.ts    # GET single customer
│               └── transactions/
│                   └── route.ts # POST new transaction
├── lib/
│   └── prisma.ts               # Prisma client singleton
├── prisma/
│   ├── schema.prisma           # Database schema (Customer, Transaction)
│   └── seed.ts                 # Seed script
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.cjs
└── postcss.config.cjs
```

## API Routes

- **GET** `/api/customers` - Fetch all customers with totals
- **POST** `/api/customers` - Add a new customer (body: `{ "name": "..." }`)
- **GET** `/api/customers/[id]` - Fetch single customer with transactions
- **POST** `/api/customers/[id]/transactions` - Add transaction (body: `{ "type": "purchase"|"payment", "item": "...", "amount": 12.5 }`)

## Notes

- Uses **PostgreSQL (Neon)** for production-ready database
- **Server Components** where possible (dashboard, detail page)
- **Server Actions** for form submissions (add customer, add transaction)
- All balance calculations done on-the-fly from transaction history
- **PWA enabled** - Service worker caches app for offline use (disabled in development)

## Troubleshooting

If TypeScript errors appear before running `npm install`:
- Install dependencies first: `npm install`
- Generate Prisma client: `npx prisma generate`
- Restart VS Code TypeScript server if needed
