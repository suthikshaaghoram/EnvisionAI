from pydantic import BaseModel

class VoiceRequest(BaseModel):
    manifestation_id: int
    accent: str = "indian_english" # Options: indian_english, tamil, tamil_english

class VoiceResponse(BaseModel):
    audio_url: str
    message: str
