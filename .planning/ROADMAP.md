# Roadmap: Эфир «Кто будет расти в 2026 году»

## Overview

Четыре последовательные фазы: сначала лендинг (с placeholder-ссылкой на бота), затем Google Таблица (разблокирует интеграцию), затем Telegram-бот (после создания воронки — реальный username обновляет placeholder в лендинге), затем рассылки (нужен рабочий end-to-end флоу). Продукт готов к промоушену после Phase 3; Phase 4 завершает жизненный цикл эфира.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Landing Page** - Разработать и задеплоить лендинг: дизайн через frontend-design, 4 блока, countdown, CTA → бот (placeholder deep link)
- [ ] **Phase 2: Google Sheets** - Создать таблицу-регистратор и подключить интеграцию с SaleBot
- [ ] **Phase 3: Telegram Bot** - Настроить воронку SaleBot: welcome, регистрация, подтверждение, запись в Таблицу; обновить placeholder в лендинге на реальный deep link
- [ ] **Phase 4: Reminder Broadcasts** - Настроить рассылки: T-24h, T-1h, T+0 ссылка на эфир, T+24h запись + CTA

## Phase Details

### Phase 1: Landing Page
**Goal**: Лендинг задеплоен на GitHub Pages, соответствует дизайн-референсам, все CTA ведут в бот (deep link — placeholder до создания воронки), countdown работает по МСК
**Depends on**: Nothing (first phase)
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07, LAND-08, LAND-09, LAND-10, LAND-11, LAND-12, LAND-13, LAND-14, LAND-15, LAND-16
**Success Criteria** (what must be TRUE):
  1. Страница открывается на мобильном (iOS/Android Telegram browser) и выглядит как тёмный премиальный лендинг уровня Vortek VR/Terrixa
  2. Countdown-таймер показывает корректный отсчёт до 24 марта 19:00 МСК и отображает метку «МСК»
  3. Нажатие любой CTA-кнопки (hero, mid, final) ведёт в Telegram-бот по deep link (placeholder `?start=landing` — будет обновлён в Phase 3)
  4. Sticky CTA-кнопка видна внизу экрана на мобильном без скролла
  5. GitHub Pages деплой активен, `.nojekyll` файл присутствует в корне репозитория
**Plans**: TBD

### Phase 2: Google Sheets
**Goal**: Google Таблица с правильной схемой подключена к SaleBot и готова принимать данные регистраций
**Depends on**: Phase 1
**Requirements**: SHEET-01, SHEET-02
**Success Criteria** (what must be TRUE):
  1. Таблица существует с колонками user_id, username, first_name, дата/время регистрации, источник (deep link param)
  2. SaleBot подключён к Таблице и может делать append-записи
  3. Тестовая строка появляется в Таблице при ручной отправке тестового события из SaleBot
**Plans**: TBD

### Phase 3: Telegram Bot
**Goal**: Рабочая воронка SaleBot: пользователь по deep link запускает бота, нажимает «Зарегистрироваться», получает подтверждение, строка появляется в Таблице; placeholder в лендинге заменён на реальный username бота
**Depends on**: Phase 2
**Requirements**: BOT-01, BOT-02, BOT-03, BOT-04, BOT-05, BOT-06
**Success Criteria** (what must be TRUE):
  1. Переход по `https://t.me/<botname>?start=landing` открывает приветственное сообщение с кнопкой «Зарегистрироваться на эфир»
  2. После нажатия кнопки пользователь получает сообщение-подтверждение с датой и временем 24 марта 19:00 МСК
  3. Повторный переход по deep link снова запускает воронку (не блокирует повторную регистрацию)
  4. Строка с user_id, username, именем, датой/временем и источником появляется в Google Таблице
  5. Placeholder deep link в лендинге заменён на реальный `https://t.me/<botname>?start=landing` и задеплоен
**Plans**: TBD

### Phase 4: Reminder Broadcasts
**Goal**: Все четыре рассылки настроены в SaleBot с правильными таймингами, персонализацией и ссылкой на эфир
**Depends on**: Phase 3
**Requirements**: MAIL-01, MAIL-02, MAIL-03, MAIL-04
**Success Criteria** (what must be TRUE):
  1. Тестовая рассылка «за 24 часа» отправляется и корректно доходит до тест-аккаунта
  2. Тестовая рассылка «за 1 час» отправляется и содержит правильное время с меткой МСК
  3. Рассылка «старт эфира» содержит кликабельную ссылку на трансляцию
  4. Рассылка «после эфира» содержит ссылку на запись и CTA следующего шага воронки
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Landing Page | 0/TBD | Not started | - |
| 2. Google Sheets | 0/TBD | Not started | - |
| 3. Telegram Bot | 0/TBD | Not started | - |
| 4. Reminder Broadcasts | 0/TBD | Not started | - |
