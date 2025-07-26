// Global variables
let map;
let vehicleMarkers = [];
let allVehicles = [];
let selectedVehicle = null;
let updateInterval;

// API Configuration
// const API_URL = 'http://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php';
const API_URL = 'https://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php';
const UPDATE_INTERVAL = 30000; // 30 seconds

// Enhanced status mapping based on real API data
const STATUS_COLORS = {
    'idle': '#28a745',
    'Warning': '#ffc107', 
    'STOP': '#dc3545',
    'active': '#17a2b8'
};

const STATUS_TRANSLATIONS = {
    'idle': 'Nghỉ',
    'Warning': 'Cảnh báo',
    'STOP': 'Dừng',
    'active': 'Hoạt động'
};

const WARNING_LEVELS = {
    'none': 'Bình thường',
    'Level 1': 'Cấp 1',
    'Level 2': 'Cấp 2',
    'Level 3': 'Cấp 3'
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeEventListeners();
    loadVehiclesFromAPI();
    updateTime();
    
    // Set up intervals
    setInterval(updateTime, 1000);
    updateInterval = setInterval(loadVehiclesFromAPI, UPDATE_INTERVAL);
});

// Initialize map
function initializeMap() {
    map = L.map('map').setView([21.0245, 105.8412], 8); // Center on Hanoi
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Initialize event listeners
function initializeEventListeners() {
    try {
        // Filters
        const cityFilter = document.getElementById('city-filter');
        const statusFilter = document.getElementById('status-filter');
        const cargoFilter = document.getElementById('cargo-filter');
        const searchVehicle = document.getElementById('search-vehicle');
        const resetFilters = document.getElementById('reset-filters');
        const refreshData = document.getElementById('refresh-data');
        const centerVietnam = document.getElementById('center-vietnam');
        const statusModal = document.getElementById('statusModal');
        const closeBtn = document.querySelector('.close');
        
        // Kiểm tra element tồn tại trước khi gắn event
        if (cityFilter) cityFilter.addEventListener('change', applyFilters);
        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (cargoFilter) cargoFilter.addEventListener('change', applyFilters);
        if (searchVehicle) searchVehicle.addEventListener('input', applyFilters);
        if (resetFilters) resetFilters.addEventListener('click', resetFiltersHandler);
        if (refreshData) refreshData.addEventListener('click', () => loadVehiclesFromAPI(true));
        if (centerVietnam) centerVietnam.addEventListener('click', centerVietnamHandler);
        
        // Modal events
        if (statusModal) {
            statusModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
    } catch (error) {
        console.error('Error initializing event listeners:', error);
        showNotificationMessage('Lỗi khởi tạo giao diện', 'error');
    }
}

// Load vehicles from API
async function loadVehiclesFromAPI(showNotificationFlag = false) {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Thêm timeout
            signal: AbortSignal.timeout(10000) // 10 giây timeout
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData = await response.json();
        
        if (apiData.status === 'success' && apiData.data) {
            const vehicles = apiData.data.map(vehicle => ({
                id: vehicle.device_id,
                user: vehicle.user_id,
                trackingNumber: vehicle.Tracking_number,
                licensePlate: vehicle.license_plate,
                status: vehicle.status,
                warningLevel: vehicle.warning_level,
                lat: parseFloat(vehicle.Latitude) || 21.0245,
                lng: parseFloat(vehicle.Longitude) || 105.8412,
                speed: parseFloat(vehicle.Speed) || 0,
                temperature: parseFloat(vehicle.Temperature) || 0,
                humidity: parseFloat(vehicle.Humidity) || 0,
                pm25: parseFloat(vehicle.Pm25) || 0,
                pm10: parseFloat(vehicle.Pm10) || 0,
                coGas: parseFloat(vehicle.CoGas) || 0,
                pressure: parseFloat(vehicle.Pressure) || 0,
                acceleration: parseFloat(vehicle.acceleration) || 0,
                tiltAngle: parseFloat(vehicle.tilt_angle) || 0,
                flameDetected: vehicle.flame_detected === '1',
                lightLeakDetected: vehicle.light_leak_detected === '1',
                lastUpdate: new Date(vehicle.created_at)
            }));
            
            allVehicles = vehicles;
            updateVehicleMarkers();
            renderVehicleList();
            updateVehicleStats();
            
            if (showNotificationFlag) {
                showNotificationMessage('Dữ liệu đã được cập nhật!', 'success');
            }
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('Error loading vehicles:', error);
        
        // Xử lý các loại lỗi khác nhau
        let errorMessage = 'Lỗi kết nối API';
        
        if (error.name === 'AbortError') {
            errorMessage = 'Kết nối API quá chậm (timeout)';
        } else if (error.name === 'TypeError') {
            errorMessage = 'Không thể kết nối tới server';
        } else if (error.message.includes('HTTP error')) {
            errorMessage = `Lỗi server: ${error.message}`;
        }
        
        showNotificationMessage(errorMessage, 'error');
        
        // Nếu không có dữ liệu, tạo dữ liệu mẫu để test
        if (allVehicles.length === 0) {
            createSampleData();
        }
    }
}

// Update vehicle markers on map
function updateVehicleMarkers() {
    // Clear existing markers
    vehicleMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    vehicleMarkers = [];
    
    // Create new markers
    allVehicles.forEach(vehicle => {
        createVehicleMarker(vehicle);
    });
}

// Create vehicle marker
function createVehicleMarker(vehicle) {
    // Skip vehicles without valid coordinates
    if (!vehicle.lat || !vehicle.lng || vehicle.lat === 0 || vehicle.lng === 0) {
        return;
    }
    
    const statusColor = STATUS_COLORS[vehicle.status] || '#7f8c8d';
    const warningIcon = vehicle.warningLevel && vehicle.warningLevel !== 'none' ? '⚠️' : '';
    
    const marker = L.marker([vehicle.lat, vehicle.lng], {
        icon: L.divIcon({
            className: 'vehicle-marker',
            html: `
                <div style="
                    background: ${statusColor}; 
                    border: 3px solid white; 
                    border-radius: 50%; 
                    width: 24px; 
                    height: 24px; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    color: white;
                    font-weight: bold;
                ">
                    ${warningIcon || '🚛'}
                </div>
            `,
            iconSize: [24, 24], 
            iconAnchor: [12, 12]
        })
    }).addTo(map);

    marker.bindPopup(createVehiclePopup(vehicle));
    marker.vehicle = vehicle;
    
    marker.on('click', function() {
        selectVehicle(vehicle);
    });
    
    vehicleMarkers.push(marker);
}

// Create vehicle popup
function createVehiclePopup(vehicle) {
    const statusColor = STATUS_COLORS[vehicle.status] || '#7f8c8d';
    const timeDiff = Math.floor((Date.now() - vehicle.lastUpdate.getTime()) / 1000 / 60);
    
    return `
        <div style="font-family: inherit; min-width: 280px; max-width: 350px;">
            <h4 style="margin-bottom: 10px; color: #2c3e50; display: flex; align-items: center;">
                🚛 ${vehicle.id}
                ${vehicle.warningLevel && vehicle.warningLevel !== 'none' ? 
                    `<span style="color: #ff6b6b; margin-left: 8px;">⚠️ ${WARNING_LEVELS[vehicle.warningLevel]}</span>` : ''}
            </h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div><strong>Tài xế:</strong> ${vehicle.user}</div>
                <div><strong>Biển số:</strong> ${vehicle.licensePlate}</div>
                <div><strong>Trạng thái:</strong> <span style="color: ${statusColor};">${STATUS_TRANSLATIONS[vehicle.status] || vehicle.status}</span></div>
                <div><strong>Tốc độ:</strong> ${vehicle.speed} km/h</div>
                <div><strong>Nhiệt độ:</strong> ${vehicle.temperature}°C</div>
                <div><strong>Độ ẩm:</strong> ${vehicle.humidity}%</div>
                <div><strong>PM2.5:</strong> ${vehicle.pm25} μg/m³</div>
                <div><strong>PM10:</strong> ${vehicle.pm10} μg/m³</div>
                <div><strong>CO:</strong> ${vehicle.coGas} ppm</div>
                <div><strong>Áp suất:</strong> ${vehicle.pressure} hPa</div>
                <div><strong>Gia tốc:</strong> ${vehicle.acceleration} m/s²</div>
                <div><strong>Góc nghiêng:</strong> ${vehicle.tiltAngle}°</div>
                ${vehicle.flameDetected ? '<div style="color: #ff4757;"><strong>🔥 Phát hiện lửa!</strong></div>' : ''}
                ${vehicle.lightLeakDetected ? '<div style="color: #ffa502;"><strong>💡 Rò rỉ ánh sáng!</strong></div>' : ''}
            </div>
            
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
                Cập nhật: ${timeDiff} phút trước
            </div>
        </div>
    `;
}

// Render vehicle list
function renderVehicleList() {
    const container = document.getElementById('vehicle-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    const filteredVehicles = getFilteredVehicles();
    
    filteredVehicles.forEach(vehicle => {
        const item = document.createElement('div');
        item.className = 'vehicle-item';
        item.dataset.vehicleId = vehicle.id;
        
        const timeDiff = Math.floor((Date.now() - vehicle.lastUpdate.getTime()) / 1000 / 60);
        const warningClass = vehicle.warningLevel && vehicle.warningLevel !== 'none' ? 'warning' : '';
        
        item.innerHTML = `
            <div class="vehicle-header ${warningClass}">
                <span class="vehicle-id">
                    🚛 ${vehicle.id}
                    ${vehicle.warningLevel && vehicle.warningLevel !== 'none' ? 
                        `<span style="color: #ff6b6b; margin-left: 5px;">⚠️</span>` : ''}
                </span>
                <span class="vehicle-status status-${vehicle.status.toLowerCase()}">${STATUS_TRANSLATIONS[vehicle.status] || vehicle.status}</span>
            </div>
            <div class="vehicle-info">
                <div><strong>Tài xế:</strong> ${vehicle.user}</div>
                <div><strong>Biển số:</strong> ${vehicle.licensePlate}</div>
                <div><strong>Tốc độ:</strong> ${vehicle.speed} km/h</div>
                <div><strong>Nhiệt độ:</strong> ${vehicle.temperature}°C</div>
                <div><strong>PM2.5:</strong> ${vehicle.pm25} μg/m³</div>
                <div><strong>CO:</strong> ${vehicle.coGas} ppm</div>
                <div style="color: #666; font-size: 11px;">Cập nhật: ${timeDiff} phút trước</div>
            </div>
        `;
        
        item.addEventListener('click', () => selectVehicle(vehicle));
        container.appendChild(item);
    });
    
    // Update vehicle count
    const listHeader = document.querySelector('.list-header h4');
    if (listHeader) {
        listHeader.textContent = `Danh sách xe (${filteredVehicles.length})`;
    }
}

// Get filtered vehicles
function getFilteredVehicles() {
    const statusFilter = document.getElementById('status-filter');
    const searchVehicle = document.getElementById('search-vehicle');
    
    const statusValue = statusFilter ? statusFilter.value : '';
    const searchTerm = searchVehicle ? searchVehicle.value.toLowerCase() : '';
    
    return allVehicles.filter(vehicle => {
        const matchesStatus = !statusValue || vehicle.status === statusValue;
        const matchesSearch = !searchTerm || 
            vehicle.id.toLowerCase().includes(searchTerm) ||
            vehicle.user.toLowerCase().includes(searchTerm) ||
            vehicle.licensePlate.toLowerCase().includes(searchTerm);
        
        return matchesStatus && matchesSearch;
    });
}

// Apply filters
function applyFilters() {
    const filteredVehicles = getFilteredVehicles();
    const filteredIds = filteredVehicles.map(v => v.id);
    
    // Show/hide markers
    vehicleMarkers.forEach(marker => {
        const vehicle = marker.vehicle;
        if (filteredIds.includes(vehicle.id)) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
    
    renderVehicleList();
}

// Reset filters handler
function resetFiltersHandler() {
    const statusFilter = document.getElementById('status-filter');
    const searchVehicle = document.getElementById('search-vehicle');
    
    if (statusFilter) statusFilter.value = '';
    if (searchVehicle) searchVehicle.value = '';
    
    // Show all markers
    vehicleMarkers.forEach(marker => {
        marker.addTo(map);
    });
    
    renderVehicleList();
}

// Select vehicle
function selectVehicle(vehicle) {
    selectedVehicle = vehicle;
    
    // Update UI
    document.querySelectorAll('.vehicle-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    const selectedItem = document.querySelector(`[data-vehicle-id="${vehicle.id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
    
    // Center map on vehicle if coordinates are valid
    if (vehicle.lat && vehicle.lng && vehicle.lat !== 0 && vehicle.lng !== 0) {
        const marker = vehicleMarkers.find(m => m.vehicle.id === vehicle.id);
        if (marker) {
            map.setView([vehicle.lat, vehicle.lng], 15);
            marker.openPopup();
        }
    }
    
    // Show modal with details
    showVehicleModal(vehicle);
}

// Show vehicle modal
function showVehicleModal(vehicle) {
    const modal = document.getElementById('statusModal');
    const modalId = document.getElementById('modal-vehicle-id');
    const modalDetails = document.getElementById('modal-vehicle-details');
    
    if (!modal || !modalId || !modalDetails) return;
    
    modalId.textContent = vehicle.id;
    
    const timeDiff = Math.floor((Date.now() - vehicle.lastUpdate.getTime()) / 1000 / 60);
    
    modalDetails.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div>
                <h5>Thông tin cơ bản</h5>
                <p><strong>Tài xế:</strong> ${vehicle.user}</p>
                <p><strong>Biển số:</strong> ${vehicle.licensePlate}</p>
                <p><strong>Số theo dõi:</strong> ${vehicle.trackingNumber || 'N/A'}</p>
                <p><strong>Trạng thái:</strong> <span style="color: ${STATUS_COLORS[vehicle.status]}">${STATUS_TRANSLATIONS[vehicle.status] || vehicle.status}</span></p>
                <p><strong>Mức cảnh báo:</strong> ${WARNING_LEVELS[vehicle.warningLevel] || 'Bình thường'}</p>
            </div>
            <div>
                <h5>Thông số kỹ thuật</h5>
                <p><strong>Tốc độ:</strong> ${vehicle.speed} km/h</p>
                <p><strong>Gia tốc:</strong> ${vehicle.acceleration} m/s²</p>
                <p><strong>Góc nghiêng:</strong> ${vehicle.tiltAngle}°</p>
                <p><strong>Tọa độ:</strong> ${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}</p>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <h5>Thông số môi trường</h5>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 10px;">
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-weight: bold; color: #495057;">Nhiệt độ</div>
                    <div style="font-size: 18px; color: #007bff;">${vehicle.temperature}°C</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-weight: bold; color: #495057;">Độ ẩm</div>
                    <div style="font-size: 18px; color: #28a745;">${vehicle.humidity}%</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-weight: bold; color: #495057;">Áp suất</div>
                    <div style="font-size: 18px; color: #6c757d;">${vehicle.pressure} hPa</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-weight: bold; color: #495057;">PM2.5</div>
                    <div style="font-size: 18px; color: ${vehicle.pm25 > 50 ? '#dc3545' : '#28a745'};">${vehicle.pm25} μg/m³</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-weight: bold; color: #495057;">PM10</div>
                    <div style="font-size: 18px; color: ${vehicle.pm10 > 100 ? '#dc3545' : '#28a745'};">${vehicle.pm10} μg/m³</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-weight: bold; color: #495057;">CO</div>
                    <div style="font-size: 18px; color: ${vehicle.coGas > 10 ? '#dc3545' : '#28a745'};">${vehicle.coGas} ppm</div>
                </div>
            </div>
        </div>
        
        ${vehicle.flameDetected || vehicle.lightLeakDetected ? `
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <h5 style="color: #856404;">⚠️ Cảnh báo</h5>
                ${vehicle.flameDetected ? '<p style="color: #721c24;">🔥 Phát hiện lửa!</p>' : ''}
                ${vehicle.lightLeakDetected ? '<p style="color: #856404;">💡 Rò rỉ ánh sáng!</p>' : ''}
            </div>
        ` : ''}
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 12px; color: #666;">
                    Cập nhật lần cuối: ${timeDiff} phút trước
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="trackVehicle('${vehicle.id}')" class="btn btn-primary">Theo dõi</button>
                    <button onclick="sendMessage('${vehicle.id}')" class="btn btn-secondary">Gửi tin nhắn</button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('statusModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update vehicle statistics
function updateVehicleStats() {
    const totalVehicles = allVehicles.length;
    const activeVehicles = allVehicles.filter(v => v.status === 'idle').length;
    const warningVehicles = allVehicles.filter(v => 
        v.status === 'Warning' || 
        v.warningLevel && v.warningLevel !== 'none' || 
        v.flameDetected || 
        v.lightLeakDetected
    ).length;
    
    const totalEl = document.getElementById('total-vehicles');
    const activeEl = document.getElementById('active-vehicles');
    const warningEl = document.getElementById('warning-vehicles');
    
    if (totalEl) totalEl.textContent = totalVehicles;
    if (activeEl) activeEl.textContent = activeVehicles;
    if (warningEl) warningEl.textContent = warningVehicles;
}

// Update time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
        timeEl.textContent = timeString;
    }
}

// Center map on Vietnam
function centerVietnamHandler() {
    map.setView([16.0, 106.0], 6);
}

// Vehicle actions
function trackVehicle(vehicleId) {
    const vehicle = allVehicles.find(v => v.id === vehicleId);
    if (vehicle && vehicle.lat && vehicle.lng) {
        map.setView([vehicle.lat, vehicle.lng], 16);
        showNotificationMessage(`Đang theo dõi xe ${vehicleId}`, 'info');
        closeModal();
    }
}

function sendMessage(vehicleId) {
    const message = prompt(`Gửi tin nhắn tới xe ${vehicleId}:`);
    if (message) {
        showNotificationMessage(`Tin nhắn đã gửi tới xe ${vehicleId}`, 'success');
        closeModal();
    }
}

// Show notification - renamed to avoid conflict
function showNotificationMessage(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#212529';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Error handling for API calls
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotificationMessage('Đã xảy ra lỗi trong hệ thống', 'error');
});

// Handle API connection issues
window.addEventListener('beforeunload', function() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// Add CSS for warning vehicles
const style = document.createElement('style');
style.textContent = `
    .vehicle-item.warning {
        border-left: 4px solid #ffc107;
        background: rgba(255, 193, 7, 0.1);
    }
    
    .vehicle-header.warning {
        background: rgba(255, 193, 7, 0.2);
    }
    
    .status-idle { color: #28a745; }
    .status-warning { color: #ffc107; }
    .status-stop { color: #dc3545; }
    .status-active { color: #17a2b8; }
`;
document.head.appendChild(style);