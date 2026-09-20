import asyncio
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
    MenuButtonWebApp,
)
from config import BOT_TOKEN, WEBAPP_URL
from database import upsert_user, get_user_day_data
from datetime import datetime

logger = logging.getLogger(__name__)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

def get_webapp_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="⚡️ Открыть Day Planner & Revenue",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ]
    )

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    user = message.from_user
    if not user:
        return

    await upsert_user(user.id, user.username or "", user.first_name or "")

    # Set persistent Menu Button for the user
    try:
        await bot.set_chat_menu_button(
            chat_id=user.id,
            menu_button=MenuButtonWebApp(
                text="🚀 Мой План",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        )
    except Exception as e:
        logger.warning(f"Could not set menu button: {e}")

    welcome_text = (
        f"🔥 <b>Добро пожаловать в Apex Day Planner, {user.first_name}!</b>\n\n"
        "Это не просто список дел. Это твой личный <b>Revenue & Time Accelerator</b>:\n\n"
        "⏰ <b>Умный будильник:</b> разбудит в нужную минуту и не даст проспать цели.\n"
        "📊 <b>Таблица слотов:</b> четкий тайм-блокинг с 06:00 до 23:00.\n"
        "💰 <b>Фокус на доходе (DPA):</b> каждая задача привязана к деньгам. Закрывай задачи — расти кассу.\n\n"
        "Нажми кнопку ниже, чтобы открыть Mini App 👇"
    )

    await message.answer(
        welcome_text,
        parse_mode="HTML",
        reply_markup=get_webapp_keyboard()
    )

@dp.message(Command("today"))
async def cmd_today(message: types.Message):
    user = message.from_user
    if not user:
        return

    today_str = datetime.now().strftime("%Y-%m-%d")
    data = await get_user_day_data(user.id, today_str)

    tasks = data["tasks"]
    target = data["target"]

    earned = sum(t["revenue_impact"] for t in tasks if t["is_completed"])
    pending = sum(t["revenue_impact"] for t in tasks if not t["is_completed"])
    completed_count = sum(1 for t in tasks if t["is_completed"])

    summary = (
        f"📋 <b>Сводка на сегодня ({today_str}):</b>\n\n"
        f"🎯 <b>Цель дня:</b> {target['target_amount']} {target['currency']}\n"
        f"💰 <b>Заработано:</b> {earned} {target['currency']}\n"
        f"⏳ <b>В планах:</b> {pending} {target['currency']}\n"
        f"✅ <b>Выполнено задач:</b> {completed_count}/{len(tasks)}\n\n"
        "Открой приложение для управления слотами:"
    )

    await message.answer(
        summary,
        parse_mode="HTML",
        reply_markup=get_webapp_keyboard()
    )

@dp.message(Command("alarm"))
async def cmd_alarm(message: types.Message):
    user = message.from_user
    if not user:
        return

    today_str = datetime.now().strftime("%Y-%m-%d")
    data = await get_user_day_data(user.id, today_str)
    alarm = data["alarm"]

    status = "🟢 ВКЛЮЧЕН" if alarm["is_active"] else "🔴 ВЫКЛЮЧЕН"
    text = (
        f"⏰ <b>Статус будильника:</b> {status}\n"
        f"⏱ <b>Время подъема:</b> {alarm['wake_time']}\n"
        f"🎵 <b>Мелодия:</b> {alarm['sound_type'].capitalize()}\n\n"
        "Ты можешь изменить время или выключить будильник прямо в Mini App:"
    )

    await message.answer(text, parse_mode="HTML", reply_markup=get_webapp_keyboard())

async def send_wake_up_alarm(user_id: int, wake_time: str, target_amount: float, currency: str):
    """Sends a high-priority wake up notification to the user"""
    curr_symbol = "$" if currency == "USD" else f" {currency}"
    text = (
        f"⏰🔔 <b>ПОДЪЕМ! ВРЕМЯ ПОБЕЖДАТЬ!</b>\n\n"
        f"На часах <b>{wake_time}</b>. Твой день уже начался.\n"
        f"🎯 <b>Твоя сегодняшняя цель: {target_amount}{curr_symbol}</b>\n\n"
        "Не задерживайся в кровати. Открывай Mini App, активируй фокус и забирай этот день!"
    )
    try:
        await bot.send_message(
            chat_id=user_id,
            text=text,
            parse_mode="HTML",
            reply_markup=get_webapp_keyboard()
        )
    except Exception as e:
        logger.error(f"Failed to send alarm to user {user_id}: {e}")
