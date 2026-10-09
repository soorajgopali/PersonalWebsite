// ============================================
// NEO STORE — Interactive Functionality
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHeroAnimations();
    initProductFilters();
    initTestimonialSlider();
    initNewsletterForm();
    initContactForm();
    initCounters();
    initScrollAnimations();
    initHamburgerMenu();
});

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// Hero Animations
// ============================================
function initHeroAnimations() {
    // Animate hero cards on mouse move
    const heroCards = document.querySelectorAll('.hero-card');
    const heroSection = document.querySelector('.hero');

    if (heroSection && heroCards.length > 0) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 20;
            const y = (clientY / innerHeight - 0.5) * 20;

            heroCards.forEach((card, index) => {
                const factor = (index + 1) * 0.5;
                card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            heroCards.forEach(card => {
                card.style.transform = '';
            });
        });
    }
}

// ============================================
// Product Filters
// ============================================
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            productCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// Testimonial Slider
// ============================================
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
        goToSlide(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
        goToSlide(currentIndex);
    });

    // Auto-play
    let autoPlay = setInterval(() => {
        currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
        goToSlide(currentIndex);
    }, 5000);

    // Pause on hover
    const slider = document.getElementById('testimonialSlider');
    slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
    slider.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
            goToSlide(currentIndex);
        }, 5000);
    });
}

// ============================================
// Newsletter Form
// ============================================
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const email = input.value;

            if (email) {
                // Show success message
                const btn = form.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span>Subscribed!</span>';
                btn.style.background = 'var(--color-success)';
                input.value = '';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Message Sent!</span>';
            btn.style.background = 'var(--color-success)';
            form.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        });
    }
}

// ============================================
// Animated Counters
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.product-card, .feature-card, .collection-card, .contact-item'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// Hamburger Menu (Mobile)
// ============================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                hamburger.classList.remove('active');
            });
        });
    }
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Navbar height
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Add to Cart Animation
// ============================================
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const originalHTML = this.innerHTML;
        this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';
        this.style.background = 'var(--color-success)';
        this.style.borderColor = 'var(--color-success)';
        this.style.color = 'var(--color-bg)';

        setTimeout(() => {
            this.innerHTML = originalHTML;
            this.style.background = '';
            this.style.borderColor = '';
            this.style.color = '';
        }, 1500);
    });
});

// ============================================
// Wishlist Toggle
// ============================================
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.style.background = 'var(--color-accent)';
            this.style.borderColor = 'var(--color-accent)';
            this.style.color = 'var(--color-bg)';
        } else {
            this.style.background = '';
            this.style.borderColor = '';
            this.style.color = '';
        }
    });
});
