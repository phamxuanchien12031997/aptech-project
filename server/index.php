<?php
 
/**
 * JobHot API - Backend PHP
 * ?action=login | register | forgot-password | verify-otp | reset-password | get-jobs
 */
 
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
 
// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
 
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
 
 
// ─────────────────────────────────────────────
// HELPER: respond
// Sends a JSON response and stops the script.
//
// Parameters:
//   $ok   - true = success, false = failure
//   $msg  - message string shown to the frontend
//   $data - optional array of extra data (e.g. token, job list)
//   $code - HTTP status code (200, 400, 401, etc.)
// ─────────────────────────────────────────────
 
function respond(bool $ok, string $msg, array $data = [], int $code = 200): void
{
    http_response_code($code);
    echo json_encode(['success' => $ok, 'message' => $msg, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}
 
 
// ─────────────────────────────────────────────
// HELPER: getDB
// Returns a single shared PDO database connection.
// The "static $pdo" means it only connects once per request,
// no matter how many times getDB() is called.
// ─────────────────────────────────────────────
 
function getDB(): PDO
{
    static $pdo = null;
 
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $e) {
            respond(false, 'DB error: ' . $e->getMessage(), [], 500);
        }
    }
 
    return $pdo;
}
 
 
// ─────────────────────────────────────────────
// HELPER: initDB
// Creates the required tables if they do not exist yet,
// and inserts the default admin account if it is missing.
// This runs on every request so the app is self-initialising.
// ─────────────────────────────────────────────
 
function initDB(): void
{
    $db = getDB();
 
    // Users table — stores all registered accounts
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            full_name  VARCHAR(100)  NOT NULL,
            email      VARCHAR(150)  NOT NULL UNIQUE,
            password   VARCHAR(255)  NOT NULL,
            role       ENUM('user','employer','admin') NOT NULL DEFAULT 'user',
            industry   VARCHAR(100)  DEFAULT NULL,
            created_at DATETIME      DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
 
    // OTP tokens table — stores one-time passwords for password reset
    $db->exec("
        CREATE TABLE IF NOT EXISTS otp_tokens (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            email      VARCHAR(150) NOT NULL,
            otp        VARCHAR(6)   NOT NULL,
            expires_at DATETIME     NOT NULL,
            used       TINYINT(1)   DEFAULT 0,
            created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
 
    // Jobs table — stores all job listings posted by employers
    // work_type matches the filter ids from the React sidebar:
    //   fulltime | parttime | seasonal | freelancer | intern
    // level matches:
    //   fresher | staff | leader | manager | director
    $db->exec("
        CREATE TABLE IF NOT EXISTS jobs (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            title       VARCHAR(200) NOT NULL,
            company     VARCHAR(200) NOT NULL,
            location    VARCHAR(100) NOT NULL,
            work_type   VARCHAR(50)  NOT NULL,
            level       VARCHAR(50)  NOT NULL,
            salary      VARCHAR(100) DEFAULT NULL,
            description TEXT         DEFAULT NULL,
            created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
 
    // Create the default admin account if it does not exist yet
    $check = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $check->execute([ADMIN_EMAIL]);
 
    if (!$check->fetch()) {
        $insert = $db->prepare("
            INSERT INTO users (full_name, email, password, role)
            VALUES (?, ?, ?, 'admin')
        ");
        $insert->execute([ADMIN_NAME, ADMIN_EMAIL, password_hash(ADMIN_PASSWORD, PASSWORD_DEFAULT)]);
    }
}
 
 
// ─────────────────────────────────────────────
// HELPER: createToken
// Creates a simple JWT token string.
// The token encodes the user's id, email, role, and an expiry time.
// The frontend stores this and sends it with future requests
// so the server knows who is logged in.
// ─────────────────────────────────────────────
 
function createToken(array $payload): string
{
    $header    = rtrim(base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'])), '=');
    $body      = rtrim(base64_encode(json_encode($payload)), '=');
    $signature = rtrim(base64_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true)), '=');
 
    return "$header.$body.$signature";
}
 
 
// ─────────────────────────────────────────────
// HELPER: sendOtpEmail
// Sends a 6-digit OTP code to the given email address.
// Uses PHPMailer if it is installed in /PHPMailer/src/,
// otherwise falls back to PHP's built-in mail() function.
// ─────────────────────────────────────────────
 
function sendOtpEmail(string $to, string $otp): bool
{
    $phpMailerPath = __DIR__ . '/PHPMailer/src/';
 
    if (file_exists($phpMailerPath . 'PHPMailer.php')) {
        require_once $phpMailerPath . 'Exception.php';
        require_once $phpMailerPath . 'PHPMailer.php';
        require_once $phpMailerPath . 'SMTP.php';
 
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
 
        try {
            $mail->isSMTP();
            $mail->Host       = MAIL_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = MAIL_USER;
            $mail->Password   = MAIL_PASS;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = MAIL_PORT;
            $mail->CharSet    = 'UTF-8';
            $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
            $mail->addAddress($to);
            $mail->Subject = 'Mã xác nhận JobHot';
            $mail->isHTML(true);
            $mail->Body =
                "<div style='font-family:sans-serif'>" .
                "<h2 style='color:#7c3aed'>JobHot</h2>" .
                "<p>Mã OTP của bạn:</p>" .
                "<h1 style='letter-spacing:8px;color:#111'>$otp</h1>" .
                "<p style='color:#6b7280;font-size:13px'>Hiệu lực 5 phút. Không chia sẻ mã này.</p>" .
                "</div>";
            $mail->send();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
 
    // Fallback: use PHP's built-in mail() if PHPMailer is not installed.
    // Note: built-in mail() often ends up in spam — PHPMailer via SMTP is strongly recommended.
    return mail($to, 'Mã xác nhận JobHot', "Mã OTP: $otp (có hiệu lực 5 phút)", 'From:' . MAIL_FROM);
}
 
 
// ─────────────────────────────────────────────
// ROUTER SETUP
// Read the action from the URL: ?action=login, ?action=get-jobs, etc.
// All write actions (login, register, etc.) require POST.
// get-jobs is a GET request so it can be called from the browser directly.
// ─────────────────────────────────────────────
 
$action = isset($_GET['action']) ? $_GET['action'] : '';
 
// Make sure the database and tables exist before handling any action
initDB();
 
 
// ─────────────────────────────────────────────
// ACTION: get-jobs  (GET request)
// Called by the React sidebar whenever a filter changes.
// Accepts three optional query parameters:
//   ?action=get-jobs&workType=fulltime&level=staff&location=Hà Nội
// Returns a JSON array of matching job rows.
//
// Example fetch from React:
//   fetch('/api/index.php?action=get-jobs&workType=fulltime&level=staff')
//     .then(res => res.json())
//     .then(data => onFilter(data.data));  // data.data is the jobs array
// ─────────────────────────────────────────────
 
if ($action === 'get-jobs') {
 
    // Read the three optional filter values from the URL query string.
    // If a parameter is not in the URL, it will be an empty string.
    $workType    = isset($_GET['workType'])  ? trim($_GET['workType'])  : '';
    $level       = isset($_GET['level'])     ? trim($_GET['level'])     : '';
    $locationVal = isset($_GET['location'])  ? trim($_GET['location'])  : '';
 
    // Start building the SQL query.
    // We always select all jobs, then narrow down with WHERE clauses
    // only for the filters that were actually provided.
    $sql    = "SELECT * FROM jobs WHERE 1=1";
 
    // "WHERE 1=1" is a harmless always-true condition that makes it easy
    // to keep appending "AND ..." without worrying about whether it is
    // the first condition or not.
 
    // $params holds the values that will be safely bound to the query
    // by PDO — this prevents SQL injection.
    $params = [];
 
    if ($workType !== '') {
        $sql      = $sql . " AND work_type = ?";
        $params[] = $workType;
    }
 
    if ($level !== '') {
        $sql      = $sql . " AND level = ?";
        $params[] = $level;
    }
 
    if ($locationVal !== '') {
        // Use LIKE so "Hà Nội" also matches "Hà Nội, Quận 1" etc.
        $sql      = $sql . " AND location LIKE ?";
        $params[] = '%' . $locationVal . '%';
    }
 
    // Always show newest jobs first
    $sql = $sql . " ORDER BY created_at DESC";
 
    $statement = getDB()->prepare($sql);
    $statement->execute($params);
    $jobs = $statement->fetchAll();
 
    // Return the jobs array inside the standard response envelope.
    // In React: response.data.data is the jobs array.
    respond(true, 'Lấy danh sách việc làm thành công.', $jobs);
}
 
 
// ─────────────────────────────────────────────
// All actions below require a POST request with a JSON body.
// ─────────────────────────────────────────────
 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Chỉ hỗ trợ POST.', [], 405);
}
 
$body = json_decode(file_get_contents('php://input'), true);
 
if (!is_array($body)) {
    respond(false, 'Body JSON không hợp lệ.', [], 400);
}
 
 
// ─────────────────────────────────────────────
// ACTION: login
// Checks email + password and returns a JWT token on success.
// ─────────────────────────────────────────────
 
if ($action === 'login') {
    $email = trim(isset($body['email'])    ? $body['email']    : '');
    $pass  =      isset($body['password']) ? $body['password'] : '';
 
    if (!$email || !$pass) {
        respond(false, 'Vui lòng nhập đủ thông tin.', [], 400);
    }
 
    $statement = getDB()->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $statement->execute([$email]);
    $user = $statement->fetch();
 
    if (!$user || !password_verify($pass, $user['password'])) {
        respond(false, 'Email hoặc mật khẩu không đúng.', [], 401);
    }
 
    $token = createToken([
        'id'    => $user['id'],
        'email' => $user['email'],
        'role'  => $user['role'],
        'name'  => $user['full_name'],
        'exp'   => time() + 86400 * 7,   // token expires in 7 days
    ]);
 
    respond(true, 'Đăng nhập thành công.', [
        'token'    => $token,
        'role'     => $user['role'],
        'name'     => $user['full_name'],
        'email'    => $user['email'],
        'industry' => $user['industry'],
    ]);
}
 
 
// ─────────────────────────────────────────────
// ACTION: register
// Creates a new user account.
// ─────────────────────────────────────────────
 
if ($action === 'register') {
    $name     = trim(isset($body['fullName'])  ? $body['fullName']  : '');
    $email    = trim(isset($body['email'])     ? $body['email']     : '');
    $pass     =      isset($body['password'])  ? $body['password']  : '';
    $industry = trim(isset($body['industry'])  ? $body['industry']  : '');
 
    // Only allow "user" or "employer" roles — never "admin" from registration
    $roleInput = isset($body['role']) ? $body['role'] : '';
    if ($roleInput === 'user' || $roleInput === 'employer') {
        $role = $roleInput;
    } else {
        $role = 'user';
    }
 
    if (!$name || !$email || !$pass) {
        respond(false, 'Thiếu thông tin bắt buộc.', [], 400);
    }
 
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(false, 'Email không hợp lệ.', [], 400);
    }
 
    if (strlen($pass) < 8) {
        respond(false, 'Mật khẩu tối thiểu 8 ký tự.', [], 400);
    }
 
    $db = getDB();
 
    $check = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $check->execute([$email]);
 
    if ($check->fetch()) {
        respond(false, 'Email này đã được sử dụng.', [], 409);
    }
 
    $insert = $db->prepare("
        INSERT INTO users (full_name, email, password, role, industry)
        VALUES (?, ?, ?, ?, ?)
    ");
    $insert->execute([
        $name,
        $email,
        password_hash($pass, PASSWORD_DEFAULT),
        $role,
        $industry !== '' ? $industry : null,
    ]);
 
    respond(true, 'Đăng ký thành công.', ['role' => $role]);
}
 
 
// ─────────────────────────────────────────────
// ACTION: forgot-password
// Generates a 6-digit OTP and emails it to the user.
// We always return a success message even if the email is not found
// so attackers cannot tell which emails are registered.
// ─────────────────────────────────────────────
 
if ($action === 'forgot-password') {
    $email = trim(isset($body['email']) ? $body['email'] : '');
 
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(false, 'Email không hợp lệ.', [], 400);
    }
 
    $db = getDB();
 
    $check = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $check->execute([$email]);
 
    if (!$check->fetch()) {
        // Do not reveal whether the email exists — return a generic success message
        respond(true, 'Nếu email tồn tại, mã OTP đã được gửi.');
    }
 
    // Generate a random 6-digit code, zero-padded (e.g. "004821")
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
 
    // Invalidate any previous unused OTPs for this email
    $db->prepare("UPDATE otp_tokens SET used = 1 WHERE email = ? AND used = 0")->execute([$email]);
 
    // Insert the new OTP, valid for 5 minutes (300 seconds)
    $db->prepare("INSERT INTO otp_tokens (email, otp, expires_at) VALUES (?, ?, ?)")
       ->execute([$email, $otp, date('Y-m-d H:i:s', time() + 300)]);
 
    if (!sendOtpEmail($email, $otp)) {
        respond(false, 'Không thể gửi email. Thử lại sau.', [], 500);
    }
 
    respond(true, 'Mã OTP đã được gửi đến email của bạn.');
}
 
 
// ─────────────────────────────────────────────
// ACTION: verify-otp
// Checks that the OTP the user typed matches a valid, unused,
// not-yet-expired token in the database.
// ─────────────────────────────────────────────
 
if ($action === 'verify-otp') {
    $email = trim(isset($body['email']) ? $body['email'] : '');
    $otp   = trim(isset($body['otp'])   ? $body['otp']   : '');
 
    if (!$email || !$otp) {
        respond(false, 'Thiếu thông tin.', [], 400);
    }
 
    $db = getDB();
 
    $statement = $db->prepare("
        SELECT id FROM otp_tokens
        WHERE email = ?
          AND otp = ?
          AND used = 0
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
    ");
    $statement->execute([$email, $otp]);
    $row = $statement->fetch();
 
    if (!$row) {
        respond(false, 'Mã OTP không đúng hoặc đã hết hạn.', [], 400);
    }
 
    // Mark the OTP as used so it cannot be reused
    $db->prepare("UPDATE otp_tokens SET used = 1 WHERE id = ?")->execute([$row['id']]);
 
    respond(true, 'Xác minh OTP thành công.');
}
 
 
// ─────────────────────────────────────────────
// ACTION: reset-password
// Updates the user's password after OTP verification.
// ─────────────────────────────────────────────
 
if ($action === 'reset-password') {
    $email = trim(isset($body['email'])    ? $body['email']    : '');
    $pass  =      isset($body['password']) ? $body['password'] : '';
 
    if (!$email || !$pass) {
        respond(false, 'Thiếu thông tin.', [], 400);
    }
 
    if (strlen($pass) < 8) {
        respond(false, 'Mật khẩu tối thiểu 8 ký tự.', [], 400);
    }
 
    $statement = getDB()->prepare("UPDATE users SET password = ? WHERE email = ?");
    $statement->execute([password_hash($pass, PASSWORD_DEFAULT), $email]);
 
    if ($statement->rowCount() === 0) {
        respond(false, 'Không tìm thấy tài khoản.', [], 404);
    }
 
    respond(true, 'Đặt lại mật khẩu thành công.');
}
 
 
// ─────────────────────────────────────────────
// FALLBACK
// If no action matched, return a 404 error.
// ─────────────────────────────────────────────
 
respond(false, "Action '$action' không tồn tại.", [], 404);