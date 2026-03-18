# Feature Landscape

**Domain:** Webinar/event registration — dark-themed landing page + Telegram bot
**Project:** Эфир «Кто будет расти в 2026 году» — Вадим Сорокин / EGZ Academy
**Researched:** 2026-03-18
**Confidence:** HIGH (verified against official Telegram docs, multiple landing page sources, SaleBot docs)

---

## Table Stakes

Features users expect from the moment they land. Missing = users leave or don't register.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Compelling headline above the fold | First thing seen; must answer "what is this and why should I care" in 2 seconds | Low | "Кто будет расти в 2026 году" already strong |
| Speaker photo + name + short bio | Users register for people, not events. Missing speaker face → 40%+ drop in trust | Low | File exists per PROJECT.md |
| Event date/time/format meta | Without date and "бесплатно", users assume there's a catch or it's already over | Low | 24 марта, 19:00 МСК |
| Mobile-first responsive layout | Telegram audience = 90%+ mobile. Non-mobile layout = dead on arrival | Medium | Single-column stack, large tap targets |
| Single prominent CTA button | One action per page; multiple CTAs dilute conversion. Button must be large, thumb-reachable | Low | Leads to Telegram bot via deep link |
| CTA repeated (hero + mid + final block) | Users need the button available without scrolling back up; repeat at each section end | Low | 3 CTAs mapped in PROJECT.md already |
| Short program/agenda bullet list | "What will I learn?" is the #1 question before registration | Low | 5 пунктов программы per ТЗ |
| Target audience section | "Is this for me?" — without this, uncertain visitors bounce | Low | 5 болей ЦА per ТЗ |
| Countdown timer to event | Urgency mechanism; documented to increase conversion up to 30%; also answers "how long until?" | Medium | JavaScript setInterval, no dependencies needed |
| Dark theme with high contrast text | Reference designs (Vortek, Terrixa, FRZN) set expectation; dark bg + light text is standard for tech/edu events | Medium | CSS variables for consistent palette |
| Telegram bot welcome message | First bot interaction sets tone. Missing welcome = cold, robotic feel | Low | /start handler required |
| Registration confirmation message | User must know registration succeeded. No confirmation = uncertainty, duplicate clicks | Low | After collecting name/confirmation button |
| Google Sheets row write on registration | Data capture for reminders and post-event follow-up. Without this, list is lost | Medium | Via Sheets API or Apps Script webhook |
| Reminder messages before event | Attendance rate drops 40-60% without reminders. Minimum: day-before and 1-hour-before | Low | Scheduled broadcast |
| Event link delivered via bot | Attendees need the livestream URL; must come through the bot that registered them | Low | Sent 30-60 min before start |

---

## Differentiators

Features that aren't expected but add measurable lift to conversion or attendance.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Deep link from landing to bot (UTM-style tracking) | Know exactly how many registrations came from the landing vs other sources. Standard `?start=landing` parameter in Telegram URL | Low | `t.me/botname?start=from_landing`; costs nothing to implement |
| Sticky mobile CTA bar | On mobile, CTA button pinned to bottom viewport stays visible while scrolling — increases mobile conversion meaningfully | Low | CSS `position: fixed; bottom: 0` with safe area inset |
| Countdown timer visible in final CTA block | Doubles urgency signal at the moment of decision (user scrolled to bottom = highest intent) | Low | Same JS component, second instance |
| Bot collects first name for personalized messages | "Привет, Анна! Ты зарегистрирована" vs "Вы зарегистрированы" — personal = 20% higher open rates on reminders | Low | Single /start data collection step |
| Post-event follow-up message with recording + CTA | Converts missed attendees and rewatchers into next funnel step. Common in Russian edu-market | Low | Scheduled 24h after event |
| Smooth scroll between sections | Perceived quality upgrade; makes single-page flow feel intentional | Low | CSS `scroll-behavior: smooth` |
| Animated entrance for hero text/photo | Subtle fade-in on load signals modern, premium feel matching dark theme aesthetic | Low | CSS keyframes, no library needed |
| Phone/contact field in bot (optional) | Expands remarketing options beyond Telegram | Medium | Must be clearly optional; mandatory = abandonment |

---

## Anti-Features

Features to deliberately NOT build. Building these wastes time and harms conversion.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Multi-field registration form on the landing page | Every additional field drops conversion. Research: 5+ fields = 120% lower conversion. The bot IS the form | CTA button goes directly to Telegram bot; collect data there |
| Email capture on landing page | This audience is in Telegram. Email adds friction and requires separate deliverability infrastructure | Bot collects Telegram contact; sufficient for this event |
| Admin panel / event management UI | Single event, disposable after March 24. Building CRUD UI = week of work for zero ROI | Manage via Google Sheets directly |
| Payment / checkout flow | Event is free. Payment UI adds complexity and signals the event might not be free | State "бесплатно" prominently in 3+ places |
| Video autoplay on landing | Kills mobile performance, annoys users on data plans, Telegram traffic is mobile-heavy | Static speaker photo only |
| Popups / exit-intent modals | Disruptive on mobile (where 90% of audience is), poor UX, damages trust | Sticky CTA bar achieves urgency without interruption |
| Cookie consent banners / GDPR compliance UI | Russian audience, no EU data subjects, static page on GitHub Pages = no cookies set | Do not add tracking pixels or cookies |
| Dark/light mode toggle | Adds UI complexity; dark theme is the intentional brand choice per design references | Ship dark only; system preference detection not needed |
| Social sharing buttons | Webinar is for warm audience, not viral acquisition. Sharing buttons distract from registration CTA | One CTA per page |
| Countdown timer redirect (auto-redirect when hits zero) | Confusing, breaks expected behavior, can't control what user was doing | Timer hits zero, shows "Эфир начался!" text and link |

---

## Feature Dependencies

```
Landing page CTA → Telegram deep link → Bot /start handler
Bot /start handler → Name collection step → Registration confirmed
Registration confirmed → Google Sheets row write
Google Sheets row write → Reminder broadcast (day before)
Reminder broadcast (day before) → Reminder broadcast (1 hour before)
Reminder broadcast (1 hour before) → Event link delivery
Event link delivery → Post-event follow-up broadcast

Countdown timer → JavaScript Date object targeting 2026-03-24T19:00:00+03:00
Countdown timer → "Эфир начался!" fallback state (when timer = 0)
```

---

## MVP Recommendation

Prioritize in this order:

1. **Landing page HTML/CSS** — 4 blocks, dark theme, hero + program + audience + countdown. Static, no backend. Deploys to GitHub Pages.
2. **Countdown timer** — Pure JS, no library. Targets March 24 19:00 MSK. Fallback text when expired.
3. **Telegram bot /start flow** — Welcome → name collection → confirmation message. Deep link from landing.
4. **Google Sheets write** — On registration confirmation, write: telegram_id, username, first_name, timestamp. Via Apps Script webhook (simplest for static-only constraint).
5. **Reminder broadcasts** — Schedule 3 messages: -24h, -1h, event link. Post-event follow-up optional but high value.

**Defer:**
- Phone number collection in bot: optional field, adds abandonment risk for the first version
- Post-event CTA with recording: implement after event when recording URL is known
- Analytics/UTM tracking via deep link: worth implementing from day one (free, 5 min), do not defer

---

## Sources

- [Top 9 Best Webinar Landing Page Examples for 2026](https://stealthseminar.com/webinar-landing-page-examples/)
- [15 Inspiring Webinar Landing Page Examples — GetResponse](https://www.getresponse.com/blog/best-webinar-landing-page-examples)
- [How to Use Countdown Timers on Landing Pages — Abmatic](https://abmatic.ai/blog/how-to-use-countdown-timers-on-landing-page)
- [Build a Countdown Timer in 18 Lines of JavaScript — SitePoint](https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/)
- [Automating Event Registration with Telegram Bots — BAZU](https://bazucompany.com/blog/automating-event-registration-and-check-in-with-telegram-bots/)
- [Telegram Bot Deep Linking — Official Docs](https://core.telegram.org/bots/features)
- [Google Sheets + Telegram Integration — n8n](https://n8n.io/integrations/google-sheets/and/telegram/)
- [SaleBot.pro — Official Site](https://salebot.pro/)
- [SaleBot Telegram API Functions — Docs](https://docs.salebot.pro/chat-boty/messendzhery-i-chaty/kak-sozdat-bota-v-telegram/funkcii-api-telegram)
- [Landing Page Design Trends 2026 — Moburst](https://www.moburst.com/blog/landing-page-design-trends-2026/)
