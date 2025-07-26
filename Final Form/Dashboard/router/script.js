// let vehicleData = [];
// let map;
// let routeMarkers = [];
// let routeLines = [];
// let searchResults = [];
// let selectedDestination = null;
// let currentRoutes = [];
// const API_URL = 'https://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php';

// // Khởi tạo bản đồ
// function initMap() {
//     map = L.map('map').setView([20.9601, 105.7474], 14);
    
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//     }).addTo(map);
    
//     // Thêm marker tại tọa độ chính (Hà Nội)
//     L.marker([20.9601, 105.7474])
//         .addTo(map)
//         .bindPopup('Phenikaa University')
//         .openPopup();
// }

// // Tải dữ liệu xe từ API
// async function loadVehicles() {
//     try {
//         const response = await fetch(API_URL);
//         const data = await response.json();
        
//         if (data.status === 'success') {
//             vehicleData = data.data;
//             updateVehicleSelect();
//         } else {
//             alert('Lỗi khi tải dữ liệu xe');
//         }
//     } catch (error) {
//         console.error('Lỗi:', error);
//         alert('Không thể kết nối đến API');
//     }
// }

// // Cập nhật dropdown chọn xe
// function updateVehicleSelect() {
//     const select = document.getElementById('vehicleSelect');
//     select.innerHTML = '<option value="">Choose my car...</option>';
    
//     vehicleData.forEach((vehicle, index) => {
//         const option = document.createElement('option');
//         option.value = index;
//         option.textContent = `${vehicle.device_id} - ${vehicle.user_id}`;
//         select.appendChild(option);
//     });
// }

// // Tìm kiếm điểm đến bằng Nominatim API
// async function searchDestination() {
//     const query = document.getElementById('destinationSearch').value.trim();
    
//     if (!query) {
//         alert('Vui lòng nhập địa chỉ cần tìm');
//         return;
//     }
    
//     try {
//         const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=10&addressdetails=1`);
//         const data = await response.json();
        
//         if (data.length === 0) {
//             const globalResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`);
//             const globalData = await globalResponse.json();
            
//             if (globalData.length === 0) {
//                 alert('Không tìm thấy địa điểm nào phù hợp');
//                 return;
//             }
            
//             searchResults = globalData;
//         } else {
//             searchResults = data;
//         }
        
//         displaySearchResults();
        
//     } catch (error) {
//         console.error('Lỗi tìm kiếm:', error);
//         alert('Không thể tìm kiếm địa điểm. Vui lòng thử lại.');
//     }
// }

// // Hiển thị kết quả tìm kiếm
// function displaySearchResults() {
//     const resultsDiv = document.getElementById('searchResults');
//     const select = document.getElementById('destinationSelect');
    
//     select.innerHTML = '<option value="">Chọn địa điểm...</option>';
    
//     searchResults.forEach((result, index) => {
//         const option = document.createElement('option');
//         option.value = index;
//         option.textContent = result.display_name;
//         select.appendChild(option);
//     });
    
//     resultsDiv.style.display = 'block';
// }

// // Tìm kiếm khi nhấn Enter
// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('destinationSearch').addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') {
//             searchDestination();
//         }
//     });
// });

// // Kiểm tra xem tọa độ có nằm trong lãnh thổ Việt Nam không
// function isInVietnam(lat, lng) {
//     // Giới hạn lãnh thổ Việt Nam (xấp xỉ)
//     const vietnamBounds = {
//         north: 23.4,    // Cao Bằng
//         south: 8.2,     // Cà Mau
//         east: 109.7,    // Quảng Ninh
//         west: 102.1     // Điện Biên
//     };
    
//     return lat >= vietnamBounds.south && lat <= vietnamBounds.north && 
//            lng >= vietnamBounds.west && lng <= vietnamBounds.east;
// }

// // Tạo waypoint trung gian để đảm bảo đi trong nội địa Việt Nam
// function createVietnameseWaypoints(startLat, startLng, endLat, endLng) {
//     const waypoints = [];
    
//     // Tính khoảng cách
//     const distance = calculateDistance(startLat, startLng, endLat, endLng);
    
//     // Nếu quãng đường > 300km (từ Bắc vào Nam), tạo waypoint trung gian
//     if (distance > 300) {
//         // Các điểm trung gian quan trọng của Việt Nam (Bắc -> Nam)
//         const keyPoints = [
//             { lat: 21.0285, lng: 105.8542, name: "Hà Nội" },      // Hà Nội
//             { lat: 20.8449, lng: 106.6881, name: "Hải Phòng" },   // Hải Phòng  
//             { lat: 18.7967, lng: 105.8374, name: "Thanh Hóa" },   // Thanh Hóa
//             { lat: 16.4637, lng: 107.5909, name: "Huế" },         // Huế
//             { lat: 15.8801, lng: 108.3380, name: "Đà Nẵng" },     // Đà Nẵng
//             { lat: 14.0583, lng: 108.2772, name: "Kon Tum" },     // Kon Tum
//             { lat: 12.2388, lng: 109.1967, name: "Nha Trang" },   // Nha Trang
//             { lat: 10.8231, lng: 106.6297, name: "TP.HCM" },      // TP.HCM
//             { lat: 10.0340, lng: 105.7889, name: "Cần Thơ" }      // Cần Thơ
//         ];
        
//         // Tìm điểm trung gian phù hợp
//         const midLat = (startLat + endLat) / 2;
//         const midLng = (startLng + endLng) / 2;
        
//         // Tìm điểm gần nhất với vị trí trung gian
//         let bestWaypoint = null;
//         let minDistance = Infinity;
        
//         keyPoints.forEach(point => {
//             const distanceToMid = calculateDistance(point.lat, point.lng, midLat, midLng);
//             if (distanceToMid < minDistance) {
//                 minDistance = distanceToMid;
//                 bestWaypoint = point;
//             }
//         });
        
//         if (bestWaypoint) {
//             waypoints.push(`${bestWaypoint.lng},${bestWaypoint.lat}`);
//         }
//     }
    
//     return waypoints;
// }

// // Tính khoảng cách giữa 2 điểm bằng công thức Haversine
// function calculateDistance(lat1, lng1, lat2, lng2) {
//     const R = 6371; // Bán kính Trái Đất (km)
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLng = (lng2 - lng1) * Math.PI / 180;
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//               Math.sin(dLng/2) * Math.sin(dLng/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
// }

// // Tạo tuyến đường trực tiếp với waypoint trong Việt Nam
// async function generateDirectRoute(startLat, startLng, endLat, endLng) {
//     const routes = [];
//     const colors = ['#2196F3'];
//     const routeTypes = ['Direct route'];
    
//     try {
//         // Tạo waypoint trung gian để đảm bảo đi trong nội địa
//         const waypoints = createVietnameseWaypoints(startLat, startLng, endLat, endLng);
        
//         let coords;
//         if (waypoints.length > 0) {
//             // Có waypoint trung gian
//             coords = `${startLng},${startLat};${waypoints.join(';')};${endLng},${endLat}`;
//         } else {
//             // Không cần waypoint (quãng đường ngắn)
//             coords = `${startLng},${startLat};${endLng},${endLat}`;
//         }
        
//         const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&alternatives=false`);
        
//         if (response.ok) {
//             const data = await response.json();
//             if (data.routes && data.routes.length > 0) {
//                 const osrmRoute = data.routes[0];
//                 const coordinates = osrmRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
//                 // Kiểm tra xem tuyến đường có đi qua nước ngoài không
//                 const hasInternationalRoute = coordinates.some(coord => 
//                     !isInVietnam(coord[0], coord[1])
//                 );
                
//                 if (hasInternationalRoute) {
//                     console.warn('Tuyến đường có thể đi qua nước ngoài, đang thử phương án khác...');
                    
//                     // Thử với nhiều waypoint hơn
//                     const moreWaypoints = createDetailedVietnameseWaypoints(startLat, startLng, endLat, endLng);
//                     const detailedCoords = `${startLng},${startLat};${moreWaypoints.join(';')};${endLng},${endLat}`;
                    
//                     const fallbackResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${detailedCoords}?overview=full&geometries=geojson&alternatives=false`);
                    
//                     if (fallbackResponse.ok) {
//                         const fallbackData = await fallbackResponse.json();
//                         if (fallbackData.routes && fallbackData.routes.length > 0) {
//                             const fallbackRoute = fallbackData.routes[0];
//                             const fallbackCoordinates = fallbackRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                            
//                             routes.push({
//                                 type: routeTypes[0],
//                                 coordinates: fallbackCoordinates,
//                                 distance: (fallbackRoute.distance / 1000),
//                                 estimated_time: Math.round(fallbackRoute.duration / 60),
//                                 color: colors[0]
//                             });
//                         }
//                     }
//                 } else {
//                     routes.push({
//                         type: routeTypes[0],
//                         coordinates: coordinates,
//                         distance: (osrmRoute.distance / 1000),
//                         estimated_time: Math.round(osrmRoute.duration / 60),
//                         color: colors[0]
//                     });
//                 }
//             }
//         }
        
//     } catch (error) {
//         console.error('Error generating route:', error);
//     }
    
//     // Nếu không có tuyến đường nào từ OSRM, tạo tuyến đường dự phòng đơn giản
//     if (routes.length === 0) {
//         const directDistance = calculateDistance(startLat, startLng, endLat, endLng);
//         const baseTime = Math.round(directDistance / 50 * 60);
        
//         routes.push({
//             type: routeTypes[0],
//             coordinates: [
//                 [startLat, startLng],
//                 [endLat, endLng]
//             ],
//             distance: directDistance,
//             estimated_time: baseTime,
//             color: colors[0]
//         });
//     }
    
//     return routes;
// }

// // Tạo nhiều waypoint chi tiết hơn cho quãng đường dài
// function createDetailedVietnameseWaypoints(startLat, startLng, endLat, endLng) {
//     const waypoints = [];
//     const distance = calculateDistance(startLat, startLng, endLat, endLng);
    
//     if (distance > 500) {
//         // Quãng đường rất dài, chia thành nhiều đoạn
//         const segments = Math.ceil(distance / 200); // Mỗi đoạn ~200km
        
//         for (let i = 1; i < segments; i++) {
//             const ratio = i / segments;
//             const waypointLat = startLat + (endLat - startLat) * ratio;
//             const waypointLng = startLng + (endLng - startLng) * ratio;
            
//             // Điều chỉnh để đảm bảo trong lãnh thổ VN
//             const adjustedLat = Math.max(8.5, Math.min(23.0, waypointLat));
//             const adjustedLng = Math.max(102.5, Math.min(109.5, waypointLng));
            
//             waypoints.push(`${adjustedLng},${adjustedLat}`);
//         }
//     }
    
//     return waypoints;
// }

// // Tính toán tuyến đường
// async function calculateRoute() {
//     const vehicleIndex = document.getElementById('vehicleSelect').value;
    
//     if (!vehicleIndex) {
//         alert('Vui lòng chọn xe');
//         return;
//     }
    
//     if (!selectedDestination) {
//         alert('Vui lòng tìm kiếm và chọn điểm đến');
//         return;
//     }
    
//     const vehicle = vehicleData[vehicleIndex];
//     const startLat = parseFloat(vehicle.Latitude);
//     const startLng = parseFloat(vehicle.Longitude);
    
//     // Hiển thị loading đơn giản
//     const resultDiv = document.getElementById('routeResult');
//     resultDiv.innerHTML = '<div style="text-align: center; padding: 20px;">Đang tìm tuyến đường...</div>';
    
//     try {
//         const routes = await generateDirectRoute(startLat, startLng, selectedDestination.lat, selectedDestination.lng);
//         currentRoutes = routes;
//         displayRouteResult(vehicle, routes);
        
//     } catch (error) {
//         console.error('Error calculating route:', error);
//         resultDiv.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">Không thể tính toán tuyến đường. Vui lòng thử lại.</div>';
//     }
// }

// // Tự động tải dữ liệu khi trang web được mở
// window.onload = function() {
//     initMap();
//     loadVehicles();
// };
let vehicleData = [];
let map;
let routeMarkers = [];
let routeLines = [];
let searchResults = [];
let selectedDestination = null;
let currentRoutes = [];
const API_URL = 'https://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php';

// Khởi tạo bản đồ
function initMap() {
    map = L.map('map').setView([20.9601, 105.7474], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Thêm marker tại tọa độ chính (Hà Nội)
    L.marker([20.9601, 105.7474])
        .addTo(map)
        .bindPopup('Đại học Phenikaa')
        .openPopup();
}

// Tải dữ liệu xe từ API
async function loadVehicles() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.status === 'success') {
            vehicleData = data.data;
            updateVehicleSelect();
        } else {
            alert('Lỗi khi tải dữ liệu xe');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Không thể kết nối đến API');
    }
}

// Cập nhật dropdown chọn xe
function updateVehicleSelect() {
    const select = document.getElementById('vehicleSelect');
    select.innerHTML = '<option value="">Choose my car...</option>';
    
    vehicleData.forEach((vehicle, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${vehicle.device_id} - ${vehicle.user_id}`;
        select.appendChild(option);
    });
}

// Tìm kiếm điểm đến bằng Nominatim API
async function searchDestination() {
    const query = document.getElementById('destinationSearch').value.trim();
    
    if (!query) {
        alert('Vui lòng nhập địa chỉ cần tìm');
        return;
    }
    
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=10&addressdetails=1`);
        const data = await response.json();
        
        if (data.length === 0) {
            const globalResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`);
            const globalData = await globalResponse.json();
            
            if (globalData.length === 0) {
                alert('Không tìm thấy địa điểm nào phù hợp');
                return;
            }
            
            searchResults = globalData;
        } else {
            searchResults = data;
        }
        
        displaySearchResults();
        
    } catch (error) {
        console.error('Lỗi tìm kiếm:', error);
        alert('Không thể tìm kiếm địa điểm. Vui lòng thử lại.');
    }
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults() {
    const resultsDiv = document.getElementById('searchResults');
    const select = document.getElementById('destinationSelect');
    
    select.innerHTML = '<option value="">Chọn địa điểm...</option>';
    
    searchResults.forEach((result, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = result.display_name;
        select.appendChild(option);
    });
    
    resultsDiv.style.display = 'block';
}


// Tìm kiếm khi nhấn Enter
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('destinationSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchDestination();
        }
    });
});

// Tính khoảng cách giữa 2 điểm bằng công thức Haversine
// Tạo waypoint thông minh hơn
function createSmartWaypoint(startLat, startLng, endLat, endLng, type = 'alternate') {
    const midLat = (startLat + endLat) / 2;
    const midLng = (startLng + endLng) / 2;
    
    // Tính toán hướng di chuyển
    const deltaLat = endLat - startLat;
    const deltaLng = endLng - startLng;
    
    // Tạo waypoint vuông góc với đường thẳng để tránh đường trùng
    let offsetLat, offsetLng;
    
    if (type === 'north') {
        // Đi lên phía bắc trước
        offsetLat = Math.abs(deltaLng) * 0.3;
        offsetLng = -deltaLat * 0.1;
    } else if (type === 'south') {
        // Đi xuống phía nam trước
        offsetLat = -Math.abs(deltaLng) * 0.3;
        offsetLng = deltaLat * 0.1;
    } else {
        // Tuyến đường mặc định
        offsetLat = -deltaLng * 0.2;
        offsetLng = deltaLat * 0.2;
    }
    
    return {
        lat: midLat + offsetLat,
        lng: midLng + offsetLng
    };
}

// Tạo nhiều tuyến đường được cải thiện
async function generateMultipleRoutes(startLat, startLng, endLat, endLng) {
    const routes = [];
    const colors = ['#2196F3', '#FF9800', '#4CAF50'];
    const routeTypes = ['Direct route', 'Traffic avoidance route', 'Alternative route'];    
    try {
        // Tuyến đường 1: Trực tiếp không waypoint
        const coords1 = `${startLng},${startLat};${endLng},${endLat}`;
        const response1 = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords1}?overview=full&geometries=geojson&alternatives=false`);
        
        if (response1.ok) {
            const data1 = await response1.json();
            if (data1.routes && data1.routes.length > 0) {
                const osrmRoute = data1.routes[0];
                const coordinates = osrmRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
                routes.push({
                    type: routeTypes[0],
                    coordinates: coordinates,
                    distance: (osrmRoute.distance / 1000),
                    estimated_time: Math.round(osrmRoute.duration / 60),
                    color: colors[0]
                });
            }
        }
        
        // Tuyến đường 2: Tránh tắc (đi vòng phía bắc)
        const waypoint1 = createSmartWaypoint(startLat, startLng, endLat, endLng, 'north');
        const coords2 = `${startLng},${startLat};${waypoint1.lng},${waypoint1.lat};${endLng},${endLat}`;
        const response2 = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords2}?overview=full&geometries=geojson`);
        
        if (response2.ok) {
            const data2 = await response2.json();
            if (data2.routes && data2.routes.length > 0) {
                const osrmRoute = data2.routes[0];
                const coordinates = osrmRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
                // Kiểm tra xem tuyến này có khác đáng kể so với tuyến trực tiếp không
                const isSignificantlyDifferent = routes.length === 0 || 
                Math.abs(routes[0].distance - (osrmRoute.distance / 1000)) > 0.5;
                
                if (isSignificantlyDifferent) {
                    routes.push({
                        type: routeTypes[1],
                        coordinates: coordinates,
                        distance: (osrmRoute.distance / 1000),
                        estimated_time: Math.round(osrmRoute.duration / 60),
                        color: colors[1]
                    });
                }
            }
        }
        
        // Tuyến đường 3: Thay thế (đi vòng phía nam)
        const waypoint2 = createSmartWaypoint(startLat, startLng, endLat, endLng, 'south');
        const coords3 = `${startLng},${startLat};${waypoint2.lng},${waypoint2.lat};${endLng},${endLat}`;
        const response3 = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords3}?overview=full&geometries=geojson`);
        
        if (response3.ok) {
            const data3 = await response3.json();
            if (data3.routes && data3.routes.length > 0) {
                const osrmRoute = data3.routes[0];
                const coordinates = osrmRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
                // Kiểm tra xem tuyến này có khác với các tuyến đã có không
                const isUnique = routes.every(existingRoute => 
                    Math.abs(existingRoute.distance - (osrmRoute.distance / 1000)) > 0.5
                );
                
                if (isUnique && routes.length < 3) {
                    routes.push({
                        type: routeTypes[2],
                        coordinates: coordinates,
                        distance: (osrmRoute.distance / 1000),
                        estimated_time: Math.round(osrmRoute.duration / 60),
                        color: colors[2]
                    });
                }
            }
        }
        
        // Nếu chỉ có 1 tuyến hoặc không có tuyến nào, thử lấy alternatives từ OSRM
        if (routes.length < 2) {
            const alternativeResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords1}?overview=full&geometries=geojson&alternatives=true&alternative.max_paths=3`);
            
            if (alternativeResponse.ok) {
                const alternativeData = await alternativeResponse.json();
                if (alternativeData.routes && alternativeData.routes.length > 1) {
                    // Thêm các tuyến thay thế từ OSRM
                    for (let i = 1; i < Math.min(alternativeData.routes.length, 3); i++) {
                        const altRoute = alternativeData.routes[i];
                        const coordinates = altRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        
                        const routeTypeIndex = routes.length;
                        if (routeTypeIndex < routeTypes.length) {
                            routes.push({
                                type: routeTypes[routeTypeIndex],
                                coordinates: coordinates,
                                distance: (altRoute.distance / 1000),
                                estimated_time: Math.round(altRoute.duration / 60),
                                color: colors[routeTypeIndex]
                            });
                        }
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('Error generating routes:', error);
    }
    
    // Nếu vẫn không có tuyến đường nào, tạo tuyến đường dự phòng đơn giản
    if (routes.length === 0) {
        const directDistance = calculateDistance(startLat, startLng, endLat, endLng);
        const baseTime = Math.round(directDistance / 50 * 60);
        
        routes.push({
            type: routeTypes[0],
            coordinates: [
                [startLat, startLng],
                [endLat, endLng]
            ],
            distance: directDistance,
            estimated_time: baseTime,
            color: colors[0]
        });
    }
    
    // Sắp xếp các tuyến theo khoảng cách
    routes.sort((a, b) => a.distance - b.distance);
    
    return routes;
}
// Tính toán tuyến đường
async function calculateRoute() {
    const vehicleIndex = document.getElementById('vehicleSelect').value;
    
    if (!vehicleIndex) {
        alert('Vui lòng chọn xe');
        return;
    }
    
    if (!selectedDestination) {
        alert('Vui lòng tìm kiếm và chọn điểm đến');
        return;
    }
    
    const vehicle = vehicleData[vehicleIndex];
    const startLat = parseFloat(vehicle.Latitude);
    const startLng = parseFloat(vehicle.Longitude);
    
    // Hiển thị loading đơn giản
    const resultDiv = document.getElementById('routeResult');
    resultDiv.innerHTML = '<div style="text-align: center; padding: 20px;">Đang tìm tuyến đường...</div>';
    
    try {
        const routes = await generateMultipleRoutes(startLat, startLng, selectedDestination.lat, selectedDestination.lng);
        currentRoutes = routes;
        displayRouteResult(vehicle, routes);
        
    } catch (error) {
        console.error('Error calculating route:', error);
        resultDiv.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">Không thể tính toán tuyến đường. Vui lòng thử lại.</div>';
    }
}


// Tự động tải dữ liệu khi trang web được mở
window.onload = function() {
    initMap();
    loadVehicles();
};


// // Tạo obstacles markers trên lộ trình
// function createObstacleMarkersOnRoute(routeCoordinates) {
//     if (!routeCoordinates || routeCoordinates.length === 0) return;
    
//     // Dữ liệu chướng ngại vật đơn giản - sẽ được đặt trên lộ trình
//     const obstacleTypes = [
//         { type: 'construction', icon: '🚧', title: 'Thi công', severity: 'high', color: '#ef4444' },
//         { type: 'accident', icon: '⚠️', title: 'Tai nạn', severity: 'medium', color: '#f59e0b' },
//         { type: 'roadwork', icon: '👷', title: 'Sửa đường', severity: 'low', color: '#10b981' },
//         { type: 'flood', icon: '🌊', title: 'Ngập nước', severity: 'high', color: '#ef4444' }
//     ];
    
//     // Tính số chướng ngại vật (1-3 cái)
//     const numObstacles = Math.floor(Math.random() * 6) + 3;
    
//     for (let i = 0; i < numObstacles; i++) {
//         // Chọn vị trí trên lộ trình (20%, 50%, 80% của tuyến đường)
//         const positions = [0.2, 0.5, 0.8];
//         const positionRatio = positions[i] || Math.random();
//         const pointIndex = Math.floor(routeCoordinates.length * positionRatio);
//         const routePoint = routeCoordinates[pointIndex] || routeCoordinates[0];
        
//         // Chọn loại chướng ngại vật ngẫu nhiên
//         const obstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        
//         // Tạo icon đơn giản
//         const obstacleIcon = L.divIcon({
//             html: `
//                 <div style="
//                     background: ${obstacle.color}; 
//                     width: 30px; 
//                     height: 30px; 
//                     border-radius: 50%; 
//                     display: flex; 
//                     align-items: center; 
//                     justify-content: center; 
//                     color: white; 
//                     font-size: 14px; 
//                     border: 2px solid white;
//                     box-shadow: 0 2px 10px rgba(0,0,0,0.3);
//                 ">
//                     ${obstacle.icon}
//                 </div>
//             `,
//             className: '',
//             iconSize: [30, 30],
//             iconAnchor: [15, 15]
//         });
        
//         // Tạo marker tại vị trí trên lộ trình
//         const obstacleMarker = L.marker([routePoint[0], routePoint[1]], {icon: obstacleIcon})
//             .addTo(map)
//             .bindPopup(`
//                 <div style="min-width: 180px; text-align: center;">
//                     <div style="background: ${obstacle.color}; color: white; padding: 10px; margin: -10px -10px 10px -10px; border-radius: 5px;">
//                         <div style="font-size: 18px;">${obstacle.icon}</div>
//                         <div style="font-weight: bold;">${obstacle.title}</div>
//                     </div>
//                     <p style="margin: 10px 0; color: #666;">Chướng ngại vật trên lộ trình</p>
//                     <div style="display: flex; gap: 5px;">
//                         <button onclick="reportObstacle()" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-size: 12px;">Báo cáo</button>
//                         <button onclick="avoidObstacle()" style="flex: 1; background: #10b981; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-size: 12px;">Tránh đường</button>
//                     </div>
//                 </div>
//             `);
            
//         routeMarkers.push(obstacleMarker);
//     }
// }

// // Hiển thị tất cả tuyến đường với chướng ngại vật trên lộ trình
// function showAllRoutesOnMap(routes) {
//     clearMap();
    
//     routes.forEach((route, routeIndex) => {
//         // Vẽ đường
//         const polyline = L.polyline(route.coordinates, {
//             color: route.color,
//             weight: 5,
//             opacity: 0.8,
//             dashArray: routeIndex === 0 ? null : '10, 5'
//         }).addTo(map);
        
//         routeLines.push(polyline);
        
//         // Thêm chướng ngại vật chỉ cho tuyến được chọn hoặc tuyến đầu tiên
//         if (routeIndex === 0) {
//             createObstacleMarkersOnRoute(route.coordinates);
//         }
        
//         // Marker điểm đầu và cuối
//         if (route.coordinates.length > 0) {
//             const startMarker = L.marker(route.coordinates[0])
//                 .addTo(map)
//                 .bindPopup('🚗 Điểm xuất phát');
            
//             const endMarker = L.marker(route.coordinates[route.coordinates.length - 1])
//                 .addTo(map)
//                 .bindPopup('🏁 Điểm đến');
            
//             routeMarkers.push(startMarker, endMarker);
//         }
        
//         // Popup cho đường
//         polyline.bindPopup(`
//             <div style="min-width: 200px; text-align: center;">
//                 <h4 style="color: ${route.color}; margin: 0 0 10px 0;">${route.type}</h4>
//                 <p style="margin: 5px 0;"><strong>Khoảng cách:</strong> ${route.distance.toFixed(1)} km</p>
//                 <p style="margin: 5px 0;"><strong>Thời gian:</strong> ${route.estimated_time} phút</p>
//                 <button onclick="selectRoute(${routeIndex})" style="background: ${route.color}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
//                     Chọn tuyến này
//                 </button>
//             </div>
//         `);
//     });
    
//     // Fit bản đồ
//     if (routeLines.length > 0) {
//         const group = new L.featureGroup(routeLines);
//         map.fitBounds(group.getBounds(), {padding: [20, 20]});
//     }
// }

// // Hiển thị một tuyến đường cụ thể với chướng ngại vật
// function showRouteOnMap(routeIndex) {
//     if (!currentRoutes || !currentRoutes[routeIndex]) {
//         alert('Không tìm thấy tuyến đường');
//         return;
//     }
    
//     const route = currentRoutes[routeIndex];
//     clearMap();
    
//     // Vẽ đường
//     const polyline = L.polyline(route.coordinates, {
//         color: route.color,
//         weight: 6,
//         opacity: 1
//     }).addTo(map);
    
//     routeLines.push(polyline);
    
//     // Thêm chướng ngại vật trên lộ trình này
//     createObstacleMarkersOnRoute(route.coordinates);
    
//     // Marker điểm đầu và cuối
//     if (route.coordinates.length > 0) {
//         const startMarker = L.marker(route.coordinates[0])
//             .addTo(map)
//             .bindPopup('🚗 Điểm xuất phát');
        
//         const endMarker = L.marker(route.coordinates[route.coordinates.length - 1])
//             .addTo(map)
//             .bindPopup('🏁 Điểm đến');
        
//         routeMarkers.push(startMarker, endMarker);
//     }
    
//     // Fit bản đồ
//     const group = new L.featureGroup([polyline]);
//     map.fitBounds(group.getBounds().pad(0.1));
    
//     // Mở popup thông tin tuyến đường
//     polyline.bindPopup(`
//         <div style="text-align: center;">
//             <h3 style="color: ${route.color};">${route.type}</h3>
//             <p><strong>Khoảng cách:</strong> ${route.distance.toFixed(1)} km</p>
//             <p><strong>Thời gian:</strong> ${route.estimated_time} phút</p>
//             <button onclick="selectRoute(${routeIndex})" style="background: ${route.color}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
//                 Chọn tuyến này
//             </button>
//         </div>
//     `).openPopup();
// }

// // Báo cáo chướng ngại vật (đơn giản)
// function reportObstacle() {
//     alert('Cảm ơn bạn đã báo cáo chướng ngại vật!');
// }

// // Tránh chướng ngại vật (đơn giản)
// function avoidObstacle() {
//     alert('Đang tìm đường tránh chướng ngại vật...');
// }

// // Chọn tuyến đường
// function selectRoute(routeIndex) {
//     const route = currentRoutes[routeIndex];
//     if (route) {
//         alert(`Đã chọn tuyến: ${route.type}\nKhoảng cách: ${route.distance.toFixed(1)} km\nThời gian: ${route.estimated_time} phút`);
//         showRouteOnMap(routeIndex);
//     }
// }

// // Xóa tất cả markers và lines
// function clearMap() {
//     routeMarkers.forEach(marker => map.removeLayer(marker));
//     routeLines.forEach(line => map.removeLayer(line));
//     routeMarkers = [];
//     routeLines = [];
// }








// // Chọn điểm đến
// function selectDestination() {
//     const selectedIndex = document.getElementById('destinationSelect').value;
    
//     if (!selectedIndex) {
//         document.getElementById('selectedDestination').style.display = 'none';
//         selectedDestination = null;
//         return;
//     }
    
//     const selected = searchResults[selectedIndex];
//     selectedDestination = {
//         name: selected.display_name,
//         lat: parseFloat(selected.lat),
//         lng: parseFloat(selected.lon)
//     };
    
//     document.getElementById('selectedDestinationName').textContent = selected.display_name;
//     document.getElementById('selectedDestinationCoords').textContent = `${selected.lat}, ${selected.lon}`;
//     document.getElementById('selectedDestination').style.display = 'block';
    
//     showDestinationOnMap();
// }

// // Hiển thị điểm đến trên bản đồ
// function showDestinationOnMap() {
//     if (!selectedDestination) return;
    
//     clearMap();
    
//     const marker = L.marker([selectedDestination.lat, selectedDestination.lng])
//         .addTo(map)
//         .bindPopup(`<b>Điểm đến</b><br>${selectedDestination.name}<br>Tọa độ: ${selectedDestination.lat.toFixed(6)}, ${selectedDestination.lng.toFixed(6)}`);
    
//     routeMarkers.push(marker);
//     map.setView([selectedDestination.lat, selectedDestination.lng], 13);
// }
// // Hiển thị kết quả định tuyến (đã đơn giản hóa)
// function displayRouteResult(vehicle, routes) {
//     const resultDiv = document.getElementById('routeResult');
//     let html = `
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
//             <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">🚗 Route for vehicle ${vehicle.license_plate}</h3>
//             <p style="margin: 5px 0; opacity: 0.9;">👤 User: ${vehicle.user_id}</p>
//             <p style="margin: 5px 0; opacity: 0.9;">📍 Destination: ${selectedDestination.name}</p>
//         </div>
        
//         <div style="background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
//             <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">🗺️ Available Routes</h4>
//             <p style="margin: 0; color: #64748b; font-size: 14px;">Choose the most suitable route for your journey</p>
//         </div>
//     `;
    
//     const routeIcons = ['🏃', '🚶', '🛤️'];
//     const gradients = [
//         'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//         'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
//     ];
    
//     routes.forEach((route, index) => {
//         const isRecommended = index === 0;
//         html += `
//             <div style="background: white; border: ${isRecommended ? '3px solid #10b981' : '2px solid #e5e7eb'}; margin: 15px 0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease; position: relative;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.1)'">
                
//                 ${isRecommended ? `<div style="background: linear-gradient(90deg, #10b981, #059669); color: white; padding: 8px 15px; font-size: 12px; font-weight: 600; text-align: center; letter-spacing: 0.5px;">⭐ RECOMMENDED ROUTE</div>` : ''}
                
//                 <div style="padding: 20px;">
//                     <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
//                         <h4 style="color: #1e293b; margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">${routeIcons[index] || '🛣️'} ${route.type}</h4>
//                         <div style="width: 20px; height: 20px; border-radius: 50%; background: ${route.color}; box-shadow: 0 2px 8px ${route.color}40;"></div>
//                     </div>
                    
//                     <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
//                         <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; text-align: center;">
//                             <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">DISTANCE</div>
//                             <div style="color: #1e293b; font-size: 20px; font-weight: 700;">${route.distance.toFixed(1)} <span style="font-size: 14px; color: #64748b;">km</span></div>
//                         </div>
//                         <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; text-align: center;">
//                             <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">TIME</div>
//                             <div style="color: #1e293b; font-size: 20px; font-weight: 700;">${route.estimated_time} <span style="font-size: 14px; color: #64748b;">minutes</span></div>
//                         </div>
//                     </div>
                    
//                     <div style="display: flex; gap: 10px; flex-wrap: wrap;">
//                         <button onclick="selectRoute(${index})" style="background: ${gradients[index] || gradients[0]}; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 14px; flex: 1; min-width: 140px; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">✅ Select this route</button>
//                         <button onclick="showRouteOnMap(${index})" style="background: white; color: ${route.color}; border: 2px solid ${route.color}; padding: 12px 20px; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 14px; flex: 1; min-width: 140px; transition: all 0.2s ease;" onmouseover="this.style.background='${route.color}'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='${route.color}'">🗺️ View on map</button>
//                     </div>
//                 </div>
//             </div>
//         `;
//     });
    
//     html += `<div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 15px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #f59e0b;"><p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">💡 <strong>Tip:</strong> The recommended route is usually the shortest and fastest. Click on the map to view detailed route information.</p></div>`;
    
//     resultDiv.innerHTML = html;
//     showAllRoutesOnMap(routes);
// }

// // Chọn tuyến đường
// function selectRoute(routeIndex) {
//     const route = currentRoutes[routeIndex];
//     if (route) {
//         // Create a prettier notification
//         const notification = document.createElement('div');
//         notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3); z-index: 10000; font-weight: 600; max-width: 300px; animation: slideIn 0.3s ease;`;
        
//         notification.innerHTML = `
//             <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
//                 <div style="font-size: 20px;">✅</div>
//                 <div style="font-size: 16px;">Route selected!</div>
//             </div>
//             <div style="font-size: 14px; opacity: 0.9;">${route.type}<br>📏 ${route.distance.toFixed(1)} km • ⏱️ ${route.estimated_time} minutes</div>
//         `;
        
//         // Add CSS animation
//         const style = document.createElement('style');
//         style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
//         document.head.appendChild(style);
        
//         document.body.appendChild(notification);
        
//         // Auto hide after 3 seconds
//         setTimeout(() => {
//             notification.style.animation = 'slideIn 0.3s ease reverse';
//             setTimeout(() => {
//                 document.body.removeChild(notification);
//                 document.head.removeChild(style);
//             }, 300);
//         }, 3000);
        
//         showRouteOnMap(routeIndex);
//     }
// }

// // Xóa tất cả markers và lines trên bản đồ
// function clearMap() {
//     routeMarkers.forEach(marker => map.removeLayer(marker));
//     routeLines.forEach(line => map.removeLayer(line));
//     routeMarkers = [];
//     routeLines = [];
// }

// // Hiển thị tất cả tuyến đường trên bản đồ
// function showAllRoutesOnMap(routes) {
//     clearMap();
    
//     routes.forEach((route, routeIndex) => {
//         const polyline = L.polyline(route.coordinates, {
//             color: route.color,
//             weight: 5,
//             opacity: 0.9,
//             dashArray: routeIndex === 0 ? null : '10, 5'
//         }).addTo(map);
        
//         routeLines.push(polyline);
        
//         const isRecommended = routeIndex === 0;
//         polyline.bindPopup(`
//             <div style="min-width: 250px; font-family: Arial, sans-serif;">
//                 ${isRecommended ? `<div style="background: linear-gradient(90deg, #10b981, #059669); color: white; padding: 8px 12px; margin: -10px -10px 10px -10px; font-size: 11px; font-weight: 600; text-align: center; letter-spacing: 0.5px;">⭐ TUYẾN ĐỀ XUẤT</div>` : ''}
                
//                 <h4 style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
//                     <div style="width: 12px; height: 12px; border-radius: 50%; background: ${route.color};"></div>
//                     ${route.type}
//                 </h4>
                
//                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
//                     <div style="text-align: center; background: #f8fafc; padding: 8px; border-radius: 6px;">
//                         <div style="color: #64748b; font-size: 11px;">KHOẢNG CÁCH</div>
//                         <div style="color: #1e293b; font-weight: 700; font-size: 14px;">${route.distance.toFixed(1)} km</div>
//                     </div>
//                     <div style="text-align: center; background: #f8fafc; padding: 8px; border-radius: 6px;">
//                         <div style="color: #64748b; font-size: 11px;">THỜI GIAN</div>
//                         <div style="color: #1e293b; font-weight: 700; font-size: 14px;">${route.estimated_time} phút</div>
//                     </div>
//                 </div>
                
//                 <button onclick="selectRoute(${routeIndex})" style="background: linear-gradient(135deg, ${route.color}, ${route.color}dd); color: white; border: none; padding: 10px 16px; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 13px; width: 100%; transition: all 0.2s ease;">✅ Chọn tuyến này</button>
//             </div>
//         `);
        
//         // Cải thiện markers
//         if (route.coordinates.length > 0) {
//             const startIcon = L.divIcon({
//                 html: `<div style="background: linear-gradient(135deg, #10b981, #059669); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); border: 3px solid white;">🚗</div>`,
//                 className: '',
//                 iconSize: [36, 36],
//                 iconAnchor: [18, 18]
//             });
            
//             const endIcon = L.divIcon({
//                 html: `<div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); border: 3px solid white;">🏁</div>`,
//                 className: '',
//                 iconSize: [36, 36],
//                 iconAnchor: [18, 18]
//             });
            
//             const startMarker = L.marker(route.coordinates[0], {icon: startIcon})
//                 .addTo(map)
//                 .bindPopup(`<div style="text-align: center; font-weight: 600; color: #10b981;">🚗 Điểm xuất phát<br><small style="color: #64748b;">Vị trí xe hiện tại</small></div>`);
            
//             const endMarker = L.marker(route.coordinates[route.coordinates.length - 1], {icon: endIcon})
//                 .addTo(map)
//                 .bindPopup(`<div style="text-align: center; font-weight: 600; color: #ef4444;">🏁 Điểm đến<br><small style="color: #64748b;">${selectedDestination.name}</small></div>`);
            
//             routeMarkers.push(startMarker, endMarker);
//         }
//     });
    
//     // Fit map để hiển thị tất cả tuyến đường
//     if (routes.length > 0 && routeLines.length > 0) {
//         const group = new L.featureGroup(routeLines);
//         map.fitBounds(group.getBounds(), {padding: [20, 20], maxZoom: 10});
//     }
// }
// // Hiển thị một tuyến đường cụ thể trên bản đồ
// function showRouteOnMap(routeIndex) {
//     if (!currentRoutes || !currentRoutes[routeIndex]) {
//         alert('Không tìm thấy tuyến đường');
//         return;
//     }
    
//     const route = currentRoutes[routeIndex];
//     clearMap();
    
//     const polyline = L.polyline(route.coordinates, {
//         color: route.color,
//         weight: 6,
//         opacity: 1
//     }).addTo(map);
    
//     routeLines.push(polyline);
    
//     // Thêm markers
//     if (route.coordinates.length > 0) {
//         const startMarker = L.marker(route.coordinates[0])
//             .addTo(map)
//             .bindPopup('Điểm xuất phát');
        
//         const endMarker = L.marker(route.coordinates[route.coordinates.length - 1])
//             .addTo(map)
//             .bindPopup('Điểm đến');
        
//         routeMarkers.push(startMarker, endMarker);
//     }
    
//     // Fit map bounds
//     const group = new L.featureGroup(routeLines);
//     map.fitBounds(group.getBounds().pad(0.1));
    
//     // Hiển thị thông tin tuyến đường
//     polyline.bindPopup(`
//         <div>
//             <h3>${route.type}</h3>
//             <p><strong>Khoảng cách:</strong> ${route.distance.toFixed(1)} km</p>
//             <p><strong>Thời gian:</strong> ${route.estimated_time} phút</p>
//             <button onclick="selectRoute(${routeIndex})" style="background: ${route.color}; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
//                 Chọn tuyến này
//             </button>
//         </div>
//     `).openPopup();
// }