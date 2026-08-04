# OneCaroyroyan — Full-Stack Barangay E-Service & Management Information System

This package contains two projects:

- **`/backend`** — new Express.js + MySQL API (auth, residents, certificates,
  payments, complaints, correspondence, settings, and dashboard endpoints).
- **`/onecaroyroyan`** — the existing React/Vite frontend, updated to log in
  and show dashboard data through that new backend.

👉 **Start here: [`backend/SETUP_GUIDE.md`](./backend/SETUP_GUIDE.md)** — it
walks through installing MySQL, running the migration/seed scripts, starting
the API, and pointing the frontend at it, plus a full endpoint reference and
default login credentials.

## Quick start

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # then fill in your MySQL password + a JWT secret
npm run db:migrate
npm run db:seed
npm run dev                 # http://localhost:5000

# 2. Frontend (separate terminal)
cd onecaroyroyan
npm install
cp .env.example .env        # defaults already point at localhost:5000
npm run dev                 # http://localhost:5173
```

Log in with `madmin` / `Admin@12345` (Administrator) — see the setup guide
for the other 4 seeded accounts, one per role.
