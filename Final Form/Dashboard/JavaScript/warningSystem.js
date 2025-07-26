// const WARNING_SYSTEM = {
//     // Ngưỡng cảnh báo
//     thresholds: {
//         temperature: { normal: [15, 35], warning: [5, 55], danger: [-10, 75] },
//         temperatureIndoor: { normal: [18, 30], warning: [10, 45], danger: [0, 65] },
//         humidity: { normal: [40, 70], warning: [20, 90], danger: [0, 100] },
//         pm25: { normal: [0, 50], warning: [51, 150], danger: [151, 1000] },
//         pm10: { normal: [0, 50], warning: [51, 200], danger: [201, 1000] },
//         coGas: { normal: [0, 100], warning: [101, 500], danger: [501, 2000] },
//         lpgGas: { normal: [0, 50], warning: [51, 200], danger: [201, 1000] },
//         ch4Gas: { normal: [0, 50], warning: [51, 150], danger: [151, 500] },
//         pressure: { normal: [1000, 1020], warning: [990, 1030], danger: [950, 1070] },
//         speed: { normal: [0, 60], warning: [61, 90], danger: [91, 200] },
//         acceleration: { normal: [0, 2], warning: [2.1, 4], danger: [4.1, 10] },
//         tiltAngle: { normal: [0, 15], warning: [16, 30], danger: [31, 90] }
//     },

//     // Cấu hình hiển thị
//     levels: {
//         normal: { icon: '✅', text: 'Bình thường', class: 'safe', priority: 0 },
//         warning: { icon: '⚠️', text: 'Cảnh báo', class: 'warning', priority: 1 },
//         danger: { icon: '🚨', text: 'Nguy hiểm', class: 'danger', priority: 2 }
//     },

//     // Kiểm tra mức độ cảnh báo
//     checkLevel(param, value) {
//         const threshold = this.thresholds[param];
//         if (!threshold) return 'normal';

//         const [normalMin, normalMax] = threshold.normal;
//         const [warningMin, warningMax] = threshold.warning;
//         const [dangerMin, dangerMax] = threshold.danger;

//         // Kiểm tra nguy hiểm trước
//         if (value <= dangerMin || value >= dangerMax) {
//             return 'danger';
//         }
        
//         // Kiểm tra cảnh báo
//         if (value <= warningMin || value >= warningMax) {
//             return 'warning';
//         }
        
//         // Kiểm tra bình thường
//         if (value >= normalMin && value <= normalMax) {
//             return 'normal';
//         }
        
//         // Fallback
//         return 'warning';
//     },

//     // Tạo thông điệp cảnh báo
//     getMessage(param, value, level) {
//         const messages = {
//             temperature: {
//                 warning: `Nhiệt độ ngoài ${value}°C - Cần theo dõi`,
//                 danger: `Nhiệt độ ngoài ${value}°C - RẤT NGUY HIỂM!`
//             },
//             temperatureIndoor: {
//                 warning: `Nhiệt độ trong xe ${value}°C - Kiểm tra hệ thống`,
//                 danger: `Nhiệt độ trong xe ${value}°C - DỪNG XE NGAY!`
//             },
//             humidity: {
//                 warning: `Độ ẩm ${value}% - Cần chú ý`,
//                 danger: `Độ ẩm ${value}% - NGUY HIỂM!`
//             },
//             pm25: {
//                 warning: `Bụi PM2.5: ${value} μg/m³ - Không khí có hại`,
//                 danger: `Bụi PM2.5: ${value} μg/m³ - CỰC KỲ NGUY HIỂM!`
//             },
//             pm10: {
//                 warning: `Bụi PM10: ${value} μg/m³ - Mức bụi cao`,
//                 danger: `Bụi PM10: ${value} μg/m³ - CỰC KỲ NGUY HIỂM!`
//             },
//             coGas: {
//                 warning: `Khí CO: ${value} μg/m³ - Nồng độ cao`,
//                 danger: `Khí CO: ${value} μg/m³ - NGUY CƠ TỬ VONG!`
//             },
//             lpgGas: {
//                 warning: `Khí LPG: ${value} ppm - Nồng độ cao`,
//                 danger: `Khí LPG: ${value} ppm - NGUY CƠ NỔ!`
//             },
//             ch4Gas: {
//                 warning: `Khí CH4: ${value} ppm - Nồng độ cao`,
//                 danger: `Khí CH4: ${value} ppm - NGUY CƠ NỔ!`
//             },
//             pressure: {
//                 warning: `Áp suất ${value} hPa - Thời tiết xấu`,
//                 danger: `Áp suất ${value} hPa - BÃO LỚN!`
//             },
//             speed: {
//                 warning: `Tốc độ ${value} km/h - Vượt giới hạn`,
//                 danger: `Tốc độ ${value} km/h - NGUY HIỂM!`
//             },
//             acceleration: {
//                 warning: `Gia tốc ${value} m/s² - Lái xe mạnh`,
//                 danger: `Gia tốc ${value} m/s² - NGUY HIỂM!`
//             },
//             tiltAngle: {
//                 warning: `Góc nghiêng ${value}° - Xe bị nghiêng`,
//                 danger: `Góc nghiêng ${value}° - NGUY CƠ LẬT XE!`
//             }
//         };

//         return messages[param]?.[level] || `${param}: ${value} - ${level}`;
//     },

//     // Kiểm tra tất cả cảnh báo
//     checkAll(data) {
//         const warnings = [];
//         let highestLevel = 'normal';
//         let maxPriority = 0;

//         console.log('🔍 Kiểm tra cảnh báo với dữ liệu:', data);

//         // Kiểm tra lửa đặc biệt (cả hai tên field)
//         const flameDetected = data.flameDetected === 'Yes' || 
//                             data.flame_detected === 1 || 
//                             data.flame_detected === '1' ||
//                             data.flameDetected === 'Yes';

//         if (flameDetected) {
//             warnings.push({
//                 param: 'flame',
//                 level: 'danger',
//                 message: '🔥 PHÁT HIỆN LỬA!'
//             });
//             highestLevel = 'danger';
//             maxPriority = 2;
//         }

//         // Kiểm tra light leak
//         const lightLeak = data.lightLeakDetected === 'Yes' || 
//                          data.light_leak_detected === 1 || 
//                          data.light_leak_detected === '1' ||
//                          data.lightLeakDetected === 'Yes';

//         if (lightLeak) {
//             warnings.push({
//                 param: 'lightLeak',
//                 level: 'warning',
//                 message: '💡 PHÁT HIỆN RÒ RỈ ÁNH SÁNG!'
//             });
//             if (this.levels.warning.priority > maxPriority) {
//                 maxPriority = this.levels.warning.priority;
//                 highestLevel = 'warning';
//             }
//         }

//         // Kiểm tra các thông số khác
//         Object.keys(this.thresholds).forEach(param => {
//             if (data[param] !== undefined && data[param] !== null) {
//                 const level = this.checkLevel(param, data[param]);
//                 console.log(`- ${param}: ${data[param]} → ${level}`);
                
//                 if (level !== 'normal') {
//                     warnings.push({
//                         param,
//                         level,
//                         value: data[param],
//                         message: this.getMessage(param, data[param], level)
//                     });

//                     // Cập nhật mức cao nhất
//                     if (this.levels[level].priority > maxPriority) {
//                         maxPriority = this.levels[level].priority;
//                         highestLevel = level;
//                     }
//                 }
//             }
//         });

//         console.log(`📊 Kết quả: ${warnings.length} cảnh báo, mức cao nhất: ${highestLevel}`);

//         return {
//             warnings,
//             level: highestLevel,
//             count: warnings.length,
//             config: this.levels[highestLevel]
//         };
//     },

//     // Cập nhật giao diện
//     updateUI(result) {
//         const warningBox = document.getElementById('warningBox');
//         const warningIcon = document.querySelector('.warning-icon');
//         const warningTitle = document.getElementById('warningTitle');
//         const warningMessage = document.getElementById('warningMessage');
//         const warningLevel = document.getElementById('warningLevel');

//         if (!warningBox) {
//             console.error('❌ Không tìm thấy element #warningBox');
//             return;
//         }

//         const config = result.config;
        
//         // Cập nhật style
//         warningBox.className = `warning-box ${config.class}`;
        
//         // Cập nhật nội dung
//         if (warningIcon) warningIcon.textContent = config.icon;
//         if (warningTitle) warningTitle.textContent = config.text;
//         if (warningLevel) warningLevel.textContent = `Mức độ: ${config.text}`;
        
//         // Thông điệp
//         if (warningMessage) {
//             if (result.count === 0) {
//                 warningMessage.textContent = 'Tất cả thông số đều ổn định';
//             } else {
//                 // Hiển thị cảnh báo nghiêm trọng nhất
//                 const criticalWarning = result.warnings.find(w => w.level === 'danger');
//                 const displayWarning = criticalWarning || result.warnings[0];
                
//                 if (result.count === 1) {
//                     warningMessage.textContent = displayWarning.message;
//                 } else {
//                     warningMessage.textContent = `${displayWarning.message} (và ${result.count - 1} cảnh báo khác)`;
//                 }
//             }
//         }

//         // Log để debug
//         console.log('✅ UI đã cập nhật:', {
//             level: result.level,
//             count: result.count,
//             message: warningMessage ? warningMessage.textContent : 'N/A'
//         });
//     }
// };

// // Hàm sử dụng đơn giản
// function checkWarnings(data) {
//     const result = WARNING_SYSTEM.checkAll(data);
//     WARNING_SYSTEM.updateUI(result);
    
//     // Log kết quả
//     if (result.count > 0) {
//         console.log(`🚨 ${result.count} cảnh báo - Mức: ${result.level}`);
//         result.warnings.forEach(w => console.log(`  - ${w.message}`));
//     } else {
//         console.log('✅ Không có cảnh báo');
//     }
    
//     return result;
// }

// // Test với dữ liệu mẫu
// function testWarningSystem() {
//     const testData = {
//         temperature: 45,    // Cảnh báo
//         humidity: 96,       // Cảnh báo
//         pm25: 160,         // Nguy hiểm
//         coGas: 600,        // Nguy hiểm
//         speed: 100,        // Nguy hiểm
//         flameDetected: 'No'
//     };
    
//     console.log('🧪 Test hệ thống cảnh báo:');
//     console.log('📊 Dữ liệu test:', testData);
//     return checkWarnings(testData);
// }

// // Export để sử dụng
// window.warningSystem = { 
//     checkWarnings,
//     testWarningSystem,
//     WARNING_SYSTEM
// };

// console.log('✅ Hệ thống cảnh báo đã sẵn sàng');
// console.log('💡 Chạy warningSystem.testWarningSystem() để test');

// const WARNING_SYSTEM = {
//     // Ngưỡng cảnh báo
//     thresholds: {
//         temperature: { normal: [15, 35], warning: [5, 55], danger: [-10, 75], unit: '°C', displayName: 'Nhiệt độ ngoài', category: 'environment'},
//         temperatureIndoor: { normal: [18, 30], warning: [10, 45], danger: [0, 65], unit: '°C', displayName: 'Nhiệt độ trong xe', category: 'vehicle'},
//         humidity: { normal: [40, 70], warning: [20, 90], danger: [0, 100], unit: '%', displayName: 'Độ ẩm', category: 'environment'},
//         pm25: { normal: [0, 50], warning: [51, 150], danger: [151, 1000], unit: 'μg/m³', displayName: 'Bụi PM2.5', category: 'air'},
//         pm10: { normal: [0, 50], warning: [51, 200], danger: [201, 1000], unit: 'μg/m³', displayName: 'Bụi PM10', category: 'air'},
//         coGas: { normal: [0, 100], warning: [101, 500], danger: [501, 2000], unit: 'μg/m³', displayName: 'Khí CO', category: 'gas'},
//         lpgGas: { normal: [0, 50], warning: [51, 200], danger: [201, 1000], unit: 'ppm', displayName: 'Khí LPG', category: 'gas'},
//         ch4Gas: { normal: [0, 50], warning: [51, 150], danger: [151, 500], unit: 'ppm', displayName: 'Khí CH4', category: 'gas'},
//         pressure: { normal: [1000, 1020], warning: [990, 1030], danger: [950, 1070], unit: 'hPa', displayName: 'Áp suất', category: 'environment'},
//         speed: { normal: [0, 60], warning: [61, 90], danger: [91, 200], unit: 'km/h', displayName: 'Tốc độ', category: 'vehicle'},
//         acceleration: { normal: [0, 2], warning: [2.1, 4], danger: [4.1, 10], unit: 'm/s²', displayName: 'Gia tốc', category: 'vehicle'},
//         tiltAngle: { normal: [0, 15], warning: [16, 30], danger: [31, 90], unit: '°', displayName: 'Góc nghiêng', category: 'vehicle'}
//     },

//     // Cấu hình hiển thị
//     levels: {
//         normal: { 
//             icon: '✅', 
//             text: 'Bình thường', 
//             class: 'safe', 
//             priority: 0,
//             color: '#10B981',
//             bgColor: '#ECFDF5',
//             borderColor: '#A7F3D0'
//         },
//         warning: { 
//             icon: '⚠️', 
//             text: 'Cảnh báo', 
//             class: 'warning', 
//             priority: 1,
//             color: '#F59E0B',
//             bgColor: '#FFFBEB',
//             borderColor: '#FDE68A'
//         },
//         danger: { 
//             icon: '🚨', 
//             text: 'Nguy hiểm', 
//             class: 'danger', 
//             priority: 2,
//             color: '#EF4444',
//             bgColor: '#FEF2F2',
//             borderColor: '#FECACA'
//         }
//     },

//     // Hệ thống delay cảnh báo
//     delaySystem: {
//         DELAY_TIME: 50000, // 50 giây
//         warningStates: new Map(), // Lưu trạng thái cảnh báo của từng parameter
//         timers: new Map(), // Lưu timer cho từng parameter
//         currentDisplayLevel: 'normal', // Mức hiển thị hiện tại
        
//         // Reset trạng thái delay cho một parameter
//         resetDelay(param) {
//             if (this.timers.has(param)) {
//                 clearTimeout(this.timers.get(param));
//                 this.timers.delete(param);
//             }
//             this.warningStates.delete(param);
//         },

//         // Reset tất cả delay
//         resetAllDelays() {
//             this.timers.forEach(timer => clearTimeout(timer));
//             this.timers.clear();
//             this.warningStates.clear();
//             this.currentDisplayLevel = 'normal';
//         },

//         // Kiểm tra và xử lý delay cho một parameter
//         processDelay(param, currentLevel, value, callback) {
//             const currentState = this.warningStates.get(param);
            
//             // Nếu trạng thái bình thường
//             if (currentLevel === 'normal') {
//                 // Reset delay nếu có
//                 this.resetDelay(param);
//                 return false; // Không hiển thị cảnh báo
//             }
            
//             // Nếu chưa có trạng thái hoặc level thay đổi
//             if (!currentState || currentState.level !== currentLevel) {
//                 // Reset timer cũ nếu có
//                 this.resetDelay(param);
                
//                 // Tạo trạng thái mới
//                 this.warningStates.set(param, {
//                     level: currentLevel,
//                     value: value,
//                     startTime: Date.now()
//                 });
                
//                 // Tạo timer mới
//                 const timer = setTimeout(() => {
//                     // Callback khi hết delay
//                     callback(param, currentLevel, value);
                    
//                     // Cập nhật level hiển thị
//                     const levelPriority = WARNING_SYSTEM.levels[currentLevel].priority;
//                     const currentPriority = WARNING_SYSTEM.levels[this.currentDisplayLevel].priority;
                    
//                     if (levelPriority > currentPriority) {
//                         this.currentDisplayLevel = currentLevel;
//                     }
//                 }, this.DELAY_TIME);
                
//                 this.timers.set(param, timer);
//                 return false; // Chưa hiển thị cảnh báo
//             }
            
//             // Nếu trạng thái không đổi, kiểm tra xem đã qua delay chưa
//             const elapsedTime = Date.now() - currentState.startTime;
//             return elapsedTime >= this.DELAY_TIME;
//         },

//         // Kiểm tra xem có cảnh báo nào đang được hiển thị không
//         hasActiveWarnings() {
//             return this.warningStates.size > 0;
//         },

//         // Lấy thời gian còn lại để hiển thị cảnh báo
//         getRemainingTime(param) {
//             const state = this.warningStates.get(param);
//             if (!state) return 0;
            
//             const elapsed = Date.now() - state.startTime;
//             const remaining = Math.max(0, this.DELAY_TIME - elapsed);
//             return Math.ceil(remaining / 1000); // Trả về giây
//         },

//         // Lấy tất cả trạng thái đang pending
//         getPendingStates() {
//             const pending = [];
//             this.warningStates.forEach((state, param) => {
//                 const remainingTime = this.getRemainingTime(param);
//                 if (remainingTime > 0) {
//                     pending.push({
//                         param,
//                         level: state.level,
//                         value: state.value,
//                         remainingTime
//                     });
//                 }
//             });
//             return pending.sort((a, b) => WARNING_SYSTEM.levels[b.level].priority - WARNING_SYSTEM.levels[a.level].priority);
//         }
//     },

//     // Kiểm tra mức độ cảnh báo
//     checkLevel(param, value) {
//         const threshold = this.thresholds[param];
//         if (!threshold) return 'normal';

//         const [normalMin, normalMax] = threshold.normal;
//         const [warningMin, warningMax] = threshold.warning;
//         const [dangerMin, dangerMax] = threshold.danger;

//         if (value <= dangerMin || value >= dangerMax) {
//             return 'danger';
//         }
        
//         if (value <= warningMin || value >= warningMax) {
//             return 'warning';
//         }
        
//         if (value >= normalMin && value <= normalMax) {
//             return 'normal';
//         }
        
//         return 'warning';
//     },

//     // Tạo thông điệp cảnh báo
//     getMessage(param, value, level) {
//         const threshold = this.thresholds[param];
//         const displayName = threshold?.displayName || param;
//         const unit = threshold?.unit || '';
        
//         const levelMessages = {
//             warning: {
//                 temperature: `${displayName} ${value}${unit} - Thời tiết bất thường`,
//                 temperatureIndoor: `${displayName} ${value}${unit} - Kiểm tra hệ thống điều hòa`,
//                 humidity: `${displayName} ${value}${unit} - Độ ẩm không phù hợp`,
//                 pm25: `${displayName} ${value} ${unit} - Chất lượng không khí kém`,
//                 pm10: `${displayName} ${value} ${unit} - Mức bụi cao`,
//                 coGas: `${displayName} ${value} ${unit} - Nồng độ khí CO cao`,
//                 lpgGas: `${displayName} ${value} ${unit} - Phát hiện khí LPG`,
//                 ch4Gas: `${displayName} ${value} ${unit} - Phát hiện khí CH4`,
//                 pressure: `${displayName} ${value} ${unit} - Áp suất bất thường`,
//                 speed: `${displayName} ${value} ${unit} - Vượt tốc độ cho phép`,
//                 acceleration: `${displayName} ${value} ${unit} - Gia tốc mạnh`,
//                 tiltAngle: `${displayName} ${value}${unit} - Xe bị nghiêng`
//             },
//             danger: {
//                 temperature: `${displayName} ${value}${unit} - NGUY HIỂM CHÁY NỔ!`,
//                 temperatureIndoor: `${displayName} ${value}${unit} - DỪNG XE NGAY LẬP TỨC!`,
//                 humidity: `${displayName} ${value}${unit} - NGUY HIỂM THIẾT BỊ!`,
//                 pm25: `${displayName} ${value} ${unit} - ĐỘC HẠI CỰC KỲ!`,
//                 pm10: `${displayName} ${value} ${unit} - ĐỘC HẠI CỰC KỲ!`,
//                 coGas: `${displayName} ${value} ${unit} - NGUY CƠ TỬ VONG!`,
//                 lpgGas: `${displayName} ${value} ${unit} - NGUY CƠ NỔ!`,
//                 ch4Gas: `${displayName} ${value} ${unit} - NGUY CƠ NỔ!`,
//                 pressure: `${displayName} ${value} ${unit} - BÃO CỰC MẠNH!`,
//                 speed: `${displayName} ${value} ${unit} - NGUY CƠ TAI NẠN!`,
//                 acceleration: `${displayName} ${value} ${unit} - NGUY CƠ LẬT XE!`,
//                 tiltAngle: `${displayName} ${value}${unit} - XE SẮP LẬT!`
//             }
//         };

//         return levelMessages[level]?.[param] || `${displayName}: ${value}${unit}`;
//     },

//     // Kiểm tra tất cả cảnh báo với delay
//     checkAll(data) {
//         const warnings = [];
//         const delayedWarnings = [];
//         let highestLevel = 'normal';
//         let maxPriority = 0;

//         // Callback khi một cảnh báo được kích hoạt sau delay
//         const onDelayComplete = (param, level, value) => {
//             console.log(`⚠️ Cảnh báo được kích hoạt sau 50s: ${param} = ${value}`);
//             // Có thể thêm logic bổ sung ở đây (như gửi thông báo, log, v.v.)
//         };

//         // Kiểm tra lửa - ưu tiên cao, không cần delay
//         const flameDetected = data.flameDetected === 'Yes' || 
//                             data.flame_detected === 1 || 
//                             data.flame_detected === '1' ||
//                             data.flameDetected === 1;

//         if (flameDetected) {
//             warnings.push({
//                 param: 'flame',
//                 level: 'danger',
//                 message: 'PHÁT HIỆN LỬA - NGUY CƠ CHÁY NỔ!',
//                 priority: 999,
//                 immediate: true
//             });
//             highestLevel = 'danger';
//             maxPriority = 999;
//         }

//         // Kiểm tra light leak - ưu tiên thấp hơn, không cần delay
//         const lightLeak = data.lightLeakDetected === 'Yes' || 
//                          data.light_leak_detected === 1 || 
//                          data.light_leak_detected === '1' ||
//                          data.lightLeakDetected === 1;

//         if (lightLeak) {
//             warnings.push({
//                 param: 'lightLeak',
//                 level: 'warning',
//                 message: 'PHÁT HIỆN RÒ RỈ ÁNH SÁNG - Kiểm tra niêm phong!',
//                 priority: 50,
//                 immediate: true
//             });
//             if (50 > maxPriority) {
//                 maxPriority = 50;
//                 highestLevel = 'warning';
//             }
//         }

//         // Kiểm tra các thông số khác với delay
//         Object.keys(this.thresholds).forEach(param => {
//             if (data[param] !== undefined && data[param] !== null) {
//                 const level = this.checkLevel(param, data[param]);
                
//                 if (level !== 'normal') {
//                     // Xử lý delay
//                     const shouldDisplay = this.delaySystem.processDelay(
//                         param, 
//                         level, 
//                         data[param], 
//                         onDelayComplete
//                     );

//                     const priority = this.levels[level].priority;
//                     const warningObj = {
//                         param,
//                         level,
//                         value: data[param],
//                         message: this.getMessage(param, data[param], level),
//                         priority: priority,
//                         category: this.thresholds[param].category,
//                         immediate: false,
//                         delayed: !shouldDisplay,
//                         remainingTime: shouldDisplay ? 0 : this.delaySystem.getRemainingTime(param)
//                     };

//                     if (shouldDisplay) {
//                         // Hiển thị cảnh báo
//                         warnings.push(warningObj);
//                         if (priority > maxPriority) {
//                             maxPriority = priority;
//                             highestLevel = level;
//                         }
//                     } else {
//                         // Thêm vào danh sách delayed
//                         delayedWarnings.push(warningObj);
//                     }
//                 } else {
//                     // Reset delay khi về trạng thái bình thường
//                     this.delaySystem.resetDelay(param);
//                 }
//             }
//         });

//         // Sắp xếp cảnh báo theo độ ưu tiên
//         warnings.sort((a, b) => (b.priority || 0) - (a.priority || 0));
//         delayedWarnings.sort((a, b) => (b.priority || 0) - (a.priority || 0));

//         return {
//             warnings,
//             delayedWarnings,
//             level: highestLevel,
//             count: warnings.length,
//             pendingCount: delayedWarnings.length,
//             config: this.levels[highestLevel],
//             pendingStates: this.delaySystem.getPendingStates()
//         };
//     },

//     // Cập nhật giao diện - CHỈ hiển thị cảnh báo đã xác nhận
//     updateUI(result) {
//         const warningBox = document.getElementById('warningBox');
//         if (!warningBox) return;

//         // Nếu không có cảnh báo đã xác nhận, luôn hiển thị trạng thái bình thường
//         let displayConfig, displayMessage, displayCount;
        
//         if (result.count === 0) {
//             // Không có cảnh báo nào được xác nhận -> Hiển thị bình thường
//             displayConfig = this.levels.normal;
//             displayMessage = 'Tất cả thông số đều ổn định';
//             displayCount = '0 cảnh báo';
//         } else {
//             // Có cảnh báo đã xác nhận -> Hiển thị cảnh báo
//             displayConfig = result.config;
//             const criticalWarning = result.warnings.find(w => w.level === 'danger');
//             const displayWarning = criticalWarning || result.warnings[0];
//             displayMessage = displayWarning.message;
//             displayCount = `${result.count} cảnh báo`;
//         }
        
//         // Cập nhật giao diện với trạng thái đã xác định
//         warningBox.className = `warning-box ${displayConfig.class}`;
//         warningBox.style.backgroundColor = displayConfig.bgColor;
//         warningBox.style.borderColor = displayConfig.borderColor;
//         warningBox.style.borderWidth = '2px';
//         warningBox.style.borderStyle = 'solid';
        
//         // Cập nhật icon
//         const warningIcon = warningBox.querySelector('.warning-icon');
//         if (warningIcon) {
//             warningIcon.textContent = displayConfig.icon;
//         }
        
//         // Cập nhật tiêu đề
//         const warningTitle = document.getElementById('warningTitle');
//         if (warningTitle) {
//             warningTitle.textContent = displayConfig.text;
//             warningTitle.style.color = displayConfig.color;
//         }
        
//         // Cập nhật thông điệp
//         const warningMessage = document.getElementById('warningMessage');
//         if (warningMessage) {
//             warningMessage.textContent = displayMessage;
//         }
        
//         // Cập nhật số lượng cảnh báo - CHỈ hiển thị cảnh báo đã xác nhận
//         const warningLevel = document.getElementById('warningLevel');
//         if (warningLevel) {
//             warningLevel.textContent = displayCount;
//             warningLevel.style.color = displayConfig.color;
//         }

//         // ẨN thông tin pending để không làm người dùng bối rối
//         const pendingInfo = document.getElementById('pendingInfo');
//         if (pendingInfo) {
//             pendingInfo.style.display = 'none';
//         }
//     },

//     // Thống kê hệ thống delay
//     getDelayStats() {
//         return {
//             totalPending: this.delaySystem.warningStates.size,
//             pendingDetails: this.delaySystem.getPendingStates(),
//             delayTime: this.delaySystem.DELAY_TIME / 1000, // giây
//             hasActiveWarnings: this.delaySystem.hasActiveWarnings()
//         };
//     },

//     // Reset toàn bộ hệ thống delay
//     resetDelaySystem() {
//         this.delaySystem.resetAllDelays();
//         console.log('🔄 Đã reset hệ thống delay cảnh báo');
//     }
// };

// // Hàm sử dụng chính với delay
// function checkWarnings(data) {
//     const result = WARNING_SYSTEM.checkAll(data);
//     WARNING_SYSTEM.updateUI(result);
//     return result;
// }

// // Hàm tiện ích để debug
// function getWarningStats() {
//     return WARNING_SYSTEM.getDelayStats();
// }

// // Export API mở rộng
// window.warningSystem = { 
//     checkWarnings,
//     getWarningStats,
//     resetDelaySystem: () => WARNING_SYSTEM.resetDelaySystem(),
//     WARNING_SYSTEM,
//     getThresholds: () => WARNING_SYSTEM.thresholds,
//     getLevels: () => WARNING_SYSTEM.levels,
//     checkSingleParam: (param, value) => WARNING_SYSTEM.checkLevel(param, value),
//     getDelayTime: () => WARNING_SYSTEM.delaySystem.DELAY_TIME / 1000,
//     setDelayTime: (seconds) => {
//         WARNING_SYSTEM.delaySystem.DELAY_TIME = seconds * 1000;
//         console.log(`⏰ Đã đặt thời gian delay: ${seconds} giây`);
//     }
// };

// console.log('⚡ Hệ thống cảnh báo với delay 20 giây đã sẵn sàng!');


const WARNING_SYSTEM = {
    // Warning thresholds - Based on actual warning tables
    thresholds: {
        // Temperature
        temperature: { 
            normal: [0, 35], 
            warning: [35.1, 40], 
            danger: [40.1, 100], 
            unit: '°C', 
            displayName: 'Temperature', 
            category: 'environment'
        },
        
        // Humidity
        humidity: { 
            normal: [0, 95], 
            warning: [95.1, 100], 
            danger: [100.1, 120], 
            unit: '%', 
            displayName: 'Humidity', 
            category: 'environment'
        },
        
        // PM2.5
        pm25: { 
            normal: [0, 50], 
            warning: [50.1, 100], 
            danger: [100.1, 1000], 
            unit: 'μg/m³', 
            displayName: 'PM2.5', 
            category: 'air'
        },
        
        // PM10
        pm10: { 
            normal: [0, 80], 
            warning: [80.1, 150], 
            danger: [150.1, 1000], 
            unit: 'μg/m³', 
            displayName: 'PM10', 
            category: 'air'
        },
        
        // CO Gas (ppm)
        coGas: { 
            normal: [0, 10], 
            warning: [10.1, 20], 
            danger: [20.1, 30], 
            unit: 'ppm', 
            displayName: 'CO Gas', 
            category: 'gas'
        },
        
        // Pressure
        pressure: { 
            normal: [980, 1040], 
            warning: [950, 979.9], 
            danger: [0, 949.9], 
            unit: 'hPa', 
            displayName: 'Pressure', 
            category: 'environment'
        },
        
        // Tilt angle
        tiltAngle: { 
            normal: [0, 20], 
            warning: [20.1, 30], 
            danger: [30.1, 90], 
            unit: '°', 
            displayName: 'Tilt Angle', 
            category: 'vehicle'
        },
        
        // Acceleration
        acceleration: { 
            normal: [0, 1.5], 
            warning: [1.51, 2], 
            danger: [2.01, 10], 
            unit: 'm/s²', 
            displayName: 'Acceleration', 
            category: 'vehicle'
        },
        
        // Speed - special for status
        speed: { 
            normal: [0, 200], 
            warning: [0, 200], 
            danger: [0, 200], 
            unit: 'km/h', 
            displayName: 'Speed', 
            category: 'vehicle'
        }
    },

    // Special boolean parameters
    booleanParams: {
        flameDetected: {
            displayName: 'Fire Detection',
            category: 'safety',
            trueValues: ['Yes', 1, '1', true],
            level: 'danger',
            message: 'FIRE DETECTED - IMMEDIATE DANGER!',
            priority: 999
        },
        lightLeakDetected: {
            displayName: 'Light Leak Detection', 
            category: 'safety',
            trueValues: ['Yes', 1, '1', true],
            level: 'danger',
            message: 'LIGHT LEAK DETECTED - CRITICAL RISK!',
            priority: 900
        }
    },

    // Special vehicle status
    statusParams: {
        moving: {
            displayName: 'Vehicle Moving',
            speedCheck: (speed) => speed > 5,
            level: 'normal',
            message: 'Vehicle is moving',
            priority: 1
        },
        idle: {
            displayName: 'Vehicle Idle', 
            speedCheck: (speed) => speed <= 5 && speed > 0,
            level: 'normal',
            message: 'Vehicle is idle',
            priority: 1
        },
        stopped: {
            displayName: 'Vehicle Stopped',
            speedCheck: (speed) => speed === 0,
            level: 'normal', 
            message: 'Vehicle stopped',
            priority: 1
        },
        emergency: {
            displayName: 'Emergency Alert',
            level: 'danger',
            message: 'EMERGENCY SITUATION!',
            priority: 800
        },
        offline: {
            displayName: 'Device Offline',
            level: 'warning',
            message: 'Device connection lost',
            priority: 100
        }
    },

    // Display configuration
    levels: {
        normal: { 
            icon: '✅', 
            text: 'Normal', 
            class: 'safe', 
            priority: 0,
            color: '#10B981',
            bgColor: '#ECFDF5',
            borderColor: '#A7F3D0'
        },
        warning: { 
            icon: '⚠️', 
            text: 'Warning', 
            class: 'warning', 
            priority: 1,
            color: '#F59E0B',
            bgColor: '#FFFBEB',
            borderColor: '#FDE68A'
        },
        danger: { 
            icon: '🚨', 
            text: 'Danger', 
            class: 'danger', 
            priority: 2,
            color: '#EF4444',
            bgColor: '#FEF2F2',
            borderColor: '#FECACA'
        }
    },

    // Simple delay system
    delays: new Map(),
    DELAY_TIME: 5000, // 5 seconds for testing, 20s in production

    // Check warning level - FIXED LOGIC
    checkLevel(param, value) {
        const threshold = this.thresholds[param];
        if (!threshold) return 'normal';

        const [normalMin, normalMax] = threshold.normal;
        const [warningMin, warningMax] = threshold.warning;
        const [dangerMin, dangerMax] = threshold.danger;

        // Check normal range first
        if (value >= normalMin && value <= normalMax) {
            return 'normal';
        }
        
        // Check danger range
        if (value >= dangerMin && value <= dangerMax) {
            return 'danger';
        }
        
        // Remaining is warning
        if (value >= warningMin && value <= warningMax) {
            return 'warning';
        }

        return 'normal';
    },

    // Check special status for pressure
    checkPressureSpecial(value) {
        if (value < 980) return 'warning';
        if (value > 1040) return 'warning';
        return 'normal';
    },

    // Handle delay processing
    processDelay(param, level) {
        if (level === 'normal') {
            // Reset delay when returning to normal
            const existing = this.delays.get(param);
            if (existing) {
                clearTimeout(existing.timer);
                this.delays.delete(param);
            }
            return false;
        }

        const existing = this.delays.get(param);
        
        // If no delay exists or level changed
        if (!existing || existing.level !== level) {
            // Clear old timer
            if (existing) clearTimeout(existing.timer);
            
            // Create new delay
            this.delays.set(param, {
                level,
                startTime: Date.now(),
                timer: setTimeout(() => {
                    console.log(`⚠️ Delay complete: ${param} - ${level}`);
                }, this.DELAY_TIME)
            });
            return false;
        }

        // Check if delay time has passed
        return Date.now() - existing.startTime >= this.DELAY_TIME;
    },

    // Create warning message
    getMessage(param, value, level) {
        const threshold = this.thresholds[param];
        const displayName = threshold?.displayName || param;
        const unit = threshold?.unit || '';
        
        const levelMessages = {
            warning: {
                temperature: `${displayName} ${value}${unit} - High temperature warning`,
                humidity: `${displayName} ${value}${unit} - Humidity too high`,
                pm25: `${displayName} ${value} ${unit} - Poor air quality`,
                pm10: `${displayName} ${value} ${unit} - High PM10 dust`,
                coGas: `${displayName} ${value} ppm - CO gas exceeds limit`,
                pressure: `${displayName} ${value} ${unit} - Abnormal pressure`,
                tiltAngle: `${displayName} ${value}${unit} - Vehicle tilting`,
                acceleration: `${displayName} ${value} ${unit} - Strong acceleration`,
                speed: `${displayName} ${value} ${unit} - High speed`
            },
            danger: {
                temperature: `${displayName} ${value}${unit} - DANGEROUS TEMPERATURE!`,
                humidity: `${displayName} ${value}${unit} - EXTREMELY HIGH HUMIDITY!`,
                pm25: `${displayName} ${value} ${unit} - TOXIC AIR QUALITY!`,
                pm10: `${displayName} ${value} ${unit} - EXTREMELY DANGEROUS DUST!`,
                coGas: `${displayName} ${value} ppm - LETHAL CO GAS!`,
                pressure: `${displayName} ${value} ${unit} - EXTREMELY LOW PRESSURE!`,
                tiltAngle: `${displayName} ${value}${unit} - VEHICLE ABOUT TO FLIP!`,
                acceleration: `${displayName} ${value} ${unit} - ACCIDENT RISK!`,
                speed: `${displayName} ${value} ${unit} - DANGEROUS SPEED!`
            }
        };

        return levelMessages[level]?.[param] || `${displayName}: ${value}${unit}`;
    },

    // Check all parameters with delay
    checkAll(data) {
        const warnings = [];
        let highestLevel = 'normal';
        let maxPriority = 0;

        // 1. Check flame - no delay
        const flameDetected = this.checkBooleanParam('flameDetected', data);
        if (flameDetected) {
            warnings.push(flameDetected);
            highestLevel = 'danger';
            maxPriority = 999;
        }

        // 2. Check light leak - no delay  
        const lightLeak = this.checkBooleanParam('lightLeakDetected', data);
        if (lightLeak && !flameDetected) {
            warnings.push(lightLeak);
            if (lightLeak.priority > maxPriority) {
                maxPriority = lightLeak.priority;
                highestLevel = lightLeak.level;
            }
        }

        // 3. Check parameters with delay
        Object.keys(this.thresholds).forEach(param => {
            if (data[param] !== undefined && data[param] !== null) {
                let level;
                
                // Special handling for pressure
                if (param === 'pressure') {
                    level = this.checkPressureSpecial(data[param]);
                } else {
                    level = this.checkLevel(param, data[param]);
                }
                
                // Process delay
                const shouldDisplay = this.processDelay(param, level);
                
                if (shouldDisplay && level !== 'normal') {
                    const priority = this.levels[level].priority;
                    warnings.push({
                        param,
                        level,
                        value: data[param],
                        message: this.getMessage(param, data[param], level),
                        priority: priority,
                        category: this.thresholds[param].category
                    });
                    
                    if (priority > maxPriority) {
                        maxPriority = priority;
                        highestLevel = level;
                    }
                }
            }
        });

        // 4. Check vehicle status (based on speed)
        if (data.speed !== undefined) {
            const vehicleStatus = this.checkVehicleStatus(data.speed);
            if (vehicleStatus && vehicleStatus.level !== 'normal') {
                warnings.push(vehicleStatus);
            }
        }

        // Sort by priority
        warnings.sort((a, b) => (b.priority || 0) - (a.priority || 0));

        return {
            warnings,
            level: highestLevel,
            count: warnings.length,
            config: this.levels[highestLevel]
        };
    },

    // Check boolean parameter
    checkBooleanParam(paramName, data) {
        const config = this.booleanParams[paramName];
        if (!config) return null;

        const value = data[paramName] || data[paramName.toLowerCase()] || 
                     data[paramName.replace(/([A-Z])/g, '_$1').toLowerCase()];
        
        const isActive = config.trueValues.includes(value);
        
        if (isActive) {
            return {
                param: paramName,
                level: config.level,
                message: config.message,
                priority: config.priority,
                category: config.category,
                immediate: true
            };
        }
        return null;
    },

    // Check vehicle status
    checkVehicleStatus(speed) {
        if (speed > 5) {
            return {
                param: 'status',
                level: 'normal',
                message: 'Moving',
                priority: 1,
                category: 'status'
            };
        } else if (speed > 0 && speed <= 5) {
            return {
                param: 'status', 
                level: 'normal',
                message: 'Idling',
                priority: 1,
                category: 'status'
            };
        } else if (speed === 0) {
            return {
                param: 'status',
                level: 'normal', 
                message: 'Stopped',
                priority: 1,
                category: 'status'
            };
        }
        return null;
    },

    // Update UI - display warnings
    updateUI(result) {
        const warningBox = document.getElementById('warningBox');
        if (!warningBox) return;

        const config = result.config;
        warningBox.className = `warning-box ${config.class}`;
        warningBox.style.backgroundColor = config.bgColor;
        warningBox.style.borderColor = config.borderColor;
        warningBox.style.borderWidth = '2px';
        warningBox.style.borderStyle = 'solid';
        
        const warningIcon = warningBox.querySelector('.warning-icon');
        if (warningIcon) {
            warningIcon.textContent = config.icon;
        }
        
        const warningTitle = document.getElementById('warningTitle');
        if (warningTitle) {
            warningTitle.textContent = config.text;
            warningTitle.style.color = config.color;
        }
        
        const warningMessage = document.getElementById('warningMessage');
        if (warningMessage) {
            if (result.count === 0) {
                warningMessage.textContent = 'All parameters are stable';
            } else {
                // Display top 3 warnings
                const topWarnings = result.warnings.slice(0, 3);
                const messages = topWarnings.map(w => w.message).join(' | ');
                const moreCount = result.warnings.length - 3;
                
                warningMessage.textContent = messages + 
                    (moreCount > 0 ? ` | +${moreCount} more warnings...` : '');
            }
        }
        
        const warningLevel = document.getElementById('warningLevel');
        if (warningLevel) {
            warningLevel.textContent = `${result.count} warnings`;
            warningLevel.style.color = config.color;
        }
    }
};

// Test function with real data
function testWarningSystem() {
    console.log('🧪 Testing warning system with real data:');
    
    const testData = {
        temperature: 31.7,    // Normal
        humidity: 55,         // Normal
        pm25: 7,             // Normal
        pm10: 16,            // Normal
        coGas: 0,            // Normal (μg/m³ -> ppm conversion needed)
        pressure: 993,        // Warning (< 980)
        tiltAngle: 0,        // Normal
        speed: 0,            // Stopped
        acceleration: 1.7,    // Warning
        flameDetected: 'No',  // Normal
        lightLeakDetected: 'No' // Normal
    };
    
    console.log('📊 Test data:', testData);
    
    const result = WARNING_SYSTEM.checkAll(testData);
    console.log('⚠️ Warning result:', result);
    
    // Test with dangerous data
    const dangerData = {
        temperature: 45,      // Danger
        coGas: 25,           // Danger  
        flameDetected: 'Yes', // Danger
        tiltAngle: 35,       // Danger
        acceleration: 3      // Danger
    };
    
    console.log('🚨 Testing danger conditions:', dangerData);
    const dangerResult = WARNING_SYSTEM.checkAll(dangerData);
    console.log('🔥 Danger result:', dangerResult);
}

// Main function
function checkWarnings(data) {
    const result = WARNING_SYSTEM.checkAll(data);
    WARNING_SYSTEM.updateUI(result);
    return result;
}

// Export functions
window.warningSystem = { 
    checkWarnings,
    WARNING_SYSTEM,
    testWarningSystem,
    resetDelays: () => {
        WARNING_SYSTEM.delays.forEach(d => clearTimeout(d.timer));
        WARNING_SYSTEM.delays.clear();
    },
    setDelayTime: (seconds) => WARNING_SYSTEM.DELAY_TIME = seconds * 1000,
    
    // Get all current warnings
    getAllActiveWarnings: (data) => {
        return WARNING_SYSTEM.checkAll(data).warnings;
    },
    
    // Check overall status
    getOverallStatus: (data) => {
        const result = WARNING_SYSTEM.checkAll(data);
        return {
            level: result.level,
            count: result.count,
            hasImmediate: result.warnings.some(w => w.immediate),
            topWarning: result.warnings[0]
        };
    }
};

console.log('⚡ Complete warning system loaded!');
console.log('🧪 Run testWarningSystem() to test with real data');

// Auto-run test
testWarningSystem();