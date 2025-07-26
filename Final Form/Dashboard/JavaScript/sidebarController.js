// sidebarController.js - Quản lý sidebar
// Toggle sidebar open/close
// Chuyển đổi tabs
// Toggle route lists
// Xử lý click outside sidebar
class SidebarController {
    // Toggle sidebar open/close
    static toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const menuToggle = document.getElementById('menuToggle');
        
        sidebarOpen = !sidebarOpen;
        sidebar.classList.toggle('hidden', !sidebarOpen);
        overlay.classList.toggle('active', sidebarOpen);
        menuToggle.style.display = sidebarOpen ? 'none' : 'block';
    }

    // Close sidebar
    static closeSidebar() {
        if (!sidebarOpen) return;
        
        sidebarOpen = false;
        document.getElementById('sidebar').classList.add('hidden');
        document.getElementById('sidebarOverlay').classList.remove('active');
        document.getElementById('menuToggle').style.display = 'block';
        this.closeAllRouteLists();
    }

    // Switch between tabs
    static showTab(tabName) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        event.target.closest('.nav-item').classList.add('active');
        
        const routeMonitorSection = document.getElementById('routeMonitorSection');
        routeMonitorSection.style.display = tabName === 'routes' ? 'block' : 'none';
    }

    // Toggle restricted routes list
    static toggleRoutes() {
        const routeList = document.getElementById('routeList');
        const header = event.target.closest('.route-header');
        const isShowing = routeList.classList.contains('show');
        
        this.closeAllRouteLists();
        
        if (!isShowing) {
            routeList.classList.add('show');
            header.classList.add('expanded');
            header.querySelector('.expand-icon').textContent = '▲';
        } else {
            routeList.classList.remove('show');
            header.classList.remove('expanded');
            header.querySelector('.expand-icon').textContent = '▼';
        }
    }

    // Toggle preferred routes list
    static togglePreferredRoutes() {
        const routeList = document.getElementById('preferredRouteList');
        const header = event.target.closest('.route-header');
        const isShowing = routeList.classList.contains('show');
        
        this.closeAllRouteLists();
        
        if (!isShowing) {
            routeList.classList.add('show');
            header.classList.add('expanded');
            header.querySelector('.expand-icon').textContent = '▲';
        } else {
            routeList.classList.remove('show');
            header.classList.remove('expanded');
            header.querySelector('.expand-icon').textContent = '▼';
        }
    }

    // Close all route lists
    static closeAllRouteLists() {
        const routeLists = document.querySelectorAll('.route-list');
        const headers = document.querySelectorAll('.route-header');
        
        routeLists.forEach(list => list.classList.remove('show'));
        headers.forEach(header => {
            header.classList.remove('expanded');
            const expandIcon = header.querySelector('.expand-icon');
            if (expandIcon) expandIcon.textContent = '▼';
        });
        
        // Reset route highlighting
        RouteManager.resetRouteStyles();
    }

    // Setup sidebar event listeners
    static setupSidebarEvents() {
        document.addEventListener('click', e => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menuToggle');
            if (sidebarOpen && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                this.closeSidebar();
            }
        });
    }
    // Thêm function này vào class SidebarController

// Toggle provincial routes list
static toggleProvincialRoutes() {
    const routeList = document.getElementById('provincialRouteList');
    const header = event.target.closest('.route-header');
    const isShowing = routeList.classList.contains('show');
    
    this.closeAllRouteLists();
    
    if (!isShowing) {
        routeList.classList.add('show');
        header.classList.add('expanded');
        header.querySelector('.expand-icon').textContent = '▲';
    } else {
        routeList.classList.remove('show');
        header.classList.remove('expanded');
        header.querySelector('.expand-icon').textContent = '▼';
    }
}
}