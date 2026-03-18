# Phase 1: Landing Page — Research

**Researched:** 2026-03-18
**Domain:** Vanilla HTML/CSS/JS static landing page, GitHub Pages deployment, dark futuristic UI
**Confidence:** HIGH (stack locked, UI-SPEC exists, design system defined)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Vanilla HTML/CSS/JS без фреймворков и сборщиков (LAND-14) — никаких React/Vue/сборщиков
- Деплой на GitHub Pages — статика only, `.nojekyll` в корне
- Тёмная тема, максимальная футуристичность: glow-свечения, неоновые акценты, градиентные фоны, blur-эффекты — уровень Vortek VR
- Scroll-анимации: fade-in + сдвиг снизу при скролле (IntersectionObserver)
- CTA-кнопки hero, mid, «Кому стоит прийти» скроллят к финальному блоку, оттуда deep link в бот
- Sticky CTA появляется после скролла мимо hero-блока (когда hero-CTA уходит за экран)
- Countdown до 24 марта 2026, 19:00 МСК (+03:00); подпись «МСК» обязательна; после дедлайна — «Эфир уже идёт!»
- Основная CTA: `https://t.me/<botname>?start=landing` (placeholder)
- Вторичная CTA «Задать вопрос»: `https://t.me/vadimsorokin_egz`
- Тон: дружеский, разговорный, на «ты» — как пост в Telegram-канале Вадима
- Дизайн обязательно через навык frontend-design на Opus 4.6
- Боли ЦА — точные формулировки (не переписывать)
- Подпись: «Вадим Сорокин, основатель EGZ»

### Claude's Discretion

- Акцентный цвет (фиолетовый/синий/оранжевый — подобрать под референсы)
- Визуал countdown-таймера (крупные цифры или flip-карточки)
- Обработка фото Вадима в hero (glow, без эффектов, или другой вариант)
- Точная типографика, spacing, размеры шрифтов
- Loading skeleton / preloader
- Error states

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LAND-01 | Тёмная тема, премиальный дизайн уровня Vortek VR/Terrixa/FRZN | UI-SPEC color system, CSS custom properties, radial gradient backgrounds |
| LAND-02 | Mobile-first responsive вёрстка (основной трафик из Telegram = телефон) | Breakpoints defined in UI-SPEC: <480px base, 480-767px mid, ≥768px desktop |
| LAND-03 | Дизайн-решения на основе референсов (не навязывать минимализм) | Dark futuristic patterns: layered box-shadow, glow effects, CSS gradients |
| LAND-04 | Плавные scroll-анимации (появление блоков при скролле) | IntersectionObserver API, threshold 0.15, translate+opacity transitions |
| LAND-05 | Дизайн через навык frontend-design на Opus 4.6 | Mandatory skill, LAND-05 constraint |
| LAND-06 | Hero-блок: логотип, заголовок, фото Вадима, мета, CTA | Asset placeholders defined; initials fallback on img error |
| LAND-07 | Блок «Что разберём на эфире»: 5 пунктов + CTA | Copywriting contract in UI-SPEC |
| LAND-08 | Блок «Кому стоит прийти»: 5 болей ЦА + CTA | Exact copy locked in CONTEXT.md — do not rephrase |
| LAND-09 | Финальный блок: countdown + CTA основная + CTA вторичная | Countdown target: `2026-03-24T19:00:00+03:00`; explicit UTC offset |
| LAND-10 | Sticky CTA внизу экрана на мобильном | IntersectionObserver on hero CTA, CSS position:fixed, safe-area-inset-bottom |
| LAND-11 | Countdown с явным указанием МСК (+03:00) | Hard-code `+03:00` offset in ISO string; display static «МСК» tag |
| LAND-12 | Все CTA (кроме финального) → smooth scroll к финальному блоку | `scrollIntoView({ behavior: 'smooth' })` на `#final-block` |
| LAND-13 | Deep link формат: `https://t.me/<botname>?start=landing` (placeholder) | Telegram standard deep link; opens Telegram app on mobile |
| LAND-14 | Vanilla HTML/CSS/JS без фреймворков | Single `index.html`, inline or `<link>`-ed CSS, no npm/build |
| LAND-15 | Деплой на GitHub Pages с `.nojekyll` | Empty `.nojekyll` in repo root prevents Jekyll processing |
| LAND-16 | Для изображений — промпты для Нана Банана; пока placeholder | `assets/vadim-photo.jpg` placeholder; CSS initials fallback |
</phase_requirements>

---

## Summary

Phase 1 is a greenfield static landing page. No build tooling, no frameworks, no npm. The tech stack is fully locked: vanilla HTML/CSS/JS, hosted on GitHub Pages. The UI-SPEC (`01-UI-SPEC.md`) already defines the complete design system — colors, typography, spacing, component inventory, interaction contracts, and copywriting. Research confirms the chosen approaches are correct and industry-standard.

The most critical implementation detail is the countdown timer: target time MUST be expressed as `new Date('2026-03-24T19:00:00+03:00')` — the hard-coded `+03:00` UTC offset guarantees correct behavior regardless of the user's device timezone. Using `new Date('2026-03-24T19:00:00')` (no offset) would calculate against the user's local timezone and break for anyone outside Moscow.

The sticky CTA and scroll-reveal both use IntersectionObserver, which is the correct asynchronous approach that avoids scroll event handler performance issues. The implementation should follow the pattern in the UI-SPEC precisely.

**Primary recommendation:** Implement directly from UI-SPEC. The design contract is complete. Focus execution energy on the countdown timer timezone correctness, sticky CTA visibility logic, and Telegram deep link formatting.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla HTML5 | — | Page structure | Locked decision LAND-14 |
| Vanilla CSS3 | — | Styling, animations, layout | Locked decision LAND-14 |
| Vanilla JS (ES6+) | — | Countdown, IntersectionObserver, scroll logic | Locked decision LAND-14 |
| Inter (Google Fonts CDN) | variable | Typography | Specified in UI-SPEC; neutral grotesque, premium feel |

### Supporting (CDN only — no npm)

| Resource | Version | Purpose | When to Use |
|----------|---------|---------|-------------|
| `fonts.googleapis.com` | — | Inter font weights 400+700 | Always — single `<link>` in `<head>` |
| GitHub Pages | — | Static hosting | Locked deployment target |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla JS | Alpine.js | Alpine would simplify state but violates LAND-14 no-framework constraint |
| IntersectionObserver | scroll event listener | Scroll events fire on main thread; IntersectionObserver is async and performant |
| `+03:00` in ISO string | Intl API timezone | Intl API is cleaner but overkill; hard-coded offset is explicit and reliable for single timezone |

**Installation:** None. No npm. Assets delivered via CDN `<link>` tags only.

---

## Architecture Patterns

### Recommended Project Structure

```
/ (repo root)
├── index.html           # Single page, all HTML
├── .nojekyll            # Empty file — disables Jekyll on GitHub Pages
├── assets/
│   ├── vadim-photo.jpg  # Placeholder image (or real photo when provided)
│   └── egz-logo.svg     # Placeholder logo (or real logo when provided)
├── css/
│   └── style.css        # All styles, CSS custom properties at :root
└── js/
    └── main.js          # Countdown, IntersectionObserver, sticky CTA, smooth scroll
```

### Pattern 1: CSS Custom Properties Design System

**What:** All colors, spacing, typography sizes declared as `--variable` on `:root`.
**When to use:** Always — enables consistent theming and readable code without preprocessors.

```css
/* Source: UI-SPEC design system */
:root {
  --color-bg: #0A0A0F;
  --color-surface: #12121A;
  --color-accent: #7C3AED;
  --color-accent-glow: rgba(124, 58, 237, 0.35);
  --color-accent-alt: #A855F7;
  --color-text: #F0F0F8;
  --color-text-muted: #8888A8;
  --color-border: rgba(255,255,255,0.08);
  --space-xs: 4px; --space-sm: 8px; --space-md: 16px;
  --space-lg: 24px; --space-xl: 32px; --space-2xl: 48px; --space-3xl: 64px;
}
```

### Pattern 2: Countdown Timer with Explicit UTC Offset

**What:** Calculate remaining time against a fixed ISO date string with explicit `+03:00` offset.
**When to use:** Any countdown where the target time is in a specific timezone (not UTC).

```javascript
// Source: verified countdown timezone best practice
const TARGET = new Date('2026-03-24T19:00:00+03:00');

function tick() {
  const now = Date.now();
  const diff = TARGET.getTime() - now;
  if (diff <= 0) {
    showPostDeadlineState();
    return;
  }
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  renderCountdown(days, hours, minutes, seconds);
}

const timer = setInterval(tick, 1000);
tick(); // run immediately, no 1-second blank on load
```

### Pattern 3: IntersectionObserver for Scroll-Reveal

**What:** Observe elements with class `.reveal`; add `.visible` when threshold is crossed.
**When to use:** Fade-in animations on scroll without scroll event handlers.

```javascript
// Source: UI-SPEC Interaction Contract LAND-04
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal { transform: none; transition: opacity 0.5s ease; }
}
```

### Pattern 4: Sticky CTA via IntersectionObserver

**What:** Watch hero's primary CTA button; show sticky bar when it leaves viewport.
**When to use:** LAND-10 sticky CTA requirement.

```javascript
// Source: UI-SPEC Interaction Contract LAND-10
const heroBtn = document.querySelector('.hero .btn-primary');
const stickyCta = document.querySelector('.sticky-cta');

const stickyObserver = new IntersectionObserver((entries) => {
  const isHeroBtnVisible = entries[0].isIntersecting;
  stickyCta.classList.toggle('sticky-cta--visible', !isHeroBtnVisible);
}, { threshold: 0 });

stickyObserver.observe(heroBtn);
```

```css
.sticky-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  padding-bottom: max(var(--space-md), env(safe-area-inset-bottom, 16px));
  background: linear-gradient(to top, var(--color-bg) 60%, transparent);
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 100;
}
.sticky-cta--visible {
  transform: translateY(0);
}
```

### Pattern 5: Dark Futuristic Glow Effects

**What:** Layered box-shadow and radial gradient backgrounds for premium dark UI.
**When to use:** Primary CTA buttons, countdown cells, hero avatar.

```css
/* CTA button glow on hover */
.btn-primary {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-alt));
  border: none;
  min-height: 48px;
  padding: var(--space-md) var(--space-xl);
  border-radius: 8px;
  transition: box-shadow 0.25s ease, transform 0.1s ease;
}
.btn-primary:hover {
  box-shadow: 0 0 24px var(--color-accent-glow),
              0 4px 16px rgba(0, 0, 0, 0.4);
}
.btn-primary:active {
  transform: scale(0.97);
}
.btn-primary:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

/* Page background radial noise */
body {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 50%),
    var(--color-bg);
  min-height: 100vh;
}
```

### Anti-Patterns to Avoid

- **`new Date('2026-03-24T19:00:00')` without offset:** Parses as local device time. Russian users may be fine but anyone in a different timezone gets wrong countdown.
- **`setInterval` without immediate call:** Creates a 1-second blank on page load. Always call `tick()` once before the interval starts.
- **`scroll` event for sticky detection:** Fires on every pixel; use IntersectionObserver instead.
- **CSS `transition` on `display`:** Cannot animate `display:none` to `display:block`. Use `transform: translateY(100%)` + visibility or opacity instead.
- **Missing `.nojekyll`:** GitHub Pages will try to process the site with Jekyll, which can strip `_underscore` directories and break underscored filenames.
- **`window.scrollTo()` instead of `scrollIntoView()`:** More complex, same result. Use `element.scrollIntoView({ behavior: 'smooth' })`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UTC timezone countdown | Custom timezone conversion logic | Hard-coded `+03:00` ISO string | Intl.DateTimeFormat inconsistencies across older mobile browsers |
| CSS animation library | Custom animation system | IntersectionObserver + CSS transitions | Browser-native, zero-dependency, GPU-accelerated |
| Flip counter animation | Canvas/WebGL countdown | CSS `font-variant-numeric: tabular-nums` + simple div update | Flip animations cause reflow jank on low-end Android devices |
| iOS safe area detection | JS viewport calculation | `env(safe-area-inset-bottom)` CSS | Native CSS function, handles notch/home indicator correctly |
| Font self-hosting | Download and serve Inter | Google Fonts CDN `<link>` | Single font, CDN is faster, no build step |

**Key insight:** The entire page is ~3 sections of CSS + ~80 lines of JS. Every "clever" solution adds maintenance cost with no benefit on a project of this size.

---

## Common Pitfalls

### Pitfall 1: Countdown Timezone Bug

**What goes wrong:** Timer shows incorrect remaining time for users outside Moscow (or after DST transitions).
**Why it happens:** `new Date('2026-03-24T19:00:00')` (no offset) is parsed as local time on most browsers — the countdown target shifts by the user's UTC offset.
**How to avoid:** Always use `new Date('2026-03-24T19:00:00+03:00')`. The `+03:00` hard-codes Moscow Standard Time, which does not observe DST (Russia abolished DST in 2014).
**Warning signs:** Timer shows "6 days" on one device, "5 days 21 hours" on another for the same moment.

### Pitfall 2: Sticky CTA Z-Index Stack

**What goes wrong:** Sticky CTA bar appears under page content or countdown timer cells.
**Why it happens:** Stacking context created by `transform` or `opacity` on ancestor elements.
**How to avoid:** Set `z-index: 100` on `.sticky-cta`. Do not apply `transform` or `will-change` to the `<body>` element.
**Warning signs:** Sticky bar flickers or appears partially hidden under a section.

### Pitfall 3: Mobile Telegram Browser Compatibility

**What goes wrong:** Glow effects, `backdrop-filter: blur()`, or CSS gradients render incorrectly in Telegram's in-app browser (iOS WebView, Android WebView).
**Why it happens:** Telegram's in-app browser is a stripped WebView that may lag behind Safari/Chrome in feature support.
**How to avoid:** Avoid `backdrop-filter` for critical UI elements. Use `box-shadow` for glow (widely supported). Test on actual Telegram iOS/Android, not just Chrome DevTools mobile emulation.
**Warning signs:** Blur effect appears as solid rectangle; gradients show banding.

### Pitfall 4: GitHub Pages Serving Stale Cache

**What goes wrong:** After deploy, browser serves old version of `index.html` or `style.css`.
**Why it happens:** GitHub Pages sets aggressive cache headers; browser caches static assets.
**How to avoid:** Use versioned filenames (`style.css?v=2`) or hard-reload to verify. Not a development blocker, but affects post-deploy verification.
**Warning signs:** Changes deployed to GitHub but not visible in browser.

### Pitfall 5: `scrollIntoView` in iOS Telegram WebView

**What goes wrong:** Smooth scroll does not animate in older iOS WebView — jumps immediately.
**Why it happens:** `scroll-behavior: smooth` and `scrollIntoView({ behavior: 'smooth' })` have inconsistent support in WebView environments.
**How to avoid:** The behavior still reaches the correct scroll position even without animation. Acceptable degradation. If smooth scroll is critical, use a JS polyfill, but this is out of scope for Phase 1.
**Warning signs:** CTA click jumps to final block without animation on iPhone Telegram.

### Pitfall 6: Missing `<meta name="viewport">` Tag

**What goes wrong:** Page renders at desktop width on mobile — content is tiny, unreadable.
**Why it happens:** Without viewport meta, mobile browsers default to 980px layout width.
**How to avoid:** Always include `<meta name="viewport" content="width=device-width, initial-scale=1">` in `<head>`.
**Warning signs:** Page appears zoomed out on iOS Telegram browser.

---

## Code Examples

### GitHub Pages: Minimal Required Files

```
index.html    (root)
.nojekyll     (empty file, root)
assets/       (images)
css/style.css
js/main.js
```

The `.nojekyll` file is empty — zero bytes. It just needs to exist. Its presence tells GitHub Pages to skip Jekyll processing and serve files as-is.

### Telegram Deep Link

```html
<!-- Source: Telegram official bot deep link format -->
<a href="https://t.me/<botname>?start=landing" class="btn-primary">
  Зарегистрироваться в боте
</a>
```

On mobile, this opens Telegram and starts the bot with parameter `landing`. The user then sees a START button; clicking it sends `/start landing` to the bot. This is the standard Telegram behavior — the START button confirmation step cannot be bypassed.

### Post-Deadline State Toggle

```javascript
function showPostDeadlineState() {
  clearInterval(timer);
  const countdownRow = document.querySelector('.countdown-row');
  const postDeadline = document.querySelector('.post-deadline');
  countdownRow.style.display = 'none';
  postDeadline.style.display = 'block'; // shows «Эфир уже идёт!»
  // CTA button remains visible and functional
}
```

### Image Fallback (LAND-16)

```html
<div class="avatar-wrap">
  <img
    src="assets/vadim-photo.jpg"
    alt="Вадим Сорокин, основатель EGZ Academy"
    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
  >
  <div class="avatar-initials" style="display:none">ВС</div>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `scroll` event for sticky detection | IntersectionObserver | ~2018 (wide support) | No main-thread blocking |
| `position: fixed` toggled by JS | CSS `transform: translateY(100%)` + class toggle | ~2016 | GPU-composited, no layout reflow |
| Date string without timezone | ISO 8601 with explicit offset | — | Correct cross-timezone behavior |
| `requestAnimationFrame` countdown | `setInterval(fn, 1000)` for timers | — | rAF is for 60fps rendering, not 1-second ticks |

**Deprecated/outdated:**
- jQuery countdown plugins: unnecessary for a single vanilla countdown
- Moment.js: overkill for a single date calculation, deprecated upstream
- `scroll` event + throttle/debounce for scroll-based effects: replaced by IntersectionObserver

---

## Open Questions

1. **Bot @username for deep link**
   - What we know: Placeholder `https://t.me/<botname>?start=landing` will be used in Phase 1
   - What's unclear: Actual bot username is not known until Phase 3
   - Recommendation: Use literal placeholder text `<botname>` in code; add inline comment `// TODO Phase 3: replace <botname> with real bot username`

2. **Real photo and logo assets**
   - What we know: Assets will be provided by the client; paths are `assets/vadim-photo.jpg` and `assets/egz-logo.svg`
   - What's unclear: File format, dimensions, background of the photo
   - Recommendation: Build with placeholder boxes; CSS glow ring on avatar works regardless of photo aspect ratio if container is fixed size

3. **GitHub repository name / Pages URL**
   - What we know: Deployment target is GitHub Pages
   - What's unclear: Repo name determines the Pages URL (e.g., `username.github.io/repo-name`)
   - Recommendation: Design page with no absolute URL assumptions; all links are relative or external (Telegram)

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — visual/functional verification only |
| Config file | none |
| Quick run command | Open `index.html` in browser via `file://` or local server |
| Full suite command | Manual checklist against success criteria |

For a vanilla static page with no build tooling and no JavaScript module system, automated unit testing is not applicable. Validation is performed via the 5-point success criteria checklist from ROADMAP.md.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LAND-01 | Dark premium design renders correctly | manual-visual | Open in Telegram iOS/Android browser | ❌ Wave 0 — manual only |
| LAND-02 | Mobile-first layout at <480px viewport | manual-visual | Chrome DevTools 375px viewport | ❌ Wave 0 — manual only |
| LAND-03 | Futuristic design (glow, gradients) | manual-visual | Visual inspection vs references | ❌ Wave 0 — manual only |
| LAND-04 | Scroll animations trigger at threshold | manual-functional | Scroll page, verify reveal | ❌ Wave 0 — manual only |
| LAND-05 | Designed via frontend-design skill | process | Verify in plan execution | ❌ enforced in plan |
| LAND-06 | Hero block renders all elements | manual-functional | Load page, inspect DOM | ❌ Wave 0 — manual only |
| LAND-07 | Program block with 5 items + CTA | manual-functional | Load page, count items | ❌ Wave 0 — manual only |
| LAND-08 | Pain-points block with exact copy | manual-functional | Load page, compare text to CONTEXT.md | ❌ Wave 0 — manual only |
| LAND-09 | Final block: countdown + 2 CTAs | manual-functional | Load page, verify countdown running | ❌ Wave 0 — manual only |
| LAND-10 | Sticky CTA visible after hero scroll | manual-functional | Scroll past hero, verify sticky appears | ❌ Wave 0 — manual only |
| LAND-11 | Countdown correct time + «МСК» label | functional | `node -e "const d=new Date('2026-03-24T19:00:00+03:00'); console.log(d.toISOString())"` | ❌ Wave 0 |
| LAND-12 | Non-final CTAs scroll to #final-block | manual-functional | Click hero CTA, verify scroll destination | ❌ Wave 0 — manual only |
| LAND-13 | Deep link format correct | manual-functional | Inspect HTML source for correct href pattern | ❌ Wave 0 — manual only |
| LAND-14 | No frameworks/bundlers in HTML | automated | `grep -c "react\|vue\|angular\|webpack\|vite" index.html` (expect 0) | ❌ Wave 0 |
| LAND-15 | .nojekyll present + Pages deployed | automated | `ls .nojekyll` → should exist | ❌ Wave 0 |
| LAND-16 | Image placeholders in place | manual-functional | Load page, verify placeholder visible | ❌ Wave 0 — manual only |

### Sampling Rate

- **Per task commit:** Open page in browser, verify the task's specific requirement
- **Per wave merge:** Full manual pass against all 5 success criteria from ROADMAP.md
- **Phase gate:** All 5 success criteria TRUE before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] No test framework required — vanilla static site
- [ ] Verification checklist to be executed manually against ROADMAP.md success criteria
- [ ] Countdown timezone sanity check: `node -e "console.log(new Date('2026-03-24T19:00:00+03:00').getTime() - Date.now())"` — should return positive number (milliseconds until event)

---

## Sources

### Primary (HIGH confidence)

- UI-SPEC: `.planning/phases/01-landing-page/01-UI-SPEC.md` — complete design contract (colors, typography, components, interactions)
- CONTEXT.md: `.planning/phases/01-landing-page/01-CONTEXT.md` — locked decisions
- REQUIREMENTS.md: `.planning/REQUIREMENTS.md` — all LAND-XX requirements
- MDN Web Docs: IntersectionObserver API — https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- GitHub Docs: GitHub Pages publishing source — https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

### Secondary (MEDIUM confidence)

- Telegram Bot deep link docs: https://core.telegram.org/api/links — standard `t.me/botname?start=param` format confirmed
- Simon Willison TIL on GitHub Pages: https://til.simonwillison.net/github/github-pages — `.nojekyll` behavior confirmed
- Smashing Magazine: IntersectionObserver for dynamic headers — https://www.smashingmagazine.com/2021/07/dynamic-header-intersection-observer/

### Tertiary (LOW confidence)

- WebSearch: CSS glow effects / futuristic UI patterns — general technique knowledge, not library-specific

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — locked by project decisions, no ambiguity
- Architecture: HIGH — UI-SPEC provides complete contract; patterns are standard vanilla JS
- Pitfalls: HIGH — countdown timezone and sticky CTA are well-documented, Telegram WebView behavior is MEDIUM (hard to verify without device)
- Test approach: HIGH — manual verification is the correct approach for a zero-dependency static page

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable tech, no fast-moving dependencies)
