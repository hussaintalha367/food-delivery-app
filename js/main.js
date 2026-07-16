/* =============================================
   QUICKBITE – MAIN JAVASCRIPT
   ============================================= */

'use strict';

/* ---- PAGE LOADER ---- */
const pageLoader = document.getElementById('pageLoader');

window.addEventListener('load', () => {
  setTimeout(() => {
    pageLoader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1800);
});

// Prevent scroll while loading
document.body.style.overflow = 'hidden';

/* ---- AOS INIT ---- */
AOS.init({
  duration: 750,
  once: true,
  offset: 80,
  easing: 'ease-out-cubic',
});

/* ---- NAVBAR: sticky + scroll class ---- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

// Close on overlay click
navOverlay.addEventListener('click', closeMenu);

// Close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightActiveLink();
  toggleBackToTop();
  triggerCounters();
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ---- ACTIVE NAV LINK on scroll ---- */
function highlightActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}


/* ---- STATS COUNTER ---- */
let countersTriggered = false;

function triggerCounters() {
  const statsSection = document.getElementById('stats');
  if (!statsSection || countersTriggered) return;

  const sectionTop = statsSection.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight - 100) {
    countersTriggered = true;
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
      const target   = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const steps    = 80;
      const stepVal  = target / steps;
      let current    = 0;
      const interval = setInterval(() => {
        current += stepVal;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        counter.textContent = formatNumber(Math.floor(current));
      }, duration / steps);
    });
  }
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n.toLocaleString();
}

/* ---- MENU FILTER TABS ---- */
const menuTabs  = document.querySelectorAll('.menu-tab');
const menuCards = document.querySelectorAll('.menu-card');

menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.getAttribute('data-filter');
    menuCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeScaleIn .4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- ADD TO CART FEEDBACK ---- */
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', function () {
    const original = this.innerHTML;
    this.innerHTML = '<i class="fa-solid fa-check"></i>';
    this.style.background = '#22c55e';
    setTimeout(() => {
      this.innerHTML = original;
      this.style.background = '';
    }, 1200);
  });
});


/* ---- TESTIMONIALS SLIDER ---- */
const track  = document.getElementById('testimonialsTrack');
const tPrev  = document.getElementById('tPrev');
const tNext  = document.getElementById('tNext');
const tDots  = document.getElementById('tDots');
const cards  = track ? track.querySelectorAll('.testimonial-card') : [];

let currentSlide = 0;
let slidesPerView = getSlidesPerView();
let totalSlides   = Math.ceil(cards.length / slidesPerView);
let autoSlideTimer;

function getSlidesPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function updateSlider() {
  slidesPerView = getSlidesPerView();
  totalSlides   = Math.ceil(cards.length / slidesPerView);
  if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;

  const cardWidth   = cards[0] ? cards[0].offsetWidth : 0;
  const cardGap     = 32; // 2rem
  const offset      = currentSlide * slidesPerView * (cardWidth + cardGap);
  track.style.transform = `translateX(-${offset}px)`;

  // Dots
  tDots.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => { currentSlide = i; updateSlider(); });
    tDots.appendChild(dot);
  }
}

if (track && tPrev && tNext) {
  tNext.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
    resetAutoSlide();
  });
  tPrev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetAutoSlide();
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    }, 5000);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  updateSlider();
  startAutoSlide();
  window.addEventListener('resize', updateSlider);
}


/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const isOpen  = question.classList.contains('open');
    const answer  = question.nextElementSibling;

    // Close all
    document.querySelectorAll('.faq-question').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling.classList.remove('open');
    });

    // Toggle clicked
    if (!isOpen) {
      question.classList.add('open');
      answer.classList.add('open');
    }
  });
});

/* ---- PRICING TOGGLE (monthly / annual) ---- */
const pricingToggle  = document.getElementById('pricingToggle');
const monthlyPrices  = document.querySelectorAll('.monthly-price');
const annualPrices   = document.querySelectorAll('.annual-price');

if (pricingToggle) {
  pricingToggle.addEventListener('change', () => {
    const isAnnual = pricingToggle.checked;
    monthlyPrices.forEach(el => el.style.display = isAnnual ? 'none'  : 'inline');
    annualPrices.forEach(el  => el.style.display = isAnnual ? 'inline': 'none');
  });
}

/* ---- CONTACT FORM VALIDATION ---- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    function validate(id, errorId, check, msg) {
      const input = document.getElementById(id);
      const error = document.getElementById(errorId);
      if (!check(input.value.trim())) {
        input.classList.add('error');
        error.textContent = msg;
        valid = false;
      } else {
        input.classList.remove('error');
        error.textContent = '';
      }
    }

    validate('firstName',  'firstNameError',  v => v.length >= 2,                  'Please enter your first name.');
    validate('lastName',   'lastNameError',   v => v.length >= 2,                  'Please enter your last name.');
    validate('email',      'emailError',      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.');
    validate('subject',    'subjectError',    v => v !== '',                        'Please select a subject.');
    validate('message',    'messageError',    v => v.length >= 20,                 'Message must be at least 20 characters.');

    if (valid) {
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      // Simulate async send
      setTimeout(() => {
        contactForm.reset();
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        const successMsg = document.getElementById('formSuccess');
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 6000);
      }, 1800);
    }
  });

  // Live clear errors on input
  contactForm.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = document.getElementById(field.id + 'Error');
      if (errEl) errEl.textContent = '';
    });
  });
}

/* ---- NEWSLETTER FORM ---- */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = this.querySelector('input[type="email"]');
    const btn   = this.querySelector('button');
    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = '#ef4444';
      return;
    }
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background = '#22c55e';
    input.value = '';
    input.placeholder = 'You\'re subscribed!';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
      btn.style.background = '';
      input.placeholder = 'Your email address';
    }, 3000);
  });
}

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- SMOOTH SCROLL for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'), 10) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

