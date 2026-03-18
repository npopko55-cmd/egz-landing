# Technology Stack

**Project:** Эфир: Кто будет расти в 2026 году (Landing + Telegram Bot + Google Sheets)
**Researched:** 2026-03-18
**Research Mode:** Ecosystem

---

## Recommended Stack

### Tier 1: Landing Page (GitHub Pages)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| HTML5 + CSS3 + Vanilla JS | Native (no version) | Static landing page | GitHub Pages is static-only. Zero build step = zero deployment complexity. All countdown and CTA logic fits in ~50 lines of JS. |
| CSS Custom Properties | Native | Dark theme tokens | `--color-bg`, `--color-text` etc. without any CSS framework overhead. One file, fully controllable. |
| `setInterval` / `Date` API | Native JS | Countdown timer | No library needed. Target date is `new Date('2026-03-24T19:00:00+03:00')` — timezone-aware. Recalculate every 1000ms. |
| Google Fonts (Inter or Manrope) | Via CDN `fonts.googleapis.com` | Typography | Matches dark minimalist aesthetic of references (Vortek VR, Terrixa). Inter = safe neutral; Manrope = slightly more geometric. Use `font-display: swap`. |
| GitHub Actions (optional) | Native | Auto-deploy on push to `main` | `peaceiris/actions-gh-pages` action or native `github-pages` environment — picks up `index.html` at root automatically. |

**What NOT to use:**
- React / Vue / Svelte — overkill for a one-page event landing. Build toolchain adds complexity with zero user benefit.
- Bootstrap / Tailwind CDN — dark theme requires overriding defaults. Custom CSS is fewer lines and faster.
- Jekyll / Hugo — adds template compilation step. GitHub Pages deploys raw HTML without it.
- External countdown libraries (e.g. `countdown.js`) — unmaintained, adds HTTP request, unnecessary for trivial date math.

**Confidence:** HIGH — vanilla HTML/CSS/JS on GitHub Pages is the canonical, zero-dependency pattern for single-event landing pages. No version churn risk.

---

### Tier 2: Telegram Bot

**Decision: Self-hosted Python bot with aiogram 3, NOT SaleBot.**

Rationale for rejecting SaleBot as primary path:

SaleBot.pro is a no-code/low-code chatbot builder. It offers native Google Sheets integration via webhooks (through Albato or native connectors). However:

1. **No programmable deep link control.** SaleBot handles `start` deep links, but the registration confirmation, write-to-Sheets, and reminder scheduling logic require scripting or third-party automation middleware (Albato, Make, etc.) — adding fragile dependency chains.
2. **Reminder scheduling is limited.** Sending 4 timed reminders (–24h, –1h, post-event) requires either SaleBot's broadcast feature (manual) or an automation trigger outside SaleBot — not reliable for exact Moscow timezone timing.
3. **Vendor lock-in.** If SaleBot changes pricing or API in 2026, the bot breaks. Self-hosted bot on a VPS costs ~$4/month (Hetzner CX11) and is under full control.
4. **SaleBot is appropriate when:** the team has zero Python experience and needs the bot running in hours. Given this project already uses Claude Code, self-hosted is the right call.

**If SaleBot must be used** (client requirement): use SaleBot's native "Google Sheets integration" block + webhooks for registration capture, and schedule reminders manually via SaleBot broadcasts. Treat it as a no-code MVP only.

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Python | 3.11+ | Runtime | Stable LTS, widely supported on all VPS providers. 3.12 is fine but 3.11 has broader hosting support. |
| aiogram | 3.26.0 (latest as of Mar 2026) | Telegram Bot API framework | Fully async, FSM (Finite State Machine) for registration flow states, active development (released 3.26.0 tracking Bot API 9.4). |
| aiogram FSM | Built into aiogram 3 | Registration step states | `StatesGroup` / `State` — clean multi-step flows: `waiting_name` → `confirmed`. No extra library. |
| python-dotenv | 1.0.x | Secrets management | `BOT_TOKEN`, `SHEET_ID` from `.env` file. Never hardcode in source. |
| APScheduler | 3.10.x | Scheduled reminders | Cron-style jobs for –24h, –1h, post-event messages. Runs in-process alongside aiogram's event loop. Alternative: simple `asyncio.sleep` for short durations, but APScheduler is more robust for 24h gaps. |

**Deployment:**
- Hetzner CX11 (~$4/month) or any VPS with Python 3.11+
- Run as systemd service or Docker container
- Use **webhooks** (not polling) in production — lower latency, no idle CPU usage
- For development/MVP: long-polling is fine

**What NOT to use:**
- `python-telegram-bot` (PTB) — synchronous model, heavier for concurrent handlers. aiogram 3 is the community preference for new projects in 2025-2026.
- Telegraf.js / grammY — JavaScript ecosystem. Mixing JS bot + Python Sheets integration adds language boundary. Stay in Python.
- Serverless (Vercel/Railway functions) — cold starts break scheduled reminders. Needs persistent process.
- n8n / Make / Zapier — automation middleware between Telegram and Sheets adds latency, rate limits, cost, and breakage points. Direct API calls are simpler.

**Confidence:** HIGH for aiogram 3 — most actively maintained Python Telegram framework as of Mar 2026, confirmed version 3.26.0 on PyPI. MEDIUM for APScheduler — works well but asyncio-native scheduling (plain `asyncio.create_task` with sleep) is a viable simpler alternative.

---

### Tier 3: Google Sheets Integration

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| gspread | 6.1.4 (latest stable) | Google Sheets Python client | De facto standard, wraps Sheets API v4, clean Pythonic interface. `worksheet.append_row([user_id, username, name, datetime])` is one line. |
| google-auth | 2.x (pulled by gspread) | Authentication | Service Account JSON — the correct pattern for server-to-server auth with no user interaction. |
| Google Cloud Service Account | N/A (config, not library) | Auth credential | Create in Google Cloud Console, download JSON, share the Sheet with the service account email. No OAuth user flow needed. |

**Column schema for the Sheet:**

```
A: user_id (Telegram numeric ID)
B: username (@handle or empty)
C: first_name
D: registration_datetime (ISO 8601, Moscow time)
E: source (deep link parameter, e.g. "landing_main_cta")
```

**Setup flow (one-time):**
1. Enable Google Sheets API in Google Cloud Console
2. Create Service Account → download `credentials.json`
3. Share target Google Sheet with the service account email (`...@...iam.gserviceaccount.com`) as Editor
4. `gspread.service_account(filename='credentials.json')`

**What NOT to use:**
- `pygsheets` — less active maintenance than gspread, smaller community
- Google Apps Script webhook — brittle, requires deploying a web app URL, adds Google's deployment layer
- Direct HTTP calls to Sheets API v4 — gspread already wraps these correctly, no reason to reimplement
- `oauth2client` — officially deprecated by Google since 2019. Use `google-auth` only.

**Note on gspread maintenance:** As of 2025, the maintainer announced seeking new maintainers. The library is stable at 6.1.4 but if maintenance lapses, the fallback is `google-api-python-client` with direct Sheets API calls (more verbose but no third-party dependency). Monitor the gspread GitHub for status.

**Confidence:** HIGH for gspread 6.x pattern — confirmed current stable version, service account auth is well-documented and stable. MEDIUM caveat on long-term maintenance.

---

## Full Dependency List

### Landing page (no npm, no build step)

```
index.html        — single file, all JS inline or in script.js
style.css         — custom properties for dark theme
script.js         — countdown timer, analytics events
assets/           — photo of Vadim, logo
```

Zero external dependencies fetched at build time. Google Fonts loaded via CDN link tag (acceptable — fallback to system font if CDN fails).

### Bot (`requirements.txt`)

```
aiogram==3.26.0
gspread==6.1.4
google-auth==2.29.0
APScheduler==3.10.4
python-dotenv==1.0.1
```

### Installation

```bash
# Python environment
python3.11 -m venv venv
source venv/bin/activate
pip install aiogram==3.26.0 gspread==6.1.4 google-auth==2.29.0 APScheduler==3.10.4 python-dotenv==1.0.1

# Environment file
cp .env.example .env
# Fill: BOT_TOKEN, SHEET_ID, GOOGLE_CREDENTIALS_PATH
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Landing framework | Vanilla HTML/JS | React, Vite SPA | Build toolchain overkill for 4-section static page |
| CSS framework | Custom CSS | Tailwind CDN | Dark theme overrides negate brevity advantage |
| Bot platform | aiogram 3 self-hosted | SaleBot.pro | No programmable reminder scheduling; vendor lock-in |
| Bot framework | aiogram 3 | python-telegram-bot | PTB is synchronous; aiogram is more actively maintained for new projects |
| Sheets client | gspread | pygsheets / direct API | gspread has larger ecosystem; pygsheets less active |
| Auth method | Service Account JSON | OAuth2 user flow | No user interaction needed; server-to-server is simpler |
| Scheduler | APScheduler | asyncio.sleep task | APScheduler handles long gaps (24h) more robustly; survives restarts with jobstores |
| Deployment | VPS (Hetzner) | Serverless | Reminders require persistent process; cold starts break scheduled jobs |

---

## Architecture Fit

The stack is **three independent components** with no shared runtime:

```
GitHub Pages (static CDN)
    └── index.html: CTA button → t.me/bot?start=landing_main

Telegram Bot (VPS, Python process)
    ├── Handles /start deep link
    ├── FSM registration flow
    ├── Writes to Google Sheets via gspread
    └── APScheduler jobs: –24h, –1h, stream link, post-event

Google Sheets (SaaS)
    └── Single sheet: registrants table, read by Vadim/team
```

No database needed. The Sheet IS the database for this single-event use case.

---

## Sources

- aiogram PyPI / releases: https://pypi.org/project/aiogram/ — version 3.26.0 confirmed via search result (Mar 2026)
- aiogram docs: https://docs.aiogram.dev/
- gspread docs: https://docs.gspread.org/en/latest/ — version 6.1.4 confirmed
- gspread auth (service account): https://docs.gspread.org/en/latest/oauth2.html
- SaleBot docs: https://docs.salebot.ai/messengers-and-chats/telegram
- aiogram vs python-telegram-bot comparison: https://piptrends.com/compare/python-telegram-bot-vs-aiogram
- GitHub Pages deploy discussion: https://github.com/orgs/community/discussions/160361
- Telegram Bot API changelog: https://core.telegram.org/bots/api-changelog
