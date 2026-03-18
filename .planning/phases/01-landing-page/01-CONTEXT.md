# Phase 1: Landing Page - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Разработать и задеплоить тёмный премиальный лендинг для регистрации на бесплатный эфир «Кто будет расти в 2026 году» (24 марта 19:00 МСК). 4 блока, countdown-таймер, CTA → Telegram-бот (placeholder deep link). Деплой на GitHub Pages. Mobile-first.

</domain>

<decisions>
## Implementation Decisions

### Контент и копирайтинг
- Claude генерирует все тексты на основе ТЗ из PROJECT.md (5 пунктов программы, 5 болей ЦА)
- Тон: дружеский, разговорный — как пост в Telegram-канале, на «ты», неформально, как будто пишет сам Вадим
- Подпись под фото Вадима: короткая — «Вадим Сорокин, основатель EGZ» (аудитория тёплая, знает его)
- Боли ЦА для блока «Кому стоит прийти» (точные формулировки от заказчика):
  1. Много знаешь, но мало зарабатываешь
  2. Нет команды или команда совсем маленькая
  3. Нет сильного оффера и сильной упаковки
  4. Генерируешь меньше 2-3 заявок в месяц на свои услуги
  5. Тебя используют как руки а не как стратега

### Визуальный стиль
- Максимальная футуристичность: glow-свечения, неоновые акценты, градиентные фоны, blur-эффекты — уровень Vortek VR
- Scroll-анимации: fade-in + сдвиг снизу при скролле (IntersectionObserver)
- Акцентный цвет: на усмотрение Claude при дизайне (подобрать под референсы)
- Обработка фото Вадима: на усмотрение Claude (glow/свечение или другой подход — под общий стиль)

### CTA-поведение
- Кнопки hero, mid, «Кому стоит прийти» скроллят к финальному блоку (как в LAND-12), оттуда — deep link в бот
- Sticky CTA на мобильном появляется после скролла мимо hero-блока (когда hero-CTA уходит за экран)
- Основная CTA в финальном блоке: deep link `https://t.me/<botname>?start=landing` (placeholder до Phase 3)
- Вторичная CTA «Задать вопрос»: ведёт в ЛС Вадима — `https://t.me/vadimsorokin_egz`

### Countdown и пост-дедлайн
- Таймер считает до 24 марта 2026, 19:00 МСК (+03:00)
- Визуал таймера: на усмотрение Claude (крупные цифры, карточки или другой формат — под общий дизайн)
- Подпись «МСК» обязательна рядом с таймером
- После дедлайна: таймер заменяется на «Эфир уже идёт!», CTA-кнопка остаётся (регистрация ещё возможна)

### Claude's Discretion
- Акцентный цвет (фиолетовый/синий/оранжевый — подобрать под референсы)
- Визуал countdown-таймера (крупные цифры или flip-карточки)
- Обработка фото Вадима в hero (glow, без эффектов, или другой вариант)
- Точная типографика, spacing, размеры шрифтов
- Loading skeleton / preloader
- Error states

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Структура и требования
- `.planning/PROJECT.md` — Структура лендинга (4 блока), описание продукта, аудитория, контекст эфира
- `.planning/REQUIREMENTS.md` — Полный список требований LAND-01..LAND-16 с деталями каждого блока
- `.planning/ROADMAP.md` — Success criteria для Phase 1 (5 пунктов)

### Дизайн-референсы
- Референсы указаны в PROJECT.md: Vortek VR, Terrixa, FRZN — тёмные футуристичные лендинги (скриншоты у заказчика, стиль описан в ТЗ)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Нет существующего кода — greenfield проект (только Markdown-документация и Python PDF-скрипты)

### Established Patterns
- Vanilla HTML/CSS/JS без фреймворков (LAND-14) — никаких React/Vue/сборщиков
- Проект использует GitHub Pages — статика only, `.nojekyll` в корне

### Integration Points
- Deep link placeholder: `https://t.me/<botname>?start=landing` — будет обновлён в Phase 3
- Вторичная CTA: `https://t.me/vadimsorokin_egz` — ссылка на ЛС Вадима
- Фото Вадима: файл будет подставлен заказчиком (пока placeholder)
- Логотип EGZ Academy: нужен файл от заказчика (пока placeholder)

</code_context>

<specifics>
## Specific Ideas

- Боли ЦА — точные формулировки от заказчика (не переписывать, использовать как есть)
- Тон как в Telegram-канале Вадима — на «ты», без официоза
- Уровень визуальных эффектов максимальный — glow, неон, градиенты (как Vortek VR)
- Дизайн обязательно через навык frontend-design на Opus 4.6

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-landing-page*
*Context gathered: 2026-03-18*
