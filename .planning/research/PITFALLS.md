# Domain Pitfalls

**Domain:** Event landing page + Telegram bot registration + Google Sheets logging + GitHub Pages deploy
**Project:** Эфир «Кто будет расти в 2026 году» — Вадим Сорокин / EGZ Academy
**Researched:** 2026-03-18

---

## Critical Pitfalls

Mistakes that cause broken registration flows, data loss, or need for redeployment under time pressure.

---

### Pitfall 1: Google Sheets API credentials committed to the repository or embedded in frontend JS

**What goes wrong:**
The bot needs to write to Google Sheets. The Google Cloud service account JSON key gets placed in a file that ends up in the public GitHub repo, or its contents get inlined in client-side JS. GitHub Pages repos are always public — the key is immediately accessible to anyone who knows where to look. The key grants write access to the sheet until manually revoked.

**Why it happens:**
Developer writes the bot script locally with a hardcoded key for testing and forgets to extract it before pushing. Or mistakes Google Sheets for a "public" resource since anyone can see the spreadsheet URL.

**Consequences:**
- Service account credentials exposed. Anyone can write arbitrary data to the sheet or exhaust API quota.
- If bot token is also in the repo, the bot itself can be hijacked.
- Google may auto-revoke the key within hours of detecting exposure — breaking the live integration during registration window.

**Prevention:**
- Never commit the service account JSON file. Add `credentials.json`, `*.json` (for keys), and `.env` to `.gitignore` before the first push.
- For the Telegram bot hosted on a server/VPS: inject credentials via environment variables.
- For SaleBot platform: credentials live inside SaleBot's configuration UI, never in the repo.
- For any server-side integration: use environment variables (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `SPREADSHEET_ID`).

**Detection warning signs:**
- `credentials.json` or `serviceAccount.json` visible in GitHub file tree.
- `PRIVATE KEY` string appearing in any committed file.
- Google Cloud Console shows key creation date but no access logs — key may have been rotated without your knowledge.

**Phase:** Must be addressed in the bot implementation phase before any push to GitHub.

---

### Pitfall 2: The Telegram deep link CTA on a static GitHub Pages site cannot complete registration without an active bot backend

**What goes wrong:**
The landing page CTA button links to `https://t.me/YourBot?start=webinar2026`. When the user taps it on mobile, Telegram opens and the `/start` command fires. If the bot is not running (polling stopped, server down, SaleBot webhook misconfigured), the user gets no response. They assume they are registered — but no data is written to Google Sheets. Silent failure.

**Why it happens:**
- Bot is running in polling mode on a developer's laptop, which goes to sleep.
- SaleBot webhook URL points to a stale endpoint.
- Developer is unaware the bot must stay running 24/7 from the moment the landing page is live.

**Consequences:**
Registrations are lost. User receives no confirmation. On event day, the sheet shows 20 people but 80 tried to register.

**Prevention:**
- Deploy bot backend to always-on infrastructure (Railway, Render free tier, VPS) before the landing page goes live.
- If using SaleBot: verify the webhook is active and the bot responds end-to-end before sharing the landing page URL.
- Send a test registration yourself from mobile and confirm the row appears in Google Sheets within 5 seconds.
- Set up a minimal health-check: the bot should respond to `/start` with a message at all times.

**Detection warning signs:**
- Tapping the bot link in Telegram shows the chat but no response after 10 seconds.
- Google Sheets row count is not growing despite traffic on the landing page.
- SaleBot dashboard shows 0 incoming messages.

**Phase:** Must be validated at the end of bot implementation phase, before deploying the landing page.

---

### Pitfall 3: Countdown timer shows wrong time for users outside Moscow timezone

**What goes wrong:**
The final block of the landing page shows a countdown to 24 March 2026 19:00 МСК. If the countdown is coded as `new Date('2026-03-24T19:00:00')` without a timezone offset, JavaScript interprets it in the user's local timezone. A user in Yekaterinburg (UTC+5) sees the timer count down to a different moment than the actual event. The timer hits zero 2 hours early or 2 hours late depending on client timezone.

**Why it happens:**
JavaScript's `Date` constructor parses date strings without timezone as local time (per spec). This is a classic developer mistake: the string looks correct but behaves differently per device.

**Consequences:**
Timer shows wrong value. Users in UTC+5, UTC+6, UTC+7 (large Russian audience segments) see an incorrect countdown. Trust is damaged. Some users miss the event.

**Prevention:**
Always specify the Moscow offset explicitly:
```js
// Moscow is UTC+3, no DST
const eventDate = new Date('2026-03-24T19:00:00+03:00');
```
Or use UTC equivalent:
```js
const eventDate = new Date('2026-03-24T16:00:00Z'); // 19:00 MSK = 16:00 UTC
```
Display the time with the "МСК" label in the UI so users in other timezones understand the reference.

**Detection warning signs:**
- Timer shows a different value when tested from browser developer tools with `Date.now()` override.
- Timer value is off by exactly N hours matching a common Russian timezone offset.

**Phase:** Landing page implementation phase.

---

### Pitfall 4: GitHub Pages serves a stale version after a hotfix — critical update not visible before the event

**What goes wrong:**
The bot link placeholder (`@YourBot`) gets replaced with the real link close to launch. Developer pushes the update. GitHub Pages CDN caches assets for up to 10 minutes. Users who already have the page open in a browser tab see the old placeholder link for up to 30 minutes. During high-traffic moments (Telegram post goes out), a portion of users click a dead placeholder.

**Why it happens:**
GitHub Pages uses a CDN (Fastly). Assets are cached. Browsers also cache `index.html`. There is no built-in cache invalidation on push.

**Consequences:**
Users click a non-functional CTA. Registrations are lost in the first wave after the promotional post.

**Prevention:**
- Add cache-control meta tags to `index.html`:
  ```html
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  ```
- Append a version query string to CSS/JS includes: `style.css?v=2` — update on each push.
- Deploy and verify at least 30 minutes before sending the Telegram promo post. Never push a hotfix and immediately blast to the audience.

**Detection warning signs:**
- Page shows old content 5 minutes after push.
- Hard refresh (`Cmd+Shift+R`) shows the new content but normal reload does not.

**Phase:** GitHub Pages deployment phase.

---

### Pitfall 5: Jekyll processes the static site and strips underscore-prefixed files or breaks assets

**What goes wrong:**
GitHub Pages runs Jekyll by default on any pushed branch. Jekyll silently ignores files and folders that start with `_` (e.g., `_assets/`, `_images/`). If the landing page or any asset path uses an underscore prefix, it simply does not appear on the deployed site — no build error, just a 404.

**Why it happens:**
Developer is not aware of the Jekyll default behavior. Designing the file structure locally works fine; only the deployed URL breaks.

**Consequences:**
Images, CSS, JS fail to load on the live site. The page looks broken for all users.

**Prevention:**
Add a `.nojekyll` file to the root of the repository before the first deploy:
```bash
touch .nojekyll
```
This single empty file disables Jekyll processing entirely and serves files as-is. For a pure HTML/CSS/JS landing page, Jekyll provides no benefit anyway.

**Detection warning signs:**
- Assets load locally but 404 on the live GitHub Pages URL.
- Browser dev tools show 404 for CSS or image paths.
- Paths with underscores are missing from the deployed site.

**Phase:** GitHub Pages deployment phase — add `.nojekyll` as the first file before pushing anything else.

---

## Moderate Pitfalls

---

### Pitfall 6: Google Sheets API rate limit hit during event day reminder blast

**What goes wrong:**
The bot sends reminders by reading all registered users from Google Sheets and messaging them in a loop. At 300+ registrations, iterating rows one API call per row hits the Google Sheets API limit (100 requests per 100 seconds per project). The script throws quota errors mid-blast. Part of the audience receives the reminder; the rest does not.

**Prevention:**
- Read the entire sheet in a single `values.get` call and loop in memory, not via repeated API calls.
- If writing registrations, use `values.append` (one call per registration) rather than `values.batchUpdate` in a loop.
- Store all registered user IDs in an in-memory list or local file as a cache. Use Google Sheets as a log, not as the live data source for the blast.

**Detection warning signs:**
- `429 RESOURCE_EXHAUSTED` errors in bot logs.
- Reminder send completes in under 2 seconds for a large list — means it errored silently.

**Phase:** Bot reminder logic implementation.

---

### Pitfall 7: Telegram deep link shows START button on desktop but works on mobile — inconsistent test results

**What goes wrong:**
On mobile Telegram (Android, iOS), clicking `t.me/YourBot?start=param` sends the `/start` command automatically. On Telegram Desktop, it shows a START button that requires a manual click. If the developer tests only on desktop, the onboarding flow seems to require two steps and they may incorrectly conclude the deep link is broken or add redundant instructions.

**Why it happens:**
This is a known Telegram Desktop inconsistency documented in their bug tracker. The primary audience (mobile Telegram) works correctly.

**Prevention:**
- Always test the registration flow from a mobile device, not Telegram Desktop.
- Do not add "tap the START button" copy to the landing page — it confuses mobile users who never see that button.
- Accept that Desktop behavior is inconsistent and document it as expected.

**Detection warning signs:**
- Deep link works immediately on phone but shows an extra step on Mac/Windows desktop app.

**Phase:** Bot integration testing phase.

---

### Pitfall 8: Bot sends confirmation message with event time but no timezone label

**What goes wrong:**
The bot's confirmation message says "Вы зарегистрированы! Эфир начнётся 24 марта в 19:00." Users in Novosibirsk, Krasnoyarsk, Irkutsk read this as their local time. They show up at 19:00 local but the event starts at 19:00 МСК, which may be 22:00 or 23:00 in their timezone.

**Prevention:**
Always include "МСК" in any time reference in bot messages and landing page copy:
- "24 марта в 19:00 МСК"
- Never write just "19:00"

**Phase:** Bot message copy review.

---

### Pitfall 9: GitHub repository is private but collaborators need access — GitHub Pages requires specific plan

**What goes wrong:**
If the repo is private, GitHub Pages is only available on paid plans (GitHub Pro or Team). On a free account with a private repo, the Pages option is greyed out. Developer spends time debugging a non-code issue.

**Prevention:**
Keep the landing page repository public (it contains only static HTML/CSS/JS with no secrets). This is standard practice for GitHub Pages and is free. Confirm the repo is public before configuring Pages in settings.

**Detection warning signs:**
- GitHub Pages section in repo Settings shows "Upgrade required" or is not visible.

**Phase:** GitHub Pages setup phase.

---

## Minor Pitfalls

---

### Pitfall 10: CTA button tap target too small on mobile — users tap next to button, nothing happens

**What goes wrong:**
The main CTA "Зарегистрироваться" button is sized for desktop (height 40px, padding 10px). On mobile, thumbs miss the touch target. Conversion drops silently.

**Prevention:**
Minimum touch target height for mobile: 48px (Google Material guidelines, Apple HIG). Use `padding: 16px 32px` on the primary button. Test on actual mobile device, not just browser dev tools mobile emulation.

**Phase:** Landing page frontend implementation.

---

### Pitfall 11: Image of Vadim is too large — slow load on mobile, no compression applied

**What goes wrong:**
The speaker photo is inserted at full camera resolution (3–5 MB). Mobile users on 4G/LTE see a blank hero section for 2–3 seconds while the image loads. Users on slower connections may leave before the page renders.

**Prevention:**
- Compress the photo to WebP format, max 200 KB for a 600×800px image.
- Use `loading="lazy"` for below-fold images; use explicit `width` and `height` attributes to prevent layout shift.
- If the image is in the hero (above fold), do not lazy-load it — it must load immediately.

**Phase:** Landing page asset preparation.

---

### Pitfall 12: Google Sheet is not shared with the service account email — all writes fail silently

**What goes wrong:**
Service account is created in Google Cloud. The spreadsheet is not explicitly shared with the service account's email address (e.g., `bot@project.iam.gserviceaccount.com`). Every write attempt returns a `403 Permission Denied` error. Registrations silently fail.

**Prevention:**
After creating the service account and downloading credentials:
1. Open the Google Sheet.
2. Click Share.
3. Add the service account email with Editor permissions.

This step is separate from the API setup and is commonly missed.

**Detection warning signs:**
- `403` or `PERMISSION_DENIED` in bot logs on first write attempt.
- Google Sheets shows no new rows despite confirmed bot responses.

**Phase:** Google Sheets integration setup.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Landing page frontend build | Countdown timezone error (Pitfall 3) | Hardcode UTC offset `+03:00` in date string |
| Landing page frontend build | Touch target too small (Pitfall 10) | min-height 48px on all CTAs |
| Landing page frontend build | Hero image too large (Pitfall 11) | Compress to WebP ≤200 KB before adding to repo |
| GitHub Pages deploy setup | Jekyll strips underscore assets (Pitfall 5) | Add `.nojekyll` first |
| GitHub Pages deploy setup | Private repo blocks Pages (Pitfall 9) | Keep repo public |
| GitHub Pages deploy setup | CDN cache delays hotfix (Pitfall 4) | Deploy 30 min before promo blast; add cache-control meta |
| Bot implementation | Credentials in repo (Pitfall 1) | `.gitignore` before first push; env vars only |
| Bot implementation | Bot must be always-on when landing is live (Pitfall 2) | Deploy to Railway/Render; test end-to-end before sharing URL |
| Bot message copy | Time without timezone label (Pitfall 8) | Always append "МСК" |
| Bot integration testing | Desktop deep link shows START button (Pitfall 7) | Test only on mobile; expected behavior |
| Google Sheets setup | Sheet not shared with service account (Pitfall 12) | Share with Editor before first test write |
| Bot reminder blast | API rate limit on large user list (Pitfall 6) | Read all rows in one call; loop in memory |

---

## Sources

- [Telegram deep link desktop vs mobile inconsistency — tdesktop issue #27064](https://github.com/telegramdesktop/tdesktop/issues/27064)
- [Telegram Deep Links official docs](https://core.telegram.org/api/links)
- [GitHub Pages — troubleshooting 404 errors](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)
- [GitHub Pages — .nojekyll and Jekyll interference](https://github.com/orgs/community/discussions/64096)
- [GitHub Pages CDN cache delays](https://github.com/orgs/community/discussions/11884)
- [Google Sheets API rate limits and best practices — MoldStud](https://moldstud.com/articles/p-mastering-google-sheets-api-best-practices-common-pitfalls)
- [Google Sheets API authentication troubleshooting — Google Developers](https://developers.google.com/workspace/sheets/api/troubleshoot-authentication-authorization)
- [Google API service account credentials security — DEV Community](https://dev.to/wilsonparson/how-to-securely-use-google-apis-service-account-credentials-in-a-public-repo-4k65)
- [Telegram bot webhook vs polling — grammY guide](https://grammy.dev/guide/deployment-types)
- [Landing page mistakes that kill conversions 2025 — GrowthFueling](https://growthfueling.com/landing-page-mistakes-that-kill-conversions-in-2025/)
- [Countdown timezone-aware implementation — jQuery.countdown examples](https://hilios.github.io/jQuery.countdown/examples/timezone-aware.html)
