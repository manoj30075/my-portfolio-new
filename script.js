// Modern Portfolio JavaScript with ES6+ Features
class PortfolioApp {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('header nav ul li a');
        this.sectionsForNavHighlighting = document.querySelectorAll('main > section[id]');
        
        // Enhanced animation options with better performance
        this.sectionObserverOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: [0.1, 0.3, 0.5]
        };

        this.navObserverOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        this.init();
    }

    init() {
        this.setupSectionAnimations();
        this.setupNavHighlighting();
        this.setupSmoothScrolling();
        this.setupDynamicTyping();
        this.setupSkillHovers();
        this.setupParallaxEffect();
        this.setupProgressiveImageLoading();
    }

    setupSectionAnimations() {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    // Add staggered animation class
                    entry.target.classList.add('visible');
                    
                    // Enhanced animation for skill categories and contact items
                    this.animateChildElements(entry.target);
                    
                    // Use WeakMap for performance - only observe once
                    if (entry.intersectionRatio >= 0.3) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, this.sectionObserverOptions);

        this.sections.forEach(section => {
            // Add initial state classes
            section.classList.add('section-hidden');
            sectionObserver.observe(section);
        });
    }

    animateChildElements(section) {
        const animatableElements = section.querySelectorAll(
            '.skill-category, .contact-item, .job-entry, .project-entry, .education-entry'
        );
        
        animatableElements.forEach((element, index) => {
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                setTimeout(() => {
                    element.classList.add('animate-in');
                }, index * 100); // Stagger by 100ms
            });
        });
    }

    setupNavHighlighting() {
        let activeSection = null;
        
        const navObserver = new IntersectionObserver(entries => {
            // Sort entries by position to handle multiple intersections
            const visibleEntries = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visibleEntries.length > 0) {
                const mostVisible = visibleEntries[0];
                if (mostVisible.target !== activeSection) {
                    activeSection = mostVisible.target;
                    this.updateActiveNavLink(activeSection.id);
                }
            }
        }, this.navObserverOptions);

        this.sectionsForNavHighlighting.forEach(section => {
            navObserver.observe(section);
        });
    }

    updateActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        // Enhanced smooth scrolling with easing
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                        
                        // Update URL without triggering scroll
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    setupDynamicTyping() {
        const heroTitle = document.querySelector('#hero h1');
        const heroSubtitle = document.querySelector('.hero-subtitle p');
        
        if (heroTitle && heroSubtitle) {
            // Add typewriter effect to hero elements
            this.typeWriter(heroTitle, heroTitle.textContent, 50);
            setTimeout(() => {
                this.typeWriter(heroSubtitle, heroSubtitle.textContent, 30);
            }, 1500);
        }
    }

    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, speed);
    }

    setupSkillHovers() {
        const skillCategories = document.querySelectorAll('.skill-category');
        
        skillCategories.forEach(category => {
            category.addEventListener('mouseenter', () => {
                category.style.transform = 'translateY(-5px) scale(1.02)';
                category.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            category.addEventListener('mouseleave', () => {
                category.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupParallaxEffect() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.skill-category, .contact-item');
            
            parallaxElements.forEach((element, index) => {
                const rate = scrolled * -0.5 * (index % 3 + 1) * 0.1;
                element.style.transform = `translateY(${rate}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    setupProgressiveImageLoading() {
        // Placeholder for future image optimization
        const images = document.querySelectorAll('img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }
}

// Enhanced error handling and performance monitoring
const initializeApp = () => {
    try {
        const app = new PortfolioApp();
        
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                console.log(`Portfolio loaded in ${loadTime.toFixed(2)}ms`);
            });
        }
        
    } catch (error) {
        console.error('Failed to initialize portfolio app:', error);
        // Fallback for basic functionality
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
