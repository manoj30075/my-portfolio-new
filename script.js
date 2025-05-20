// script.js
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');

    const sectionObserverOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // CSS now handles card animation delays using :nth-of-type
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Active Nav Link Highlighting on Scroll
    const navLinks = document.querySelectorAll('header nav ul li a');
    // Ensure we only select sections that are direct children of main and have an ID
    const sectionsForNavHighlighting = document.querySelectorAll('main > section[id]');

    const navObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Highlights when section is more centered in viewport
        threshold: 0 // Trigger as soon as any part of the section enters/leaves this margin
    };

    const navObserver = new IntersectionObserver(entries => {
        let activeSet = false;
        entries.forEach(entry => {
            const link = document.querySelector(`header nav ul li a[href="#${entry.target.id}"]`);
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                if (link && !activeSet) { // Prioritize first intersecting section from top
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    activeSet = true;
                }
            } else {
                if (link) {
                    link.classList.remove('active');
                }
            }
        });
        // If no section is actively intersecting under the highlight criteria (e.g. scrolling fast to footer)
        // It might leave no link active, or the last one. This behavior is acceptable.
        // For more precise "which section is most visible", thresholds array could be used.
        // The current logic is simple and highlights if a section is in the -40% top/bottom margin.
    }, navObserverOptions);

    sectionsForNavHighlighting.forEach(section => {
        navObserver.observe(section);
    });
});
