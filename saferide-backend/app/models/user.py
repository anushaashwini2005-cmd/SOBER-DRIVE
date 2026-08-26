"""
Mongo document shape + builder for the `users` collection.
These are plain dict builders (not ODM models) since we talk to Mongo
directly via PyMongo. Pydantic request/response shapes live in schemas/.
"""
from datetime import datetime, timezone
from typing import Optional


def new_user_doc(name: str, email: str, hashed_password: str, phone: Optional[str] = None) -> dict:
    now = datetime.now(timezone.utc)
    return {
        "name": name,
        "email": email.lower().strip(),
        "hashed_password": hashed_password,
        "phone": phone,
        "created_at": now,
        "updated_at": now,
    }


def serialize_user(doc: dict) -> dict:
    """Convert a Mongo user document into a JSON-safe, public-facing dict."""
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name"),
        "email": doc.get("email"),
        "phone": doc.get("phone"),
        "created_at": doc.get("created_at"),
    }
