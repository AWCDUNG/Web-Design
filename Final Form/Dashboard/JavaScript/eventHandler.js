// eventHandler.js - Xử lý sự kiện
// Keyboard shortcuts (M, R, V, C, ESC)
// Setup global functions cho HTML onclick
// Event listeners tổng quát
class EventHandler {
    // Setup all event listeners
    static setupEventListeners() {
        this.setupKeyboardShortcuts();
        SidebarController.setupSidebarEvents();
    }

    // Setup keyboard shortcuts
    static setupKeyboardShortcuts() {
        document.addEventListener('keydown', e => {
            const key = e.key.toLowerCase();
            
            if (key === 'm') {
                SidebarController.toggleSidebar();
            } else if (key === 'r') {
                MapController.toggleRestrictedRoutes();
            } else if (key === 'v') {
                MapController.toggleVehicles();
            } else if (key === 'c') {
                MapController.centerMap();
            } else if (key === 'escape') { 
                SidebarController.closeSidebar(); 
                map.closePopup(); 
            }
        });
    }

    // Global function wrappers for HTML onclick events
    static setupGlobalFunctions() {
        // Make functions globally accessible for HTML onclick events
        window.toggleSidebar = () => SidebarController.toggleSidebar();
        window.closeSidebar = () => SidebarController.closeSidebar();
        window.showTab = (tabName) => SidebarController.showTab(tabName);
        window.toggleRoutes = () => SidebarController.toggleRoutes();
        window.togglePreferredRoutes = () => SidebarController.togglePreferredRoutes();
        window.highlightRoute = (routeId) => RouteManager.highlightRoute(routeId);
        window.toggleRestrictedRoutes = () => MapController.toggleRestrictedRoutes();
        window.toggleVehicles = () => MapController.toggleVehicles();
        window.centerMap = () => MapController.centerMap();
    }
}

// Hàm chuyển đến trang policy.html
function openAlertsTab() {
    window.location.href = 'index/alerts.html';
}

// Hoặc nếu bạn muốn mở trong tab mới
function openAlertsTabInNewWindow() {
    window.open('index/alerts.htmll', '_blank');
}

// Nếu bạn muốn có hiệu ứng chuyển trang mượt mà hơn
function openAlertsTabSmooth() {
    // Thêm class loading nếu cần
    document.body.classList.add('loading');
    
    // Chuyển trang sau 200ms
    setTimeout(() => {
        window.location.href = 'index/alerts.html';
    }, 200);
}

// Hàm với xử lý lỗi
function openAlertsTabSafe() {
    try {
        window.location.href = 'index/alerts.html';
    } catch (error) {
        console.error('Không thể chuyển trang:', error);
        alert('Có lỗi xảy ra khi chuyển trang!');
    }
}

function showFeedbackTab() {
    // Xóa active class khỏi tất cả nav-item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Thêm active class cho feedback
    event.target.closest('.nav-item').classList.add('active');
    
    // Chuyển sang nội dung feedback
    window.location.href = 'vehicleManager/vehicle.html';
}
function showValidationTab() {
    // Xóa active class khỏi tất cả nav-item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Thêm active class cho feedback
    event.target.closest('.nav-item').classList.add('active');
    
    // Chuyển sang nội dung feedback
    window.location.href = 'feedback/feedback.html';

}

function showRoute() {
    // Xóa active class khỏi tất cả nav-item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Thêm active class cho feedback
    event.target.closest('.nav-item').classList.add('active');
    
    // Chuyển sang nội dung feedback
    window.location.href = 'router/index.html';

}

