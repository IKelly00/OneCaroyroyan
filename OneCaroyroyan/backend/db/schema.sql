-- ============================================================
-- OneCaroyroyan Barangay E-Service & Management Information System
-- MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS onecaroyroyan
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE onecaroyroyan;

-- ------------------------------------------------------------
-- USERS  (login + Settings > User Accounts)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_code     VARCHAR(20)  NOT NULL UNIQUE,        -- e.g. USR-001
  full_name     VARCHAR(150) NOT NULL,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('Administrator','Barangay Secretary','Accounting Clerk','Treasurer','Barangay Captain') NOT NULL,
  status        ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  last_login    DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- RESIDENTS  (Resident Records)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS residents (
  id            VARCHAR(20) PRIMARY KEY,              -- e.g. 2024-001
  full_name     VARCHAR(150) NOT NULL,
  age           INT NOT NULL,
  gender        ENUM('Male','Female','Other') NOT NULL,
  civil_status  ENUM('Single','Married','Widow','Widower','Separated') NOT NULL,
  purok         VARCHAR(50) NOT NULL,
  status        ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_by    INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_residents_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_residents_purok (purok),
  INDEX idx_residents_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- CERTIFICATES  (Certificate requests / issuance)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  cert_no       VARCHAR(30) NOT NULL UNIQUE,          -- e.g. CR-2026-0481
  resident_id   VARCHAR(20) NULL,
  resident_name VARCHAR(150) NOT NULL,                -- kept denormalized for walk-in requests w/o a resident record
  type          ENUM('Barangay Clearance','Certificate of Residency','Certificate of Indigency',
                      'Business Clearance','Certificate of Good Moral Character') NOT NULL,
  purpose       VARCHAR(150) NOT NULL,
  fee           DECIMAL(10,2) NOT NULL DEFAULT 0,
  status        ENUM('Pending','For Verification','Processing','Issued','Cancelled') NOT NULL DEFAULT 'Pending',
  verified      TINYINT(1) NOT NULL DEFAULT 0,
  issued_by     INT NULL,
  request_date  DATE NOT NULL,
  issued_date   DATE NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cert_resident FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE SET NULL,
  CONSTRAINT fk_cert_issued_by FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_cert_status (status),
  INDEX idx_cert_type (type)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PAYMENTS  (Official Receipts)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  or_no         VARCHAR(30) NOT NULL UNIQUE,          -- e.g. OR-2026-0201
  payer         VARCHAR(150) NOT NULL,
  certificate_id INT NULL,
  cert_no       VARCHAR(30) NULL,
  type          VARCHAR(100) NOT NULL,
  amount        DECIMAL(10,2) NOT NULL,
  payment_date  DATE NOT NULL,
  validated     TINYINT(1) NOT NULL DEFAULT 0,
  validated_by  INT NULL,
  recorded_by   INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pay_cert FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE SET NULL,
  CONSTRAINT fk_pay_validated_by FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_pay_recorded_by FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_pay_date (payment_date)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- COMPLAINTS / BLOTTER
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  case_no       VARCHAR(30) NOT NULL UNIQUE,          -- e.g. BLT-2026-042
  complainant   VARCHAR(150) NOT NULL,
  respondent    VARCHAR(150) NOT NULL,
  nature        VARCHAR(150) NOT NULL,
  kagawad       VARCHAR(150) NULL,
  status        ENUM('Pending','Under Mediation','Resolved','Referred to PNP') NOT NULL DEFAULT 'Pending',
  filed_date    DATE NOT NULL,
  filed_by      INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_complaint_filed_by FOREIGN KEY (filed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_complaint_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- CORRESPONDENCE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS correspondence (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  track_no      VARCHAR(30) NOT NULL UNIQUE,          -- e.g. COR-2026-0089
  sender        VARCHAR(150) NOT NULL,
  type          VARCHAR(80) NOT NULL,
  subject       VARCHAR(200) NOT NULL,
  status        ENUM('Received','For Action','Acknowledged','Filed') NOT NULL DEFAULT 'Received',
  digitized     TINYINT(1) NOT NULL DEFAULT 0,
  received_date DATE NOT NULL,
  logged_by     INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_corr_logged_by FOREIGN KEY (logged_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_corr_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SETTINGS: Barangay Information (single row, id=1)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS barangay_info (
  id            INT PRIMARY KEY DEFAULT 1,
  barangay_name VARCHAR(150) NOT NULL,
  municipality  VARCHAR(100) NOT NULL,
  province      VARCHAR(100) NOT NULL,
  region        VARCHAR(100) NOT NULL,
  barangay_code VARCHAR(30)  NOT NULL,
  contact_no    VARCHAR(50)  NULL,
  email         VARCHAR(120) NULL,
  address       TEXT NULL,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_barangay_info_singleton CHECK (id = 1)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SETTINGS: Barangay Officials Directory
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officials (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  position_key  VARCHAR(60) NOT NULL UNIQUE,   -- e.g. punong_barangay, kagawad_1, sk_chair, lupon_members
  label         VARCHAR(100) NOT NULL,
  sub_label     VARCHAR(100) NULL,
  full_name     VARCHAR(200) NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SETTINGS: Document Signatories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS signatories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  signatory_key VARCHAR(60) NOT NULL UNIQUE,   -- e.g. certifying_official, prepared_by, or_received_by, dry_seal_label
  label         VARCHAR(150) NOT NULL,
  value         VARCHAR(200) NOT NULL,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SETTINGS: Certificate Fee Schedule
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fees (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  cert_type      VARCHAR(100) NOT NULL UNIQUE,
  fee            DECIMAL(10,2) NOT NULL DEFAULT 0,
  indigent_rate  DECIMAL(10,2) NOT NULL DEFAULT 0,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SETTINGS: Certificate Templates
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cert_templates (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL UNIQUE,
  validity     ENUM('6 Months','1 Year','One-time use') NOT NULL DEFAULT '6 Months',
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SETTINGS: Document Numbering / Series Configuration
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS numbering_series (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  series_key   VARCHAR(40) NOT NULL UNIQUE,   -- certificate, receipt, blotter, correspondence, resident
  label        VARCHAR(100) NOT NULL,
  prefix       VARCHAR(10) NOT NULL,
  year         VARCHAR(4)  NOT NULL,
  next_seq     INT NOT NULL DEFAULT 1,
  padding      INT NOT NULL DEFAULT 4,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- AUDIT LOGS  (Settings > Backup & Logs > Recent System Activity)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NULL,
  username     VARCHAR(60) NOT NULL,
  action       VARCHAR(255) NOT NULL,
  module       VARCHAR(60) NOT NULL,
  status       ENUM('Success','Failed') NOT NULL DEFAULT 'Success',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- BACKUP LOG  (Settings > Backup & Logs > Last Backup / Backup Now)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS backups (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  triggered_by  INT NULL,
  status        ENUM('Success','Failed') NOT NULL DEFAULT 'Success',
  note          VARCHAR(255) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_backup_user FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
