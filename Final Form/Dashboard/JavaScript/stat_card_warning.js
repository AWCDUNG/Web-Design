const STAT_CARD_WARNING = {
    // Mapping giữa tên parameter và class name của card
    cardMapping: {
        temperature: 'temperature',
        temperatureIndoor: 'temperature-indoor',
        humidity: 'humidity',
        pm25: 'air-quality',
        pm10: 'air-quality-pm10',
        coGas: 'co-gas',
        lpgGas: 'lpg-gas',
        ch4Gas: 'ch4-gas',
        pressure: 'pressure',
        speed: 'speed',
        acceleration: 'acceleration',
        tiltAngle: 'tilt-angle',
        lightLeak: 'light-leak',
        flame: 'flame-sensor'
    },

    // CSS styles cho các warning levels - CHỈ THAY ĐỔI MÀU SẮC
    warningStyles: {
        normal: {
            // Không thay đổi gì cho trạng thái bình thường
        },
        warning: {
            backgroundColor: '#fefce8',
            borderColor: '#fbbf24'
        },
        danger: {
            backgroundColor: '#fef2f2',
            borderColor: '#ef4444'
        }
    },

    // Khởi tạo CSS animations
    initializeStyles() {
        // Kiểm tra xem style đã được thêm chưa
        if (document.getElementById('cardWarningStyles')) return;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'cardWarningStyles';
        styleSheet.textContent = `
            /* Chỉ thêm class để nhận dạng warning states */
            .stat-card.warning-active {
                background-color: #fefce8 !important;
                border-color: #fbbf24 !important;
            }
            
            .stat-card.danger-active {
                background-color: #fef2f2 !important;
                border-color: #ef4444 !important;
            }
            
            /* Thay đổi màu chữ số */
            .stat-card.warning-active .stat-number {
                color: #d97706 !important;
            }
            
            .stat-card.danger-active .stat-number {
                color: #dc2626 !important;
            }
        `;
        document.head.appendChild(styleSheet);
    },

    // Áp dụng style cho card - CHỈ THAY ĐỔI MÀU SẮC
    applyCardStyle(cardElement, level) {
        if (!cardElement) {
            console.warn('Card element not found');
            return;
        }

        try {
            // Reset classes
            cardElement.classList.remove('warning-active', 'danger-active');
            
            // Chỉ thêm class để thay đổi màu, không động vào style
            if (level === 'warning') {
                cardElement.classList.add('warning-active');
            } else if (level === 'danger') {
                cardElement.classList.add('danger-active');
            }
            
            console.log(`✅ Applied ${level} style to card:`, cardElement.className);
            
        } catch (error) {
            console.error('Error applying card style:', error);
        }
    },

    // Tìm card element dựa trên parameter name - CẢI THIỆN
    findCardElement(paramName) {
        const cardClass = this.cardMapping[paramName];
        if (!cardClass) {
            console.warn(`No card mapping found for param: ${paramName}`);
            return null;
        }
        
        // Thử nhiều cách tìm card element
        let cardElement = document.querySelector(`.stat-card.${cardClass}`);
        
        if (!cardElement) {
            // Thử tìm theo class riêng lẻ
            cardElement = document.querySelector(`.${cardClass}`);
        }
        
        if (!cardElement) {
            // Thử tìm theo data attribute
            cardElement = document.querySelector(`[data-param="${paramName}"]`);
        }
        
        if (!cardElement) {
            console.warn(`Card element not found for: ${paramName} (class: ${cardClass})`);
        }
        
        return cardElement;
    },

    // Reset tất cả cards về trạng thái bình thường - CẢI THIỆN
    resetAllCards() {
        const cards = document.querySelectorAll('.stat-card');
        
        if (cards.length === 0) {
            console.warn('No stat cards found to reset');
            return;
        }
        
        cards.forEach(card => {
            try {
                // Khôi phục style gốc nếu có
                if (card.dataset.originalStyle) {
                    card.style.cssText = card.dataset.originalStyle;
                } else {
                    this.applyCardStyle(card, 'normal');
                }
                
                // Xóa title tooltip
                card.removeAttribute('title');
                
            } catch (error) {
                console.error('Error resetting card:', error, card);
            }
        });
        
        console.log(`🔄 Reset ${cards.length} cards to normal state`);
    },

    // Cập nhật trạng thái card dựa trên warnings
    updateCardStates(warnings) {
        try {
            // Reset tất cả cards trước
            this.resetAllCards();
            
            if (!warnings || warnings.length === 0) {
                console.log('No warnings to apply');
                return;
            }
            
            // Áp dụng warning cho các cards có vấn đề
            warnings.forEach(warning => {
                const cardElement = this.findCardElement(warning.param);
                if (cardElement) {
                    this.applyCardStyle(cardElement, warning.level);
                    
                    // Thêm tooltip nếu muốn
                    cardElement.title = warning.message;
                    
                    console.log(`📊 Updated card: ${warning.param} - ${warning.level}`);
                } else {
                    console.warn(`Card not found for param: ${warning.param}`);
                }
            });
            
        } catch (error) {
            console.error('Error updating card states:', error);
        }
    },

    // Xử lý warning đặc biệt cho flame và light leak
    handleSpecialWarnings(data) {
        const specialWarnings = [];
        
        try {
            // Flame detection
            const flameDetected = data.flameDetected === 'Yes' || 
                                data.flame_detected === 1 || 
                                data.flame_detected === '1' ||
                                data.flameDetected === 1;
            
            if (flameDetected) {
                specialWarnings.push({
                    param: 'flame',
                    level: 'danger',
                    message: 'FIRE DETECTED!'
                });
            }
            
            // Light leak detection
            const lightLeak = data.lightLeakDetected === 'Yes' || 
                             data.light_leak_detected === 1 || 
                             data.light_leak_detected === '1' ||
                             data.lightLeakDetected === 1;
            
            if (lightLeak) {
                specialWarnings.push({
                    param: 'lightLeak',
                    level: 'warning',
                    message: 'Light leak detected!'
                });
            }
            
        } catch (error) {
            console.error('Error handling special warnings:', error);
        }
        
        return specialWarnings;
    },

    // Hàm chính để cập nhật tất cả card warnings - CẢI THIỆN
    updateAllCardWarnings(data) {
        try {
            // Khởi tạo styles nếu chưa có
            this.initializeStyles();
            
            // Kiểm tra xem có cards không
            const cards = document.querySelectorAll('.stat-card');
            if (cards.length === 0) {
                console.warn('No stat cards found in DOM');
                return [];
            }
            
            // Lấy warnings từ WARNING_SYSTEM nếu có
            let allWarnings = [];
            
            if (window.warningSystem && window.warningSystem.WARNING_SYSTEM) {
                const result = window.warningSystem.WARNING_SYSTEM.checkAll(data);
                allWarnings = result.warnings;
            } else {
                // Nếu không có WARNING_SYSTEM, tự kiểm tra cơ bản
                console.warn('WARNING_SYSTEM not found, using basic threshold check');
                allWarnings = this.basicThresholdCheck(data);
            }
            
            // Thêm special warnings
            const specialWarnings = this.handleSpecialWarnings(data);
            allWarnings = [...allWarnings, ...specialWarnings];
            
            // Cập nhật card states
            this.updateCardStates(allWarnings);
            
            return allWarnings;
            
        } catch (error) {
            console.error('Error in updateAllCardWarnings:', error);
            return [];
        }
    },

    // Kiểm tra ngưỡng cơ bản nếu không có WARNING_SYSTEM
    basicThresholdCheck(data) {
        const warnings = [];
        const basicThresholds = {
            temperature: { warning: [5, 55], danger: [-10, 75] },
            temperatureIndoor: { warning: [10, 45], danger: [0, 65] },
            humidity: { warning: [20, 90], danger: [0, 100] },
            pm25: { warning: [51, 150], danger: [151, 1000] },
            pm10: { warning: [51, 200], danger: [201, 1000] },
            coGas: { warning: [101, 500], danger: [501, 2000] },
            lpgGas: { warning: [51, 200], danger: [201, 1000] },
            ch4Gas: { warning: [51, 150], danger: [151, 500] },
            pressure: { warning: [990, 1030], danger: [950, 1070] },
            speed: { warning: [61, 90], danger: [91, 200] },
            acceleration: { warning: [2.1, 4], danger: [4.1, 10] },
            tiltAngle: { warning: [16, 30], danger: [31, 90] }
        };
        
        Object.keys(basicThresholds).forEach(param => {
            if (data[param] !== undefined && data[param] !== null) {
                const value = parseFloat(data[param]);
                const thresholds = basicThresholds[param];
                
                if (isNaN(value)) return;
                
                const [dangerMin, dangerMax] = thresholds.danger;
                const [warningMin, warningMax] = thresholds.warning;
                
                if (value <= dangerMin || value >= dangerMax) {
                    warnings.push({ param, level: 'danger', message: `${param}: ${value}` });
                } else if (value <= warningMin || value >= warningMax) {
                    warnings.push({ param, level: 'warning', message: `${param}: ${value}` });
                }
            }
        });
        
        return warnings;
    },

    // Hàm debug để kiểm tra DOM
    debugCards() {
        console.log('🔍 Debug: Checking card elements...');
        const cards = document.querySelectorAll('.stat-card');
        console.log(`Found ${cards.length} stat cards`);
        
        cards.forEach((card, index) => {
            console.log(`Card ${index}:`, {
                classes: card.className,
                display: window.getComputedStyle(card).display,
                visibility: window.getComputedStyle(card).visibility,
                opacity: window.getComputedStyle(card).opacity
            });
        });
        
        // Kiểm tra mapping
        Object.keys(this.cardMapping).forEach(param => {
            const cardElement = this.findCardElement(param);
            console.log(`${param}: ${cardElement ? 'FOUND' : 'NOT FOUND'}`);
        });
    },

    // Hàm tiện ích để test
    testCardColors() {
        console.log('🧪 Testing card colors...');
        
        // Debug trước khi test
        this.debugCards();
        
        // Test data với các giá trị vượt ngưỡng
        const testData = {
            temperature: 60, // danger
            humidity: 95,    // warning
            pm25: 200,       // danger
            speed: 85,       // warning
            flameDetected: 'Yes' // danger
        };
        
        this.updateAllCardWarnings(testData);
        
        // Reset sau 5 giây
        setTimeout(() => {
            console.log('🔄 Resetting cards to normal...');
            this.resetAllCards();
        }, 5000);
    }
};

// Auto-initialize khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        STAT_CARD_WARNING.initializeStyles();
        console.log('🎨 Stat Card Warning System initialized!');
        
        // Debug sau khi DOM loaded
        setTimeout(() => {
            STAT_CARD_WARNING.debugCards();
        }, 1000);
        
    } catch (error) {
        console.error('Error initializing Stat Card Warning System:', error);
    }
});

// Export functions để sử dụng
window.statCardWarning = {
    updateCards: (data) => STAT_CARD_WARNING.updateAllCardWarnings(data),
    resetCards: () => STAT_CARD_WARNING.resetAllCards(),
    testColors: () => STAT_CARD_WARNING.testCardColors(),
    debugCards: () => STAT_CARD_WARNING.debugCards(),
    STAT_CARD_WARNING
};

// Integration với WARNING_SYSTEM nếu có - CẢI THIỆN
try {
    if (window.warningSystem) {
        const originalCheckWarnings = window.warningSystem.checkWarnings;
        
        if (originalCheckWarnings) {
            window.warningSystem.checkWarnings = function(data) {
                const result = originalCheckWarnings.call(this, data);
                // Cập nhật card colors
                STAT_CARD_WARNING.updateAllCardWarnings(data);
                return result;
            };
            
            console.log('🔗 Integrated with existing WARNING_SYSTEM');
        }
    }
} catch (error) {
    console.error('Error integrating with WARNING_SYSTEM:', error);
}

console.log('✅ Stat Card Warning System loaded successfully!');