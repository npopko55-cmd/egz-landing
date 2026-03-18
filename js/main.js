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
   DOM-READY: All interactive effects
   ============================================================= */
document.addEventListener('DOMContentLoaded', function() {

  var isDesktop = window.matchMedia('(min-width: 768px)').matches;

  /* ---------------------------------------------------------
     A. Scroll-reveal via IntersectionObserver
     --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
     B. Sticky CTA: show when hero CTA leaves viewport
     --------------------------------------------------------- */
  var heroBtn = document.querySelector('.hero-cta');
  var stickyCta = document.querySelector('.sticky-cta');
  if (heroBtn && stickyCta) {
    var stickyObserver = new IntersectionObserver(function(entries) {
      stickyCta.classList.toggle('sticky-cta--visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    stickyObserver.observe(heroBtn);
  }

  /* ---------------------------------------------------------
     C. Header: glass effect on scroll
     --------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function() {
      header.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     D. Card hover glow (radial gradient follows cursor)
     --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
     E. Parallax orbs: mouse-follow on desktop
     --------------------------------------------------------- */
  var orbs = document.querySelectorAll('.orb');
  if (orbs.length && isDesktop) {
    var orbTicking = false;
    document.addEventListener('mousemove', function(e) {
      if (orbTicking) return;
      orbTicking = true;
      requestAnimationFrame(function() {
        var cx = (e.clientX / window.innerWidth - 0.5) * 2;
        var cy = (e.clientY / window.innerHeight - 0.5) * 2;
        orbs[0].style.transform = 'translate(' + (cx * 30) + 'px, ' + (cy * 20) + 'px)';
        if (orbs[1]) orbs[1].style.transform = 'translate(' + (cx * -20) + 'px, ' + (cy * 15) + 'px)';
        if (orbs[2]) orbs[2].style.transform = 'translate(' + (cx * 15) + 'px, ' + (cy * -25) + 'px)';
        orbTicking = false;
      });
    });
  }

  /* ---------------------------------------------------------
     F. MAGNETIC BUTTONS — button "pulls" toward cursor
     --------------------------------------------------------- */
  if (isDesktop) {
    document.querySelectorAll('[data-magnetic]').forEach(function(btn) {
      var strength = 0.3;

      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * strength;
        var dy = (e.clientY - cy) * strength;
        btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });

      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------------------------------------------------------
     G. ANIMATED COUNTERS — count up when visible
     --------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        counterObserver.unobserve(el);

        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 2000;
        var start = performance.now();

        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

        function update(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var value = Math.round(easeOutCubic(progress) * target);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }, { threshold: 0.5 });

    counters.forEach(function(c) { counterObserver.observe(c); });
  }

  /* ---------------------------------------------------------
     H. PARALLAX SECTIONS — subtle vertical offset on scroll
     --------------------------------------------------------- */
  if (isDesktop) {
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
      var parallaxTicking = false;
      window.addEventListener('scroll', function() {
        if (parallaxTicking) return;
        parallaxTicking = true;
        requestAnimationFrame(function() {
          var scrollY = window.scrollY;
          var vh = window.innerHeight;
          parallaxEls.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            // Only apply when section is near viewport
            if (rect.top < vh * 1.5 && rect.bottom > -vh * 0.5) {
              var center = rect.top + rect.height / 2 - vh / 2;
              var offset = center * -0.04; // subtle 4% shift
              el.style.transform = 'translateY(' + offset + 'px)';
            }
          });
          parallaxTicking = false;
        });
      }, { passive: true });
    }
  }

  /* ---------------------------------------------------------
     I. COUNTDOWN CELL PULSE — subtle glow on second tick
     --------------------------------------------------------- */
  var secEl = document.getElementById('cnt-seconds');
  if (secEl) {
    var cell = secEl.closest('.countdown-cell');
    if (cell) {
      setInterval(function() {
        cell.style.borderColor = 'rgba(123, 104, 238, 0.4)';
        cell.style.boxShadow = '0 0 20px rgba(123, 104, 238, 0.15)';
        setTimeout(function() {
          cell.style.borderColor = '';
          cell.style.boxShadow = '';
        }, 500);
      }, 1000);
    }
  }

});
