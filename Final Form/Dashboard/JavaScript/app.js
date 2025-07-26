// app.js - File chính khởi tạo ứng dụng
// Class FleetApp để quản lý toàn bộ app
// Thứ tự khởi tạo các component
// Entry point của ứng dụng

class FleetApp {
    // Initialize the entire application
    static init() {
        console.log('Initializing Fleet Management Dashboard...');
        
        // Initialize map
        MapController.initialize();
        
        // Load data
        RouteManager.loadRoutes();
        VehicleManager.loadVehicles();
        
        // Setup event handlers
        EventHandler.setupEventListeners();
        EventHandler.setupGlobalFunctions();
        
        console.log('Fleet Management Dashboard loaded successfully with enhanced features!');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FleetApp.init();
});