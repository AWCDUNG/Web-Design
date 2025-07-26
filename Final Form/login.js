// Cập nhật counter khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Gọi API để cập nhật counter
    updateVisitCounter();
    
    // Xử lý form login
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy giá trị email và password
        const email = document.querySelector('input[type="text"]').value;
        const password = document.querySelector('input[type="password"]').value;
        
        // Kiểm tra đăng nhập
        if (checkLogin(email, password)) {
            // Hiển thị thông báo thành công
            showMessage('Đăng nhập thành công! Đang chuyển hướng...', 'success');
            
            // Lưu trạng thái đăng nhập
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            // Chuyển hướng sau 1.5 giây
            setTimeout(() => {
                window.location.href = 'Dashboard/index.html';
            }, 1500);
            
        } else {
            // Hiển thị thông báo lỗi
            showMessage('Email hoặc mật khẩu không đúng!', 'error');
            
            // Reset form
            document.querySelector('input[type="text"]').value = '';
            document.querySelector('input[type="password"]').value = '';
        }
    });
});

// Hàm cập nhật counter
function updateVisitCounter() {
    fetch('counter.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.visits) {
            document.getElementById('visit-count').textContent = data.visits;
        }
    })
    .catch(error => {
        console.error('Error updating visit counter:', error);
        // Fallback: hiển thị counter từ localStorage nếu có
        const localCount = localStorage.getItem('visit_count') || '0';
        document.getElementById('visit-count').textContent = localCount;
    });
}

// Hàm kiểm tra đăng nhập
function checkLogin(email, password) {
    // Danh sách tài khoản hợp lệ
    const users = {
        'admin@gmail.com': 'admin123',
        'user@gmail.com': 'user123',
        'manager@gmail.com': 'manager123'
    };
    
    return users[email] && users[email] === password;
}

// Hàm hiển thị thông báo
function showMessage(message, type) {
    // Xóa thông báo cũ nếu có
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Tạo thông báo mới
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const bgColor = type === 'success' ? '#4CAF50' : '#f44336';
    const icon = type === 'success' ? '✓' : '✕';
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease-out;
        ">
            <span style="font-size: 16px; font-weight: bold;">${icon}</span>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove sau 4 giây
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 4000);
}

// Thêm CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);