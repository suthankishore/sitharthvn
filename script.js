/* ═══════════════════════════════════
   SITHARTH VN — PORTFOLIO SCRIPTS
═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────
     1. NAVBAR — scroll + hamburger
  ───────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll state
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = y;
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  /* ─────────────────────────────────
     2. HERO — "VISUAL STORIES" letter reveal
  ───────────────────────────────── */
  const revealEl = document.getElementById('revealText');
  if (revealEl) {
    const text = revealEl.textContent.trim();
    revealEl.innerHTML = '';

    // Split into letter spans (keep spaces)
    [...text].forEach((char) => {
      if (char === ' ') {
        revealEl.innerHTML += '<span class="letter" style="display:inline-block;min-width:.3em">&nbsp;</span>';
      } else {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        revealEl.appendChild(span);
      }
    });

    // Stagger reveal
    setTimeout(() => {
      const letters = revealEl.querySelectorAll('.letter');
      letters.forEach((l, i) => {
        setTimeout(() => {
          l.classList.add('show');
        }, 80 * i);
      });
    }, 500); // start after hero fade-in
  }


  /* ─────────────────────────────────
     3. SCROLL REVEAL — fade-up elements
  ───────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');

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

  fadeEls.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────
     4. WORKS — filter buttons
  ───────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards  = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      workCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          // Re-trigger fade animation
          card.classList.remove('visible');
          void card.offsetWidth; // reflow
          setTimeout(() => card.classList.add('visible'), 20);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ─────────────────────────────────
     5. WORKS MODAL
  ───────────────────────────────── */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');
  const modalIframe  = document.getElementById('modalIframe');
  const modalTitle   = document.getElementById('modalTitle');
  const modalCat     = document.getElementById('modalCat');

  // Open modal on card click
  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoUrl = card.dataset.video || '';
      const title    = card.dataset.title || '';
      const sub      = card.dataset.sub   || '';

      modalTitle.textContent = title;
      modalCat.textContent   = sub;

      // Append autoplay param
      const sep = videoUrl.includes('?') ? '&' : '?';
      modalIframe.src = videoUrl + sep + 'autoplay=1&rel=0';

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    modalOverlay.classList.remove('open');
    modalIframe.src = '';
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });


  /* ─────────────────────────────────
     6. CONTACT FORM → WhatsApp redirect
  ───────────────────────────────── */
  const sendBtn  = document.getElementById('sendBtn');
  const fname    = document.getElementById('fname');
  const femail   = document.getElementById('femail');
  const fproject = document.getElementById('fproject');
  const fmessage = document.getElementById('fmessage');

  // WhatsApp number — replace with actual number (country code, no + or spaces)
  const WA_NUMBER = '918300183837';

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name    = fname.value.trim();
      const email   = femail.value.trim();
      const project = fproject.value;
      const message = fmessage.value.trim();

      // Basic validation
      if (!name || !email || !project || !message) {
        shakeBtn(sendBtn);
        return;
      }

      // Build WhatsApp message
      const waText =
        `Hi Sitharth VN, I saw your portfolio and I would like to discuss a project.\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Project Type: ${project}\n` +
        `Message: ${message}`;
      const encoded = encodeURIComponent(waText);
      const waUrl   = `https://wa.me/${WA_NUMBER}?text=${encoded}`;

      window.open(waUrl, '_blank');

      // Clear form
      fname.value    = '';
      femail.value   = '';
      fproject.value = '';
      fmessage.value = '';

      // Feedback
      sendBtn.textContent = 'SENT ✓';
      sendBtn.style.background = '#16a34a';
      setTimeout(() => {
        sendBtn.textContent   = 'SEND PROJECT';
        sendBtn.style.background = '';
      }, 3000);
    });
  }

  function shakeBtn(btn) {
    btn.style.animation = 'none';
    btn.style.border = '1px solid #ef4444';
    btn.style.boxShadow = '0 0 16px rgba(239,68,68,0.3)';
    setTimeout(() => {
      btn.style.border = '';
      btn.style.boxShadow = '';
    }, 1200);
  }


  /* ─────────────────────────────────
     7. SMOOTH ACTIVE NAV HIGHLIGHT
  ───────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
        });
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(s => sectionObserver.observe(s));


  /* ─────────────────────────────────
     8. STATS COUNTER ANIMATION
  ───────────────────────────────── */
  const counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1100;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);


  /* ─────────────────────────────────
     9. RESUME MODAL — cinematic PDF viewer
  ───────────────────────────────── */
  const resumeOverlay = document.getElementById('resumeOverlay');
  const resumeClose   = document.getElementById('resumeClose');
  const resumeTriggers = document.querySelectorAll('.skill-download');

  function openResumeModal() {
    resumeOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    resumeOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  resumeTriggers.forEach(el => el.addEventListener('click', openResumeModal));

  resumeClose.addEventListener('click', closeResumeModal);

  resumeOverlay.addEventListener('click', (e) => {
    if (e.target === resumeOverlay) closeResumeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeOverlay.classList.contains('open')) {
      closeResumeModal();
    }
  });


  /* ─────────────────────────────────
     10. GLOBAL COLLABORATION — live timezone clocks
  ───────────────────────────────── */
  function updateCollabTimes() {
    const config = [
      { id: 'time-usa', tz: 'America/New_York' },
      { id: 'time-uae', tz: 'Asia/Dubai' },
    ];
    const now = new Date();
    config.forEach(({ id, tz }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const time = now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true });
      el.textContent = time;
    });
  }
  updateCollabTimes();
  setInterval(updateCollabTimes, 60000);

});
