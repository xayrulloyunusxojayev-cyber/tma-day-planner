# Apex Day Planner & Revenue TMA ⚡️

Telegram Mini App (TMA) для ежедневного планирования, жесткого тайм-блокинга, привязки задач к деньгам (Dollar-Productive Activities) и умного пробуждения с будильником.

---

## 🚀 Ключевой функционал

1. **Таблица слотов дня (Schedule Grid):**
   - Почасовые интервалы с 06:00 до 23:00.
   - Быстрое добавление и редактирование задач.
   - Отметка выполнения с мгновенным тактильным откликом (Haptics) и пересчетом кассы.
2. **Фокус на доходе (Dollar-Productive Activities):**
   - Каждая задача имеет финансовую ценность ($ / сум / ₽).
   - Прогресс-бар выполнения дневной цели по заработку.
   - Разделение на DPA (прямой доход), Фокус (проекты/код) и Рутину.
3. **Умный будильник (Wake-up Protocol):**
   - Точная настройка времени подъема и дней недели.
   - Web Audio HD синтезатор с мелодиями (Apex Prime, Pulse, Sunrise).
   - Серия пуш-уведомлений в Telegram от бота в заданное время.
   - Экран пробуждения с подтверждением ТОП-целей дня.

---

## 🛠 Технический стек

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Telegram WebApp SDK, Web Audio API.
- **Backend:** Python 3.13, FastAPI, aiogram 3.x, aiosqlite (SQLite), APScheduler.
- **Связка:** Единый процесс запуска — FastAPI раздает REST API и статический фронтенд.

---

## 🏁 Запуск

### 1. Быстрый запуск сервера и бота:
```bash
cd /Users/macbookpro/.gemini/antigravity/scratch/tma_day_planner
./run.sh
```
Сервер будет доступен по адресу: `http://localhost:8000`

### 2. Подключение к Telegram:
Для того чтобы Telegram Mini App открывался на смартфонах и в десктопном клиенте:
1. Открой туннель к порту 8000 (например через ngrok, localtunnel или Cloudflare Tunnel):
   ```bash
   ngrok http 8000
   ```
2. Скопируй полученный `https://...` адрес.
3. Вставь его в `backend/config.py` в переменную `WEBAPP_URL` (или укажи в `.env`).
4. Настрой кнопку меню в [@BotFather](https://t.me/BotFather):
   - Отправь команду `/setmenubutton`
   - Выбери своего бота
   - Введи ссылку на твой WebApp
   - Введи название кнопки: `🚀 Мой План`
5. Или создай Mini App короткую ссылку через `/newapp`.
