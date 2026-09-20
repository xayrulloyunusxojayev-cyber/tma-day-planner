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
from database import upsert_user, get_user_day_data, snooze_habit_alarm_db
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

def get_webapp_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🌿 Open Hairu",
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
                text="Open Hairu",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        )
    except Exception as e:
        logger.warning(f"Could not set menu button: {e}")

    welcome_text = (
        f"🌿 <b>Добро пожаловать в Hairu, {user.first_name}!</b>\n\n"
        "<b>Hairu</b> — твой персональный трекер привычек, утренних ритуалов и ежедневной дисциплины.\n\n"
        "✨ <b>Чем полезен Hairu каждый день:</b>\n"
        "• <b>Осознанность и баланс:</b> структурируй утро, день и вечер без хаоса и выгорания.\n"
        "• <b>Умный будильник & Ритуалы:</b> бот отправляет персональные звуковые сигналы прямо в Telegram в точное время или интервал.\n"
        "• <b>Серии побед (Streak):</b> отслеживай непрерывность выполнения и получай награды за стабильность.\n"
        "• <b>Интерактивный календарь:</b> удобный контроль привычек и истории достижений.\n\n"
        "<i>«Маленькие осознанные шаги каждый день создают непреодолимый результат.»</i>\n\n"
        "Нажми кнопку ниже, чтобы открыть приложение 👇"
    )

    await message.answer(
        welcome_text,
        parse_mode="HTML",
        reply_markup=get_webapp_keyboard()
    )

@dp.message(Command("id"))
async def cmd_id(message: types.Message):
    user = message.from_user
    if not user:
        return
    await message.answer(
        f"🆔 <b>Твой Telegram ID:</b> <code>{user.id}</code>\n"
        f"👤 <b>Имя:</b> {user.first_name}\n"
        f"🌐 <b>Username:</b> @{user.username or 'не указан'}\n\n"
        "Этот ID используется для отправки персональных будильников и напоминаний.",
        parse_mode="HTML"
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

async def send_habit_alarm(user_id: int, habit_id: str, alarm_id: str, title: str, time_str: str):
    """Sends an actionable habit alarm push notification to the user"""
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🔕 Я проснулся / Выполнил (+500)",
                    callback_data=f"alarm_done:{habit_id}:{alarm_id}"
                )
            ],
            [
                InlineKeyboardButton(
                    text="⏱ Отложить на 10 минут",
                    callback_data=f"alarm_snooze:{habit_id}:{alarm_id}"
                )
            ],
            [
                InlineKeyboardButton(
                    text="🌿 Open Hairu",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ]
    )
    text = (
        f"⏰🔔 <b>ПОДЪЕМ / ВРЕМЯ ПРИВЫЧКИ!</b>\n\n"
        f"📌 <b>{title}</b>\n"
        f"⏱ Время: <b>{time_str}</b>\n\n"
        f"<i>Подтверди выполнение или отложи звонок:</i>"
    )
    try:
        await bot.send_message(
            chat_id=user_id,
            text=text,
            parse_mode="HTML",
            reply_markup=kb
        )
    except Exception as e:
        logger.error(f"Failed to send habit alarm to user {user_id}: {e}")

@dp.callback_query(F.data.startswith("alarm_done:"))
async def on_alarm_done(callback: types.CallbackQuery):
    parts = callback.data.split(":")
    habit_id = parts[1] if len(parts) > 1 else ""
    await callback.answer("Привычка выполнена! +500 баллов! 🎉", show_alert=True)
    try:
        await callback.message.edit_text(
            f"✅ <b>Привычка отмечена как выполненная!</b> (+500 баллов)\n\n"
            f"Отличная дисциплина! Ты забираешь этот день! 🚀",
            parse_mode="HTML",
            reply_markup=get_webapp_keyboard()
        )
    except Exception as e:
        logger.warning(f"Could not edit message: {e}")

@dp.callback_query(F.data.startswith("alarm_snooze:"))
async def on_alarm_snooze(callback: types.CallbackQuery):
    parts = callback.data.split(":")
    alarm_id = parts[2] if len(parts) > 2 else ""
    now = datetime.now() + timedelta(minutes=10)
    new_time_str = now.strftime("%H:%M")
    if alarm_id:
        await snooze_habit_alarm_db(alarm_id, new_time_str)
    await callback.answer(f"Отложено на 10 минут (до {new_time_str}) ⏱", show_alert=True)
    try:
        await callback.message.edit_text(
            f"⏱ <b>Напоминание отложено на 10 минут</b> (до {new_time_str}).\n\n"
            f"Скоро прозвучит повторный сигнал!",
            parse_mode="HTML",
            reply_markup=get_webapp_keyboard()
        )
    except Exception as e:
        logger.warning(f"Could not edit message: {e}")

