# Air Quality Dashboard - Cấu trúc Module

## Tổng quan
Dự án Air Quality Dashboard đã được tách thành các module riêng biệt để dễ quản lý và bảo trì. Mỗi module có chức năng riêng biệt và có thể được phát triển độc lập.

## Cấu trúc thư mục
```
/js
├── config.js          # Cấu hình và dữ liệu
├── dataService.js     # Xử lý dữ liệu từ API
├── uiManager.js       # Quản lý giao diện người dùng
├── chartManager.js    # Quản lý biểu đồ
├── exportManager.js   # Xuất dữ liệu
└── app.js            # File chính điều khiển ứng dụng
```

## Mô tả các module

### 1. config.js
**Chức năng:** Chứa tất cả cấu hình và dữ liệu tĩnh
- Cấu hình API (key, URL, interval)
- Dữ liệu mẫu cho biểu đồ
- Cấu hình AQI levels và màu sắc
- Cấu hình hướng gió
- Tên các ngày trong tuần

### 2. dataService.js
**Chức năng:** Xử lý việc lấy và xử lý dữ liệu từ API
- `fetchData()`: Lấy dữ liệu từ OpenWeatherMap API
- `getWindDirectionText()`: Chuyển đổi độ thành hướng gió
- `getLastUpdateTime()`: Lấy thời gian cập nhật cuối
- `getTimeSinceLastUpdate()`: Tính thời gian từ lần cập nhật cuối

### 3. uiManager.js
**Chức năng:** Quản lý tất cả các thao tác với giao diện người dùng
- `updateCurrentTime()`: Cập nhật thời gian hiện tại
- `updateUIWithNewData()`: Cập nhật UI với dữ liệu mới
- `updateAQIStatus()`: Cập nhật trạng thái và màu sắc AQI
- `updateIndicators()`: Cập nhật các chỉ số môi trường
- `startTimeUpdateTimer()`: Bắt đầu timer cập nhật thời gian
- `updateTimeRangeButtons()`: Cập nhật trạng thái nút thời gian

### 4. chartManager.js
**Chức năng:** Quản lý biểu đồ AQI
- `updateChart()`: Vẽ lại biểu đồ với dữ liệu mới
- `changeTimeRange()`: Thay đổi khoảng thời gian hiển thị (1h, 24h, 7d, 30d)
- `addDataPoint()`: Thêm điểm dữ liệu mới cho real-time
- `getAQIColor()`: Lấy màu tương ứng với giá trị AQI
- `getCurrentChartData()`: Lấy dữ liệu hiện tại của biểu đồ

### 5. exportManager.js
**Chức năng:** Xuất dữ liệu ra các định dạng khác nhau
- `exportData()`: Xuất dữ liệu ra file CSV
- `exportAsJSON()`: Xuất dữ liệu ra file JSON
- `generateSampleData()`: Tạo dữ liệu mẫu cho export
- `downloadCSV()`: Tải xuống file CSV

### 6. app.js
**Chức năng:** File chính điều khiển toàn bộ ứng dụng
- `init()`: Khởi tạo ứng dụng
- `setupUI()`: Thiết lập giao diện ban đầu
- `startTimers()`: Bắt đầu các timer
- `fetchAndUpdateData()`: Lấy và cập nhật dữ liệu
- `setupEventListeners()`: Thiết lập event listeners

## Cách sử dụng

### 1. Import vào HTML
```html
<script type="module" src="js/app.js"></script>
```

### 2. Cấu hình API
Trong file `config.js`, thay đổi:
```javascript
export const API_CONFIG = {
    key: 'YOUR_ACTUAL_API_KEY', // Thay bằng API key thật
    city: 'Hanoi',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    updateInterval: 10000
};
```

### 3. Tùy chỉnh cấu hình AQI
```javascript
export const AQI_CONFIG = {
    levels: [
        { max: 50, status: "Tốt", color: "#40c057" },
        // Thêm hoặc sửa các level khác
    ]
};
```

## Tính năng mới

### 1. Xuất dữ liệu JSON
```javascript
// Gọi từ console hoặc thêm button
window.dashboard.exportAsJSON();
```

### 2. Truy cập dữ liệu real-time
```javascript
// Lấy dữ liệu hiện tại
const currentData = window.dashboard.currentData;

// Lấy dữ liệu biểu đồ
const chartData = window.dashboard.chartManager.getCurrentChartData();
```

### 3. Tùy chỉnh interval cập nhật
```javascript
// Trong config.js
export const API_CONFIG = {
    updateInterval: 5000 // 5 giây thay vì 10 giây
};
```

## Lợi ích của việc tách module

### 1. **Dễ bảo trì**
- Mỗi module có trách nhiệm riêng biệt
- Dễ tìm và sửa lỗi
- Code rõ ràng, dễ đọc

### 2. **Có thể mở rộng**
- Thêm tính năng mới dễ dàng
- Thay thế một module mà không ảnh hưởng khác
- Tái sử dụng code

### 3. **Hiệu suất tốt hơn**
- Chỉ load những module cần thiết
- Dễ optimize từng phần riêng biệt
- Caching hiệu quả hơn

### 4. **Teamwork**
- Nhiều người có thể làm việc song song
- Dễ review code
- Ít conflict khi merge

## Debug và Monitoring

### 1. Kiểm tra trạng thái
```javascript
// Kiểm tra xem dashboard có chạy không
console.log(window.dashboard);

// Kiểm tra dữ liệu hiện tại
console.log(window.dashboard.currentData);

// Kiểm tra thời gian cập nhật cuối
console.log(window.dashboard.dataService.getLastUpdateTime());
```

### 2. Test từng module
```javascript
// Test DataService
const dataService = new DataService();
dataService.fetchData().then(data => console.log(data));

// Test ChartManager
const chartManager = new ChartManager();
chartManager.changeTimeRange('7d');
```

## Troubleshooting

### 1. **Lỗi CORS khi fetch API**
- Kiểm tra API key
- Đảm bảo domain được whitelist

### 2. **Module không load**
- Kiểm tra đường dẫn file
- Đảm bảo server hỗ trợ ES6 modules

### 3. **Biểu đồ không hiển thị**
- Kiểm tra element `#aqi-chart` có tồn tại
- Kiểm tra CSS cho `.chart-bar`

### 4. **Dữ liệu không cập nhật**
- Kiểm tra API key và network
- Xem console để debug lỗi fetch

## Phát triển tiếp

### 1. **Thêm tính năng mới**
- Tạo module mới trong thư mục `/js`
- Import vào `app.js`
- Khởi tạo trong constructor

### 2. **Tích hợp database**
- Tạo `databaseService.js`
- Lưu lịch sử dữ liệu
- Tạo báo cáo chi tiết

### 3. **Thêm notification**
- Tạo `notificationManager.js`
- Cảnh báo khi AQI cao
- Email/SMS alerts

### 4. **Mobile responsive**
- Tạo `mobileManager.js`
- Tối ưu cho mobile
- Touch gestures cho biểu đồ