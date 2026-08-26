"""
Mongo document shapes + builders for the `wallets` and `transactions` collections.
"""
from datetime import datetime, timezone


def new_wallet_doc(user_id: str) -> dict:
    now = datetime.now(timezone.utc)
    return {
        "user_id": user_id,
        "balance": 0.0,
        "reserved": 0.0,
        "created_at": now,
        "updated_at": now,
    }


def serialize_wallet(doc: dict) -> dict:
    balance = doc.get("balance", 0.0)
    reserved = doc.get("reserved", 0.0)
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id"),
        "balance": balance,
        "reserved": reserved,
        "available": round(balance - reserved, 2),
        "updated_at": doc.get("updated_at"),
    }


def new_transaction_doc(user_id: str, tx_type: str, amount: float, note: str = "") -> dict:
    return {
        "user_id": user_id,
        "type": tx_type,  # "ADD_FUNDS" | "AUTHORIZE" | "CAPTURE" | "RELEASE"
        "amount": amount,
        "note": note,
        "simulated": True,
        "created_at": datetime.now(timezone.utc),
    }


def serialize_transaction(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id"),
        "type": doc.get("type"),
        "amount": doc.get("amount"),
        "note": doc.get("note"),
        "simulated": doc.get("simulated", True),
        "created_at": doc.get("created_at"),
    }
