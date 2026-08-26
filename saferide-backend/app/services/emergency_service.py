"""
Emergency contact + notification service.

IMPORTANT: notification delivery is simulated for this hackathon build.
We never claim an SMS/WhatsApp/call actually went out — every notification
document is stamped demo=True and notification_created=True, which the
frontend can render as "Simulated alert sent to <contact>".
"""
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.config.database import emergency_contacts_col, notifications_col
from app.config.settings import settings
from app.models.emergency_contact import (
    new_emergency_contact_doc,
    new_notification_doc,
    serialize_emergency_contact,
    serialize_notification,
)


def create_contact(user_id: str, name: str, phone: str, relationship: str) -> dict:
    doc = new_emergency_contact_doc(user_id, name, phone, relationship)
    result = emergency_contacts_col.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_emergency_contact(doc)


def get_contact(user_id: str) -> dict:
    """Returns the most recently created emergency contact for the user."""
    doc = emergency_contacts_col.find_one({"user_id": user_id}, sort=[("created_at", -1)])
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No emergency contact on file for this user",
        )
    return serialize_emergency_contact(doc)


def get_contact_by_id(user_id: str, contact_id: str) -> dict:
    try:
        oid = ObjectId(contact_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid contact id")
    doc = emergency_contacts_col.find_one({"_id": oid, "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emergency contact not found")
    return serialize_emergency_contact(doc)


def notify(user_id: str, safety_plan_id: str, contact_id: str, location: dict) -> dict:
    """
    Creates a (simulated) emergency notification record. Does NOT send a
    real SMS/call/WhatsApp message unless an external provider is wired up
    (none is, in this build) — DEMO_MODE governs the `demo` flag we return.
    """
    location_text = (
        f"near {location.get('lat')}, {location.get('lng')} "
        f"({location.get('source', 'unknown')})"
    )
    message = (
        f"SafeRide safety check-in was missed. Last known location: {location_text}. "
        f"This is a simulated alert for demo purposes."
    )
    doc = new_notification_doc(
        user_id=user_id,
        safety_plan_id=safety_plan_id,
        contact_id=contact_id,
        message=message,
        demo=settings.DEMO_MODE,
    )
    result = notifications_col.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_notification(doc)
