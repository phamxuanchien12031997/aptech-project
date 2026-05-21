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
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';

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
            sendJsonResponse(
                false,
                'Database error: ' . $error->getMessage(),
                [],
                500
            );
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
			title VARCHAR(200) NOT NULL,
			company VARCHAR(200) NOT NULL,
			location VARCHAR(100) NOT NULL,
			work_type VARCHAR(50) NOT NULL,
			level VARCHAR(50) NOT NULL,
			salary VARCHAR(100) DEFAULT NULL,
			description TEXT DEFAULT NULL,
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

        $hashedPassword = password_hash(
            ADMIN_PASSWORD,
            PASSWORD_DEFAULT
        );

        $insertAdmin = $db->prepare("
			INSERT INTO users (
				full_name,
				email,
				password,
				role
			)
			VALUES (?, ?, ?, 'admin')
		");

        $insertAdmin->execute([
            ADMIN_NAME,
            ADMIN_EMAIL,
            $hashedPassword
        ]);
    }
}

function createLoginToken(array $userInfo): string
{
    $headerData = [
        'alg' => 'HS256',
        'typ' => 'JWT'
    ];

    $headerJson = json_encode($headerData);

    $headerEncoded = rtrim(
        base64_encode($headerJson),
        '='
    );

    $bodyJson = json_encode($userInfo);

    $bodyEncoded = rtrim(
        base64_encode($bodyJson),
        '='
    );

    $dataToSign = $headerEncoded . '.' . $bodyEncoded;

    $signatureRaw = hash_hmac(
        'sha256',
        $dataToSign,
        JWT_SECRET,
        true
    );

    $signatureEncoded = rtrim(
        base64_encode($signatureRaw),
        '='
    );

    return $headerEncoded . '.' . $bodyEncoded . '.' . $signatureEncoded;
}

function sendOtpByEmail(string $toEmail, string $otpCode): bool
{
    $phpMailerFolder = __DIR__ . '/PHPMailer/src/';

    $phpMailerExists = file_exists(
        $phpMailerFolder . 'PHPMailer.php'
    );

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
            $mailer->setFrom(
                MAIL_FROM,
                MAIL_FROM_NAME
            );
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

    return mail(
        $toEmail,
        $subject,
        $body,
        $headers
    );
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

    sendJsonResponse(
        true,
        'Lấy danh sách việc làm thành công.',
        $jobs
    );
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(
        false,
        'Chỉ hỗ trợ POST.',
        [],
        405
    );
}

$rawBody = file_get_contents('php://input');

$body = json_decode($rawBody, true);

if (!is_array($body)) {
    sendJsonResponse(
        false,
        'Body JSON không hợp lệ.',
        [],
        400
    );
}

if ($action === 'login') {
    $email = trim(
        isset($body['email'])
            ? $body['email']
            : ''
    );

    $password = isset($body['password']) ? $body['password'] : '';

    if ($email === '' || $password === '') {
        sendJsonResponse(
            false,
            'Vui lòng nhập đủ thông tin.',
            [],
            400
        );
    }

    $query = getDatabaseConnection()->prepare("
		SELECT *
		FROM users
		WHERE email = ?
		LIMIT 1
	");

    $query->execute([$email]);

    $user = $query->fetch();

    $passwordIsCorrect =
        $user &&
        password_verify($password, $user['password']);

    if (!$passwordIsCorrect) {

        sendJsonResponse(
            false,
            'Email hoặc mật khẩu không đúng.',
            [],
            401
        );
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
    ]);
}

if ($action === 'register') {
    $fullName = trim(
        isset($body['fullName'])
            ? $body['fullName']
            : ''
    );

    $email = trim(
        isset($body['email'])
            ? $body['email']
            : ''
    );

    $password = isset($body['password']) ? $body['password'] : '';

    $industry = trim(
        isset($body['industry'])
            ? $body['industry']
            : ''
    );

    $requestedRole = isset($body['role']) ? $body['role'] : '';

    if ($requestedRole === 'user' || $requestedRole === 'employer') {
        $role = $requestedRole;
    } else {
        $role = 'user';
    }

    if ($fullName === '' || $email === '' || $password === '') {
        sendJsonResponse(
            false,
            'Thiếu thông tin bắt buộc.',
            [],
            400
        );
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(
            false,
            'Email không hợp lệ.',
            [],
            400
        );
    }

    if (strlen($password) < 8) {
        sendJsonResponse(
            false,
            'Mật khẩu tối thiểu 8 ký tự.',
            [],
            400
        );
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
        sendJsonResponse(
            false,
            'Email này đã được sử dụng.',
            [],
            409
        );
    }

    $hashedPassword = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    $insertUser = $db->prepare("
		INSERT INTO users (
			full_name,
			email,
			password,
			role,
			industry
		)
		VALUES (?, ?, ?, ?, ?)
	");

    $insertUser->execute([
        $fullName,
        $email,
        $hashedPassword,
        $role,
        $industry !== '' ? $industry : null,
    ]);

    sendJsonResponse(
        true,
        'Đăng ký thành công.',
        [
            'role' => $role
        ]
    );
}

if ($action === 'forgot-password') {

    $email = trim(
        isset($body['email'])
            ? $body['email']
            : ''
    );

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(
            false,
            'Email không hợp lệ.',
            [],
            400
        );
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
        sendJsonResponse(
            true,
            'Nếu email tồn tại, mã OTP đã được gửi.'
        );
    }

    $otpCode = str_pad(
        random_int(0, 999999),
        6,
        '0',
        STR_PAD_LEFT
    );

    $expireOldOtps = $db->prepare("
		UPDATE otp_tokens
		SET used = 1
		WHERE email = ?
			AND used = 0
	");

    $expireOldOtps->execute([$email]);

    $expiresAt = date(
        'Y-m-d H:i:s',
        time() + 300
    );

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

    $emailSent = sendOtpByEmail(
        $email,
        $otpCode
    );

    if (!$emailSent) {
        sendJsonResponse(
            false,
            'Không thể gửi email. Thử lại sau.',
            [],
            500
        );
    }

    sendJsonResponse(
        true,
        'Mã OTP đã được gửi đến email của bạn.'
    );
}

if ($action === 'verify-otp') {
    $email = trim(
        isset($body['email'])
            ? $body['email']
            : ''
    );

    $otpCode = trim(
        isset($body['otp'])
            ? $body['otp']
            : ''
    );

    if ($email === '' || $otpCode === '') {
        sendJsonResponse(
            false,
            'Thiếu thông tin.',
            [],
            400
        );
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
        sendJsonResponse(
            false,
            'Mã OTP không đúng hoặc đã hết hạn.',
            [],
            400
        );
    }

    $markUsed = $db->prepare("
		UPDATE otp_tokens
		SET used = 1
		WHERE id = ?
	");

    $markUsed->execute([
        $otpRow['id']
    ]);

    sendJsonResponse(
        true,
        'Xác minh OTP thành công.'
    );
}

if ($action === 'reset-password') {
    $email = trim(
        isset($body['email'])
            ? $body['email']
            : ''
    );

    $newPassword = isset($body['password'])
        ? $body['password']
        : '';

    if ($email === '' || $newPassword === '') {
        sendJsonResponse(
            false,
            'Thiếu thông tin.',
            [],
            400
        );
    }

    if (strlen($newPassword) < 8) {
        sendJsonResponse(
            false,
            'Mật khẩu tối thiểu 8 ký tự.',
            [],
            400
        );
    }

    $hashedPassword = password_hash(
        $newPassword,
        PASSWORD_DEFAULT
    );

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
        sendJsonResponse(
            false,
            'Không tìm thấy tài khoản.',
            [],
            404
        );
    }

    sendJsonResponse(
        true,
        'Đặt lại mật khẩu thành công.'
    );
}

sendJsonResponse(
    false,
    "Action '$action' không tồn tại.",
    [],
    404
);
