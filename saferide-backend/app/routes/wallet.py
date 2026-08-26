from fastapi import APIRouter, Depends

from app.schemas.wallet import (
    AddFundsRequest,
    AuthorizeRequest,
    WalletResponse,
    TransactionListResponse,
)
from app.services import wallet_service
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/wallet", tags=["wallet"])


@router.get("", response_model=WalletResponse)
def get_wallet(user_id: str = Depends(get_current_user_id)):
    result = wallet_service.get_wallet(user_id)
    return WalletResponse(**result)


@router.post("/add", response_model=WalletResponse)
def add_funds(payload: AddFundsRequest, user_id: str = Depends(get_current_user_id)):
    result = wallet_service.add_funds(user_id, payload.amount)
    return WalletResponse(**result)


@router.post("/authorize", response_model=WalletResponse)
def authorize(payload: AuthorizeRequest, user_id: str = Depends(get_current_user_id)):
    result = wallet_service.authorize_amount(
        user_id, payload.amount, note=f"Manual authorization for plan {payload.safety_plan_id}"
    )
    return WalletResponse(**result)


@router.get("/transactions", response_model=TransactionListResponse)
def transactions(user_id: str = Depends(get_current_user_id)):
    txs = wallet_service.get_transactions(user_id)
    return TransactionListResponse(transactions=txs)
