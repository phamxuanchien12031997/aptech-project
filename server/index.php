<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('DB_HOST', 'localhost');
define('DB_NAME', 'jobhot');
define('DB_USER', 'root');
define('DB_PASS', '');
define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_PORT', 587);
// ⚠️ UPDATE THESE WITH REAL CREDENTIALS
define('MAIL_USER', 'your-email@gmail.com');
define('MAIL_PASS', 'your-app-password');
define('MAIL_FROM', 'noreply@jobhot.vn');
define('MAIL_FROM_NAME', 'JobHot');
define('JWT_SECRET', 'JOBHOT_SECRET_KEY_2026_CHANGE_IN_PROD');
define('ADMIN_EMAIL', 'admin@jobhot.vn');
define('ADMIN_NAME', 'Quản trị viên JobHot');
// ⚠️ ADD THIS: Verification token expiry (30 minutes)
define('VERIFICATION_TOKEN_EXPIRY', 1800);

function sendJsonResponse(bool $success, string $message, array $data = [], int $httpStatusCode = 200): void
{
    http_response_code($httpStatusCode);
    $responseArray = [
        'success' => $success,
        'message' => $message,
        'data' => $data,
    ];
    echo json_encode($responseArray, JSON_UNESCAPED_UNICODE);
    exit;
}

function getDatabaseConnection(): PDO
{
    static $connection = null;

    if ($connection === null) {
        try {
            $socket = '/opt/lampp/var/mysql/mysql.sock';
            if (file_exists($socket)) {
                $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4;unix_socket=' . $socket;
            } else {
                $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            }

            $connection = new PDO(
                $dsn,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $error) {
            sendJsonResponse(false, 'Database error: ' . $error->getMessage(), [], 500);
        }
    }

    return $connection;
}

function createLoginToken(array $userInfo): string
{
    $headerData = [
        'alg' => 'HS256',
        'typ' => 'JWT'
    ];

    $headerJson = json_encode($headerData);
    $headerEncoded = rtrim(base64_encode($headerJson), '=');
    $bodyJson = json_encode($userInfo);
    $bodyEncoded = rtrim(base64_encode($bodyJson), '=');
    $dataToSign = $headerEncoded . '.' . $bodyEncoded;
    $signatureRaw = hash_hmac('sha256', $dataToSign, JWT_SECRET, true);
    $signatureEncoded = rtrim(base64_encode($signatureRaw), '=');

    return $headerEncoded . '.' . $bodyEncoded . '.' . $signatureEncoded;
}

/**
 * FIX #1: Create verification token after OTP validation
 * This token is required to proceed with password reset
 */
function createVerificationToken(string $email): string
{
    $payload = [
        'email' => $email,
        'type' => 'password_reset',
        'exp' => time() + VERIFICATION_TOKEN_EXPIRY,
        'iat' => time()
    ];
    
    return createLoginToken($payload);
}

/**
 * FIX #2: Verify that the verification token is valid
 */
function verifyPasswordResetToken(string $token): ?string
{
    try {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        
        $pad = (4 - strlen($parts[1]) % 4) % 4;
        $json = base64_decode(str_pad($parts[1], strlen($parts[1]) + $pad, '='));
        $data = json_decode($json, true);
        
        if (!$data || !isset($data['email'], $data['type'], $data['exp'])) {
            return null;
        }
        
        if ($data['type'] !== 'password_reset') {
            return null;
        }
        
        if ($data['exp'] < time()) {
            return null;
        }
        
        return $data['email'];
    } catch (Exception $e) {
        return null;
    }
}

function sendOtpByEmail(string $toEmail, string $otpCode): bool
{
    $phpMailerFolder = __DIR__ . '/PHPMailer/src/';
    $phpMailerExists = file_exists($phpMailerFolder . 'PHPMailer.php');

    if ($phpMailerExists) {
        require_once $phpMailerFolder . 'Exception.php';
        require_once $phpMailerFolder . 'PHPMailer.php';
        require_once $phpMailerFolder . 'SMTP.php';

        $mailer = new PHPMailer\PHPMailer\PHPMailer(true);

        try {
            $mailer->isSMTP();
            $mailer->Host = MAIL_HOST;
            $mailer->SMTPAuth = true;
            $mailer->Username = MAIL_USER;
            $mailer->Password = MAIL_PASS;
            $mailer->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mailer->Port = MAIL_PORT;
            $mailer->CharSet = 'UTF-8';
            $mailer->setFrom(MAIL_FROM, MAIL_FROM_NAME);
            $mailer->addAddress($toEmail);
            $mailer->Subject = 'Mã xác nhận JobHot';
            $mailer->isHTML(true);
            $mailer->Body =
                "<div style='font-family:sans-serif'>"
                . "<h2 style='color:#7c3aed'>JobHot</h2>"
                . "<p>Mã OTP của bạn:</p>"
                . "<h1 style='letter-spacing:8px;color:#111'>"
                . $otpCode
                . "</h1>"
                . "<p style='color:#6b7280;font-size:13px'>"
                . "Hiệu lực 5 phút. Không chia sẻ mã này."
                . "</p>"
                . "</div>";
            $mailer->send();

            return true;
        } catch (\Exception $error) {
            return false;
        }
    }

    // FIX #7: Add missing space after colon in From header
    $subject = 'Mã xác nhận JobHot';
    $body = 'Mã OTP của bạn: ' . $otpCode . ' (có hiệu lực 5 phút)';
    $headers = 'From: ' . MAIL_FROM;

    return mail($toEmail, $subject, $body, $headers);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';


if ($action === 'get-jobs') {
    $workTypeFilter = isset($_GET['workType']) ? trim($_GET['workType']) : '';
    $levelFilter = isset($_GET['level']) ? trim($_GET['level']) : '';
    $locationFilter = isset($_GET['location']) ? trim($_GET['location']) : '';
    $keywordFilter = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';

    $sql = "
		SELECT * 
        FROM jobs
		WHERE 1 = 1
	";

    $queryParams = [];

    if ($keywordFilter !== '') {
        $sql .= " AND (title LIKE ? OR company LIKE ?)";
        $queryParams[] = '%' . $keywordFilter . '%';
        $queryParams[] = '%' . $keywordFilter . '%';
    }

    if ($workTypeFilter !== '') {
        $sql .= " AND work_type = ?";
        $queryParams[] = $workTypeFilter;
    }

    if ($levelFilter !== '') {
        $sql .= " AND level = ?";
        $queryParams[] = $levelFilter;
    }

    if ($locationFilter !== '') {
        $sql .= " AND location LIKE ?";
        $queryParams[] = '%' . $locationFilter . '%';
    }

    $sql .= " ORDER BY created_at DESC";
    $statement = getDatabaseConnection()->prepare($sql);
    $statement->execute($queryParams);
    $jobs = $statement->fetchAll();
    sendJsonResponse(true, 'Lấy danh sách việc làm thành công.', ['jobs' => $jobs]);
}

if ($action === 'get-stats') {
    $db = getDatabaseConnection();
    $jobCount = $db->query("SELECT COUNT(*) FROM jobs WHERE status = 'active'")->fetchColumn();
    $companyCount = $db->query("SELECT COUNT(DISTINCT company) FROM jobs")->fetchColumn();
    $candidateCount = $db->query("SELECT COUNT(*) FROM users WHERE role = 'user'")->fetchColumn();
    sendJsonResponse(true, 'Lấy thống kê thành công.', [
        'jobs' => (int)$jobCount,
        'companies' => (int)$companyCount,
        'candidates' => (int)$candidateCount,
    ]);
}


if ($action === 'get-job') {
    $jobId = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($jobId === 0) {
        sendJsonResponse(false, 'ID công việc không hợp lệ.', [], 400);
    }

    $sql = "SELECT * FROM jobs WHERE id = ?";
    $statement = getDatabaseConnection()->prepare($sql);
    $statement->execute([$jobId]);
    $job = $statement->fetch();

    if (!$job) {
        sendJsonResponse(false, 'Không tìm thấy công việc.', [], 404);
    }

    sendJsonResponse(true, 'Lấy chi tiết công việc thành công.', $job);
}

if ($action === 'get-categories') {
    try {
        $sql = "SELECT DISTINCT category FROM jobs ORDER BY category ASC";
        $statement = getDatabaseConnection()->prepare($sql);
        $statement->execute();
        $categoryRows = $statement->fetchAll();

        $categories = array_map(function ($row) {
            return [
                'label' => $row['category'],
                'icon' => '💼',
                'count' => 0
            ];
        }, $categoryRows);

        if (empty($categories)) {
            $categories = [
                ['label' => 'Công nghệ thông tin', 'icon' => '💻', 'count' => 0],
                ['label' => 'Marketing / PR', 'icon' => '📢', 'count' => 0],
                ['label' => 'Thiết kế', 'icon' => '🎨', 'count' => 0],
                ['label' => 'Kế toán / Kiểm toán', 'icon' => '📊', 'count' => 0],
            ];
        }

        sendJsonResponse(true, 'Lấy danh sách danh mục thành công.', ['categories' => $categories]);
    } catch (Exception $e) {
        sendJsonResponse(false, 'Lỗi khi lấy danh mục: ' . $e->getMessage(), [], 500);
    }
}

// ── Admin read-only actions (GET, require admin token) ───────
if ($action === 'admin-get-stats') {
    requireAdmin();
    $db = getDatabaseConnection();
    $totalJobs      = (int)$db->query("SELECT COUNT(*) FROM jobs")->fetchColumn();
    $activeJobs     = (int)$db->query("SELECT COUNT(*) FROM jobs WHERE status = 'active'")->fetchColumn();
    $pendingJobs    = (int)$db->query("SELECT COUNT(*) FROM jobs WHERE status = 'pending'")->fetchColumn();
    $totalUsers     = (int)$db->query("SELECT COUNT(*) FROM users WHERE role != 'admin'")->fetchColumn();
    $totalEmployers = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'employer'")->fetchColumn();
    $totalSeekers   = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'user'")->fetchColumn();
    $totalCategories= (int)$db->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    $totalApplications = (int)$db->query("SELECT COUNT(*) FROM applications")->fetchColumn();
    $catStats = $db->query("
        SELECT c.name, c.icon, COUNT(j.id) as job_count
        FROM categories c
        LEFT JOIN jobs j ON j.category_id = c.id
        GROUP BY c.id, c.name, c.icon
        ORDER BY job_count DESC
    ")->fetchAll();
    sendJsonResponse(true, 'OK', [
        'totalJobs'         => $totalJobs,
        'activeJobs'        => $activeJobs,
        'pendingJobs'       => $pendingJobs,
        'totalUsers'        => $totalUsers,
        'totalEmployers'    => $totalEmployers,
        'totalSeekers'      => $totalSeekers,
        'totalCategories'   => $totalCategories,
        'totalApplications' => $totalApplications,
        'categoryStats'     => $catStats,
    ]);
}

if ($action === 'admin-get-users') {
    requireAdmin();
    $db    = getDatabaseConnection();
    $users = $db->query("
        SELECT id, full_name, email, role, status, company, position, created_at
        FROM users
        WHERE role != 'admin'
        ORDER BY created_at DESC
    ")->fetchAll();
    sendJsonResponse(true, 'OK', ['users' => $users]);
}

if ($action === 'admin-get-jobs') {
    requireAdmin();
    $db   = getDatabaseConnection();
    $jobs = $db->query("
        SELECT j.id, j.title, j.company, j.location, j.work_type, j.level,
               j.salary, j.status, j.created_at, j.deadline, j.applicants,
               c.name AS category_name, c.icon AS category_icon
        FROM jobs j
        LEFT JOIN categories c ON c.id = j.category_id
        ORDER BY j.created_at DESC
    ")->fetchAll();
    sendJsonResponse(true, 'OK', ['jobs' => $jobs]);
}

if ($action === 'admin-get-categories') {
    requireAdmin();
    $db   = getDatabaseConnection();
    $cats = $db->query("SELECT * FROM categories ORDER BY id ASC")->fetchAll();
    sendJsonResponse(true, 'OK', ['categories' => $cats]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Chỉ hỗ trợ POST.', [], 405);
}

$rawBody = file_get_contents('php://input');
$body = json_decode($rawBody, true);

if (!is_array($body)) {
    sendJsonResponse(false, 'Body JSON không hợp lệ.', [], 400);
}

if ($action === 'login') {
    $email = trim(isset($body['email']) ? $body['email'] : '');

    $password = isset($body['password']) ? $body['password'] : '';

    if ($email === '' || $password === '') {
        sendJsonResponse(false, 'Vui lòng nhập đủ thông tin.', [], 400);
    }

    $query = getDatabaseConnection()->prepare("
		SELECT *
		FROM users
		WHERE email = ?
		LIMIT 1
	");

    $query->execute([$email]);
    $user = $query->fetch();
    $passwordIsCorrect = $user && password_verify($password, $user['password']);

    if (!$passwordIsCorrect) {
        sendJsonResponse(false, 'Email hoặc mật khẩu không đúng.', [], 401);
    }

    $tokenPayload = [
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'name' => $user['full_name'],
        'exp' => time() + 604800,
    ];

    $token = createLoginToken($tokenPayload);

    sendJsonResponse(true, 'Đăng nhập thành công.', [
        'token' => $token,
        'role' => $user['role'],
        'name' => $user['full_name'],
        'email' => $user['email'],
        'industry' => $user['industry'],
        'company' => $user['company'] ?? null,
        'avatar' => $user['avatar'] ?? null,
    ]);
}

if ($action === 'register') {
    $fullName = trim(isset($body['fullName']) ? $body['fullName'] : '');
    $email = trim(isset($body['email']) ? $body['email'] : '');
    $password = isset($body['password']) ? $body['password'] : '';
    $industry = trim(isset($body['industry']) ? $body['industry'] : '');
    $requestedRole = isset($body['role']) ? $body['role'] : '';

    if ($requestedRole === 'user' || $requestedRole === 'employer') {
        $role = $requestedRole;
    } else {
        $role = 'user';
    }

    if ($fullName === '' || $email === '' || $password === '') {
        sendJsonResponse(false, 'Thiếu thông tin bắt buộc.', [], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(false, 'Email không hợp lệ.', [], 400);
    }

    if (strlen($password) < 8) {
        sendJsonResponse(false, 'Mật khẩu tối thiểu 8 ký tự.', [], 400);
    }

    $db = getDatabaseConnection();

    $checkEmail = $db->prepare("
		SELECT id
		FROM users
		WHERE email = ?
		LIMIT 1
	");

    $checkEmail->execute([$email]);

    $emailAlreadyTaken = $checkEmail->fetch();

    if ($emailAlreadyTaken) {
        sendJsonResponse(false, 'Email này đã được sử dụng.', [], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $avatar = isset($body['avatar']) ? $body['avatar']  : null;
    $company = trim(isset($body['company']) ? $body['company'] : '');

    if ($avatar && strlen($avatar) > 2800000) {
        $avatar = null;
    }

    $insertUser = $db->prepare("
        INSERT INTO users (
            full_name,
            email,
            password,
            role,
            industry,
            company,
            avatar
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $insertUser->execute([
        $fullName,
        $email,
        $hashedPassword,
        $role,
        $industry !== '' ? $industry : null,
        $company !== '' ? $company : null,
        $avatar,
    ]);

    $phpMailerFolder = __DIR__ . '/PHPMailer/src/';
    if (file_exists($phpMailerFolder . 'PHPMailer.php')) {
        require_once $phpMailerFolder . 'Exception.php';
        require_once $phpMailerFolder . 'PHPMailer.php';
        require_once $phpMailerFolder . 'SMTP.php';

        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = MAIL_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = MAIL_USER;
            $mail->Password = MAIL_PASS;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = MAIL_PORT;
            $mail->CharSet = 'UTF-8';
            $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
            $mail->addAddress($email, $fullName);
            $mail->Subject = 'Chào mừng bạn đến với JobHot! 🎉';
            $mail->isHTML(true);
            // FIX #8: Escape user input in email body
            $mail->Body = "
                <div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px'>
                    <h2 style='color:#7c3aed'>🐝 JobHot</h2>
                    <h3>Chào mừng, " . htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8') . "!</h3>
                    <p>Tài khoản của bạn đã được tạo thành công trên <strong>JobHot</strong>.</p>
                    <p>Bạn có thể bắt đầu tìm kiếm việc làm hoặc đăng tin tuyển dụng ngay bây giờ.</p>
                    <a href='https://jobhot.vn/login'
                       style='display:inline-block;margin-top:16px;padding:12px 28px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold'>
                       Đăng nhập ngay →
                    </a>
                    <p style='margin-top:24px;color:#9ca3af;font-size:12px'>
                        Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.
                    </p>
                </div>
            ";
            $mail->send();
        } catch (Exception $e) {
        }
    }

    sendJsonResponse(true, 'Đăng ký thành công.', ['role' => $role]);
}

if ($action === 'forgot-password') {
    $email = trim(isset($body['email']) ? $body['email'] : '');

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(false, 'Email không hợp lệ.', [], 400);
    }

    $db = getDatabaseConnection();
    $checkUser = $db->prepare("
		SELECT id
		FROM users
		WHERE email = ?
		LIMIT 1
	");
    $checkUser->execute([$email]);
    $userExists = $checkUser->fetch();
    if (!$userExists) {
        sendJsonResponse(true, 'Nếu email tồn tại, mã OTP đã được gửi.');
    }

    $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    $expiresAt = date('Y-m-d H:i:s', time() + 300);

    // FIX #2: Use transaction to ensure consistency
    // expireOldOtps is INSIDE the transaction so it rolls back if email fails,
    // keeping the user's previous valid OTP intact.
    try {
        $db->beginTransaction();

        $expireOldOtps = $db->prepare("
		UPDATE otp_tokens
		SET used = 1
		WHERE email = ?
			AND used = 0
	");
        $expireOldOtps->execute([$email]);
        
        $insertOtp = $db->prepare("
			INSERT INTO otp_tokens (
				email,
				otp,
				expires_at
			)
			VALUES (?, ?, ?)
		");

        $insertOtp->execute([
            $email,
            $otpCode,
            $expiresAt
        ]);

        // Email is sent AFTER database insert
        $emailSent = sendOtpByEmail($email, $otpCode);

        if (!$emailSent) {
            // Rollback if email fails
            $db->rollBack();
            sendJsonResponse(false, 'Không thể gửi email. Thử lại sau.', [], 500);
        }
        
        $db->commit();
        sendJsonResponse(true, 'Mã OTP đã được gửi đến email của bạn.');
    } catch (Exception $e) {
        $db->rollBack();
        sendJsonResponse(false, 'Có lỗi xảy ra. Vui lòng thử lại.', [], 500);
    }
}

if ($action === 'verify-otp') {
    $email = trim(isset($body['email']) ? $body['email'] : '');
    $otpCode = trim(isset($body['otp']) ? $body['otp'] : '');

    if ($email === '' || $otpCode === '') {
        sendJsonResponse(false, 'Thiếu thông tin.', [], 400);
    }

    $db = getDatabaseConnection();
    $findOtp = $db->prepare("
		SELECT id
		FROM otp_tokens
		WHERE email = ?
			AND otp = ?
			AND used = 0
			AND expires_at > NOW()
		ORDER BY created_at DESC
		LIMIT 1
	");

    $findOtp->execute([
        $email,
        $otpCode
    ]);

    $otpRow = $findOtp->fetch();

    if (!$otpRow) {
        sendJsonResponse(false, 'Mã OTP không đúng hoặc đã hết hạn.', [], 400);
    }

    $markUsed = $db->prepare("
		UPDATE otp_tokens
		SET used = 1
		WHERE id = ?
	");

    $markUsed->execute([$otpRow['id']]);
    
    // FIX #1 & #6: Generate verification token after OTP validation
    $verificationToken = createVerificationToken($email);
    
    sendJsonResponse(true, 'Xác minh OTP thành công.', [
        'verificationToken' => $verificationToken
    ]);
}

if ($action === 'reset-password') {
    $email = trim(isset($body['email']) ? $body['email'] : '');
    $newPassword = isset($body['password']) ? $body['password'] : '';
    // FIX #5 & #6: Require verification token
    $verificationToken = isset($body['verificationToken']) ? trim($body['verificationToken']) : '';

    if ($email === '' || $newPassword === '' || $verificationToken === '') {
        sendJsonResponse(false, 'Thiếu thông tin.', [], 400);
    }

    if (strlen($newPassword) < 8) {
        sendJsonResponse(false, 'Mật khẩu tối thiểu 8 ký tự.', [], 400);
    }

    // FIX #5: Verify the token and email match
    $tokenEmail = verifyPasswordResetToken($verificationToken);
    
    if ($tokenEmail === null) {
        sendJsonResponse(false, 'Mã xác minh không hợp lệ hoặc đã hết hạn.', [], 401);
    }
    
    if ($tokenEmail !== $email) {
        sendJsonResponse(false, 'Email không khớp với mã xác minh.', [], 401);
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $updatePassword = getDatabaseConnection()->prepare("
		UPDATE users
		SET password = ?
		WHERE email = ?
	");

    $updatePassword->execute([
        $hashedPassword,
        $email
    ]);

    if ($updatePassword->rowCount() === 0) {
        sendJsonResponse(false, 'Không tìm thấy tài khoản.', [], 404);
    }

    sendJsonResponse(true, 'Đặt lại mật khẩu thành công.');
}


if ($action === 'contact') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $message = trim($body['message'] ?? '');

    if (!$name || !$email || !$message) {
        sendJsonResponse(false, 'Vui lòng điền đầy đủ thông tin.', [], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(false, 'Email không hợp lệ.', [], 400);
    }

    $sent = sendOtpByEmail(MAIL_FROM, '');
    $phpMailerFolder = __DIR__ . '/PHPMailer/src/';
    $phpMailerExists = file_exists($phpMailerFolder . 'PHPMailer.php');

    if ($phpMailerExists) {
        require_once $phpMailerFolder . 'Exception.php';
        require_once $phpMailerFolder . 'PHPMailer.php';
        require_once $phpMailerFolder . 'SMTP.php';

        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = MAIL_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = MAIL_USER;
            $mail->Password = MAIL_PASS;
            $mail->SMTPSecure = 'tls';
            $mail->Port = MAIL_PORT;
            $mail->CharSet = 'UTF-8';
            $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
            $mail->addAddress(ADMIN_EMAIL, ADMIN_NAME);
            $mail->addReplyTo($email, $name);
            $mail->Subject = "[JobHot] Phản hồi từ: $name";
            $mail->Body = "Tên: $name\nEmail: $email\n\nNội dung:\n$message";
            $mail->send();
        } catch (Exception $e) {
        }
    }
    sendJsonResponse(true, 'Phản hồi của bạn đã được gửi thành công.');
}

if ($action === 'get-applied-jobs') {
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    $userId = null;

    if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        $tokenParts = explode('.', $matches[1]);
        if (count($tokenParts) === 3) {
            $payloadJson = base64_decode(str_pad($tokenParts[1], strlen($tokenParts[1]) + (4 - strlen($tokenParts[1]) % 4) % 4, '='));
            $payload = json_decode($payloadJson, true);
            if ($payload && isset($payload['id'])) {
                $userId = (int)$payload['id'];
            }
        }
    }

    if (!$userId) {
        sendJsonResponse(false, 'Bạn cần đăng nhập.', [], 401);
    }

    $db = getDatabaseConnection();
    $stmt = $db->prepare("
        SELECT a.id, a.job_id, a.status, a.applied_at,
               j.title, j.company, j.location, j.salary, j.logo
        FROM applications a
        JOIN jobs j ON j.id = a.job_id
        WHERE a.user_id = ?
        ORDER BY a.applied_at DESC
    ");
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll();
    sendJsonResponse(true, 'Lấy danh sách ứng tuyển thành công.', $rows);
}

if ($action === 'apply-job') {
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    $userId = null;

    if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        $tokenParts = explode('.', $matches[1]);
        if (count($tokenParts) === 3) {
            $payloadJson = base64_decode(str_pad($tokenParts[1], strlen($tokenParts[1]) + (4 - strlen($tokenParts[1]) % 4) % 4, '='));
            $payload = json_decode($payloadJson, true);
            if ($payload && isset($payload['id'])) {
                $userId = (int)$payload['id'];
            }
        }
    }

    if (!$userId) {
        sendJsonResponse(false, 'Bạn cần đăng nhập.', [], 401);
    }

    $jobId = isset($body['job_id']) ? (int)$body['job_id'] : 0;
    if (!$jobId) {
        sendJsonResponse(false, 'Thiếu job_id.', [], 400);
    }

    $db = getDatabaseConnection();
    $checkJob = $db->prepare("SELECT id FROM jobs WHERE id = ? LIMIT 1");
    $checkJob->execute([$jobId]);
    if (!$checkJob->fetch()) {
        sendJsonResponse(false, 'Việc làm không tồn tại.', [], 404);
    }

    $checkDup = $db->prepare("SELECT id FROM applications WHERE job_id = ? AND user_id = ? LIMIT 1");
    $checkDup->execute([$jobId, $userId]);
    if ($checkDup->fetch()) {
        sendJsonResponse(false, 'Bạn đã ứng tuyển vị trí này rồi.', [], 409);
    }

    $insert = $db->prepare("INSERT INTO applications (job_id, user_id, status) VALUES (?, ?, 'new')");
    $insert->execute([$jobId, $userId]);
    sendJsonResponse(true, 'Ứng tuyển thành công.');
}

if ($action === 'send-confirm-email') {
    $toEmail = trim($body['email'] ?? '');
    $toName  = trim($body['name']  ?? '');

    if (!$toEmail || !filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(false, 'Email không hợp lệ.', [], 400);
    }

    $phpMailerFolder = __DIR__ . '/PHPMailer/src/';
    $phpMailerExists = file_exists($phpMailerFolder . 'PHPMailer.php');

    if ($phpMailerExists) {
        require_once $phpMailerFolder . 'Exception.php';
        require_once $phpMailerFolder . 'PHPMailer.php';
        require_once $phpMailerFolder . 'SMTP.php';

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
            $mail->addAddress($toEmail, $toName);
            $mail->Subject = 'Chào mừng bạn đến với JobHot! 🎉';
            $mail->isHTML(true);
            // FIX #8: Escape user input in email body
            $mail->Body = "
                <div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px'>
                    <h2 style='color:#7c3aed'>🐝 JobHot</h2>
                    <h3>Chào mừng, " . htmlspecialchars($toName, ENT_QUOTES, 'UTF-8') . "!</h3>
                    <p>Tài khoản của bạn đã được tạo thành công trên <strong>JobHot</strong>.</p>
                    <p>Bạn có thể bắt đầu tìm kiếm việc làm hoặc đăng tin tuyển dụng ngay bây giờ.</p>
                    <a href='https://jobhot.vn/login'
                       style='display:inline-block;margin-top:16px;padding:12px 28px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold'>
                       Đăng nhập ngay →
                    </a>
                    <p style='margin-top:24px;color:#9ca3af;font-size:12px'>
                        Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.
                    </p>
                </div>
            ";
            $mail->send();
            // FIX #3: Return error response if email fails
            sendJsonResponse(true, 'Email xác nhận đã được gửi.');
        } catch (Exception $e) {
            // FIX #3: Return proper error response
            sendJsonResponse(false, 'Không thể gửi email xác nhận. ' . $e->getMessage(), [], 500);
        }
    } else {
        // Fallback: try native mail function
        $subject = 'Chào mừng bạn đến với JobHot! 🎉';
        $body = "Chào mừng, " . htmlspecialchars($toName, ENT_QUOTES, 'UTF-8') . "! Tài khoản của bạn đã được tạo thành công.";
        $headers = 'From: ' . MAIL_FROM;
        
        if (!mail($toEmail, $subject, $body, $headers)) {
            sendJsonResponse(false, 'Không thể gửi email xác nhận.', [], 500);
        }
    }
    
    sendJsonResponse(true, 'Email xác nhận đã được gửi.');
}

function getUserIdFromToken(): int
{
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        $parts = explode('.', $matches[1]);
        if (count($parts) === 3) {
            $pad = (4 - strlen($parts[1]) % 4) % 4;
            $json = base64_decode(str_pad($parts[1], strlen($parts[1]) + $pad, '='));
            $data = json_decode($json, true);
            if ($data && isset($data['id']))
                return (int)$data['id'];
        }
    }
    return 0;
}

if ($action === 'get-saved-jobs') {
    $uid = getUserIdFromToken();
    if (!$uid)
        sendJsonResponse(false, 'Bạn cần đăng nhập.', [], 401);

    $db = getDatabaseConnection();
    $stmt = $db->prepare("
        SELECT s.id, s.job_id, s.saved_at,
               j.title, j.company, j.location, j.salary, j.work_type, j.level, j.logo
        FROM saved_jobs s
        JOIN jobs j ON j.id = s.job_id
        WHERE s.user_id = ?
        ORDER BY s.saved_at DESC
    ");
    $stmt->execute([$uid]);
    sendJsonResponse(true, 'OK', $stmt->fetchAll());
}

if ($action === 'save-job') {
    $uid = getUserIdFromToken();
    if (!$uid)
        sendJsonResponse(false, 'Bạn cần đăng nhập.', [], 401);
    $jobId = (int)($body['job_id'] ?? 0);
    if (!$jobId)
        sendJsonResponse(false, 'Thiếu job_id.', [], 400);

    $db = getDatabaseConnection();
    try {
        $db->prepare("INSERT IGNORE INTO saved_jobs (job_id, user_id) VALUES (?, ?)")->execute([$jobId, $uid]);
        sendJsonResponse(true, 'Đã lưu việc làm.');
    } catch (Exception $e) {
        sendJsonResponse(false, 'Lỗi.', [], 500);
    }
}

if ($action === 'unsave-job') {
    $uid = getUserIdFromToken();
    if (!$uid)
        sendJsonResponse(false, 'Bạn cần đăng nhập.', [], 401);
    $jobId = (int)($body['job_id'] ?? 0);
    if (!$jobId)
        sendJsonResponse(false, 'Thiếu job_id.', [], 400);

    $db = getDatabaseConnection();
    $db->prepare("DELETE FROM saved_jobs WHERE job_id = ? AND user_id = ?")->execute([$jobId, $uid]);
    sendJsonResponse(true, 'Đã bỏ lưu.');
}

if ($action === 'submit-rating') {
    $rating  = (int)($body['rating']  ?? 0);
    $comment = trim($body['comment'] ?? '');

    if ($rating < 1 || $rating > 5) {
        sendJsonResponse(false, 'Điểm đánh giá phải từ 1 đến 5.', [], 400);
    }

    $db = getDatabaseConnection();

    $ip = $_SERVER['REMOTE_ADDR'] ?? null;
    $db->prepare("INSERT INTO site_ratings (rating, comment, ip) VALUES (?, ?, ?)")->execute([$rating, $comment ?: null, $ip]);

    sendJsonResponse(true, 'Cảm ơn bạn đã đánh giá!');
}

if ($action === 'update-profile') {
    $uid = getUserIdFromToken();
    if (!$uid) {
        sendJsonResponse(false, 'Bạn cần đăng nhập.', [], 401);
    }

    $name       = trim($body['name']       ?? '');
    $phone      = trim($body['phone']      ?? '');
    $dob        = trim($body['dob']        ?? '');
    $gender     = trim($body['gender']     ?? '');
    $address    = trim($body['address']    ?? '');
    $email      = trim($body['email']      ?? '');
    $position   = trim($body['position']   ?? '');
    $experience = trim($body['experience'] ?? '');
    $skills     = trim($body['skills']     ?? '');
    $industry   = trim($body['industry']   ?? '');
    $jobType    = trim($body['jobType']    ?? '');
    $bio        = trim($body['bio']        ?? '');
    $avatar     = isset($body['avatar'])   ? $body['avatar'] : null;
    $cvBase64   = isset($body['cv'])       ? $body['cv']     : null;

    if ($name === '') {
        sendJsonResponse(false, 'Họ và tên không được để trống.', [], 400);
    }

    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(false, 'Email không hợp lệ.', [], 400);
    }

    // Reject oversized avatar (> ~2 MB base64)
    if ($avatar && strlen($avatar) > 2800000) {
        $avatar = null;
    }

    $db = getDatabaseConnection();

    // Check email uniqueness (ignore current user)
    if ($email !== '') {
        $dup = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1");
        $dup->execute([$email, $uid]);
        if ($dup->fetch()) {
            sendJsonResponse(false, 'Email này đã được sử dụng bởi tài khoản khác.', [], 409);
        }
    }

    $fields = [
        'full_name'  => $name,
        'phone'      => $phone      ?: null,
        'dob'        => $dob        ?: null,
        'gender'     => $gender     ?: null,
        'address'    => $address    ?: null,
        'position'   => $position   ?: null,
        'experience' => $experience ?: null,
        'skills'     => $skills     ?: null,
        'industry'   => $industry   ?: null,
        'bio'        => $bio        ?: null,
    ];

    if ($email !== '') {
        $fields['email'] = $email;
    }

    if ($avatar !== null) {
        $fields['avatar'] = $avatar;
    }

    $setClauses = implode(', ', array_map(fn($k) => "$k = ?", array_keys($fields)));
    $values     = array_values($fields);
    $values[]   = $uid;

    $db->prepare("UPDATE users SET $setClauses WHERE id = ?")->execute($values);

    // Fetch updated user to return fresh data
    $fresh = $db->prepare("SELECT full_name, email, avatar, industry, position FROM users WHERE id = ? LIMIT 1");
    $fresh->execute([$uid]);
    $user = $fresh->fetch();

    sendJsonResponse(true, 'Cập nhật thông tin thành công.', [
        'name'     => $user['full_name'],
        'email'    => $user['email'],
        'avatar'   => $user['avatar'] ?? null,
        'industry' => $user['industry'] ?? null,
        'position' => $user['position'] ?? null,
    ]);
}

// ============================================================
// ADMIN HELPER — decode token and assert role = admin
// ============================================================
function requireAdmin(): int
{
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        $parts = explode('.', $matches[1]);
        if (count($parts) === 3) {
            $pad  = (4 - strlen($parts[1]) % 4) % 4;
            $json = base64_decode(str_pad($parts[1], strlen($parts[1]) + $pad, '='));
            $data = json_decode($json, true);
            if ($data && isset($data['id']) && isset($data['role']) && $data['role'] === 'admin') {
                return (int)$data['id'];
            }
        }
    }
    sendJsonResponse(false, 'Bạn không có quyền truy cập.', [], 403);
    exit;
}

// (admin-get-stats, admin-get-users, admin-get-jobs, admin-get-categories moved above POST guard)

// ============================================================
// ADMIN — update user (edit name/email, lock/unlock)
// ============================================================
if ($action === 'admin-update-user') {
    requireAdmin();
    $db  = getDatabaseConnection();
    $id  = (int)($body['id'] ?? 0);
    if (!$id) sendJsonResponse(false, 'Thiếu user id.', [], 400);

    $allowed = ['full_name', 'email', 'status', 'role'];
    $fields  = [];
    $values  = [];
    foreach ($allowed as $col) {
        if (isset($body[$col])) {
            $fields[] = "$col = ?";
            $values[] = $body[$col];
        }
    }
    if (empty($fields)) sendJsonResponse(false, 'Không có dữ liệu cập nhật.', [], 400);

    $values[] = $id;
    $db->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ? AND role != 'admin'")->execute($values);
    sendJsonResponse(true, 'Cập nhật người dùng thành công.');
}

// ============================================================
// ADMIN — delete user
// ============================================================
if ($action === 'admin-delete-user') {
    requireAdmin();
    $db = getDatabaseConnection();
    $id = (int)($body['id'] ?? 0);
    if (!$id) sendJsonResponse(false, 'Thiếu user id.', [], 400);
    $db->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'")->execute([$id]);
    sendJsonResponse(true, 'Đã xóa người dùng.');
}

// (admin-get-jobs moved above POST guard)

// ============================================================
// ADMIN — update job status / fields
// ============================================================
if ($action === 'admin-update-job') {
    requireAdmin();
    $db = getDatabaseConnection();
    $id = (int)($body['id'] ?? 0);
    if (!$id) sendJsonResponse(false, 'Thiếu job id.', [], 400);

    $allowed = ['status', 'title', 'company', 'location', 'salary'];
    $fields  = [];
    $values  = [];
    foreach ($allowed as $col) {
        if (isset($body[$col])) {
            $fields[] = "$col = ?";
            $values[] = $body[$col];
        }
    }
    if (empty($fields)) sendJsonResponse(false, 'Không có dữ liệu cập nhật.', [], 400);
    $values[] = $id;
    $db->prepare("UPDATE jobs SET " . implode(', ', $fields) . " WHERE id = ?")->execute($values);
    sendJsonResponse(true, 'Cập nhật bài đăng thành công.');
}

// ============================================================
// ADMIN — delete job
// ============================================================
if ($action === 'admin-delete-job') {
    requireAdmin();
    $db = getDatabaseConnection();
    $id = (int)($body['id'] ?? 0);
    if (!$id) sendJsonResponse(false, 'Thiếu job id.', [], 400);
    $db->prepare("DELETE FROM jobs WHERE id = ?")->execute([$id]);
    sendJsonResponse(true, 'Đã xóa bài đăng.');
}

// (admin-get-categories moved above POST guard)

// ============================================================
// ADMIN — add category
// ============================================================
if ($action === 'admin-add-category') {
    requireAdmin();
    $db   = getDatabaseConnection();
    $name = trim($body['name'] ?? '');
    $icon = trim($body['icon'] ?? '📂');
    if ($name === '') sendJsonResponse(false, 'Tên danh mục không được để trống.', [], 400);
    try {
        $db->prepare("INSERT INTO categories (name, icon) VALUES (?, ?)")->execute([$name, $icon]);
        $id = $db->lastInsertId();
        sendJsonResponse(true, 'Thêm danh mục thành công.', ['id' => $id]);
    } catch (\PDOException $e) {
        sendJsonResponse(false, 'Danh mục đã tồn tại.', [], 409);
    }
}

// ============================================================
// ADMIN — update category
// ============================================================
if ($action === 'admin-update-category') {
    requireAdmin();
    $db   = getDatabaseConnection();
    $id   = (int)($body['id'] ?? 0);
    $name = trim($body['name'] ?? '');
    $icon = trim($body['icon'] ?? '');
    if (!$id || $name === '') sendJsonResponse(false, 'Thiếu dữ liệu.', [], 400);
    $db->prepare("UPDATE categories SET name = ?, icon = ? WHERE id = ?")->execute([$name, $icon, $id]);
    sendJsonResponse(true, 'Cập nhật danh mục thành công.');
}

// ============================================================
// ADMIN — delete category
// ============================================================
if ($action === 'admin-delete-category') {
    requireAdmin();
    $db = getDatabaseConnection();
    $id = (int)($body['id'] ?? 0);
    if (!$id) sendJsonResponse(false, 'Thiếu id.', [], 400);
    $db->prepare("UPDATE jobs SET category_id = NULL WHERE category_id = ?")->execute([$id]);
    $db->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    sendJsonResponse(true, 'Đã xóa danh mục.');
}

sendJsonResponse(false, "Action '$action' không tồn tại.", [], 404);