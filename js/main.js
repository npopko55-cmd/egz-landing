/* =============================================================
   SMOOTH SCROLL — available globally for onclick handlers
   ============================================================= */
function scrollToFinal() {
  var el = document.getElementById('final-block');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
window.scrollToFinal = scrollToFinal;

/* =============================================================
   COUNTDOWN TIMER
   Target: 2026-03-24T19:00:00+03:00 (Moscow Standard Time, UTC+3 permanent)
   ============================================================= */
var TARGET = new Date('2026-03-24T19:00:00+03:00');
var pad = function(n) { return String(n).padStart(2, '0'); };
var timer;

function showPostDeadlineState() {
  clearInterval(timer);
  var row = document.querySelector('.countdown-row');
  var banner = document.querySelector('.post-deadline');
  if (row) row.style.display = 'none';
  if (banner) banner.style.display = 'block';
}

function tick() {
  var diff = TARGET.getTime() - Date.now();
  if (diff <= 0) { showPostDeadlineState(); return; }
  var d = Math.floor(diff / 86400000);
  var h = Math.floor((diff % 86400000) / 3600000);
  var m = Math.floor((diff % 3600000) / 60000);
  var s = Math.floor((diff % 60000) / 1000);
  var dEl = document.getElementById('cnt-days');
  var hEl = document.getElementById('cnt-hours');
  var mEl = document.getElementById('cnt-minutes');
  var sEl = document.getElementById('cnt-seconds');
  if (dEl) dEl.textContent = pad(d);
  if (hEl) hEl.textContent = pad(h);
  if (mEl) mEl.textContent = pad(m);
  if (sEl) sEl.textContent = pad(s);
}

tick();
timer = setInterval(tick, 1000);

/* =============================================================
   DOM-READY: Observers, Header scroll, Parallax
   ============================================================= */
document.addEventListener('DOMContentLoaded', function() {

  /* --- Scroll-reveal via IntersectionObserver --- */
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  /* --- Sticky CTA: show when hero CTA leaves viewport --- */
  var heroBtn = document.querySelector('.hero-cta');
  var stickyCta = document.querySelector('.sticky-cta');
  if (heroBtn && stickyCta) {
    var stickyObserver = new IntersectionObserver(function(entries) {
      stickyCta.classList.toggle('sticky-cta--visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    stickyObserver.observe(heroBtn);
  }

  /* --- Header: add .scrolled class after 80px scroll --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function() {
      header.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Parallax orbs: subtle mouse-follow on desktop --- */
  var orbs = document.querySelectorAll('.orb');
  if (orbs.length && window.matchMedia('(min-width: 768px)').matches) {
    var ticking = false;
    document.addEventListener('mousemove', function(e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function() {
        var cx = (e.clientX / window.innerWidth - 0.5) * 2;
        var cy = (e.clientY / window.innerHeight - 0.5) * 2;
        orbs[0].style.transform = 'translate(' + (cx * 30) + 'px, ' + (cy * 20) + 'px)';
        if (orbs[1]) orbs[1].style.transform = 'translate(' + (cx * -20) + 'px, ' + (cy * 15) + 'px)';
        if (orbs[2]) orbs[2].style.transform = 'translate(' + (cx * 15) + 'px, ' + (cy * -25) + 'px)';
        ticking = false;
      });
    });
  }

  /* --- Card hover glow effect --- */
  document.querySelectorAll('.program-card, .pain-card, .meta-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.background = 'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(123,104,238,0.06), rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.02))';
    });
    card.addEventListener('mouseleave', function() {
      card.style.background = '';
    });
  });

});
