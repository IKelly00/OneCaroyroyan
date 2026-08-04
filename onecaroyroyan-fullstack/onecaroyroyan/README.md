# OneCaroyroyan — React Migration (All 5 Phases Complete)

The full Barangay E-Service MIS, ported from the original monolithic
`index.html` (inline CSS + vanilla JS) into a modular Vite + React app.

## Run it

```bash
npm install
npm run dev
```

Log in with any username/password — the role dropdown is the only field
that matters (same as the original; there's no real auth backend). Try
each of the 5 roles to see the different nav menus, dashboards, and
Settings permissions.

## What was built, by phase

**Phase 1 — Setup & Architecture**
Vite + React scaffold, `react-router-dom` + `chart.js` + `react-chartjs-2`
installed, `vite.config.js` with env-based `base` path for GitHub Pages /
Vercel / Render, `src/styles/global.css` (1:1 extraction of the original
`<style>` block).

**Phase 2 — Data & Routing**
`src/data/mockData.js` (every original data constant, unchanged),
`AuthContext` (replaces the global `currentRole`), `ProtectedRoute`,
and the full route tree in `App.jsx`.

**Phase 3 — App Shell**
`Sidebar.jsx` (dynamic per-role nav from `ROLE_MENUS`), `Topbar.jsx`,
and `AppShell.jsx` wiring them together around `<Outlet />`.

**Phase 4 — Pages & Dashboards**
All 5 role dashboards (`DashboardAdmin`, `DashboardSecretary`,
`DashboardAccounting`, `DashboardTreasurer`, `DashboardCaptain`), all list
pages (Residents, Certificates, Correspondence, Complaints, Payments,
FinReports, CaptainReports), and all Chart.js visualizations
(cash-flow line chart, cert-type / complaint-status doughnuts, monthly
bar charts) via `react-chartjs-2`.

**Phase 5 — Modals, Settings & Global UI State**
`ModalContext` + `ModalRoot` (replaces `openModal(id)`/`closeModal(id)`
DOM toggling) driving all 8 modals (New Cert, Cert Preview, Add Resident,
Log Letter, New Blotter, Record Payment, OR Preview, Print/Export), and
the full tabbed Settings page (8 tabs, Captain read-only mode, Admin-only
User Management).

## Two small, deliberate improvements over the original

These don't change any visual design — just wiring that the original
left as decoration:
- **Residents search box** now actually filters the table (it was a
  static `<input>` before).
- **Certificate type filter pills** now actually filter the table
  (same — no `onclick` was wired up originally).

## Known gaps vs. a production app (intentionally out of scope here)

- No backend / persistence — forms in modals don't save anywhere, matching
  the original (it didn't either).
- Certificate Preview and OR Preview modals always show the same static
  example data, matching the original's `showCertPreview()` /
  `showORPreview()` (they weren't wired to the row that was clicked).
- No real authentication — any username/password + role combo logs in.

## Deploying

```bash
npm run build                              # Vercel / Render (base "/")
VITE_BASE_PATH=/your-repo-name/ npm run build   # GitHub Pages
```
