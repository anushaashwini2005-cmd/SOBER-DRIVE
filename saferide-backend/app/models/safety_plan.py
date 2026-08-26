"""
Mongo document shape + builder for the `safety_plans` collection.
"""
from datetime import datetime, timezone
from typing import Optional

from app.utils.constants import SafetyStatus


def new_safety_plan_doc(
    user_id: str,
    pickup: dict,
    destination: dict,
    timer_minutes: float,
    emergency_contact_id: Optional[str],
    wallet_amount: float,
    started_at: datetime,
    expires_at: datetime,
) -> dict:
    now = datetime.now(timezone.utc)
    return {
        "user_id": user_id,
        "pickup": pickup,               # {"label": str, "lat": float, "lng": float}
        "destination": destination,     # {"label": str, "lat": float, "lng": float}
        "timer_minutes": timer_minutes,
        "started_at": started_at,
        "expires_at": expires_at,
        "status": SafetyStatus.ACTIVE,
        "emergency_contact_id": emergency_contact_id,
        "wallet_amount": wallet_amount,
        "last_known_location": None,
        "created_at": now,
        "updated_at": now,
    }


def serialize_safety_plan(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id"),
        "pickup": doc.get("pickup"),
        "destination": doc.get("destination"),
        "timer_minutes": doc.get("timer_minutes"),
        "started_at": doc.get("started_at"),
        "expires_at": doc.get("expires_at"),
        "status": doc.get("status"),
        "emergency_contact_id": doc.get("emergency_contact_id"),
        "wallet_amount": doc.get("wallet_amount"),
        "last_known_location": doc.get("last_known_location"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }
