// route/ulis.js

// Chọn điểm đến
function selectDestination() {
    const selectedIndex = document.getElementById('destinationSelect').value;
    
    if (!selectedIndex) {
        document.getElementById('selectedDestination').style.display = 'none';
        selectedDestination = null;
        return;
    }
    
    const selected = searchResults[selectedIndex];
    selectedDestination = {
        name: selected.display_name,
        lat: parseFloat(selected.lat),
        lng: parseFloat(selected.lon)
    };
    
    document.getElementById('selectedDestinationName').textContent = selected.display_name;
    document.getElementById('selectedDestinationCoords').textContent = `${selected.lat}, ${selected.lon}`;
    document.getElementById('selectedDestination').style.display = 'block';
    
    showDestinationOnMap();
}

// Hiển thị điểm đến trên bản đồ
function showDestinationOnMap() {
    if (!selectedDestination) return;
    
    clearMap();
    
    const marker = L.marker([selectedDestination.lat, selectedDestination.lng])
        .addTo(map)
        .bindPopup(`<b>Điểm đến</b><br>${selectedDestination.name}<br>Tọa độ: ${selectedDestination.lat.toFixed(6)}, ${selectedDestination.lng.toFixed(6)}`);
    
    routeMarkers.push(marker);
    map.setView([selectedDestination.lat, selectedDestination.lng], 13);
}



// Hiển thị kết quả định tuyến (đã đơn giản hóa)
function displayRouteResult(vehicle, routes) {
    const resultDiv = document.getElementById('routeResult');
    let html = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">🚗 Route for vehicle ${vehicle.license_plate}</h3>
            <p style="margin: 5px 0; opacity: 0.9;">👤 User: ${vehicle.user_id}</p>
            <p style="margin: 5px 0; opacity: 0.9;">📍 Destination: ${selectedDestination.name}</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
            <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">🗺️ Available Routes</h4>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Choose the most suitable route for your journey</p>
        </div>
    `;
    
    const routeIcons = ['🏃', '🚶', '🛤️'];
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];
    
    routes.forEach((route, index) => {
        const isRecommended = index === 0;
        html += `
            <div style="background: white; border: ${isRecommended ? '3px solid #10b981' : '2px solid #e5e7eb'}; margin: 15px 0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease; position: relative;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.1)'">
                
                ${isRecommended ? `<div style="background: linear-gradient(90deg, #10b981, #059669); color: white; padding: 8px 15px; font-size: 12px; font-weight: 600; text-align: center; letter-spacing: 0.5px;">⭐ RECOMMENDED ROUTE</div>` : ''}
                
                <div style="padding: 20px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                        <h4 style="color: #1e293b; margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">${routeIcons[index] || '🛣️'} ${route.type}</h4>
                        <div style="width: 20px; height: 20px; border-radius: 50%; background: ${route.color}; box-shadow: 0 2px 8px ${route.color}40;"></div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; text-align: center;">
                            <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">DISTANCE</div>
                            <div style="color: #1e293b; font-size: 20px; font-weight: 700;">${route.distance.toFixed(1)} <span style="font-size: 14px; color: #64748b;">km</span></div>
                        </div>
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; text-align: center;">
                            <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">TIME</div>
                            <div style="color: #1e293b; font-size: 20px; font-weight: 700;">${route.estimated_time} <span style="font-size: 14px; color: #64748b;">minutes</span></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button onclick="selectRoute(${index})" style="background: ${gradients[index] || gradients[0]}; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 14px; flex: 1; min-width: 140px; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">✅ Select this route</button>
                        <button onclick="showRouteOnMap(${index})" style="background: white; color: ${route.color}; border: 2px solid ${route.color}; padding: 12px 20px; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 14px; flex: 1; min-width: 140px; transition: all 0.2s ease;" onmouseover="this.style.background='${route.color}'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='${route.color}'">🗺️ View on map</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `<div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 15px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #f59e0b;"><p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">💡 <strong>Tip:</strong> The recommended route is usually the shortest and fastest. Click on the map to view detailed route information.</p></div>`;
    
    resultDiv.innerHTML = html;
    showAllRoutesOnMap(routes);
}

// Chọn tuyến đường
function selectRoute(routeIndex) {
    const route = currentRoutes[routeIndex];
    if (route) {
        // Create a prettier notification
        const notification = document.createElement('div');
        notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3); z-index: 10000; font-weight: 600; max-width: 300px; animation: slideIn 0.3s ease;`;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="font-size: 20px;">✅</div>
                <div style="font-size: 16px;">Route selected!</div>
            </div>
            <div style="font-size: 14px; opacity: 0.9;">${route.type}<br>📏 ${route.distance.toFixed(1)} km • ⏱️ ${route.estimated_time} minutes</div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
        
        showRouteOnMap(routeIndex);
    }
}

// Xóa tất cả markers và lines trên bản đồ
function clearMap() {
    routeMarkers.forEach(marker => map.removeLayer(marker));
    routeLines.forEach(line => map.removeLayer(line));
    routeMarkers = [];
    routeLines = [];
}

// Hiển thị tất cả tuyến đường trên bản đồ
function showAllRoutesOnMap(routes) {
    clearMap();
    
    routes.forEach((route, routeIndex) => {
        const polyline = L.polyline(route.coordinates, {
            color: route.color,
            weight: 5,
            opacity: 0.9,
            dashArray: routeIndex === 0 ? null : '10, 5'
        }).addTo(map);
        
        routeLines.push(polyline);
        
        const isRecommended = routeIndex === 0;
        polyline.bindPopup(`
            <div style="min-width: 250px; font-family: Arial, sans-serif;">
                ${isRecommended ? `<div style="background: linear-gradient(90deg, #10b981, #059669); color: white; padding: 8px 12px; margin: -10px -10px 10px -10px; font-size: 11px; font-weight: 600; text-align: center; letter-spacing: 0.5px;">⭐ TUYẾN ĐỀ XUẤT</div>` : ''}
                
                <h4 style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${route.color};"></div>
                    ${route.type}
                </h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div style="text-align: center; background: #f8fafc; padding: 8px; border-radius: 6px;">
                        <div style="color: #64748b; font-size: 11px;">KHOẢNG CÁCH</div>
                        <div style="color: #1e293b; font-weight: 700; font-size: 14px;">${route.distance.toFixed(1)} km</div>
                    </div>
                    <div style="text-align: center; background: #f8fafc; padding: 8px; border-radius: 6px;">
                        <div style="color: #64748b; font-size: 11px;">THỜI GIAN</div>
                        <div style="color: #1e293b; font-weight: 700; font-size: 14px;">${route.estimated_time} phút</div>
                    </div>
                </div>
                
                <button onclick="selectRoute(${routeIndex})" style="background: linear-gradient(135deg, ${route.color}, ${route.color}dd); color: white; border: none; padding: 10px 16px; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 13px; width: 100%; transition: all 0.2s ease;">✅ Chọn tuyến này</button>
            </div>
        `);
        
        // Cải thiện markers
        if (route.coordinates.length > 0) {
            const startIcon = L.divIcon({
                html: `<div style="background: linear-gradient(135deg, #10b981, #059669); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); border: 3px solid white;">🚗</div>`,
                className: '',
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });
            
            const endIcon = L.divIcon({
                html: `<div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); border: 3px solid white;">🏁</div>`,
                className: '',
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });
            
            const startMarker = L.marker(route.coordinates[0], {icon: startIcon})
                .addTo(map)
                .bindPopup(`<div style="text-align: center; font-weight: 600; color: #10b981;">🚗 Điểm xuất phát<br><small style="color: #64748b;">Vị trí xe hiện tại</small></div>`);
            
            const endMarker = L.marker(route.coordinates[route.coordinates.length - 1], {icon: endIcon})
                .addTo(map)
                .bindPopup(`<div style="text-align: center; font-weight: 600; color: #ef4444;">🏁 Điểm đến<br><small style="color: #64748b;">${selectedDestination.name}</small></div>`);
            
            routeMarkers.push(startMarker, endMarker);
        }
    });
    
    // Fit map để hiển thị tất cả tuyến đường
    if (routes.length > 0 && routeLines.length > 0) {
        const group = new L.featureGroup(routeLines);
        map.fitBounds(group.getBounds(), {padding: [20, 20], maxZoom: 10});
    }
}
// Hiển thị một tuyến đường cụ thể trên bản đồ
function showRouteOnMap(routeIndex) {
    if (!currentRoutes || !currentRoutes[routeIndex]) {
        alert('Không tìm thấy tuyến đường');
        return;
    }
    
    const route = currentRoutes[routeIndex];
    clearMap();
    
    const polyline = L.polyline(route.coordinates, {
        color: route.color,
        weight: 6,
        opacity: 1
    }).addTo(map);
    
    routeLines.push(polyline);
    
    // Thêm markers
    if (route.coordinates.length > 0) {
        const startMarker = L.marker(route.coordinates[0])
            .addTo(map)
            .bindPopup('Điểm xuất phát');
        
        const endMarker = L.marker(route.coordinates[route.coordinates.length - 1])
            .addTo(map)
            .bindPopup('Điểm đến');
        
        routeMarkers.push(startMarker, endMarker);
    }
    
    // Fit map bounds
    const group = new L.featureGroup(routeLines);
    map.fitBounds(group.getBounds().pad(0.1));
    
    // Hiển thị thông tin tuyến đường
    polyline.bindPopup(`
        <div>
            <h3>${route.type}</h3>
            <p><strong>Khoảng cách:</strong> ${route.distance.toFixed(1)} km</p>
            <p><strong>Thời gian:</strong> ${route.estimated_time} phút</p>
            <button onclick="selectRoute(${routeIndex})" style="background: ${route.color}; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                Chọn tuyến này
            </button>
        </div>
    `).openPopup();
}


















