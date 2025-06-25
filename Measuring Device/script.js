// Air Quality Dashboard - Fixed Version with Better Error Handling
// Cấu hình API cho từng campus
const campusConfigs = {
    '0': {
        name: 'Đại học Phenikaa 0',
        apiUrl: 'http://118.70.240.188/php/get.php',
        icon: '🏫'
    },
    '1': {
        name: 'Đại học Phenikaa 1', 
        apiUrl: 'http://118.70.240.188/php/get1.php',
        icon: '🏫'
    },
    '2': {
        name: 'Đại học Phenikaa 2',
        apiUrl: 'http://118.70.240.188/php/get2.php', 
        icon: '🏫'
    }
};

// Biến global
let chartData = new Array(24).fill(0);
let currentTimeRange = '24h';
let currentCampus = '0'; // Mặc định
let fetchInterval = null;
let retryCount = 0;
const MAX_RETRY = 3;
const RETRY_DELAY = 5000; // 5 giây

// Dữ liệu hiện tại
let currentData = {
    aqi: 0,
    pm10: 0,
    humidity: 0,
    co: 0,
    pm25: 0,
    temperature: 0,
    windSpeed: 0,
    windDirection: 0,
    windDirectionText: "N/A",
    rainfall: 0
};

let lastUpdateTime = new Date();
let isConnected = false;

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Khởi tạo ứng dụng Air Quality Dashboard');
    
    initializeDropdown();
    updateCurrentTime();
    updateChart(chartData);
    // Cập nhật thời gian mỗi giây
    setInterval(updateCurrentTime, 1000);
    // Bắt đầu fetch dữ liệu cho campus mặc định
    startDataFetching();
});


// Khởi tạo dropdown
function initializeDropdown() {
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownContent = document.getElementById('dropdown-content');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    if (!dropdownBtn || !dropdownContent) {
        console.error('❌ Không tìm thấy dropdown elements');
        return;
    }
    
    // Toggle dropdown khi click button
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
        
        // Xoay mũi tên
        const arrow = dropdownBtn.querySelector('.dropdown-arrow');
        if (arrow) {
            arrow.style.transform = dropdownContent.classList.contains('show') ? 
                'rotate(180deg)' : 'rotate(0deg)';
        }
    });
    
    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', function() {
        dropdownContent.classList.remove('show');
        const arrow = dropdownBtn.querySelector('.dropdown-arrow');
        if (arrow) {
            arrow.style.transform = 'rotate(0deg)';
        }
    });
    
    // Xử lý click vào từng item
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const campusId = this.getAttribute('data-campus');
            
            if (campusId && campusConfigs[campusId]) {
                selectCampus(campusId);
                dropdownContent.classList.remove('show');
                
                // Reset arrow
                const arrow = dropdownBtn.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
    
    // Cập nhật UI cho campus mặc định
    updateDropdownUI(currentCampus);
}
// Chọn campus và chuyển đổi API
function selectCampus(campusId) {
    if (currentCampus === campusId) return;
    console.log(`🔄 Chuyển đổi từ campus ${currentCampus} sang campus ${campusId}`);
    // Cập nhật campus hiện tại
    currentCampus = campusId;
    // Reset retry count khi chuyển campus
    retryCount = 0;
    // Cập nhật UI dropdown
    updateDropdownUI(campusId);
    // Dừng việc fetch dữ liệu cũ
    stopDataFetching();
    // Reset dữ liệu
    resetData();
    // Bắt đầu fetch dữ liệu mới
    startDataFetching();
    // Hiển thị thông báo
    showNotification(`Đã chuyển sang ${campusConfigs[campusId].name}`, 'success');
}
// Cập nhật UI dropdown
function updateDropdownUI(campusId) {
    const config = campusConfigs[campusId];
    if (!config) return;
    // Cập nhật button text
    const campusText = document.querySelector('.campus-text');
    if (campusText) {
        campusText.textContent = config.name;
    }
    // Cập nhật icon nếu có
    const campusIcon = document.querySelector('.dropdown-btn .campus-icon');
    if (campusIcon) {
        campusIcon.textContent = config.icon;
    }
    // Cập nhật active state cho items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        const itemCampusId = item.getAttribute('data-campus');
        if (itemCampusId === campusId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}
// Bắt đầu fetch dữ liệu từ API
function startDataFetching() {
    console.log('▶️ Bắt đầu fetch dữ liệu');
    // Fetch ngay lập tức
    fetchDataFromAPI();
    // Thiết lập interval để fetch định kỳ (10 giây)
    if (fetchInterval) {
        clearInterval(fetchInterval);
    }
    fetchInterval = setInterval(fetchDataFromAPI, 10000);
}
// Dừng fetch dữ liệu
function stopDataFetching() {
    if (fetchInterval) {
        clearInterval(fetchInterval);
        fetchInterval = null;
        console.log('⏹️ Đã dừng fetch dữ liệu');
    }
}
// Reset dữ liệu khi chuyển campus
function resetData() {
    chartData = new Array(24).fill(0);
    currentData = {
        aqi: 0,
        pm10: 0,
        humidity: 0,
        co: 0,
        pm25: 0,
        temperature: 0,
        windSpeed: 0,
        windDirection: 0,
        windDirectionText: "N/A",
        rainfall: 0
    };
    
    // Cập nhật UI với dữ liệu trống
    updateUI();
    updateChart(chartData);
    updateConnectionStatus('Đang tải dữ liệu...');
}
// Cải thiện function fetch với nhiều phương pháp fallback ( Important )
async function fetchDataFromAPI() {
    const config = campusConfigs[currentCampus];
    if (!config) {
        console.error('❌ Không tìm thấy cấu hình cho campus:', currentCampus);
        return;
    }
    
    const apiUrl = config.apiUrl;
    console.log(`📡 Đang fetch từ URL: ${apiUrl}`);
    
    try {
        // Thử fetch trực tiếp trước
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result && result.data && result.data.length > 0) {
                console.log('✅ Lấy dữ liệu thành công');
                processAPIData(result.data[0]);
                isConnected = true;
                retryCount = 0;
                updateConnectionStatus(`Kết nối thành công - ${config.name}`);
                return;
            }
        }
    } catch (error) {
        console.warn('⚠️ Fetch trực tiếp thất bại:', error.message);
    }
    
    // Nếu thất bại, thử với proxy fallback
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (response.ok) {
            const data = await response.json();
            const actualData = JSON.parse(data.contents);
            
            if (actualData && actualData.data && actualData.data.length > 0) {
                console.log('✅ Lấy dữ liệu thành công với proxy');
                processAPIData(actualData.data[0]);
                isConnected = true;
                retryCount = 0;
                updateConnectionStatus(`Kết nối thành công - ${config.name}`);
                return;
            }
        }
    } catch (error) {
        console.warn('⚠️ Proxy fallback thất bại:', error.message);
    }
    
    // Nếu tất cả đều thất bại
    handleFetchFailure();
}
// ✅ FIX 5: Thử sử dụng proxy (nếu có)
async function fetchWithProxy(apiUrl) {
    // Thử với các public CORS proxy
    const proxies = [
        'https://api.allorigins.win/get?url=',
        'https://cors-anywhere.herokuapp.com/',
        // Thêm các proxy khác nếu cần
    ];
    
    for (const proxy of proxies) {
        try {
            console.log(`🔄 Thử proxy: ${proxy}`);
            const proxyUrl = proxy + encodeURIComponent(apiUrl);
            
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            // Xử lý response từ allorigins
            if (data.contents) {
                const actualData = JSON.parse(data.contents);
                if (actualData && actualData.data && actualData.data.length > 0) {
                    return actualData.data[0];
                }
            }
            
            // Xử lý response trực tiếp
            if (data && data.data && data.data.length > 0) {
                return data.data[0];
            }
            
        } catch (error) {
            console.warn(`Proxy ${proxy} thất bại:`, error);
            continue;
        }
    }
    throw new Error('Tất cả proxy đều thất bại');
}
// Xử lý dữ liệu từ API
function processAPIData(apiData) {
    try {
        console.log('📊 Xử lý dữ liệu API:', apiData);
        
        currentData = {
            aqi: parseFloat(apiData.AQI) || 0,
            pm25: parseFloat(apiData.PM25) || 0,
            pm10: parseFloat(apiData.PM10) || 0,
            temperature: parseFloat(apiData.Temp) || 0,
            humidity: parseFloat(apiData.Humi) || 0,
            windSpeed: parseFloat(apiData.Wind_speed) || 0,
            rainfall: parseFloat(apiData.Rain) || 0,
            co: parseFloat(apiData.CO) || 0,
            windDirection: parseFloat(apiData.Wind_direction) || 0
        };
        
        updateWindDirection();
        updateChartData(currentData.aqi);
        updateUI();
        lastUpdateTime = new Date();
        
        console.log('✅ Đã cập nhật UI với dữ liệu thật');
        
    } catch (error) {
        console.error('❌ Lỗi khi xử lý dữ liệu API:', error);
        throw error;
    }
}

// Cập nhật dữ liệu biểu đồ
function updateChartData(aqiValue) {
    chartData.push(aqiValue);
    chartData.shift();
    updateChart(chartData);
}

// Cập nhật trạng thái kết nối
function updateConnectionStatus(message) {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log(`📡 Status: ${message}`);
}

// Cập nhật thời gian hiện tại
function updateCurrentTime() {
    const now = new Date();
    const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const dayName = dayNames[now.getDay()];
    
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${dayName} ngày ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    // Cập nhật thời gian kể từ lần cập nhật cuối
    const timeDiff = Math.floor((now - lastUpdateTime) / 1000);
    const updateElement = document.getElementById('update-seconds');
    if (updateElement) {
        updateElement.textContent = isConnected ? timeDiff : "Lỗi kết nối";
    }
}
// Cập nhật hướng gió
function updateWindDirection() {
    const direction = currentData.windDirection;
    let directionText;
    if ((direction >= 337.5 && direction <= 360) || (direction >= 0 && direction < 22.5)) {
        directionText = "Bắc";
    } else if (direction >= 22.5 && direction < 67.5) {
        directionText = "Đông Bắc";
    } else if (direction >= 67.5 && direction < 112.5) {
        directionText = "Đông";
    } else if (direction >= 112.5 && direction < 157.5) {
        directionText = "Đông Nam";
    } else if (direction >= 157.5 && direction < 202.5) {
        directionText = "Nam";
    } else if (direction >= 202.5 && direction < 247.5) {
        directionText = "Tây Nam";
    } else if (direction >= 247.5 && direction < 292.5) {
        directionText = "Tây";
    } else {
        directionText = "Tây Bắc";
    }
    currentData.windDirectionText = directionText;
}
// Cập nhật UI
function updateUI() {
    // Cập nhật chỉ số AQI chính
    const aqiNumberElement = document.querySelector('.aqi-number');
    if (aqiNumberElement) {
        aqiNumberElement.textContent = currentData.aqi.toFixed(1);
    }
    // Cập nhật trạng thái AQI
    updateAQIStatus(currentData.aqi);
    // Cập nhật các chỉ số trong bảng
    const indicators = document.querySelectorAll('.indicator');
    if (indicators.length >= 9) {
        const values = [
            currentData.aqi.toFixed(1),
            currentData.pm10.toFixed(1),
            currentData.humidity.toFixed(1),
            currentData.co.toFixed(0),
            currentData.pm25.toFixed(2),
            currentData.temperature.toFixed(1),
            currentData.windSpeed.toFixed(1),
            currentData.windDirection.toFixed(0),
            currentData.rainfall.toFixed(1)
        ];
        // Cập nhật giá trị các chỉ số
        indicators.forEach((indicator, index) => {
            const valueElement = indicator.querySelector('.indicator-value');
            if (valueElement && values[index] !== undefined) {
                valueElement.textContent = values[index];
            }
        });
        
        // Cập nhật hướng gió text
        const windDirUnit = indicators[7]?.querySelector('.indicator-unit');
        if (windDirUnit) windDirUnit.textContent = currentData.windDirectionText;
    }
}
// Cập nhật trạng thái AQI
function updateAQIStatus(aqiValue) {
    let status, color;
    if (aqiValue <= 50) {
        status = "Tốt";
        color = "#40c057";
    } else if (aqiValue <= 100) {
        status = "Vừa phải";
        color = "#ffd43b";
    } else if (aqiValue <= 150) {
        status = "Không tốt cho nhóm nhạy cảm";
        color = "#fd7e14";
    } else if (aqiValue <= 200) {
        status = "Có hại cho sức khoẻ";
        color = "#e03131";
    } else if (aqiValue <= 300) {
        status = "Rất nguy hại cho sức khoẻ";
        color = "#9c36b5";
    } else {
        status = "Nguy hiểm";
        color = "#7a0c0c";
    }
    
    // Cập nhật các phần tử trạng thái
    const statusElements = [
        document.querySelector('.aqi-status'),
        document.querySelector('.status-good')
    ];
    
    statusElements.forEach(element => {
        if (element) {
            element.textContent = status;
            element.style.color = (status === "Vừa phải") ? "#666" : "white";
            if (element.classList.contains('status-good')) {
                element.style.backgroundColor = color;
            } else {
                element.style.color = color;
            }
        }
    });
    
    const aqiNumberElement = document.querySelector('.aqi-number');
    if (aqiNumberElement) {
        aqiNumberElement.style.color = color;
    }
}

// // API để thay đổi campus từ bên ngoài (nếu cần)
// window.AQIDashboard = {
//     selectCampus: selectCampus,
//     getCurrentCampus: () => currentCampus,
//     getCampusConfigs: () => campusConfigs,
//     refreshData: fetchDataFromAPI
// };


// //Tạo dữ liệu mẫu khi không kết nối được API
// function generateSampleData() {
//     console.log('🎲 Tạo dữ liệu mẫu');
    
//     currentData = {
//         aqi: Math.floor(Math.random() * 150) + 1,
//         pm25: Math.floor(Math.random() * 50) + 1,
//         pm10: Math.floor(Math.random() * 100) + 10,
//         temperature: Math.floor(Math.random() * 15) + 20,
//         humidity: Math.floor(Math.random() * 40) + 40,
//         windSpeed: Math.floor(Math.random() * 10) + 1,
//         rainfall: Math.floor(Math.random() * 5),
//         co: Math.floor(Math.random() * 500) + 200,
//         windDirection: Math.floor(Math.random() * 360)
//     };
    
//     updateWindDirection();
//     updateChartData(currentData.aqi);
//     updateUI();
//     lastUpdateTime = new Date();
    
//     console.log('✅ Đã cập nhật UI với dữ liệu mẫu');
// }
