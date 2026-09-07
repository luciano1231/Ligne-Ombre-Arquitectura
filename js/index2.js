/* ==========================================================
   index2.js — Hero con video controlado por scroll
   El tiempo del video se ata a la posición de scroll dentro
   de .hero--scroll. Al terminar el carril, el video queda en
   su último frame y sigue el resto de la página.
   ========================================================== */
(function () {
  'use strict';

  var track = document.querySelector('.hero--scroll');
  var video = document.querySelector('.hero__video');
  if (!track || !video) return;

  // Respetar "reducir movimiento": dejamos el primer frame quieto.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    try { video.pause(); } catch (e) {}
    return;
  }

  video.pause();
  video.removeAttribute('autoplay');
  video.removeAttribute('loop');

  var duration = 0;
  var wanted = 0;      // segundo objetivo segun el scroll
  var smoothed = 0;    // segundo interpolado que se aplica al video
  var ticking = false;

  function readDuration() {
    if (isFinite(video.duration) && video.duration > 0) {
      duration = video.duration;
      onScroll();
    }
  }
  if (video.readyState >= 1) readDuration();
  video.addEventListener('loadedmetadata', readDuration);
  video.addEventListener('durationchange', readDuration);

  // Forzar la decodificación del primer frame (algunos navegadores
  // no lo pintan hasta un play()). Al estar muted, la política de
  // autoplay lo permite.
  function primePaint() {
    var p = video.play();
    if (p && typeof p.then === 'function') {
      p.then(function () { video.pause(); video.currentTime = smoothed || 0; })
       .catch(function () {});
    } else {
      try { video.pause(); } catch (e) {}
    }
  }
  primePaint();

  function progress() {
    var scrollable = track.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    var top = track.getBoundingClientRect().top;   // negativo al pasar el tope
    var p = -top / scrollable;
    return p < 0 ? 0 : (p > 1 ? 1 : p);
  }

  function onScroll() {
    if (!duration) return;
    var p = progress();
    wanted = p * duration;
    track.classList.toggle('is-finished', p >= 0.999);
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
  }

  function tick() {
    // Interpola hacia el objetivo para que el video "siga corriendo"
    // un instante despues de soltar el scroll.
    var diff = wanted - smoothed;
    if (Math.abs(diff) < 0.015) {
      smoothed = wanted;
      ticking = false;
    } else {
      smoothed += diff * 0.18;
      requestAnimationFrame(tick);
    }
    if (video.readyState >= 2) {
      try { video.currentTime = smoothed; } catch (e) {}
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
