"""
Mongo document shape + builder for the `locations` collection.
"""
from datetime import datetime, timezone
from typing import Optional


def new_location_doc(
    user_id: str, latitude: float, longitude: float, accuracy: Optional[float] = None
) -> dict:
    return {
        "user_id": user_id,
        "latitude": latitude,
        "longitude": longitude,
        "accuracy": accuracy,
        "timestamp": datetime.now(timezone.utc),
    }


def serialize_location(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id"),
        "latitude": doc.get("latitude"),
        "longitude": doc.get("longitude"),
        "accuracy": doc.get("accuracy"),
        "timestamp": doc.get("timestamp"),
    }
