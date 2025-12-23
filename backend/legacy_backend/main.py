from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

from services.models import UserProfile, ManifestationResponse
from services.llm_service import generate_manifestation
from services.tts_service import TTSService

# Load environment variables
load_dotenv()

app = FastAPI(
    title="EnvisionAI",
    description="AI-powered Manifestation Generator",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for audio files
os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "Welcome to EnvisionAI API. Use /docs for Swagger UI."}

from services.vector_service import VectorService

# Initialize Vector Service (lazy load or global)
vector_service = VectorService()

@app.post("/generate-manifestation", response_model=ManifestationResponse)
async def create_manifestation(profile: UserProfile):
    try:
        # 1. RAG: Search for similar manifestations / context
        # We search based on their specific focus or goals to find aligned wisdom
        query_text = f"{profile.manifestation_focus} {profile.life_goals}"
        search_results = vector_service.search_manifestations(query_text, limit=2)
        
        rag_context = ""
        if search_results:
            rag_context = "\n".join([f"- {res.payload.get('text', '')[:300]}..." for res in search_results])

        # 2. Generate Text (with RAG context)
        manifestation_text = generate_manifestation(profile.dict(), rag_context=rag_context)
        
        # 3. Store in Vector DB
        metadata = profile.dict()
        # Remove potentially sensitive or large fields if needed, but for now storing all
        point_id = vector_service.store_manifestation(manifestation_text, metadata)

        # 3. Generate Audio
        tts_service = TTSService()
        audio_file_path = await tts_service.generate_audio(manifestation_text, profile.preferred_name)
        
        # Construct public URL (assuming local dev for now)
        # In production, this would be a proper storage URL or handled by detailed config
        # For now, we return the relative path to be served by StaticFiles
        relative_path = audio_file_path # e.g. static/audio/Name_Time.mp3
        
        return ManifestationResponse(
            manifestation_text=manifestation_text,
            audio_path=f"/{relative_path}",
            qdrant_point_id=point_id,
            message="Manifestation generated successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
