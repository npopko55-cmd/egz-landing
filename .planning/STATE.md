---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: Phase 1 context gathered
last_updated: "2026-03-18T12:20:03.929Z"
last_activity: "2026-03-18 — Roadmap revised: порядок фаз изменён на Landing → Sheets → Bot → Broadcasts"
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-18)

**Core value:** Человек с лендинга за один клик попадает в Telegram-бот и регистрируется на эфир; данные автоматически попадают в Google Таблицу
**Current focus:** Phase 1 — Landing Page

## Current Position

Phase: 1 of 4 (Landing Page)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-03-18 — Roadmap revised: порядок фаз изменён на Landing → Sheets → Bot → Broadcasts

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: none yet
- Trend: -

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: SaleBot выбран как платформа для бота (не self-hosted aiogram) — уже подключён как сервис
- [Init]: GitHub Pages для деплоя лендинга — статика, vanilla HTML/CSS/JS
- [Init]: Дизайн лендинга через навык frontend-design на Opus 4.6 — обязательно
- [Init]: Для изображений — промпты для Нана Банана, пока placeholder в коде
- [Revised 2026-03-18]: Порядок сборки изменён: Landing → Sheets → Bot → Reminders. Лендинг идёт первым с placeholder deep link; после создания воронки SaleBot (Phase 3) placeholder заменяется на реальный username бота.

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1]: Deep link в лендинге — placeholder до Phase 3; задеплоить реальный URL после создания воронки SaleBot
- [Phase 3]: Bot @username неизвестен до создания воронки в SaleBot — обновить deep link в лендинге по завершении Phase 3
- [Phase 4]: Ссылка на трансляцию неизвестна до дня эфира — MAIL-03 использует placeholder до получения URL
- [Phase 4]: Ссылка на запись эфира появится после события — MAIL-04 настраивается с placeholder, обновляется после 24 марта

## Session Continuity

Last session: 2026-03-18T12:20:03.922Z
Stopped at: Phase 1 context gathered
Resume file: .planning/phases/01-landing-page/01-CONTEXT.md
