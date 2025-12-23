import edge_tts
import os
from datetime import datetime

# Define absolute path for static audio, assumed relative to project root
AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../static/audio"))
os.makedirs(AUDIO_DIR, exist_ok=True)

class TTSService:
    def __init__(self):
        # Default voice settings
        self.voice = "ta-IN-PallaviNeural" 
        self.rate = "-5%" 
        self.pitch = "+0Hz"

    async def generate_audio(self, text: str, user_name: str = "user", accent: str = "tamil") -> str:
        """
        Generates audio from text using edge-tts.
        """
        voice = self.voice
        if accent == "indian_english":
            voice = "en-IN-NeerjaExpressiveNeural"
        elif accent == "tamil_english":
            voice = "ta-IN-ValluvarNeural" # Male option as alternate

        safe_name = "".join([c for c in user_name if c.isalnum() or c in (' ', '_', '-')]).strip()
        safe_name = safe_name.replace(" ", "_")
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{safe_name}_{timestamp}.mp3"
        file_path = os.path.join(AUDIO_DIR, filename)

        communicate = edge_tts.Communicate(text, voice, rate=self.rate, pitch=self.pitch)
        await communicate.save(file_path)

        # Return relative path for frontend - /static/audio/...
        return f"/static/audio/{filename}"
