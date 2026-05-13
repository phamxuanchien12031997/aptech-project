<?php

/**
 * JobHot API - Backend PHP
 * ?action=login | register | forgot-password | verify-otp | reset-password
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Config ────────────────────────────────────────────────────────────────
define('DB_HOST',        'localhost');
define('DB_NAME',        'jobhot');
define('DB_USER',        'root');
define('DB_PASS',        '');
define('MAIL_HOST',      'smtp.gmail.com');
define('MAIL_PORT',      587);
define('MAIL_USER',      'your-email@gmail.com');   // ← Thay bằng email thật
define('MAIL_PASS',      'your-app-password');       // ← App Password Gmail
define('MAIL_FROM',      'noreply@jobhot.vn');
define('MAIL_FROM_NAME', 'JobHot');
define('JWT_SECRET',     'JOBHOT_SECRET_KEY_2026_CHANGE_IN_PROD');

// Tài khoản admin mặc định: admin@jobhot.vn / Admin@123
define('ADMIN_EMAIL',    'admin@jobhot.vn');
define('ADMIN_PASSWORD', 'Admin@123');
define('ADMIN_NAME',     'Quản trị viên JobHot');

// ── Helpers ───────────────────────────────────────────────────────────────
function respond(bool $ok, string $msg, array $data = [], int $code = 200): void
{
    http_response_code($code);
    echo json_encode(['success' => $ok, 'message' => $msg, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

function getDB(): PDO
{
    static $pdo = null;
    if (!$pdo) {
        try {
            $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            respond(false, 'DB error: ' . $e->getMessage(), [], 500);
        }
    }
    return $pdo;
}

function initDB(): void
{
    $db = getDB();
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user','employer','admin') NOT NULL DEFAULT 'user',
        industry VARCHAR(100) DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $db->exec("CREATE TABLE IF NOT EXISTS otp_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(150) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    // Tạo admin mặc định
    $s = $db->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
    $s->execute([ADMIN_EMAIL]);
    if (!$s->fetch()) {
        $s = $db->prepare("INSERT INTO users (full_name,email,password,role) VALUES (?,?,?,'admin')");
        $s->execute([ADMIN_NAME, ADMIN_EMAIL, password_hash(ADMIN_PASSWORD, PASSWORD_DEFAULT)]);
    }
}

function createToken(array $payload): string
{
    $h = rtrim(base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'])), '=');
    $p = rtrim(base64_encode(json_encode($payload)), '=');
    $s = rtrim(base64_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true)), '=');
    return "$h.$p.$s";
}

function sendOtpEmail(string $to, string $otp): bool
{
    $base = __DIR__ . '/PHPMailer/src/';
    if (file_exists($base . 'PHPMailer.php')) {
        require_once $base . 'Exception.php';
        require_once $base . 'PHPMailer.php';
        require_once $base . 'SMTP.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = MAIL_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = MAIL_USER;
            $mail->Password = MAIL_PASS;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = MAIL_PORT;
            $mail->CharSet = 'UTF-8';
            $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
            $mail->addAddress($to);
            $mail->Subject = 'Mã xác nhận JobHot';
            $mail->isHTML(true);
            $mail->Body = "<div style='font-family:sans-serif'><h2 style='color:#7c3aed'>JobHot</h2><p>Mã OTP của bạn:</p><h1 style='letter-spacing:8px;color:#111'>$otp</h1><p style='color:#6b7280;font-size:13px'>Hiệu lực 5 phút. Không chia sẻ mã này.</p></div>";
            $mail->send();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
    return mail($to, 'Mã xác nhận JobHot', "Mã OTP: $otp (có hiệu lực 5 phút)", 'From:' . MAIL_FROM);
}

// ── Router ────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(false, 'Chỉ hỗ trợ POST.', [], 405);
$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) respond(false, 'Body JSON không hợp lệ.', [], 400);
$action = $_GET['action'] ?? '';
initDB();

// LOGIN
if ($action === 'login') {
    $email = trim($body['email'] ?? '');
    $pass  = $body['password'] ?? '';
    if (!$email || !$pass) respond(false, 'Vui lòng nhập đủ thông tin.', [], 400);
    $s = getDB()->prepare("SELECT * FROM users WHERE email=? LIMIT 1");
    $s->execute([$email]);
    $u = $s->fetch();
    if (!$u || !password_verify($pass, $u['password'])) respond(false, 'Email hoặc mật khẩu không đúng.', [], 401);
    $token = createToken(['id' => $u['id'], 'email' => $u['email'], 'role' => $u['role'], 'name' => $u['full_name'], 'exp' => time() + 86400 * 7]);
    respond(true, 'Đăng nhập thành công.', ['token' => $token, 'role' => $u['role'], 'name' => $u['full_name'], 'email' => $u['email'], 'industry' => $u['industry']]);
}

// REGISTER
if ($action === 'register') {
    $name     = trim($body['fullName'] ?? '');
    $email    = trim($body['email'] ?? '');
    $pass     = $body['password'] ?? '';
    $role     = in_array($body['role'] ?? '', ['user', 'employer']) ? $body['role'] : 'user';
    $industry = trim($body['industry'] ?? '');
    if (!$name || !$email || !$pass) respond(false, 'Thiếu thông tin bắt buộc.', [], 400);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(false, 'Email không hợp lệ.', [], 400);
    if (strlen($pass) < 8) respond(false, 'Mật khẩu tối thiểu 8 ký tự.', [], 400);
    $db = getDB();
    $s = $db->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
    $s->execute([$email]);
    if ($s->fetch()) respond(false, 'Email này đã được sử dụng.', [], 409);
    $s = $db->prepare("INSERT INTO users (full_name,email,password,role,industry) VALUES (?,?,?,?,?)");
    $s->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT), $role, $industry ?: null]);
    respond(true, 'Đăng ký thành công.', ['role' => $role]);
}

// FORGOT PASSWORD - Gửi OTP
if ($action === 'forgot-password') {
    $email = trim($body['email'] ?? '');
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) respond(false, 'Email không hợp lệ.', [], 400);
    $db = getDB();
    $s = $db->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
    $s->execute([$email]);
    if (!$s->fetch()) respond(true, 'Nếu email tồn tại, mã OTP đã được gửi.'); // Không tiết lộ
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $db->prepare("UPDATE otp_tokens SET used=1 WHERE email=? AND used=0")->execute([$email]);
    $db->prepare("INSERT INTO otp_tokens (email,otp,expires_at) VALUES (?,?,?)")->execute([$email, $otp, date('Y-m-d H:i:s', time() + 300)]);
    if (!sendOtpEmail($email, $otp)) respond(false, 'Không thể gửi email. Thử lại sau.', [], 500);
    respond(true, 'Mã OTP đã được gửi đến email của bạn.');
}

// VERIFY OTP
if ($action === 'verify-otp') {
    $email = trim($body['email'] ?? '');
    $otp   = trim($body['otp'] ?? '');
    if (!$email || !$otp) respond(false, 'Thiếu thông tin.', [], 400);
    $db = getDB();
    $s  = $db->prepare("SELECT id FROM otp_tokens WHERE email=? AND otp=? AND used=0 AND expires_at>NOW() ORDER BY created_at DESC LIMIT 1");
    $s->execute([$email, $otp]);
    $row = $s->fetch();
    if (!$row) respond(false, 'Mã OTP không đúng hoặc đã hết hạn.', [], 400);
    $db->prepare("UPDATE otp_tokens SET used=1 WHERE id=?")->execute([$row['id']]);
    respond(true, 'Xác minh OTP thành công.');
}

// RESET PASSWORD
if ($action === 'reset-password') {
    $email = trim($body['email'] ?? '');
    $pass  = $body['password'] ?? '';
    if (!$email || !$pass) respond(false, 'Thiếu thông tin.', [], 400);
    if (strlen($pass) < 8) respond(false, 'Mật khẩu tối thiểu 8 ký tự.', [], 400);
    $s = getDB()->prepare("UPDATE users SET password=? WHERE email=?");
    $s->execute([password_hash($pass, PASSWORD_DEFAULT), $email]);
    if (!$s->rowCount()) respond(false, 'Không tìm thấy tài khoản.', [], 404);
    respond(true, 'Đặt lại mật khẩu thành công.');
}

respond(false, "Action '$action' không tồn tại.", [], 404);
