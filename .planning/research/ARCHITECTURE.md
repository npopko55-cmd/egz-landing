# Architecture Patterns

**Domain:** Static landing page + Telegram bot + Google Sheets registration system
**Project:** Эфир: Кто будет расти в 2026 году
**Researched:** 2026-03-18

---

## System Overview

Three components, two integration seams, zero server-side backend required.

```
[GitHub Pages Landing]
        |
        | tg.me deep link (browser redirect)
        v
[Telegram / SaleBot bot]
        |
        | HTTP POST (native SaleBot integration or Apps Script webhook)
        v
[Google Sheets]
```

The landing is a pure static page. All logic lives in the bot. The sheet is a passive data sink — it receives rows and drives reminder broadcasts.

---

## Components

### Component 1: Landing Page (GitHub Pages)

**Responsibility:** Convert visitor awareness into a single action — clicking the CTA that opens the Telegram bot.

**Technology:** HTML/CSS/JS, deployed via `gh-pages` branch or root of dedicated repo.

**Boundaries:**
- No server-side code. No form submissions. No backend calls.
- The only outbound action is a hyperlink to `https://t.me/<botname>?start=<source_param>`.
- Countdown timer runs entirely in client-side JS (no server time sync needed for display-only countdown).

**Communicates with:**
- User's browser (renders)
- Telegram (via redirect link only — no API calls from the landing itself)

**What it does NOT do:**
- Does not capture user data
- Does not call any API
- Does not set cookies for tracking (unless analytics added separately)

---

### Component 2: Telegram Bot (SaleBot or self-hosted)

**Responsibility:** Registration dialog — greet, confirm intent, collect name, send confirmation message, write user data to Google Sheets, send scheduled reminders.

**Two implementation paths exist — pick one before build starts:**

#### Path A: SaleBot (no-code platform, already contracted)

- Bot logic built visually in salebot.pro interface
- Deep link `?start=` parameter captured as a variable in the scenario
- Google Sheets integration is native: SaleBot sends a POST-JSON to a Google Apps Script Web App URL, which appends a row
- SaleBot handles broadcast scheduling (reminder sequences) natively via its mailing tool
- No server infrastructure needed
- **Constraint:** SaleBot charges per message/subscriber on some plans — validate limits before launch

#### Path B: Self-hosted bot (Python, aiogram or python-telegram-bot)

- Bot deployed on a VPS or serverless platform (Railway, Fly.io, Render free tier)
- Webhook registered via `setWebhook` pointing to the bot's HTTPS endpoint
- On `/start` with param: record user → send confirmation → schedule reminders via APScheduler or external cron
- Google Sheets written via Google Sheets API (gspread library) or via HTTP POST to Apps Script Web App
- Full control, no per-message cost, requires server maintenance

**Recommended path: SaleBot** — already integrated, no infrastructure to manage, sufficient for a one-event flow with known audience size (warm Telegram base, likely under 5,000 registrants).

**Communicates with:**
- Telegram API (receives messages via webhook, sends messages back)
- Google Sheets (writes registration rows)
- Users directly (dialog flow)

---

### Component 3: Google Sheets

**Responsibility:** Persistent store for registrant data. Source of truth for analytics and reminder broadcasts.

**Schema (one row per registrant):**

| Column | Value | Source |
|--------|-------|--------|
| A: telegram_user_id | Integer | Telegram API |
| B: username | @handle or empty | Telegram API |
| C: first_name | String | Telegram API or bot dialog |
| D: registered_at | ISO timestamp | Bot at write time |
| E: source_param | String (deep link param) | `?start=` value |

**Communicates with:**
- Bot (receives POST writes)
- Broadcast tool (SaleBot reads sheet for bulk mailing, or manual export for other tools)

**What it does NOT do:**
- Does not push data anywhere autonomously
- Does not run logic — it is a passive store

---

## Data Flow

### Registration Flow (primary path)

```
1. User sees landing page
2. User clicks CTA button
   → Browser opens: https://t.me/<botname>?start=landing_march2026
3. Telegram opens bot
4. Bot receives /start with payload "landing_march2026"
5. Bot sends welcome message + "Зарегистрироваться" button
6. User taps button
7. Bot records: user_id, username, first_name, timestamp, source_param
8. Bot POSTs row to Google Sheets (via SaleBot native integration or Apps Script webhook)
9. Bot sends confirmation message to user
10. Google Sheets row appended: [user_id, username, name, timestamp, source]
```

### Reminder Flow (scheduled broadcasts)

```
Google Sheets (registrant list)
        ↓
SaleBot mailing tool reads list (or admin triggers)
        ↓
Broadcast sent at:
  - T-24h: "Эфир завтра в 19:00 МСК"
  - T-1h:  "Эфир через час, вот ссылка"
  - T=0:   "Эфир начался, заходи"
  - T+24h: "Запись + следующий шаг CTA"
```

### Deep Link Tracking

The `?start=` parameter lets you track registration source without any analytics SDK on the landing. Examples:
- `?start=landing_hero` — clicked hero CTA
- `?start=landing_footer` — clicked footer CTA

This data lands in Google Sheets column E and gives basic funnel attribution.

---

## Suggested Build Order

Build order is driven by hard dependencies: you cannot test the full flow until all three components exist.

### Phase 1: Google Sheets (15 min)

Build the sheet schema first — it has no dependencies and unblocks bot configuration.
- Create sheet with column headers
- Set up Apps Script Web App URL (if using self-hosted path) or share sheet with SaleBot service account

### Phase 2: Telegram Bot in SaleBot (or self-hosted)

Depends on: Sheet URL / credentials from Phase 1.
- Create bot via BotFather, get token
- Build scenario in SaleBot: /start handler → dialog → Google Sheets write → confirmation
- Configure deep link parameter capture
- Test end-to-end: open bot with `?start=test`, verify row appears in sheet

### Phase 3: Landing Page

Depends on: Bot @username from Phase 2 (to construct the `t.me` link).
- Build HTML/CSS/JS with placeholder bot link
- Replace placeholder with real `?start=` link once bot is live
- Deploy to GitHub Pages

### Phase 4: Reminder Sequences

Depends on: Confirmed working registration flow (Phases 1–3).
- Configure SaleBot broadcast messages
- Set send times relative to event date (24 марта 2026, 19:00 МСК)
- Test by sending to a test subscriber

---

## Component Boundary Summary

| Component | Owns | Does NOT own |
|-----------|------|--------------|
| Landing | Visual conversion, CTA link | User data, bot logic |
| Bot | Dialog flow, data collection, broadcasts | Hosting of sheet, landing |
| Google Sheets | Data persistence, broadcast source list | Logic, sending |

---

## Integration Points (where things can break)

### Seam 1: Landing → Bot (deep link)

**Mechanism:** `<a href="https://t.me/botname?start=param">` HTML link.
**Risk:** Link hardcoded in HTML. If bot username changes, landing must be redeployed.
**Mitigation:** Use a final bot username before landing goes live. Keep GitHub Actions deploy simple so redeployment is under 2 minutes.

### Seam 2: Bot → Google Sheets

**SaleBot path:** SaleBot sends POST-JSON to Google Apps Script Web App URL. The Apps Script function appends the row.
**Self-hosted path:** Bot calls Sheets API directly via gspread or sends POST to Apps Script endpoint.
**Risk:** Apps Script Web App URL has rate limits (~20 concurrent requests). For a warm Telegram base this is not a concern.
**Risk:** Google Sheets has a 10M cell limit and 100 simultaneous connection limit — irrelevant at this scale.
**Mitigation:** Keep Apps Script write function simple (appendRow). No read operations needed during registration.

---

## Scalability Notes

This is a one-event system with a known ceiling (warm Telegram base, likely 500–5,000 registrations).

| Concern | At this scale | Note |
|---------|---------------|------|
| Sheet write throughput | No issue | ~1 req/sec burst at most |
| Bot concurrency | No issue for SaleBot | SaleBot handles queuing |
| Landing traffic | No issue | GitHub Pages CDN, static files |
| Broadcast delivery | Verify SaleBot plan limits | Check monthly message quota |

---

## Architecture Decision: SaleBot vs Self-Hosted

**Decision: SaleBot for this project.**

Rationale:
- Already contracted/connected
- Native Google Sheets integration without writing webhook code
- Built-in broadcast scheduler — no cron/scheduler infrastructure needed
- Zero server ops for a one-time event
- Sufficient capacity for the expected audience size

**When to switch to self-hosted:** If SaleBot plan limits are hit, if custom logic is needed (conditional flows based on sheet data, dynamic content), or if cost per message becomes prohibitive at scale.

---

## Sources

- [Salebot.pro Google Sheets docs](https://docs.salebot.pro/integracii/google/rabota-s-google-tablicami) — native integration method (MEDIUM confidence — page structure confirmed via search)
- [Telegram Deep Linking docs](https://core.telegram.org/api/links) — `?start=` parameter spec (HIGH confidence — official Telegram docs)
- [python-telegram-bot Webhook architecture](https://github.com/python-telegram-bot/python-telegram-bot/wiki/Architecture) — self-hosted path reference (HIGH confidence)
- [Connect Telegram Bot to Google Sheets via Apps Script](https://github.com/meneer-code/Connect-Telegram-Bot-to-Google-Sheets-ChatGPT-OpenAI) — Apps Script webhook pattern (MEDIUM confidence)
- [Albato SaleBot + Google Sheets integration](https://albato.ru/integration-googlesheets-salebot) — third-party connector as fallback (MEDIUM confidence)
