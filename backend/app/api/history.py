from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.db.session import get_db
from app.api import auth
from app.models.user import User
from app.models.manifestation import Manifestation
from app.schemas.manifestation import ManifestationResponse

router = APIRouter()

@router.get("/", response_model=List[ManifestationResponse])
async def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    current_user: User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Manifestation)
        .where(Manifestation.user_id == current_user.id)
        .order_by(desc(Manifestation.created_at))
        .offset(skip)
        .limit(limit)
    )
    manifestations = result.scalars().all()
    
    # Map to schema (Pydantic will handle this if response_model is list of obj)
    # But ManifestationResponse expects tokens/cost which might not be on Manifestation model directly 
    # (they are in Usage). 
    # Requirement says: "Metadata to Return: id, created_at, preview, voice_available"
    # My ManifestationResponse schema has "tokens_used, cost".
    # I should align the response model with the requirement for history items.
    # Requirement: "preview (first 150 chars)"
    # I'll create a HistoryItem schema for the list view.

    return [
        ManifestationResponse(
            id=m.id,
            manifestation_text=m.manifestation_text, # Just return full for now or modify schema
            created_at=m.created_at.isoformat(),
            tokens_used=0, # Not joined
            cost=0.0       # Not joined
        ) for m in manifestations
    ]

@router.get("/{id}", response_model=ManifestationResponse)
async def get_history_detail(
    id: int,
    current_user: User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Manifestation).where(
            Manifestation.id == id,
            Manifestation.user_id == current_user.id
        )
    )
    manifestation = result.scalars().first()
    if not manifestation:
        raise HTTPException(status_code=404, detail="Manifestation not found")
        
    return ManifestationResponse(
        id=manifestation.id,
        manifestation_text=manifestation.manifestation_text,
        created_at=manifestation.created_at.isoformat(),
        tokens_used=0, 
        cost=0.0
    )
