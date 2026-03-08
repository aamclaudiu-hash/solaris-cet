/* =========================================================
   Solaris CET – Main JavaScript
   ========================================================= */

'use strict';

/* ---------- Navigation ---------- */
(function initNav() {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  // Sticky background on scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      nav.style.background = 'rgba(5, 6, 11, 0.97)';
    } else {
      nav.style.background = 'rgba(5, 6, 11, 0.85)';
    }
  }, { passive: true });

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close on link click
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* ---------- Active Nav Link on Scroll ---------- */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActive() {
    const scrollY = window.scrollY + 80;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (a) { a.classList.remove('active'); });
        const active = document.querySelector('.nav-links a[href="#' + section.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ---------- Intersection Observer – Fade In ---------- */
(function initFadeIn() {
  const items = document.querySelectorAll('[data-fade]');
  if (!items.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) {
    el.style.opacity = '0';
    observer.observe(el);
  });
})();

/* ---------- Mining Calculator ---------- */
(function initCalculator() {
  var hashSlider  = document.getElementById('hashrate-slider');
  var stakeSlider = document.getElementById('stake-slider');
  var hashDisplay = document.getElementById('hashrate-display');
  var stakeDisplay = document.getElementById('stake-display');
  var dailyResult  = document.getElementById('daily-result');
  var monthResult  = document.getElementById('monthly-result');
  var apyResult    = document.getElementById('apy-result');

  if (!hashSlider) return;

  function formatNum(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  }

  function calculate() {
    var hash  = parseFloat(hashSlider.value)  || 1;
    var stake = parseFloat(stakeSlider.value) || 0;

    // Simplified reward model
    var baseDaily  = hash * 0.0008;
    var stakeBonus = stake * 0.00015;
    var daily      = baseDaily + stakeBonus;
    var monthly    = daily * 30;
    var apy        = stake > 0 ? ((stakeBonus * 365) / stake * 100).toFixed(1) : '—';

    if (hashDisplay)  hashDisplay.textContent  = hash + ' TH/s';
    if (stakeDisplay) stakeDisplay.textContent = stake + ' BTC-S';
    if (dailyResult)  dailyResult.textContent  = formatNum(daily)   + ' BTC-S';
    if (monthResult)  monthResult.textContent  = formatNum(monthly) + ' BTC-S';
    if (apyResult)    apyResult.textContent    = (typeof apy === 'string' ? apy : apy + '%');
  }

  hashSlider.addEventListener('input',  calculate);
  stakeSlider.addEventListener('input', calculate);
  calculate();
})();

/* ---------- Newsletter Form ---------- */
(function initNewsletter() {
  var form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('input[type="email"]');
    var btn   = form.querySelector('button');
    if (!input || !input.value) return;

    btn.textContent = '✓ Subscribed';
    btn.disabled = true;
    input.value = '';
    setTimeout(function () {
      btn.textContent = 'Subscribe';
      btn.disabled = false;
    }, 3000);
  });
})();

/* ---------- Counter Animation ---------- */
(function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el     = entry.target;
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var duration = 1200;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.floor(progress * target);
        el.textContent = value.toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
})();
