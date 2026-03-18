# Project Research Summary

**Project:** Эфир «Кто будет расти в 2026 году» — Вадим Сорокин / EGZ Academy
**Domain:** Single-event webinar registration system (static landing + Telegram bot + Google Sheets)
**Researched:** 2026-03-18
**Confidence:** HIGH

## Executive Summary

This is a focused, time-boxed registration system for a single live webinar on 24 March 2026, 19:00 MSK. The product is three loosely-coupled components: a static dark-themed landing page hosted on GitHub Pages, a Telegram bot that handles registration dialog and reminder broadcasts, and a Google Sheet that serves as the data store and broadcast list. The canonical approach for this class of project is maximum simplicity per component: vanilla HTML/CSS/JS on GitHub Pages (no build toolchain), aiogram 3 self-hosted on a VPS (or SaleBot as no-code alternative), and gspread with a service account for Sheets writes. The ARCHITECTURE.md research recommends SaleBot as the practical path because it is already contracted and provides native Sheets integration and broadcast scheduling without any server infrastructure. STACK.md disagrees and recommends self-hosted aiogram 3 for programmable control over reminder scheduling and deep link handling. Both positions are well-reasoned — the final decision must be made at project kickoff.

The recommended approach prioritizes zero-dependency choices at every layer: a static landing with no framework, a bot built on the most actively maintained Python Telegram library (aiogram 3.26.0), Google Sheets as the database (no separate DB needed at this scale of 500–5,000 registrations), and APScheduler for timed reminders. The feature set is intentionally narrow: 15 table-stakes features form the MVP, with a handful of high-value differentiators (deep link tracking, sticky mobile CTA, personalized bot messages) that can be added at near-zero cost. Anti-features are explicitly documented — no email forms, no admin panel, no autoplay, no cookie banners.

The primary risks are operational rather than technical. Two failures would be catastrophic: credentials committed to the public GitHub repo (breaking Sheets access and potentially the bot), and the bot backend not running at the moment the landing page URL is shared (silent registration loss). Both are prevented by process discipline, not code complexity. Timezone handling in the countdown timer and bot messages is the most common technical mistake in this domain and must be addressed in the first line of JS written.

---

## Key Findings

### Recommended Stack

Three fully independent components with no shared runtime. The landing page is zero-dependency static HTML — no React, no Tailwind, no Jekyll, just an `index.html`, `style.css`, and `script.js` deployed via `gh-pages`. The bot runs Python 3.11+ with aiogram 3.26.0 (async, FSM-capable, most actively maintained as of March 2026) on a persistent VPS (Hetzner CX11 ~$4/month) — serverless is explicitly ruled out because APScheduler requires a persistent process for 24-hour reminder gaps. Google Sheets is accessed via gspread 6.1.4 with a service account; it is the database for this project and requires no separate DB tier.

**Core technologies:**
- **HTML5 + CSS3 + Vanilla JS**: static landing on GitHub Pages — zero build step, zero dependency risk, instant deploy
- **Python 3.11 + aiogram 3.26.0**: Telegram bot runtime — async, FSM for registration states, active development
- **APScheduler 3.10.x**: reminder scheduling — handles 24h gaps robustly; survives restarts with jobstores
- **gspread 6.1.4 + google-auth 2.x**: Google Sheets integration — de facto standard, service account auth, one-line append
- **python-dotenv 1.0.x**: secrets management — BOT_TOKEN and SHEET_ID never hardcoded

**Critical version note:** Use `aiogram==3.26.0` (confirmed on PyPI March 2026). Use `new Date('2026-03-24T19:00:00+03:00')` — always explicit UTC offset, never bare date string.

### Expected Features

**Must have (table stakes) — MVP blockers if missing:**
- Compelling above-fold headline answering "what is this and why care" in 2 seconds
- Speaker photo + name (users register for people, not events)
- Event date/time/format with "бесплатно" clearly stated
- Mobile-first responsive layout (90%+ Telegram audience is mobile)
- Single prominent CTA button per screen with 3 repeats (hero, mid, final)
- 5-point program bullet list ("what will I learn?")
- Target audience pain points section ("is this for me?")
- Countdown timer to 24 March 19:00 MSK (documented +30% conversion lift)
- Dark theme with high-contrast text (reference: Vortek VR, Terrixa aesthetic)
- Telegram bot welcome + registration confirmation messages
- Google Sheets row write on confirmed registration
- Reminder broadcasts at T-24h, T-1h, T+0, and T+24h (post-event)
- Event stream link delivered via bot 30-60 min before start

**Should have (differentiators — near-zero cost, meaningful lift):**
- Deep link tracking (`?start=landing_hero` vs `?start=landing_footer`) — free funnel attribution with zero SDK
- Sticky mobile CTA bar (`position: fixed; bottom: 0`) — visible without scrolling
- Personalized bot messages using first name — ~20% higher reminder open rates
- Post-event follow-up with recording + next funnel step CTA
- Smooth scroll + subtle CSS fade-in entrance animations

**Defer (v2+ or post-event):**
- Phone number collection in bot (adds abandonment risk, low priority for single event)
- Post-event recording CTA (implement after event when URL is known)

**Do not build (anti-features):**
- Multi-field form on landing, email capture, admin panel, payment flow, video autoplay, popups, cookie banners, dark/light toggle, social sharing buttons, auto-redirect on timer zero

### Architecture Approach

Three components with clean boundaries: the landing owns visual conversion only (no data, no API calls), the bot owns dialog flow and data collection and broadcasts, the Sheet is a passive data sink. The only integration seams are a hardcoded `t.me/botname?start=param` hyperlink (landing → bot) and a `gspread.worksheet.append_row()` call (bot → Sheet). No database, no message queue, no shared runtime. Architecture research recommends building in dependency order: Sheet schema first (no dependencies), bot second (depends on Sheet credentials), landing third (depends on bot username for the deep link), reminders fourth (depends on validated end-to-end flow).

**Major components:**
1. **GitHub Pages Landing** — visual conversion, countdown timer, 3 CTAs; no server-side code, no API calls, no data capture
2. **Telegram Bot (VPS + aiogram 3)** — registration FSM, Sheets write, APScheduler reminder broadcasts
3. **Google Sheets** — passive registrant store; one row per user; source list for reminder blasts; no logic

### Critical Pitfalls

1. **Credentials in the public GitHub repo** — service account JSON or BOT_TOKEN committed before `.gitignore` is set up; Google auto-revokes the key within hours, breaking live registration. Prevention: add `credentials.json` and `.env` to `.gitignore` as the first commit, before any code.

2. **Bot not running when landing URL goes live** — silent registration loss; users click CTA, Telegram opens, no response, no Sheet row written. Prevention: deploy bot to always-on infrastructure (Railway/Render/VPS), verify end-to-end (open bot link on mobile, confirm Sheet row appears) before sharing landing URL publicly.

3. **Countdown timer using local timezone** — `new Date('2026-03-24T19:00:00')` with no offset causes timer to show wrong value for users in UTC+5/+6/+7 (large Russian audience). Prevention: always `new Date('2026-03-24T19:00:00+03:00')` and display "МСК" label in UI.

4. **CDN cache delays a hotfix** — GitHub Pages Fastly cache holds old index.html up to 10-30 minutes after push; users who already have the page open click a dead placeholder during the first promo blast wave. Prevention: add `<meta http-equiv="Cache-Control" content="no-cache">` headers; deploy and verify at least 30 minutes before sending the Telegram promotional post.

5. **Jekyll strips underscore-prefixed assets** — GitHub Pages runs Jekyll by default; any `_assets/` or `_images/` path 404s on the live site with no build error. Prevention: add `.nojekyll` empty file to repo root as the first push, before adding any assets.

---

## Implications for Roadmap

Based on combined research, the dependency chain is strict: Sheet schema must exist before bot can be configured, bot username must exist before landing deep link can be finalized, landing must be deployed and verified before the promotional post goes out. Reminders are configured last because they depend on a confirmed working registration flow. This maps cleanly to 4 sequential phases.

### Phase 1: Google Sheets Setup
**Rationale:** Zero dependencies; unblocks everything else. Sheet URL and service account credentials are required by the bot before any code can be tested.
**Delivers:** Registrant schema (5 columns), service account credentials, Apps Script Web App URL (if SaleBot path), or gspread service account share (if self-hosted path).
**Addresses:** Table-stakes feature: "Google Sheets row write on registration."
**Avoids:** Pitfall 12 (sheet not shared with service account) — share with Editor permissions immediately after creation.

### Phase 2: Telegram Bot Core
**Rationale:** Depends on Sheet credentials from Phase 1. Bot username is required for the landing CTA link, so bot must exist before landing is finalized.
**Delivers:** Working `/start` handler → FSM registration flow → Sheet write → confirmation message. Deep link parameter captured and written to column E.
**Uses:** aiogram 3.26.0 + gspread 6.1.4 + python-dotenv on VPS (or SaleBot scenario if no-code path chosen).
**Implements:** Architecture Component 2 (bot) and Seam 2 (bot → Sheet integration).
**Avoids:** Pitfall 1 (credentials in repo), Pitfall 2 (bot not always-on — deploy to persistent infrastructure before Phase 3 starts), Pitfall 7 (test on mobile, not desktop), Pitfall 12 (service account sharing).

### Phase 3: Landing Page
**Rationale:** Depends on bot @username from Phase 2 to construct the `t.me` deep link. Landing is the last component to build but the first thing users will see.
**Delivers:** Deployed GitHub Pages site — hero, program, audience pain points, countdown timer, 3 CTAs; dark theme; mobile-first layout; `.nojekyll` in place.
**Uses:** Vanilla HTML5/CSS3/JS, Google Fonts via CDN, GitHub Actions or manual Pages deploy.
**Implements:** Architecture Component 1 (landing) and Seam 1 (landing → bot deep link).
**Avoids:** Pitfall 3 (timezone in countdown — use `+03:00` offset), Pitfall 4 (CDN cache — add cache-control meta, deploy 30 min before promo blast), Pitfall 5 (`.nojekyll` first), Pitfall 9 (repo must be public for free Pages), Pitfall 10 (CTA min-height 48px), Pitfall 11 (speaker photo compressed to WebP ≤200 KB).

### Phase 4: Reminder Broadcasts
**Rationale:** Depends on confirmed working end-to-end flow from Phases 1-3. Reminders are configured last because they require real user IDs in the Sheet and a validated bot response.
**Delivers:** 4 scheduled messages (T-24h, T-1h, T+0 event link, T+24h post-event follow-up) targeting all registrants.
**Uses:** APScheduler jobs (self-hosted) or SaleBot broadcast tool (no-code path). Read all Sheet rows in a single API call; loop in memory.
**Avoids:** Pitfall 6 (API rate limit — batch read Sheet in one call), Pitfall 8 (all time references must include "МСК").

### Phase Ordering Rationale

- Sheet first because it has no dependencies and its credentials are a hard prerequisite for bot development and testing.
- Bot before landing because the bot @username must be finalized before the landing's CTA deep link can be hardcoded. Changing the bot username after landing deployment requires a redeployment.
- Landing before reminders because reminder testing requires real test registrations flowing through the complete path.
- This order eliminates blocking: at no point does a phase need to wait for a parallel track to complete.

### Research Flags

Phases with well-documented patterns (skip `/gsd:research-phase`):
- **Phase 1 (Google Sheets setup):** Fully documented; service account setup is a standard one-time procedure.
- **Phase 3 (Landing page):** Pure HTML/CSS/JS on GitHub Pages — canonical, extremely well-documented pattern with no ambiguity.

Phases that may benefit from targeted research during planning:
- **Phase 2 (Bot):** The SaleBot vs. self-hosted decision must be made before Phase 2 begins and has downstream implications for Phase 4 (SaleBot broadcast tool vs. APScheduler). If SaleBot is chosen, research SaleBot's current plan limits (message quota, subscriber limit) before committing to the path. If self-hosted, review aiogram 3 FSM patterns for the specific registration state machine before writing code.
- **Phase 4 (Reminders):** If self-hosted path chosen, validate APScheduler behavior with aiogram's asyncio event loop (there are known integration patterns — `AsyncIOScheduler` is required, not `BackgroundScheduler`).

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | aiogram 3.26.0 confirmed on PyPI March 2026; gspread 6.1.4 confirmed stable; GitHub Pages vanilla HTML pattern canonical. One MEDIUM caveat: gspread maintainer seeking successors — monitor, fallback to `google-api-python-client` if needed. |
| Features | HIGH | Sourced from multiple webinar landing page studies, official Telegram bot docs, and conversion research. Anti-feature list well-supported. |
| Architecture | HIGH | Three-component pattern with two integration seams is straightforward and verified against SaleBot and aiogram documentation. One unresolved decision: SaleBot vs. self-hosted (both paths documented, choose before Phase 2). |
| Pitfalls | HIGH | All 12 pitfalls sourced from official docs, GitHub community discussions, or confirmed bug reports. Critical pitfalls 1-5 are well-verified; moderate/minor pitfalls have multiple corroborating sources. |

**Overall confidence: HIGH**

### Gaps to Address

- **SaleBot vs. self-hosted decision:** Architecture research leans SaleBot (already contracted, zero server ops); Stack research leans self-hosted aiogram (programmable control, no vendor lock-in). This must be resolved at project kickoff — it affects Phase 2 and Phase 4 implementation. Ask the client: is SaleBot already configured and paid for this event?

- **SaleBot plan limits:** If SaleBot is chosen, validate the current plan's message quota and subscriber limit before Phase 2 starts. If the warm Telegram base exceeds the plan's free broadcast limit, costs could spike unexpectedly on reminder blast day.

- **gspread long-term maintenance:** As of 2025 the maintainer is seeking successors. For a one-event project this is irrelevant (library is stable at 6.1.4). Note the fallback: `google-api-python-client` with direct Sheets API v4 calls if gspread becomes unavailable.

- **APScheduler + aiogram asyncio integration:** If self-hosted path chosen, confirm use of `AsyncIOScheduler` (not `BackgroundScheduler`) to avoid event loop conflicts. This is a known gotcha not covered in depth by the research.

---

## Sources

### Primary (HIGH confidence)
- https://pypi.org/project/aiogram/ — version 3.26.0 confirmed March 2026
- https://docs.aiogram.dev/ — aiogram 3 FSM and webhook patterns
- https://docs.gspread.org/en/latest/ — gspread 6.1.4, service account auth
- https://core.telegram.org/bots/features — deep linking `?start=` spec (official)
- https://core.telegram.org/api/links — Telegram deep link spec
- https://docs.github.com/en/pages — GitHub Pages deployment, Jekyll, .nojekyll

### Secondary (MEDIUM confidence)
- https://docs.salebot.pro/ — SaleBot Sheets integration, broadcast scheduling
- https://stealthseminar.com/webinar-landing-page-examples/ — webinar landing conversion patterns
- https://abmatic.ai/blog/how-to-use-countdown-timers-on-landing-page — countdown timer conversion data
- https://moldstud.com/articles/p-mastering-google-sheets-api-best-practices-common-pitfalls — Sheets API rate limits
- https://github.com/telegramdesktop/tdesktop/issues/27064 — Desktop deep link START button inconsistency (confirmed bug)
- https://github.com/orgs/community/discussions/11884 — GitHub Pages CDN cache delay behavior

### Tertiary (LOW confidence / inferred)
- Conversion lift estimates (countdown +30%, personalized messages +20%) — sourced from conversion optimization blogs; directionally correct but not independently verified for Russian Telegram audiences specifically

---

*Research completed: 2026-03-18*
*Ready for roadmap: yes*
