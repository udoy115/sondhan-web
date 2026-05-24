/* ========================================
   SONDHAN — main.js
   All interactivity for the static site
======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PAGE LOADER ──────────────────────── */
  const loader    = document.getElementById('loader');
  const loaderBar = document.querySelector('.loader-bar-fill');
  let progress = 0;

  const loaderInterval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;
    if (loaderBar) loaderBar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(loaderInterval);
      setTimeout(() => loader && loader.classList.add('hidden'), 320);
    }
  }, 60);



  /* ── SCROLL PROGRESS ──────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ── NAVBAR ───────────────────────────── */
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── MOBILE HAMBURGER ─────────────────── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobile-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      drawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── FLOATING ACTION BUTTON ───────────── */
  const fab        = document.getElementById('fab');
  const ctaSection = document.getElementById('download');

  if (fab && ctaSection) {
    window.addEventListener('scroll', () => {
      const rect    = ctaSection.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      fab.style.opacity       = visible ? '0' : '1';
      fab.style.pointerEvents = visible ? 'none' : 'all';
    }, { passive: true });
  }

  /* ── SCROLL REVEAL ────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObs.observe(el);
  });

  /* ── STEP TIMELINE (How It Works) ──────── */
  const stepItems   = document.querySelectorAll('.step-item[data-step]');
  const visualSteps = document.querySelectorAll('.how-visual-step');
  const progressDots = document.querySelectorAll('.how-progress-dot');

  function activateStep(index) {
    stepItems.forEach((s, i) => s.classList.toggle('active', i === index));
    visualSteps.forEach((v, i) => v.classList.toggle('active', i === index));
    progressDots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  if (stepItems.length) {
    activateStep(0);
    const stepObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = parseInt(e.target.dataset.step, 10);
          activateStep(idx);
        }
      });
    }, { threshold: 0.5 });
    stepItems.forEach(s => stepObs.observe(s));
  }

  /* ── COUNTER ANIMATION ────────────────── */
  function animateCounter(el) {
    const raw    = el.getAttribute('data-target') || el.textContent;
    const isNum  = /^\d+$/.test(raw.replace(/[^0-9]/g, ''));
    if (!isNum) return;

    const target   = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    const suffix   = raw.replace(/[0-9]/g, '');
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));

  /* ── SMOOTH SCROLL for in-page links ──── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
