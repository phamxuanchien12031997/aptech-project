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
define('MAIL_USER', 'your-email@gmail.com');
define('MAIL_PASS', 'your-app-password');
define('MAIL_FROM', 'noreply@jobhot.vn');
define('MAIL_FROM_NAME', 'JobHot');
define('JWT_SECRET', 'JOBHOT_SECRET_KEY_2026_CHANGE_IN_PROD');
define('ADMIN_EMAIL', 'admin@jobhot.vn');
define('ADMIN_PASSWORD', 'Admin@123');
define('ADMIN_NAME', 'Quản trị viên JobHot');

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

function createTablesAndDefaultAdmin(): void
{
    $db = getDatabaseConnection();

    $db->exec("
		CREATE TABLE IF NOT EXISTS users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			full_name VARCHAR(100) NOT NULL,
			email VARCHAR(150) NOT NULL UNIQUE,
			password VARCHAR(255) NOT NULL,
			role ENUM('user','employer','admin') NOT NULL DEFAULT 'user',
			industry VARCHAR(100) DEFAULT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
	");

    $db->exec("
		CREATE TABLE IF NOT EXISTS otp_tokens (
			id INT AUTO_INCREMENT PRIMARY KEY,
			email VARCHAR(150) NOT NULL,
			otp VARCHAR(6) NOT NULL,
			expires_at DATETIME NOT NULL,
			used TINYINT(1) DEFAULT 0,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
	");

    $db->exec("
        CREATE TABLE IF NOT EXISTS jobs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            employer_id INT DEFAULT NULL,
            title VARCHAR(200) NOT NULL,
            company VARCHAR(200) NOT NULL,
            logo VARCHAR(500) DEFAULT NULL,
            location VARCHAR(100) NOT NULL,
            work_type VARCHAR(50) NOT NULL,
            level VARCHAR(50) NOT NULL,
            salary VARCHAR(100) DEFAULT NULL,
            description TEXT DEFAULT NULL,
            requirements TEXT DEFAULT NULL,
            deadline DATE DEFAULT NULL,
            status ENUM('pending','active','closed') NOT NULL DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    try {
        $colsStmt = $db->query("SHOW COLUMNS FROM users");
        $existingCols = array_column($colsStmt->fetchAll(), 'Field');
        $addCols = [
            'avatar' => "ALTER TABLE users ADD COLUMN avatar MEDIUMTEXT DEFAULT NULL",
            'company' => "ALTER TABLE users ADD COLUMN company VARCHAR(200) DEFAULT NULL",
            'status' => "ALTER TABLE users ADD COLUMN status ENUM('active','suspended') NOT NULL DEFAULT 'active'",
            'phone' => "ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL",
            'dob' => "ALTER TABLE users ADD COLUMN dob DATE DEFAULT NULL",
            'gender' => "ALTER TABLE users ADD COLUMN gender VARCHAR(20) DEFAULT NULL",
            'address' => "ALTER TABLE users ADD COLUMN address VARCHAR(200) DEFAULT NULL",
            'position' => "ALTER TABLE users ADD COLUMN position VARCHAR(100) DEFAULT NULL",
            'experience' => "ALTER TABLE users ADD COLUMN experience VARCHAR(50) DEFAULT NULL",
            'skills' => "ALTER TABLE users ADD COLUMN skills TEXT DEFAULT NULL",
            'bio' => "ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL",
        ];

        foreach ($addCols as $col => $sql) {
            if (!in_array($col, $existingCols)) {
                try {
                    $db->exec($sql);
                } catch (Exception $e) {
                }
            }
        }
    } catch (Exception $e) {
    }

    $db->exec("
        CREATE TABLE IF NOT EXISTS applications (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            job_id     INT NOT NULL,
            user_id    INT NOT NULL,
            status     ENUM('new','reviewing','shortlisted','rejected') NOT NULL DEFAULT 'new',
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY uq_application (job_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS saved_jobs (
            id       INT AUTO_INCREMENT PRIMARY KEY,
            job_id   INT NOT NULL,
            user_id  INT NOT NULL,
            saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY uq_saved (job_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS site_ratings (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            rating     TINYINT NOT NULL,
            comment    TEXT DEFAULT NULL,
            ip         VARCHAR(45) DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $checkAdmin = $db->prepare("
		SELECT id
		FROM users
		WHERE email = ?
		LIMIT 1
	");

    $checkAdmin->execute([ADMIN_EMAIL]);
    $adminAlreadyExists = $checkAdmin->fetch();

    if (!$adminAlreadyExists) {
        $hashedPassword = password_hash(ADMIN_PASSWORD, PASSWORD_DEFAULT);

        $insertAdmin = $db->prepare("
			INSERT INTO users (
				full_name,
				email,
				password,
				role
			)
			VALUES (?, ?, ?, 'admin')
		");

        $insertAdmin->execute([ADMIN_NAME, ADMIN_EMAIL, $hashedPassword]);
    }
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

    $subject = 'Mã xác nhận JobHot';
    $body = 'Mã OTP của bạn: ' . $otpCode . ' (có hiệu lực 5 phút)';
    $headers = 'From:' . MAIL_FROM;

    return mail($toEmail, $subject, $body, $headers);
}

createTablesAndDefaultAdmin();
$action = isset($_GET['action']) ? $_GET['action'] : '';


if ($action === 'get-jobs') {
    $workTypeFilter = isset($_GET['workType']) ? trim($_GET['workType']) : '';
    $levelFilter = isset($_GET['level']) ? trim($_GET['level']) : '';
    $locationFilter = isset($_GET['location']) ? trim($_GET['location']) : '';

    $sql = "
		SELECT * 
        FROM jobs
		WHERE 1 = 1
	";

    $queryParams = [];

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
    sendJsonResponse(true, 'Lấy danh sách việc làm thành công.', $jobs);
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
            $mail->Body = "
                <div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px'>
                    <h2 style='color:#7c3aed'>🐝 JobHot</h2>
                    <h3>Chào mừng, {$fullName}!</h3>
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

    $expireOldOtps = $db->prepare("
		UPDATE otp_tokens
		SET used = 1
		WHERE email = ?
			AND used = 0
	");

    $expireOldOtps->execute([$email]);

    $expiresAt = date('Y-m-d H:i:s', time() + 300);

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

    $emailSent = sendOtpByEmail($email, $otpCode);

    if (!$emailSent) {
        sendJsonResponse(false, 'Không thể gửi email. Thử lại sau.', [], 500);
    }

    sendJsonResponse(true, 'Mã OTP đã được gửi đến email của bạn.');
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
    sendJsonResponse(true, 'Xác minh OTP thành công.');
}

if ($action === 'reset-password') {
    $email = trim(isset($body['email']) ? $body['email'] : '');
    $newPassword = isset($body['password']) ? $body['password'] : '';

    if ($email === '' || $newPassword === '') {
        sendJsonResponse(false, 'Thiếu thông tin.', [], 400);
    }

    if (strlen($newPassword) < 8) {
        sendJsonResponse(false, 'Mật khẩu tối thiểu 8 ký tự.', [], 400);
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
            $mail->Body = "
                <div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px'>
                    <h2 style='color:#7c3aed'>🐝 JobHot</h2>
                    <h3>Chào mừng, {$toName}!</h3>
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

    $db->exec("
        CREATE TABLE IF NOT EXISTS site_ratings (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            rating     TINYINT NOT NULL,
            comment    TEXT DEFAULT NULL,
            ip         VARCHAR(45) DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $ip = $_SERVER['REMOTE_ADDR'] ?? null;
    $db->prepare("INSERT INTO site_ratings (rating, comment, ip) VALUES (?, ?, ?)")->execute([$rating, $comment ?: null, $ip]);

    sendJsonResponse(true, 'Cảm ơn bạn đã đánh giá!');
}

sendJsonResponse(false, "Action '$action' không tồn tại.", [], 404);
