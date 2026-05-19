// ========================================
// NAVEGAÇÃO RESPONSIVA
// ========================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ========================================
// NAVBAR - EFEITO AO FAZER SCROLL
// ========================================

const navbar = document.querySelector('.navbar');
let lastScrollPos = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 30px rgba(255, 255, 255, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    }
    
    updateActiveNavLink();
    lastScrollPos = currentScroll;
});

function updateActiveNavLink() {
    const scrollPos = window.pageYOffset;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollPos >= sectionTop && scrollPos < sectionTop + section.offsetHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

// ========================================
// ANIMAÇÕES NA ROLAGEM
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const elementIndexMap = new Map();

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const classList = Array.from(entry.target.classList);
            const elementType = classList.find(c => 
                ['education-card', 'course-item', 'project-card', 'experience-item', 'tech-category'].includes(c)
            );
            
            let elementIndex = elementIndexMap.get(elementType) || 0;
            const delay = elementIndex * 0.12; 
            
            entry.target.style.setProperty('--animation-delay', `${delay}s`);
            entry.target.style.opacity = '1';
            entry.target.style.animation = `${entry.target.dataset.animation || 'zoomInScaleStagger'} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`;
            
            elementIndexMap.set(elementType, elementIndex + 1);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.education-card').forEach((el) => {
    el.style.opacity = '0';
    el.dataset.animation = 'zoomInScaleStagger';
    observer.observe(el);
});

document.querySelectorAll('.course-item').forEach((el) => {
    el.style.opacity = '0';
    el.dataset.animation = 'courseItemSlide';
    observer.observe(el);
});

document.querySelectorAll('.skill-item').forEach((el) => {
    el.style.opacity = '0';
    el.dataset.animation = 'zoomInScaleStagger';
    observer.observe(el);
});

document.querySelectorAll('.contact-channel').forEach((el) => {
    el.style.opacity = '0';
    el.dataset.animation = 'zoomInScaleStagger';
    observer.observe(el);
});

document.querySelectorAll('.project-card').forEach(el => {
    el.style.opacity = '0';
    el.dataset.animation = 'fadeInUp';
    observer.observe(el);
});

document.querySelectorAll('.experience-item').forEach(el => {
    el.dataset.animation = 'slideInLeftStagger';
    observer.observe(el);
});

document.querySelectorAll('.tech-category').forEach(el => {
    el.style.opacity = '0';
    el.dataset.animation = 'techCategoryFadeIn';
    observer.observe(el);
});

// ========================================
// NOTIFICAÇÕES
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slideInRight 0.4s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.4s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// ========================================
// SCROLL SUAVE E ÂNCORAS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// CONTADOR ANIMADO
// ========================================

function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const isVisible = new Set();
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isVisible.has(entry.target)) {
                isVisible.add(entry.target);
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => countObserver.observe(stat));
}

function animateCounter(element) {
    const textContent = element.textContent.trim();
    const finalValue = parseInt(textContent);
    
    if (isNaN(finalValue) || textContent.includes('*')) return;
    
    const duration = 2000; 
    const steps = 60;
    const stepValue = finalValue / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        const currentValue = Math.floor(stepValue * currentStep);
        const originalText = element.textContent;
        const suffix = originalText.replace(/[\d]/g, '').trim();
        
        element.textContent = currentValue + suffix;
        
        if (currentStep >= steps) {
            element.textContent = finalValue + suffix;
            clearInterval(interval);
        }
    }, duration / steps);
}

window.addEventListener('load', () => {
    animateCounters();
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
        document.documentElement.style.colorScheme = 'dark';
    }
}

initTheme();

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    console.log('Portfólio carregado com sucesso!');
});

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar para a área de transferência.', 'error');
    });
}

window.addEventListener('error', (event) => {
    console.error('Erro detectado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejeitada não tratada:', event.reason);
});

if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('/sw.js');
}

// ========================================
// ANIMAÇÃO MATRIX
// ========================================

function initMatrixAnimation() {
    const matrixBg = document.querySelector('.matrix-background');
    const heroSection = document.querySelector('.hero');
    
    if (!matrixBg || !heroSection) return;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン!@#$%^&*()';
    const charArray = chars.split('');
    
    let isAnimating = true;
    let animationIntervalId = null;

    function getRandomChar() {
        return charArray[Math.floor(Math.random() * charArray.length)];
    }

    function createFallingChar() {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = getRandomChar();
        char.style.opacity = String(0.4 + Math.random() * 0.5);
        char.style.fontSize = (0.7 + Math.random() * 0.4) + 'rem';
        
        const startX = Math.random() * (matrixBg.offsetWidth || window.innerWidth);
        const startY = -30;
        
        char.style.left = startX + 'px';
        char.style.top = startY + 'px';
        
        matrixBg.appendChild(char);

        const duration = 10000 + Math.random() * 8000; 
        const startTime = Date.now();
        const sectionHeight = matrixBg.offsetHeight || window.innerHeight;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress > 1) {
                char.remove();
                return;
            }
            
            const newY = startY + (sectionHeight + 100) * progress;
            char.style.top = newY + 'px';
            
            const opacity = (0.4 + Math.random() * 0.5) * (1 - progress * 0.2);
            char.style.opacity = String(Math.max(0, opacity));
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    function startAnimation() {
        isAnimating = true;
        
        animationIntervalId = setInterval(() => {
            if (!isAnimating) return;
            
            const charCount = Math.random() > 0.5 ? 1 : 2;
            for (let i = 0; i < charCount; i++) {
                createFallingChar();
            }
        }, 300);
    }

    function stopAnimation() {
        isAnimating = false;
        if (animationIntervalId) {
            clearInterval(animationIntervalId);
            animationIntervalId = null;
        }
    }

    const observerOptions = { threshold: 0 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isAnimating) startAnimation();
            } else {
                if (isAnimating) {
                    stopAnimation();
                    matrixBg.querySelectorAll('.matrix-char').forEach(char => char.remove());
                }
            }
        });
    }, observerOptions);

    observer.observe(heroSection);
    startAnimation();
}

// ========================================
// SCROLL REVEAL
// ========================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        'section h2, .education-card, .skill-item, .course-item, .project-card, .experience-item'
    );

    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        element.classList.add('fade-in-on-scroll');
        observer.observe(element);
    });
}

// ========================================
// HOVER EFFECTS
// ========================================

function initInteractiveElements() {
    const cards = document.querySelectorAll(
        '.education-card, .skill-item, .course-item, .experience-item'
    );
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    const glowElements = document.querySelectorAll(
        '.section-title, .hero-content h1'
    );

    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
}

// ========================================
// CARROSSEL
// ========================================

function initCarroselElegante() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const cards = document.querySelectorAll('.carousel-card');
    const indicators = document.querySelectorAll('.indicator-dot');

    if (!cards.length) return;

    let currentIndex = 0;
    const totalCards = cards.length;

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev');
            
            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index < currentIndex) {
                card.classList.add('prev');
            }
        });

        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }

    function prevCard() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }

    function goToCard(index) {
        currentIndex = index;
        updateCarousel();
    }

    nextBtn?.addEventListener('click', nextCard);
    prevBtn?.addEventListener('click', prevCard);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToCard(index));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === 'ArrowLeft') prevCard();
    });

    let autoPlayInterval = setInterval(nextCard, 8000);

    const carousel = document.querySelector('.carousel-elegante');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextCard, 8000);
        });
    }

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (card.classList.contains('active')) {
                card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('active')) {
                card.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });
    });

    updateCarousel();
}

// ========================================
// ANO RODAPÉ
// ========================================

function updateYear() {
    const yearElement = document.getElementById('year-current');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateYear();
        initMatrixAnimation();
        initScrollReveal();
        initInteractiveElements();
        initCarroselElegante();
    });
} else {
    updateYear();
    initMatrixAnimation();
    initScrollReveal();
    initInteractiveElements();
    initCarroselElegante();
}
