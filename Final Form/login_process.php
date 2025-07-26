<?php
session_start();
header('Content-Type: application/json');

// Kết nối database
$host = "localhost";
$user = "root";
$password = "";
$database = "user_system";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi kết nối database: ' . $conn->connect_error
    ]);
    exit;
}

// Danh sách tài khoản hợp lệ (giống như code JS cũ)
$valid_users = [
    'admin@gmail.com' => 'admin123',
    'user@gmail.com' => 'user123',
    'manager@gmail.com' => 'manager123'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $input_password = $_POST['password'];
    
    // Kiểm tra tài khoản có hợp lệ không
    if (!isset($valid_users[$email]) || $valid_users[$email] !== $input_password) {
        echo json_encode([
            'success' => false,
            'message' => 'Email hoặc mật khẩu không đúng!'
        ]);
        exit;
    }
    
    // Kiểm tra xem user đã từng đăng nhập chưa
    $check_sql = "SELECT id, username, created_at, expires_at FROM users WHERE username = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    
    if ($result->num_rows > 0) {
        // User đã tồn tại - kiểm tra thời gian
        $user = $result->fetch_assoc();
        $current_time = date('Y-m-d H:i:s');
        
        if ($current_time < $user['expires_at']) {
            // Vẫn còn trong thời gian cấm đăng nhập
            $remaining_time = strtotime($user['expires_at']) - time();
            $remaining_days = ceil($remaining_time / (24 * 60 * 60));
            $remaining_hours = ceil($remaining_time / (60 * 60));
            
            if ($remaining_days > 1) {
                $time_text = $remaining_days . ' ngày';
            } else {
                $time_text = $remaining_hours . ' giờ';
            }
            
            echo json_encode([
                'success' => false,
                'message' => "❌ Không thể đăng nhập!<br><br>Tài khoản <strong>" . htmlspecialchars($email) . "</strong> đã đăng nhập trước đó.<br><br>Bạn phải chờ <strong>" . $time_text . "</strong> nữa mới có thể đăng nhập lại.<br><br>Thời gian hết hạn: <strong>" . date('d/m/Y H:i:s', strtotime($user['expires_at'])) . "</strong>"
            ]);
        } else {
            // Đã hết thời gian cấm - cho phép đăng nhập và reset thời gian
            $new_expires = date('Y-m-d H:i:s', strtotime('+7 days'));
            $update_sql = "UPDATE users SET expires_at = ?, last_login = NOW() WHERE id = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param("si", $new_expires, $user['id']);
            $update_stmt->execute();
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['username'];
            
            echo json_encode([
                'success' => true,
                'first_login' => false,
                'message' => "✅ Đăng nhập thành công!<br><br>Chào mừng <strong>" . htmlspecialchars($email) . "</strong> quay trở lại!<br><br>⚠️ Tài khoản sẽ bị khóa trong 7 ngày tiếp theo kể từ bây giờ."
            ]);
        }
    } else {
        // User chưa tồn tại - tạo mới và lưu vào database
        $hashed_password = password_hash($input_password, PASSWORD_DEFAULT);
        $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
        
        $insert_sql = "INSERT INTO users (username, password, created_at, expires_at, last_login) VALUES (?, ?, NOW(), ?, NOW())";
        $insert_stmt = $conn->prepare($insert_sql);
        $insert_stmt->bind_param("sss", $email, $hashed_password, $expires_at);
        
        if ($insert_stmt->execute()) {
            $_SESSION['user_id'] = $conn->insert_id;
            $_SESSION['user_email'] = $email;
            
            echo json_encode([
                'success' => true,
                'first_login' => true,
                'message' => "🎉 Đăng nhập lần đầu thành công!<br><br>Tài khoản <strong>" . htmlspecialchars($email) . "</strong> đã được tạo và lưu vào hệ thống.<br><br>⚠️ <strong>Lưu ý:</strong> Bạn sẽ không thể đăng nhập lại trong 7 ngày tới!<br><br>Thời gian hết hạn: <strong>" . date('d/m/Y H:i:s', strtotime($expires_at)) . "</strong>"
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Lỗi hệ thống: Không thể tạo tài khoản!'
            ]);
        }
    }
}

$conn->close();
?>