/* ============================================
   ROSÁRIO E SCHMITT — INTERACTIVITY
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Header scroll effect ─────────────────────────
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check

  // ─── Mobile menu toggle ────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Smooth scroll for anchor links ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Scroll reveal animations ──────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Phone mask ────────────────────────────────────
  const phoneInput = document.getElementById('telefone');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 0) {
        if (value.length <= 2) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length <= 10) {
          value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        } else {
          value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }
      }

      e.target.value = value;
    });
  }

  // ─── Contact form ─────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const lgpdCheckbox = document.getElementById('lgpd-consent');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  // Enable/disable submit based on LGPD checkbox
  if (lgpdCheckbox && submitBtn) {
    lgpdCheckbox.addEventListener('change', () => {
      submitBtn.disabled = !lgpdCheckbox.checked;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const nome = document.getElementById('nome');
      const email = document.getElementById('email');
      const telefone = document.getElementById('telefone');

      let valid = true;

      // Clear previous error styles
      [nome, email, telefone].forEach(field => {
        field.style.borderColor = '';
      });

      if (!nome.value.trim()) {
        nome.style.borderColor = '#e74c3c';
        valid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.style.borderColor = '#e74c3c';
        valid = false;
      }

      if (!telefone.value.trim() || telefone.value.replace(/\D/g, '').length < 10) {
        telefone.style.borderColor = '#e74c3c';
        valid = false;
      }

      if (!lgpdCheckbox.checked) {
        valid = false;
      }

      if (!valid) return;

      // Simulate form submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="btn-icon" style="animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
          <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
        </svg>
        Enviando...
      `;

      // Add spinner animation
      const style = document.createElement('style');
      style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
      document.head.appendChild(style);

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1500);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ─── Cookie banner ────────────────────────────────
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');

  if (cookieBanner && cookieAccept) {
    // Show cookie banner after a short delay (if not already accepted)
    const cookiesAccepted = localStorage.getItem('rosario_cookies_accepted');

    if (!cookiesAccepted) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1500);
    }

    cookieAccept.addEventListener('click', () => {
      cookieBanner.classList.remove('show');
      localStorage.setItem('rosario_cookies_accepted', 'true');
    });
  }

  // ─── Active nav highlight on scroll ────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-links a');

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--gold-300)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // ─── Parallax effect on hero ──────────────────────
  const heroBg = document.querySelector('.hero__bg img');

  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }

});
