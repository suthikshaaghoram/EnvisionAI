from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.api import auth
from app.models.user import User
from app.models.manifestation import Manifestation
from app.schemas.voice import VoiceRequest, VoiceResponse
from app.services.tts_service import TTSService

router = APIRouter()
tts_service = TTSService()

@router.post("/generate", response_model=VoiceResponse)
async def generate_voice(
    request: VoiceRequest,
    current_user: User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch manifestation
    result = await db.execute(
        select(Manifestation).where(
            Manifestation.id == request.manifestation_id,
            Manifestation.user_id == current_user.id
        )
    )
    manifestation = result.scalars().first()
    
    if not manifestation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Manifestation not found"
        )
    
    # Generate Audio
    try:
        audio_path = await tts_service.generate_audio(
            text=manifestation.manifestation_text,
            user_name=current_user.full_name or "user",
            accent=request.accent
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

    return VoiceResponse(
        audio_url=audio_path,
        message="Voice generation successful"
    )
