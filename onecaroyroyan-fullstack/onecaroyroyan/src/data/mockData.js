/*
 * mockData.js
 * ------------------------------------------------------------------
 * All the data that lived as global `const` declarations inside the
 * original <script> tag now lives here as named exports. Nothing in
 * this file has been rewritten — object shapes, keys, and values are
 * a 1:1 copy of the vanilla app's CERTS, RESIDENTS, PAYMENTS, etc.
 *
 * Two intentional renames for clarity (values untouched):
 *   IC   -> ICONS        (the old name was a little too terse)
 *
 * In the vanilla app these arrays were mutated directly (e.g. a
 * "Validate" button did `this.closest('.val-card').style.opacity`).
 * In React, components will instead copy these into `useState` and
 * update state immutably — see AuthContext.jsx (Phase 2) and the
 * page components (Phase 4) for that pattern.
 * ------------------------------------------------------------------
 */

/* ── UI ICON LIBRARY ─────────────────────────────────────────────
 * Small inline SVG strings, reused across tables (view/edit/print
 * buttons) and the report cards. Consumed via an <Icon> component
 * in Phase 3+ (dangerouslySetInnerHTML on a trusted, hard-coded
 * string we authored ourselves — never on user input).
 * ─────────────────────────────────────────────────────────────── */
export const ICONS = {
  eye:'<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit:'<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  print:'<svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  check:'<svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>',
  gavel:'<svg viewBox="0 0 24 24"><path d="m14 13-7.5 7.5a2.121 2.121 0 0 1-3-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><line x1="20" y1="4" x2="4" y2="20"/></svg>',
  file:'<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>',
};

/* ── STATUS BADGE COLOR MAP ─────────────────────────────────────── */
export const BADGE_MAP = {
  "Issued":"badge-green","For Verification":"badge-sky","Processing":"badge-blue","Pending":"badge-amber",
  "Cancelled":"badge-red","Active":"badge-green","Inactive":"badge-gray",
  "Resolved":"badge-green","Under Mediation":"badge-blue","Referred to PNP":"badge-violet",
  "Received":"badge-green","For Action":"badge-amber","Acknowledged":"badge-blue","Filed":"badge-gray",
  "Validated":"badge-green","Pending Validation":"badge-amber",
};

/* ── ROLE CONFIG ─────────────────────────────────────────────────
 * Each role sees a different sidebar menu. item.k is a short key
 * ("dashboard", "residents", "finreports"...) that becomes the route
 * segment under /app (see AppShell.jsx / App.jsx). item.page is the
 * original vanilla DOM id suffix (e.g. "dashboard-treasurer",
 * "fin-reports") — kept here for reference/diffing against the old
 * markup, but React Router uses item.k, not item.page.
 * ─────────────────────────────────────────────────────────────── */
export const ROLE_MENUS = {
  "Administrator":[{k:"dashboard",label:"Dashboard",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',page:"dashboard-admin"},{k:"residents",label:"Resident Records",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',page:"residents"},{k:"certificates",label:"Certificates",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',page:"certificates"},{k:"settings",label:"Settings",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',page:"settings"}],
  "Barangay Secretary":[{k:"dashboard",label:"Dashboard",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',page:"dashboard-secretary"},{k:"correspondence",label:"Correspondence",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',page:"correspondence"},{k:"complaints",label:"Complaints / Blotter",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',page:"complaints"},{k:"settings",label:"Settings",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',page:"settings"}],
  "Accounting Clerk":[{k:"dashboard",label:"Dashboard",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',page:"dashboard-accounting"},{k:"payments",label:"Payments & Receipts",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',page:"payments"},{k:"settings",label:"Settings",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',page:"settings"}],
  "Treasurer":[{k:"dashboard",label:"Dashboard",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',page:"dashboard-treasurer"},{k:"finreports",label:"Financial Reports",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',page:"fin-reports"},{k:"settings",label:"Settings",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',page:"settings"}],
  "Barangay Captain":[{k:"dashboard",label:"Dashboard",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',page:"dashboard-captain"},{k:"captainreports",label:"Summary Reports",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',page:"captain-reports"},{k:"settings",label:"Settings",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',page:"settings"}]
};

export const ROLE_COLORS = {"Administrator":"#1D4ED8","Barangay Secretary":"#059669","Accounting Clerk":"#7C3AED","Treasurer":"#D97706","Barangay Captain":"#E11D48"};

// Convenience list for the login screen's role <select> — derived
// from ROLE_MENUS so it can never drift out of sync with it.
export const ROLES = Object.keys(ROLE_MENUS);

/* ── CERTIFICATES ─────────────────────────────────────────────── */
export const CERTS = [
  {no:"CR-2026-0481",name:"Maria Santos",type:"Barangay Clearance",purpose:"Employment",date:"Mar 1, 2026",fee:50,status:"Issued",verified:true},
  {no:"CR-2026-0480",name:"Jose Bautista",type:"Certificate of Residency",purpose:"Scholarship",date:"Mar 1, 2026",fee:50,status:"For Verification",verified:false},
  {no:"CR-2026-0479",name:"Ana Reyes",type:"Business Clearance",purpose:"Business Permit",date:"Feb 28, 2026",fee:200,status:"Issued",verified:true},
  {no:"CR-2026-0478",name:"Pedro Garcia",type:"Certificate of Indigency",purpose:"Medical Assistance",date:"Feb 28, 2026",fee:0,status:"Pending",verified:false},
  {no:"CR-2026-0477",name:"Luz Villanueva",type:"Barangay Clearance",purpose:"Employment",date:"Feb 27, 2026",fee:50,status:"Issued",verified:true},
  {no:"CR-2026-0476",name:"Roberto Lim",type:"Certificate of Residency",purpose:"Gov't Requirement",date:"Feb 27, 2026",fee:50,status:"Cancelled",verified:false},
];

/* ── RESIDENTS ────────────────────────────────────────────────── */
export const RESIDENTS = [
  {id:"2024-001",name:"Maria Santos",age:34,gender:"Female",civil:"Married",purok:"Purok 3",status:"Active"},
  {id:"2024-002",name:"Juan dela Cruz",age:52,gender:"Male",civil:"Married",purok:"Purok 1",status:"Active"},
  {id:"2024-003",name:"Ana Reyes",age:28,gender:"Female",civil:"Single",purok:"Purok 2",status:"Active"},
  {id:"2024-004",name:"Roberto Lim",age:67,gender:"Male",civil:"Widower",purok:"Purok 4",status:"Inactive"},
  {id:"2024-005",name:"Carla Mendoza",age:41,gender:"Female",civil:"Married",purok:"Purok 3",status:"Active"},
  {id:"2024-006",name:"Pedro Garcia",age:23,gender:"Male",civil:"Single",purok:"Purok 1",status:"Active"},
  {id:"2024-007",name:"Luz Villanueva",age:55,gender:"Female",civil:"Married",purok:"Purok 2",status:"Active"},
];

/* ── PAYMENTS / OFFICIAL RECEIPTS ────────────────────────────────*/
export const PAYMENTS = [
  {or:"OR-2026-0201",payer:"Maria Santos",type:"Barangay Clearance",certNo:"CR-2026-0481",amount:50,date:"Mar 1, 2026",validated:true},
  {or:"OR-2026-0200",payer:"Jose Bautista",type:"Certificate of Residency",certNo:"CR-2026-0480",amount:50,date:"Mar 1, 2026",validated:false},
  {or:"OR-2026-0199",payer:"Ana Reyes",type:"Business Clearance",certNo:"CR-2026-0479",amount:200,date:"Mar 1, 2026",validated:true},
  {or:"OR-2026-0198",payer:"Carla Mendoza",type:"Barangay Clearance",certNo:"CR-2026-0477",amount:50,date:"Feb 28, 2026",validated:false},
  {or:"OR-2026-0197",payer:"Luz Villanueva",type:"Certificate of Residency",certNo:"CR-2026-0476",amount:50,date:"Feb 28, 2026",validated:true},
];

/* ── BLOTTER / COMPLAINTS ─────────────────────────────────────── */
export const COMPLAINTS = [
  {no:"BLT-2026-042",complainant:"Pedro Garcia",respondent:"Roberto Lim",nature:"Noise Complaint",kagawad:"Hon. Ramon Reyes",date:"Mar 1, 2026",status:"Under Mediation"},
  {no:"BLT-2026-041",complainant:"Ana Reyes",respondent:"Jose Bautista",nature:"Property Dispute",kagawad:"Hon. Celia Santos",date:"Feb 28, 2026",status:"Pending"},
  {no:"BLT-2026-040",complainant:"Maria Santos",respondent:"Carla Mendoza",nature:"Harassment",kagawad:"Hon. Edgar Lim",date:"Feb 27, 2026",status:"Resolved"},
  {no:"BLT-2026-039",complainant:"Luz Villanueva",respondent:"Unknown",nature:"Theft",kagawad:"—",date:"Feb 26, 2026",status:"Referred to PNP"},
  {no:"BLT-2026-038",complainant:"Juan dela Cruz",respondent:"Pedro Garcia",nature:"Boundary Dispute",kagawad:"Hon. Ramon Reyes",date:"Feb 25, 2026",status:"Resolved"},
];

/* ── CORRESPONDENCE ──────────────────────────────────────────── */
export const CORRESPONDENCE = [
  {trackNo:"COR-2026-0089",sender:"DILG Office",type:"Memo Circular",subject:"Anti-Drug Campaign Updates",date:"Mar 1, 2026",status:"Received",digitized:true},
  {trackNo:"COR-2026-0088",sender:"City Hall",type:"Official Letter",subject:"Budget Allocation FY2026",date:"Feb 28, 2026",status:"For Action",digitized:true},
  {trackNo:"COR-2026-0087",sender:"Barangay 5",type:"Invitation",subject:"Inter-Barangay Summit",date:"Feb 28, 2026",status:"Acknowledged",digitized:false},
  {trackNo:"COR-2026-0086",sender:"DepEd Division",type:"Memo",subject:"School Calendar Adjustments",date:"Feb 27, 2026",status:"Filed",digitized:true},
  {trackNo:"COR-2026-0085",sender:"DOH CHO",type:"Advisory",subject:"Dengue Prevention Drive",date:"Feb 26, 2026",status:"For Action",digitized:false},
];

/* ── MONTHLY TREND (used by every Chart.js panel) ────────────────*/
export const MONTHLY = [
  {m:"Sep",c:38,col:2900},{m:"Oct",c:45,col:3400},{m:"Nov",c:52,col:4100},
  {m:"Dec",c:61,col:4800},{m:"Jan",c:44,col:3200},{m:"Feb",c:58,col:4500},{m:"Mar",c:24,col:1850}
];

/* ── TREASURER > FINANCIAL REPORTS ───────────────────────────────*/
export const REPORT_TYPES = [
  {t:"Daily Collection Report",d:"Summary of all cash received per day",c:"bg-blue",period:"daily"},
  {t:"Monthly Financial Summary",d:"Total collections, disbursements, and balances",c:"bg-green",period:"monthly"},
  {t:"OR Validation Report",d:"List of all validated official receipts",c:"bg-violet",period:"monthly"},
  {t:"Certificate Fee Collection",d:"Collections broken down by certificate type",c:"bg-amber",period:"monthly"},
];

/* ── CAPTAIN > SUMMARY REPORTS ────────────────────────────────── */
export const CAPTAIN_REPORTS = [
  {t:"Certificate Issuance Report",d:"Monthly summary of all issued certificates",c:"bg-blue"},
  {t:"Financial Collection Report",d:"Daily and monthly cash collections",c:"bg-green"},
  {t:"Complaints & Blotter Report",d:"Case statuses and resolution summary",c:"bg-amber"},
  {t:"Correspondence Log",d:"All official communications received",c:"bg-violet"},
  {t:"Resident Demographics",d:"Population data by purok and category",c:"bg-cyan"},
  {t:"Annual Governance Report",d:"Executive overview of all operations",c:"bg-rose"},
];

/* ── SETTINGS TABS ────────────────────────────────────────────── */
export const SETTINGS_TABS = [
  {k:"barangay",label:"Barangay Information",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>'},
  {k:"officials",label:"Barangay Officials",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>'},
  {k:"signatory",label:"Document Signatories",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>'},
  {k:"certs",label:"Certificate Settings",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'},
  {k:"fees",label:"Fee Schedule",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'},
  {k:"numbering",label:"Document Numbering",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>'},
  {k:"users",label:"User Accounts",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'},
  {k:"backup",label:"Backup & Logs",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>'},
];

/* ── PRINT MODAL TITLES ───────────────────────────────────────────
 * Maps a print-context key (passed by whichever page/button opened
 * the print modal) to the dialog's heading. Mirrors the original
 * PRINT_TITLES object used by showPrintModal(type).
 * ─────────────────────────────────────────────────────────────── */
export const PRINT_TITLES = {
  "cert-log": "Certificate Issuance Log Report",
  "resident-masterlist": "Resident Masterlist Report",
  "correspondence-log": "Correspondence Log Report",
  "blotter-report": "Blotter Cases Report",
  "daily-collection": "Daily Collection Report",
  "payment-records": "Payment Records Report",
  "financial-report": "Financial Report",
  "all-financial": "All Financial Reports",
  "exec-summary": "Executive Summary Report",
  "all-reports": "All Summary Reports",
  "report": "Summary Report",
  "financial": "Financial Report",
};
