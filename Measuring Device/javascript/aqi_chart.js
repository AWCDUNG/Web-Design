/**
 * AQI Chart Library - Thư viện biểu đồ chất lượng không khí
 * Version: 2.0
 * Author: Van Dung
 */
class AQIChart {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            chartHeight: 210,   // Chiều cao của biểu đồ
            leftMargin: 60, // Lề trái
            bottomMargin: 40,   // Lề dưới
            rightMargin: 20,    // Lề phải
            topMargin: 20,  // Lề trên
            barGap: 9,  // Khoảng cách giữa các thanh
            minBarWidth: 16,        // Chiều rộng tối thiểu của thanh
            maxBarWidth: 25,        // Chiều rộng tối đa của thanh
            showValues: true,   // Hiển thị giá trị trên thanh
            showTooltip: true,  // Hiển thị tooltip khi hover
            animationDuration: 300, // Thời gian hiệu ứng khi hover
            ...options
        };
        this.tooltip = null;
        this.init();
    }

    init() {
        this.createTooltip();
    }

    // Hàm chính để cập nhật biểu đồ
    updateChart(data) {
        const chartContainer = document.getElementById(this.containerId);
        if (!chartContainer) {
            console.error(`Container với ID '${this.containerId}' không tồn tại`);
            return;
        }
        chartContainer.innerHTML = '';
        // Thiết lập các thông số cho đồ thị
        const maxValue = Math.max(...data, 50);
        // const { chartHeight, leftMargin, bottomMargin, rightMargin, topMargin } = this.options;
        // Container chính cho toàn bộ chart
        const mainContainer = this.createMainContainer();
        // Vùng chứa biểu đồ chính
        const plotArea = this.createPlotArea();
        // Tạo trục Y với các mức giá trị
        this.createYAxis(mainContainer, maxValue);
        // Tạo grid lines nền
        this.createGridLines(plotArea);
        // Tạo các thanh biểu đồ
        const barsContainer = this.createBarsContainer(data, maxValue);
        plotArea.appendChild(barsContainer);
        mainContainer.appendChild(plotArea);
        // Tạo trục X với nhãn thời gian
        this.createXAxis(mainContainer, data.length);
        chartContainer.appendChild(mainContainer);
        // Thêm legend
        this.addChartLegend(chartContainer, maxValue);
    }
    // Tạo container chính
    createMainContainer() {
        const { chartHeight, leftMargin, bottomMargin, rightMargin, topMargin } = this.options;
        const mainContainer = document.createElement('div');
        mainContainer.style.cssText = `
            position: relative;
            width: 100%;
            border-radius: 12px;
            padding: ${topMargin}px ${rightMargin}px ${bottomMargin}px ${leftMargin}px;
            box-sizing: border-box;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            margin-top: 20px;
            transform: translateY(60px);
        `;
        return mainContainer;
    }

    // Tạo vùng biểu đồ
    createPlotArea() {
        const plotArea = document.createElement('div');
        plotArea.style.cssText = `
            position: relative;
            width: 100%;
            height: ${this.options.chartHeight}px;
            border-left: 2px solid rgba(255,255,255,0.4);
            border-bottom: 2px solid rgba(255,255,255,0.4);
            border-radius: 0 0 0 4px;
            
        `;
        return plotArea;
    }

    // Tạo container cho các thanh
    createBarsContainer(data, maxValue) {
        const barsContainer = document.createElement('div');
        barsContainer.style.cssText = `
            display: flex;
            align-items: end;
            height: 100%;
            gap: ${this.options.barGap}px;
            padding: 5px;
            position: relative;
            z-index: 2;
        `;

        const heightRatio = (this.options.chartHeight - 10) / maxValue;

        data.forEach((value, index) => {
            const barContainer = this.createBarContainer();
            const bar = this.createBar(value, heightRatio, index);

            barContainer.appendChild(bar);
            barsContainer.appendChild(barContainer);
        });

        return barsContainer;
    }

    // Tạo container cho mỗi thanh
    createBarContainer() {
        const barContainer = document.createElement('div');
        barContainer.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            min-width: ${this.options.minBarWidth}px;
            max-width: ${this.options.maxBarWidth}px;
        `;
        return barContainer;
    }

    // Tạo thanh biểu đồ
    createBar(value, heightRatio, index) {
        const bar = document.createElement('div');
        const height = Math.max(5, value * heightRatio);
        const colors = this.getAQIColors(value);

        bar.style.cssText = `
            width: 100%;
            height: ${height}px;
            background: linear-gradient(180deg, ${colors.gradientColor} 0%, ${colors.backgroundColor} 100%);
            border-radius: 4px 4px 0 0;
            position: relative;
            transition: all ${this.options.animationDuration}ms ease;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            border: 1px solid rgba(255,255,255,0.3);
        `;

        // Thêm hiệu ứng và events
        this.addBarEffects(bar, value, index);

        // Thêm highlight
        this.addBarHighlight(bar);

        // Thêm label giá trị nếu cần
        if (this.options.showValues && value > 20) {
            this.addValueLabel(bar, value, colors.textColor);
        }

        return bar;
    }

    // Thêm hiệu ứng hover cho thanh
    addBarEffects(bar, value, index) {
        bar.addEventListener('mouseenter', (e) => {
            bar.style.transform = 'scaleY(1.05) scaleX(1.1)';
            bar.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
            bar.style.zIndex = '10';

            if (this.options.showTooltip) {
                this.showTooltip(e.target, value, index);
            }
        });

        bar.addEventListener('mouseleave', () => {
            bar.style.transform = 'scaleY(1) scaleX(1)';
            bar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            bar.style.zIndex = '2';

            this.hideTooltip();
        });
    }

    // Thêm điểm sáng cho thanh
    addBarHighlight(bar) {
        const highlight = document.createElement('div');
        highlight.style.cssText = `
            position: absolute;
            top: 1px;
            left: 15%;
            right: 15%;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
            border-radius: 1px;
        `;
        bar.appendChild(highlight);
    }

    // Thêm label giá trị
    addValueLabel(bar, value, textColor) {
        const valueLabel = document.createElement('div');
        valueLabel.textContent = Math.round(value);
        valueLabel.style.cssText = `
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            font-weight: bold;
            color: ${textColor};
            background: rgba(255,255,255,0.95);
            padding: 2px 6px;
            border-radius: 4px;
            min-width: 18px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        `;
        bar.appendChild(valueLabel);
    }

    // Lấy màu sắc theo chỉ số AQI
    getAQIColors(value) {
        if (value <= 50) {
            return {
                backgroundColor: '#40c057',
                gradientColor: '#51cf66',
                textColor: '#2b8a3e'
            };
        } else if (value <= 100) {
            return {
                backgroundColor: '#ffd43b',
                gradientColor: '#ffe066',
                textColor: '#fab005'
            };
        } else if (value <= 150) {
            return {
                backgroundColor: '#fd7e14',
                gradientColor: '#ff922b',
                textColor: '#e8590c'
            };
        } else if (value <= 200) {
            return {
                backgroundColor: '#e03131',
                gradientColor: '#ff5252',
                textColor: '#c92a2a'
            };
        } else if (value <= 300) {
            return {
                backgroundColor: '#9c36b5',
                gradientColor: '#b644d1',
                textColor: '#862e9c'
            };
        } else {
            return {
                backgroundColor: '#7a0c0c',
                gradientColor: '#a61e1e',
                textColor: '#7a0c0c'
            };
        }
    }

    // Tạo trục Y
    createYAxis(container, maxValue) {
        const { chartHeight, leftMargin, topMargin } = this.options;
        const yAxisContainer = document.createElement('div');
        yAxisContainer.style.cssText = `
            position: absolute;
            left: 0;
            top: ${topMargin}px;
            width: ${leftMargin - 5}px;
            height: ${chartHeight}px;
        `;

        // Tạo 5 mức giá trị trên trục Y
        for (let i = 0; i <= 4; i++) {
            const value = Math.round((maxValue * (4 - i)) / 4);
            const yPosition = (i * chartHeight) / 4;

            const label = document.createElement('div');
            label.textContent = value;
            label.style.cssText = `
                position: absolute;
                right: 8px;
                top: ${yPosition - 8}px;
                font-size: 11px;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 600;
                text-align: right;
                line-height: 1;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            `;
            yAxisContainer.appendChild(label);
        }

        // Nhãn trục Y
        const yLabel = document.createElement('div');
        yLabel.textContent = 'AQI';
        yLabel.style.cssText = `
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%) rotate(-90deg);
            font-size: 12px;
            color: rgba(0, 0, 0, 0.9);
            font-weight: bold;
            white-space: nowrap;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        `;
        yAxisContainer.appendChild(yLabel);

        container.appendChild(yAxisContainer);
    }

    // Tạo trục X
    createXAxis(container, dataLength) {
        const { chartHeight, topMargin, leftMargin } = this.options;
        const xAxisContainer = document.createElement('div');
        xAxisContainer.style.cssText = `
            position: absolute;
            left: ${leftMargin}px;
            top: ${chartHeight + topMargin + 5}px;
            right: 20px;
            height: 35px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        `;

        // Hiển thị nhãn thời gian (mỗi 4 giờ)
        for (let i = 0; i < dataLength; i += 2) {
            const minutesAgo = (dataLength - 1) - i; // Tính số phút trước đó
            let timeText = this.formatTimeLabel(minutesAgo);

            const label = document.createElement('div');
            label.textContent = timeText;
            label.style.cssText = `
        font-size: 13px;
        color: rgba(255, 0, 0, 0.75);
        text-align: center;
        line-height: 1.2;
        transform: translateX(-50%);
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    `;

            xAxisContainer.appendChild(label);
        }

        // Nhãn trục X
        const xLabel = document.createElement('div');
        xLabel.textContent = 'Thời gian';
        xLabel.style.cssText = `
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: rgba(0, 0, 0, 0.9);
            font-weight: bold;
            white-space: nowrap;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        `;
        xAxisContainer.appendChild(xLabel);

        container.appendChild(xAxisContainer);
    }

    // Format nhãn thời gian
    formatTimeLabel(minutesAgo) {
        if (minutesAgo === 0) return 'Hiện tại';
        if (minutesAgo < 60) return `${minutesAgo}p`;
        if (minutesAgo === 60) return '1h';
        if (minutesAgo < 1440) { // < 24 hours
            const hours = Math.floor(minutesAgo / 60);
            return `${hours}h`;
        }
        if (minutesAgo === 1440) return '1 ngày';

        const days = Math.floor(minutesAgo / 1440);
        return `${days} ngày`;
    }

    // Tạo grid lines
    createGridLines(plotArea) {
        const gridContainer = document.createElement('div');
        gridContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        // Thêm các đường grid ngang
        for (let i = 1; i <= 4; i++) {
            const gridLine = document.createElement('div');
            gridLine.style.cssText = `
                position: absolute;
                top: ${(i * this.options.chartHeight) / 4}px;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
            `;
            gridContainer.appendChild(gridLine);
        }

        plotArea.appendChild(gridContainer);
    }

    // Tạo tooltip
    createTooltip() {
        if (!this.options.showTooltip) return;

        this.tooltip = document.createElement('div');
        this.tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        document.body.appendChild(this.tooltip);
    }

    // Hiển thị tooltip
    showTooltip(element, value, index) {
        if (!this.tooltip) return;

        const hoursAgo = 23 - index;
        const timeText = this.formatTimeLabel(hoursAgo);
        const aqiLevel = this.getAQILevel(value);

        this.tooltip.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">${timeText}</div>
            <div>AQI: <span style="font-weight: bold;">${Math.round(value)}</span></div>
            <div style="font-size: 10px; opacity: 0.8;">${aqiLevel}</div>
        `;

        const rect = element.getBoundingClientRect();
        this.tooltip.style.left = `${rect.left + rect.width / 2 - this.tooltip.offsetWidth / 2}px`;
        this.tooltip.style.top = `${rect.top - this.tooltip.offsetHeight - 10}px`;
        this.tooltip.style.opacity = '1';
    }

    // Ẩn tooltip
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.style.opacity = '0';
        }
    }

    // Lấy mức độ AQI
    getAQILevel(value) {
        if (value <= 50) return 'Tốt';
        if (value <= 100) return 'Vừa phải';
        if (value <= 150) return 'Không tốt cho nhóm nhạy cảm';
        if (value <= 200) return 'Có hại cho sức khỏe';
        if (value <= 300) return 'Rất nguy hại';
        return 'Nguy hiểm';
    }

    // Thêm legend
    addChartLegend(container, maxValue) {
        const legend = document.createElement('div');
        legend.style.cssText = `
            margin-top: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            font-size: 0px;
            overflow: hidden;
        `;

        const levels = [
            { range: '0-50', label: 'Tốt', color: '#40c057' },
            { range: '51-100', label: 'Vừa phải', color: '#ffd43b' },
            { range: '101-150', label: 'Không tốt', color: '#fd7e14' },
            { range: '151-200', label: 'Có hại', color: '#e03131' },
            { range: '201-300', label: 'Rất nguy hại', color: '#9c36b5' },
            { range: '301+', label: 'Nguy hiểm', color: '#7a0c0c' }
        ];

        levels.forEach(level => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 3px 6px;
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
            `;
            item.innerHTML = `
                <div style="width: 12px; height: 12px; background: ${level.color}; border-radius: 2px;"></div>
                <span style="color: rgba(255,255,255,0.9);">${level.range}: ${level.label}</span>
            `;
            legend.appendChild(item);
        });

        container.appendChild(legend);
    }

    // Destroy instance
    destroy() {
        if (this.tooltip) {
            document.body.removeChild(this.tooltip);
            this.tooltip = null;
        }
    }
}

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AQIChart;
}

// Global variable cho browser
if (typeof window !== 'undefined') {
    window.AQIChart = AQIChart;
}

// Hàm tiện ích cho backward compatibility
function updateChart(data) {
    if (!window.aqiChartInstance) {
        window.aqiChartInstance = new AQIChart('aqi-chart');
    }
    window.aqiChartInstance.updateChart(data);
}

// Gắn hàm updateChart vào window để có thể sử dụng từ bên ngoài    
if (typeof window !== 'undefined') {
    window.updateChart = updateChart;
}