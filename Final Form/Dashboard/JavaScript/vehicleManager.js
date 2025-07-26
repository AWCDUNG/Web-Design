// vehicleManager.js - Quản lý phương tiện 6 thành phố lớn
// Load dữ liệu vehicles từ 6 thành phố lớn Việt Nam
// Tạo vehicle markers
// Popup thông tin vehicle
// Update vị trí real-time (chuẩn bị sẵn)

class VehicleManager {
    // Load all vehicles data from 6 major cities in Vietnam
    static loadVehicles() {
        // Đã tắt tính năng tạo marker - chỉ giữ data để tham khảo
        console.log('Vehicle data loaded - markers disabled');
    }



    // Create individual vehicle marker (giữ lại để backup)
    static createVehicleMarker(vehicle) {
        const statusColor = this.getStatusColor(vehicle.status);
        const marker = L.marker([vehicle.lat, vehicle.lng], {
            icon: L.divIcon({
                className: 'vehicle-marker',
                html: `<div style="background: ${statusColor}; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
                iconSize: [20, 20], 
                iconAnchor: [10, 10]
            })
        }).addTo(map);

        marker.bindPopup(this.createVehiclePopup(vehicle));
        vehicleMarkers.push(marker);
    }

    // Create vehicle popup content
    static createVehiclePopup(vehicle) {
        const statusColor = this.getStatusColor(vehicle.status);
        return `
            <div style="font-family: inherit; min-width: 200px;">
                <h4 style="margin-bottom: 10px; color: #2c3e50;">🚛 Xe ${vehicle.id}</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                    <div><strong>Thành phố:</strong> ${vehicle.city}</div>
                    <div><strong>Trạng thái:</strong> <span style="color: ${statusColor};">${this.getStatusVietnamese(vehicle.status)}</span></div>
                    <div><strong>Nhiên liệu:</strong> ${vehicle.fuel}%</div>
                    <div><strong>Hàng hóa:</strong> ${this.getCargoVietnamese(vehicle.cargo)}</div>
                    <div><strong>GPS:</strong> Hoạt động</div>
                </div>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
                    Cập nhật lần cuối: 2 phút trước
                </div>
            </div>
        `;
    }

    // Get status color
    static getStatusColor(status) {
        return STATUS_COLORS[status] || '#7f8c8d';
    }

    // Get Vietnamese status translation
    static getStatusVietnamese(status) {
        return TRANSLATIONS.status[status] || 'Không xác định';
    }

    // Get Vietnamese cargo translation
    static getCargoVietnamese(cargo) {
        return TRANSLATIONS.cargo[cargo] || cargo;
    }

    // Update vehicle position (for future real-time updates)
    static updateVehiclePosition(vehicleId, newLat, newLng) {
        const marker = vehicleMarkers.find(m => m.getPopup().getContent().includes(`Xe ${vehicleId}`));
        if (marker) {
            marker.setLatLng([newLat, newLng]);
        }
    }

    // Get vehicle by ID
    static getVehicleById(vehicleId) {
        return vehicleMarkers.find(m => m.getPopup().getContent().includes(`Xe ${vehicleId}`));
    }

    // Get vehicles by city
    static getVehiclesByCity(cityName) {
        return vehicleMarkers.filter(m => m.getPopup().getContent().includes(cityName));
    }

    // Get vehicle statistics by city
    static getVehicleStatsByCity() {
        const cities = ['Hà Nội', 'Hải Phòng', 'Thành phố Huế', 'Đà Nẵng', 'TP Hồ Chí Minh', 'Cần Thơ'];
        const stats = {};
        
        cities.forEach(city => {
            const cityVehicles = this.getVehiclesByCity(city);
            stats[city] = {
                total: cityVehicles.length,
                active: cityVehicles.filter(v => v.getPopup().getContent().includes('Đang vận chuyển')).length
            };
        });
        
        return stats;
    }

    // Batch update all vehicles to their respective city centers
    static resetVehiclesToCityCenters() {
        const cityCenters = {
            'HN': { lat: 21.0285, lng: 105.8542 },    // Hà Nội
            'HP': { lat: 20.8449, lng: 106.6881 },    // Hải Phòng
            'HUE': { lat: 16.4637, lng: 107.5909 },   // Huế
            'DN': { lat: 16.0544, lng: 108.2022 },    // Đà Nẵng
            'HCM': { lat: 10.7769, lng: 106.7009 },   // TP HCM
            'CT': { lat: 10.0452, lng: 105.7469 }     // Cần Thơ
        };

        Object.keys(cityCenters).forEach(cityCode => {
            for (let i = 1; i <= 5; i++) {
                const vehicleId = `${cityCode}${i.toString().padStart(3, '0')}`;
                const center = cityCenters[cityCode];
                // Add small random offset to avoid overlapping
                const offsetLat = center.lat + (Math.random() - 0.5) * 0.01;
                const offsetLng = center.lng + (Math.random() - 0.5) * 0.01;
                this.updateVehiclePosition(vehicleId, offsetLat, offsetLng);
            }
        });
    }
}


