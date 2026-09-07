/* ORBIT LAB — site behaviour: sticky header, mobile nav, scroll reveal */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  /* ---- Header state on scroll ---- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile navigation ---- */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- Scroll reveal ----
     Never allow content to stay hidden. Three layers of safety:
       1. IntersectionObserver reveals items as they scroll into view.
       2. A scroll/resize fallback covers observers that never deliver.
       3. A hard timeout reveals everything regardless.                 */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (revealables.length) {
    var revealAll = function () {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    };

    var show = function (el) {
      el.classList.add('is-visible');
      var i = revealables.indexOf(el);
      if (i > -1) { revealables.splice(i, 1); }
    };

    var checkInView = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      revealables.slice().forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) { show(el); }
      });
    };

    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 90 + 'ms';
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }

    // Fallback 2: geometry check on scroll/resize.
    checkInView();
    window.addEventListener('scroll', checkInView, { passive: true });
    window.addEventListener('resize', checkInView, { passive: true });
    window.addEventListener('load', checkInView);

    // Fallback 3: reveal everything if anything above went wrong.
    setTimeout(revealAll, 3000);
  }

  /* ---- Pause hero video when off-screen (saves battery/data) ---- */
  var heroVideo = document.querySelector('.hero__media');
  if (heroVideo && 'IntersectionObserver' in window && typeof heroVideo.play === 'function') {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var p = heroVideo.play();
          if (p && p.catch) { p.catch(function () {}); }
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.1 });
    vo.observe(heroVideo);
  }
})();
