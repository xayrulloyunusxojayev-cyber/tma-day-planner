import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "8758633147:AAHUeHdOuj5nKxbdNuEpZRv-3wGX6wWY96w")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")
DATABASE_PATH = os.getenv("DATABASE_PATH", "planner.db")
# Public URL for WebApp (ngrok / render / local)
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://tma-day-planner.onrender.com")

