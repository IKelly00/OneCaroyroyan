/**
 * db/seed.js
 * Populates the database with the same records that used to live in
 * src/data/mockData.js (CERTS, RESIDENTS, PAYMENTS, COMPLAINTS,
 * CORRESPONDENCE, SETTINGS_TABS content, etc.) so the app looks and
 * behaves the same as before, except the data now comes from MySQL.
 *
 * Usage: npm run db:seed   (run AFTER npm run db:migrate)
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const DEFAULT_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Barangay@2026";

async function seedUsers() {
  const users = [
    { code: "USR-001", name: "Maria Admin", username: "madmin", role: "Administrator" },
    { code: "USR-002", name: "Leonora Dela Cruz", username: "ldelacruz", role: "Barangay Secretary" },
    { code: "USR-003", name: "Alma Cruz", username: "acruz", role: "Accounting Clerk" },
    { code: "USR-004", name: "Rosario Bautista", username: "rbautista", role: "Treasurer" },
    { code: "USR-005", name: "Ricardo Santos", username: "rsantos", role: "Barangay Captain" },
  ];

  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const u of users) {
    await pool.query(
      `INSERT INTO users (user_code, full_name, username, password_hash, role, status)
       VALUES (?, ?, ?, ?, ?, 'Active')
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = VALUES(role)`,
      [u.code, u.name, u.username, hash, u.role]
    );
  }
  console.log(`✔ Seeded ${users.length} users (default password: "${DEFAULT_PASSWORD}")`);
}

async function seedResidents() {
  const residents = [
    ["2024-001", "Maria Santos", 34, "Female", "Married", "Purok 3", "Active"],
    ["2024-002", "Juan dela Cruz", 52, "Male", "Married", "Purok 1", "Active"],
    ["2024-003", "Ana Reyes", 28, "Female", "Single", "Purok 2", "Active"],
    ["2024-004", "Roberto Lim", 67, "Male", "Widower", "Purok 4", "Inactive"],
    ["2024-005", "Carla Mendoza", 41, "Female", "Married", "Purok 3", "Active"],
    ["2024-006", "Pedro Garcia", 23, "Male", "Single", "Purok 1", "Active"],
    ["2024-007", "Luz Villanueva", 55, "Female", "Married", "Purok 2", "Active"],
  ];
  for (const r of residents) {
    await pool.query(
      `INSERT INTO residents (id, full_name, age, gender, civil_status, purok, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)`,
      r
    );
  }
  console.log(`✔ Seeded ${residents.length} residents`);
}

async function seedCertificates() {
  const certs = [
    ["CR-2026-0481", "2024-001", "Maria Santos", "Barangay Clearance", "Employment", 50, "Issued", 1, "2026-03-01", "2026-03-01"],
    ["CR-2026-0480", null, "Jose Bautista", "Certificate of Residency", "Scholarship", 50, "For Verification", 0, "2026-03-01", null],
    ["CR-2026-0479", "2024-003", "Ana Reyes", "Business Clearance", "Business Permit", 200, "Issued", 1, "2026-02-28", "2026-02-28"],
    ["CR-2026-0478", "2024-006", "Pedro Garcia", "Certificate of Indigency", "Medical Assistance", 0, "Pending", 0, "2026-02-28", null],
    ["CR-2026-0477", "2024-007", "Luz Villanueva", "Barangay Clearance", "Employment", 50, "Issued", 1, "2026-02-27", "2026-02-27"],
    ["CR-2026-0476", "2024-004", "Roberto Lim", "Certificate of Residency", "Gov't Requirement", 50, "Cancelled", 0, "2026-02-27", null],
  ];
  for (const c of certs) {
    await pool.query(
      `INSERT INTO certificates (cert_no, resident_id, resident_name, type, purpose, fee, status, verified, request_date, issued_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      c
    );
  }
  console.log(`✔ Seeded ${certs.length} certificates`);
}

async function seedPayments() {
  const payments = [
    ["OR-2026-0201", "Maria Santos", "CR-2026-0481", "Barangay Clearance", 50, "2026-03-01", 1],
    ["OR-2026-0200", "Jose Bautista", "CR-2026-0480", "Certificate of Residency", 50, "2026-03-01", 0],
    ["OR-2026-0199", "Ana Reyes", "CR-2026-0479", "Business Clearance", 200, "2026-03-01", 1],
    ["OR-2026-0198", "Carla Mendoza", "CR-2026-0477", "Barangay Clearance", 50, "2026-02-28", 0],
    ["OR-2026-0197", "Luz Villanueva", "CR-2026-0476", "Certificate of Residency", 50, "2026-02-28", 1],
  ];
  for (const p of payments) {
    const [orNo, payer, cn, type, amount, date, validated] = p;
    const [[certRow]] = await pool.query("SELECT id FROM certificates WHERE cert_no = ?", [cn]);
    await pool.query(
      `INSERT INTO payments (or_no, payer, certificate_id, cert_no, type, amount, payment_date, validated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE validated = VALUES(validated)`,
      [orNo, payer, certRow ? certRow.id : null, cn, type, amount, date, validated]
    );
  }
  console.log(`✔ Seeded ${payments.length} payments`);
}

async function seedComplaints() {
  const complaints = [
    ["BLT-2026-042", "Pedro Garcia", "Roberto Lim", "Noise Complaint", "Hon. Ramon Reyes", "Under Mediation", "2026-03-01"],
    ["BLT-2026-041", "Ana Reyes", "Jose Bautista", "Property Dispute", "Hon. Celia Santos", "Pending", "2026-02-28"],
    ["BLT-2026-040", "Maria Santos", "Carla Mendoza", "Harassment", "Hon. Edgar Lim", "Resolved", "2026-02-27"],
    ["BLT-2026-039", "Luz Villanueva", "Unknown", "Theft", null, "Referred to PNP", "2026-02-26"],
    ["BLT-2026-038", "Juan dela Cruz", "Pedro Garcia", "Boundary Dispute", "Hon. Ramon Reyes", "Resolved", "2026-02-25"],
  ];
  for (const c of complaints) {
    await pool.query(
      `INSERT INTO complaints (case_no, complainant, respondent, nature, kagawad, status, filed_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      c
    );
  }
  console.log(`✔ Seeded ${complaints.length} complaints`);
}

async function seedCorrespondence() {
  const items = [
    ["COR-2026-0089", "DILG Office", "Memo Circular", "Anti-Drug Campaign Updates", "Received", 1, "2026-03-01"],
    ["COR-2026-0088", "City Hall", "Official Letter", "Budget Allocation FY2026", "For Action", 1, "2026-02-28"],
    ["COR-2026-0087", "Barangay 5", "Invitation", "Inter-Barangay Summit", "Acknowledged", 0, "2026-02-28"],
    ["COR-2026-0086", "DepEd Division", "Memo", "School Calendar Adjustments", "Filed", 1, "2026-02-27"],
    ["COR-2026-0085", "DOH CHO", "Advisory", "Dengue Prevention Drive", "For Action", 0, "2026-02-26"],
  ];
  for (const c of items) {
    await pool.query(
      `INSERT INTO correspondence (track_no, sender, type, subject, status, digitized, received_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      c
    );
  }
  console.log(`✔ Seeded ${items.length} correspondence records`);
}

async function seedBarangayInfo() {
  await pool.query(
    `INSERT INTO barangay_info (id, barangay_name, municipality, province, region, barangay_code, contact_no, email, address)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE barangay_name = VALUES(barangay_name)`,
    [
      "Barangay Caroyroyan",
      "Pili",
      "Camarines Sur",
      "Region V — Bicol Region",
      "051716014",
      "(054) 871-XXXX",
      "bgy.caroyroyan@pili.gov.ph",
      "Barangay Hall, Caroyroyan, Pili, Camarines Sur 4418",
    ]
  );
  console.log("✔ Seeded barangay_info");
}

async function seedOfficials() {
  const officials = [
    ["punong_barangay", "Punong Barangay", "Barangay Captain", "Hon. Ricardo M. Santos", 1],
    ["secretary", "Barangay Secretary", "Official secretary", "Leonora T. Dela Cruz", 2],
    ["treasurer", "Barangay Treasurer", "Official treasurer", "Rosario B. Bautista", 3],
    ["kagawad_1", "1st Kagawad", "SB Member", "Hon. Ramon Reyes", 4],
    ["kagawad_2", "2nd Kagawad", "SB Member", "Hon. Celia Santos", 5],
    ["kagawad_3", "3rd Kagawad", "SB Member", "Hon. Edgar Lim", 6],
    ["kagawad_4", "4th Kagawad", "SB Member", "Hon. Natividad Cruz", 7],
    ["kagawad_5", "5th Kagawad", "SB Member", "Hon. Ferdinand Bautista", 8],
    ["kagawad_6", "6th Kagawad", "SB Member", "Hon. Gloria Mendoza", 9],
    ["kagawad_7", "7th Kagawad", "SB Member", "Hon. Arturo Garcia", 10],
    ["sk_chair", "SK Chairperson", "Sangguniang Kabataan", "Mark A. Villanueva", 11],
    ["lupon_members", "Lupon Members", "Conciliation panel", "Hon. Ramon Reyes, Hon. Celia Santos, Hon. Edgar Lim", 12],
  ];
  for (const o of officials) {
    await pool.query(
      `INSERT INTO officials (position_key, label, sub_label, full_name, sort_order)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)`,
      o
    );
  }
  console.log(`✔ Seeded ${officials.length} officials`);
}

async function seedSignatories() {
  const sigs = [
    ["certifying_official", "Certifying Official", "HON. RICARDO M. SANTOS"],
    ["certifying_position", "Position Title", "Punong Barangay"],
    ["prepared_by", "Prepared By", "LEONORA T. DELA CRUZ"],
    ["prepared_by_position", "Prepared By Position", "Barangay Secretary"],
    ["or_received_by", "OR Received By", "ALMA T. CRUZ"],
    ["or_received_by_position", "OR Received By Position", "Accounting Clerk"],
    ["dry_seal_label", "Dry Seal Label", "Barangay Caroyroyan Official Seal"],
  ];
  for (const s of sigs) {
    await pool.query(
      `INSERT INTO signatories (signatory_key, label, value)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value)`,
      s
    );
  }
  console.log(`✔ Seeded ${sigs.length} signatories`);
}

async function seedFees() {
  const fees = [
    ["Barangay Clearance", 50, 0],
    ["Certificate of Residency", 50, 0],
    ["Certificate of Indigency", 0, 0],
    ["Business Clearance", 200, 100],
    ["Certificate of Good Moral", 50, 0],
  ];
  for (const f of fees) {
    await pool.query(
      `INSERT INTO fees (cert_type, fee, indigent_rate) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE fee = VALUES(fee), indigent_rate = VALUES(indigent_rate)`,
      f
    );
  }
  console.log(`✔ Seeded ${fees.length} fee schedule rows`);
}

async function seedCertTemplates() {
  const templates = [
    ["Barangay Clearance", "6 Months"],
    ["Certificate of Residency", "6 Months"],
    ["Certificate of Indigency", "6 Months"],
    ["Business Clearance", "1 Year"],
    ["Certificate of Good Moral Character", "6 Months"],
  ];
  for (const t of templates) {
    await pool.query(
      `INSERT INTO cert_templates (name, validity) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE validity = VALUES(validity)`,
      t
    );
  }
  console.log(`✔ Seeded ${templates.length} certificate templates`);
}

async function seedNumbering() {
  const series = [
    ["certificate", "Certificate Request No.", "CR", "2026", 482, 4],
    ["receipt", "Official Receipt No.", "OR", "2026", 202, 4],
    ["blotter", "Blotter Case No.", "BLT", "2026", 43, 3],
    ["correspondence", "Correspondence Track No.", "COR", "2026", 90, 4],
    ["resident", "Resident ID Format", "YYYY", "2024", 8, 3],
  ];
  for (const s of series) {
    await pool.query(
      `INSERT INTO numbering_series (series_key, label, prefix, year, next_seq, padding)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE next_seq = VALUES(next_seq)`,
      s
    );
  }
  console.log(`✔ Seeded ${series.length} numbering series`);
}

async function seedAuditLogs() {
  const [[{ c }]] = await pool.query("SELECT COUNT(*) AS c FROM audit_logs");
  if (c > 0) {
    console.log("✔ audit_logs already has data, skipping");
    return;
  }
  const logs = [
    ["acruz", "Recorded Payment — OR-2026-0201", "Payments"],
    ["madmin", "Issued Certificate CR-2026-0481", "Certificates"],
    ["ldelacruz", "Logged Correspondence COR-2026-0089", "Correspondence"],
    ["rbautista", "Validated Payment OR-2026-0199", "Payments"],
    ["madmin", "Added Resident Record 2024-007", "Residents"],
  ];
  for (const [username, action, module] of logs) {
    await pool.query(
      `INSERT INTO audit_logs (username, action, module, status) VALUES (?, ?, ?, 'Success')`,
      [username, action, module]
    );
  }
  console.log(`✔ Seeded ${logs.length} audit log rows`);
}

async function main() {
  try {
    await seedUsers();
    await seedResidents();
    await seedCertificates();
    await seedPayments();
    await seedComplaints();
    await seedCorrespondence();
    await seedBarangayInfo();
    await seedOfficials();
    await seedSignatories();
    await seedFees();
    await seedCertTemplates();
    await seedNumbering();
    await seedAuditLogs();
    console.log("\n✅ Seeding complete.");
  } catch (err) {
    console.error("✘ Seeding failed:", err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
