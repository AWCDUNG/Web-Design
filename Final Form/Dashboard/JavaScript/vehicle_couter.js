// PHIÊN BẢN ĐỔN GIẢN - CHẮC CHẮN HOẠT ĐỘNG
console.log('🚀 Starting simple vehicle counter...');

// Khởi tạo ngay khi load
function startSimpleVehicleCounter() {
    let currentOnline = Math.floor(Math.random() * 8) + 1;
    let currentVisits = 1247;
    
    // Hàm cập nhật online count
    function updateOnline() {
        const onlineEl = document.getElementById('onlineCount');
        if (onlineEl) {
            currentOnline = Math.floor(Math.random() * 8) + 1;
            onlineEl.textContent = currentOnline;
            onlineEl.style.color = '#4CAF50';
            onlineEl.style.fontWeight = 'bold';
            
            setTimeout(() => {
                onlineEl.style.color = '';
                onlineEl.style.fontWeight = '';
            }, 500);
            
            console.log('🟢 Online updated:', currentOnline);
        } else {
            console.error('❌ onlineCount element not found!');
        }
    }
    
    // Hàm cập nhật visit count  
    function updateVisits() {
        if (Math.random() < 0.4) {
            const visitEl = document.getElementById('visitCount');
            if (visitEl) {
                currentVisits += Math.floor(Math.random() * 3) + 1;
                visitEl.textContent = currentVisits.toLocaleString();
                visitEl.style.color = '#2196F3';
                
                setTimeout(() => {
                    visitEl.style.color = '';
                }, 500);
                
                console.log('👁️ Visits updated:', currentVisits);
            }
        }
    }
    
    // Cập nhật ngay lập tức
    setTimeout(() => {
        updateOnline();
        console.log('✅ Initial update completed');
    }, 500);
    
    // Timer cho online count - thay đổi mỗi 15-25 giây
    setInterval(() => {
        updateOnline();
    }, Math.floor(Math.random() * 10000) + 15000); // 15-25 giây
    
    // Timer cho visit count - thay đổi mỗi 20-35 giây  
    setInterval(() => {
        updateVisits();
    }, Math.floor(Math.random() * 15000) + 20000); // 20-35 giây
    
    // Thêm random timer để tạo sự thay đổi không đều
    function createRandomTimer() {
        const delay = Math.floor(Math.random() * 20000) + 10000; // 10-30 giây
        setTimeout(() => {
            if (Math.random() < 0.6) { // 60% chance thay đổi online
                updateOnline();
            }
            createRandomTimer(); // Tạo timer tiếp theo
        }, delay);
    }
    
    // Bắt đầu random timer
    setTimeout(createRandomTimer, 5000);
    
    // Test ngay để xem elements có tồn tại không
    setTimeout(() => {
        const onlineEl = document.getElementById('onlineCount');
        const visitEl = document.getElementById('visitCount');
        
        console.log('🔍 Elements check:');
        console.log('onlineCount:', onlineEl ? 'FOUND ✅' : 'NOT FOUND ❌');
        console.log('visitCount:', visitEl ? 'FOUND ✅' : 'NOT FOUND ❌');
        
        if (onlineEl) {
            console.log('Current online text:', onlineEl.textContent);
        }
        if (visitEl) {
            console.log('Current visit text:', visitEl.textContent);
        }
    }, 1000);
}

// Khởi động counter
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSimpleVehicleCounter);
} else {
    startSimpleVehicleCounter();
}

// Function để test thủ công từ console
window.testCounter = function() {
    const onlineEl = document.getElementById('onlineCount');
    if (onlineEl) {
        const newNumber = Math.floor(Math.random() * 8) + 1;
        onlineEl.textContent = newNumber;
        onlineEl.style.background = 'yellow';
        setTimeout(() => {
            onlineEl.style.background = '';
        }, 1000);
        console.log('🧪 Manual test - set online to:', newNumber);
    } else {
        console.error('❌ Cannot find onlineCount element for manual test');
    }
}