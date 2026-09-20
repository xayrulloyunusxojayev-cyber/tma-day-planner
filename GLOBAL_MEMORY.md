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


## 3. Архитектура экранов (Daily Sanctuary — 5 экранов пиксель-в-пиксель)
1. **Экран 1: Home (Daily Sanctuary)**
   - Приветствие `Good morning, Sophia` + цветок, дата, цитата дня `Small mindful steps cultivate enduring peace.`
   - Карточка `Harmony in Motion`: 14-Day Streak, 4/5 rituals completed, кольцевой SVG-прогресс 80%, стрелка баланса.
   - Недельный календарь `This Week` | `Perfect Pace` с чекмарками и песочными часами.
   - Фильтры по времени суток: `All (5)`, `Morning (3)`, `Afternoon (1)`, `Evening (2)`.
   - Список привычек `Today's Habits` с отметкой выполнения (Haptics), счетчиком `+ 500 steps` и прогресс-баром.
   - Карточка мудрости `Mindful Reflection: Rest is a conscious choice`.

2. **Экран 2: Calendar & Analytics (Consistency Analytics)**
   - Метрики: `Current Streak` (28 Days), `Consistency` (92%), `Completed` (184 habits), `Best Month` (October).
   - Календарь на месяц с точками активности (100% Perfect, Partial, Rest).
   - Список ритуалов дня с кнопкой `Mark Done`.
   - Награды `Milestone Badges`: `Consistency Club (Gold)`, `30-Day Zen Master (28/30)`.
   - `Habit Tip of the Day`.

3. **Экран 3: Alarm & Routines**
   - Баннер ближайшего ритуала: `Evening Nature Walk (In 42 min)`.
   - Переключатели: `Smart Alarms` и `Gentle Chimes` (с прослушиванием звука через Web Audio).
   - Группы будильников: `Morning Routines`, `Afternoon Focus`, `Evening Wind-Down` с тумблерами.
   - `Persistent Alarm Mode: Ring until habit is marked complete`.
   - Кнопка `Set New Reminder`.

4. **Экран 4: Add Habit (Модальное окно)**
   - Создание нового ритуала: `Habit Title`, быстрые идеи `Inspirations`.
   - `Aesthetic & Symbol`: выбор иконки и цвета палитры.
   - `Category Realm`: Mindfulness, Fitness, Productivity, Health, Sleep.
   - `Cadence & Cycle`: Every day / Weekdays + дни недели.
   - `Target Goal`: счетчик `— 15 +` с выбором единиц (ml, steps, pages, min).
   - `Reminder`: время напоминания и тумблер.
   - Кнопка `Create Habit`.

5. **Экран 5: Settings & Profile**
   - Карточка `Sophia Laurent` (Habit Pro Member ✨, 14 Days Streak, 84% Score).
   - `Habit Flow & Feedback`: First Day of Week, Sound Effects, Haptic Feedback, Vacation Mode.
   - `Appearance & Atmosphere`: темы Organic Sage, Oat Minimal, Nordic Dusk, Dark Mode.
   - `Integrations & Community`: Apple Health, Cloud Backup, Export Data, Streak Guide, Rate App.


