"""
Mongo document shape + builder for the `rides` collection.
"""
from datetime import datetime, timezone

from app.utils.constants import MOCK_DRIVER, RideStatus


def new_ride_doc(user_id: str, safety_plan_id: str, pickup: dict, destination: dict) -> dict:
    now = datetime.now(timezone.utc)
    return {
        "user_id": user_id,
        "safety_plan_id": safety_plan_id,
        "pickup": pickup,
        "destination": destination,
        "status": RideStatus.REQUESTED,
        "driver": None,
        "created_at": now,
        "updated_at": now,
    }


def mock_driver_doc() -> dict:
    return dict(MOCK_DRIVER)


def serialize_ride(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id"),
        "safety_plan_id": doc.get("safety_plan_id"),
        "pickup": doc.get("pickup"),
        "destination": doc.get("destination"),
        "status": doc.get("status"),
        "driver": doc.get("driver"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }
