"""
Ride service.

There is no real dispatch/driver network here — this is a mock SafeRide
driver used purely to demonstrate the end-to-end escalation flow.
"""
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.config.database import rides_col
from app.models.ride import new_ride_doc, mock_driver_doc, serialize_ride
from app.utils.constants import RideStatus


def _get_ride_or_404(ride_id: str, user_id: str = None) -> dict:
    try:
        oid = ObjectId(ride_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ride id")
    query = {"_id": oid}
    if user_id:
        query["user_id"] = user_id
    doc = rides_col.find_one(query)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ride not found")
    return doc


def create_ride_request(user_id: str, safety_plan_id: str, pickup: dict, destination: dict) -> dict:
    doc = new_ride_doc(user_id, safety_plan_id, pickup, destination)
    result = rides_col.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_ride(doc)


def get_current_ride(user_id: str) -> dict:
    doc = rides_col.find_one(
        {"user_id": user_id, "status": {"$nin": [RideStatus.COMPLETED, RideStatus.CANCELLED]}},
        sort=[("created_at", -1)],
    )
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active ride")
    return serialize_ride(doc)


def accept_ride(ride_id: str, user_id: str) -> dict:
    doc = _get_ride_or_404(ride_id, user_id)
    if doc["status"] != RideStatus.REQUESTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot accept a ride in status {doc['status']}",
        )
    driver = mock_driver_doc()
    rides_col.update_one(
        {"_id": doc["_id"]},
        {
            "$set": {
                "status": RideStatus.DRIVER_ACCEPTED,
                "driver": driver,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    doc = rides_col.find_one({"_id": doc["_id"]})
    return serialize_ride(doc)


def start_ride(ride_id: str, user_id: str) -> dict:
    doc = _get_ride_or_404(ride_id, user_id)
    if doc["status"] not in (RideStatus.DRIVER_ACCEPTED, RideStatus.DRIVER_EN_ROUTE):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot start a ride in status {doc['status']}",
        )
    rides_col.update_one(
        {"_id": doc["_id"]},
        {"$set": {"status": RideStatus.STARTED, "updated_at": datetime.now(timezone.utc)}},
    )
    doc = rides_col.find_one({"_id": doc["_id"]})
    return serialize_ride(doc)


def complete_ride(ride_id: str, user_id: str) -> dict:
    doc = _get_ride_or_404(ride_id, user_id)
    if doc["status"] != RideStatus.STARTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot complete a ride in status {doc['status']}",
        )
    rides_col.update_one(
        {"_id": doc["_id"]},
        {"$set": {"status": RideStatus.COMPLETED, "updated_at": datetime.now(timezone.utc)}},
    )
    doc = rides_col.find_one({"_id": doc["_id"]})
    return serialize_ride(doc)
