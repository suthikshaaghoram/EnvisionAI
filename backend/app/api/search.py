from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette.concurrency import run_in_threadpool

from app.db.session import get_db
from app.api import auth
from app.models.user import User
from app.models.manifestation import Manifestation
from app.services.vector_store import VectorStore

router = APIRouter()
vector_store = VectorStore()

class SearchQuery(BaseModel):
    query: str

class SearchResult(BaseModel):
    id: int
    text: str
    preview: str
    score: float

@router.post("/", response_model=List[SearchResult])
async def search_manifestations(
    search_in: SearchQuery,
    current_user: User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Semantic search in Vector DB
    # Filter by user_id in Qdrant? 
    # My vector store impl doesn't support metadata filtering yet, 
    # so I'll search and then verify ownership or filter results.
    # Proper RAG usually involves filtering in the vector DB query.
    # For now, I'll fetch results and filter.
    
    results = await run_in_threadpool(
        vector_store.search_manifestations, 
        search_in.query, 
        limit=10 
    )

    response_items = []
    
    for hit in results:
        # Check ownership from specific metadata if I stored user_id
        payload = hit.payload
        if payload.get("user_id") == current_user.id:
            # It's a match.
            # Convert text preview
            text = payload.get("text", "")
            preview = text[:150] + "..." if len(text) > 150 else text
            
            # Get DB ID if needed, from payload "manifestation_id"
            m_id = payload.get("manifestation_id")
            
            response_items.append(SearchResult(
                id=int(m_id) if m_id else 0,
                text=text,
                preview=preview,
                score=hit.score
            ))
    
    return response_items
