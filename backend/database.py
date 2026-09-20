import aiosqlite
import json
from datetime import datetime
from config import DATABASE_PATH

async def init_db():
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                username TEXT,
                first_name TEXT,
                created_at TEXT
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                user_id INTEGER,
                date TEXT,
                slot TEXT,
                title TEXT,
                revenue_impact REAL DEFAULT 0,
                category TEXT DEFAULT 'dpa',
                is_completed INTEGER DEFAULT 0,
                notes TEXT,
                created_at TEXT
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS alarms (
                user_id INTEGER PRIMARY KEY,
                wake_time TEXT DEFAULT '07:00',
                is_active INTEGER DEFAULT 1,
                days TEXT DEFAULT '[0,1,2,3,4,5,6]',
                sound_type TEXT DEFAULT 'apex',
                vibrate INTEGER DEFAULT 1
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS targets (
                user_id INTEGER,
                date TEXT,
                target_amount REAL DEFAULT 200,
                currency TEXT DEFAULT 'USD',
                PRIMARY KEY (user_id, date)
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS habit_alarms (
                id TEXT PRIMARY KEY,
                user_id INTEGER,
                habit_id TEXT,
                title TEXT,
                time_str TEXT,
                is_active INTEGER DEFAULT 1,
                timezone TEXT DEFAULT 'Asia/Tashkent',
                last_triggered_date TEXT DEFAULT '',
                updated_at TEXT,
                source TEXT DEFAULT 'all'
            )
        """)
        try:
            await db.execute("ALTER TABLE habit_alarms ADD COLUMN source TEXT DEFAULT 'all'")
        except Exception:
            pass
        await db.commit()

async def upsert_user(user_id: int, username: str, first_name: str):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        now = datetime.now().isoformat()
        await db.execute("""
            INSERT INTO users (user_id, username, first_name, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                username=excluded.username,
                first_name=excluded.first_name
        """, (user_id, username, first_name, now))
        await db.commit()

async def get_user_day_data(user_id: int, date_str: str):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row

        # Get tasks
        async with db.execute("SELECT * FROM tasks WHERE user_id = ? AND date = ? ORDER BY slot ASC", (user_id, date_str)) as cursor:
            tasks_rows = await cursor.fetchall()
            tasks = []
            for r in tasks_rows:
                tasks.append({
                    "id": r["id"],
                    "user_id": r["user_id"],
                    "date": r["date"],
                    "slot": r["slot"],
                    "title": r["title"],
                    "revenue_impact": r["revenue_impact"],
                    "category": r["category"],
                    "is_completed": bool(r["is_completed"]),
                    "notes": r["notes"],
                })

        # Get alarm
        async with db.execute("SELECT * FROM alarms WHERE user_id = ?", (user_id,)) as cursor:
            alarm_row = await cursor.fetchone()
            if alarm_row:
                alarm = {
                    "user_id": alarm_row["user_id"],
                    "wake_time": alarm_row["wake_time"],
                    "is_active": bool(alarm_row["is_active"]),
                    "days": json.loads(alarm_row["days"] or "[0,1,2,3,4,5,6]"),
                    "sound_type": alarm_row["sound_type"],
                    "vibrate": bool(alarm_row["vibrate"]),
                }
            else:
                alarm = {
                    "user_id": user_id,
                    "wake_time": "07:00",
                    "is_active": True,
                    "days": [0, 1, 2, 3, 4, 5, 6],
                    "sound_type": "apex",
                    "vibrate": True,
                }

        # Get target
        async with db.execute("SELECT * FROM targets WHERE user_id = ? AND date = ?", (user_id, date_str)) as cursor:
            target_row = await cursor.fetchone()
            if target_row:
                target = {
                    "user_id": target_row["user_id"],
                    "date": target_row["date"],
                    "target_amount": target_row["target_amount"],
                    "currency": target_row["currency"],
                }
            else:
                target = {
                    "user_id": user_id,
                    "date": date_str,
                    "target_amount": 250.0,
                    "currency": "USD",
                }

        return {
            "tasks": tasks,
            "alarm": alarm,
            "target": target
        }

async def save_task(task: dict):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        now = datetime.now().isoformat()
        await db.execute("""
            INSERT INTO tasks (id, user_id, date, slot, title, revenue_impact, category, is_completed, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                slot=excluded.slot,
                title=excluded.title,
                revenue_impact=excluded.revenue_impact,
                category=excluded.category,
                is_completed=excluded.is_completed,
                notes=excluded.notes
        """, (
            task["id"],
            task["user_id"],
            task["date"],
            task["slot"],
            task["title"],
            task.get("revenue_impact", 0),
            task.get("category", "dpa"),
            1 if task.get("is_completed") else 0,
            task.get("notes", ""),
            now
        ))
        await db.commit()

async def toggle_task_db(task_id: str, is_completed: bool):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("UPDATE tasks SET is_completed = ? WHERE id = ?", (1 if is_completed else 0, task_id))
        await db.commit()

async def delete_task_db(task_id: str):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        await db.commit()

async def save_alarm_db(alarm: dict):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("""
            INSERT INTO alarms (user_id, wake_time, is_active, days, sound_type, vibrate)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                wake_time=excluded.wake_time,
                is_active=excluded.is_active,
                days=excluded.days,
                sound_type=excluded.sound_type,
                vibrate=excluded.vibrate
        """, (
            alarm["user_id"],
            alarm["wake_time"],
            1 if alarm["is_active"] else 0,
            json.dumps(alarm["days"]),
            alarm.get("sound_type", "apex"),
            1 if alarm.get("vibrate", True) else 0
        ))
        await db.commit()

async def save_target_db(target: dict):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("""
            INSERT INTO targets (user_id, date, target_amount, currency)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id, date) DO UPDATE SET
                target_amount=excluded.target_amount,
                currency=excluded.currency
        """, (
            target["user_id"],
            target["date"],
            target["target_amount"],
            target.get("currency", "USD")
        ))
        await db.commit()

async def get_all_active_alarms():
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM alarms WHERE is_active = 1") as cursor:
            rows = await cursor.fetchall()
            alarms = []
            for r in rows:
                alarms.append({
                    "user_id": r["user_id"],
                    "wake_time": r["wake_time"],
                    "is_active": bool(r["is_active"]),
                    "days": json.loads(r["days"] or "[0,1,2,3,4,5,6]"),
                    "sound_type": r["sound_type"],
                    "vibrate": bool(r["vibrate"]),
                })
            return alarms

async def sync_user_alarms_db(user_id: int, timezone: str, alarms: list, source: str = "all"):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        now = datetime.now().isoformat()
        if source == "all":
            await db.execute("DELETE FROM habit_alarms WHERE user_id = ?", (user_id,))
        else:
            await db.execute("DELETE FROM habit_alarms WHERE user_id = ? AND source = ?", (user_id, source))
        for a in alarms:
            alarm_id = f"{user_id}_{a['habit_id']}"
            await db.execute("""
                INSERT INTO habit_alarms (id, user_id, habit_id, title, time_str, is_active, timezone, updated_at, source)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    title=excluded.title,
                    time_str=excluded.time_str,
                    is_active=excluded.is_active,
                    timezone=excluded.timezone,
                    updated_at=excluded.updated_at,
                    source=excluded.source
            """, (
                alarm_id,
                user_id,
                a["habit_id"],
                a["title"],
                a["time_str"],
                1 if a.get("is_active", True) else 0,
                timezone or "Asia/Tashkent",
                now,
                source
            ))
        await db.commit()

async def get_all_active_habit_alarms():
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM habit_alarms WHERE is_active = 1") as cursor:
            rows = await cursor.fetchall()
            return [dict(r) for r in rows]

async def mark_habit_alarm_triggered(alarm_id: str, date_str: str):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("UPDATE habit_alarms SET last_triggered_date = ? WHERE id = ?", (date_str, alarm_id))
        await db.commit()

async def snooze_habit_alarm_db(alarm_id: str, new_time_str: str):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("UPDATE habit_alarms SET time_str = ?, last_triggered_date = '' WHERE id = ?", (new_time_str, alarm_id))
        await db.commit()

