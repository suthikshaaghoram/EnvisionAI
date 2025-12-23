from pydantic import BaseModel
from typing import Optional, List

# Combined input schema from user requirements
# Input Schema: { "life_goals": "string", "strengths": "string", "challenges": "string", "desired_mindset": "string" }
# But prompt builder uses many more fields. 
# The user requirements text said: "Accepts user inputs: life goals, strengths, challenges, desired mindset".
# But the prompt builder I migrated uses the full profile.
# I will make a schema that accepts the full profile OR just the subset, 
# but for the specific "Input Schema" requirement I must support that minimal set.
# I will create a schema that supports the user's explicit Input Schema, but maybe optional other fields?
# The prompt builder requires specific keys. I will map the minimal inputs to the keys expected by prompt builder,
# or ask user for clarification. 
# "Accepts user inputs: life goals, strengths, challenges, desired mindset" -> This implies a specific flow.
# I will stick to the User Request explicit Input Schema for the API, 
# and maybe fill gaps with defaults or "Unknown" for the prompt builder.

class ManifestationCreate(BaseModel):
    life_goals: str
    strengths: str
    challenges: str
    desired_mindset: str
    
    # Optional fields to fully utilize the prompt builder if the frontend sends them
    preferred_name: Optional[str] = "Seeker"
    birth_date: Optional[str] = None
    birth_time: Optional[str] = None
    birth_place: Optional[str] = None
    nakshatra: Optional[str] = None
    lagna: Optional[str] = None
    star_sign: Optional[str] = None
    areas_of_improvement: Optional[str] = None # Map challenges to this
    greatest_achievement: Optional[str] = None
    recent_achievement: Optional[str] = None
    next_year_goals: Optional[str] = None
    legacy: Optional[str] = None
    manifestation_focus: Optional[str] = None

class ManifestationResponse(BaseModel):
    id: int
    manifestation_text: str
    created_at: str
    tokens_used: int
    cost: float
