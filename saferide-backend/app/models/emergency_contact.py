"""
Mongo document shape + builder for the `emergency_contacts` collection.
"""
from datetime import datetime, timezone


def new_emergency_contact_doc(user_id: str, name: str, phone: str, relationship: str) -> dict:
    now = datetime.now(timezone.utc)
    return {
        "user_id": user_id,
        "name": name,
        "phone": phone,
        "relationship": relationship,
        "created_at": now,
        "updated_at": now,
    }


def serialize_emergency_contact(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id"),
        "name": doc.get("name"),
        "phone": doc.get("phone"),
        "relationship": doc.get("relationship"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }


def new_notification_doc(
    user_id: str, safety_plan_id: str, contact_id: str, message: str, demo: bool
) -> dict:
    return {
        "user_id": user_id,
        "safety_plan_id": safety_plan_id,
        "contact_id": contact_id,
        "message": message,
        "notification_created": True,
        "demo": demo,
        "created_at": datetime.now(timezone.utc),
    }


def serialize_notification(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id"),
        "safety_plan_id": doc.get("safety_plan_id"),
        "contact_id": doc.get("contact_id"),
        "message": doc.get("message"),
        "notification_created": doc.get("notification_created"),
        "demo": doc.get("demo"),
        "created_at": doc.get("created_at"),
    }
