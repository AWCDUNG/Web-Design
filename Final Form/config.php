<?php
// config.php
$host = 'localhost';
$dbname = 'visit_stats'; // Thay đổi nếu cần
$username = 'root'; // Thay đổi nếu cần
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Lấy thông tin visitor
$ip = $_SERVER['REMOTE_ADDR'];
$user_agent = $_SERVER['HTTP_USER_AGENT'];
$current_url = $_SERVER['REQUEST_URI'];
$session_id = session_id();

// Thêm visit mới
$stmt = $pdo->prepare("INSERT INTO visit_stats (ip_address, user_agent, page_url, session_id) VALUES (?, ?, ?, ?)");
$stmt->execute([$ip, $user_agent, $current_url, $session_id]);

// Cập nhật thống kê hàng ngày
$today = date('Y-m-d');
$stmt = $pdo->prepare("INSERT INTO daily_stats (date, total_visits, unique_visitors) VALUES (?, 1, 1) ON DUPLICATE KEY UPDATE total_visits = total_visits + 1");
$stmt->execute([$today]);

// Lấy thống kê
$stmt = $pdo->query("SELECT COUNT(*) as total_visits FROM visit_stats");
$total_visits = $stmt->fetch()['total_visits'];

$stmt = $pdo->query("SELECT total_visits as today_visits FROM daily_stats WHERE date = CURDATE()");
$today_visits = $stmt->fetch()['today_visits'] ?? 0;
?>