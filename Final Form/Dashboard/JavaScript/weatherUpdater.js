// // // File: JavaScript/weatherUpdater.js
// // // Mô tả: Cập nhật dữ liệu thời tiết với biến đổi chậm và khoảng cách ngắn
// // // Chú ý: Đảm bảo server đang chạy và có endpoint http://
// // File: JavaScript/weatherUpdater.js
// // Mô tả: Cập nhật dữ liệu thời tiết với biến đổi chậm và khoảng cách ngắn
// // Phiên bản cải tiến để xử lý đúng cấu trúc dữ liệu từ server

// const serverUrl = 'https://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php';

// // Lưu trữ giá trị hiện tại để tạo sự biến đổi mượt mà
// let currentData = {
//     temperature: 25,
//     temperatureIndoor: 24,
//     humidity: 65,
//     pm25: 50,
//     pm10: 80,
//     coGas: 300,
//     lpgGas: 150,
//     ch4Gas: 100,
//     flameDetected: 'No',
//     weight: 1200,
//     lightIntensity: 5,
//     pressure: 1013,
//     speed: 0,
//     latitude: 21.856089,
//     longitude: 105.060879,
//     acceleration: 0,
//     tiltAngle: 0,
//     lightLeakDetected: 'No'
// };

// // Lưu trữ thông tin thiết bị
// let deviceInfo = {
//     deviceId: 'HCM_A12',
//     userId: '',
//     status: 'Online',
//     licensePlate: '10C-868.68',
//     lastUpdate: ''
// };

// // Tạo số ngẫu nhiên trong khoảng nhỏ
// function randomSmallChange(currentValue, minRange, maxRange, maxChange = 2) {
//     const change = (Math.random() - 0.5) * 2 * maxChange;
//     const newValue = currentValue + change;
//     return Math.max(minRange, Math.min(maxRange, newValue));
// }

// // Làm tròn theo số thập phân
// function roundToDecimals(num, decimals = 1) {
//     return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
// }

// // Chuyển đổi và mapping dữ liệu từ server
// function mapServerData(serverData) {
//     if (!serverData || !serverData.data || serverData.data.length === 0) {
//         return null;
//     }

//     const data = serverData.data[0];
    
//     // Cập nhật thông tin thiết bị
//     deviceInfo = {
//         deviceId: data.device_id || deviceInfo.deviceId,
//         userId: data.user_id || deviceInfo.userId,
//         status: data.status || deviceInfo.status,
//         licensePlate: data.license_plate || deviceInfo.licensePlate,
//         lastUpdate: data.created_at || new Date().toISOString()
//     };

//     // Mapping dữ liệu cảm biến
//     return {
//         temperature: parseFloat(data.Temperature) || currentData.temperature,
//         temperatureIndoor: (parseFloat(data.Temperature) - 1) || currentData.temperatureIndoor,
//         humidity: parseFloat(data.Humidity) || currentData.humidity,
//         pm25: parseFloat(data.Pm25) || currentData.pm25,
//         pm10: parseFloat(data.Pm10) || currentData.pm10,
//         coGas: parseFloat(data.CoGas) || currentData.coGas,
//         lpgGas: currentData.lpgGas,
//         ch4Gas: currentData.ch4Gas,
//         flameDetected: data.flame_detected === '1' ? 'Yes' : 'No',
//         weight: currentData.weight,
//         lightIntensity: currentData.lightIntensity,
//         pressure: parseFloat(data.Pressure) || currentData.pressure,
//         speed: parseFloat(data.Speed) || 0,
//         latitude: parseFloat(data.Latitude) || currentData.latitude,
//         longitude: parseFloat(data.Longitude) || currentData.longitude,
//         acceleration: parseFloat(data.acceleration) || 0,
//         tiltAngle: parseFloat(data.tilt_angle) || 0,
//         lightLeakDetected: data.light_leak_detected === '1' ? 'Yes' : 'No'
//     };
// }

// // Lấy dữ liệu từ server hoặc tạo dữ liệu mượt mà
// async function getData() {
//     try {
//         const response = await fetch(serverUrl);
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const serverData = await response.json();
//         console.log('📡 Dữ liệu từ server:', serverData);
        
//         // Nếu có dữ liệu từ server, sử dụng và mapping
//         const mappedData = mapServerData(serverData);
//         if (mappedData) {
//             // Cập nhật currentData với dữ liệu từ server
//             currentData = { ...currentData, ...mappedData };
            
//             // Simulate dữ liệu cho các field không có từ server
//             currentData.lpgGas = roundToDecimals(randomSmallChange(currentData.lpgGas, 50, 500, 15.0), 0);
//             currentData.ch4Gas = roundToDecimals(randomSmallChange(currentData.ch4Gas, 20, 200, 10.0), 0);
//             currentData.weight = roundToDecimals(randomSmallChange(currentData.weight, 800, 2000, 25.0), 0);
//             currentData.lightIntensity = roundToDecimals(randomSmallChange(currentData.lightIntensity, 0, 10, 0.5));
            
//             return currentData;
//         }
//     } catch (error) {
//         console.log('⚠️ Không thể kết nối server:', error.message);
//         console.log('🔄 Sử dụng dữ liệu mô phỏng');
//     }
    
//     // Tạo dữ liệu mượt mà với thay đổi nhỏ (fallback)
//     currentData = {
//         temperature: roundToDecimals(randomSmallChange(currentData.temperature, 15, 35, 1.5)),
//         temperatureIndoor: roundToDecimals(randomSmallChange(currentData.temperatureIndoor, 18, 30, 1.0)),
//         humidity: roundToDecimals(randomSmallChange(currentData.humidity, 40, 90, 3.0), 0),
//         pm25: roundToDecimals(randomSmallChange(currentData.pm25, 5, 150, 8.0), 0),
//         pm10: roundToDecimals(randomSmallChange(currentData.pm10, 10, 200, 10.0), 0),
//         coGas: roundToDecimals(randomSmallChange(currentData.coGas, 100, 1000, 20.0), 0),
//         lpgGas: roundToDecimals(randomSmallChange(currentData.lpgGas, 50, 500, 15.0), 0),
//         ch4Gas: roundToDecimals(randomSmallChange(currentData.ch4Gas, 20, 200, 10.0), 0),
//         flameDetected: Math.random() > 0.98 ? (currentData.flameDetected === 'Yes' ? 'No' : 'Yes') : currentData.flameDetected,
//         weight: roundToDecimals(randomSmallChange(currentData.weight, 800, 2000, 25.0), 0),
//         lightIntensity: roundToDecimals(randomSmallChange(currentData.lightIntensity, 0, 10, 0.5)),
//         pressure: roundToDecimals(randomSmallChange(currentData.pressure, 1000, 1020, 1.0)),
//         speed: roundToDecimals(randomSmallChange(currentData.speed, 0, 120, 5.0), 0),
//         acceleration: roundToDecimals(randomSmallChange(currentData.acceleration, 0, 5, 0.3)),
//         tiltAngle: roundToDecimals(randomSmallChange(currentData.tiltAngle, 0, 45, 2.0)),
//         lightLeakDetected: Math.random() > 0.95 ? (currentData.lightLeakDetected === 'Yes' ? 'No' : 'Yes') : currentData.lightLeakDetected,
//         latitude: currentData.latitude,
//         longitude: currentData.longitude
//     };
    
//     return currentData;
// }

// // Cập nhật giao diện
// function updateDisplay(data) {
//     // Nhiệt độ ngoài trời
//     const tempCard = document.querySelector('.temperature .stat-number');
//     if (tempCard) tempCard.textContent = data.temperature;

//     // Nhiệt độ trong xe
//     const tempIndoorCard = document.querySelector('.temperature-indoor .stat-number');
//     if (tempIndoorCard) tempIndoorCard.textContent = data.temperatureIndoor;

//     // Độ ẩm
//     const humidityCard = document.querySelector('.humidity .stat-number');
//     if (humidityCard) humidityCard.textContent = data.humidity;

//     // PM2.5
//     const pm25Card = document.querySelector('.air-quality .stat-number');
//     if (pm25Card) pm25Card.textContent = data.pm25;

//     // PM10
//     const pm10Card = document.querySelector('.air-quality-pm10 .stat-number');
//     if (pm10Card) pm10Card.textContent = data.pm10;

//     // CO Gas
//     const coGasCard = document.querySelector('.co-gas .stat-number');
//     if (coGasCard) coGasCard.textContent = data.coGas;

//     // LPG Gas
//     const lpgGasCard = document.querySelector('.lpg-gas .stat-number');
//     if (lpgGasCard) lpgGasCard.textContent = data.lpgGas;

//     // CH4 Gas
//     const ch4GasCard = document.querySelector('.ch4-gas .stat-number');
//     if (ch4GasCard) ch4GasCard.textContent = data.ch4Gas;

//     // Phát hiện lửa
//     const flameCard = document.querySelector('.flame-sensor .stat-number');
//     if (flameCard) flameCard.textContent = data.flameDetected;

//     // Trọng lượng
//     const weightCard = document.querySelector('.weight .stat-number');
//     if (weightCard) weightCard.textContent = data.weight;

//     // Cường độ ánh sáng
//     const lightCard = document.querySelector('.light .stat-number');
//     if (lightCard) lightCard.textContent = data.lightIntensity;

//     // Áp suất
//     const pressureCard = document.querySelector('.pressure .stat-number');
//     if (pressureCard) pressureCard.textContent = data.pressure;

//     // Tốc độ
//     const speedCard = document.querySelector('.speed .stat-number');
//     if (speedCard) speedCard.textContent = data.speed;

//     // Gia tốc
//     const accelerationCard = document.querySelector('.acceleration .stat-number');
//     if (accelerationCard) accelerationCard.textContent = data.acceleration;

//     // Góc nghiêng
//     const tiltAngleCard = document.querySelector('.tilt-angle .stat-number');
//     if (tiltAngleCard) tiltAngleCard.textContent = data.tiltAngle;

//     // Rò rỉ ánh sáng
//     const lightLeakCard = document.querySelector('.light-leak .stat-number');
//     if (lightLeakCard) lightLeakCard.textContent = data.lightLeakDetected;

//     // Vị trí GPS
//     const latCard = document.querySelector('.latitude .stat-number');
//     if (latCard) latCard.textContent = data.latitude;

//     const lonCard = document.querySelector('.longitude .stat-number');
//     if (lonCard) lonCard.textContent = data.longitude;

//     // Hiển thị thông tin thiết bị
//     const deviceIdCard = document.querySelector('.device-id .stat-number');
//     if (deviceIdCard) deviceIdCard.textContent = deviceInfo.deviceId;

//     const userIdCard = document.querySelector('.user-id .stat-number');
//     if (userIdCard) userIdCard.textContent = deviceInfo.userId;

//     const licensePlateCard = document.querySelector('.license-plate .stat-number');
//     if (licensePlateCard) licensePlateCard.textContent = deviceInfo.licensePlate;

//     // Kiểm tra cảnh báo nếu có hệ thống cảnh báo
//     if (window.warningSystem && window.warningSystem.checkWarnings) {
//         window.warningSystem.checkWarnings(data);
//     }

//     // Log chi tiết
//     console.log(`📊 ${new Date().toLocaleTimeString()}: 
//         🌡️ Temp: ${data.temperature}°C (Indoor: ${data.temperatureIndoor}°C)
//         💧 Humidity: ${data.humidity}% | 🌫️ PM2.5: ${data.pm25} | PM10: ${data.pm10}
//         🏭 CO: ${data.coGas} | LPG: ${data.lpgGas} | CH4: ${data.ch4Gas}
//         🔥 Flame: ${data.flameDetected} | 💡 Light Leak: ${data.lightLeakDetected}
//         ⚖️ Weight: ${data.weight}kg | 💡 Light: ${data.lightIntensity}
//         🌀 Pressure: ${data.pressure}hPa | 🚗 Speed: ${data.speed}km/h
//         📈 Acceleration: ${data.acceleration}m/s² | 📐 Tilt: ${data.tiltAngle}°
//         📍 GPS: ${data.latitude}, ${data.longitude}
//         🔧 Device: ${deviceInfo.deviceId} | 👤 User: ${deviceInfo.userId}
//         📋 Status: ${deviceInfo.status} | 🚙 Plate: ${deviceInfo.licensePlate}`);
// }

// // Chạy cập nhật
// async function update() {
//     try {
//         const data = await getData();
//         updateDisplay(data);
//     } catch (error) {
//         console.error('❌ Lỗi khi cập nhật:', error);
//     }
// }

// // Hàm để lấy dữ liệu thô từ server (để debug)
// async function getServerData() {
//     try {
//         const response = await fetch(serverUrl);
//         const data = await response.json();
//         console.log('🔍 Server Data:', JSON.stringify(data, null, 2));
//         return data;
//     } catch (error) {
//         console.error('❌ Lỗi khi lấy dữ liệu server:', error);
//         return null;
//     }
// }

// // Hàm để test kết nối server
// async function testConnection() {
//     console.log('🔄 Đang kiểm tra kết nối server...');
//     const data = await getServerData();
//     if (data) {
//         console.log('✅ Kết nối thành công!');
//         console.log('📊 Số lượng records:', data.data ? data.data.length : 0);
//         if (data.data && data.data.length > 0) {
//             console.log('🔍 Record đầu tiên:', data.data[0]);
//         }
//     } else {
//         console.log('❌ Không thể kết nối server');
//     }
//     return data;
// }

// // Hàm để bật/tắt chế độ debug
// function toggleDebug() {
//     window.debugMode = !window.debugMode;
//     console.log(`🔧 Debug mode: ${window.debugMode ? 'ON' : 'OFF'}`);
// }

// // Hàm để reset dữ liệu về giá trị mặc định
// function resetData() {
//     currentData = {
//         temperature: 25,
//         temperatureIndoor: 24,
//         humidity: 65,
//         pm25: 50,
//         pm10: 80,
//         coGas: 300,
//         lpgGas: 150,
//         ch4Gas: 100,
//         flameDetected: 'No',
//         weight: 1200,
//         lightIntensity: 5,
//         pressure: 1013,
//         speed: 0,
//         latitude: 21.856089,
//         longitude: 105.060879,
//         acceleration: 0,
//         tiltAngle: 0,
//         lightLeakDetected: 'No'
//     };
//     console.log('🔄 Đã reset dữ liệu về giá trị mặc định');
// }

// // Hàm để lấy thống kê
// function getStats() {
//     const stats = {
//         currentData: currentData,
//         deviceInfo: deviceInfo,
//         serverUrl: serverUrl,
//         lastUpdate: new Date().toISOString()
//     };
//     console.log('📊 Thống kê hiện tại:', JSON.stringify(stats, null, 2));
//     return stats;
// }

// // Export các hàm để có thể sử dụng từ console
// window.weatherUpdater = {
//     update,
//     getServerData,
//     testConnection,
//     getCurrentData: () => currentData,
//     getDeviceInfo: () => deviceInfo,
//     getStats,
//     resetData,
//     toggleDebug
// };

// // Khởi tạo
// console.log('🚀 Khởi động Weather Updater...');
// console.log('🌐 Server URL:', serverUrl);
// console.log('🔧 Các lệnh có sẵn:');
// console.log('  - weatherUpdater.update() - Cập nhật dữ liệu');
// console.log('  - weatherUpdater.getServerData() - Lấy dữ liệu từ server');
// console.log('  - weatherUpdater.testConnection() - Test kết nối');
// console.log('  - weatherUpdater.getStats() - Xem thống kê');
// console.log('  - weatherUpdater.resetData() - Reset dữ liệu');
// console.log('  - weatherUpdater.toggleDebug() - Bật/tắt debug');

// // Bắt đầu với tần suất cập nhật 5 giây
// setInterval(update, 5000);
// update(); // Chạy ngay lần đầu

// // Test kết nối ban đầu
// setTimeout(testConnection, 1000);

const serverUrl = 'https://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php';

// Lưu trữ giá trị mặc định khi không có dữ liệu từ server
let defaultData = {
    temperature: null,
    temperatureIndoor: null,
    humidity: null,
    pm25: null,
    pm10: null,
    coGas: null,
    lpgGas: null,
    ch4Gas: null,
    flameDetected: 'No',
    weight: null,
    lightIntensity: null,
    pressure: null,
    speed: 0,
    latitude: 21.856089,
    longitude: 105.060879,
    acceleration: 0,
    tiltAngle: 0,
    lightLeakDetected: 'No'
};

// Lưu trữ thông tin thiết bị
let deviceInfo = {
    deviceId: 'HCM_A12',
    userId: '',
    status: 'Offline',
    licensePlate: '10C-868.68',
    lastUpdate: ''
};

// Lưu trữ dữ liệu hiện tại từ API
let currentData = { ...defaultData };

// Làm tròn theo số thập phân
function roundToDecimals(num, decimals = 1) {
    if (num === null || num === undefined || isNaN(num)) return null;
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Chuyển đổi và mapping dữ liệu từ server
function mapServerData(serverData) {
    if (!serverData || !serverData.data || serverData.data.length === 0) {
        console.log('⚠️ Không có dữ liệu từ server');
        return null;
    }

    const data = serverData.data[0];
    console.log('📥 Raw data từ server:', data);
    
    // Cập nhật thông tin thiết bị
    deviceInfo = {
        deviceId: data.device_id || deviceInfo.deviceId,
        userId: data.user_id || deviceInfo.userId,
        status: 'Online', // Nếu có dữ liệu thì thiết bị online
        licensePlate: data.license_plate || deviceInfo.licensePlate,
        lastUpdate: data.created_at || new Date().toISOString()
    };

    // Mapping dữ liệu cảm biến - chỉ sử dụng dữ liệu thực từ API
    const mappedData = {
        temperature: data.Temperature ? roundToDecimals(parseFloat(data.Temperature)) : null,
        temperatureIndoor: data.Temperature ? roundToDecimals(parseFloat(data.Temperature) - 1) : null, // Giả sử nhiệt độ trong xe thấp hơn 1°C
        humidity: data.Humidity ? roundToDecimals(parseFloat(data.Humidity), 0) : null,
        pm25: data.Pm25 ? roundToDecimals(parseFloat(data.Pm25), 0) : null,
        pm10: data.Pm10 ? roundToDecimals(parseFloat(data.Pm10), 0) : null,
        coGas: data.CoGas ? roundToDecimals(parseFloat(data.CoGas), 0) : null,
        lpgGas: null, // Không có trong API
        ch4Gas: null, // Không có trong API
        flameDetected: data.flame_detected === '1' ? 'Yes' : 'No',
        weight: null, // Không có trong API
        lightIntensity: null, // Không có trong API
        pressure: data.Pressure ? roundToDecimals(parseFloat(data.Pressure)) : null,
        speed: data.Speed ? roundToDecimals(parseFloat(data.Speed), 0) : 0,
        latitude: data.Latitude ? roundToDecimals(parseFloat(data.Latitude), 6) : currentData.latitude,
        longitude: data.Longitude ? roundToDecimals(parseFloat(data.Longitude), 6) : currentData.longitude,
        acceleration: data.acceleration ? roundToDecimals(parseFloat(data.acceleration)) : 0,
        tiltAngle: data.tilt_angle ? roundToDecimals(parseFloat(data.tilt_angle)) : 0,
        lightLeakDetected: data.light_leak_detected === '1' ? 'Yes' : 'No'
    };

    console.log('📊 Mapped data:', mappedData);
    return mappedData;
}

// Lấy dữ liệu từ server
async function getData() {
    try {
        console.log('🔄 Đang lấy dữ liệu từ server...');
        const response = await fetch(serverUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const serverData = await response.json();
        console.log('📡 Dữ liệu từ server:', serverData);
        
        // Nếu có dữ liệu từ server, sử dụng và mapping
        const mappedData = mapServerData(serverData);
        if (mappedData) {
            // Cập nhật currentData với dữ liệu từ server
            currentData = { ...currentData, ...mappedData };
            deviceInfo.status = 'Online';
            return currentData;
        }
        
    } catch (error) {
        console.log('⚠️ Không thể kết nối server:', error.message);
        deviceInfo.status = 'Offline';
    }
    
    // Nếu không có dữ liệu từ server, giữ nguyên dữ liệu hiện tại
    console.log('📄 Sử dụng dữ liệu hiện có');
    return currentData;
}

// Cập nhật giao diện
function updateDisplay(data) {
    // Hàm helper để cập nhật giá trị hoặc hiển thị "N/A"
    function updateElement(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            if (value !== null && value !== undefined) {
                element.textContent = value;
            } else {
                element.textContent = 'N/A';
            }
        }
    }

    // Nhiệt độ ngoài trời
    updateElement('.temperature .stat-number', data.temperature);

    // Nhiệt độ trong xe
    updateElement('.temperature-indoor .stat-number', data.temperatureIndoor);

    // Độ ẩm
    updateElement('.humidity .stat-number', data.humidity);

    // PM2.5
    updateElement('.air-quality .stat-number', data.pm25);

    // PM10
    updateElement('.air-quality-pm10 .stat-number', data.pm10);

    // CO Gas
    updateElement('.co-gas .stat-number', data.coGas);

    // LPG Gas
    updateElement('.lpg-gas .stat-number', data.lpgGas);

    // CH4 Gas
    updateElement('.ch4-gas .stat-number', data.ch4Gas);

    // Phát hiện lửa
    updateElement('.flame-sensor .stat-number', data.flameDetected);

    // Trọng lượng
    updateElement('.weight .stat-number', data.weight);

    // Cường độ ánh sáng
    updateElement('.light .stat-number', data.lightIntensity);

    // Áp suất
    updateElement('.pressure .stat-number', data.pressure);

    // Tốc độ
    updateElement('.speed .stat-number', data.speed);

    // Gia tốc
    updateElement('.acceleration .stat-number', data.acceleration);

    // Góc nghiêng
    updateElement('.tilt-angle .stat-number', data.tiltAngle);

    // Rò rỉ ánh sáng
    updateElement('.light-leak .stat-number', data.lightLeakDetected);

    // Vị trí GPS
    updateElement('.latitude .stat-number', data.latitude);
    updateElement('.longitude .stat-number', data.longitude);

    // Hiển thị thông tin thiết bị
    updateElement('.device-id .stat-number', deviceInfo.deviceId);
    updateElement('.user-id .stat-number', deviceInfo.userId || 'N/A');
    updateElement('.license-plate .stat-number', deviceInfo.licensePlate);

    // Cập nhật trạng thái kết nối
    const statusElement = document.querySelector('.connection-status .stat-number');
    if (statusElement) {
        statusElement.textContent = deviceInfo.status;
        statusElement.className = `stat-number ${deviceInfo.status.toLowerCase()}`;
    }

    // Kiểm tra cảnh báo nếu có hệ thống cảnh báo
    if (window.warningSystem && window.warningSystem.checkWarnings) {
        window.warningSystem.checkWarnings(data);
    }

    // Log chi tiết với dữ liệu thực
    const logData = [];
    if (data.temperature !== null) logData.push(`🌡️ Temp: ${data.temperature}`);
    if (data.temperatureIndoor !== null) logData.push(`(Indoor: ${data.temperatureIndoor})`);
    if (data.humidity !== null) logData.push(`💧 Humidity: ${data.humidity}`);
    if (data.pm25 !== null) logData.push(`🌫️ PM2.5: ${data.pm25}`);
    if (data.pm10 !== null) logData.push(`PM10: ${data.pm10}`);
    if (data.coGas !== null) logData.push(`🏭 CO: ${data.coGas}`);
    if (data.pressure !== null) logData.push(`🌀 Pressure: ${data.pressure}`);
    if (data.speed > 0) logData.push(`🚗 Speed: ${data.speed}`);
    if (data.acceleration > 0) logData.push(`📈 Acceleration: ${data.acceleration}`);
    if (data.tiltAngle > 0) logData.push(`📐 Tilt: ${data.tiltAngle}`);
    
    logData.push(`🔥 Flame: ${data.flameDetected}`);
    logData.push(`💡 Light Leak: ${data.lightLeakDetected}`);
    logData.push(`📍 GPS: ${data.latitude}, ${data.longitude}`);
    logData.push(`🔧 Device: ${deviceInfo.deviceId} (${deviceInfo.status})`);

    console.log(`📊 ${new Date().toLocaleTimeString()}: ${logData.join(' | ')}`);
}

// Chạy cập nhật
async function update() {
    try {
        const data = await getData();
        updateDisplay(data);
    } catch (error) {
        console.error('❌ Lỗi khi cập nhật:', error);
        deviceInfo.status = 'Error';
        updateDisplay(currentData);
    }
}

// Hàm để lấy dữ liệu thô từ server (để debug)
async function getServerData() {
    try {
        const response = await fetch(serverUrl);
        const data = await response.json();
        console.log('🔍 Server Data:', JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu server:', error);
        return null;
    }
}

// Hàm để test kết nối server
async function testConnection() {
    console.log('🔄 Đang kiểm tra kết nối server...');
    const data = await getServerData();
    if (data) {
        console.log('✅ Kết nối thành công!');
        console.log('📊 Số lượng records:', data.data ? data.data.length : 0);
        if (data.data && data.data.length > 0) {
            console.log('🔍 Record đầu tiên:', data.data[0]);
            
            // Hiển thị các field có dữ liệu
            const record = data.data[0];
            const availableFields = [];
            Object.keys(record).forEach(key => {
                if (record[key] !== null && record[key] !== undefined && record[key] !== '') {
                    availableFields.push(`${key}: ${record[key]}`);
                }
            });
            console.log('📋 Các field có dữ liệu:', availableFields.join(', '));
        }
    } else {
        console.log('❌ Không thể kết nối server');
    }
    return data;
}

// Hàm để lấy thống kê
function getStats() {
    const stats = {
        currentData: currentData,
        deviceInfo: deviceInfo,
        serverUrl: serverUrl,
        connectionStatus: deviceInfo.status,
        lastUpdate: deviceInfo.lastUpdate,
        availableData: {}
    };
    
    // Đếm số field có dữ liệu
    Object.keys(currentData).forEach(key => {
        if (currentData[key] !== null && currentData[key] !== undefined) {
            stats.availableData[key] = currentData[key];
        }
    });
    
    console.log('📊 Thống kê hiện tại:', JSON.stringify(stats, null, 2));
    return stats;
}

// Hàm để bật/tắt chế độ debug
function toggleDebug() {
    window.debugMode = !window.debugMode;
    console.log(`🔧 Debug mode: ${window.debugMode ? 'ON' : 'OFF'}`);
}

// Export các hàm để có thể sử dụng từ console
window.weatherUpdater = {
    update,
    getServerData,
    testConnection,
    getCurrentData: () => currentData,
    getDeviceInfo: () => deviceInfo,
    getStats,
    toggleDebug,
    forceRefresh: () => {
        console.log('🔄 Làm mới dữ liệu...');
        return update();
    }
};

// Khởi tạo
console.log('🚀 Khởi động Weather Updater (Real Data Only)...');
console.log('🌐 Server URL:', serverUrl);
console.log('📡 Chỉ hiển thị dữ liệu thực từ API, không có random values');
console.log('🔧 Các lệnh có sẵn:');
console.log('  - weatherUpdater.update() - Cập nhật dữ liệu');
console.log('  - weatherUpdater.getServerData() - Lấy dữ liệu từ server');
console.log('  - weatherUpdater.testConnection() - Test kết nối');
console.log('  - weatherUpdater.getStats() - Xem thống kê');
console.log('  - weatherUpdater.forceRefresh() - Làm mới ngay');
console.log('  - weatherUpdater.toggleDebug() - Bật/tắt debug');

// Bắt đầu với tần suất cập nhật 5 giây
setInterval(update, 5000);
update(); // Chạy ngay lần đầu

// Test kết nối ban đầu
setTimeout(testConnection, 1000);