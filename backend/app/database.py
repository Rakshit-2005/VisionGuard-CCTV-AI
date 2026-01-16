from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URI, DATABASE_NAME

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]

async def check_db_connection():
    try:
        await db.command("ping")
        return True
    except Exception as e:
        print("MongoDB connection error:", e)
        return False
