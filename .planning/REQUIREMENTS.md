# Requirements: Эфир «Кто будет расти в 2026 году»

**Defined:** 2026-03-18
**Core Value:** Человек с лендинга за один клик попадает в Telegram-бот и регистрируется на эфир

## v1 Requirements

### Landing Page — Design

- [x] **LAND-01**: Тёмная тема с премиальным дизайном на уровне референсов (Vortek VR, Terrixa, FRZN)
- [x] **LAND-02**: Mobile-first responsive вёрстка (основной трафик из Telegram = телефон)
- [x] **LAND-03**: Дизайн-решения на основе референсов (Vortek VR, Terrixa, FRZN) — не навязывать минимализм
- [x] **LAND-04**: Плавные scroll-анимации (появление блоков при скролле)
- [x] **LAND-05**: Дизайн через навык frontend-design на Opus 4.6
- [x] **LAND-16**: Где нужны генерации изображений — промпт-инженер готовит промпты для Нана Банана, пока ставит placeholder

### Landing Page — Blocks

- [x] **LAND-06**: Hero-блок: логотип EGZ Academy, заголовок «Кто будет расти в 2026 году», подзаголовок, мета (дата/время/бесплатно), фото Вадима, подпись, CTA
- [x] **LAND-07**: Блок «Что разберём на эфире»: текст-подводка + 5 пунктов программы + CTA
- [x] **LAND-08**: Блок «Кому стоит прийти»: 5 болей ЦА + CTA
- [x] **LAND-09**: Финальный блок: countdown-таймер до 24 марта 19:00 МСК, основная CTA → бот, вторичная CTA «Задать вопрос» → ЛС Вадима
- [x] **LAND-10**: Sticky CTA-кнопка внизу экрана на мобильном

### Landing Page — Technical

- [x] **LAND-11**: Countdown-таймер с явным указанием таймзоны МСК (+03:00)
- [x] **LAND-12**: Все CTA-кнопки ведут на scroll к финальному блоку, оттуда deep link в Telegram-бот
- [x] **LAND-13**: Deep link формат: `https://t.me/<botname>?start=landing` (placeholder в Phase 1, реальный — в Phase 3)
- [x] **LAND-14**: Vanilla HTML/CSS/JS без фреймворков и сборщиков
- [x] **LAND-15**: Деплой на GitHub Pages с файлом `.nojekyll`

### Telegram Bot (SaleBot)

- [ ] **BOT-01**: Отдельная воронка в SaleBot для этого эфира
- [ ] **BOT-02**: Deep link параметр из лендинга запускает воронку
- [ ] **BOT-03**: Приветственное сообщение с кнопкой «Зарегистрироваться на эфир»
- [ ] **BOT-04**: Повторный переход по ссылке — воронка запускается заново
- [ ] **BOT-05**: После нажатия кнопки — подтверждение: «Вы зарегистрированы! 24 марта в 19:00 МСК пришлём ссылку на эфир»
- [ ] **BOT-06**: Данные регистрации отправляются в Google Таблицу

### Google Sheets

- [ ] **SHEET-01**: Таблица с колонками: user_id, username, имя (first_name), дата/время регистрации, источник (deep link param)
- [ ] **SHEET-02**: Интеграция SaleBot → Google Sheets (нативная или через Google Apps Script)

### Рассылки (SaleBot)

- [ ] **MAIL-01**: Напоминание за 24 часа до эфира
- [ ] **MAIL-02**: Напоминание за 1 час до эфира
- [ ] **MAIL-03**: Ссылка на эфир в момент старта
- [ ] **MAIL-04**: После эфира — запись + CTA

## v2 Requirements

### Аналитика

- **ANAL-01**: UTM-метки на лендинге для отслеживания источников трафика
- **ANAL-02**: Яндекс.Метрика / Google Analytics на лендинге
- **ANAL-03**: Конверсия по воронке: посещение → клик CTA → регистрация в боте

### Улучшения

- **ENH-01**: A/B тест заголовков
- **ENH-02**: Social proof (количество зарегистрированных)
- **ENH-03**: Видео-превью эфира

## Out of Scope

| Feature | Reason |
|---------|--------|
| Форма регистрации на лендинге | Бот IS the form — дублирование убивает конверсию |
| Админ-панель | Разовое мероприятие, управление через SaleBot |
| Оплата | Эфир бесплатный |
| Мультиязычность | Аудитория русскоязычная |
| CMS/WordPress | Статический HTML на GitHub Pages |
| Самописный бот (aiogram) | Выбран SaleBot как платформа |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAND-01 | Phase 1 | Complete |
| LAND-02 | Phase 1 | Complete |
| LAND-03 | Phase 1 | Complete |
| LAND-04 | Phase 1 | Complete |
| LAND-05 | Phase 1 | Complete |
| LAND-06 | Phase 1 | Complete |
| LAND-07 | Phase 1 | Complete |
| LAND-08 | Phase 1 | Complete |
| LAND-09 | Phase 1 | Complete |
| LAND-10 | Phase 1 | Complete |
| LAND-11 | Phase 1 | Complete |
| LAND-12 | Phase 1 | Complete |
| LAND-13 | Phase 1 | Complete |
| LAND-14 | Phase 1 | Complete |
| LAND-15 | Phase 1 | Complete |
| LAND-16 | Phase 1 | Complete |
| SHEET-01 | Phase 2 | Pending |
| SHEET-02 | Phase 2 | Pending |
| BOT-01 | Phase 3 | Pending |
| BOT-02 | Phase 3 | Pending |
| BOT-03 | Phase 3 | Pending |
| BOT-04 | Phase 3 | Pending |
| BOT-05 | Phase 3 | Pending |
| BOT-06 | Phase 3 | Pending |
| MAIL-01 | Phase 4 | Pending |
| MAIL-02 | Phase 4 | Pending |
| MAIL-03 | Phase 4 | Pending |
| MAIL-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-03-18*
*Last updated: 2026-03-18 — phase order revised: Landing (1) → Sheets (2) → Bot (3) → Broadcasts (4)*
