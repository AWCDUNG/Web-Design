// // Tính khoảng cách giữa 2 điểm (Haversine formula)
// function calculateDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Bán kính Trái Đất (km)
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//               Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
// }

// // Tính tổng khoảng cách của lộ trình
// function getTotalRouteDistance(routeCoordinates) {
//     if (!routeCoordinates || routeCoordinates.length < 2) return 0;
    
//     let totalDistance = 0;
//     for (let i = 1; i < routeCoordinates.length; i++) {
//         totalDistance += calculateDistance(
//             routeCoordinates[i-1][0], routeCoordinates[i-1][1],
//             routeCoordinates[i][0], routeCoordinates[i][1]
//         );
//     }
//     return totalDistance;
// }

// // Tính số lượng chướng ngại vật dựa trên độ dài lộ trình
// function calculateObstacleCount(routeCoordinates) {
//     const totalDistance = getTotalRouteDistance(routeCoordinates);
    
//     // Quy tắc tính số lượng chướng ngại vật
//     let baseCount, maxExtra;
//     if (totalDistance < 10) {
//         baseCount = 2;
//         maxExtra = 2; // 3-6 chướng ngại vật
//     } else if (totalDistance < 30) {
//         baseCount = 3;
//         maxExtra = 2; // 6-10 chướng ngại vật
//     } else if (totalDistance < 80) {
//         baseCount = 3;
//         maxExtra = 3; // 10-16 chướng ngại vật
//     } else if (totalDistance < 150) {
//         baseCount = 4;
//         maxExtra = 3; // 16-24 chướng ngại vật
//     } else {
//         baseCount = 5;
//         maxExtra = 3; // 24-36 chướng ngại vật
//     }
    
//     const finalCount = baseCount + Math.floor(Math.random() * maxExtra);
//     console.log(`Lộ trình ${totalDistance.toFixed(1)}km → ${finalCount} chướng ngại vật`);
//     return finalCount;
// }

// // Tạo obstacles markers trên lộ trình với số lượng tự động theo độ dài
// function createObstacleMarkersOnRoute(routeCoordinates) {
//     if (!routeCoordinates || routeCoordinates.length === 0) return;
    
//     // Dữ liệu chướng ngại vật với icon Google Maps style
//     const obstacleTypes = [
//         { type: 'construction', icon: '🚧', title: 'Thi công đường', severity: 'high', color: '#FF5722', description: 'Công trình đang thi công, lưu lượng chậm' },
//         { type: 'accident', icon: '⚠️', title: 'Tai nạn giao thông', severity: 'high', color: '#F44336', description: 'Tai nạn đang được xử lý, đường bị tắc' },
//         { type: 'roadwork', icon: '👷‍♂️', title: 'Bảo trì đường', severity: 'medium', color: '#FF9800', description: 'Đang sửa chữa mặt đường' },
//         { type: 'flood', icon: '🌊', title: 'Ngập nước', severity: 'high', color: '#2196F3', description: 'Đường ngập, không thể di chuyển' },
//         { type: 'traffic', icon: '🚦', title: 'Tắc đường nghiêm trọng', severity: 'medium', color: '#E91E63', description: 'Lưu lượng xe đông, di chuyển chậm' },
//         { type: 'closure', icon: '🚫', title: 'Đóng đường', severity: 'high', color: '#9C27B0', description: 'Đường bị đóng hoàn toàn' },
//         { type: 'weather', icon: '🌩️', title: 'Thời tiết xấu', severity: 'medium', color: '#607D8B', description: 'Mưa lớn, tầm nhìn hạn chế' },
//         { type: 'police', icon: '👮‍♂️', title: 'Kiểm tra CSGT', severity: 'low', color: '#4CAF50', description: 'Lực lượng CSGT đang kiểm tra' },
//         { type: 'maintenance', icon: '🔧', title: 'Bảo trì cầu đường', severity: 'medium', color: '#795548', description: 'Đang bảo trì hạ tầng giao thông' },
//     ];
    
//     // Tính số lượng chướng ngại vật dựa trên độ dài lộ trình
//     const numObstacles = calculateObstacleCount(routeCoordinates);
    
//     for (let i = 0; i < numObstacles; i++) {
//         // Phân bố đều trên lộ trình với một chút ngẫu nhiên
//         const basePosition = i / numObstacles;
//         const randomOffset = (Math.random() - 0.5) * 0.8 / numObstacles; // Offset nhỏ để tránh chồng chéo
//         const positionRatio = Math.max(0, Math.min(1, basePosition + randomOffset));
//         const pointIndex = Math.floor(routeCoordinates.length * positionRatio);
//         const routePoint = routeCoordinates[pointIndex] || routeCoordinates[0];
        
//         // Chọn loại chướng ngại vật - tránh lặp lại liên tiếp
//         let obstacle;
//         let attempts = 0;
//         do {
//             obstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
//             attempts++;
//         } while (attempts < 5 && i > 0 && routeMarkers[routeMarkers.length - 1]?.obstacleType === obstacle.type);
        
//         // CSS tối ưu cho marker
//         const markerStyle = `
//             background: linear-gradient(145deg, ${obstacle.color}, ${obstacle.color}dd);
//             width: 28px; height: 28px; border-radius: 50%;
//             display: flex; align-items: center; justify-content: center;
//             color: white; font-size: 13px;
//             border: 3px solid white;
//             box-shadow: 0 4px 12px rgba(0,0,0,.3), 0 2px 6px rgba(0,0,0,.2);
//             position: relative; cursor: pointer;
//             transition: all 0.2s ease;
//         `;
        
//         const triangleStyle = `
//             position: absolute; bottom: -8px; left: 50%;
//             transform: translateX(-50%);
//             width: 0; height: 0;
//             border-left: 6px solid transparent;
//             border-right: 6px solid transparent;
//             border-top: 8px solid ${obstacle.color};
//             filter: drop-shadow(0 2px 4px rgba(0,0,0,.2));
//         `;
        
//         const obstacleIcon = L.divIcon({
//             html: `
//                 <div class="obstacle-marker" style="${markerStyle}" 
//                      onmouseover="this.style.transform='scale(1.1)'" 
//                      onmouseout="this.style.transform='scale(1)'">
//                     ${obstacle.icon}
//                     <div style="${triangleStyle}"></div>
//                 </div>
//             `,
//             className: '',
//             iconSize: [36, 44],
//             iconAnchor: [18, 44]
//         });
        
//         // Popup styles
//         const severityText = obstacle.severity === 'high' ? 'Nghiêm trọng' : 
//                            obstacle.severity === 'medium' ? 'Trung bình' : 'Nhẹ';
//         const timeAgo = Math.floor(Math.random() * 45) + 5; // 5-50 phút
        
//         const obstacleMarker = L.marker([routePoint[0], routePoint[1]], {icon: obstacleIcon})
//             .addTo(map)
//             .bindPopup(`
//                 <div style="min-width: 220px; font-family: 'Segoe UI', Arial, sans-serif;">
//                     <div style="background: linear-gradient(145deg, ${obstacle.color}, ${obstacle.color}dd); 
//                                 color: white; padding: 15px; margin: -12px -12px 12px -12px; 
//                                 border-radius: 8px 8px 0 0; text-align: center;">
//                         <div style="font-size: 24px; margin-bottom: 8px;">${obstacle.icon}</div>
//                         <div style="font-weight: bold; font-size: 16px;">${obstacle.title}</div>
//                         <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
//                             Mức độ: ${severityText}
//                         </div>
//                     </div>
//                     <div style="padding: 0 5px;">
//                         <p style="margin: 10px 0; color: #555; font-size: 14px; line-height: 1.4;">
//                             ${obstacle.description}
//                         </p>
//                         <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; 
//                                     margin: 10px 0; font-size: 13px;">
//                             <div style="display: flex; align-items: center; margin-bottom: 5px;">
//                                 <span style="font-size: 16px; margin-right: 8px;">📍</span>
//                                 <span style="color: #666;">Vị trí: ${Math.floor(positionRatio * 100)}% tuyến đường</span>
//                             </div>
//                             <div style="display: flex; align-items: center;">
//                                 <span style="font-size: 16px; margin-right: 8px;">⏱️</span>
//                                 <span style="color: #666;">Cập nhật: ${timeAgo} phút trước</span>
//                             </div>
//                         </div>
//                         <div style="display: flex; gap: 8px; margin-top: 15px;">
//                             <button onclick="reportObstacle('${obstacle.type}')" 
//                                     style="flex: 1; background: linear-gradient(145deg, #2196F3, #1976D2); 
//                                            color: white; border: none; padding: 10px 8px; 
//                                            border-radius: 6px; cursor: pointer; font-size: 13px; 
//                                            font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,.2);">
//                                 📢 Báo cáo
//                             </button>
//                             <button onclick="avoidObstacle('${obstacle.type}')" 
//                                     style="flex: 1; background: linear-gradient(145deg, #4CAF50, #388E3C); 
//                                            color: white; border: none; padding: 10px 8px; 
//                                            border-radius: 6px; cursor: pointer; font-size: 13px; 
//                                            font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,.2);">
//                                 🔄 Tránh đường
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             `, {maxWidth: 250, className: 'obstacle-popup'});
            
//         // Lưu loại chướng ngại vật để tránh lặp
//         obstacleMarker.obstacleType = obstacle.type;
//         routeMarkers.push(obstacleMarker);
        
//         // Animation cho chướng ngại vật nghiêm trọng
//         if (obstacle.severity === 'high') {
//             setTimeout(() => {
//                 const markerElement = obstacleMarker.getElement();
//                 if (markerElement) {
//                     markerElement.style.animation = 'pulse 2s infinite';
//                 }
//             }, 100 + i * 50); // Delay tăng dần để tránh lag
//         }
//     }
// }

// // Hiển thị tất cả tuyến đường với chướng ngại vật
// function showAllRoutesOnMap(routes) {
//     clearMap();
    
//     routes.forEach((route, routeIndex) => {
//         const polyline = L.polyline(route.coordinates, {
//             color: route.color,
//             weight: routeIndex === 0 ? 6 : 5,
//             opacity: routeIndex === 0 ? 0.9 : 0.7,
//             dashArray: routeIndex === 0 ? null : '10, 5',
//             lineCap: 'round',
//             lineJoin: 'round'
//         }).addTo(map);
        
//         routeLines.push(polyline);
        
//         // Chỉ tạo chướng ngại vật cho tuyến đầu tiên (được recommend)
//         if (routeIndex === 0) {
//             createObstacleMarkersOnRoute(route.coordinates);
//         }
        
//         // Tạo markers điểm đầu và cuối
//         if (route.coordinates.length > 0) {
//             const startIconStyle = `
//                 background: linear-gradient(145deg, #4CAF50, #388E3C);
//                 width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
//                 transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;
//                 border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,.3);
//             `;
//             const endIconStyle = `
//                 background: linear-gradient(145deg, #F44336, #D32F2F);
//                 width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
//                 transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;
//                 border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,.3);
//             `;
            
//             const startIcon = L.divIcon({
//                 html: `<div style="${startIconStyle}">
//                     <span style="transform: rotate(45deg); color: white; font-size: 16px;">🚗</span>
//                 </div>`,
//                 className: '', iconSize: [32, 32], iconAnchor: [16, 32]
//             });
            
//             const endIcon = L.divIcon({
//                 html: `<div style="${endIconStyle}">
//                     <span style="transform: rotate(45deg); color: white; font-size: 16px;">🏁</span>
//                 </div>`,
//                 className: '', iconSize: [32, 32], iconAnchor: [16, 32]
//             });
            
//             const startMarker = L.marker(route.coordinates[0], {icon: startIcon})
//                 .addTo(map)
//                 .bindPopup(`<div style="text-align: center; font-family: 'Segoe UI', sans-serif;">
//                     <div style="font-size: 20px; margin-bottom: 5px;">🚗</div>
//                     <strong>Điểm xuất phát</strong>
//                 </div>`);
            
//             const endMarker = L.marker(route.coordinates[route.coordinates.length - 1], {icon: endIcon})
//                 .addTo(map)
//                 .bindPopup(`<div style="text-align: center; font-family: 'Segoe UI', sans-serif;">
//                     <div style="font-size: 20px; margin-bottom: 5px;">🏁</div>
//                     <strong>Điểm đến</strong>
//                 </div>`);
            
//             routeMarkers.push(startMarker, endMarker);
//         }
        
//         // Popup cho polyline
//         polyline.bindPopup(`
//             <div style="min-width: 220px; text-align: center; font-family: 'Segoe UI', sans-serif;">
//                 <div style="background: linear-gradient(145deg, ${route.color}, ${route.color}dd); 
//                             color: white; padding: 15px; margin: -12px -12px 15px -12px; 
//                             border-radius: 8px 8px 0 0;">
//                     <h4 style="margin: 0; font-size: 18px; font-weight: 600;">${route.type}</h4>
//                 </div>
//                 <div style="padding: 0 10px;">
//                     <div style="display: flex; justify-content: space-between; margin: 10px 0;">
//                         <div style="text-align: center;">
//                             <div style="font-size: 20px; color: #2196F3;">📏</div>
//                             <div style="font-size: 14px; color: #666;">Khoảng cách</div>
//                             <div style="font-weight: bold; color: #333;">${route.distance.toFixed(1)} km</div>
//                         </div>
//                         <div style="text-align: center;">
//                             <div style="font-size: 20px; color: #FF9800;">⏱️</div>
//                             <div style="font-size: 14px; color: #666;">Thời gian</div>
//                             <div style="font-weight: bold; color: #333;">${route.estimated_time} phút</div>
//                         </div>
//                     </div>
//                     <button onclick="selectRoute(${routeIndex})" 
//                             style="background: linear-gradient(145deg, ${route.color}, ${route.color}dd); 
//                                    color: white; border: none; padding: 12px 20px; 
//                                    border-radius: 6px; cursor: pointer; margin-top: 15px; 
//                                    width: 100%; font-weight: 600; font-size: 14px; 
//                                    box-shadow: 0 2px 4px rgba(0,0,0,.2);">
//                         🎯 Chọn tuyến này
//                     </button>
//                 </div>
//             </div>
//         `);
//     });
    
//     // Fit bounds
//     if (routeLines.length > 0) {
//         const group = new L.featureGroup(routeLines);
//         map.fitBounds(group.getBounds(), {padding: [30, 30]});
//     }
// }

// // Hiển thị một tuyến đường cụ thể với chướng ngại vật
// function showRouteOnMap(routeIndex) {
//     if (!currentRoutes || !currentRoutes[routeIndex]) {
//         showNotification('Không tìm thấy tuyến đường', 'error');
//         return;
//     }
    
//     const route = currentRoutes[routeIndex];
//     clearMap();
    
//     const polyline = L.polyline(route.coordinates, {
//         color: route.color, weight: 7, opacity: 1, 
//         lineCap: 'round', lineJoin: 'round'
//     }).addTo(map);
    
//     routeLines.push(polyline);
//     createObstacleMarkersOnRoute(route.coordinates);
    
//     // Markers điểm đầu cuối
//     if (route.coordinates.length > 0) {
//         const markerBaseStyle = `
//             width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
//             transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;
//             border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,.3);
//         `;
        
//         const startIcon = L.divIcon({
//             html: `<div style="background: #4CAF50; ${markerBaseStyle}">
//                 <span style="transform: rotate(45deg); color: white; font-size: 16px;">🚗</span>
//             </div>`,
//             iconSize: [32, 32], iconAnchor: [16, 32]
//         });
        
//         const endIcon = L.divIcon({
//             html: `<div style="background: #F44336; ${markerBaseStyle}">
//                 <span style="transform: rotate(45deg); color: white; font-size: 16px;">🏁</span>
//             </div>`,
//             iconSize: [32, 32], iconAnchor: [16, 32]
//         });
        
//         const startMarker = L.marker(route.coordinates[0], {icon: startIcon}).addTo(map).bindPopup('🚗 Điểm xuất phát');
//         const endMarker = L.marker(route.coordinates[route.coordinates.length - 1], {icon: endIcon}).addTo(map).bindPopup('🏁 Điểm đến');
        
//         routeMarkers.push(startMarker, endMarker);
//     }
    
//     const group = new L.featureGroup([polyline]);
//     map.fitBounds(group.getBounds().pad(0.1));
    
//     const totalDistance = getTotalRouteDistance(route.coordinates);
//     showNotification(`Đã chọn tuyến: ${route.type} (${totalDistance.toFixed(1)}km)`, 'success');
// }

// // Các hàm xử lý sự kiện
// function reportObstacle(type) {
//     showNotification('Cảm ơn bạn đã báo cáo chướng ngại vật! Thông tin đã được ghi nhận.', 'success');
// }

// function avoidObstacle(type) {
//     showNotification('Đang tìm đường tránh chướng ngại vật...', 'info');
//     setTimeout(() => showNotification('Đã tìm thấy đường tránh phù hợp!', 'success'), 2000);
// }

// function selectRoute(routeIndex) {
//     const route = currentRoutes[routeIndex];
//     if (route) {
//         const totalDistance = getTotalRouteDistance(route.coordinates);
//         showNotification(`Đã chọn tuyến: ${route.type} - ${totalDistance.toFixed(1)}km - ${route.estimated_time} phút`, 'success');
//         showRouteOnMap(routeIndex);
//     }
// }

// function clearMap() {
//     routeMarkers.forEach(marker => map.removeLayer(marker));
//     routeLines.forEach(line => map.removeLayer(line));
//     routeMarkers = [];
//     routeLines = [];
// }

// function showNotification(message, type = 'info') {
//     const colors = { 'success': '#4CAF50', 'error': '#F44336', 'warning': '#FF9800', 'info': '#2196F3' };
//     const notification = document.createElement('div');
//     notification.style.cssText = `
//         position: fixed; top: 20px; right: 20px; background: ${colors[type]};
//         color: white; padding: 15px 20px; border-radius: 8px;
//         box-shadow: 0 4px 12px rgba(0,0,0,.3); z-index: 10000;
//         max-width: 300px; font-family: 'Segoe UI', sans-serif; font-size: 14px;
//         animation: slideInRight 0.3s ease-out;
//     `;
//     notification.textContent = message;
//     document.body.appendChild(notification);
//     setTimeout(() => {
//         notification.style.animation = 'slideOutRight 0.3s ease-in';
//         setTimeout(() => document.body.removeChild(notification), 300);
//     }, 4000);
// }

// // CSS animations
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes pulse {
//         0% { transform: scale(1); opacity: 1; }
//         50% { transform: scale(1.1); opacity: 0.7; }
//         100% { transform: scale(1); opacity: 1; }
//     }
//     @keyframes slideInRight {
//         from { transform: translateX(100%); opacity: 0; }
//         to { transform: translateX(0); opacity: 1; }
//     }
//     @keyframes slideOutRight {
//         from { transform: translateX(0); opacity: 1; }
//         to { transform: translateX(100%); opacity: 0; }
//     }
//     .obstacle-popup .leaflet-popup-content-wrapper {
//         border-radius: 10px;
//         box-shadow: 0 8px 25px rgba(0,0,0,.3);
//     }
//     .obstacle-popup .leaflet-popup-tip {
//         box-shadow: 0 2px 4px rgba(0,0,0,.2);
//     }
// `;
// document.head.appendChild(style);