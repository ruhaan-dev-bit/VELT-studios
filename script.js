/**
 * VOLT STUDIO Core UI Interaction Engine
 * Features: High-performance Lag-Free Cursor, Smart Scroll-Spy, and Reveal Anims
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HIGH-PERFORMANCE CUSTOM CURSOR (Lag-Free Interpolation) ---
    const cursor = document.querySelector('.custom-cursor');

    // Track actual mouse coordinates vs current animated cursor position
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Capture real mouse motion
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Render loop using requestAnimationFrame for smooth hardware-accelerated movement
    function animateCursor() {
        // Linear Interpolation factor (0.15 makes it smoothly glide behind the actual pointer)
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    // Start tracking loop
    requestAnimationFrame(animateCursor);

    // Dynamic scale feedback triggers on hover states
    const interactiveElements = document.querySelectorAll('a, button, .cap-card, .project-card, .team-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '45px';
            cursor.style.height = '45px';
            cursor.style.borderColor = 'var(--electric-yellow)';
            cursor.style.backgroundColor = 'rgba(255, 242, 0, 0.08)';
        });
        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'var(--neon-green)';
            cursor.style.backgroundColor = 'transparent';
        });
    });


    // --- 2. INTERSECTION OBSERVER (Scroll-Driven Content Reveals) ---
    // Target sections, project boxes, and team profiles
    const revealTargets = document.querySelectorAll('section, .cap-card, .project-card, .team-card');

    // Inject structural CSS rules dynamically for safety if CSS falls short
    revealTargets.forEach(target => {
        target.style.opacity = '0';
        target.style.transform = 'translateY(30px)';
        target.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            // Trigger activation when element boundary crosses 15% view threshold
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Unobserve to keep execution fast once triggered
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // Viewport tracking
        threshold: 0.12, // 12% visible to execute trigger
        rootMargin: '0px 0px -50px 0px' // Slightly delay rendering for better visual pacing
    });

    revealTargets.forEach(target => revealObserver.observe(target));


    // --- 3. SMART ACTIVE NAV LINKS (Optimized Scroll-Spy) ---
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('nav a');

    const spyCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const spyObserver = new IntersectionObserver(spyCallback, {
        root: null,
        threshold: 0.4 // Mark navigation item active when 40% of the section takes up the screen
    });

    sections.forEach(section => spyObserver.observe(section));
});
