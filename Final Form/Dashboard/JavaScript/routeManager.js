class RouteManager {
    static async loadRoutes() {
        // Dữ liệu tuyến đường hạn chế (8 tuyến)
        // Restricted route data (8 routes)
            const restrictedData = [
            { id: 'A3D', name: 'Route A3D - Ho Chi Minh City District 1', startPoint: [10.7769, 106.7009], endPoint: [10.7831, 106.6958], waypoints: [] },
            { id: 'A4B', name: 'Route A4B - Hanoi Hoan Kiem', startPoint: [21.0285, 105.8542], endPoint: [21.0350, 105.8650], waypoints: [] },
            { id: 'A5B', name: 'Route A5B - Da Nang Downtown', startPoint: [16.0544, 108.2022], endPoint: [16.0678, 108.2208], waypoints: [] },
            { id: 'A6B', name: 'Route A6B - Can Tho Downtown', startPoint: [10.0452, 105.7469], endPoint: [10.0378, 105.7706], waypoints: [] },
            { id: 'N4', name: 'N4 - Perfume River Port', startPoint: [16.4674, 107.5906], endPoint: [16.4584, 107.5531], waypoints: [] },
            { id: 'A7C', name: 'Route A7C - Hai Phong Downtown', startPoint: [20.8449, 106.6881], endPoint: [20.8500, 106.6950], waypoints: [] },
            { id: 'A8D', name: 'Route A8D - Nha Trang Coastal', startPoint: [12.2388, 109.1967], endPoint: [12.2441, 109.1946], waypoints: [] },
            { id: 'A9E', name: 'Route A9E - Vung Tau Port', startPoint: [10.3460, 107.0840], endPoint: [10.3292, 107.0927], waypoints: [] }
];

// NRHM preferred route data (8 routes)
const preferredData = [
            { id: 'N1', name: 'N1 - Ho Chi Minh City District 7', startPoint: [10.7379, 106.7217], endPoint: [10.7308, 106.7441], waypoints: [] },
            { id: 'N2', name: 'N2 - Hanoi Cau Giay', startPoint: [21.0500, 105.8700], endPoint: [21.0580, 105.8780], waypoints: [] },
            { id: 'N3', name: 'N3 - Da Nang Hai Chau', startPoint: [16.0471, 108.2068], endPoint: [16.0598, 108.2237], waypoints: [] },
            { id: 'N5', name: 'N5 - Nha Trang Coastal', startPoint: [12.2388, 109.1967], endPoint: [12.2441, 109.1946], waypoints: [] },
            { id: 'N6', name: 'N6 - Vung Tau Seaport', startPoint: [10.3460, 107.0840], endPoint: [10.3292, 107.0927], waypoints: [] },
            { id: 'N7', name: 'N7 - Quy Nhon Downtown', startPoint: [13.7563, 109.2177], endPoint: [13.7649, 109.2304], waypoints: [] },
            { id: 'N8', name: 'N8 - Trang Tien Bridge', startPoint: [16.4674, 107.5906], endPoint: [16.4669, 107.5790], waypoints: [] },
            { id: 'N9', name: 'N9 - Hai Phong Port', startPoint: [20.8449, 106.6881], endPoint: [20.8380, 106.6920], waypoints: [] }
];

        // Dữ liệu tuyến đường tỉnh lộ (9 tuyến)
        const provincialData = [
            { id: 'PR101', name: 'PR101 - Hanoi-Hai Phong', startPoint: [21.0285, 105.8542], endPoint: [20.8449, 106.6881], waypoints: [] },
            { id: 'PR102', name: 'PR102 - Hanoi-Thai Nguyen', startPoint: [21.0285, 105.8542], endPoint: [21.5944, 105.8480], waypoints: [] },
            { id: 'PR103', name: 'PR103 - Ho Chi Minh City-Can Tho', startPoint: [10.8231, 106.6297], endPoint: [10.0452, 105.7469], waypoints: [] },
            { id: 'PR104', name: 'PR104 - Ho Chi Minh City-Vung Tau', startPoint: [10.8231, 106.6297], endPoint: [10.4113, 107.1365], waypoints: [] },
            { id: 'PR105', name: 'PR105 - Da Nang-Hue', startPoint: [16.0544, 108.2022], endPoint: [16.4637, 107.5909], waypoints: [] },
            { id: 'PR106', name: 'PR106 - Da Nang-Quy Nhon', startPoint: [16.0544, 108.2022], endPoint: [13.7564, 109.2190], waypoints: [] },
            { id: 'PR107', name: 'PR107 - Nha Trang-Da Lat', startPoint: [12.2388, 109.1967], endPoint: [11.9404, 108.4583], waypoints: [] },
            { id: 'PR108', name: 'Route A8D - Bắc Giang đến Biên Hòa', startPoint: [21.2810, 106.1974], endPoint: [10.9447, 106.8243], waypoints: [] },
            { id: 'PR109', name: 'Route A9E - Pleiku thành phố', startPoint: [13.9833, 108.0000], endPoint: [13.9900, 108.0100], waypoints: [] }
        ];

        // Tạo các lớp tuyến đường thực tế từ dữ liệu
        const allRoutes = [...restrictedData, ...preferredData, ...provincialData];
        for (const route of allRoutes) {
            const routeType = this.getRouteType(route.id);
            await this.createRealRouteLayer(route, routeType);
        }

        // Lưu trữ dữ liệu tuyến đường vào biến toàn cục
        window.restrictedRoutes = restrictedData;
        window.preferredRoutes = preferredData;
        window.provincialRoutes = provincialData;
        
        console.log(`Loaded ${restrictedData.length} restricted routes`);
        console.log(`Loaded ${preferredData.length} preferred routes`);
        console.log(`Loaded ${provincialData.length} provincial routes`);
    }

    // Xác định loại tuyến đường dựa trên ID
    static getRouteType(routeId) {
        if (routeId.startsWith('A') || routeId.startsWith('N4')) return 'restricted';
        if (routeId.startsWith('N')) return 'preferred';
        if (routeId.startsWith('PR')) return 'provincial';
        return 'preferred';
    }

    // Lấy kiểu dáng tuyến đường dựa trên loại và trạng thái highlight
    static getRouteStyle(routeType, isHighlighted = false) {
        let color;
        switch (routeType) {
            case 'restricted':
                color = '#FF4757';  // Màu đỏ cho tuyến đường hạn chế
                break;
            case 'preferred':
                color = '#20BF55';  // Màu xanh lá cho tuyến đường ưu tiên
                break;
            case 'provincial':
                color = '#2C35E0';  // Màu xanh dương cho tuyến đường tỉnh lộ
                break;
            default:
                color = '#2ED573';  // Mặc định là màu xanh lá
        }

        // Cấu hình kiểu dáng tuyến đường
        const baseStyle = {
            weight: isHighlighted ? 8 : 5,
            opacity: isHighlighted ? 1 : 0.85,
            lineCap: 'round',
            lineJoin: 'round',
            smoothFactor: 1.5,
            interactive: true,
            color: color,
            className: `${routeType}-route`
        };

        // Nếu tuyến đường được highlight, thay đổi màu sắc và z-index
        if (isHighlighted) {
            switch (routeType) {
                case 'restricted':
                    baseStyle.color = '#FF3742';
                    break;
                case 'preferred':
                    baseStyle.color = '#20BF55';
                    break;
                case 'provincial':
                    baseStyle.color = '#2C35E0';
                    break;
            }
            baseStyle.zIndexOffset = 1000;
        }

        return baseStyle;
    }

    // Tạo biểu tượng đánh dấu điểm đầu/cuối tuyến đường
    static createEndpointMarker(isStart = true, routeType = 'preferred') {
        const colors = {
            'restricted': '#FF4757',
            'preferred': '#2ED573',
            'provincial': '#3742FA'
        };

        const color = colors[routeType] || '#2ED573';
        const icon = isStart ? '🚀' : '🎯';
        const label = isStart ? 'Start' : 'End';

        return L.divIcon({
            className: 'endpoint-marker',
            html: `
            <style>
                .endpoint-container:hover .endpoint-tooltip {
                    opacity: 1 !important;
                }
            </style>
            <div class="endpoint-container" style="background: ${color};border: 3px solid white;border-radius: 50%;width: 24px;height: 24px;
                display: flex;align-items: center;justify-content: center;font-size: 12px;box-shadow: 0 3px 10px rgba(0,0,0,0.3);position: relative;cursor: pointer;">
                ${icon}
                <div class="endpoint-tooltip" style="position: absolute;top: -30px;left: 50%;transform: translateX(-50%);background: rgba(0,0,0,0.8);color: white;padding: 4px 8px;
                    border-radius: 4px;font-size: 11px;white-space: nowrap;opacity: 0;transition: opacity 0.3s ease;pointer-events: none;z-index: 1000;">
                ${label}
                    <div style="position: absolute;top: 100%;left: 50%;transform: translateX(-50%);border: 4px solid transparent;border-left-color: transparent;
                    border-right-color: transparent;border-top-color: rgba(0,0,0,0.8);border-bottom: none;
                    "></div>
                </div>
            </div>
        `,
            iconSize: [20, 20],
            iconAnchor: [12, 12]
        });
    }

    // Tính khoảng cách giữa hai điểm (sử dụng công thức Haversine)
    static getDistanceBetweenPoints(point1, point2) {
        const R = 6371e3;
        const φ1 = point1[0] * Math.PI / 180;
        const φ2 = point2[0] * Math.PI / 180;
        const Δφ = (point2[0] - point1[0]) * Math.PI / 180;
        const Δλ = (point2[1] - point1[1]) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Tạo lớp tuyến đường thực tế từ dữ liệu
static async createRealRouteLayer(route, routeType) {
        const style = this.getRouteStyle(routeType);
        let type, icon, description;

        switch (routeType) {
            case 'restricted':
                type = 'Restricted';
                icon = '⚠️';
                description = 'Restricted route - Prohibited for hazardous material transport';
                break;
            case 'preferred':
                type = 'NRHM Designated';
                icon = '🛣️';
                description = 'Designated route for hazardous material transport';
                break;
            case 'provincial':
                type = 'Provincial Route';
                icon = '🏛️';
                description = 'Provincial route - Allows hazardous material transport with permit';
                break;
        }

        try {
            const coords = [
                route.startPoint,
                ...route.waypoints,
                route.endPoint
            ].map(point => `${point[1]},${point[0]}`).join(';');

            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`
            );

            if (!response.ok) {
                throw new Error(`OSRM API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const osrmRoute = data.routes[0];
                const coordinates = osrmRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);

                route.coordinates = coordinates;
                route.distance = (osrmRoute.distance / 1000).toFixed(1);
                route.duration = Math.round(osrmRoute.duration / 60);

                const polyline = L.polyline(coordinates, style).addTo(map);

                const startMarker = L.marker(coordinates[0], {
                    icon: this.createEndpointMarker(true, routeType),
                    zIndexOffset: 100
                }).addTo(map);

                const endMarker = L.marker(coordinates[coordinates.length - 1], {
                    icon: this.createEndpointMarker(false, routeType),
                    zIndexOffset: 100
                }).addTo(map);

                const popupContent = `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-width: 320px; max-width: 380px;">
                        <div style="background: linear-gradient(135deg, ${style.color}dd, ${style.color}aa); color: white; margin: -15px -20px 15px -20px; padding: 20px; border-radius: 12px 12px 0 0;">
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                ${icon} ${route.name}
                            </h3>
                        </div>
                        <div style="padding: 0 5px;">
                            <div style="background: ${this.getBackgroundColor(routeType)}; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid ${style.color};">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                    <span style="background: ${style.color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                                        ${type.toUpperCase()}
                                    </span>
                                </div>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.6;">
                                    ${this.getRouteIcon(routeType)} ${description}
                                </p>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                                <div style="text-align: center; padding: 12px; background: #F9FAFB; border-radius: 8px;">
                                    <div style="font-size: 20px; font-weight: 700; color: ${style.color}; margin-bottom: 4px;">
                                        ${route.distance}
                                    </div>
                                    <div style="font-size: 11px; color: #6B7280; font-weight: 500;">KILOMETERS</div>
                                </div>
                                <div style="text-align: center; padding: 12px; background: #F9FAFB; border-radius: 8px;">
                                    <div style="font-size: 20px; font-weight: 700; color: ${style.color}; margin-bottom: 4px;">
                                        ${route.duration}
                                    </div>
                                    <div style="font-size: 11px; color: #6B7280; font-weight: 500;">MINUTES</div>
                                </div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #F3F4F6; border-radius: 8px; font-size: 12px;">
                                <div>
                                    <span style="color: #6B7280;">Route ID:</span>
                                    <span style="font-weight: 600; color: #374151; margin-left: 4px;">${route.id}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <div style="width: 8px; height: 8px; background: #10B981; border-radius: 50%; animation: pulse 2s infinite;"></div>
                                    <span style="color: #10B981; font-weight: 500;">Updated: 5 minutes ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Bind popup to polyline with custom content
                polyline.bindPopup(popupContent, {
                    maxWidth: 400,
                    className: 'custom-route-popup'
                });

                routeLayers[route.id] = {
                    polyline: polyline,
                    startMarker: startMarker,
                    endMarker: endMarker,
                    routeType: routeType,
                    setStyle: function (newStyle) {
                        this.polyline.setStyle(newStyle);
                    },
                    getBounds: function () {
                        return this.polyline.getBounds();
                    },
                    openPopup: function () {
                        this.polyline.openPopup();
                    }
                };

                console.log(`✅ Route ${route.id} loaded: ${route.distance}km, ${route.duration}min, ${coordinates.length} points`);
            } else {
                console.warn(`No route found for ${route.id}, using fallback`);
                this.createFallbackRoute(route, routeType);
            }
        } catch (error) {
            console.error(`Error loading route ${route.id}:`, error);
            this.createFallbackRoute(route, routeType);
        }
    }

    // Lấy màu nền cho popup dựa trên loại tuyến đường
    static getBackgroundColor(routeType) {
        switch (routeType) {
            case 'restricted':
                return '#FFF5F5';
            case 'preferred':
                return '#F0FDF4';
            case 'provincial':
                return '#F0F4FF';
            default:
                return '#F0FDF4';
        }
    }

    // Lấy biểu tượng cho loại tuyến đường
    static getRouteIcon(routeType) {
        switch (routeType) {
            case 'restricted':
                return '🚫';
            case 'preferred':
                return '✅';
            case 'provincial':
                return '📋';
            default:
                return '✅';
        }
    }

    // Tạo tuyến đường dự phòng nếu không tìm thấy tuyến đường thực tế
    static createFallbackRoute(route, routeType) {
        const style = this.getRouteStyle(routeType);
        let type, icon, description;

        switch (routeType) {
            case 'restricted':
                type = 'Restricted';
                icon = '⚠️';
                description = 'Tuyến đường hạn chế - Cấm xe chở hàng nguy hiểm';
                break;
            case 'preferred':
                type = 'NRHM Designated';
                icon = '🛣️';
                description = 'Tuyến đường được chỉ định cho xe chở hàng nguy hiểm';
                break;
            case 'provincial':
                type = 'Provincial Route';
                icon = '🏛️';
                description = 'Tuyến đường tỉnh lộ - Cho phép xe chở hàng nguy hiểm với giấy phép';
                break;
        }

        // Sử dụng tọa độ mặc định từ route để tạo tuyến đường dự phòng
        const fallbackCoords = [
            route.startPoint,
            ...route.waypoints,
            route.endPoint
        ];

        const polyline = L.polyline(fallbackCoords, style).addTo(map);

        const startMarker = L.marker(fallbackCoords[0], {
            icon: this.createEndpointMarker(true, routeType)
        }).addTo(map);

        const endMarker = L.marker(fallbackCoords[fallbackCoords.length - 1], {
            icon: this.createEndpointMarker(false, routeType)
        }).addTo(map);

        polyline.bindPopup(`
            <div style="font-family: 'Segoe UI', sans-serif; min-width: 280px;">
                <h4 style="color: ${style.color}; margin-bottom: 8px;">${icon} ${route.name}</h4>
                <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.4;">
                    <strong>${type} Route</strong><br>
                    ${description}
                </p>
                <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #eee; font-size: 11px; color: #888;">
                    ID: ${route.id} | Cập nhật: 5 phút trước
                </div>
            </div>
        `);

        routeLayers[route.id] = {
            polyline: polyline,
            startMarker: startMarker,
            endMarker: endMarker,
            routeType: routeType,
            setStyle: function (newStyle) {
                this.polyline.setStyle(newStyle);
            },
            getBounds: function () {
                return this.polyline.getBounds();
            },
            openPopup: function () {
                this.polyline.openPopup();
            }
        };
    }

    // Highlight a specific route by ID
    static highlightRoute(routeId) {
        document.querySelectorAll('.route-item').forEach(item => item.classList.remove('active'));
        if (event && event.target) {
            const routeItem = event.target.closest('.route-item');
            if (routeItem) routeItem.classList.add('active');
        }

        Object.keys(routeLayers).forEach(id => {
            const isTarget = id === routeId;
            const layer = routeLayers[id];
            const routeType = layer ? layer.routeType : this.getRouteType(id);

            if (layer && layer.setStyle) {
                const newStyle = this.getRouteStyle(routeType, isTarget);
                layer.setStyle(newStyle);

                if (isTarget) {
                    map.fitBounds(layer.getBounds(), {
                        padding: [30, 30],
                        maxZoom: 15,
                        animate: true,
                        duration: 0.8
                    });

                    setTimeout(() => {
                        layer.openPopup();
                    }, 800);

                    if (layer.startMarker && layer.endMarker) {
                        [layer.startMarker, layer.endMarker].forEach(marker => {
                            const element = marker.getElement();
                            if (element) {
                                element.style.animation = 'pulse 1.5s ease-in-out 3';
                            }
                        });
                    }
                }
            }
        });
        this.animateRoutePath(routeId);
    }

    // Reset all route styles to normal
    static resetRouteStyles() {
        document.querySelectorAll('.route-item').forEach(item => item.classList.remove('active'));

        Object.keys(routeLayers).forEach(id => {
            const layer = routeLayers[id];
            const routeType = layer ? layer.routeType : this.getRouteType(id);

            if (layer && layer.setStyle) {
                const normalStyle = this.getRouteStyle(routeType, false);
                layer.setStyle(normalStyle);
            }
        });

        map.closePopup();
    }

    // Get route information by ID
    static getRouteInfo(routeId) {
        const allRoutes = [
            ...(window.restrictedRoutes || []),
            ...(window.preferredRoutes || []),
            ...(window.provincialRoutes || [])
        ];
        return allRoutes.find(r => r.id === routeId) || null;
    }

    // Check if a route is restricted, preferred, or provincial
    static isRestrictedRoute(routeId) {
        return this.getRouteType(routeId) === 'restricted';
    }

    // Check if a route is a preferred route
    static isPreferredRoute(routeId) {
        return this.getRouteType(routeId) === 'preferred';
    }

    // Check if a route is a provincial route
    static isProvincialRoute(routeId) {
        return this.getRouteType(routeId) === 'provincial';
    }

    // Toggle visibility of a specific route by ID
    static toggleRouteVisibility(routeId, show = true) {
        const layer = routeLayers[routeId];
        if (layer) {
            if (show) {
                map.addLayer(layer.polyline);
                if (layer.startMarker) map.addLayer(layer.startMarker);
                if (layer.endMarker) map.addLayer(layer.endMarker);
            } else {
                map.removeLayer(layer.polyline);
                if (layer.startMarker) map.removeLayer(layer.startMarker);
                if (layer.endMarker) map.removeLayer(layer.endMarker);
            }
        }
    }

    // Toggle visibility of all routes of a specific type
    static toggleRoutesByType(routeType, show = true) {
        Object.keys(routeLayers).forEach(routeId => {
            const layer = routeLayers[routeId];
            if (layer && layer.routeType === routeType) {
                this.toggleRouteVisibility(routeId, show);
            }
        });
    }

    // Get all route IDs of a specific type
    static getAllRoutesByType(routeType) {
        return Object.keys(routeLayers).filter(routeId => {
            const layer = routeLayers[routeId];
            return layer && layer.routeType === routeType;
        });
    }

    static animateRoutePath(routeId) {
        const layer = routeLayers[routeId];
        if (!layer || !layer.polyline) return;

        const coordinates = layer.polyline.getLatLngs();
        
        // Tạo đường animation với nét đứt
        const animationLine = L.polyline(coordinates, {
            color: '#FFFFFF',           // Màu trắng cho đường animation
            weight: 6,// Độ dày nét vẽ
            opacity: 1, // Độ mờ
            dashArray: '20,10', // Nét đứt
            dashOffset: '0',    // Bắt đầu từ đầu nét đứt
            className: 'animated-route' // Thêm class để áp dụng CSS animation

        }).addTo(map);

        // Tạo CSS animation
        const style = document.createElement('style');
        style.innerHTML = `
            .animated-route {
                animation: dash 3s linear infinite;
            }
            @keyframes dash {
                0% { stroke-dashoffset: 30; }
                100% { stroke-dashoffset: 0; }
            }
        `;
        document.head.appendChild(style);

        // Xóa sau khi hoàn thành
        setTimeout(() => {
            if (map.hasLayer(animationLine)) {
                map.removeLayer(animationLine);
            }
            document.head.removeChild(style);
        }, 5000000000);
    }
}


// static async createRealRouteLayer(route, routeType) {
//         const style = this.getRouteStyle(routeType);
//         let type, icon, description;

//         switch (routeType) {
//             case 'restricted':
//                 type = 'Restricted';
//                 icon = '⚠️';
//                 description = 'Tuyến đường hạn chế - Cấm xe chở hàng nguy hiểm';
//                 break;
//             case 'preferred':
//                 type = 'NRHM Designated';
//                 icon = '🛣️';
//                 description = 'Tuyến đường được chỉ định cho xe chở hàng nguy hiểm';
//                 break;
//             case 'provincial':
//                 type = 'Provincial Route';
//                 icon = '🏛️';
//                 description = 'Tuyến đường tỉnh lộ - Cho phép xe chở hàng nguy hiểm với giấy phép';
//                 break;
//         }

//         try {
//             const coords = [
//                 route.startPoint,
//                 ...route.waypoints,
//                 route.endPoint
//             ].map(point => `${point[1]},${point[0]}`).join(';');

//             const response = await fetch(
//                 `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`
//             );

//             if (!response.ok) {
//                 throw new Error(`OSRM API error: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data.routes && data.routes.length > 0) {
//                 const osrmRoute = data.routes[0];
//                 const coordinates = osrmRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);

//                 route.coordinates = coordinates;
//                 route.distance = (osrmRoute.distance / 1000).toFixed(1);
//                 route.duration = Math.round(osrmRoute.duration / 60);

//                 const polyline = L.polyline(coordinates, style).addTo(map);

//                 const startMarker = L.marker(coordinates[0], {
//                     icon: this.createEndpointMarker(true, routeType),
//                     zIndexOffset: 100
//                 }).addTo(map);

//                 const endMarker = L.marker(coordinates[coordinates.length - 1], {
//                     icon: this.createEndpointMarker(false, routeType),
//                     zIndexOffset: 100
//                 }).addTo(map);

//                 const popupContent = `
//                     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-width: 320px; max-width: 380px;">
//                         <div style="background: linear-gradient(135deg, ${style.color}dd, ${style.color}aa); color: white; margin: -15px -20px 15px -20px; padding: 20px; border-radius: 12px 12px 0 0;">
//                             <h3 style="margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
//                                 ${icon} ${route.name}
//                             </h3>
//                         </div>
//                         <div style="padding: 0 5px;">
//                             <div style="background: ${this.getBackgroundColor(routeType)}; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid ${style.color};">
//                                 <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
//                                     <span style="background: ${style.color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
//                                         ${type.toUpperCase()}
//                                     </span>
//                                 </div>
//                                 <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.6;">
//                                     ${this.getRouteIcon(routeType)} ${description}
//                                 </p>
//                             </div>
//                             <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
//                                 <div style="text-align: center; padding: 12px; background: #F9FAFB; border-radius: 8px;">
//                                     <div style="font-size: 20px; font-weight: 700; color: ${style.color}; margin-bottom: 4px;">
//                                         ${route.distance}
//                                     </div>
//                                     <div style="font-size: 11px; color: #6B7280; font-weight: 500;">KILOMETERS</div>
//                                 </div>
//                                 <div style="text-align: center; padding: 12px; background: #F9FAFB; border-radius: 8px;">
//                                     <div style="font-size: 20px; font-weight: 700; color: ${style.color}; margin-bottom: 4px;">
//                                         ${route.duration}
//                                     </div>
//                                     <div style="font-size: 11px; color: #6B7280; font-weight: 500;">MINUTES</div>
//                                 </div>
//                             </div>
                            
//                             <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #F3F4F6; border-radius: 8px; font-size: 12px;">
//                                 <div>
//                                     <span style="color: #6B7280;">Route ID:</span>
//                                     <span style="font-weight: 600; color: #374151; margin-left: 4px;">${route.id}</span>
//                                 </div>
//                                 <div style="display: flex; align-items: center; gap: 4px;">
//                                     <div style="width: 8px; height: 8px; background: #10B981; border-radius: 50%; animation: pulse 2s infinite;"></div>
//                                     <span style="color: #10B981; font-weight: 500;">Cập nhật: 5 phút trước</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 `;

//                 // Bind popup to polyline with custom content
//                 polyline.bindPopup(popupContent, {
//                     maxWidth: 400,
//                     className: 'custom-route-popup'
//                 });

//                 routeLayers[route.id] = {
//                     polyline: polyline,
//                     startMarker: startMarker,
//                     endMarker: endMarker,
//                     routeType: routeType,
//                     setStyle: function (newStyle) {
//                         this.polyline.setStyle(newStyle);
//                     },
//                     getBounds: function () {
//                         return this.polyline.getBounds();
//                     },
//                     openPopup: function () {
//                         this.polyline.openPopup();
//                     }
//                 };

//                 console.log(`✅ Route ${route.id} loaded: ${route.distance}km, ${route.duration}min, ${coordinates.length} points`);
//             } else {
//                 console.warn(`No route found for ${route.id}, using fallback`);
//                 this.createFallbackRoute(route, routeType);
//             }
//         } catch (error) {
//             console.error(`Error loading route ${route.id}:`, error);
//             this.createFallbackRoute(route, routeType);
//         }
//     }