-- ============================================================
--  JobHot – Full Database Schema
--  Database: jobhot
-- ============================================================

CREATE DATABASE IF NOT EXISTS jobhot
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE jobhot;


-- ============================================================
-- 1. USERS
--    Covers: job seekers, employers, admins.
--    Extra columns (dob, gender, phone, address, experience,
--    skills, bio, position) come from UserProfileModal.
--    `status` column added for admin lock/unlock feature.
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('user','employer','admin') NOT NULL DEFAULT 'user',
    status      ENUM('active','suspended') NOT NULL DEFAULT 'active',

    -- Profile fields (UserProfileModal)
    industry    VARCHAR(100)  DEFAULT NULL,
    phone       VARCHAR(20)   DEFAULT NULL,
    dob         DATE          DEFAULT NULL,
    gender      VARCHAR(20)   DEFAULT NULL,
    address     VARCHAR(200)  DEFAULT NULL,
    position    VARCHAR(100)  DEFAULT NULL,   -- e.g. "Frontend Developer"
    experience  VARCHAR(50)   DEFAULT NULL,   -- e.g. "2-3 năm"
    skills      TEXT          DEFAULT NULL,   -- comma-separated list
    bio         TEXT          DEFAULT NULL,
    education   VARCHAR(255)  DEFAULT NULL,

    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 2. OTP TOKENS  (forgot-password flow)
-- ============================================================
CREATE TABLE IF NOT EXISTS otp_tokens (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(150) NOT NULL,
    otp         VARCHAR(6)   NOT NULL,
    expires_at  DATETIME     NOT NULL,
    used        TINYINT(1)   DEFAULT 0,
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 3. CATEGORIES  (admin CategoriesTab – add / edit / delete)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    icon        VARCHAR(10)  DEFAULT '📂',
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 4. JOBS
--    Original columns: title, company, location, work_type,
--    level, salary, description.
--    Added from Employer/JobDetail mock data:
--      employer_id, category_id, requirements, deadline,
--      status, logo, company_website.
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    employer_id      INT          DEFAULT NULL,   -- FK → users(id)
    category_id      INT          DEFAULT NULL,   -- FK → categories(id)

    title            VARCHAR(200) NOT NULL,
    company          VARCHAR(200) NOT NULL,
    logo             VARCHAR(500) DEFAULT NULL,   -- URL/path to company logo
    company_website  VARCHAR(300) DEFAULT NULL,   -- e.g. https://fpt.com.vn

    location         VARCHAR(100) NOT NULL,
    work_type        VARCHAR(50)  NOT NULL,       -- Full-time / Part-time / …
    level            VARCHAR(50)  NOT NULL,       -- Junior / Senior / …
    salary           VARCHAR(100) DEFAULT NULL,
    description      TEXT         DEFAULT NULL,
    requirements     TEXT         DEFAULT NULL,   -- job requirements text
    deadline         DATE         DEFAULT NULL,
    status           ENUM('pending','active','closed') NOT NULL DEFAULT 'pending',

    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employer_id)  REFERENCES users(id)       ON DELETE SET NULL,
    FOREIGN KEY (category_id)  REFERENCES categories(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 5. APPLICATIONS
--    Tracks job seekers applying for jobs (AppliedJobsModal,
--    Employer candidate list).
--    Candidate profile snapshot fields come from
--    MOCK_CANDIDATES in Employer.jsx.
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    job_id       INT NOT NULL,
    user_id      INT NOT NULL,

    -- Application status (Employer candidate management)
    status       ENUM('new','reviewing','shortlisted','rejected') NOT NULL DEFAULT 'new',

    applied_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE KEY uq_application (job_id, user_id)   -- one application per job per user
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 6. SAVED JOBS  (SavedJobsModal – bookmark a job)
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_jobs (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    job_id   INT NOT NULL,
    user_id  INT NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE KEY uq_saved (job_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- SEED DATA
-- ============================================================

-- Default admin account  (password: Admin@123)
-- Replace the hash below with:  password_hash('Admin@123', PASSWORD_DEFAULT)
INSERT IGNORE INTO users (full_name, email, password, role, status)
VALUES (
    'Quản trị viên JobHot',
    'admin@jobhot.vn',
    '$2y$10$REPLACEME_WITH_REAL_BCRYPT_HASH',
    'admin',
    'active'
);

-- Default categories (from Dashboard DEFAULT_CATEGORIES)
INSERT IGNORE INTO categories (name, icon) VALUES
    ('Công nghệ thông tin', '💻'),
    ('Marketing / PR',      '📣'),
    ('Tài chính / Kế toán', '💰'),
    ('Y tế / Sức khoẻ',    '🏥'),
    ('Nhà nước / Công quyền','🏛️'),
    ('Thiết kế',            '🎨'),
    ('Giáo dục',            '📚'),
    ('Xây dựng',            '🏗️');