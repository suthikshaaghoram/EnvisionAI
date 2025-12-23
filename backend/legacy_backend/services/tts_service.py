import edge_tts
import uuid
import os

# Create audio directory if it doesn't exist
AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

class TTSService:
    def __init__(self):
        # Using Tamil Indian Neural voice for that specific local accent
        # Options: ta-IN-PallaviNeural (Female), ta-IN-ValluvarNeural (Male)
        self.voice = "ta-IN-PallaviNeural" 
        self.rate = "-5%" # Slightly slower for "Moderate" speaking rate
        self.pitch = "+0Hz" # Medium pitch

    async def generate_audio(self, text: str, user_name: str = "user") -> str:
        """
        Generates audio from text using edge-tts and returns the file path.
        Filename format: {user_name}_{timestamp}.mp3
        """
        # Sanitize user name
        safe_name = "".join([c for c in user_name if c.isalnum() or c in (' ', '_', '-')]).strip()
        safe_name = safe_name.replace(" ", "_")
        
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        filename = f"{safe_name}_{timestamp}.mp3"
        file_path = os.path.join(AUDIO_DIR, filename)

        communicate = edge_tts.Communicate(text, self.voice, rate=self.rate, pitch=self.pitch)
        await communicate.save(file_path)

        return file_path

if __name__ == "__main__":
    import asyncio
    async def test():
        tts = TTSService()
        path = await tts.generate_audio("Hello, this is a test of the manifestation system.")
        print(f"Generated at: {path}")

    asyncio.run(test())
