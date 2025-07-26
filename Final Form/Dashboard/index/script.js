// Chờ DOM load xong
document.addEventListener('DOMContentLoaded', function() {
    
    // === XỬ LÝ TAB SWITCHING ===
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class từ tất cả buttons và panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class cho button được click
                this.classList.add('active');
                
                // Show tab pane tương ứng
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
                
                // Thêm hiệu ứng fade in
                targetPane.style.opacity = '0';
                setTimeout(() => {
                    targetPane.style.opacity = '1';
                }, 50);
            });
        });
    }
    
    // === SMOOTH SCROLLING CHO NAVIGATION ===
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Highlight active nav link
                    navLinks.forEach(navLink => navLink.classList.remove('active-nav'));
                    this.classList.add('active-nav');
                }
            });
        });
    }
    
    // === ANIMATION KHI SCROLL ===
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe các elements cần animation
        const animatedElements = document.querySelectorAll(
            '.info-card, .classification-item, .permit-card, .requirement-item'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // === COUNTER ANIMATION CHO SỐ LIỆU ===
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.class-number');
        
        const countUp = (element, target) => {
            let current = 0;
            const increment = target / 50; // Chia 50 bước
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 30);
        };
        
        // Observe counter elements
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.textContent);
                    countUp(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // === SEARCH FUNCTIONALITY ===
  
    // === MOBILE MENU TOGGLE ===
    function initMobileMenu() {
        const nav = document.querySelector('.nav');
        const navUl = nav.querySelector('ul');
        
        // Tạo mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        nav.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', function() {
            navUl.classList.toggle('show-mobile');
            this.classList.toggle('active');
            this.innerHTML = this.classList.contains('active') ? '✕' : '☰';
        });
        
        // Ẩn menu khi click vào nav link trên mobile
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navUl.classList.remove('show-mobile');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.innerHTML = '☰';
                }
            });
        });
    }
    
    // === BACK TO TOP BUTTON ===
    function initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.title = 'Về đầu trang';
        document.body.appendChild(backToTopBtn);
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // === TOOLTIP CHO CÁC BIỂU TƯỢNG ===
    function initTooltips() {
        const icons = document.querySelectorAll('.card-icon, .class-number');
        
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                
                // Tạo nội dung tooltip dựa trên context
                let tooltipText = '';
                if (this.classList.contains('card-icon')) {
                    const card = this.closest('.info-card');
                    tooltipText = card.querySelector('h3').textContent;
                } else if (this.classList.contains('class-number')) {
                    const item = this.closest('.classification-item');
                    tooltipText = `Loại ${this.textContent}: ${item.querySelector('h3').textContent}`;
                }
                
                tooltip.textContent = tooltipText;
                document.body.appendChild(tooltip);
                
                // Position tooltip
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            });
            
            icon.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }
    
    // === KHỞI TẠO TẤT CẢ FUNCTIONS ===
    initTabs();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initSearch();
    initMobileMenu();
    initBackToTop();
    initTooltips();
    
    // === THÊM CSS CHO CÁC TÍNH NĂNG MỚI ===
    const additionalCSS = `
        .search-container { position: relative; }
        .search-box { display: flex; margin-left: 2rem; }
        .search-box input { 
            padding: 0.5rem; 
            border: none; 
            border-radius: 20px 0 0 20px; 
            width: 200px;
            outline: none;
        }
        .search-box button { 
            padding: 0.5rem 1rem; 
            border: none; 
            background: #3498db; 
            color: white; 
            border-radius: 0 20px 20px 0; 
            cursor: pointer;
        }
        .search-results { 
            position: absolute; 
            top: 100%; 
            left: 2rem; 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            z-index: 1000; 
            display: none; 
            min-width: 300px;
        }
        .search-result-item { 
            padding: 1rem; 
            border-bottom: 1px solid #eee; 
            cursor: pointer; 
        }
        .search-result-item:hover { background: #f8f9fa; }
        .search-result-item:last-child { border-bottom: none; }
        .no-results { padding: 1rem; text-align: center; color: #666; }
        
        .mobile-menu-btn { 
            display: none; 
            background: none; 
            border: none; 
            color: white; 
            font-size: 1.5rem; 
            cursor: pointer; 
        }
        
        .back-to-top { 
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            background: #3498db; 
            color: white; 
            border: none; 
            border-radius: 50%; 
            width: 50px; 
            height: 50px; 
            font-size: 1.2rem; 
            cursor: pointer; 
            opacity: 0; 
            transition: opacity 0.3s; 
            z-index: 1000;
        }
        .back-to-top.show { opacity: 1; }
        .back-to-top:hover { background: #2980b9; }
        
        .tooltip { 
            position: absolute; 
            background: #333; 
            color: white; 
            padding: 0.5rem; 
            border-radius: 4px; 
            font-size: 0.8rem; 
            z-index: 1000; 
            pointer-events: none;
        }
        
        .active-nav { background-color: rgba(255,255,255,0.2) !important; }
        
        @media (max-width: 768px) {
            .mobile-menu-btn { display: block; }
            .nav ul { 
                display: none; 
                position: absolute; 
                top: 100%; 
                left: 0; 
                right: 0; 
                background: #2c3e50; 
                flex-direction: column; 
                padding: 1rem;
            }
            .nav ul.show-mobile { display: flex; }
            .search-box { margin: 1rem 0 0 0; }
            .search-results { left: 0; right: 0; margin: 0 1rem; }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = additionalCSS;
    document.head.appendChild(style);
});

// === UTILITY FUNCTIONS ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization cho scroll events
window.addEventListener('scroll', debounce(function() {
    // Có thể thêm các xử lý scroll khác ở đây
}, 10));