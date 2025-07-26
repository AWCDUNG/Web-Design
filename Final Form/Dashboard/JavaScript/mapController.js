// Dashboard/JavaScript/mapController.js
class MapController {
    // Initialize map
    static initialize() {
        map = L.map('map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
        L.tileLayer(MAP_CONFIG.tileUrl, {
            attribution: MAP_CONFIG.attribution,
            maxZoom: MAP_CONFIG.maxZoom
        }).addTo(map);

        // Setup map event listeners
        map.on('click', e => this.addMapMarker(e.latlng));

        // Initialize API data markers array
        window.apiMarkers = [];

        // Load API data on initialization
        this.loadApiData();

        // Set up auto-refresh every 30 seconds
        setInterval(() => this.loadApiData(), 30000);
    }

    // Add marker on map click
    static addMapMarker(latlng) {
        const marker = L.marker(latlng).addTo(map).bindPopup(`
            <div style="font-family: inherit;">
                <h4>📍 Vị trí mới</h4>
                <p>Vĩ độ: ${latlng.lat.toFixed(4)}<br>Kinh độ: ${latlng.lng.toFixed(4)}</p>
                <button onclick="map.removeLayer(this.closest('.leaflet-popup')._source)"
                         style="margin-top: 5px; padding: 5px 10px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Xóa điểm
                </button>
            </div>
        `).openPopup();
    }

    // Load data from API and display as red dots
    static async loadApiData() {
        try {
            const response = await fetch('https://smartsensingapp.phenikaa-uni.edu.vn/eproject_get_data.php');
            const result = await response.json();

            if (result.status === 'success' && result.data) {
                // Clear existing API markers
                this.clearApiMarkers();

                // Add new markers for each data point
                result.data.forEach(device => {
                    this.addApiMarker(device);
                });

                console.log(`Loaded ${result.data.length} devices from API`);
            }
        } catch (error) {
            console.error('Error loading API data:', error);
        }
    }

    // Add API marker (red dot)
    static addApiMarker(device) {
    const lat = parseFloat(device.Latitude);
    const lng = parseFloat(device.Longitude);

    // Format coordinates with dots as thousand separators
    const formatCoordinate = (coord) => {
        return coord.toFixed(6).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Determine marker color based on status
    let markerColor = '#e74c3c'; // Default red
    if (device.status === 'Stable') {
        markerColor = '#27ae60'; // Green for stable
    } else if (device.flame_detected === '1' || device.light_leak_detected === '1') {
        markerColor = '#e67e22'; // Orange for warnings
    }

    // Create compact circular marker icon
    const compactIcon = L.divIcon({
        className: 'api-marker-compact',
        html: `
            <div style="
                width: 35px;
                height: 35px;
                background-color: ${markerColor};
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                position: relative;
                animation: markerPulse 2s infinite;
            ">
                🚛
            </div>
            <div style="
                position: absolute;
                top: 40px;
                left: 50%;
                transform: translateX(-50%);
                background: ${markerColor};
                color: white;
                padding: 2px 6px;
                border-radius: 8px;
                font-size: 9px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                border: 1px solid white;
                min-width: 40px;
                text-align: center;
            ">
                ${device.device_id}
            </div>
            <style>
                @keyframes markerPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                    100% { transform: scale(1); }
                }
            </style>
        `,
        iconSize: [40, 55],
        iconAnchor: [20, 20]
    });

    // Create marker with complete popup
    const marker = L.marker([lat, lng], { icon: compactIcon })
        .addTo(map)
        .bindPopup(`
            <div style="font-family: inherit; min-width: 270px; font-size: 12px;">
                <h4 style="margin: 0 0 8px 0; color: ${markerColor}; text-align: center; font-size: 14px;">
                    🚛 ${device.device_id}
                </h4>
                
                <!-- Basic Info -->
                <div style="background: #f8f9fa; padding: 6px; border-radius: 4px; margin-bottom: 6px;">
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; font-size: 11px;">
                        <strong>👤 User:</strong><span>${device.user_id}</span>
                        <strong>🚗 License Plate:</strong><span style="font-weight: bold;">${device.license_plate}</span>
                        <strong>📍 Status:</strong><span style="color: ${device.status === 'Stable' ? '#27ae60' : '#e74c3c'}; font-weight: bold;">${device.status}</span>
                        <strong>⚡ Speed:</strong><span style="color: ${parseFloat(device.Speed) > 50 ? '#e74c3c' : '#27ae60'}; font-weight: bold;">${device.Speed} km/h</span>
                    </div>
                </div>
                
                <!-- Coordinates -->
                <div style="background: #e3f2fd; padding: 6px; border-radius: 4px; margin-bottom: 6px; border: 1px solid #2196f3;">
                    <div style="text-align: center; color: #1976d2; font-weight: bold; font-size: 11px; margin-bottom: 3px;">🌍 GPS COORDINATES</div>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 3px 6px; font-size: 10px;">
                        <span style="color: #1976d2; font-weight: bold;">Latitude:</span><span style="font-family: monospace; font-weight: bold;">${lat.toFixed(6)}</span>
                        <span style="color: #1976d2; font-weight: bold;">Longitude:</span><span style="font-family: monospace; font-weight: bold;">${lng.toFixed(6)}</span>
                    </div>
                </div>
                
                <!-- Environmental Data -->
                <div style="background: #f0f8f0; padding: 6px; border-radius: 4px; margin-bottom: 6px;">
                    <div style="color: #27ae60; font-weight: bold; font-size: 11px; margin-bottom: 3px;">🌡️ ENVIRONMENTAL DATA</div>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 3px 6px; font-size: 10px;">
                        <span><strong>🌡️ Temperature:</strong></span><span style="color: ${parseFloat(device.Temperature) > 35 ? '#e74c3c' : '#27ae60'};">${device.Temperature}°C</span>
                        <span><strong>💧 Humidity:</strong></span><span>${device.Humidity}%</span>
                        <span><strong>📊 Pressure:</strong></span><span>${device.Pressure} hPa</span>
                    </div>
                </div>
                
                <!-- Air Quality -->
                <div style="background: #fff3e0; padding: 6px; border-radius: 4px; margin-bottom: 6px;">
                    <div style="color: #ff9800; font-weight: bold; font-size: 11px; margin-bottom: 3px;">🌫️ AIR QUALITY</div>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 3px 6px; font-size: 10px;">
                        <span><strong>🌫️ PM2.5:</strong></span><span style="color: ${parseFloat(device.Pm25) > 50 ? '#e74c3c' : '#27ae60'};">${device.Pm25} μg/m³</span>
                        <span><strong>🌫️ PM10:</strong></span><span style="color: ${parseFloat(device.Pm10) > 100 ? '#e74c3c' : '#27ae60'};">${device.Pm10} μg/m³</span>
                        <span><strong>☁️ CO:</strong></span><span>${device.CoGas} ppm</span>
                    </div>
                </div>
                
                <!-- Motion & Safety -->
                <div style="background: #f3e5f5; padding: 6px; border-radius: 4px; margin-bottom: 6px;">
                    <div style="color: #9c27b0; font-weight: bold; font-size: 11px; margin-bottom: 3px;">🚗 MOTION & SAFETY</div>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 3px 6px; font-size: 10px;">
                        <span><strong>📈 Acceleration:</strong></span><span>${device.acceleration} m/s²</span>
                        <span><strong>📐 Tilt Angle:</strong></span><span>${device.tilt_angle}°</span>
                        <span><strong>🔥 Flame Detected:</strong></span><span style="color: ${device.flame_detected === '1' ? '#e74c3c' : '#27ae60'}; font-weight: bold;">${device.flame_detected === '1' ? '⚠️ Yes' : '✅ No'}</span>
                        <span><strong>💡 Light Leak:</strong></span><span style="color: ${device.light_leak_detected === '1' ? '#e74c3c' : '#27ae60'}; font-weight: bold;">${device.light_leak_detected === '1' ? '⚠️ Yes' : '✅ No'}</span>
                    </div>
                </div>
                
                <!-- Timestamp -->
                <div style="text-align: center; font-size: 10px; color: #666; padding: 4px; background: #f8f9fa; border-radius: 4px;">
                    <strong>🕒 Updated:</strong> ${new Date(device.created_at).toLocaleString('en-US')}
                </div>
            </div>
        `, {
            maxWidth: 300,
            className: 'compact-popup'
        });

    // Add minimal CSS for popup
    if (!document.getElementById('compact-popup-style')) {
        const style = document.createElement('style');
        style.id = 'compact-popup-style';
        style.textContent = `
            .compact-popup .leaflet-popup-content-wrapper {
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
            .compact-popup .leaflet-popup-content {
                margin: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    // Add to API markers array for management
    window.apiMarkers.push(marker);
}
    // Clear all API markers
    static clearApiMarkers() {
        if (window.apiMarkers) {
            window.apiMarkers.forEach(marker => {
                map.removeLayer(marker);
            });
            window.apiMarkers = [];
        }
    }

    // Center map to default position
    static centerMap() {
        map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
        map.closePopup();
    }

    // Toggle restricted routes visibility
    static toggleRestrictedRoutes() {
        showingRestrictedRoutes = !showingRestrictedRoutes;
        const btn = document.getElementById('restrictedBtn');

        restrictedRoutes.forEach(route => {
            showingRestrictedRoutes ? map.addLayer(routeLayers[route.id]) : map.removeLayer(routeLayers[route.id]);
        });

        btn.classList.toggle('active', showingRestrictedRoutes);
        btn.textContent = showingRestrictedRoutes ? '🚫 Hide Restricted' : '🚫 Show Restricted';
    }

    // Toggle vehicles visibility
    static toggleVehicles() {
        showingVehicles = !showingVehicles;
        const btn = document.getElementById('vehiclesBtn');

        vehicleMarkers.forEach(marker => {
            showingVehicles ? map.addLayer(marker) : map.removeLayer(marker);
        });

        btn.classList.toggle('active', showingVehicles);
        btn.textContent = showingVehicles ? '🚛 Hide Vehicles' : '🚛 Show Vehicles';
    }

    // Toggle API data visibility
    static toggleApiData() {
        window.showingApiData = !window.showingApiData;
        const btn = document.getElementById('apiDataBtn');

        window.apiMarkers.forEach(marker => {
            window.showingApiData ? map.addLayer(marker) : map.removeLayer(marker);
        });

        btn.classList.toggle('active', window.showingApiData);
        btn.textContent = window.showingApiData ? '🔴 Hide API Data' : '🔴 Show API Data';
    }

    // Refresh API data manually
    static refreshApiData() {
        console.log('Refreshing API data...');
        this.loadApiData();
    }
}
    // static addApiMarker(device) {
    //     const lat = parseFloat(device.Latitude);
    //     const lng = parseFloat(device.Longitude);

    //     // Create custom red dot icon (larger size)
    //     const redDotIcon = L.divIcon({
    //         className: 'api-marker',
    //         html: '<div style="width: 20px; height: 20px; background-color: #e74c3c; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>',
    //         iconSize: [20, 20],
    //         iconAnchor: [10, 10]
    //     });

    //     // Create marker with popup
    //     const marker = L.marker([lat, lng], { icon: redDotIcon })
    //         .addTo(map)
    //         .bindPopup(`
    //             <div style="font-family: inherit; min-width: 250px;">
    //                 <h4 style="margin: 0 0 10px 0; color: #e74c3c;">🚛 ${device.device_id}</h4>
    //                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 12px;">
    //                     <div><strong>Người dùng:</strong></div>
    //                     <div>${device.user_id}</div>
                        
    //                     <div><strong>Biển số:</strong></div>
    //                     <div>${device.license_plate}</div>
                        
    //                     <div><strong>Trạng thái:</strong></div>
    //                     <div style="color: ${device.status === 'Ổn định' ? '#27ae60' : '#e74c3c'};">${device.status}</div>
                        
    //                     <div><strong>Tốc độ:</strong></div>
    //                     <div>${device.Speed} km/h</div>
                        
    //                     <div><strong>Vĩ độ:</strong></div>
    //                     <div>${lat.toFixed(6)}</div>
                        
    //                     <div><strong>Kinh độ:</strong></div>
    //                     <div>${lng.toFixed(6)}</div>
                        
    //                     <div><strong>Nhiệt độ:</strong></div>
    //                     <div>${device.Temperature}°C</div>
                        
    //                     <div><strong>Độ ẩm:</strong></div>
    //                     <div>${device.Humidity}%</div>
                        
    //                     <div><strong>PM2.5:</strong></div>
    //                     <div>${device.Pm25} μg/m³</div>
                        
    //                     <div><strong>PM10:</strong></div>
    //                     <div>${device.Pm10} μg/m³</div>
                        
    //                     <div><strong>CO:</strong></div>
    //                     <div>${device.CoGas} ppm</div>
                        
    //                     <div><strong>Áp suất:</strong></div>
    //                     <div>${device.Pressure} hPa</div>
                        
    //                     <div><strong>Gia tốc:</strong></div>
    //                     <div>${device.acceleration} m/s²</div>
                        
    //                     <div><strong>Góc nghiêng:</strong></div>
    //                     <div>${device.tilt_angle}°</div>
                        
    //                     <div><strong>Cảnh báo lửa:</strong></div>
    //                     <div style="color: ${device.flame_detected === '1' ? '#e74c3c' : '#27ae60'};">
    //                         ${device.flame_detected === '1' ? '⚠️ Có' : '✅ Không'}
    //                     </div>
                        
    //                     <div><strong>Rò rỉ ánh sáng:</strong></div>
    //                     <div style="color: ${device.light_leak_detected === '1' ? '#e74c3c' : '#27ae60'};">
    //                         ${device.light_leak_detected === '1' ? '⚠️ Có' : '✅ Không'}
    //                     </div>
                        
    //                     <div><strong>Cập nhật:</strong></div>
    //                     <div>${new Date(device.created_at).toLocaleString('vi-VN')}</div>
    //                 </div>
    //             </div>
    //         `);

    //     // Add to API markers array for management
    //     window.apiMarkers.push(marker);
    // }