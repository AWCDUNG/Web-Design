// Hàm mở alerts tab với dropdown menu
function openAlertsTab() {
    // Tìm hoặc tạo div để hiển thị nội dung alerts
    let contentArea = document.getElementById('alerts-content-area');
    let overlay = document.getElementById('content-overlay');
    
    if (!contentArea) {
        // Tạo overlay nền đen mờ
        overlay = document.createElement('div');
        overlay.id = 'content-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        `;
        
        // Tạo content area cho alerts
        contentArea = document.createElement('div');
        contentArea.id = 'alerts-content-area';
        contentArea.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 1000px;
            height: 70%;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow-y: auto;
            z-index: 1000;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(contentArea);
    }

    // Nội dung alerts (dropdown menu của bạn)
    contentArea.innerHTML = `
        <button onclick="closeAlertsTab()" style="
            position: absolute;
            top: 15px;
            right: 15px;
            background: #ff4757;
            color: white;
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
        ">×</button>
        
        <h2 style="margin-top: 0; color: #333; text-align: center;">Alerts Navigation</h2>
        
        <nav style="margin-top: 30px;">
            <ul style="list-style: none; padding: 0; display: flex; justify-content: center; flex-wrap: wrap;">
                <li style="position: relative; margin: 0 10px;">
                    <a href="#" style="display: block; padding: 15px 25px; text-decoration: none; color: #333; font-weight: 600; background: #f8f9fa; border-radius: 8px; transition: all 0.3s;">Home</a>
                </li>
                <li style="position: relative; margin: 0 10px; group;">
                    <a href="#" style="display: block; padding: 15px 25px; text-decoration: none; color: #333; font-weight: 600; background: #f8f9fa; border-radius: 8px; transition: all 0.3s;">Features</a>
                    <ul style="position: absolute; top: 100%; left: 0; background: white; min-width: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px; opacity: 0; visibility: hidden; transition: all 0.3s; list-style: none; padding: 10px 0; margin: 0;">
                        <li><a href="#" style="display: block; padding: 10px 20px; text-decoration: none; color: #666; transition: all 0.3s;">JavaScript</a></li>
                        <li><a href="#" style="display: block; padding: 10px 20px; text-decoration: none; color: #666; transition: all 0.3s;">MongoDB</a></li>
                        <li><a href="#" style="display: block; padding: 10px 20px; text-decoration: none; color: #666; transition: all 0.3s;">ReactJS</a></li>
                    </ul>
                </li>
                <li style="position: relative; margin: 0 10px;">
                    <a href="#" style="display: block; padding: 15px 25px; text-decoration: none; color: #333; font-weight: 600; background: #f8f9fa; border-radius: 8px; transition: all 0.3s;">Web Design</a>
                    <ul style="position: absolute; top: 100%; left: 0; background: white; min-width: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px; opacity: 0; visibility: hidden; transition: all 0.3s; list-style: none; padding: 10px 0; margin: 0;">
                        <li><a href="#" style="display: block; padding: 10px 20px; text-decoration: none; color: #666; transition: all 0.3s;">Front End</a></li>
                        <li><a href="#" style="display: block; padding: 10px 20px; text-decoration: none; color: #666; transition: all 0.3s;">Back End</a></li>
                        <li style="position: relative;">
                            <a href="#" style="display: block; padding: 10px 20px; text-decoration: none; color: #666; transition: all 0.3s;">Other</a>
                            <ul style="position: absolute; left: 100%; top: 0; background: white; min-width: 150px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px; opacity: 0; visibility: hidden; transition: all 0.3s; list-style: none; padding: 10px 0; margin: 0;">
                                <li><a href="#" style="display: block; padding: 8px 15px; text-decoration: none; color: #666;">Links</a></li>
                                <li><a href="#" style="display: block; padding: 8px 15px; text-decoration: none; color: #666;">Works</a></li>
                                <li><a href="#" style="display: block; padding: 8px 15px; text-decoration: none; color: #666;">Status</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li style="position: relative; margin: 0 10px;">
                    <a href="#" style="display: block; padding: 15px 25px; text-decoration: none; color: #333; font-weight: 600; background: #f8f9fa; border-radius: 8px; transition: all 0.3s;">Contact</a>
                </li>
                <li style="position: relative; margin: 0 10px;">
                    <a href="#" style="display: block; padding: 15px 25px; text-decoration: none; color: #333; font-weight: 600; background: #f8f9fa; border-radius: 8px; transition: all 0.3s;">Feedbacks</a>
                </li>
            </ul>
        </nav>
        
        <style>
            li:hover > ul {
                opacity: 1 !important;
                visibility: visible !important;
            }
            a:hover {
                background: #007bff !important;
                color: white !important;
            }
        </style>
    `;

    // Hiển thị overlay và content
    overlay.style.display = 'block';
    contentArea.style.display = 'block';
    
    // Click overlay để đóng
    overlay.onclick = closeAlertsTab;
}

// Hàm đóng alerts tab
function closeAlertsTab() {
    const contentArea = document.getElementById('alerts-content-area');
    const overlay = document.getElementById('content-overlay');
    
    if (contentArea) contentArea.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}