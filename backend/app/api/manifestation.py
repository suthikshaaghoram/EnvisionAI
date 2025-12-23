import time
import asyncio
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from app.db.session import get_db
from app.api import auth
from app.models.user import User
from app.models.manifestation import Manifestation
from app.models.usage import Usage
from app.schemas.manifestation import ManifestationCreate, ManifestationResponse
from app.services import llm_service
from app.services.vector_store import VectorStore
from app.utils.cost_tracker import CostTracker

router = APIRouter()
vector_store = VectorStore()

@router.post("/generate", response_model=ManifestationResponse)
async def generate_manifestation_endpoint(
    request: ManifestationCreate,
    current_user: User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    start_time = time.time()

    # 1. Prepare Profile
    # Map request fields to what prompt builder expects
    profile = {
        "preferred_name": request.preferred_name,
        "birth_date": request.birth_date or "Unknown",
        "birth_time": request.birth_time or "Unknown",
        "birth_place": request.birth_place or "Unknown",
        "nakshatra": request.nakshatra,
        "lagna": request.lagna,
        "star_sign": request.star_sign,
        "strengths": request.strengths,
        "areas_of_improvement": request.challenges, # Mapping challenges
        "greatest_achievement": request.greatest_achievement or "Unknown",
        "recent_achievement": request.recent_achievement or "Unknown",
        "next_year_goals": request.next_year_goals or "Unknown",
        "life_goals": request.life_goals,
        "legacy": request.legacy or "Unknown",
        "manifestation_focus": request.desired_mindset # Mapping mindset
    }

    # 2. Call LLM (Blocking call run in threadpool)
    try:
        manifestation_text = await run_in_threadpool(
            llm_service.generate_manifestation, 
            profile
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    duration_ms = (time.time() - start_time) * 1000

    # 3. Usage & Cost
    tokens = CostTracker.estimate_tokens(manifestation_text)
    cost = CostTracker.calculate_cost(tokens)

    # 4. Store in DB
    db_manifestation = Manifestation(
        user_id=current_user.id,
        manifestation_text=manifestation_text
    )
    db.add(db_manifestation)
    
    # usage tracking
    db_usage = Usage(
        user_id=current_user.id,
        endpoint="/manifestation/generate",
        tokens_used=tokens,
        cost=cost,
        duration_ms=duration_ms
    )
    db.add(db_usage)
    
    await db.commit()
    await db.refresh(db_manifestation)

    # 5. Store in Vector DB (Background task or await/threadpool)
    # Using run_in_threadpool because vector store uses sync client
    metadata = {
        "user_id": current_user.id,
        "manifestation_id": db_manifestation.id
    }
    await run_in_threadpool(
        vector_store.store_manifestation, 
        manifestation_text, 
        metadata
    )

    return ManifestationResponse(
        id=db_manifestation.id,
        manifestation_text=manifestation_text,
        created_at=db_manifestation.created_at.isoformat(),
        tokens_used=tokens,
        cost=cost
    )
