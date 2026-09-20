import os
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional

from config import PORT, HOST, BOT_TOKEN
from database import (
    init_db,
    get_user_day_data,
    save_task,
    toggle_task_db,
    delete_task_db,
    save_alarm_db,
    save_target_db,
    sync_user_alarms_db,
)
from bot import bot, dp
from scheduler import start_scheduler

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for API validation
class TaskModel(BaseModel):
    id: str
    user_id: int
    date: str
    slot: str
    title: str
    revenue_impact: float = 0
    category: str = "dpa"
    is_completed: bool = False
    notes: Optional[str] = ""

class ToggleTaskModel(BaseModel):
    task_id: str
    is_completed: bool

class AlarmModel(BaseModel):
    user_id: int
    wake_time: str
    is_active: bool
    days: List[int]
    sound_type: str = "apex"
    vibrate: bool = True

class TargetModel(BaseModel):
    user_id: int
    date: str
    target_amount: float
    currency: str = "USD"

class HabitAlarmItem(BaseModel):
    habit_id: str
    title: str
    time_str: str
    is_active: bool = True

class SyncAlarmsModel(BaseModel):
    user_id: int
    timezone: str = "Asia/Tashkent"
    alarms: List[HabitAlarmItem]
    source: str = "all"

bot_task = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing Database...")
    await init_db()

    logger.info("Starting Scheduler...")
    start_scheduler()

    logger.info("Starting Telegram Bot Polling...")
    global bot_task
    bot_task = asyncio.create_task(dp.start_polling(bot))

    yield

    # Shutdown
    if bot_task:
        bot_task.cancel()
    await bot.session.close()
    logger.info("Shutdown complete.")

app = FastAPI(title="Apex Day Planner API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check & Uptime monitoring
@app.head("/")
async def head_root():
    return {"status": "ok"}

@app.get("/health")
@app.head("/health")
@app.get("/ping")
@app.head("/ping")
async def health_check():
    return {"status": "ok", "app": "Hairu", "uptime": "healthy"}

# API Routes
@app.get("/api/data")
async def get_day_data(user_id: int, date: str):
    data = await get_user_day_data(user_id, date)
    return data

@app.post("/api/tasks")
async def api_save_task(task: TaskModel):
    await save_task(task.model_dump())
    return {"status": "ok", "task": task}

@app.post("/api/tasks/toggle")
async def api_toggle_task(data: ToggleTaskModel):
    await toggle_task_db(data.task_id, data.is_completed)
    return {"status": "ok"}

@app.delete("/api/tasks/{task_id}")
async def api_delete_task(task_id: str):
    await delete_task_db(task_id)
    return {"status": "ok"}

@app.post("/api/alarm")
async def api_save_alarm(alarm: AlarmModel):
    await save_alarm_db(alarm.model_dump())
    return {"status": "ok", "alarm": alarm}

@app.post("/api/target")
async def api_save_target(target: TargetModel):
    await save_target_db(target.model_dump())
    return {"status": "ok", "target": target}

@app.post("/api/alarms/sync")
async def api_sync_alarms(data: SyncAlarmsModel):
    await sync_user_alarms_db(
        data.user_id,
        data.timezone,
        [a.model_dump() for a in data.alarms],
        source=data.source
    )
    return {"status": "ok", "count": len(data.alarms)}


# Static files for Vite React build
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

@app.exception_handler(404)
async def custom_404_handler(request, exc):
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"error": "Not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
