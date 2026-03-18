/* =============================================================
   BLOCK 1 — Smooth Scroll
   Must be on window for onclick="" handlers in HTML
   ============================================================= */
function scrollToFinal() {
  var finalBlock = document.getElementById('final-block');
  if (finalBlock) finalBlock.scrollIntoView({ behavior: 'smooth' });
}
window.scrollToFinal = scrollToFinal;

/* =============================================================
   BLOCK 2 — Countdown Timer
   Target: 2026-03-24T19:00:00+03:00 (Moscow Standard Time)
   +03:00 hard-codes UTC+3 — DO NOT remove this offset.
   Without it, Date() parses as local device time which varies
   by user location and would produce wrong countdowns.
   Russia does not observe DST (abolished 2014), so +03:00
   is permanent and correct for all future dates.
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
  // CTA button intentionally remains visible after deadline
}

function tick() {
  var diff = TARGET.getTime() - Date.now();
  if (diff <= 0) { showPostDeadlineState(); return; }
  var days    = Math.floor(diff / 86400000);
  var hours   = Math.floor((diff % 86400000) / 3600000);
  var minutes = Math.floor((diff % 3600000) / 60000);
  var seconds = Math.floor((diff % 60000) / 1000);
  var dEl = document.getElementById('cnt-days');
  var hEl = document.getElementById('cnt-hours');
  var mEl = document.getElementById('cnt-minutes');
  var sEl = document.getElementById('cnt-seconds');
  if (dEl) dEl.textContent = pad(days);
  if (hEl) hEl.textContent = pad(hours);
  if (mEl) mEl.textContent = pad(minutes);
  if (sEl) sEl.textContent = pad(seconds);
}

// Run immediately to avoid 1-second blank on page load
tick();
timer = setInterval(tick, 1000);

/* =============================================================
   BLOCK 3 — DOM-dependent observers (inside DOMContentLoaded)
   ============================================================= */
document.addEventListener('DOMContentLoaded', function() {

  // Scroll-reveal: IntersectionObserver, threshold 0.15, fires once per element
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  // Sticky CTA: watch hero primary CTA; show sticky bar when hero CTA leaves viewport
  var heroBtn = document.querySelector('.hero .btn-primary');
  var stickyCta = document.querySelector('.sticky-cta');
  if (heroBtn && stickyCta) {
    var stickyObserver = new IntersectionObserver(function(entries) {
      stickyCta.classList.toggle('sticky-cta--visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    stickyObserver.observe(heroBtn);
  }

});
