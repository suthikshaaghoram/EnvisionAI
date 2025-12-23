from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.db.session import get_db
from app.api import auth
from app.models.user import User
from app.models.usage import Usage
from app.models.manifestation import Manifestation
from app.schemas.usage import UsageSummary

router = APIRouter()

@router.get("/summary", response_model=UsageSummary)
async def get_usage_summary(
    current_user: User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Total manifestations
    result_manifestations = await db.execute(
        select(func.count(Manifestation.id)).where(Manifestation.user_id == current_user.id)
    )
    total_manifestations = result_manifestations.scalar() or 0

    # Usage stats
    result_usage = await db.execute(
        select(
            func.count(Usage.id), 
            func.sum(Usage.duration_ms), 
            func.sum(Usage.cost)
        ).where(Usage.user_id == current_user.id)
    )
    total_calls, total_time, total_cost = result_usage.one()

    return UsageSummary(
        total_manifestations=total_manifestations,
        total_api_calls=total_calls or 0,
        total_generation_time=total_time or 0.0,
        total_cost=total_cost or 0.0
    )
