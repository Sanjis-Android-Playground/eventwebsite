// ============================================
// Bangladesh Events Chronicle - Enhanced Script
// ============================================

// Global test flags
const URL_PARAMS = new URLSearchParams(window.location.search);
const NO_IMAGES_MODE = URL_PARAMS.has('noimg');

if (NO_IMAGES_MODE) {
    document.documentElement.classList.add('no-images');
    document.body.classList.add('no-images');
}

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

// Close mobile menu when clicking on a link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Progress Bar on Scroll - OPTIMIZED with debounce
const progressBar = document.getElementById('progressBar');

// Dark Mode Toggle (Default to dark)
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference (default is dark)
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
} else {
    // Default dark mode
    themeIcon.classList.replace('fa-moon', 'fa-moon');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');

    if (isLight) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Optimized Animated Counter for Hero Stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 60; // 60 frames for 1 second animation
    const duration = 1000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
};

// Trigger counter animation when hero section is visible
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                animateCounter(stat, target);
            });
            statsAnimated = true;
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    statsObserver.observe(heroSection);
}

// Freedom Timer Logic
const updateFreedomTimer = () => {
    const freedomDate = new Date('August 5, 2024 14:30:00').getTime(); // Approx time of resignation
    const now = new Date().getTime();
    const difference = now - freedomDate;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('timerDays');
        const hoursEl = document.getElementById('timerHours');
        const minutesEl = document.getElementById('timerMinutes');
        const secondsEl = document.getElementById('timerSeconds');

        if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }
};

// Update timer every second
setInterval(updateFreedomTimer, 1000);
updateFreedomTimer(); // Initial call

// Optimized scroll handler - COMBINED & DEBOUNCED
const handleScroll = () => {
    // Progress bar
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';

    // Navigation active state
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
};

// Use requestAnimationFrame for scroll - much more efficient
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Back to Top Button
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Gallery Filter Functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Gallery Modal with working stock images
// If NO_IMAGES_MODE is enabled, we prevent modal image loading.
const galleryData = [
    {
        image: 'images/protest.png',
        title: 'Student Movement Begins',
        description: 'Dhaka University students demand quota reform in government jobs, marking the beginning of a historic movement - July 2024.'
    },
    {
        image: 'images/dhaka-uni.png',
        title: 'Massive Turnout',
        description: 'Thousands of students march in Dhaka streets. Universities united as students participated in peaceful demonstrations.'
    },
    {
        image: 'images/rally.png',
        title: 'University Solidarity',
        description: 'Students from Dhaka, Chittagong, Rajshahi, and other universities unite for quota reform and democratic change.'
    },
    {
        image: 'images/reform.png',
        title: 'Dr. Muhammad Yunus',
        description: 'Dr. Muhammad Yunus, Nobel Peace Prize laureate, was sworn in as Chief Adviser of the interim government on August 8, 2024.'
    },
    {
        image: 'images/celebration.png',
        title: 'Victory Celebration',
        description: 'Citizens celebrated the peaceful transition on August 5, 2024, and expressed hope for democratic reforms and a new Bangladesh.'
    },
    {
        image: 'images/metro-rail.png',
        title: 'Infrastructure Resumes',
        description: 'The Metro Rail, a symbol of modern development, resumes operations as the city returns to normalcy under new leadership.'
    },
    {
        image: 'images/press-conf.png',
        title: 'Interim Government',
        description: 'Formation of the new administration with advisers from various sectors focused on reforms and stability - August 8, 2024.'
    }
];

let currentModalIndex = 0;
let lastFocusedElement;

window.openModal = (index) => {
    if (NO_IMAGES_MODE) {
        // In no-images mode, don't load anything
        alert('NO_IMAGES_MODE is ON (add/remove ?noimg=1). Images are disabled for testing.');
        return;
    }

    lastFocusedElement = document.activeElement;
    currentModalIndex = index;
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    const data = galleryData[index];
    modalImage.src = data.image;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set focus to close button for accessibility
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);
};

window.closeModal = () => {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Return focus to the element that opened the modal
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
};

window.navigateModal = (direction) => {
    currentModalIndex += direction;
    if (currentModalIndex < 0) currentModalIndex = galleryData.length - 1;
    if (currentModalIndex >= galleryData.length) currentModalIndex = 0;
    openModal(currentModalIndex);
};

// Close modal on escape key and trap focus
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('imageModal');
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        navigateModal(-1);
    } else if (e.key === 'ArrowRight') {
        navigateModal(1);
    } else if (e.key === 'Tab') {
        // Focus trap
        const focusableContent = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (e.shiftKey) { // if shift key pressed for shift + tab combination
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // if tab key is pressed
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Close modal when clicking outside
document.getElementById('imageModal').addEventListener('click', (e) => {
    if (e.target.id === 'imageModal') {
        closeModal();
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success message
        formMessage.className = 'form-message success';
        formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully. We\'ll get back to you soon.';

        // Reset form
        contactForm.reset();

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }, 1500);

    // For actual implementation, use:
    /*
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Thank you! Your message has been sent.';
            contactForm.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
    */
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;

        // Show success message
        alert('Thank you for subscribing! We\'ll keep you updated.');
        newsletterForm.reset();
    });
}

// Optimized Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            fadeObserver.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Observe elements for fade-in (only once per element)
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.overview-card, .event-card, .timeline-item, .impact-item, .resource-card, .gallery-item, .contact-card, .figure-card, .quick-link-card'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in-element');
        fadeObserver.observe(el);
    });
});

// No-images mode: prevent ALL <img> network requests (debugging broken images / hanging loads)
if (NO_IMAGES_MODE) {
    const transparentSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"/>'
    );

    document.querySelectorAll('img').forEach((img) => {
        // Remove srcset to stop responsive image fetching
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.src = transparentSvg;
        img.loading = 'eager';
    });
}

// Lazy Loading Images - browser native

// Last Updated Date - Removed auto-update to prevent misleading "today" date
// The date in the HTML should be updated manually during deployment
// const updateLastModified = () => { ... }

// Print functionality
const addPrintStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        @media print {
            header, footer, .cta-button, .hamburger, .theme-toggle, .back-to-top {
                display: none !important;
            }
            body {
                font-size: 12pt;
            }
            .container {
                max-width: 100%;
            }
            .hero {
                min-height: auto;
                padding: 2rem 0;
            }
        }
    `;
    document.head.appendChild(style);
};

addPrintStyles();

// External links - open in new tab
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Debounce function (kept for future use if needed)
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Enable automatic performance mode for low-end devices / save-data
(() => {
    try {
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const saveData = navigator.connection && navigator.connection.saveData;
        const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

        if (prefersReduced || saveData || lowCores) {
            document.body.classList.add('perf-mode');
        }
    } catch (e) {
        // ignore
    }
})();

// Console message
console.log('%c🇧🇩 Bangladesh Chronicle', 'color: #006A4E; font-size: 24px; font-weight: bold;');
console.log('%cStay informed about recent events in Bangladesh', 'color: #666; font-size: 14px;');
console.log('%cWebsite enhanced with professional features', 'color: #F42A41; font-size: 12px;');

// Initialize all features on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bangladesh Events Chronicle - All features loaded successfully');
    
    // Check saved UI preference
    const savedMode = localStorage.getItem('uiMode');
    if (savedMode === 'wiki') {
        document.body.classList.add('wiki-mode');
        document.getElementById('uiToggle').textContent = 'Switch to Modern Mode';
    }

    // Apply wiki mode to links to persist state
    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only if we are currently in wiki mode
            if (document.body.classList.contains('wiki-mode')) {
                // We rely on localStorage which is already set, 
                // but the target page needs to read it immediately.
                // The target page also needs the wiki.css loaded.
            }
        });
    });
});

// UI Toggle Function
window.toggleUIMode = () => {
    document.body.classList.toggle('wiki-mode');
    const isWiki = document.body.classList.contains('wiki-mode');
    
    localStorage.setItem('uiMode', isWiki ? 'wiki' : 'modern');
    document.getElementById('uiToggle').textContent = isWiki ? 'Switch to Modern Mode' : 'Switch to Wiki Mode';
};
