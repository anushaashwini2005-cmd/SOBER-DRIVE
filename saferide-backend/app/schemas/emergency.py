from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class EmergencyContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=3, max_length=20)
    relationship: str = Field(..., min_length=1, max_length=50)


class EmergencyContactResponse(BaseModel):
    id: str
    user_id: str
    name: str
    phone: str
    relationship: str
    created_at: datetime
    updated_at: datetime


class NotifyRequest(BaseModel):
    safety_plan_id: str


class NotifyResponse(BaseModel):
    id: str
    user_id: str
    safety_plan_id: str
    contact_id: str
    message: str
    notification_created: bool
    demo: bool
    created_at: datetime
