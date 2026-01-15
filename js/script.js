// ============================================
// Bangladesh Events Chronicle - Enhanced Script
// ============================================

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
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

// Progress Bar on Scroll
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

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

// Animated Counter for Hero Stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
};

// Trigger counter animation when hero section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    statsObserver.observe(heroSection);
}

// Add active class to navigation on scroll
window.addEventListener('scroll', () => {
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
});

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

// Gallery Modal - UPDATE THESE PATHS WITH YOUR REAL IMAGES
// After downloading real Bangladesh protest images, update these paths
const galleryData = [
    {
        image: 'images/student-protest-1.jpg', // Replace with real image path
        title: 'Student Movement Begins',
        description: 'Dhaka University students demand quota reform in government jobs, marking the beginning of a historic movement - July 2024.'
    },
    {
        image: 'images/student-protest-2.jpg', // Replace with real image path
        title: 'Massive Turnout',
        description: 'Thousands of students march in Dhaka streets. Universities united as students participated in peaceful demonstrations.'
    },
    {
        image: 'images/university-solidarity.jpg', // Replace with real image path
        title: 'University Solidarity',
        description: 'Students from Dhaka, Chittagong, Rajshahi, and other universities unite for quota reform and democratic change.'
    },
    {
        image: 'images/yunus-leadership.jpg', // Replace with real image path
        title: 'Dr. Muhammad Yunus',
        description: 'Dr. Muhammad Yunus, Nobel Peace Prize laureate, was sworn in as Chief Adviser of the interim government on August 8, 2024.'
    },
    {
        image: 'images/celebration-august.jpg', // Replace with real image path
        title: 'Victory Celebration',
        description: 'Citizens celebrated the peaceful transition on August 5, 2024, and expressed hope for democratic reforms and a new Bangladesh.'
    },
    {
        image: 'images/youth-power.jpg', // Replace with real image path
        title: 'Youth Leading Change',
        description: 'The generation that changed history - young activists who demonstrated the power of peaceful resistance.'
    },
    {
        image: 'images/shahbag-protests.jpg', // Replace with real image path
        title: 'Shahbag Square Protests',
        description: 'Historic gathering at Shahbag intersection, a symbolic location for Bangladesh\'s democratic movements.'
    },
    {
        image: 'images/interim-government.jpg', // Replace with real image path
        title: 'Interim Government',
        description: 'Formation of the new administration with advisers from various sectors focused on reforms and stability - August 8, 2024.'
    },
    {
        image: 'images/flag-celebration.jpg', // Replace with real image path
        title: 'National Pride',
        description: 'Citizens wave Bangladesh flag celebrating the peaceful democratic transition and hope for the future.'
    }
];

let currentModalIndex = 0;

window.openModal = (index) => {
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
};

window.closeModal = () => {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

window.navigateModal = (direction) => {
    currentModalIndex += direction;
    if (currentModalIndex < 0) currentModalIndex = galleryData.length - 1;
    if (currentModalIndex >= galleryData.length) currentModalIndex = 0;
    openModal(currentModalIndex);
};

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        navigateModal(-1);
    } else if (e.key === 'ArrowRight') {
        navigateModal(1);
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

// Intersection Observer for fade-in animations
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

// Observe all animated elements
const animatedElements = document.querySelectorAll(
    '.overview-card, .event-card, .timeline-item, .impact-item, .resource-card, .gallery-item, .contact-card'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Lazy Loading Images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Last Updated Date
const updateLastModified = () => {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
    
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        footerText.innerHTML = footerText.innerHTML.replace(
            /Last Updated: .+$/,
            `Last Updated: ${lastUpdated}`
        );
    }
};

updateLastModified();

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

// Performance optimization - debounce scroll events
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

// Apply debounce to scroll-heavy operations
window.addEventListener('scroll', debounce(() => {
    // Any additional scroll-dependent operations
}, 100));

// Console message
console.log('%c🇧🇩 Bangladesh Chronicle', 'color: #006A4E; font-size: 24px; font-weight: bold;');
console.log('%cStay informed about recent events in Bangladesh', 'color: #666; font-size: 14px;');
console.log('%cWebsite enhanced with professional features', 'color: #F42A41; font-size: 12px;');

// Initialize all features on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bangladesh Events Chronicle - All features loaded successfully');
});
