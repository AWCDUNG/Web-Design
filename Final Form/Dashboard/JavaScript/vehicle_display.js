// // Simple Vehicle Location Display
// // File: vehicle_location_display.js

// // Debug function
// function debugLog(message, data = null) {
//     console.log(`[VehicleDisplay] ${message}`, data);
// }

// class SimpleVehicleDisplay {
//     constructor() {
//         this.apiUrl = 'http://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php';
//         this.vehicleMarkers = [];
//         this.isRunning = false;
        
//         debugLog('VehicleDisplay initialized');
//         this.init();
//     }

//     init() {
//         // Kiểm tra xem map đã tồn tại chưa
//         if (typeof map === 'undefined') {
//             debugLog('Map not found, retrying in 2 seconds...');
//             setTimeout(() => this.init(), 2000);
//             return;
//         }

//         debugLog('Map found, adding styles');
//         this.addStyles();
//         this.testDisplay();
//     }

//     addStyles() {
//         const style = document.createElement('style');
//         style.textContent = `
//             .red-dot {
//                 width: 10px;
//                 height: 10px;
//                 background: red;
//                 border: 2px solid white;
//                 border-radius: 50%;
//                 box-shadow: 0 0 4px rgba(255, 0, 0, 0.8);
//             }
//         `;
//         document.head.appendChild(style);
//     }

//     async fetchData() {
//         debugLog('Fetching data from API...');
//         try {
//             const response = await fetch(this.apiUrl);
//             debugLog('API Response status:', response.status);
            
//             if (!response.ok) {
//                 throw new Error(`HTTP ${response.status}`);
//             }
            
//             const data = await response.json();
//             debugLog('API Data received:', data);
//             return data;
//         } catch (error) {
//             debugLog('API Error:', error.message);
//             return null;
//         }
//     }

//     clearMarkers() {
//         debugLog('Clearing markers:', this.vehicleMarkers.length);
//         this.vehicleMarkers.forEach(marker => {
//             if (map.hasLayer(marker)) {
//                 map.removeLayer(marker);
//             }
//         });
//         this.vehicleMarkers = [];
//     }

//     createRedDot(lat, lng, info = 'Vehicle') {
//         const marker = L.marker([lat, lng], {
//             icon: L.divIcon({
//                 className: 'red-dot-marker',
//                 html: '<div class="red-dot"></div>',
//                 iconSize: [14, 14],
//                 iconAnchor: [7, 7]
//             })
//         });

//         marker.bindPopup(`
//             <div>
//                 <strong>${info}</strong><br>
//                 Lat: ${lat}<br>
//                 Lng: ${lng}
//             </div>
//         `);

//         return marker;
//     }

//     async displayVehicles() {
//         debugLog('Starting displayVehicles...');
        
//         const data = await this.fetchData();
//         if (!data) {
//             debugLog('No data received');
//             return;
//         }

//         this.clearMarkers();

//         // Thử các format dữ liệu khác nhau
//         let vehicles = [];
        
//         if (Array.isArray(data)) {
//             vehicles = data;
//         } else if (data.vehicles) {
//             vehicles = data.vehicles;
//         } else if (data.data) {
//             vehicles = data.data;
//         } else {
//             // Thử xem có phải là object đơn lẻ không
//             if (data.lat && data.lng) {
//                 vehicles = [data];
//             }
//         }

//         debugLog('Processed vehicles:', vehicles);

//         if (vehicles.length === 0) {
//             debugLog('No vehicles found in data');
//             // Tạo một chấm test để kiểm tra
//             this.createTestDot();
//             return;
//         }

//         // Tạo marker cho mỗi xe
//         vehicles.forEach((vehicle, index) => {
//             if (vehicle.lat && vehicle.lng) {
//                 const marker = this.createRedDot(
//                     vehicle.lat, 
//                     vehicle.lng, 
//                     `Vehicle ${index + 1}`
//                 );
//                 marker.addTo(map);
//                 this.vehicleMarkers.push(marker);
//                 debugLog(`Added vehicle ${index + 1} at:`, {lat: vehicle.lat, lng: vehicle.lng});
//             }
//         });

//         debugLog(`Total markers added: ${this.vehicleMarkers.length}`);
        
//         // Fit map nếu có marker
//         if (this.vehicleMarkers.length > 0) {
//             this.fitMap();
//         }
//     }

//     createTestDot() {
//         // Tạo một chấm test tại Hà Nội để kiểm tra
//         debugLog('Creating test dot at Hanoi');
//         const testMarker = this.createRedDot(21.0285, 105.8542, 'Test Vehicle');
//         testMarker.addTo(map);
//         this.vehicleMarkers.push(testMarker);
//         map.setView([21.0285, 105.8542], 13);
//     }

//     fitMap() {
//         if (this.vehicleMarkers.length === 1) {
//             const marker = this.vehicleMarkers[0];
//             const pos = marker.getLatLng();
//             map.setView([pos.lat, pos.lng], 15);
//         } else if (this.vehicleMarkers.length > 1) {
//             const group = new L.featureGroup(this.vehicleMarkers);
//             map.fitBounds(group.getBounds().pad(0.1));
//         }
//     }

//     start() {
//         debugLog('Starting vehicle display...');
//         this.isRunning = true;
//         this.displayVehicles();
        
//         // Cập nhật mỗi 30 giây
//         this.interval = setInterval(() => {
//             if (this.isRunning) {
//                 this.displayVehicles();
//             }
//         }, 30000);
//     }

//     stop() {
//         debugLog('Stopping vehicle display...');
//         this.isRunning = false;
//         if (this.interval) {
//             clearInterval(this.interval);
//         }
//         this.clearMarkers();
//     }

//     toggle() {
//         if (this.isRunning) {
//             this.stop();
//         } else {
//             this.start();
//         }
//     }
// }

// // Khởi tạo
// const vehicleDisplay = new SimpleVehicleDisplay();

// // Hàm global
// window.toggleVehicles = function() {
//     vehicleDisplay.toggle();
    
//     const btn = document.getElementById('vehiclesBtn');
//     if (btn) {
//         btn.classList.toggle('active');
//         const isActive = btn.classList.contains('active');
//         btn.innerHTML = isActive ? '🚛 Hide Vehicles' : '🚛 Show Vehicles';
//     }
// };

// // Test functions
// window.testVehicleDisplay = function() {
//     debugLog('Manual test started');
//     vehicleDisplay.displayVehicles();
// };

// window.testAPI = function() {
//     debugLog('Testing API...');
//     vehicleDisplay.fetchData().then(data => {
//         debugLog('API Test Result:', data);
//     });
// };

// // Auto start sau 3 giây
// setTimeout(() => {
//     debugLog('Auto-starting vehicle display...');
//     vehicleDisplay.start();
// }, 3000);

// // Export
// window.vehicleDisplay = vehicleDisplay;