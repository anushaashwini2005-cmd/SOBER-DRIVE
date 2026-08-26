"""
Wallet service.

All money movement here is SIMULATED for the hackathon MVP — there is no
real payment gateway integration. Balances live only in MongoDB.
"""
from fastapi import HTTPException, status

from app.config.database import wallets_col, transactions_col
from app.models.wallet import (
    new_wallet_doc,
    new_transaction_doc,
    serialize_wallet,
    serialize_transaction,
)
from datetime import datetime, timezone


def _get_or_create_wallet(user_id: str) -> dict:
    doc = wallets_col.find_one({"user_id": user_id})
    if doc:
        return doc
    doc = new_wallet_doc(user_id)
    result = wallets_col.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


def get_wallet(user_id: str) -> dict:
    doc = _get_or_create_wallet(user_id)
    return serialize_wallet(doc)


def add_funds(user_id: str, amount: float) -> dict:
    doc = _get_or_create_wallet(user_id)
    new_balance = doc.get("balance", 0.0) + amount
    wallets_col.update_one(
        {"_id": doc["_id"]},
        {"$set": {"balance": new_balance, "updated_at": datetime.now(timezone.utc)}},
    )
    tx = new_transaction_doc(user_id, "ADD_FUNDS", amount, note="Simulated top-up")
    transactions_col.insert_one(tx)
    doc = wallets_col.find_one({"_id": doc["_id"]})
    return serialize_wallet(doc)


def authorize_amount(user_id: str, amount: float, note: str = "") -> dict:
    """
    Reserves `amount` against the wallet's available balance
    (available = balance - reserved). Raises 402-style error if insufficient.
    """
    doc = _get_or_create_wallet(user_id)
    balance = doc.get("balance", 0.0)
    reserved = doc.get("reserved", 0.0)
    available = balance - reserved

    if amount > available:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=(
                f"Insufficient wallet balance: available ₹{available:.2f}, "
                f"requested ₹{amount:.2f}"
            ),
        )

    new_reserved = reserved + amount
    wallets_col.update_one(
        {"_id": doc["_id"]},
        {"$set": {"reserved": new_reserved, "updated_at": datetime.now(timezone.utc)}},
    )
    tx = new_transaction_doc(user_id, "AUTHORIZE", amount, note=note or "Ride amount reserved")
    transactions_col.insert_one(tx)
    doc = wallets_col.find_one({"_id": doc["_id"]})
    return serialize_wallet(doc)


def get_transactions(user_id: str) -> list:
    cursor = transactions_col.find({"user_id": user_id}).sort("created_at", -1)
    return [serialize_transaction(doc) for doc in cursor]
