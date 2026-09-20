import asyncio
import logging
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from database import get_all_active_alarms, get_user_day_data
from bot import send_wake_up_alarm

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

async def check_alarms_tick():
    try:
        now = datetime.now()
        current_time_str = now.strftime("%H:%M")
        # Python weekday: 0=Monday, 6=Sunday
        current_day = now.weekday()
        today_str = now.strftime("%Y-%m-%d")

        active_alarms = await get_all_active_alarms()
        for alarm in active_alarms:
            if alarm["wake_time"] == current_time_str:
                if current_day in alarm.get("days", [0, 1, 2, 3, 4, 5, 6]):
                    user_data = await get_user_day_data(alarm["user_id"], today_str)
                    target = user_data["target"]
                    logger.info(f"Triggering alarm for user {alarm['user_id']} at {current_time_str}")
                    asyncio.create_task(
                        send_wake_up_alarm(
                            user_id=alarm["user_id"],
                            wake_time=alarm["wake_time"],
                            target_amount=target["target_amount"],
                            currency=target["currency"]
                        )
                    )
    except Exception as e:
        logger.error(f"Error in alarm scheduler: {e}")

def start_scheduler():
    scheduler.add_job(check_alarms_tick, "cron", second=0)
    scheduler.start()
    logger.info("Alarm scheduler started successfully")
