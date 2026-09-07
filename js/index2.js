/* ==========================================================
   index2.js — Hero con video "enganchado" al scroll
   Al estar en el hero, la rueda / el gesto de scroll NO mueve
   la pagina: hace avanzar el video. Cuando el video termina,
   el scroll se libera y sigue el resto del sitio. Si el usuario
   vuelve arriba de todo y sigue subiendo, se re-engancha y el
   video "rebobina".
   ========================================================== */
(function () {
  'use strict';

  var hero    = document.querySelector('.hero--scroll');
  var video   = document.querySelector('.hero__video');
  var vbar    = document.getElementById('heroVProgress');
  var skipBtn = document.getElementById('heroSkip');
  if (!hero || !video) return;

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Cuanta "rueda" acumulada (en px) hace falta para reproducir
     el video completo. Mas alto = mas scroll para terminarlo. */
  var SCRUB_DISTANCE = 2200;

  var DURATION = 0;      // duracion real del video (s)
  var acc      = 0;      // scroll virtual acumulado [0 .. SCRUB_DISTANCE]
  var wanted   = 0;      // segundo objetivo del video
  var smoothed = 0;      // segundo aplicado (interpolado, para suavizar)
  var raf      = null;
  var released = false;  // el video ya termino -> scroll libre
  var locked   = false;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function lock() {
    if (locked || reduceMotion || released) return;
    locked = true;
    docEl.classList.add('hero-lock');
    window.scrollTo(0, 0);
  }
  function unlock() {
    if (!locked) return;
    locked = false;
    docEl.classList.remove('hero-lock');
  }

  function release(scrollToNext) {
    if (released) return;
    released = true;
    acc = SCRUB_DISTANCE;
    hero.classList.add('is-released');
    unlock();
    if (scrollToNext && hero.nextElementSibling) {
      hero.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function reEngage() {
    if (!released || reduceMotion) return;
    released = false;
    hero.classList.remove('is-released');
    acc = SCRUB_DISTANCE;   // arranca desde el final para poder rebobinar
    lock();
    schedule();
  }

  /* ---- loop de render (suaviza el salto de currentTime) ---- */
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(render);
  }
  function render() {
    raf = null;
    if (!DURATION) return;

    var p = clamp(acc / SCRUB_DISTANCE, 0, 1);
    wanted = p * DURATION;
    if (vbar) vbar.style.width = (p * 100).toFixed(2) + '%';

    var diff = wanted - smoothed;
    if (Math.abs(diff) < 0.012) {
      smoothed = wanted;
    } else {
      smoothed += diff * 0.16;
      schedule();
    }
    if (video.readyState >= 2) {
      try { video.currentTime = smoothed; } catch (e) {}
    }

    if (p >= 0.999 && !released) release(false);
  }

  /* ---- entrada unificada de scroll ---- */
  function feed(delta) {
    if (reduceMotion) return;

    if (released) {
      if (window.scrollY <= 0 && delta < 0) reEngage();
      else return;
    } else if (!locked) {
      lock();
    }

    acc = clamp(acc + delta, 0, SCRUB_DISTANCE);
    schedule();

    if (acc >= SCRUB_DISTANCE) release(false);
  }

  /* wheel */
  window.addEventListener('wheel', function (e) {
    if (reduceMotion) return;
    if (released && !(window.scrollY <= 0 && e.deltaY < 0)) return; // scroll normal
    e.preventDefault();
    feed(e.deltaY);
  }, { passive: false });

  /* touch */
  var touchY = null;
  window.addEventListener('touchstart', function (e) {
    touchY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (touchY === null || reduceMotion) return;
    var y = e.touches[0].clientY;
    var delta = (touchY - y) * 2.2;   // sensibilidad tactil
    touchY = y;
    if (released && !(window.scrollY <= 0 && delta < 0)) return;
    e.preventDefault();
    feed(delta);
  }, { passive: false });
  window.addEventListener('touchend', function () { touchY = null; }, { passive: true });

  /* teclado — para que nadie quede atrapado */
  window.addEventListener('keydown', function (e) {
    if (released || reduceMotion) return;
    var k = e.key;
    if (k === 'Escape') { e.preventDefault(); release(true); return; }
    if (k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Spacebar') {
      e.preventDefault();
      feed(k === 'ArrowDown' ? 160 : 520);
    } else if (k === 'ArrowUp' || k === 'PageUp') {
      e.preventDefault();
      feed(k === 'ArrowUp' ? -160 : -520);
    }
  });

  /* clicks en links internos del hero mientras esta enganchado:
     liberamos y llevamos a la seccion */
  hero.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || released) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    release(false);
    requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (skipBtn) skipBtn.addEventListener('click', function () { release(true); });

  /* ---- init ---- */
  function initDuration() {
    if (isFinite(video.duration) && video.duration > 0) {
      DURATION = video.duration;
      schedule();
    }
  }
  video.pause();
  video.removeAttribute('autoplay');
  video.removeAttribute('loop');
  if (video.readyState >= 1) initDuration();
  video.addEventListener('loadedmetadata', initDuration);
  video.addEventListener('durationchange', initDuration);

  /* forzar el pintado del primer frame (algunos navegadores no
     lo muestran hasta un play()) */
  var pr = video.play();
  if (pr && typeof pr.then === 'function') {
    pr.then(function () { video.pause(); video.currentTime = 0; }).catch(function () {});
  }

  /* salvavidas: si en 5s no se conocio la duracion, no secuestramos nada */
  setTimeout(function () {
    if (!DURATION) { reduceMotion = true; unlock(); hero.classList.add('is-released'); }
  }, 5000);

  /* si la pagina carga ya scrolleada (recarga a mitad de sitio),
     no enganchamos */
  if (window.scrollY > 10) {
    released = true;
    hero.classList.add('is-released');
  } else if (!reduceMotion) {
    lock();
  }
})();
