# GLOBAL_MEMORY.md - Telegram Mini App: Daily Planner & Revenue Accelerator

## 1. О проекте
- **Название:** TMA Daily Planner & Revenue Tracker (Apex Planner)
- **Цель:** Telegram Mini App для структурирования дня с жестким фокусом на прибыль (Dollar-Productive Activities), почасовой интерактивной таблицей, будильником/утренним ритуалом и интеграцией с Telegram-ботом.
- **Дизайн:** Ультра-аккуратный, премиальный темный UI (стиль Linear / Apple Health / Fintech), идеальная типографика, тактильный отклик (Haptics), адаптивность под мобильные устройства.

## 2. Архитектура и технологии
- **Bot Token:** `8985992778:AAHx829I6VBKJTxE5ma6kJ9EbCmITcgHF68`
- **Backend:** Python 3.13, FastAPI, aiogram 3.x, aiosqlite (SQLite), APScheduler.
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Telegram WebApp SDK, Web Audio API (для будильника).
- **Связка:** FastAPI раздает API (`/api/...`) и сбилженный статический фронтенд (`/`), обеспечивая запуск всей системы одной командой.

## 3. Ключевой функционал
- **Таблица планов (Schedule Grid):**
  - Почасовые слоты дня (06:00 - 23:00).
  - Привязка дохода к задачам (DPA): расчет заработанных денег и ROI времени.
  - Категории: 💰 Доход (DPA), ⚡️ Проект / Фокус, ☕️ Рутина / Отдых.
- **Будильник и Wake-Up Protocol:**
  - Настройка времени подъема и дней недели.
  - Серия Telegram-пушей от бота в заданное время + звук и виброотклик при открытии Mini App.
  - Деактивация будильника через подтверждение фокуса на день.
- **Revenue Dashboard:**
  - Дневная финансовая цель (Daily Target).
  - Прогресс выполнения (Earned today).
