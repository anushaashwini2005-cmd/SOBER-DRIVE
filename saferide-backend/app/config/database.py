"""
MongoDB connection using PyMongo. A single client is created at import time
and reused across the app (PyMongo's client is thread-safe and pools
connections internally, so we don't need to open/close per-request).
"""
from pymongo import MongoClient, ASCENDING
from pymongo.database import Database

from app.config.settings import settings

_client: MongoClient = MongoClient(settings.MONGO_URI)
db: Database = _client[settings.DB_NAME]

# Collections
users_col = db["users"]
safety_plans_col = db["safety_plans"]
locations_col = db["locations"]
emergency_contacts_col = db["emergency_contacts"]
wallets_col = db["wallets"]
transactions_col = db["transactions"]
rides_col = db["rides"]
notifications_col = db["notifications"]


def init_indexes() -> None:
    """Create indexes needed for correctness/performance. Safe to call repeatedly."""
    users_col.create_index([("email", ASCENDING)], unique=True)

    safety_plans_col.create_index([("user_id", ASCENDING)])
    safety_plans_col.create_index([("status", ASCENDING)])
    safety_plans_col.create_index([("expires_at", ASCENDING)])

    locations_col.create_index([("user_id", ASCENDING), ("timestamp", ASCENDING)])

    emergency_contacts_col.create_index([("user_id", ASCENDING)])

    wallets_col.create_index([("user_id", ASCENDING)], unique=True)
    transactions_col.create_index([("user_id", ASCENDING), ("created_at", ASCENDING)])

    rides_col.create_index([("user_id", ASCENDING)])
    rides_col.create_index([("safety_plan_id", ASCENDING)])

    notifications_col.create_index([("user_id", ASCENDING)])


def ping() -> bool:
    try:
        db.command("ping")
        return True
    except Exception:
        return False
