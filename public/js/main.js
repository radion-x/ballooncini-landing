/**
 * Main JavaScript file
 * Handles general website functionality
 */

// Mobile Menu Toggle with Dropdown Support
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const MOBILE_BREAKPOINT = 768;

const isMobileView = () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

const setMenuState = (isActive) => {
    if (!navLinks) return;
    if (!isMobileView()) {
        navLinks.style.transform = '';
        navLinks.style.opacity = '';
        navLinks.style.visibility = '';
        return;
    }
    navLinks.style.transform = isActive ? 'translateX(0)' : 'translateX(100%)';
    navLinks.style.opacity = isActive ? '1' : '0';
    navLinks.style.visibility = isActive ? 'visible' : 'hidden';
};

const setHamburgerState = (isActive) => {
    if (!mobileMenuToggle) return;
    const spans = mobileMenuToggle.querySelectorAll('span');
    if (isActive) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
};

if (mobileMenuToggle && navLinks) {
    setMenuState(false);
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', (e) => {
        if (!isMobileView()) return;
        e.stopPropagation();
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        const isActive = navLinks.classList.contains('active');
        setMenuState(isActive);
        setHamburgerState(isActive);
    });

    // Handle mobile dropdown toggles
    const mobileDropdowns = document.querySelectorAll('.nav-item-dropdown');
    mobileDropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a[href*="service"]');
        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
                // On mobile, toggle dropdown instead of navigating
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    
                    // Close other dropdowns
                    mobileDropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('active');
                        }
                    });
                }
            });
        }
    });

    // Close menu when clicking a non-dropdown link
    document.querySelectorAll('.nav-links a:not(.nav-item-dropdown > a)').forEach(link => {
        link.addEventListener('click', () => {
            if (!isMobileView()) return;
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            setMenuState(false);
            setHamburgerState(false);
            
            // Close all dropdowns
            mobileDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!isMobileView()) return;
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-toggle')) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            setMenuState(false);
            setHamburgerState(false);
            
            // Close all dropdowns
            mobileDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    window.addEventListener('resize', () => {
        const isActive = mobileMenuToggle.classList.contains('active');
        if (!isMobileView()) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
        setMenuState(isMobileView() && isActive);
        setHamburgerState(isMobileView() && isActive);
    });
}

// Make logo clickable to scroll to top
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        updateActiveNav();
        handleHeaderShadow();
    });
});

// Add shadow to header on scroll
function handleHeaderShadow() {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
}


// Intersection Observer for scroll animations
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

// Observe service cards and other elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .stat, .info-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Service link quick actions
document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = link.closest('.service-card').querySelector('h3').textContent;
        
        // Scroll to contact form
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill service field if chat is available
        setTimeout(() => {
            const serviceSelect = document.querySelector('#serviceType');
            if (serviceSelect) {
                const options = Array.from(serviceSelect.options);
                const matchingOption = options.find(opt => 
                    opt.text.toLowerCase().includes(serviceName.toLowerCase())
                );
                if (matchingOption) {
                    serviceSelect.value = matchingOption.value;
                }
            }
        }, 500);
    });
});

// Console welcome message
console.log(
    '%c🎈 Ballooncini — Extraordinary Balloon Decorations Since 1997',
    'color: #E91E8C; font-size: 14px; font-weight: bold;'
);

// Handle form input animations
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Quick contact trigger from service cards
function initQuickContact() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('service-link')) {
                // Optional: Trigger AI chat with pre-filled message
                const serviceName = card.querySelector('h3').textContent;
                if (typeof aiChatInstance !== 'undefined') {
                    // This will open chat with a pre-filled message
                    // Uncomment if you want this behavior:
                    // aiChatInstance.sendMessage(`I'm interested in ${serviceName}`);
                }
            }
        });
    });
}

// Initialize quick contact
document.addEventListener('DOMContentLoaded', initQuickContact);

// Handle page load animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Performance: Lazy load images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const isOpen = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs
            document.querySelectorAll('.faq-question').forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    const otherItem = q.closest('.faq-item');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.classList.remove('active');
                    }
                }
            });
            
            // Toggle current FAQ
            if (isOpen) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                answer.classList.remove('active');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.classList.add('active');
            }
        });
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .service-card, .transformation-card, .step-card, .info-item, .pricing-card, .requirements-card, .faq-item').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});

// ===== REVIEWS SECTION ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        sectionObserver.observe(testimonialsSection);
    }
});

// ===== REVIEWS SWIPER CAROUSEL =====
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Swiper === 'undefined') return;

    const reviewsSwiper = new Swiper('.reviews-swiper', {
        // Core settings
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 24,
        speed: 800,
        grabCursor: true,
        loop: true,
        watchSlidesProgress: true,

        // Silky smooth autoplay
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        // Pagination dots
        pagination: {
            el: '.reviews-pagination',
            clickable: true,
        },

        // Responsive breakpoints
        breakpoints: {
            0: {
                slidesPerView: 1.15,
                spaceBetween: 16,
                centeredSlides: true,
            },
            480: {
                slidesPerView: 1.4,
                spaceBetween: 20,
                centeredSlides: true,
            },
            768: {
                slidesPerView: 2.2,
                spaceBetween: 24,
                centeredSlides: true,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 28,
                centeredSlides: true,
            },
            1400: {
                slidesPerView: 3.5,
                spaceBetween: 32,
                centeredSlides: true,
            },
        },

        // Smooth easing
        on: {
            init: function() {
                this.el.style.opacity = '1';
            },
        },
    });

    // Custom prev/next buttons
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    if (prevBtn) prevBtn.addEventListener('click', () => reviewsSwiper.slidePrev());
    if (nextBtn) nextBtn.addEventListener('click', () => reviewsSwiper.slideNext());
});

/* ============================================================
   FLOATING BALLOON SKY — Suburb Service Areas
   Each suburb floats upward as a colourful balloon with
   gentle physics: wobble, drift, rotation, parallax depth.
   ============================================================ */
(function () {
    const stage = document.getElementById('balloonStage');
    if (!stage) return;

    const SUBURBS = [
        'Haberfield','Leichhardt','Ashfield','Five Dock','Drummoyne','Burwood',
        'Strathfield','Concord','Homebush','Sydney CBD','North Sydney','Parramatta',
        'Chatswood','Bondi','Randwick','Marrickville','Newtown','Balmain',
        'Rozelle','Petersham','Summer Hill','Croydon','Annandale','Glebe',
        'Surry Hills','Paddington','Woollahra','Mosman','Neutral Bay','Cremorne',
        'Manly','Dee Why','Coogee','Maroubra','Mascot','Botany',
        'Rockdale','Hurstville','Kogarah','Sans Souci','Cronulla','Miranda',
        'Sutherland','Liverpool','Bankstown','Campbelltown','Penrith','Blacktown',
        'Castle Hill','Hornsby','Ryde','Epping','Eastwood','Gladesville',
        'Hunters Hill','Lane Cove','Willoughby','Gordon','Turramurra','Wahroonga',
        'Rose Bay','Double Bay','Vaucluse','Bronte','Waverley','Enmore',
        'Stanmore','Dulwich Hill','Canterbury','Campsie','Belmore','Auburn',
        'Granville','Merrylands','Fairfield','Bella Vista','Carlingford','Beecroft',
        'West Ryde','Meadowbank','Rhodes','Wentworth Point','Olympic Park'
    ];

    const COLOR_COUNT = 10;
    const isMobile = window.innerWidth < 768;
    const MAX_BALLOONS = isMobile ? 16 : 28;
    const SPAWN_INTERVAL = isMobile ? 800 : 480;
    const PRE_FILL = isMobile ? 10 : 18;

    let balloons = [];
    let animId = null;
    let running = false;
    let lastSpawn = 0;
    let suburbIdx = 0;
    let time = 0;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    // Insert soft hyphen at midpoint of long single words so they break with a dash
    function hyphenate(str) {
        return str.split(' ').map(function(word) {
            if (word.length > 6) {
                var mid = Math.ceil(word.length / 2);
                return word.slice(0, mid) + '\u00AD' + word.slice(mid);
            }
            return word;
        }).join(' ');
    }

    function createBalloon(now, prefillY) {
        const name = SUBURBS[suburbIdx % SUBURBS.length];
        suburbIdx++;

        const depth = rand(0.55, 1);
        const size = Math.round(52 + depth * 30);
        const stringLen = Math.round(30 + depth * 35);
        const colorIdx = Math.floor(rand(0, COLOR_COUNT));

        const el = document.createElement('div');
        el.className = 'suburb-balloon balloon-c' + colorIdx;
        el.style.setProperty('--bsize', size + 'px');
        el.style.setProperty('--slen', stringLen + 'px');
        el.style.setProperty('--swaveDur', rand(2.5, 4).toFixed(1) + 's');
        el.style.opacity = '0';

        el.innerHTML =
            '<div class="balloon-body"><span class="balloon-text">' + hyphenate(name) + '</span></div>' +
            '<div class="balloon-string"></div>';

        stage.appendChild(el);

        const stageW = stage.offsetWidth;
        const stageH = stage.offsetHeight;

        const b = {
            el: el,
            x: rand(size, stageW - size),
            y: (prefillY !== undefined) ? prefillY : stageH + size + stringLen,
            speed: rand(0.3, 0.7) * depth,
            wobbleAmp: rand(12, 35),
            wobbleFreq: rand(0.3, 0.7),
            wobblePhase: rand(0, Math.PI * 2),
            rotAmp: rand(2, 6),
            rotFreq: rand(0.2, 0.45),
            rotPhase: rand(0, Math.PI * 2),
            depth: depth,
            born: now,
            totalH: size * 1.2 + stringLen + 8,
        };

        balloons.push(b);
    }

    // Pre-fill the stage so it's not empty on first view
    function seedBalloons() {
        var stageH = stage.offsetHeight || 650;
        for (var i = 0; i < PRE_FILL; i++) {
            createBalloon(0, rand(40, stageH - 40));
        }
    }

    function tick(ts) {
        if (!running) return;
        const dt = 16; // ~60fps normalised
        time += 0.016;

        // Spawn new balloons
        if (ts - lastSpawn > SPAWN_INTERVAL && balloons.length < MAX_BALLOONS) {
            createBalloon(ts);
            lastSpawn = ts;
        }

        const stageH = stage.offsetHeight;
        const fadeInZone = stageH * 0.85;
        const fadeOutZone = stageH * 0.15;

        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];

            // Float upward
            b.y -= b.speed;

            // Wobble
            const wobbleX = Math.sin(time * b.wobbleFreq + b.wobblePhase) * b.wobbleAmp;
            const rot = Math.sin(time * b.rotFreq + b.rotPhase) * b.rotAmp;

            // Opacity based on position
            let opacity = 1;
            if (b.y > fadeInZone) {
                opacity = Math.max(0, 1 - (b.y - fadeInZone) / (stageH * 0.15));
            } else if (b.y < fadeOutZone) {
                opacity = Math.max(0, b.y / fadeOutZone);
            }
            opacity *= (0.5 + b.depth * 0.5);

            b.el.style.transform = 'translate3d(' + (b.x + wobbleX) + 'px,' + b.y + 'px,0) rotate(' + rot + 'deg)';
            b.el.style.opacity = opacity;
            b.el.style.zIndex = Math.round(b.depth * 10);

            // Remove when off-screen top
            if (b.y < -b.totalH) {
                b.el.remove();
                balloons.splice(i, 1);
            }
        }

        animId = requestAnimationFrame(tick);
    }

    function startAnimation() {
        if (running) return;
        running = true;
        if (balloons.length === 0) seedBalloons();
        lastSpawn = 0;
        animId = requestAnimationFrame(tick);
    }

    function stopAnimation() {
        running = false;
        if (animId) cancelAnimationFrame(animId);
    }

    // Only animate when section is in viewport
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                startAnimation();
            } else {
                stopAnimation();
            }
        });
    }, { threshold: 0.05 });

    observer.observe(stage.closest('.balloon-sky') || stage);
})();

