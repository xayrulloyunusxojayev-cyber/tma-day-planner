import asyncio
import logging
from datetime import datetime
from zoneinfo import ZoneInfo
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from database import (
    get_all_active_alarms,
    get_user_day_data,
    get_all_active_habit_alarms,
    mark_habit_alarm_triggered,
)
from bot import send_wake_up_alarm, send_habit_alarm

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

async def check_alarms_tick():
    try:
        # 1. Check legacy wake_up alarms
        active_alarms = await get_all_active_alarms()
        for alarm in active_alarms:
            tz_str = "Asia/Tashkent"
            try:
                user_now = datetime.now(ZoneInfo(tz_str))
            except Exception:
                user_now = datetime.now()
            current_time_str = user_now.strftime("%H:%M")
            current_day = user_now.weekday()
            today_str = user_now.strftime("%Y-%m-%d")

            if alarm["wake_time"] == current_time_str:
                if current_day in alarm.get("days", [0, 1, 2, 3, 4, 5, 6]):
                    user_data = await get_user_day_data(alarm["user_id"], today_str)
                    target = user_data["target"]
                    logger.info(f"Triggering wake-up alarm for user {alarm['user_id']} at {current_time_str}")
                    asyncio.create_task(
                        send_wake_up_alarm(
                            user_id=alarm["user_id"],
                            wake_time=alarm["wake_time"],
                            target_amount=target["target_amount"],
                            currency=target["currency"]
                        )
                    )

        # 2. Check habit alarms with exact timezone support
        habit_alarms = await get_all_active_habit_alarms()
        for ha in habit_alarms:
            user_tz_str = ha.get("timezone") or "Asia/Tashkent"
            try:
                user_now = datetime.now(ZoneInfo(user_tz_str))
            except Exception:
                user_now = datetime.now()
            
            user_time_str = user_now.strftime("%H:%M")
            today_str = user_now.strftime("%Y-%m-%d")

            # Check if alarm time matches and has not already triggered today
            target_time = ha["time_str"].strip()
            if "-" in target_time:
                target_time = target_time.split("-")[0].strip()

            if user_time_str == target_time and ha.get("last_triggered_date") != today_str:
                logger.info(f"Triggering habit alarm for user {ha['user_id']}: '{ha['title']}' at {user_time_str} ({user_tz_str})")
                await mark_habit_alarm_triggered(ha["id"], today_str)
                asyncio.create_task(
                    send_habit_alarm(
                        user_id=ha["user_id"],
                        habit_id=ha["habit_id"],
                        alarm_id=ha["id"],
                        title=ha["title"],
                        time_str=ha["time_str"]
                    )
                )
    except Exception as e:
        logger.error(f"Error in alarm scheduler: {e}")

def start_scheduler():
    scheduler.add_job(check_alarms_tick, "cron", second=0)
    scheduler.start()
    logger.info("Alarm scheduler started successfully")

