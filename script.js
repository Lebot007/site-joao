// ========================================
// NAVEGAÇÃO RESPONSIVA
// ========================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu mobile
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Fechar menu ao clicar fora
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
    
    // Highlight nav link baseado na seção atual
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
// ANIMAÇÕES NA ROLAGEM - MELHORADO
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

// Mapa para rastrear índices de elementos por tipo
const elementIndexMap = new Map();

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Obter classe do elemento para determinar tipo
            const classList = Array.from(entry.target.classList);
            const elementType = classList.find(c => 
                ['education-card', 'course-item', 'project-card', 'experience-item', 'tech-category'].includes(c)
            );
            
            // Obter índice do elemento dentro do seu tipo
            let elementIndex = elementIndexMap.get(elementType) || 0;
            const delay = elementIndex * 0.12; // Delay de 120ms entre elementos
            
            // Aplicar delay via data attribute
            entry.target.style.setProperty('--animation-delay', `${delay}s`);
            entry.target.style.opacity = '1';
            
            // Aplicar animação com delay
            entry.target.style.animation = `${entry.target.dataset.animation || 'zoomInScaleStagger'} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`;
            
            // Atualizar índice
            elementIndexMap.set(elementType, elementIndex + 1);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animar - com dados específicos
document.querySelectorAll('.education-card').forEach((el, idx) => {
    el.style.opacity = '0';
    el.dataset.animation = 'zoomInScaleStagger';
    observer.observe(el);
});

document.querySelectorAll('.course-item').forEach((el, idx) => {
    el.style.opacity = '0';
    el.dataset.animation = 'courseItemSlide';
    observer.observe(el);
});

document.querySelectorAll('.skill-item').forEach((el, idx) => {
    el.style.opacity = '0';
    el.dataset.animation = 'zoomInScaleStagger';
    observer.observe(el);
});

document.querySelectorAll('.contact-channel').forEach((el, idx) => {
    el.style.opacity = '0';
    el.dataset.animation = 'zoomInScaleStagger';
    observer.observe(el);
});

document.querySelectorAll('.project-card, .experience-item, .tech-category').forEach(el => {
    el.style.opacity = '0';
    el.dataset.animation = 'fadeInUp';
    observer.observe(el);
});

// ========================================
// FORMULÁRIO DE CONTATO
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validações básicas
        if (!name || !email || !subject || !message) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }
        
        // Simular envio (em produção, seria feito com backend)
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simular delay de envio
        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Em breve entrarei em contato.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ========================================
// NOTIFICAÇÕES
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos da notificação
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
    
    // Remover notificação após 4 segundos
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
        
        // Ignorar âncoras vazias
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            // Calcular offset considerando navbar fixa
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
    
    // Se for placeholder (****) ou não for número, pular animação
    if (isNaN(finalValue) || textContent.includes('*')) {
        return;
    }
    
    const duration = 2000; // 2 segundos
    const steps = 60;
    const stepValue = finalValue / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        const currentValue = Math.floor(stepValue * currentStep);
        
        // Extrair o sufixo (ex: +, %)
        const originalText = element.textContent;
        const suffix = originalText.replace(/[\d]/g, '').trim();
        
        element.textContent = currentValue + suffix;
        
        if (currentStep >= steps) {
            element.textContent = finalValue + suffix;
            clearInterval(interval);
        }
    }, duration / steps);
}

// Chamar quando a página carregar
window.addEventListener('load', () => {
    animateCounters();
});

// ========================================
// EFEITO DE PARALLAX (OPCIONAL)
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========================================
// DETECÇÃO DE TEMA (DARK MODE)
// ========================================

function initTheme() {
    // Por padrão, o site usa dark mode
    // Você pode expandir isso para suportar preferências do usuário
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Já está configurado para dark por padrão, mas você pode adicionar lógica aqui
    if (prefersDark.matches) {
        document.documentElement.style.colorScheme = 'dark';
    }
}

initTheme();

// ========================================
// EVENTO DE CARREGAMENTO DA PÁGINA
// ========================================

window.addEventListener('load', () => {
    // Animar elementos ao carregar
    document.body.style.opacity = '1';
    
    // Log de carregamento completo
    console.log('Portfólio carregado com sucesso!');
});

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

// Função para verificar se elemento está no viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Função para copiar texto para clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar para a área de transferência.', 'error');
    });
}

// ========================================
// TRATAMENTO DE ERROS
// ========================================

window.addEventListener('error', (event) => {
    console.error('Erro detectado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejeitada não tratada:', event.reason);
});

// ========================================
// PERFORMANCE - LAZY LOADING
// ========================================

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

// ========================================
// INICIALIZAÇÃO DE PWA (OPCIONAL)
// ========================================

if ('serviceWorker' in navigator) {
    // Você pode registrar um service worker aqui para offline support
    // navigator.serviceWorker.register('/sw.js');
}

// ========================================
// ========================================
// ANIMAÇÃO MATRIX - VERSÃO SIMPLIFICADA
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
        
        // Posição horizontal aleatória dentro da seção
        const startX = Math.random() * (matrixBg.offsetWidth || window.innerWidth);
        const startY = -30;
        
        char.style.left = startX + 'px';
        char.style.top = startY + 'px';
        
        matrixBg.appendChild(char);

        // Duração da queda (em ms)
        const duration = 10000 + Math.random() * 8000; // 10-18 segundos
        const startTime = Date.now();
        const sectionHeight = matrixBg.offsetHeight || window.innerHeight;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress > 1) {
                char.remove();
                return;
            }
            
            // Movimento vertical dentro da seção
            const newY = startY + (sectionHeight + 100) * progress;
            char.style.top = newY + 'px';
            
            // Fade out no final
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
            
            // Criar 1-2 caracteres por ciclo
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

    // Monitorar visibilidade da seção hero
    const observerOptions = {
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isAnimating) {
                    startAnimation();
                }
            } else {
                if (isAnimating) {
                    stopAnimation();
                    // Limpar caracteres quando sai da tela
                    matrixBg.querySelectorAll('.matrix-char').forEach(char => char.remove());
                }
            }
        });
    }, observerOptions);

    observer.observe(heroSection);
    
    // Iniciar animação
    startAnimation();
    
    console.log('✅ Animação Matrix iniciada');
}

// ========================================
// SCROLL REVEAL ANIMATION
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
// HOVER EFFECTS APRIMORADOS
// ========================================

function initInteractiveElements() {
    // Adicionar delay nas animações dos cards para efeito cascata
    const cards = document.querySelectorAll(
        '.education-card, .skill-item, .course-item, .experience-item'
    );
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Efeito de glow nos elementos ao passar o mouse
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
// CARROSSEL ELEGANTE DE PROJETOS
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

    // Event listeners
    nextBtn?.addEventListener('click', nextCard);
    prevBtn?.addEventListener('click', prevCard);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToCard(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === 'ArrowLeft') prevCard();
    });

    // Auto play
    let autoPlayInterval = setInterval(nextCard, 8000);

    // Pause on hover
    const carousel = document.querySelector('.carousel-elegante');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextCard, 8000);
        });
    }

    // Efeitos interativos no hover dos cards
    const carouselContent = document.querySelector('.carousel-content');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Adiciona classe hover ao card ativo
            if (card.classList.contains('active')) {
                card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });

        card.addEventListener('mouseleave', () => {
            // Remove o efeito hover
            if (card.classList.contains('active')) {
                card.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });
    });

    // Inicializar
    updateCarousel();
}

// ========================================
// ANO DINÂMICO NO RODAPÉ
// ========================================

function updateYear() {
    const yearElement = document.getElementById('year-current');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}

// ========================================
// INICIALIZAÇÃO DE COMPONENTES
// ========================================

// Inicializar quando DOM estiver pronto
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
