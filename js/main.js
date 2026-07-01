/* ================================================
   LIGNE & OMBRE STUDIO — Global JS
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const dot    = document.querySelector('.cursor__dot');
  const circle = document.querySelector('.cursor__circle');
  let mouseX = 0, mouseY = 0, circleX = 0, circleY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) {
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    }
  });

  function animateCursor() {
    if (circle) {
      circleX += (mouseX - circleX) * 0.12;
      circleY += (mouseY - circleY) * 0.12;
      circle.style.left = circleX + 'px';
      circle.style.top  = circleY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .card, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (circle) {
        circle.style.width  = '60px';
        circle.style.height = '60px';
        circle.style.borderColor = 'rgba(201,169,110,.8)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (circle) {
        circle.style.width  = '36px';
        circle.style.height = '36px';
        circle.style.borderColor = 'rgba(255,255,255,1)';
      }
    });
  });

  /* ── NAV SCROLL STATE ── */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE MENU ── */
  const burger   = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const closeBtn = document.querySelector('.nav__mobile-close');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.add('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
  }

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = (i % 4) * 80;
    revealObserver.observe(el);
  });

  /* ── PARALLAX ── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  function updateParallax() {
    parallaxEls.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.25;
      // Use the parent element's rect to avoid reading the transformed bounds of the image itself
      const parent = el.parentElement;
      const rect   = parent.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      // Progress goes from 1 (entering bottom) to -1 (leaving top)
      const progress = (center - window.innerHeight / 2) / (window.innerHeight / 2 + rect.height / 2);
      // Offset is strictly bounded by the element's height
      const offset = progress * rect.height * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
    requestAnimationFrame(updateParallax);
  }
  updateParallax();

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    }, 16);
  }

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ── MODAL ── */
  let currentModalImages = [];
  let currentModalIndex = 0;

  window.openModal = (data) => {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;

    currentModalImages = data.images || (data.img ? [data.img] : []);
    currentModalIndex = 0;

    const imgEl = overlay.querySelector('.modal__img');
    const prevBtn = overlay.querySelector('.modal__prev');
    const nextBtn = overlay.querySelector('.modal__next');
    
    if (currentModalImages.length > 0) {
      imgEl.src = currentModalImages[currentModalIndex];
    }
    imgEl.alt = data.title;
    
    if (prevBtn && nextBtn) {
      const showNav = currentModalImages.length > 1;
      prevBtn.style.display = showNav ? 'flex' : 'none';
      nextBtn.style.display = showNav ? 'flex' : 'none';
    }

    overlay.querySelector('.modal__cat').textContent  = data.category;
    overlay.querySelector('.modal__title').textContent = data.title;
    overlay.querySelector('.modal__desc').textContent  = data.desc;
    if (overlay.querySelector('.modal__year'))
      overlay.querySelector('.modal__year').textContent = data.year || '';
    
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.updateModalImage = (direction = 'next') => {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay || currentModalImages.length === 0) return;
    const imgEl = overlay.querySelector('.modal__img');
    
    imgEl.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    imgEl.style.opacity = '0';
    imgEl.style.transform = direction === 'next' ? 'translateX(-30px)' : 'translateX(30px)';
    
    setTimeout(() => {
      imgEl.src = currentModalImages[currentModalIndex];
      imgEl.style.transition = 'none';
      imgEl.style.transform = direction === 'next' ? 'translateX(30px)' : 'translateX(-30px)';
      
      // Force reflow
      void imgEl.offsetWidth;
      
      imgEl.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
      imgEl.style.opacity = '1';
      imgEl.style.transform = 'translateX(0)';
    }, 250);
  };

  window.prevModalImage = () => {
    if (currentModalImages.length <= 1) return;
    currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
    updateModalImage('prev');
  };

  window.nextModalImage = () => {
    if (currentModalImages.length <= 1) return;
    currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
    updateModalImage('next');
  };

  window.closeModal = () => {
    document.querySelector('.modal-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) window.closeModal();
  });

  /* SWIPE LOGIC */
  let touchStartX = 0;
  let touchEndX = 0;

  const handleSwipe = () => {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) window.nextModalImage();
    if (touchEndX > touchStartX + threshold) window.prevModalImage();
  };

  document.addEventListener('touchstart', e => {
    if (e.target.classList.contains('modal__img')) {
      touchStartX = e.changedTouches[0].screenX;
    }
  });
  
  document.addEventListener('touchend', e => {
    if (e.target.classList.contains('modal__img')) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }
  });

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── PROGRESS BAR ── */
  const bar = document.querySelector('.progress-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

});
