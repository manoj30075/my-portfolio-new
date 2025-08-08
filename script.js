// Minimal Portfolio JavaScript - Clean and Simple

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Update current time in footer
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    // Update time immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);
    
    // Smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add subtle hover effects for interactive elements
    document.querySelectorAll('a, .project-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'all 0.2s ease';
        });
    });
    
    // Intersection Observer for subtle scroll animations (disabled for reduced motion)
    if (!reduceMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    } else {
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
    }
    
    // Console message for developers
    console.log(`
    ╭────────────────────────────────────────────────────────────╮
    │  Manoj's Minimal Portfolio                                 │
    │                                                            │
    │  Built with: Clean code, minimal design, maximum impact   │
    │  Stack: HTML5, CSS3, Vanilla JavaScript                   │
    │  Typography: JetBrains Mono                               │
    │  Philosophy: All information at a glance                  │
    ╰────────────────────────────────────────────────────────────╯
    `);
    
    // Add subtle page load animation (respect reduced motion)
    if (!reduceMotion) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
    
    // Keyboard shortcuts for accessibility
    document.addEventListener('keydown', (e) => {
        // Alt + H for home/top
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Alt + C for contact section
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            const contactSection = document.querySelector('.contact-education');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Performance optimization: Lazy load images if any are added later
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add click analytics for portfolio tracking (privacy-friendly)
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const url = e.target.href;
            // Log to console for development (can be replaced with analytics)
            console.log(`External link clicked: ${url}`);
        });
    });
    
    // Focus styles are handled via CSS :focus-visible now
    
    // Window resize handler for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Re-initialize any size-dependent features
            console.log('Window resized, adjusting layout...');
        }, 250);
    });
    
    // Scroll to top button functionality (hidden by default)
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Initialize everything
    console.log('Portfolio loaded successfully ✨');
});