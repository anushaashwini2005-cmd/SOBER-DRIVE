"""
Location service.

Handles periodic GPS updates from the client and retrieval of the most
recent known location. Note what this does NOT do: it never assumes a
phone keeps reporting location after it disconnects or powers off. If no
recent location exists, callers fall back to the safety plan's confirmed
pickup point (see get_last_known_or_fallback).
"""
from fastapi import HTTPException, status

from app.config.database import locations_col
from app.models.location import new_location_doc, serialize_location


def record_location(user_id: str, latitude: float, longitude: float, accuracy: float = None) -> dict:
    doc = new_location_doc(user_id, latitude, longitude, accuracy)
    result = locations_col.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_location(doc)


def get_current_location(user_id: str) -> dict:
    doc = locations_col.find_one({"user_id": user_id}, sort=[("timestamp", -1)])
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No location has been reported for this user yet",
        )
    return serialize_location(doc)


def get_last_known_or_fallback(user_id: str, pickup: dict) -> dict:
    """
    Used during escalation. Returns the most recent GPS point if one exists,
    otherwise falls back to the pre-confirmed pickup location from the
    safety plan. This is the only source of "location" once a phone has
    disconnected — we never claim to still be receiving live GPS.
    """
    doc = locations_col.find_one({"user_id": user_id}, sort=[("timestamp", -1)])
    if doc:
        return {
            "label": None,
            "lat": doc["latitude"],
            "lng": doc["longitude"],
            "source": "gps",
            "timestamp": doc["timestamp"],
        }
    return {
        "label": pickup.get("label"),
        "lat": pickup.get("lat"),
        "lng": pickup.get("lng"),
        "source": "pickup_fallback",
        "timestamp": None,
    }
