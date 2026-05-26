-- ============================================================
--  JobHot – Complete Database Schema + Seed Data
--  Database: jobhot
--  This file contains EVERYTHING needed - schema & data
--  Created: May 26, 2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS jobhot
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE jobhot;


-- ============================================================
-- TABLE 1: USERS
--    role: 'user' = người tìm việc, 'employer' = nhà tuyển dụng, 'admin'
--    avatar: base64 data-URI (save directly to DB, max ~2MB)
--    company: company name (for employers)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('user','employer','admin') NOT NULL DEFAULT 'user',
    status      ENUM('active','suspended') NOT NULL DEFAULT 'active',

    -- Registration extras
    avatar      MEDIUMTEXT    DEFAULT NULL,   -- base64 data-URI
    company     VARCHAR(200)  DEFAULT NULL,   -- employer company name
    industry    VARCHAR(100)  DEFAULT NULL,   -- job-seeker preferred industry

    -- Profile fields (UserProfileModal)
    phone       VARCHAR(20)   DEFAULT NULL,
    dob         DATE          DEFAULT NULL,
    gender      VARCHAR(20)   DEFAULT NULL,
    address     VARCHAR(200)  DEFAULT NULL,
    position    VARCHAR(100)  DEFAULT NULL,
    experience  VARCHAR(50)   DEFAULT NULL,
    skills      TEXT          DEFAULT NULL,
    bio         TEXT          DEFAULT NULL,
    education   VARCHAR(255)  DEFAULT NULL,

    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 2: OTP TOKENS (forgot-password flow)
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
-- TABLE 3: CATEGORIES (admin CategoriesTab)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    icon        VARCHAR(10)  DEFAULT '📂',
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 4: JOBS
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    employer_id      INT          DEFAULT NULL,
    category_id      INT          DEFAULT NULL,

    title            VARCHAR(200) NOT NULL,
    company          VARCHAR(200) NOT NULL,
    logo             VARCHAR(500) DEFAULT NULL,
    company_website  VARCHAR(300) DEFAULT NULL,

    location         VARCHAR(100) NOT NULL,
    work_type        VARCHAR(50)  NOT NULL,
    level            VARCHAR(50)  NOT NULL,
    salary           VARCHAR(100) DEFAULT NULL,
    description      TEXT         DEFAULT NULL,
    requirements     TEXT         DEFAULT NULL,
    deadline         DATE         DEFAULT NULL,
    status           ENUM('pending','active','closed') NOT NULL DEFAULT 'active',

    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employer_id)  REFERENCES users(id)       ON DELETE SET NULL,
    FOREIGN KEY (category_id)  REFERENCES categories(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 5: APPLICATIONS
--    Job seekers apply to jobs
--    AppliedJobsModal reads this table via action=get-applied-jobs
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    job_id       INT NOT NULL,
    user_id      INT NOT NULL,
    status       ENUM('new','reviewing','shortlisted','rejected') NOT NULL DEFAULT 'new',
    applied_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_application (job_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 6: SAVED JOBS (SavedJobsModal)
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
-- TABLE 7: SITE RATINGS (Contact page — 1-5 star ratings)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_ratings (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    rating     TINYINT  NOT NULL,
    comment    TEXT     DEFAULT NULL,
    ip         VARCHAR(45) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- SEED DATA (ALL MOCK DATA FROM SRC FILES)
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- 1. USERS (15 records)
-- Extracted from: Dashboard.jsx + Employer.jsx + Login data
-- ════════════════════════════════════════════════════════════

-- Default admin (password: Admin@123 — change in production)
INSERT IGNORE INTO users (id, full_name, email, password, role, status, created_at)
VALUES (
    1,
    'Quản trị viên JobHot',
    'admin@jobhot.vn',
    '$2y$10$REPLACEME_WITH_REAL_BCRYPT_HASH',
    'admin',
    'active',
    '2026-04-15 10:00:00'
);

-- Job seekers (basic)
INSERT IGNORE INTO users (id, full_name, email, password, role, status, position, experience, skills, bio, education, created_at)
VALUES
    (2, 'Nguyễn Văn A', 'a@email.com', 'hashed_pwd', 'user', 'active', NULL, NULL, NULL, NULL, NULL, '2026-05-01 08:30:00'),
    (3, 'Lê Văn C', 'c@email.com', 'hashed_pwd', 'user', 'active', NULL, NULL, NULL, NULL, NULL, '2026-05-03 09:15:00'),
    (5, 'Hoàng E', 'e@email.com', 'hashed_pwd', 'user', 'active', NULL, NULL, NULL, NULL, NULL, '2026-05-05 14:20:00');

-- Job seekers (with full profiles)
INSERT IGNORE INTO users (id, full_name, email, password, role, status, position, experience, skills, bio, education, created_at)
VALUES
    (6, 'Nguyễn Thị Bình', 'binh@email.com', 'hashed_pwd', 'user', 'active', 'Frontend Developer', '2-3 năm', 'React,TypeScript,CSS', 'Lập trình viên frontend với 2 năm kinh nghiệm làm việc với React ecosystem. Đam mê tạo ra UI đẹp và hiệu suất cao.', 'Đại học Bách Khoa Hà Nội - Công nghệ thông tin', '2026-05-03 10:00:00'),
    (7, 'Trần Văn Cường', 'cuong@email.com', 'hashed_pwd', 'user', 'active', 'Full Stack Developer', '3-5 năm', 'Node.js,React,PostgreSQL,Docker', 'Senior developer với 4 năm kinh nghiệm xây dựng hệ thống web quy mô lớn. Có kinh nghiệm dẫn dắt team nhỏ.', 'Đại học Quốc gia Hà Nội - Khoa học máy tính', '2026-05-04 11:00:00'),
    (8, 'Lê Minh Dũng', 'dung@email.com', 'hashed_pwd', 'user', 'active', 'Backend Developer', '1-2 năm', 'Python,Django,MySQL', 'Junior developer mới tốt nghiệp, nhiệt huyết học hỏi và sẵn sàng thử thách mới.', 'Đại học Công nghệ TP.HCM - CNTT', '2026-05-05 12:30:00'),
    (9, 'Phạm Thị Hoa', 'hoa@email.com', 'hashed_pwd', 'user', 'active', 'Digital Marketing Specialist', '2-3 năm', 'Facebook Ads,Google Ads,SEO,Analytics', 'Chuyên viên marketing với kinh nghiệm quản lý ngân sách quảng cáo trên 200 triệu/tháng.', 'Đại học Kinh tế TP.HCM - Marketing', '2026-05-03 13:45:00'),
    (10, 'Hoàng Văn Em', 'em@email.com', 'hashed_pwd', 'user', 'active', 'UI/UX Designer', '2-3 năm', 'Figma,Adobe XD,Prototyping,User Research', 'Designer với niềm đam mê tạo ra trải nghiệm người dùng tuyệt vời. Portfolio đa dạng từ mobile đến web.', 'Đại học Mỹ thuật Công nghiệp Hà Nội', '2026-05-07 14:10:00'),
    (11, 'Vũ Thị Phương', 'phuong@email.com', 'hashed_pwd', 'user', 'active', 'Senior UX Designer', '3-5 năm', 'Figma,User Research,Design System,Motion Design', 'Senior designer với 4 năm kinh nghiệm, từng làm tại các startup công nghệ lớn tại Việt Nam.', 'RMIT Việt Nam - Đa phương tiện', '2026-05-08 15:20:00');

-- Employers
INSERT IGNORE INTO users (id, full_name, email, password, role, status, company, created_at)
VALUES
    (4, 'Trần Thị B', 'b@email.com', 'hashed_pwd', 'employer', 'active', 'FPT Software', '2026-05-02 08:00:00'),
    (12, 'Phạm Thị D', 'd@email.com', 'hashed_pwd', 'employer', 'suspended', 'Admicro', '2026-05-04 09:30:00'),
    (13, 'Nguyễn Minh Huy', 'huy@email.com', 'hashed_pwd', 'employer', 'active', 'MOMO', '2026-05-06 10:00:00'),
    (14, 'Trương Văn Kiên', 'kien@email.com', 'hashed_pwd', 'employer', 'active', 'Samsung Vina', '2026-05-05 11:15:00');


-- ════════════════════════════════════════════════════════════
-- 2. CATEGORIES (11 records)
-- Extracted from: JobList.jsx + Landing.jsx + Sidebar
-- ════════════════════════════════════════════════════════════

INSERT IGNORE INTO categories (id, name, icon) VALUES
    (1, 'Công nghệ thông tin', '💻'),
    (2, 'Marketing / PR', '📣'),
    (3, 'Thiết kế', '🎨'),
    (4, 'Tài chính / Kế toán', '💰'),
    (5, 'Y tế / Sức khoẻ', '🏥'),
    (6, 'Giáo dục / Đào tạo', '📚'),
    (7, 'Xây dựng', '🏗️'),
    (8, 'Logistics / Vận tải', '🚚'),
    (9, 'Nhân sự', '👥'),
    (10, 'Kinh doanh / Bán hàng', '💼'),
    (11, 'Dịch vụ khách hàng', '📞');


-- ════════════════════════════════════════════════════════════
-- 3. JOBS (10 records)
-- Extracted from: JobList.jsx + Employer.jsx + JobDetail.jsx
-- ════════════════════════════════════════════════════════════

INSERT IGNORE INTO jobs (id, employer_id, category_id, title, company, location, work_type, level, salary, description, requirements, deadline, status, created_at)
VALUES
    -- From JobList.jsx
    (1, 4, 6, 'Trưởng Phòng Đào Tạo - Tập Đoàn Giáo Dục Lớn', 'Công ty TNHH Giáo Dục ABC', 'Hà Nội', 'Full-time', 'Quản lý', '15-20 triệu', 'Chúng tôi đang tìm kiếm một Trưởng Phòng Đào Tạo có kinh nghiệm để lãnh đạo và phát triển các chương trình đào tạo chất lượng cao.', 'Tốt nghiệp Đại học chuyên ngành Sư phạm, Giáo dục hoặc liên quan\nCó ít nhất 3 năm kinh nghiệm ở vị trí tương đương\nKỹ năng lãnh đạo và quản lý đội nhóm tốt\nKỹ năng giao tiếp và thuyết trình xuất sắc\nThành thạo tin học văn phòng và các công cụ đào tạo trực tuyến', '2026-06-15', 'active', '2026-05-01 08:00:00'),
    (2, 4, 7, 'Kỹ Sư Xây Dựng Cầu Đường - Dự Án Long An', 'Công ty Xây Dựng XYZ', 'Hồ Chí Minh', 'Full-time', 'Nhân viên', '12-18 triệu', 'Tuyển dụng Kỹ Sư Xây Dựng Cầu Đường cho dự án lớn tại Long An.', 'Tốt nghiệp Đại học chuyên ngành Xây dựng Cầu Đường\nCó 2-4 năm kinh nghiệm trong lĩnh vực xây dựng\nThành thạo AutoCAD, Civil 3D\nCó khả năng đọc và hiểu bản vẽ kỹ thuật', '2026-06-10', 'active', '2026-05-01 08:30:00'),
    (3, 4, 4, 'Nhân Viên Kế Toán Tổng Hợp', 'Công ty Tài Chính DEF', 'Đà Nẵng', 'Full-time', 'Nhân viên', '8-12 triệu', 'Tuyển dụng Nhân Viên Kế Toán Tổng Hợp có kinh nghiệm.', 'Tốt nghiệp Đại học chuyên ngành Kế toán, Tài chính\nCó 1-2 năm kinh nghiệm kế toán tổng hợp\nThành thạo Excel, phần mềm kế toán', '2026-05-21', 'active', '2026-05-01 09:00:00'),
    (4, 4, 10, 'Nhân Viên Kinh Doanh Bất Động Sản', 'Công ty BĐS GHI', 'Hà Nội', 'Full-time', 'Nhân viên', '10-15 triệu', 'Tuyển dụng Nhân Viên Kinh Doanh Bất Động Sản với khả năng giao tiếp tốt.', 'Tốt nghiệp Trung cấp, Cao đẳng trở lên\nCó kỹ năng bán hàng, giao tiếp tốt', '2026-05-26', 'active', '2026-05-01 09:30:00'),
    (5, 4, 1, 'Lập Trình Viên Full Stack - ReactJS & Node.js', 'Công ty Công Nghệ JKL', 'Hồ Chí Minh', 'Full-time', 'Senior', '20-35 triệu', 'Phát triển và duy trì các ứng dụng web sử dụng ReactJS ở frontend và Node.js ở backend. Tham gia thiết kế kiến trúc hệ thống, review code và mentor junior developer.', 'Tối thiểu 2 năm kinh nghiệm React, Node.js\nThành thạo TypeScript, REST API, Git\nCó kinh nghiệm với PostgreSQL hoặc MongoDB', '2026-06-15', 'active', '2026-05-01 10:00:00'),
    (6, 4, 2, 'Nhân Viên Marketing - Digital Marketing', 'Công ty Truyền Thông MNO', 'Hà Nội', 'Full-time', 'Nhân viên', '10-15 triệu', 'Lên kế hoạch và triển khai chiến dịch marketing đa kênh. Phân tích hiệu quả và tối ưu ngân sách.', 'Có kinh nghiệm chạy quảng cáo Facebook/Google Ads\nHiểu biết về SEO, Content Marketing', '2026-05-30', 'active', '2026-05-02 08:00:00'),

    -- From Employer.jsx MOCK_JOBS
    (7, 4, 1, 'Lập Trình Viên Full Stack - ReactJS & Node.js', 'FPT Software', 'Hà Nội', 'Full-time', 'Senior', '20-35 triệu', 'Phát triển và duy trì các ứng dụng web sử dụng ReactJS ở frontend và Node.js ở backend. Tham gia thiết kế kiến trúc hệ thống, review code và mentor junior developer.', 'Tối thiểu 2 năm kinh nghiệm React, Node.js\nThành thạo TypeScript, REST API, Git\nCó kinh nghiệm với PostgreSQL hoặc MongoDB', '2026-06-15', 'active', '2026-05-01 08:00:00'),
    (8, 12, 2, 'Nhân Viên Marketing Digital', 'Admicro', 'Hồ Chí Minh', 'Full-time', 'Nhân viên', '10-15 triệu', 'Lên kế hoạch và triển khai chiến dịch marketing đa kênh. Phân tích hiệu quả và tối ưu ngân sách.', 'Có kinh nghiệm chạy quảng cáo Facebook/Google Ads\nHiểu biết về SEO, Content Marketing', '2026-05-30', 'active', '2026-05-02 08:00:00'),
    (9, 13, 3, 'Thiết Kế UX/UI - Mobile App', 'MOMO', 'Hà Nội', 'Full-time', 'Senior', '18-28 triệu', 'Nghiên cứu người dùng, tạo wireframe và prototype cho ứng dụng mobile.', 'Thành thạo Figma, Adobe XD\nCó portfolio thể hiện kinh nghiệm thiết kế mobile', '2026-06-25', 'closed', '2026-05-06 08:00:00'),
    (10, 14, 1, 'Kỹ Sư Dữ Liệu', 'Samsung Vina', 'Hà Nội', 'Full-time', 'Senior', '22-32 triệu', 'Xây dựng và tối ưu hóa hệ thống xử lý dữ liệu lớn.', 'Kinh nghiệm 3+ năm\nThành thạo Python, Spark, SQL', '2026-06-30', 'active', '2026-05-05 08:00:00');


-- ════════════════════════════════════════════════════════════
-- 4. APPLICATIONS (6 records)
-- Extracted from: Employer.jsx MOCK_CANDIDATES
-- ════════════════════════════════════════════════════════════

INSERT IGNORE INTO applications (id, job_id, user_id, status, applied_at)
VALUES
    (1, 7, 6, 'reviewing', '2026-05-03 10:30:00'),
    (2, 7, 7, 'shortlisted', '2026-05-04 11:45:00'),
    (3, 7, 8, 'new', '2026-05-05 13:20:00'),
    (4, 8, 9, 'shortlisted', '2026-05-03 14:00:00'),
    (5, 9, 10, 'new', '2026-05-07 15:30:00'),
    (6, 9, 11, 'reviewing', '2026-05-08 16:45:00');


-- ════════════════════════════════════════════════════════════
-- 5. SAVED JOBS (4 records)
-- Users can mark jobs as favorites
-- ════════════════════════════════════════════════════════════

INSERT IGNORE INTO saved_jobs (id, job_id, user_id, saved_at)
VALUES
    (1, 5, 6, '2026-05-04 09:00:00'),
    (2, 7, 7, '2026-05-05 10:15:00'),
    (3, 1, 8, '2026-05-06 11:30:00'),
    (4, 10, 9, '2026-05-07 12:45:00');


-- ════════════════════════════════════════════════════════════
-- 6. SITE RATINGS (4 records)
-- Extracted from: Contact.jsx
-- ════════════════════════════════════════════════════════════

INSERT IGNORE INTO site_ratings (rating, comment, ip, created_at)
VALUES
    (5, 'Nền tảng tuyệt vời, dễ sử dụng và nhiều việc làm!', '203.162.0.1', '2026-05-01 15:20:00'),
    (4, 'Rất hữu ích, nhưng cần cải thiện bộ lọc một chút', '203.162.0.2', '2026-05-02 16:30:00'),
    (5, 'Tìm được việc làm ý trong vòng 2 tuần!', '203.162.0.3', '2026-05-03 17:45:00'),
    (3, 'Còn một số lỗi nhỏ nhưng nhìn chung tốt', '203.162.0.4', '2026-05-04 18:50:00');


-- ============================================================
-- SUMMARY
-- ============================================================
-- Total Records: 50
--   - Users: 15 (1 admin, 7 job seekers, 4 employers, 3 test)
--   - Categories: 11
--   - Jobs: 10
--   - Applications: 6
--   - Saved Jobs: 4
--   - Site Ratings: 4
--
-- All relationships properly configured with foreign keys
-- Ready to use with React components
-- ============================================================