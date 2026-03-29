// ===== ANIMAÇÃO DE CONTAGEM PARA NÚMEROS =====
function animateCounter(element, target, duration = 2000, hasDecimal = false) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function para movimento suave
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (target - start) * easeOutQuart;
        
        if (hasDecimal) {
            // Para números com decimal (como 76.8)
            element.textContent = current.toFixed(1).replace('.', ',');
        } else {
            // Para números inteiros
            element.textContent = Math.floor(current).toLocaleString('pt-BR');
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Garantir valor final exato
            if (hasDecimal) {
                element.textContent = target.toFixed(1).replace('.', ',');
            } else {
                element.textContent = target.toLocaleString('pt-BR');
            }
        }
    }
    
    requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER PARA ANIMAÇÕES =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animar contadores se o elemento tem classe 'stat-number'
            if (entry.target.classList.contains('stat-number') && !entry.target.dataset.animated) {
                const targetValue = parseFloat(entry.target.dataset.target);
                const hasDecimal = entry.target.dataset.target.includes('.');
                animateCounter(entry.target, targetValue, 2000, hasDecimal);
                entry.target.dataset.animated = 'true';
            }
            
            // Desconectar após animar para economizar recursos
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// ===== MENU MOBILE =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navTabs = document.querySelector('.nav-tabs');
    
    if (!menuToggle) return; // Só existe em mobile
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navTabs.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-tab');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navTabs.classList.remove('active');
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            menuToggle.classList.remove('active');
            navTabs.classList.remove('active');
        }
    });
}

// ===== MARCAR ABA ATIVA =====
function markActiveTab() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const href = tab.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            tab.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-height');
                const offset = parseFloat(navHeight);
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Marcar aba ativa
    markActiveTab();
    
    // Inicializar menu mobile
    initMobileMenu();
    
    // Animar elementos ao scroll
    const animatedElements = document.querySelectorAll('.section, .card, .stat-box, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });
    
    // Animar timeline premium
    const timelineItems = document.querySelectorAll('.timeline-premium-item');
    timelineItems.forEach((item, index) => {
        // Delay progressivo para efeito cascata
        const delay = index * 150;
        setTimeout(() => {
            observer.observe(item);
        }, delay);
    });
    
    // Observer específico para timeline premium
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => timelineObserver.observe(item));
    
    // Animar contadores
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(stat => observer.observe(stat));
    
    // Smooth scroll
    initSmoothScroll();
});

// ===== AJUSTES DE PERFORMANCE =====
// Debounce para redimensionamento
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Qualquer ajuste necessário após resize
        console.log('Window resized');
    }, 250);
});
