import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "8985992778:AAHx829I6VBKJTxE5ma6kJ9EbCmITcgHF68")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")
DATABASE_PATH = os.getenv("DATABASE_PATH", "planner.db")
# Public URL for WebApp (ngrok / render / local)
WEBAPP_URL = os.getenv("WEBAPP_URL", "http://localhost:8000")
