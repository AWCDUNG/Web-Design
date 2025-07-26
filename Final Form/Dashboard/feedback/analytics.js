// // Simple Survey Analytics
// // Thống kê kết quả khảo sát đơn giản

// document.addEventListener('DOMContentLoaded', function() {
    
//     // Dữ liệu mẫu để test
//     const sampleResponses = [
//         {
//             userType: 'driver',
//             ui_overall: '4',
//             ui_buttons: '3',
//             response_speed: '4',
//             safety_improvement: '5',
//             efficiency: '4',
//             timestamp: new Date().toISOString()
//         },
//         {
//             userType: 'manager',
//             ui_overall: '5',
//             ui_buttons: '4',
//             response_speed: '3',
//             safety_improvement: '4',
//             efficiency: '5',
//             timestamp: new Date().toISOString()
//         },
//         {
//             userType: 'safety',
//             ui_overall: '3',
//             ui_buttons: '4',
//             response_speed: '4',
//             safety_improvement: '5',
//             efficiency: '3',
//             timestamp: new Date().toISOString()
//         }
//     ];

//     // Tạo nút xem thống kê
//     createAnalyticsButton();
    
//     function createAnalyticsButton() {
//         const button = document.createElement('button');
//         button.id = 'view-analytics';
//         button.textContent = '📊 Xem thống kê';
//         button.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: #3498db;
//             color: white;
//             border: none;
//             padding: 12px 20px;
//             border-radius: 25px;
//             cursor: pointer;
//             font-weight: bold;
//             z-index: 1000;
//             box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
//             transition: all 0.3s ease;
//         `;
        
//         button.addEventListener('click', showAnalytics);
//         document.body.appendChild(button);
        
//         // Hover effect
//         button.addEventListener('mouseenter', function() {
//             this.style.transform = 'translateY(-2px)';
//             this.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
//         });
        
//         button.addEventListener('mouseleave', function() {
//             this.style.transform = 'translateY(0)';
//             this.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
//         });
//     }

//     function showAnalytics() {
//         const modal = document.createElement('div');
//         modal.id = 'analytics-modal';
//         modal.style.cssText = `
//             position: fixed;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             background: rgba(0, 0, 0, 0.8);
//             z-index: 2000;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             animation: fadeIn 0.3s ease;
//         `;
        
//         const content = document.createElement('div');
//         content.style.cssText = `
//             background: white;
//             padding: 30px;
//             border-radius: 15px;
//             width: 90%;
//             max-width: 800px;
//             max-height: 80%;
//             overflow-y: auto;
//             position: relative;
//         `;
        
//         content.innerHTML = generateAnalyticsHTML();
//         modal.appendChild(content);
//         document.body.appendChild(modal);
        
//         // Đóng modal
//         const closeBtn = content.querySelector('.close-btn');
//         closeBtn.addEventListener('click', () => {
//             modal.remove();
//         });
        
//         modal.addEventListener('click', (e) => {
//             if (e.target === modal) {
//                 modal.remove();
//             }
//         });
        
//         // Tạo biểu đồ
//         setTimeout(() => {
//             createCharts();
//         }, 100);
//     }

//     function generateAnalyticsHTML() {
//         const stats = calculateStats();
        
//         return `
//             <div class="analytics-header">
//                 <h2>📊 Thống kê kết quả khảo sát</h2>
//                 <button class="close-btn" style="
//                     position: absolute;
//                     top: 15px;
//                     right: 15px;
//                     background: none;
//                     border: none;
//                     font-size: 24px;
//                     cursor: pointer;
//                     color: #666;
//                 ">×</button>
//             </div>
            
//             <div class="stats-overview">
//                 <div class="stat-card">
//                     <h3>📝 Tổng phản hồi</h3>
//                     <div class="stat-number">${stats.totalResponses}</div>
//                 </div>
//                 <div class="stat-card">
//                     <h3>⭐ Điểm trung bình</h3>
//                     <div class="stat-number">${stats.averageScore}</div>
//                 </div>
//                 <div class="stat-card">
//                     <h3>📈 Mức độ hài lòng</h3>
//                     <div class="stat-number">${stats.satisfactionLevel}</div>
//                 </div>
//             </div>
            
//             <div class="charts-container">
//                 <div class="chart-section">
//                     <h3>👥 Phân bố theo loại người dùng</h3>
//                     <canvas id="userTypeChart" width="400" height="200"></canvas>
//                 </div>
                
//                 <div class="chart-section">
//                     <h3>⭐ Điểm đánh giá các tính năng</h3>
//                     <canvas id="ratingsChart" width="400" height="200"></canvas>
//                 </div>
//             </div>
            
//             <div class="detailed-stats">
//                 <h3>📋 Chi tiết thống kê</h3>
//                 <div class="stats-table">
//                     ${generateStatsTable(stats)}
//                 </div>
//             </div>
            
//             <style>
//                 @keyframes fadeIn {
//                     from { opacity: 0; }
//                     to { opacity: 1; }
//                 }
                
//                 .analytics-header {
//                     text-align: center;
//                     margin-bottom: 30px;
//                     border-bottom: 2px solid #eee;
//                     padding-bottom: 20px;
//                 }
                
//                 .stats-overview {
//                     display: flex;
//                     justify-content: space-around;
//                     margin-bottom: 30px;
//                     flex-wrap: wrap;
//                     gap: 20px;
//                 }
                
//                 .stat-card {
//                     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//                     color: white;
//                     padding: 20px;
//                     border-radius: 10px;
//                     text-align: center;
//                     flex: 1;
//                     min-width: 150px;
//                 }
                
//                 .stat-card h3 {
//                     margin: 0 0 10px 0;
//                     font-size: 0.9em;
//                 }
                
//                 .stat-number {
//                     font-size: 2em;
//                     font-weight: bold;
//                 }
                
//                 .charts-container {
//                     display: flex;
//                     flex-wrap: wrap;
//                     gap: 30px;
//                     margin-bottom: 30px;
//                 }
                
//                 .chart-section {
//                     flex: 1;
//                     min-width: 300px;
//                     background: #f8f9fa;
//                     padding: 20px;
//                     border-radius: 10px;
//                 }
                
//                 .chart-section h3 {
//                     margin-top: 0;
//                     color: #333;
//                 }
                
//                 .detailed-stats {
//                     margin-top: 30px;
//                 }
                
//                 .stats-table {
//                     background: white;
//                     border-radius: 8px;
//                     overflow: hidden;
//                     box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//                 }
                
//                 .stats-table table {
//                     width: 100%;
//                     border-collapse: collapse;
//                 }
                
//                 .stats-table th,
//                 .stats-table td {
//                     padding: 12px 15px;
//                     text-align: left;
//                     border-bottom: 1px solid #eee;
//                 }
                
//                 .stats-table th {
//                     background: #f8f9fa;
//                     font-weight: 600;
//                     color: #555;
//                 }
                
//                 .stats-table tr:hover {
//                     background: #f8f9fa;
//                 }
//             </style>
//         `;
//     }

//     function calculateStats() {
//         const responses = sampleResponses;
//         const totalResponses = responses.length;
        
//         // Tính điểm trung bình
//         const ratingFields = ['ui_overall', 'ui_buttons', 'response_speed', 'safety_improvement', 'efficiency'];
//         let totalRating = 0;
//         let ratingCount = 0;
        
//         responses.forEach(response => {
//             ratingFields.forEach(field => {
//                 if (response[field]) {
//                     totalRating += parseInt(response[field]);
//                     ratingCount++;
//                 }
//             });
//         });
        
//         const averageScore = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
        
//         // Xác định mức độ hài lòng
//         let satisfactionLevel = 'Tốt';
//         if (averageScore >= 4.5) satisfactionLevel = 'Xuất sắc';
//         else if (averageScore >= 4.0) satisfactionLevel = 'Tốt';
//         else if (averageScore >= 3.0) satisfactionLevel = 'Khá';
//         else if (averageScore >= 2.0) satisfactionLevel = 'Cần cải thiện';
//         else satisfactionLevel = 'Yếu';
        
//         // Thống kê theo loại người dùng
//         const userTypeStats = {};
//         responses.forEach(response => {
//             const userType = response.userType;
//             if (!userTypeStats[userType]) {
//                 userTypeStats[userType] = 0;
//             }
//             userTypeStats[userType]++;
//         });
        
//         // Thống kê điểm theo từng tính năng
//         const featureStats = {};
//         ratingFields.forEach(field => {
//             featureStats[field] = {
//                 total: 0,
//                 count: 0,
//                 average: 0
//             };
//         });
        
//         responses.forEach(response => {
//             ratingFields.forEach(field => {
//                 if (response[field]) {
//                     featureStats[field].total += parseInt(response[field]);
//                     featureStats[field].count++;
//                 }
//             });
//         });
        
//         Object.keys(featureStats).forEach(field => {
//             if (featureStats[field].count > 0) {
//                 featureStats[field].average = (featureStats[field].total / featureStats[field].count).toFixed(1);
//             }
//         });
        
//         return {
//             totalResponses,
//             averageScore,
//             satisfactionLevel,
//             userTypeStats,
//             featureStats
//         };
//     }

//     function generateStatsTable(stats) {
//         const featureNames = {
//             'ui_overall': 'Giao diện tổng thể',
//             'ui_buttons': 'Nút bấm & biểu tượng',
//             'response_speed': 'Tốc độ phản hồi',
//             'safety_improvement': 'Cải thiện an toàn',
//             'efficiency': 'Hiệu quả công việc'
//         };
        
//         let tableHTML = `
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Tính năng</th>
//                         <th>Điểm trung bình</th>
//                         <th>Số đánh giá</th>
//                         <th>Mức độ</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//         `;
        
//         Object.keys(stats.featureStats).forEach(field => {
//             const feature = stats.featureStats[field];
//             const name = featureNames[field] || field;
//             const level = getScoreLevel(feature.average);
            
//             tableHTML += `
//                 <tr>
//                     <td>${name}</td>
//                     <td>${feature.average}/5.0</td>
//                     <td>${feature.count}</td>
//                     <td>${level}</td>
//                 </tr>
//             `;
//         });
        
//         tableHTML += `
//                 </tbody>
//             </table>
//         `;
        
//         return tableHTML;
//     }

//     function getScoreLevel(score) {
//         if (score >= 4.5) return '🟢 Xuất sắc';
//         if (score >= 4.0) return '🔵 Tốt';
//         if (score >= 3.0) return '🟡 Khá';
//         if (score >= 2.0) return '🟠 Cần cải thiện';
//         return '🔴 Yếu';
//     }

//     function createCharts() {
//         createUserTypeChart();
//         createRatingsChart();
//     }

//     function createUserTypeChart() {
//         const canvas = document.getElementById('userTypeChart');
//         if (!canvas) return;
        
//         const ctx = canvas.getContext('2d');
//         const stats = calculateStats();
        
//         const userTypeNames = {
//             'driver': 'Tài xế',
//             'manager': 'Quản lý',
//             'safety': 'An toàn',
//             'tech': 'Kỹ thuật'
//         };
        
//         const data = Object.keys(stats.userTypeStats).map(type => ({
//             label: userTypeNames[type] || type,
//             value: stats.userTypeStats[type]
//         }));
        
//         // Vẽ biểu đồ tròn đơn giản
//         const centerX = canvas.width / 2;
//         const centerY = canvas.height / 2;
//         const radius = 80;
        
//         const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        
//         let currentAngle = 0;
//         const total = data.reduce((sum, item) => sum + item.value, 0);
        
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
        
//         data.forEach((item, index) => {
//             const sliceAngle = (item.value / total) * 2 * Math.PI;
            
//             ctx.beginPath();
//             ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
//             ctx.lineTo(centerX, centerY);
//             ctx.fillStyle = colors[index % colors.length];
//             ctx.fill();
            
//             // Vẽ nhãn
//             const labelAngle = currentAngle + sliceAngle / 2;
//             const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
//             const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
            
//             ctx.fillStyle = '#333';
//             ctx.font = '12px Arial';
//             ctx.textAlign = 'center';
//             ctx.fillText(`${item.label} (${item.value})`, labelX, labelY);
            
//             currentAngle += sliceAngle;
//         });
//     }

//     function createRatingsChart() {
//         const canvas = document.getElementById('ratingsChart');
//         if (!canvas) return;
        
//         const ctx = canvas.getContext('2d');
//         const stats = calculateStats();
        
//         const featureNames = {
//             'ui_overall': 'Giao diện',
//             'ui_buttons': 'Nút bấm',
//             'response_speed': 'Tốc độ',
//             'safety_improvement': 'An toàn',
//             'efficiency': 'Hiệu quả'
//         };
        
//         const data = Object.keys(stats.featureStats).map(field => ({
//             label: featureNames[field] || field,
//             value: parseFloat(stats.featureStats[field].average)
//         }));
        
//         // Vẽ biểu đồ cột
//         const barWidth = 50;
//         const barSpacing = 80;
//         const maxHeight = 120;
//         const startX = 50;
//         const startY = canvas.height - 50;
        
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
        
//         data.forEach((item, index) => {
//             const barHeight = (item.value / 5) * maxHeight;
//             const x = startX + index * barSpacing;
//             const y = startY - barHeight;
            
//             // Vẽ cột
//             ctx.fillStyle = '#3498db';
//             ctx.fillRect(x, y, barWidth, barHeight);
            
//             // Vẽ giá trị
//             ctx.fillStyle = '#333';
//             ctx.font = '12px Arial';
//             ctx.textAlign = 'center';
//             ctx.fillText(item.value.toFixed(1), x + barWidth/2, y - 5);
            
//             // Vẽ nhãn
//             ctx.save();
//             ctx.translate(x + barWidth/2, startY + 20);
//             ctx.rotate(-Math.PI / 4);
//             ctx.fillText(item.label, 0, 0);
//             ctx.restore();
//         });
        
//         // Vẽ trục tung
//         ctx.strokeStyle = '#666';
//         ctx.lineWidth = 1;
//         ctx.beginPath();
//         ctx.moveTo(startX - 10, startY);
//         ctx.lineTo(startX - 10, startY - maxHeight);
//         ctx.stroke();
        
//         // Vẽ các mốc điểm
//         for (let i = 0; i <= 5; i++) {
//             const y = startY - (i / 5) * maxHeight;
//             ctx.fillStyle = '#666';
//             ctx.font = '10px Arial';
//             ctx.textAlign = 'right';
//             ctx.fillText(i.toString(), startX - 15, y + 3);
//         }
//     }

//     console.log('📊 Survey Analytics initialized');
// });