# GLOBAL_MEMORY.md - Telegram Mini App: Daily Planner & Revenue Accelerator

## 1. О проекте
- **Название:** TMA Daily Planner & Revenue Tracker (Apex Planner)
- **Цель:** Telegram Mini App для структурирования дня с жестким фокусом на прибыль (Dollar-Productive Activities), почасовой интерактивной таблицей, будильником/утренним ритуалом и интеграцией с Telegram-ботом.
- **Дизайн:** Ультра-аккуратный, премиальный темный UI (стиль Linear / Apple Health / Fintech), идеальная типографика, тактильный отклик (Haptics), адаптивность под мобильные устройства.

## 2. Архитектура и технологии
- **Bot Token:** `8985992778:AAHx829I6VBKJTxE5ma6kJ9EbCmITcgHF68`
- **Bot Username:** `@xayrulo_bot`
- **GitHub Repository:** `https://github.com/xayrulloyunusxojayev-cyber/tma-day-planner`
- **Production URL (Render):** `https://tma-day-planner.onrender.com`
- **Backend:** Python 3.13, FastAPI, aiogram 3.x, aiosqlite (SQLite), APScheduler.
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Telegram WebApp SDK, Web Audio API (для будильника).
- **Связка:** Развернуто на Render.com через Dockerfile. Uvicorn отдает API, статику фронтенда и запускает бота aiogram 3.


## 3. Ключевой функционал (Notion Table View)
- **Точная копия Notion Database UI:**
  - Чистый минималистичный светлый интерфейс Notion (шрифты, линии `#e9e9e8`, отступы).
  - Вкладки видов: `📋 All Tasks`, `🔄 By Status`, `👤 My Tasks`, `📅 Today`.
  - Полноценная таблица:
    - `Aa Task name`: название задачи с зеленой галочкой, инлайн-редактирование по клику.
    - `≡ Text / Time`: временной интервал (`8.00-13.00`, `15.00-18.00`, `24/7`) с инлайн-редактированием.
    - `💰 Earnings`: сумма заработка от задачи с автоматическим расчетом общей суммы (Sum) внизу таблицы.
    - `👥 Assignee`: аватарка + имя (Hayrullo).
    - `📅 Due date`: дата задачи.
    - `☼ Status`: аутентичные Notion-пилюли (`In progress` синий, `Done` зеленый, `Not started` серый) с переключением в 1 клик.
    - `☑️ Checkbox`: квадратный чекбокс.
  - Строка `+ New task` внизу таблицы — добавление строки в 1 клик.
  - Будильник в шапке Notion: аккуратная кнопка с настройкой времени подъема и дней недели.

