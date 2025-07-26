// aqi-status-updater.js - Cập nhật trạng thái thông báo theo AQI hiện tại

class AQIStatusUpdater {
   constructor() {
       this.currentAQI = 0;
       this.statusConfig = {
           good: {
               range: [0, 50],
               status: 'Tốt',
               color: '#4CAF50',
               bgColor: '#e8f5e8',
               borderColor: '#c3e6cb',
               description: 'Chất lượng không khí được coi là đạt tiêu chuẩn và ô nhiễm không khí ít hoặc không có nguy cơ',
               advice: 'Thời điểm tuyệt vời để hoạt động ngoài trời'
           },
           moderate: {
               range: [51, 100],
               status: 'Vừa phải',
               color: '#FF9800',
               bgColor: '#fff3e0',
               borderColor: '#ffcc02',
               description: 'Chất lượng không khí có thể chấp nhận được đối với hầu hết mọi người nhưng có thể gây lo ngại cho một số người nhạy cảm',
               advice: 'Nhóm nhạy cảm nên hạn chế hoạt động ngoài trời'
           },
           unhealthy_sensitive: {
               range: [101, 150],
               status: 'Không tốt cho nhóm nhạy cảm',
               color: '#FF5722',
               bgColor: '#fce4ec',
               borderColor: '#f8bbd9',
               description: 'Các thành viên của nhóm nhạy cảm có thể gặp phải các vấn đề sức khỏe',
               advice: 'Nhóm nhạy cảm nên tránh hoạt động ngoài trời'
           },
           unhealthy: {
               range: [151, 200],
               status: 'Có hại cho sức khỏe',
               color: '#F44336',
               bgColor: '#ffebee',
               borderColor: '#ffcdd2',
               description: 'Mọi người có thể bắt đầu gặp phải các vấn đề sức khỏe',
               advice: 'Mọi người nên hạn chế hoạt động ngoài trời'
           },
           very_unhealthy: {
               range: [201, 300],
               status: 'Rất nguy hại',
               color: '#9C27B0',
               bgColor: '#f3e5f5',
               borderColor: '#ce93d8',
               description: 'Cảnh báo sức khỏe nghiêm trọng. Mọi người có thể gặp phải các tác động sức khỏe nghiêm trọng hơn',
               advice: 'Mọi người nên tránh hoạt động ngoài trời'
           },
           hazardous: {
               range: [301, 500],
               status: 'Nguy hiểm',
               color: '#8B0000',
               bgColor: '#ffebee',
               borderColor: '#ef5350',
               description: 'Cảnh báo sức khỏe khẩn cấp. Toàn bộ dân số có nhiều khả năng bị ảnh hưởng',
               advice: 'Mọi người phải tránh hoạt động ngoài trời'
           }
       };
   }

   // Lấy cấu hình trạng thái dựa trên AQI
   getStatusConfig(aqi) {
       for (const [key, config] of Object.entries(this.statusConfig)) {
           if (aqi >= config.range[0] && aqi <= config.range[1]) {
               return config;
           }
       }
       return this.statusConfig.hazardous; // Mặc định nếu > 500
   }

   // Cập nhật thông báo AQI
   updateNotification(aqi) {
       this.currentAQI = aqi;
       const config = this.getStatusConfig(aqi);
       
       // Tìm container thông báo
       let notification = document.querySelector('.air-quality-notification');
       
       if (!notification) {
           // Tạo mới nếu chưa có
           notification = this.createNotificationElement();
           // Thêm vào đầu body hoặc container mong muốn
           const targetContainer = document.querySelector('.main-content') || document.body;
           targetContainer.insertBefore(notification, targetContainer.firstChild);
       }

       // Cập nhật nội dung
       this.updateNotificationContent(notification, config, aqi);
   }

   // Tạo element thông báo mới
   createNotificationElement() {
       const notification = document.createElement('div');
       notification.className = 'air-quality-notification';
       notification.innerHTML = `
           <div class="notification-header">
               <div class="status-icon">✓</div>
               <div class="status-text">
                   <h3>Chất lượng không khí</h3>
                   <span class="status-label">Đang tải...</span>
               </div>
               <div class="aqi-badge">AQI --</div>
           </div>
           <div class="notification-body">
               <p>Đang tải thông tin chất lượng không khí...</p>
           </div>
           <div class="notification-footer">
               <span class="location-info">📍 Đang cập nhật...</span>
           </div>
       `;

       // Thêm CSS nếu chưa có
       this.addStyles();
       
       return notification;
   }

   // Cập nhật nội dung thông báo
   updateNotificationContent(notification, config, aqi) {
       // Cập nhật màu nền và viền
       notification.style.background = config.bgColor;
       notification.style.borderColor = config.borderColor;

       // Cập nhật icon trạng thái
       const statusIcon = notification.querySelector('.status-icon');
       if (statusIcon) {
           statusIcon.style.backgroundColor = config.color;
           // Thay đổi icon dựa trên mức độ
           if (aqi <= 50) {
               statusIcon.textContent = '✓';
           } else if (aqi <= 100) {
               statusIcon.textContent = '!';
           } else {
               statusIcon.textContent = '⚠';
           }
       }

       // Cập nhật text trạng thái
       const statusLabel = notification.querySelector('.status-label');
       if (statusLabel) {
           statusLabel.textContent = config.status;
           statusLabel.style.color = this.getTextColor(config.bgColor);
       }

       // Cập nhật AQI badge
       const aqiBadge = notification.querySelector('.aqi-badge');
       if (aqiBadge) {
           aqiBadge.textContent = `AQI ${aqi}`;
           aqiBadge.style.backgroundColor = config.color;
       }

       // Cập nhật mô tả
       const description = notification.querySelector('.notification-body p');
       if (description) {
           description.textContent = config.description;
           description.style.color = this.getTextColor(config.bgColor);
       }

       // Cập nhật lời khuyên
       const advice = notification.querySelector('.location-info');
       if (advice) {
           advice.innerHTML = `📍 ${config.advice}`;
           advice.style.color = '#666';
       }

       // Cập nhật header text color
       const headerTitle = notification.querySelector('.status-text h3');
       if (headerTitle) {
           headerTitle.style.color = this.getTextColor(config.bgColor);
       }
   }

   // Xác định màu text phù hợp với background
   getTextColor(bgColor) {
       // Chuyển hex sang RGB và tính độ sáng
       const r = parseInt(bgColor.substr(1,2), 16);
       const g = parseInt(bgColor.substr(3,2), 16);
       const b = parseInt(bgColor.substr(5,2), 16);
       const brightness = (r * 299 + g * 587 + b * 114) / 1000;
       
       return brightness > 128 ? '#333' : '#fff';
   }

   // Thêm CSS styles
   addStyles() {
       if (document.querySelector('#aqi-notification-styles')) return;

       const styles = document.createElement('style');
       styles.id = 'aqi-notification-styles';
       styles.textContent = `
           .air-quality-notification {
               background: #e8f5e8;
               border: 1px solid #c3e6cb;
               border-radius: 8px;
               padding: 16px;
               margin-bottom: 16px;
               font-family: Arial, sans-serif;
               max-width: 500px;
               transition: all 0.3s ease;
           }

           .notification-header {
               display: flex;
               align-items: center;
               gap: 12px;
               margin-bottom: 8px;
           }

           .status-icon {
               width: 24px;
               height: 24px;
               background: #4CAF50;
               color: white;
               border-radius: 50%;
               display: flex;
               align-items: center;
               justify-content: center;
               font-weight: bold;
               font-size: 14px;
               transition: background-color 0.3s ease;
           }

           .status-text {
               flex-grow: 1;
           }

           .status-text h3 {
               margin: 0;
               font-size: 16px;
               color: #2d5016;
               transition: color 0.3s ease;
           }

           .status-label {
               font-size: 14px;
               color: #2d5016;
               font-weight: 500;
               transition: color 0.3s ease;
           }

           .aqi-badge {
               background: #4CAF50;
               color: white;
               padding: 4px 8px;
               border-radius: 4px;
               font-size: 12px;
               font-weight: bold;
               transition: background-color 0.3s ease;
           }

           .notification-body p {
               margin: 8px 0;
               font-size: 14px;
               color: #2d5016;
               line-height: 1.4;
               transition: color 0.3s ease;
           }

           .notification-footer {
               margin-top: 8px;
           }

           .location-info {
               font-size: 13px;
               color: #666;
               display: flex;
               align-items: center;
               gap: 4px;
           }

           @media (max-width: 768px) {
               .air-quality-notification {
                   margin: 8px;
                   max-width: calc(100% - 16px);
               }
           }
       `;
       
       document.head.appendChild(styles);
   }

   // Hàm để tích hợp với hệ thống hiện tại
   connectToExistingSystem() {
       // Lắng nghe sự thay đổi của currentData từ hệ thống chính
       if (typeof currentData !== 'undefined') {
           const checkAQI = () => {
               if (currentData.aqi !== this.currentAQI) {
                   this.updateNotification(currentData.aqi);
               }
           };
           
           // Kiểm tra mỗi 2 giây
           setInterval(checkAQI, 2000);
           
           // Cập nhật ngay lập tức
           if (currentData.aqi > 0) {
               this.updateNotification(currentData.aqi);
           }
       }
   }

   // API công khai
   setAQI(aqi) {
       this.updateNotification(aqi);
   }

   getCurrentAQI() {
       return this.currentAQI;
   }

   hide() {
       const notification = document.querySelector('.air-quality-notification');
       if (notification) {
           notification.style.display = 'none';
       }
   }

   show() {
       const notification = document.querySelector('.air-quality-notification');
       if (notification) {
           notification.style.display = 'block';
       }
   }
}

// Khởi tạo và export
const aqiStatusUpdater = new AQIStatusUpdater();

// Tự động kết nối với hệ thống hiện tại khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
   setTimeout(() => {
       aqiStatusUpdater.connectToExistingSystem();
   }, 1000);
});

// Export để sử dụng từ bên ngoài
window.AQIStatusUpdater = aqiStatusUpdater;