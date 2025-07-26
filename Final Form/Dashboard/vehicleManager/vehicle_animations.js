// Simplified Vehicle Animation Effects
// File: vehicle_animations.js

// class VehicleAnimationManager {
//     constructor() {
//         this.activeLocationMarker = null;
//         this.initializeAnimations();
//     }

//     initializeAnimations() {
//         // Thêm CSS cho dấu chấm đỏ
//         this.addLocationMarkerStyles();
//     }

//     addLocationMarkerStyles() {
//         const style = document.createElement('style');
//         style.textContent = `
//             /* Location marker styles */
//             .location-marker {
//                 position: relative;
//                 z-index: 1000;
//             }

//             .location-marker-inner {
//                 width: 20px;
//                 height: 20px;
//                 background: #ff4141;
//                 border: 2px solid white;
//                 border-radius: 50%;
//                 box-shadow: 0 0 5px rgba(255, 65, 65, 0.6);
//             }
//         `;
//         document.head.appendChild(style);
//     }

//     async animateToVehicle(vehicle) {
//         // Di chuyển map đến vị trí xe
//         map.setView([vehicle.lat, vehicle.lng], 16);
        
//         // Hiển thị dấu chấm đỏ
//         this.createLocationMarker(vehicle);
        
//         // Tự động ẩn dấu chấm sau 10 giây
//         setTimeout(() => {
//             this.removeLocationMarker();
//         }, 10000000);
//     }

//     createLocationMarker(vehicle) {
//         // Xóa marker cũ nếu có
//         this.removeLocationMarker();
        
//         // Tạo marker mới
//         this.activeLocationMarker = L.marker([vehicle.lat, vehicle.lng], {
//             icon: L.divIcon({
//                 className: 'location-marker',
//                 html: `<div class="location-marker-inner"></div>`,
//                 iconSize: [20, 20],
//                 iconAnchor: [10, 10]
//             }),
//             zIndexOffset: 1000
//         }).addTo(map);
        
//         // Click để xóa marker
//         this.activeLocationMarker.on('click', () => {
//             this.removeLocationMarker();
//         });
//     }

//     removeLocationMarker() {
//         if (this.activeLocationMarker) {
//             map.removeLayer(this.activeLocationMarker);
//             this.activeLocationMarker = null;
//         }
//     }
// }

// // Khởi tạo animation manager
// const vehicleAnimationManager = new VehicleAnimationManager();

// // Override hàm selectVehicle để thêm dấu chấm đỏ
// const originalSelectVehicle = window.selectVehicle;
// window.selectVehicle = function(vehicle) {
//     // Hiển thị dấu chấm đỏ
//     vehicleAnimationManager.animateToVehicle(vehicle);
    
//     // Gọi hàm gốc
//     if (originalSelectVehicle) {
//         originalSelectVehicle(vehicle);
//     }
// };

// // Thêm phím tắt ESC để xóa dấu chấm
// document.addEventListener('keydown', function(e) {
//     if (e.key === 'Escape') {
//         vehicleAnimationManager.removeLocationMarker();
//     }
// });

// // Export
// window.VehicleAnimationManager = VehicleAnimationManager;
// window.vehicleAnimationManager = vehicleAnimationManager;


// Vehicle Animation Effects
// File: vehicle-animations.js

class VehicleAnimationManager {
    constructor() {
        this.activeLocationMarker = null;
        this.allLocationMarkers = []; // Lưu trữ tất cả markers
        this.animationInProgress = false;
        this.locationPulseInterval = null;
        this.initializeAnimations();
    }

    initializeAnimations() {
        // Thêm CSS animations vào head
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Location marker styles */
            .location-marker {
                position: relative;
                z-index: 1000;
            }

            .location-marker-inner {
                width: 40px;
                height: 40px;
                background: rgba(255, 65, 65, 0.8);
                border: 4px solid white;
                border-radius: 50%;
                position: relative;
                animation: locationPulse 2s ease-in-out infinite;
                box-shadow: 0 0 20px rgba(255, 65, 65, 0.6);
            }

            .location-marker-inner::before {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                border: 2px solid rgba(255, 65, 65, 0.4);
                border-radius: 50%;
                animation: locationRipple 2s ease-out infinite;
            }

            .location-marker-inner::after {
                content: '';
                position: absolute;
                top: -20px;
                left: -20px;
                right: -20px;
                bottom: -20px;
                border: 1px solid rgba(255, 65, 65, 0.2);
                border-radius: 50%;
                animation: locationRipple 2s ease-out infinite 0.5s;
            }

            @keyframes locationPulse {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            @keyframes locationRipple {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }

            /* Map transition effect */
            .leaflet-map-pane {
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Vehicle marker highlight */
            .vehicle-marker-highlight {
                transform: scale(1.5);
                transition: transform 0.3s ease;
                filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
            }

            /* Notification styles */
            .vehicle-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                transform: translateX(100%);
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 2000;
                font-weight: 500;
                backdrop-filter: blur(10px);
            }

            .vehicle-notification.show {
                transform: translateX(0);
            }

            .vehicle-notification::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                border-radius: 10px;
                pointer-events: none;
            }

            /* Loading animation */
            .map-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                background: rgba(255, 255, 255, 0.95);
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Vehicle item animation */
            .vehicle-item.selecting {
                transform: scale(1.02);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                border-left: 4px solid #3498db;
                transition: all 0.3s ease;
            }

            /* Map zoom animation */
            .map-zoom-animation {
                animation: mapZoomIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            @keyframes mapZoomIn {
                0% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    async animateToVehicle(vehicle) {
        if (this.animationInProgress) return;
        
        this.animationInProgress = true;
        
        try {
            // Hiển thị thông báo
            this.showVehicleNotification(vehicle);
            
            // Highlight vehicle item
            this.highlightVehicleItem(vehicle.id);
            
            // Show loading animation
            this.showMapLoading();
            
            // Animate map transition
            await this.animateMapTransition(vehicle);
            
            // Hide loading
            this.hideMapLoading();
            
            // Create location marker - GIỮ VĨNH VIỄN
            this.createLocationMarker(vehicle);
            
            // Highlight vehicle marker
            this.highlightVehicleMarker(vehicle);
            
            // ĐÃ LOẠI BỎ: Auto-hide location marker
            // setTimeout(() => {
            //     this.removeLocationMarker();
            // }, 10000);
            
        } catch (error) {
            console.error('Animation error:', error);
        } finally {
            this.animationInProgress = false;
        }
    }

    showVehicleNotification(vehicle) {
        const notification = document.createElement('div');
        notification.className = 'vehicle-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">🚛</div>
                <div>
                    <div style="font-size: 16px; font-weight: bold;">Xe ${vehicle.id}</div>
                    <div style="font-size: 14px; opacity: 0.9;">Đang điều hướng đến vị trí...</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }

    highlightVehicleItem(vehicleId) {
        // Remove previous highlights
        document.querySelectorAll('.vehicle-item.selecting').forEach(item => {
            item.classList.remove('selecting');
        });
        
        // Add highlight to selected item
        const selectedItem = document.querySelector(`[data-vehicle-id="${vehicleId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selecting');
            
            // Remove highlight after animation
            setTimeout(() => {
                selectedItem.classList.remove('selecting');
            }, 2000);
        }
    }

    showMapLoading() {
        const loading = document.createElement('div');
        loading.className = 'map-loading';
        loading.id = 'map-loading';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <div style="text-align: center; color: #666;">Đang điều hướng...</div>
        `;
        
        document.getElementById('map').appendChild(loading);
    }

    hideMapLoading() {
        const loading = document.getElementById('map-loading');
        if (loading) {
            loading.remove();
        }
    }

    async animateMapTransition(vehicle) {
        return new Promise((resolve) => {
            // Get current view
            const currentCenter = map.getCenter();
            const currentZoom = map.getZoom();
            
            // Calculate intermediate points for smooth animation
            const steps = 20;
            const latDiff = vehicle.lat - currentCenter.lat;
            const lngDiff = vehicle.lng - currentCenter.lng;
            const targetZoom = 16;
            const zoomDiff = targetZoom - currentZoom;
            
            let currentStep = 0;
            
            const animateStep = () => {
                if (currentStep >= steps) {
                    // Final position
                    map.setView([vehicle.lat, vehicle.lng], targetZoom);
                    resolve();
                    return;
                }
                
                const progress = currentStep / steps;
                const easeProgress = this.easeInOutCubic(progress);
                
                const newLat = currentCenter.lat + (latDiff * easeProgress);
                const newLng = currentCenter.lng + (lngDiff * easeProgress);
                const newZoom = currentZoom + (zoomDiff * easeProgress);
                
                map.setView([newLat, newLng], newZoom, { animate: false });
                
                currentStep++;
                requestAnimationFrame(animateStep);
            };
            
            animateStep();
        });
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    createLocationMarker(vehicle) {
        // KHÔNG xóa marker cũ - để tích lũy nhiều marker
        // this.removeLocationMarker();
        
        // Create new location marker
        const marker = L.marker([vehicle.lat, vehicle.lng], {
            icon: L.divIcon({
                className: 'location-marker',
                html: `<div class="location-marker-inner"></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            }),
            zIndexOffset: 1000
        }).addTo(map);
        
        // Lưu vào array để quản lý
        this.allLocationMarkers.push(marker);
        this.activeLocationMarker = marker;
        
        // ĐÃ LOẠI BỎ: Click handler để xóa marker
        // this.activeLocationMarker.on('click', () => {
        //     this.removeLocationMarker();
        // });
    }

    removeLocationMarker() {
        if (this.activeLocationMarker) {
            map.removeLayer(this.activeLocationMarker);
            this.activeLocationMarker = null;
        }
        
        if (this.locationPulseInterval) {
            clearInterval(this.locationPulseInterval);
            this.locationPulseInterval = null;
        }
    }

    // Thêm method để xóa tất cả markers (nếu cần)
    removeAllLocationMarkers() {
        this.allLocationMarkers.forEach(marker => {
            map.removeLayer(marker);
        });
        this.allLocationMarkers = [];
        this.activeLocationMarker = null;
    }

    highlightVehicleMarker(vehicle) {
        // Find the vehicle marker
        const marker = vehicleMarkers.find(m => m.vehicle.id === vehicle.id);
        if (marker) {
            // Add highlight class
            const markerElement = marker.getElement();
            if (markerElement) {
                markerElement.classList.add('vehicle-marker-highlight');
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    markerElement.classList.remove('vehicle-marker-highlight');
                }, 3000);
            }
            
            // Open popup with delay
            setTimeout(() => {
                marker.openPopup();
            }, 500);
        }
    }

    // Thêm hiệu ứng ripple khi click vào map
    addMapRippleEffect() {
        map.on('click', (e) => {
            this.createRippleEffect(e.latlng);
        });
    }

    createRippleEffect(latlng) {
        const ripple = L.marker(latlng, {
            icon: L.divIcon({
                className: 'map-ripple',
                html: `<div style="
                    width: 10px;
                    height: 10px;
                    background: rgba(59, 130, 246, 0.6);
                    border-radius: 50%;
                    animation: rippleExpand 1s ease-out forwards;
                "></div>`,
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            })
        }).addTo(map);
        
        // Add ripple animation
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes rippleExpand {
                0% {
                    transform: scale(1);
                    opacity: 0.6;
                }
                100% {
                    transform: scale(10);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
        
        // Remove ripple after animation
        setTimeout(() => {
            map.removeLayer(ripple);
        }, 1000);
    }

    // Thêm hiệu ứng trail khi xe di chuyển
    addVehicleTrail(vehicle, duration = 5000) {
        const trail = [];
        const maxTrailLength = 10;
        
        const addTrailPoint = () => {
            // Thêm điểm mới
            trail.push({
                latlng: [vehicle.lat, vehicle.lng],
                timestamp: Date.now(),
                marker: L.circleMarker([vehicle.lat, vehicle.lng], {
                    radius: 3,
                    color: STATUS_COLORS[vehicle.status],
                    opacity: 0.7,
                    fillOpacity: 0.3
                }).addTo(map)
            });
            
            // Xóa điểm cũ
            if (trail.length > maxTrailLength) {
                const oldPoint = trail.shift();
                map.removeLayer(oldPoint.marker);
            }
            
            // Fade out trail points
            trail.forEach((point, index) => {
                const opacity = (index + 1) / trail.length * 0.7;
                point.marker.setStyle({ opacity });
            });
        };
        
        // Tạo trail interval
        const trailInterval = setInterval(addTrailPoint, 1000);
        
        // Dọn dẹp trail sau duration
        setTimeout(() => {
            clearInterval(trailInterval);
            trail.forEach(point => map.removeLayer(point.marker));
        }, duration);
    }
}

// Khởi tạo animation manager
const vehicleAnimationManager = new VehicleAnimationManager();

// Override hàm selectVehicle gốc để thêm animation
const originalSelectVehicle = window.selectVehicle;
window.selectVehicle = function(vehicle) {
    // Gọi animation trước
    vehicleAnimationManager.animateToVehicle(vehicle);
    
    // Gọi hàm gốc với delay nhỏ
    setTimeout(() => {
        originalSelectVehicle(vehicle);
    }, 1000);
};

// Thêm các hiệu ứng bổ sung
document.addEventListener('DOMContentLoaded', function() {
    // Thêm ripple effect cho map
    vehicleAnimationManager.addMapRippleEffect();
    
    // ĐÃ LOẠI BỎ: Keyboard shortcuts để xóa marker
    // document.addEventListener('keydown', function(e) {
    //     if (e.key === 'Escape') {
    //         vehicleAnimationManager.removeLocationMarker();
    //     }
    // });
});

// Export để sử dụng ở file khác
window.VehicleAnimationManager = VehicleAnimationManager;
window.vehicleAnimationManager = vehicleAnimationManager;