// config.js - Cấu hình và biến global
// Global variables
// Chứa tất cả biến global và cấu hình
// Màu sắc, style cho routes và vehicles
// Bản dịch tiếng Việt
let map, restrictedRoutes = [], preferredRoutes = [], vehicleMarkers = [], routeLayers = {};
let showingRestrictedRoutes = true, showingVehicles = true, sidebarOpen = false;

// Map configuration
const MAP_CONFIG = {
    center: [21.0285, 105.8542],
    zoom: 13,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
};

// Route colors and styles
const ROUTE_STYLES = {
    restricted: {
        color: '#e74c3c',// Màu đỏ cho tuyến đường hạn chế
        weight: 4,
        opacity: 0.6,
        dashArray: '10, 5'
    },
    preferred: {
        color: '#3498db',// Màu xanh dương cho tuyến đường ưu tiên
        weight: 4,
        opacity: 0.6,
        dashArray: null
    },
    highlighted: {// Màu vàng cho tuyến đường được highlight
        color: '#f1c40f',
        weight: 6,
        opacity: 1

    }
};

// Vehicle status colors
const STATUS_COLORS = {
    'In Transit': '#f39c12',// Màu vàng cho "Đang di chuyển"
    'Loading': '#3498db', // Màu xanh dương cho "Đang tải hàng"
    'Off Route': '#e74c3c', // Màu đỏ cho "Lệch tuyến"
    'Parked': '#95a5a6',// Màu xám cho "Đang đậu"
    'Emergency': '#e74c3c'// Màu đỏ cho "Khẩn cấp"
};

// Vietnamese translations
const TRANSLATIONS = {
    status: {
        'In Transit': 'Đang di chuyển',
        'Loading': 'Đang tải hàng',
        'Off Route': 'Lệch tuyến',
        'Parked': 'Đang đậu',
        'Emergency': 'Khẩn cấp'
    },
    cargo: {
        'Corrosive': 'Ăn mòn',
        'Flammable': 'Dễ cháy',
        'Toxic': 'Độc hại',
        'Empty': 'Trống'
    }
};
// Trong file config.js hoặc đầu file, thêm CSS cho animation:
const css = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.custom-route-popup .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    border: none;
    padding: 0;
}

.endpoint-marker:hover .endpoint-tooltip {
    opacity: 1 !important;
}
`;

// Thêm CSS vào head
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);