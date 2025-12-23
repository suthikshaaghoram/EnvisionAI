from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserProfile(BaseModel):
    preferred_name: str
    birth_date: str 
    nakshatra: str
    birth_time: str
    birth_place: str
    lagna: str
    star_sign: Optional[str] = None
    strengths: str
    areas_of_improvement: str
    greatest_achievement: str
    recent_achievement: str
    next_year_goals: str
    life_goals: str
    legacy: str
    manifestation_focus: str

class ManifestationResponse(BaseModel):
    manifestation_text: str
    audio_path: Optional[str] = None
    qdrant_point_id: Optional[str] = None
    message: str = "Manifestation generated successfully"
