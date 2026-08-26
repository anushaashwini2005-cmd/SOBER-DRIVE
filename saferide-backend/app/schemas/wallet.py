from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class AddFundsRequest(BaseModel):
    amount: float = Field(..., gt=0, le=100000)


class AuthorizeRequest(BaseModel):
    amount: float = Field(..., gt=0)
    safety_plan_id: str


class WalletResponse(BaseModel):
    id: str
    user_id: str
    balance: float
    reserved: float
    available: float
    updated_at: datetime


class TransactionResponse(BaseModel):
    id: str
    user_id: str
    type: str
    amount: float
    note: str
    simulated: bool
    created_at: datetime


class TransactionListResponse(BaseModel):
    transactions: List[TransactionResponse]
