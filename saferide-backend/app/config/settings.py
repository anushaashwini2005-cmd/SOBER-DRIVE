"""
Application settings, loaded from environment variables via python-dotenv.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Mongo
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "saferide")

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "CHANGE_ME_DEV_ONLY_SECRET")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))  # 24h

    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

    # Demo mode
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    DEMO_TIMER_SECONDS: int = int(os.getenv("DEMO_TIMER_SECONDS", "5"))

    # Default safety timer (used when DEMO_MODE is false and client doesn't specify)
    DEFAULT_TIMER_MINUTES: int = int(os.getenv("DEFAULT_TIMER_MINUTES", "30"))


settings = Settings()
