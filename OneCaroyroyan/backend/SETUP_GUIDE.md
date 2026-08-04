# OneCaroyroyan — Backend Setup Guide

This adds a real **Express.js + MySQL** backend to the OneCaroyroyan React
frontend, replacing the static arrays in `src/data/mockData.js` with actual
database-backed records, and replacing the fake "any password works" login
with real authentication.

---

## 1. What changed

### New: `/backend` (Express + MySQL API)

Every module that stores data now has a real MySQL table and a REST API:

| Module                    | Table(s)                                 | What it covers                                                            |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| Login / accounts          | `users`                                  | Real login (bcrypt password hashes), JWT sessions, role-based permissions |
| Residents                 | `residents`                              | Resident records (Residents page)                                         |
| Certificates              | `certificates`                           | Certificate requests, verification, issuance, cancellation                |
| Payments                  | `payments`                               | Official receipts, Treasurer validation                                   |
| Complaints                | `complaints`                             | Blotter case records                                                      |
| Correspondence            | `correspondence`                         | Incoming letters/memos log                                                |
| Settings → Barangay Info  | `barangay_info`                          | Barangay name, address, contact details                                   |
| Settings → Officials      | `officials`                              | Punong Barangay, Kagawads, SK Chair, Lupon members                        |
| Settings → Signatories    | `signatories`                            | Names printed on certificates/receipts                                    |
| Settings → Fees           | `fees`                                   | Certificate fee schedule (+ indigent rate)                                |
| Settings → Cert Templates | `cert_templates`                         | Certificate validity periods                                              |
| Settings → Numbering      | `numbering_series`                       | Auto-incrementing CR-/OR-/BLT-/COR- numbers                               |
| Settings → Users          | `users`                                  | Admin-only account management                                             |
| Settings → Backup & Logs  | `audit_logs`, `backups`                  | Activity trail, manual backup trigger                                     |
| Dashboards (all 5 roles)  | _(aggregation queries across the above)_ | Live stat cards, tables, and charts                                       |

### Changed in the frontend (`onecaroyroyan/src`)

- **`src/lib/api.js`** _(new)_ — fetch client for every endpoint above.
- **`src/context/AuthContext.jsx`** — now calls the real login API, stores a
  JWT, and re-validates it on page refresh instead of trusting a dropdown.
- **`src/pages/Login.jsx`** — the "Role" dropdown is gone (role now comes
  from the database); wrong credentials show a real error.
- **`src/routes/ProtectedRoute.jsx`** — waits for the stored-token check to
  finish before deciding to redirect, so refreshing `/app/...` doesn't
  bounce you to `/login`.
- **All 5 dashboards** (`src/pages/dashboards/Dashboard{Admin,Secretary,
Accounting,Treasurer,Captain}.jsx`) — stat cards, tables, and charts now
  come from `GET /api/dashboard/*` instead of the static `CERTS`, `PAYMENTS`,
  `COMPLAINTS`, `CORRESPONDENCE`, `MONTHLY` arrays.

### Still on mock data (not rewired in this pass)

The **Residents, Certificates, Payments, Complaints, Correspondence,
FinReports, CaptainReports, and Settings** _list/detail pages_ (as opposed
to the dashboards) still read from `mockData.js`, and the modal forms
(New Cert, Record Payment, Log Letter, New Blotter, etc.) don't yet call the
API. The backend endpoints for all of these already exist and are covered
by `src/lib/api.js` — wiring a page is a matter of swapping its
`import { X } from "../data/mockData"` for a `useEffect` + the matching
`xApi.list()` call, the same pattern used in the dashboards. See
**§6 "Wiring a remaining page"** below for a worked example.

---

## 2. Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8.x (or MariaDB 10.6+) running locally or reachable over the network

---

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your MySQL credentials:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=onecaroyroyan

JWT_SECRET=replace_with_a_long_random_string     # e.g. openssl rand -hex 32
CLIENT_ORIGIN=http://localhost:5173              # your frontend's dev URL
```

Create the database and tables, then seed it with starter data
(equivalent to what used to live in `mockData.js`, plus 5 real user
accounts):

```bash
npm run db:migrate   # creates the onecaroyroyan database + all tables
npm run db:seed       # populates residents, certs, payments, users, settings, etc.
```

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

Verify it's alive:

```bash
curl http://localhost:5000/api/health
# {"status":"ok","time":"..."}
```

### Default login credentials (from the seed script)

All seeded accounts share one password unless you change
`SEED_ADMIN_PASSWORD` in `.env` before seeding:

| Username    | Role               | Password      |
| ----------- | ------------------ | ------------- |
| `madmin`    | Administrator      | `Admin@12345` |
| `ldelacruz` | Barangay Secretary | `Admin@12345` |
| `acruz`     | Accounting Clerk   | `Admin@12345` |
| `rbautista` | Treasurer          | `Admin@12345` |
| `rsantos`   | Barangay Captain   | `Admin@12345` |

**Change these before any real deployment.** Sign in as `madmin`, go to
Settings → User Accounts, and reset each password (or use
`POST /api/settings/users/:id/reset-password`).

---

## 4. Frontend setup

```bash
cd onecaroyroyan
npm install
cp .env.example .env
```

`.env` just needs to point at your backend:

```ini
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open the printed localhost URL, and log in with one of the accounts above
(no more role dropdown — the server tells the frontend the role).

---

## 5. API reference

All endpoints below (except `/auth/login` and `/health`) require an
`Authorization: Bearer <token>` header, obtained from `/auth/login`.

<details>
<summary><strong>Auth</strong></summary>

| Method | Path                        | Notes                                        |
| ------ | --------------------------- | -------------------------------------------- |
| POST   | `/api/auth/login`           | `{ username, password }` → `{ token, user }` |
| GET    | `/api/auth/me`              | Current user from the token                  |
| POST   | `/api/auth/change-password` | `{ currentPassword, newPassword }`           |

</details>

<details>
<summary><strong>Residents</strong> — Admin, Barangay Secretary can write; everyone can read</summary>

| Method | Path                                                 | Notes                                                   |
| ------ | ---------------------------------------------------- | ------------------------------------------------------- |
| GET    | `/api/residents?search=&purok=&status=&page=&limit=` | Paginated list                                          |
| GET    | `/api/residents/:id`                                 |                                                         |
| POST   | `/api/residents`                                     | `{ fullName, age, gender, civilStatus, purok, status }` |
| PUT    | `/api/residents/:id`                                 | Partial update                                          |
| DELETE | `/api/residents/:id`                                 | Admin only                                              |

</details>

<details>
<summary><strong>Certificates</strong> — Admin, Barangay Secretary can write</summary>

| Method | Path                                      | Notes                                                                           |
| ------ | ----------------------------------------- | ------------------------------------------------------------------------------- |
| GET    | `/api/certificates?search=&status=&type=` |                                                                                 |
| POST   | `/api/certificates`                       | `{ residentId?, residentName, type, purpose, fee? }` — auto-generates `cert_no` |
| PATCH  | `/api/certificates/:id/verify`            | Pending → Processing, `verified=1`                                              |
| PATCH  | `/api/certificates/:id/issue`             | → Issued, stamps `issued_date`/`issued_by`                                      |
| PATCH  | `/api/certificates/:id/cancel`            | → Cancelled                                                                     |

</details>

<details>
<summary><strong>Payments</strong> — Admin, Accounting Clerk record; Admin/Treasurer validate</summary>

| Method | Path                                         | Notes                                                                     |
| ------ | -------------------------------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/payments?search=&validated=&from=&to=` |                                                                           |
| POST   | `/api/payments`                              | `{ payer, certNo?, type, amount, paymentDate? }` — auto-generates `or_no` |
| PATCH  | `/api/payments/:id/validate`                 | Treasurer sign-off                                                        |

</details>

<details>
<summary><strong>Complaints (Blotter)</strong> — Admin, Barangay Secretary</summary>

| Method | Path                              | Notes                                                                      |
| ------ | --------------------------------- | -------------------------------------------------------------------------- |
| GET    | `/api/complaints?search=&status=` |                                                                            |
| POST   | `/api/complaints`                 | `{ complainant, respondent, nature, kagawad? }` — auto-generates `case_no` |
| PATCH  | `/api/complaints/:id/status`      | `{ status }`                                                               |

</details>

<details>
<summary><strong>Correspondence</strong> — Admin, Barangay Secretary</summary>

| Method | Path                                  | Notes                                                               |
| ------ | ------------------------------------- | ------------------------------------------------------------------- |
| GET    | `/api/correspondence?search=&status=` |                                                                     |
| POST   | `/api/correspondence`                 | `{ sender, type, subject, digitized? }` — auto-generates `track_no` |
| PATCH  | `/api/correspondence/:id/status`      | `{ status }`                                                        |

</details>

<details>
<summary><strong>Settings</strong></summary>

| Method   | Path                                     | Who                                 |
| -------- | ---------------------------------------- | ----------------------------------- |
| GET/PUT  | `/api/settings/barangay-info`            | read: all · write: Admin, Secretary |
| GET/PUT  | `/api/settings/officials/:key`           | read: all · write: Admin, Secretary |
| GET/PUT  | `/api/settings/signatories/:key`         | read: all · write: Admin, Secretary |
| GET/PUT  | `/api/settings/fees/:id`                 | read: all · write: Admin, Treasurer |
| GET/PUT  | `/api/settings/cert-templates/:id`       | read: all · write: Admin, Secretary |
| GET/PUT  | `/api/settings/numbering/:key`           | read: all · write: Admin only       |
| GET/POST | `/api/settings/users`                    | Admin only                          |
| PATCH    | `/api/settings/users/:id/status`         | Admin only                          |
| POST     | `/api/settings/users/:id/reset-password` | Admin only                          |
| GET      | `/api/settings/audit-logs?limit=`        | all authenticated users             |
| GET/POST | `/api/settings/backup`                   | read: all · trigger: Admin only     |

</details>

<details>
<summary><strong>Dashboards</strong> — read-only aggregation, any authenticated user</summary>

| Method | Path                           |
| ------ | ------------------------------ |
| GET    | `/api/dashboard/admin`         |
| GET    | `/api/dashboard/secretary`     |
| GET    | `/api/dashboard/accounting`    |
| GET    | `/api/dashboard/treasurer`     |
| GET    | `/api/dashboard/captain`       |
| GET    | `/api/dashboard/monthly-trend` |

</details>

---

## 6. Wiring a remaining page (worked example)

The dashboards show the pattern to follow for the rest of the app. Example —
turning `Residents.jsx` from mock data into live data:

```jsx
// before
import { RESIDENTS } from "../data/mockData";
// ...
{RESIDENTS.map((r) => ...)}

// after
import { useEffect, useState } from "react";
import { residentsApi } from "../lib/api";

const [residents, setResidents] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  residentsApi.list().then((res) => setResidents(res.data)).finally(() => setLoading(false));
}, []);
// ...
{loading ? <Spinner /> : residents.map((r) => ...)}
```

For a modal that creates a record (e.g. "Add Resident"), call
`residentsApi.create({...})` in the submit handler, then re-fetch the list
(or pass an `onSaved` callback the way `DashboardAdmin.jsx` already does for
`openModal("newCert", { onSaved: load })`).

---

## 7. Notes on design decisions

- **Document numbers** (`CR-2026-0482`, `OR-2026-0201`, etc.) are generated
  server-side using a locked-row transaction (`utils/helpers.js →
nextDocumentNumber()`), so two clerks submitting at the same instant can't
  collide on the same number.
- **Every mutating action is audit-logged** (`audit_logs` table), which is
  what powers Settings → Backup & Logs → Recent System Activity.
- **Passwords** are hashed with bcrypt (10 rounds); plaintext passwords are
  never stored or logged.
- **Role permissions** are enforced server-side (middleware/auth.js →
  `requireRole`), not just hidden in the UI — even if someone bypasses the
  frontend, the API rejects out-of-role writes (as shown in the example
  below).

```bash
# Accounting Clerk trying to add a resident → 403, not allowed
curl -X POST http://localhost:5000/api/residents \
  -H "Authorization: Bearer <accounting-clerk-token>" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","age":30,"gender":"Male","civilStatus":"Single","purok":"Purok 1"}'
# {"message":"You do not have permission to perform this action"}
```

---

## 8. Troubleshooting

| Problem                                                  | Fix                                                                                |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `ECONNREFUSED` connecting to MySQL                       | Confirm MySQL is running and `DB_HOST`/`DB_PORT` in `.env` are correct             |
| `ER_ACCESS_DENIED_ERROR`                                 | Check `DB_USER`/`DB_PASSWORD`                                                      |
| Migration says database exists but tables are missing    | Run `npm run db:migrate` again — it's idempotent (`CREATE TABLE IF NOT EXISTS`)    |
| Frontend shows "Failed to fetch" on login                | Backend isn't running, or `VITE_API_URL` doesn't match its port                    |
| CORS error in the browser console                        | Set `CLIENT_ORIGIN` in the backend `.env` to match your frontend's dev URL exactly |
| Login succeeds but refreshing `/app` bounces to `/login` | Check the JWT hasn't expired (`JWT_EXPIRES_IN`, default 8h)                        |
