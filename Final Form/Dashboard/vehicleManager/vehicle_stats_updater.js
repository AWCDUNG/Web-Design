// API Configuration - sử dụng API thực tế
const API_CONFIG = {
    baseURL: 'https://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php',
    useServer: true
};

// Cache để lưu trữ dữ liệu tạm thời
let vehicleDataCache = {};
let lastApiCall = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Lấy data từ API cho vehicle cụ thể
async function getVehicleData(vehicleId) {
    try {
        const response = await fetch(API_CONFIG.baseURL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData = await response.json();
        
        if (apiData.status === 'success' && apiData.data) {
            // Tìm vehicle theo ID
            const vehicleData = apiData.data.find(vehicle => vehicle.device_id === vehicleId);
            
            if (vehicleData) {
                // Chuyển đổi dữ liệu API sang format hiển thị
                const processedData = {
                    temperature: parseFloat(vehicleData.Temperature) || 0,
                    humidity: parseFloat(vehicleData.Humidity) || 0,
                    pm25: parseFloat(vehicleData.Pm25) || 0,
                    pm10: parseFloat(vehicleData.Pm10) || 0,
                    co: parseFloat(vehicleData.CoGas) || 0,
                    pressure: parseFloat(vehicleData.Pressure) || 0,
                    flame: vehicleData.flame_detected === '1' ? 'Yes' : 'No',
                    light: vehicleData.light_leak_detected === '1' ? 'Yes' : 'No',
                    // Các trường không có trong API - tính toán từ dữ liệu có sẵn
                    lpg: Math.max(100, parseFloat(vehicleData.CoGas) * 0.3) || 200,
                    ch4: Math.max(50, parseFloat(vehicleData.CoGas) * 0.15) || 80,
                    weight: 1200 + (parseFloat(vehicleData.Pressure) || 1013) * 0.3,
                    indoorTemp: (parseFloat(vehicleData.Temperature) || 25) - 2
                };
                
                return processedData;
            }
        }
        
        throw new Error('Vehicle not found in API response');
        
    } catch (error) {
        console.error('Error fetching vehicle data:', error);
        return null;
    }
}

// Cập nhật thông số môi trường với dữ liệu thực từ API
async function updateVehicleEnvironmentStats(vehicleId) {
    if (!vehicleId) return;
    
    // Hiển thị loading state
    showLoadingState();
    
    try {
        const envData = await getVehicleData(vehicleId);
        if (!envData) {
            showNotification('Không thể lấy dữ liệu từ API', 'error');
            return;
        }
        
        // Cập nhật từng thông số với dữ liệu thực
        updateStatCard('temperature', envData.temperature, '°C');
        updateStatCard('humidity', envData.humidity, '%');
        updateStatCard('pm25', envData.pm25, 'μg/m³');
        updateStatCard('pm10', envData.pm10, 'μg/m³');
        updateStatCard('co', envData.co, 'μg/m³');
        updateStatCard('lpg', envData.lpg, 'ppm');
        updateStatCard('ch4', envData.ch4, 'ppm');
        updateStatCard('flame', envData.flame, '');
        updateStatCard('weight', envData.weight, 'kg');
        updateStatCard('light', envData.light, 'lux');
        updateStatCard('pressure', envData.pressure, 'hPa');
        updateStatCard('indoorTemp', envData.indoorTemp, '°C');
        
        // Lưu vào cache
        vehicleDataCache[vehicleId] = envData;
        lastApiCall = Date.now();
        
        console.log('✅ Updated stats for vehicle:', vehicleId, envData);
        
    } catch (error) {
        console.error('Error updating vehicle stats:', error);
        showNotification('Lỗi khi cập nhật dữ liệu', 'error');
    } finally {
        hideLoadingState();
    }
}

// Hiển thị trạng thái loading
function showLoadingState() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.classList.add('loading');
        const numberEl = card.querySelector('.stat-number');
        if (numberEl) {
            numberEl.style.opacity = '0.5';
        }
    });
}

// Ẩn trạng thái loading
function hideLoadingState() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.classList.remove('loading');
        const numberEl = card.querySelector('.stat-number');
        if (numberEl) {
            numberEl.style.opacity = '1';
        }
    });
}

// Cập nhật stat card với animation và color coding
function updateStatCard(statType, value, unit) {
    const mapping = {
        'temperature': '.temperature', 
        'humidity': '.humidity',
        'pm25': '.air-quality', 
        'pm10': '.air-quality-pm10',
        'co': '.co-gas', 
        'lpg': '.lpg-gas', 
        'ch4': '.ch4-gas',
        'flame': '.flame-sensor', 
        'weight': '.weight',
        'light': '.light', 
        'pressure': '.pressure',
        'indoorTemp': '.temperature-indoor'
    };
    
    const card = document.querySelector(mapping[statType]);
    if (card) {
        const numberEl = card.querySelector('.stat-number');
        const unitEl = card.querySelector('.stat-unit');
        
        if (numberEl) {
            // Format value theo loại
            let formattedValue = value;
            if (typeof value === 'number') {
                if (statType === 'temperature' || statType === 'indoorTemp' || statType === 'humidity') {
                    formattedValue = value.toFixed(1);
                } else if (statType === 'pm25' || statType === 'pm10' || statType === 'pressure') {
                    formattedValue = value.toFixed(1);
                } else if (statType === 'co' || statType === 'lpg' || statType === 'ch4' || statType === 'weight') {
                    formattedValue = Math.floor(value);
                }
            }
            
            numberEl.textContent = formattedValue;
            console.log(`Updated ${statType}: ${formattedValue}${unit}`);
        }
        
        if (unitEl) {
            unitEl.textContent = unit;
        }
        
        // Thêm color coding dựa trên giá trị
        applyColorCoding(card, statType, value);
        
        // Animation hiệu ứng
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '';
        }, 300);
    } else {
        console.warn(`Card not found for ${statType}, selector: ${mapping[statType]}`);
    }
}

// Áp dụng color coding dựa trên giá trị
function applyColorCoding(card, statType, value) {
    // Xóa các class cũ
    card.classList.remove('status-good', 'status-warning', 'status-danger');
    
    let status = 'good';
    
    switch(statType) {
        case 'pm25':
            if (value > 50) status = 'danger';
            else if (value > 25) status = 'warning';
            break;
        case 'pm10':
            if (value > 100) status = 'danger';
            else if (value > 50) status = 'warning';
            break;
        case 'co':
            if (value > 1000) status = 'danger';
            else if (value > 500) status = 'warning';
            break;
        case 'temperature':
        case 'indoorTemp':
            if (value > 35 || value < 10) status = 'danger';
            else if (value > 30 || value < 15) status = 'warning';
            break;
        case 'humidity':
            if (value > 80 || value < 30) status = 'danger';
            else if (value > 70 || value < 40) status = 'warning';
            break;
        case 'flame':
            if (value === 'Yes') status = 'danger';
            break;
    }
    
    card.classList.add(`status-${status}`);
}

// FIXED: Không ghi đè function selectVehicle gốc, mà mở rộng nó
function enhanceSelectVehicle() {
    // Lưu reference đến function gốc
    const originalSelectVehicle = window.selectVehicle;
    
    // Tạo function mới kết hợp cả hai
    window.selectVehicle = function(vehicle) {
        console.log('🔄 Selecting vehicle:', vehicle.id);
        
        // Gọi function gốc trước
        if (originalSelectVehicle) {
            originalSelectVehicle.call(this, vehicle);
        }
        
        // Sau đó cập nhật stats từ API
        updateVehicleEnvironmentStats(vehicle.id);
    };
}

// FIXED: Loại bỏ realtime fluctuation, chỉ cập nhật từ API
function startRealTimeStatsUpdate() {
    setInterval(async () => {
        if (selectedVehicle) {
            console.log('🔄 Real-time update for vehicle:', selectedVehicle.id);
            await updateVehicleEnvironmentStats(selectedVehicle.id);
        }
    }, 60000); // Cập nhật mỗi 60 giây từ API thực
}

// Thêm CSS cho loading state và color coding
const additionalStyles = `
    .stat-card.loading {
        opacity: 0.7;
        pointer-events: none;
        position: relative;
    }
    
    .stat-card.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    .stat-card.status-good {
        border-left: 4px solid #28a745;
    }
    
    .stat-card.status-warning {
        border-left: 4px solid #ffc107;
        background-color: rgba(255, 193, 7, 0.1);
    }
    
    .stat-card.status-danger {
        border-left: 4px solid #dc3545;
        background-color: rgba(220, 53, 69, 0.1);
    }
    
    .stat-card {
        transition: all 0.3s ease;
    }
`;

// Thêm CSS vào document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// FIXED: Khởi tạo khi DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing enhanced vehicle stats...');
    
    // Enhance function sau khi DOM đã load
    setTimeout(() => {
        enhanceSelectVehicle();
        startRealTimeStatsUpdate();
        console.log('✅ Enhanced vehicle stats initialized');
    }, 1000);
    
    // Clear cache định kỳ
    setInterval(() => {
        vehicleDataCache = {};
        console.log('🧹 Cache cleared');
    }, 300000); // Clear cache mỗi 5 phút
});

// Export functions để debug
window.updateVehicleEnvironmentStats = updateVehicleEnvironmentStats;
window.getVehicleData = getVehicleData;
window.vehicleDataCache = vehicleDataCache;




// // API Configuration - sử dụng API thực tế
// const API_CONFIG = {
//     baseURL: 'https://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php',
//     useServer: true // Luôn sử dụng server API
// };

// // Cache để lưu trữ dữ liệu tạm thời
// let vehicleDataCache = {};
// let lastApiCall = 0;
// const CACHE_DURATION = 30000; // 30 seconds

// // Mapping từ API fields sang UI fields
// const API_FIELD_MAPPING = {
//     temperature: 'Temperature',
//     humidity: 'Humidity', 
//     pm25: 'Pm25',
//     pm10: 'Pm10',
//     co: 'CoGas',
//     pressure: 'Pressure',
//     // Các trường không có trong API sẽ dùng giá trị mặc định
//     lpg: null,
//     ch4: null,
//     flame: 'flame_detected',
//     weight: null,
//     light: 'light_leak_detected',
//     indoorTemp: null
// };

// // Lấy data từ API
// async function getVehicleData(vehicleId) {
//     const now = Date.now();
    
//     // Kiểm tra cache
//     if (vehicleDataCache[vehicleId] && (now - lastApiCall) < CACHE_DURATION) {
//         return vehicleDataCache[vehicleId];
//     }
    
//     try {
//         const response = await fetch(API_CONFIG.baseURL);
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const apiData = await response.json();
        
//         if (apiData.status === 'success' && apiData.data) {
//             // Tìm vehicle theo ID
//             const vehicleData = apiData.data.find(vehicle => vehicle.device_id === vehicleId);
            
//             if (vehicleData) {
//                 // Chuyển đổi dữ liệu API sang format hiển thị
//                 const processedData = {
//                     temperature: parseFloat(vehicleData.Temperature) || 0,
//                     humidity: parseFloat(vehicleData.Humidity) || 0,
//                     pm25: parseFloat(vehicleData.Pm25) || 0,
//                     pm10: parseFloat(vehicleData.Pm10) || 0,
//                     co: parseFloat(vehicleData.CoGas) || 0,
//                     pressure: parseFloat(vehicleData.Pressure) || 0,
//                     flame: vehicleData.flame_detected === '1' ? 'Yes' : 'No',
//                     light: vehicleData.light_leak_detected === '1' ? 'Yes' : 'No',
//                     // Các trường không có trong API - dùng giá trị mặc định hoặc tính toán
//                     lpg: Math.floor(Math.random() * 300) + 100, // Giá trị giả lập
//                     ch4: Math.floor(Math.random() * 100) + 50,  // Giá trị giả lập
//                     weight: 1200 + Math.floor(Math.random() * 400), // Giá trị giả lập
//                     indoorTemp: (parseFloat(vehicleData.Temperature) || 25) - 2 + Math.random() * 4
//                 };
                
//                 // Lưu vào cache
//                 vehicleDataCache[vehicleId] = processedData;
//                 lastApiCall = now;
                
//                 return processedData;
//             }
//         }
        
//         throw new Error('Vehicle not found in API response');
        
//     } catch (error) {
//         console.error('Error fetching vehicle data:', error);
        
//         // Fallback: trả về dữ liệu mặc định nếu API lỗi
//         return {
//             temperature: 25.0,
//             humidity: 60.0,
//             pm25: 5.0,
//             pm10: 10.0,
//             co: 500,
//             lpg: 200,
//             ch4: 80,
//             flame: 'No',
//             weight: 1300,
//             light: 2.5,
//             pressure: 1013.0,
//             indoorTemp: 23.0
//         };
//     }
// }

// // Cập nhật thông số môi trường với hiệu ứng loading
// async function updateVehicleEnvironmentStats(vehicleId) {
//     if (!vehicleId) return;
    
//     // Hiển thị loading state
//     showLoadingState();
    
//     try {
//         const envData = await getVehicleData(vehicleId);
//         if (!envData) return;
        
//         // Cập nhật từng thông số với animation
//         updateStatCard('temperature', envData.temperature, '°C');
//         updateStatCard('humidity', envData.humidity, '%');
//         updateStatCard('pm25', envData.pm25, 'μg/m³');
//         updateStatCard('pm10', envData.pm10, 'μg/m³');
//         updateStatCard('co', envData.co, 'μg/m³');
//         updateStatCard('lpg', envData.lpg, 'ppm');
//         updateStatCard('ch4', envData.ch4, 'ppm');
//         updateStatCard('flame', envData.flame, '');
//         updateStatCard('weight', envData.weight, 'kg');
//         updateStatCard('light', envData.light, 'lux');
//         updateStatCard('pressure', envData.pressure, 'hPa');
//         updateStatCard('indoorTemp', envData.indoorTemp, '°C');
        
//         // Hiển thị thông báo thành công
//         showNotification(`Đã cập nhật dữ liệu cho xe ${vehicleId}`, 'success');
        
//     } catch (error) {
//         console.error('Error updating vehicle stats:', error);
//         showNotification('Lỗi khi cập nhật dữ liệu', 'error');
//     } finally {
//         hideLoadingState();
//     }
// }

// // Hiển thị trạng thái loading
// function showLoadingState() {
//     const statCards = document.querySelectorAll('.stat-card');
//     statCards.forEach(card => {
//         card.classList.add('loading');
//         const numberEl = card.querySelector('.stat-number');
//         if (numberEl) {
//             numberEl.style.opacity = '0.5';
//         }
//     });
// }

// // Ẩn trạng thái loading
// function hideLoadingState() {
//     const statCards = document.querySelectorAll('.stat-card');
//     statCards.forEach(card => {
//         card.classList.remove('loading');
//         const numberEl = card.querySelector('.stat-number');
//         if (numberEl) {
//             numberEl.style.opacity = '1';
//         }
//     });
// }

// // Cập nhật stat card với animation và color coding
// function updateStatCard(statType, value, unit) {
//     const mapping = {
//         'temperature': '.temperature', 
//         'humidity': '.humidity',
//         'pm25': '.air-quality', 
//         'pm10': '.air-quality-pm10',
//         'co': '.co-gas', 
//         'lpg': '.lpg-gas', 
//         'ch4': '.ch4-gas',
//         'flame': '.flame-sensor', 
//         'weight': '.weight',
//         'light': '.light', 
//         'pressure': '.pressure',
//         'indoorTemp': '.temperature-indoor'
//     };
    
//     const card = document.querySelector(mapping[statType]);
//     if (card) {
//         const numberEl = card.querySelector('.stat-number');
//         const unitEl = card.querySelector('.stat-unit');
        
//         if (numberEl) {
//             // Format value theo loại
//             let formattedValue = value;
//             if (typeof value === 'number') {
//                 if (statType === 'temperature' || statType === 'indoorTemp' || statType === 'humidity') {
//                     formattedValue = value.toFixed(1);
//                 } else if (statType === 'pm25' || statType === 'pm10' || statType === 'pressure') {
//                     formattedValue = value.toFixed(1);
//                 } else if (statType === 'co' || statType === 'lpg' || statType === 'ch4' || statType === 'weight') {
//                     formattedValue = Math.floor(value);
//                 }
//             }
            
//             numberEl.textContent = formattedValue;
//         }
        
//         if (unitEl) {
//             unitEl.textContent = unit;
//         }
        
//         // Thêm color coding dựa trên giá trị
//         applyColorCoding(card, statType, value);
        
//         // Animation hiệu ứng
//         card.style.transform = 'scale(1.05)';
//         card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        
//         setTimeout(() => {
//             card.style.transform = 'scale(1)';
//             card.style.boxShadow = '';
//         }, 300);
//     }
// }

// // Áp dụng color coding dựa trên giá trị
// function applyColorCoding(card, statType, value) {
//     // Xóa các class cũ
//     card.classList.remove('status-good', 'status-warning', 'status-danger');
    
//     let status = 'good';
    
//     switch(statType) {
//         case 'pm25':
//             if (value > 50) status = 'danger';
//             else if (value > 25) status = 'warning';
//             break;
//         case 'pm10':
//             if (value > 100) status = 'danger';
//             else if (value > 50) status = 'warning';
//             break;
//         case 'co':
//             if (value > 1000) status = 'danger';
//             else if (value > 500) status = 'warning';
//             break;
//         case 'temperature':
//         case 'indoorTemp':
//             if (value > 35 || value < 10) status = 'danger';
//             else if (value > 30 || value < 15) status = 'warning';
//             break;
//         case 'humidity':
//             if (value > 80 || value < 30) status = 'danger';
//             else if (value > 70 || value < 40) status = 'warning';
//             break;
//         case 'flame':
//             if (value === 'Yes') status = 'danger';
//             break;
//     }
    
//     card.classList.add(`status-${status}`);
// }

// // Cập nhật selectVehicle function để tích hợp với API
// function selectVehicleWithStats(vehicle) {
//     selectedVehicle = vehicle;
    
//     // Cập nhật UI selection
//     document.querySelectorAll('.vehicle-item').forEach(item => {
//         item.classList.remove('selected');
//     });
    
//     const selectedItem = document.querySelector(`[data-vehicle-id="${vehicle.id}"]`);
//     if (selectedItem) selectedItem.classList.add('selected');
    
//     // Cập nhật bản đồ
//     const marker = vehicleMarkers.find(m => m.vehicle.id === vehicle.id);
//     if (marker) {
//         map.setView([vehicle.lat, vehicle.lng], 14);
//         marker.openPopup();
//     }
    
//     // Cập nhật thông số môi trường từ API
//     updateVehicleEnvironmentStats(vehicle.id);
    
//     // Hiển thị modal
//     showVehicleModal(vehicle);
    
//     showNotification(`Đã chọn xe ${vehicle.id}`, 'success');
// }

// // Cập nhật realtime với API data
// function startRealTimeStatsUpdate() {
//     setInterval(async () => {
//         if (selectedVehicle) {
//             try {
//                 const envData = await getVehicleData(selectedVehicle.id);
//                 if (envData) {
//                     // Thêm biến động nhẹ để mô phỏng dữ liệu realtime
//                     const fluctuation = {
//                         temperature: envData.temperature + (Math.random() - 0.5) * 1,
//                         humidity: envData.humidity + (Math.random() - 0.5) * 2,
//                         pm25: Math.max(0, envData.pm25 + (Math.random() - 0.5) * 1),
//                         pm10: Math.max(0, envData.pm10 + (Math.random() - 0.5) * 2),
//                         co: Math.max(0, envData.co + (Math.random() - 0.5) * 50),
//                         lpg: Math.max(0, envData.lpg + (Math.random() - 0.5) * 20),
//                         ch4: Math.max(0, envData.ch4 + (Math.random() - 0.5) * 10),
//                         flame: envData.flame,
//                         weight: envData.weight + (Math.random() - 0.5) * 50,
//                         light: Math.max(0, envData.light + (Math.random() - 0.5) * 0.5),
//                         pressure: envData.pressure + (Math.random() - 0.5) * 1,
//                         indoorTemp: envData.indoorTemp + (Math.random() - 0.5) * 0.5
//                     };
                    
//                     // Cập nhật UI với dữ liệu có biến động
//                     Object.keys(fluctuation).forEach(key => {
//                         let value = fluctuation[key];
//                         let unit = '';
                        
//                         switch(key) {
//                             case 'temperature':
//                             case 'indoorTemp':
//                                 unit = '°C'; value = value.toFixed(1); break;
//                             case 'humidity':
//                                 unit = '%'; value = value.toFixed(1); break;
//                             case 'pm25':
//                             case 'pm10':
//                             case 'co':
//                                 unit = 'μg/m³'; value = value.toFixed(1); break;
//                             case 'lpg':
//                             case 'ch4':
//                                 unit = 'ppm'; value = Math.floor(value); break;
//                             case 'weight':
//                                 unit = 'kg'; value = Math.floor(value); break;
//                             case 'light':
//                                 unit = 'lux'; value = value.toFixed(1); break;
//                             case 'pressure':
//                                 unit = 'hPa'; value = value.toFixed(1); break;
//                         }
                        
//                         updateStatCard(key, value, unit);
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error in realtime update:', error);
//             }
//         }
//     }, 10000); // Cập nhật mỗi 10 giây
// }

// // Thêm CSS cho loading state và color coding
// const additionalStyles = `
//     .stat-card.loading {
//         opacity: 0.7;
//         pointer-events: none;
//     }
    
//     .stat-card.status-good {
//         border-left: 4px solid #28a745;
//     }
    
//     .stat-card.status-warning {
//         border-left: 4px solid #ffc107;
//         background-color: rgba(255, 193, 7, 0.1);
//     }
    
//     .stat-card.status-danger {
//         border-left: 4px solid #dc3545;
//         background-color: rgba(220, 53, 69, 0.1);
//     }
    
//     .stat-card {
//         transition: all 0.3s ease;
//     }
// `;

// // Thêm CSS vào document
// const styleSheet = document.createElement('style');
// styleSheet.textContent = additionalStyles;
// document.head.appendChild(styleSheet);

// // Khởi tạo khi DOM loaded
// document.addEventListener('DOMContentLoaded', function() {
//     startRealTimeStatsUpdate();
    
//     // Clear cache định kỳ
//     setInterval(() => {
//         vehicleDataCache = {};
//     }, 300000); // Clear cache mỗi 5 phút
// });

// // Export functions để sử dụng
// window.selectVehicle = selectVehicleWithStats;
// window.updateVehicleEnvironmentStats = updateVehicleEnvironmentStats;
// window.getVehicleData = getVehicleData;




// // ===== GIỮ NGUYÊN DỮ LIỆU HẰNG SỐ GỐC =====
// // Dữ liệu thông số môi trường cho từng xe (mỗi thành phố 1 xe)
// const vehicleEnvironmentData = {
//     'HN001': {
//         temperature: 28.5,
//         humidity: 72.3,
//         pm25: 8.2,
//         pm10: 15.4,
//         co: 720,
//         lpg: 280,
//         ch4: 95,
//         flame: 'No',
//         weight: 1350,
//         light: 3.8,
//         pressure: 1013.2,
//         indoorTemp: 26.8
//     },
//     'HP001': {
//         temperature: 26.7,
//         humidity: 78.4,
//         pm25: 6.9,
//         pm10: 13.2,
//         co: 610,
//         lpg: 230,
//         ch4: 85,
//         flame: 'No',
//         weight: 1320,
//         light: 3.6,
//         pressure: 1012.1,
//         indoorTemp: 25.3
//     },
//     'HUE001': {
//         temperature: 31.2,
//         humidity: 65.8,
//         pm25: 4.5,
//         pm10: 9.8,
//         co: 450,
//         lpg: 160,
//         ch4: 68,
//         flame: 'No',
//         weight: 1180,
//         light: 5.4,
//         pressure: 1014.7,
//         indoorTemp: 29.3
//     },
//     'DN001': {
//         temperature: 29.8,
//         humidity: 70.1,
//         pm25: 7.1,
//         pm10: 12.6,
//         co: 580,
//         lpg: 210,
//         ch4: 82,
//         flame: 'No',
//         weight: 1290,
//         light: 4.3,
//         pressure: 1013.9,
//         indoorTemp: 28.1
//     },
//     'HCM001': {
//         temperature: 32.4,
//         humidity: 68.9,
//         pm25: 11.8,
//         pm10: 20.5,
//         co: 950,
//         lpg: 380,
//         ch4: 125,
//         flame: 'Yes',
//         weight: 1480,
//         light: 2.8,
//         pressure: 1011.5,
//         indoorTemp: 30.2
//     },
//     'CT001': {
//         temperature: 30.1,
//         humidity: 75.6,
//         pm25: 5.9,
//         pm10: 11.2,
//         co: 520,
//         lpg: 190,
//         ch4: 76,
//         flame: 'No',
//         weight: 1240,
//         light: 4.9,
//         pressure: 1012.8,
//         indoorTemp: 28.5
//     }
// };

// // ===== THÊM PHẦN SERVER INTEGRATION =====
// // Cấu hình API server
// const API_CONFIG = {
//     baseURL: 'http://localhost:3000/api', // Thay đổi URL server của bạn
//     endpoints: {
//         vehicleEnvironment: '/vehicle-environment',
//         vehicleData: '/vehicles'
//     },
//     timeout: 10000,
//     useServer: false // Đặt true để sử dụng server, false để dùng dữ liệu test
// };

// // Hàm lấy dữ liệu từ server
// async function fetchVehicleEnvironmentDataFromServer(vehicleId) {
//     try {
//         const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.vehicleEnvironment}/${vehicleId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             timeout: API_CONFIG.timeout
//         });
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log(`Đã lấy dữ liệu từ server cho xe ${vehicleId}`);
//         return data;
        
//     } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu từ server:', error);
//         throw error;
//     }
// }

// // Hàm lấy dữ liệu - tự động chọn giữa server hoặc dữ liệu test
// async function getVehicleEnvironmentData(vehicleId) {
//     if (API_CONFIG.useServer) {
//         try {
//             return await fetchVehicleEnvironmentDataFromServer(vehicleId);
//         } catch (error) {
//             console.warn('Lỗi server, fallback về dữ liệu test');
//             showNotification('Lỗi kết nối server, sử dụng dữ liệu test', 'warning');
//             return vehicleEnvironmentData[vehicleId]; // Fallback về dữ liệu hằng số
//         }
//     } else {
//         console.log('Sử dụng dữ liệu test (hằng số)');
//         return vehicleEnvironmentData[vehicleId]; // Dùng dữ liệu hằng số gốc
//     }
// }

// // ===== GIỮ NGUYÊN CÁC HÀM GỐC =====
// // Hàm cập nhật thông số môi trường khi chọn xe (phiên bản gốc)
// function updateVehicleEnvironmentStats(vehicleId) {
//     const envData = vehicleEnvironmentData[vehicleId];
    
//     if (!envData) {
//         console.warn(`Không tìm thấy dữ liệu môi trường cho xe ${vehicleId}`);
//         return;
//     }
    
//     // Cập nhật các thông số trên giao diện
//     updateStatCard('temperature', envData.temperature, '°C');
//     updateStatCard('humidity', envData.humidity, '%');
//     updateStatCard('pm25', envData.pm25, 'μg/m³');
//     updateStatCard('pm10', envData.pm10, 'μg/m³');
//     updateStatCard('co', envData.co, 'μg/m³');
//     updateStatCard('lpg', envData.lpg, 'ppm');
//     updateStatCard('ch4', envData.ch4, 'ppm');
//     updateStatCard('flame', envData.flame, '');
//     updateStatCard('weight', envData.weight, 'kg');
//     updateStatCard('light', envData.light, 'lux');
//     updateStatCard('pressure', envData.pressure, 'hPa');
//     updateStatCard('indoorTemp', envData.indoorTemp, '°C');
    
//     console.log(`Đã cập nhật thông số cho xe ${vehicleId}`);
// }

// // Hàm helper để cập nhật từng thẻ thông số (giữ nguyên)
// function updateStatCard(statType, value, unit) {
//     // Mapping tên thông số với class CSS
//     const classMapping = {
//         'temperature': '.temperature',
//         'humidity': '.humidity',
//         'pm25': '.air-quality',
//         'pm10': '.air-quality-pm10',
//         'co': '.co-gas',
//         'lpg': '.lpg-gas',
//         'ch4': '.ch4-gas',
//         'flame': '.flame-sensor',
//         'weight': '.weight',
//         'light': '.light',
//         'pressure': '.pressure',
//         'indoorTemp': '.temperature-indoor'
//     };
    
//     const className = classMapping[statType];
//     if (!className) {
//         console.warn(`Không tìm thấy mapping cho ${statType}`);
//         return;
//     }
    
//     const card = document.querySelector(className);
//     if (card) {
//         const numberElement = card.querySelector('.stat-number');
//         const unitElement = card.querySelector('.stat-unit');
        
//         if (numberElement) {
//             numberElement.textContent = value;
//         }
//         if (unitElement) {
//             unitElement.textContent = unit;
//         }
        
//         // Thêm animation khi cập nhật
//         card.style.transition = 'all 0.3s ease';
//         card.style.transform = 'scale(1.05)';
        
//         setTimeout(() => {
//             card.style.transform = 'scale(1)';
//         }, 300);
//     } else {
//         console.warn(`Không tìm thấy element cho ${statType} với class ${className}`);
//     }
// }

// // Hàm mở rộng từ selectVehicle gốc (giữ nguyên)
// function selectVehicleWithStats(vehicle) {
//     selectedVehicle = vehicle;
    
//     // Cập nhật UI gốc
//     document.querySelectorAll('.vehicle-item').forEach(item => {
//         item.classList.remove('selected');
//     });
    
//     const selectedItem = document.querySelector(`[data-vehicle-id="${vehicle.id}"]`);
//     if (selectedItem) {
//         selectedItem.classList.add('selected');
//     }
    
//     // Center map on vehicle
//     const marker = vehicleMarkers.find(m => m.vehicle.id === vehicle.id);
//     if (marker) {
//         map.setView([vehicle.lat, vehicle.lng], 14);
//         marker.openPopup();
//     }
    
//     // Cập nhật thông số môi trường
//     updateVehicleEnvironmentStats(vehicle.id);
    
//     // Show modal with details
//     showVehicleModal(vehicle);
    
//     // Hiển thị thông báo
//     showNotification(`Đã chọn xe ${vehicle.id} - Thông số đã được cập nhật`, 'success');
// }

// // Hàm để tự động cập nhật thông số theo thời gian thực (giữ nguyên)
// function startRealTimeStatsUpdate() {
//     setInterval(() => {
//         if (selectedVehicle) {
//             // Tạo biến động nhỏ cho các thông số
//             const envData = vehicleEnvironmentData[selectedVehicle.id];
//             if (envData) {
//                 // Cập nhật với giá trị dao động nhỏ
//                 const fluctuation = {
//                     temperature: envData.temperature + (Math.random() - 0.5) * 2,
//                     humidity: envData.humidity + (Math.random() - 0.5) * 5,
//                     pm25: Math.max(0, envData.pm25 + (Math.random() - 0.5) * 2),
//                     pm10: Math.max(0, envData.pm10 + (Math.random() - 0.5) * 3),
//                     co: Math.max(0, envData.co + (Math.random() - 0.5) * 100),
//                     lpg: Math.max(0, envData.lpg + (Math.random() - 0.5) * 50),
//                     ch4: Math.max(0, envData.ch4 + (Math.random() - 0.5) * 20),
//                     flame: Math.random() > 0.95 ? 'Yes' : 'No',
//                     weight: envData.weight + (Math.random() - 0.5) * 100,
//                     light: Math.max(0, envData.light + (Math.random() - 0.5) * 1),
//                     pressure: envData.pressure + (Math.random() - 0.5) * 2,
//                     indoorTemp: envData.indoorTemp + (Math.random() - 0.5) * 1.5
//                 };
                
//                 // Cập nhật với giá trị dao động
//                 Object.keys(fluctuation).forEach(key => {
//                     let value = fluctuation[key];
//                     let unit = '';
                    
//                     switch(key) {
//                         case 'temperature':
//                         case 'indoorTemp':
//                             unit = '°C';
//                             value = value.toFixed(1);
//                             break;
//                         case 'humidity':
//                             unit = '%';
//                             value = value.toFixed(1);
//                             break;
//                         case 'pm25':
//                         case 'pm10':
//                         case 'co':
//                             unit = 'μg/m³';
//                             value = value.toFixed(1);
//                             break;
//                         case 'lpg':
//                         case 'ch4':
//                             unit = 'ppm';
//                             value = Math.floor(value);
//                             break;
//                         case 'weight':
//                             unit = 'kg';
//                             value = Math.floor(value);
//                             break;
//                         case 'light':
//                             unit = 'lux';
//                             value = value.toFixed(1);
//                             break;
//                         case 'pressure':
//                             unit = 'hPa';
//                             value = value.toFixed(1);
//                             break;
//                         case 'flame':
//                             unit = '';
//                             break;
//                     }
                    
//                     updateStatCard(key, value, unit);
//                 });
//             }
//         }
//     }, 5000); // Cập nhật mỗi 5 giây
// }

// // Cập nhật hàm updateVehicleEnvironmentStats để support server
// async function updateVehicleEnvironmentStatsWithServer(vehicleId) {
//     try {
//         showLoadingIndicator(true);
        
//         const envData = await getVehicleEnvironmentData(vehicleId);
        
//         if (!envData) {
//             console.warn(`Không tìm thấy dữ liệu môi trường cho xe ${vehicleId}`);
//             return;
//         }
        
//         // Cập nhật các thông số trên giao diện (giữ nguyên logic cũ)
//         updateStatCard('temperature', envData.temperature, '°C');
//         updateStatCard('humidity', envData.humidity, '%');
//         updateStatCard('pm25', envData.pm25, 'μg/m³');
//         updateStatCard('pm10', envData.pm10, 'μg/m³');
//         updateStatCard('co', envData.co, 'μg/m³');
//         updateStatCard('lpg', envData.lpg, 'ppm');
//         updateStatCard('ch4', envData.ch4, 'ppm');
//         updateStatCard('flame', envData.flame, '');
//         updateStatCard('weight', envData.weight, 'kg');
//         updateStatCard('light', envData.light, 'lux');
//         updateStatCard('pressure', envData.pressure, 'hPa');
//         updateStatCard('indoorTemp', envData.indoorTemp, '°C');
        
//         console.log(`Đã cập nhật thông số cho xe ${vehicleId}`);
        
//     } catch (error) {
//         console.error('Lỗi khi cập nhật thông số:', error);
//         showNotification('Lỗi khi cập nhật thông số môi trường', 'error');
//     } finally {
//         showLoadingIndicator(false);
//     }
// }

// // Hàm hiển thị loading indicator
// function showLoadingIndicator(show) {
//     let loader = document.getElementById('env-data-loader');
//     if (!loader) {
//         loader = document.createElement('div');
//         loader.id = 'env-data-loader';
//         loader.innerHTML = '<div class="spinner">Đang tải dữ liệu...</div>';
//         loader.style.cssText = `
//             position: fixed;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             background: rgba(0,0,0,0.8);
//             color: white;
//             padding: 20px;
//             border-radius: 10px;
//             z-index: 9999;
//             display: none;
//         `;
//         document.body.appendChild(loader);
//     }
    
//     loader.style.display = show ? 'block' : 'none';
// }

// // Cập nhật hàm selectVehicleWithStats để support server
// function selectVehicleWithStatsServer(vehicle) {
//     selectedVehicle = vehicle;
    
//     // Cập nhật UI gốc (giữ nguyên)
//     document.querySelectorAll('.vehicle-item').forEach(item => {
//         item.classList.remove('selected');
//     });
    
//     const selectedItem = document.querySelector(`[data-vehicle-id="${vehicle.id}"]`);
//     if (selectedItem) {
//         selectedItem.classList.add('selected');
//     }
    
//     // Center map on vehicle
//     const marker = vehicleMarkers.find(m => m.vehicle.id === vehicle.id);
//     if (marker) {
//         map.setView([vehicle.lat, vehicle.lng], 14);
//         marker.openPopup();
//     }
    
//     // Cập nhật thông số môi trường với server support
//     updateVehicleEnvironmentStatsWithServer(vehicle.id);
    
//     // Show modal with details
//     showVehicleModal(vehicle);
    
//     // Hiển thị thông báo
//     const dataSource = API_CONFIG.useServer ? 'server' : 'test data';
//     showNotification(`Đã chọn xe ${vehicle.id} - Dữ liệu từ ${dataSource}`, 'success');
// }

// // Hàm chuyển đổi giữa server và test data
// function toggleDataSource() {
//     API_CONFIG.useServer = !API_CONFIG.useServer;
//     const source = API_CONFIG.useServer ? 'Server' : 'Test Data';
//     showNotification(`Đã chuyển sang ${source}`, 'info');
    
//     // Cập nhật lại dữ liệu cho xe hiện tại
//     if (selectedVehicle) {
//         updateVehicleEnvironmentStatsWithServer(selectedVehicle.id);
//     }
// }

// // Thêm button để toggle data source (tùy chọn)
// function addDataSourceToggleButton() {
//     const toggleBtn = document.createElement('button');
//     toggleBtn.innerHTML = '🔄 Toggle Data Source';
//     toggleBtn.style.cssText = `
//         position: fixed;
//         top: 10px;
//         right: 10px;
//         z-index: 1000;
//         padding: 10px 15px;
//         background: #007bff;
//         color: white;
//         border: none;
//         border-radius: 5px;
//         cursor: pointer;
//     `;
//     toggleBtn.onclick = toggleDataSource;
//     document.body.appendChild(toggleBtn);
// }

// // Cập nhật realtime stats để support server
// function startRealTimeStatsUpdateWithServer() {
//     setInterval(async () => {
//         if (selectedVehicle) {
//             try {
//                 const envData = await getVehicleEnvironmentData(selectedVehicle.id);
                
//                 if (envData) {
//                     // Logic dao động giữ nguyên
//                     const fluctuation = {
//                         temperature: envData.temperature + (Math.random() - 0.5) * 2,
//                         humidity: envData.humidity + (Math.random() - 0.5) * 5,
//                         pm25: Math.max(0, envData.pm25 + (Math.random() - 0.5) * 2),
//                         pm10: Math.max(0, envData.pm10 + (Math.random() - 0.5) * 3),
//                         co: Math.max(0, envData.co + (Math.random() - 0.5) * 100),
//                         lpg: Math.max(0, envData.lpg + (Math.random() - 0.5) * 50),
//                         ch4: Math.max(0, envData.ch4 + (Math.random() - 0.5) * 20),
//                         flame: Math.random() > 0.95 ? 'Yes' : 'No',
//                         weight: envData.weight + (Math.random() - 0.5) * 100,
//                         light: Math.max(0, envData.light + (Math.random() - 0.5) * 1),
//                         pressure: envData.pressure + (Math.random() - 0.5) * 2,
//                         indoorTemp: envData.indoorTemp + (Math.random() - 0.5) * 1.5
//                     };
                    
//                     // Cập nhật với giá trị dao động (logic giữ nguyên)
//                     Object.keys(fluctuation).forEach(key => {
//                         let value = fluctuation[key];
//                         let unit = '';
                        
//                         switch(key) {
//                             case 'temperature':
//                             case 'indoorTemp':
//                                 unit = '°C';
//                                 value = value.toFixed(1);
//                                 break;
//                             case 'humidity':
//                                 unit = '%';
//                                 value = value.toFixed(1);
//                                 break;
//                             case 'pm25':
//                             case 'pm10':
//                             case 'co':
//                                 unit = 'μg/m³';
//                                 value = value.toFixed(1);
//                                 break;
//                             case 'lpg':
//                             case 'ch4':
//                                 unit = 'ppm';
//                                 value = Math.floor(value);
//                                 break;
//                             case 'weight':
//                                 unit = 'kg';
//                                 value = Math.floor(value);
//                                 break;
//                             case 'light':
//                                 unit = 'lux';
//                                 value = value.toFixed(1);
//                                 break;
//                             case 'pressure':
//                                 unit = 'hPa';
//                                 value = value.toFixed(1);
//                                 break;
//                             case 'flame':
//                                 unit = '';
//                                 break;
//                         }
                        
//                         updateStatCard(key, value, unit);
//                     });
//                 }
//             } catch (error) {
//                 console.error('Lỗi khi cập nhật realtime:', error);
//             }
//         }
//     }, 5000); // Cập nhật mỗi 5 giây
// }

// // Khởi động cập nhật thời gian thực khi trang load (giữ nguyên)
// document.addEventListener('DOMContentLoaded', function() {
//     startRealTimeStatsUpdate();
// });

// // Thay thế hàm selectVehicle gốc bằng hàm mới (giữ nguyên)
// // Nếu muốn giữ hàm gốc, có thể gọi selectVehicleWithStats từ trong selectVehicle
// window.selectVehicle = selectVehicleWithStats;

// // API để dev có thể sử dụng
// window.vehicleAPI = {
//     toggleDataSource,
//     setServerMode: (useServer) => { API_CONFIG.useServer = useServer; },
//     getConfig: () => API_CONFIG,
//     fetchFromServer: fetchVehicleEnvironmentDataFromServer
// };