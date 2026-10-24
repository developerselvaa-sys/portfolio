/**
 * DEV SELVA — Creative Developer & Graphic Designer Portfolio
 * Pure Vanilla JavaScript — Lightweight, Accessible & Fluid
 * Includes: Animated Theme Engine, ScrollSpy, IntersectionObserver, Card Spotlight
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. DOM Elements
  const header = document.getElementById('site-header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const revealElements = document.querySelectorAll('.reveal');
  const currentYearSpan = document.getElementById('currentYear');
  
  // Theme elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeNameText = document.getElementById('themeNameText');
  const mobileThemePills = document.querySelectorAll('.mobile-theme-pill');

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Set Dynamic Year in Footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 3. Animated Theme Switcher Engine (Light / Dark / Cyber Violet)
  // --------------------------------------------------------------------------
  const THEMES = ['light', 'dark', 'cyber'];
  const THEME_LABELS = {
    light: 'Warm Light',
    dark: 'Midnight Dark',
    cyber: 'Cyber Violet'
  };

  const getSavedTheme = () => {
    const saved = localStorage.getItem('devselva-theme');
    if (saved && THEMES.includes(saved)) {
      return saved;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light'; // Default signature palette
  };

  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('devselva-theme', themeName);

    // Update desktop button label
    if (themeNameText) {
      themeNameText.textContent = THEME_LABELS[themeName] || 'Theme';
    }

    // Synchronize mobile pills
    mobileThemePills.forEach(pill => {
      if (pill.getAttribute('data-theme-set') === themeName) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  };

  // Initialize Theme
  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);

  // Desktop Toggle Button (Cycles Light -> Dark -> Cyber)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const currentIndex = THEMES.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      const nextTheme = THEMES[nextIndex];
      applyTheme(nextTheme);
    });
  }

  // Mobile Theme Pills
  mobileThemePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetTheme = pill.getAttribute('data-theme-set');
      if (targetTheme && THEMES.includes(targetTheme)) {
        applyTheme(targetTheme);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Header Scroll Effect
  // --------------------------------------------------------------------------
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check

  // --------------------------------------------------------------------------
  // 5. Mobile Menu Navigation (Accessible Drawer)
  // --------------------------------------------------------------------------
  const openMobileMenu = () => {
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeMobileMenu = () => {
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scroll
  };

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on navigation click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileMenu();
        mobileMenuBtn.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Scroll-Triggered Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Once revealed, remain visible
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: If reduced motion is requested or IntersectionObserver isn't supported
    revealElements.forEach(el => {
      el.classList.add('active');
    });
  }

  // --------------------------------------------------------------------------
  // 7. Active Navigation Link Tracking (ScrollSpy)
  // --------------------------------------------------------------------------
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopNavLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  document.querySelectorAll('section[id]').forEach(section => {
    navObserver.observe(section);
  });

  // --------------------------------------------------------------------------
  // 8. Smooth Anchor Scroll with Offset Handling
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Set focus for accessibility without jumping
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Subtle Editorial Photo Micro-Interaction
  // --------------------------------------------------------------------------
  const photoComposition = document.querySelector('.editorial-photo-composition');
  if (photoComposition && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    photoComposition.addEventListener('mousemove', (e) => {
      const rect = photoComposition.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const photo = photoComposition.querySelector('.personal-photo');
      const backdrop = photoComposition.querySelector('.photo-backdrop-block');

      if (photo) {
        photo.style.transform = `scale(1.015) translate(${x * 6}px, ${y * 6}px)`;
      }
      if (backdrop) {
        backdrop.style.transform = `rotate(2deg) translate(${x * -8}px, ${y * -8}px)`;
      }
    });

    photoComposition.addEventListener('mouseleave', () => {
      const photo = photoComposition.querySelector('.personal-photo');
      const backdrop = photoComposition.querySelector('.photo-backdrop-block');

      if (photo) {
        photo.style.transform = '';
      }
      if (backdrop) {
        backdrop.style.transform = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Card Spotlight Micro-Glow on Mouse Move
  // --------------------------------------------------------------------------
  const interactiveCards = document.querySelectorAll('.project-card, .service-card, .skill-group-card');
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    interactiveCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. Console Creative Developer Monogram Easter Egg
  // --------------------------------------------------------------------------
  console.log(
    `%c Dev Selva %c Creative Web Developer & Graphic Designer \n%c https://www.instagram.com/developerselvaa/ `,
    'background: #8A75E8; color: #FAF9F6; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #20211F; color: #C9F27A; font-size: 12px; padding: 4px 8px; border-radius: 0 4px 4px 0;',
    'color: #73736E; font-size: 11px; padding: 4px 0;'
  );
});
