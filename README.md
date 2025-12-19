# AffirmAI - AI-Powered Manifestation Generator

AffirmAI is a FastAPI-based backend that generates personalized manifestation passages using Hugging Face's Inference API and converts them to speech using `edge-tts` (Indian English).

## Tech Stack
- **Framework**: FastAPI
- **LLM**: Hugging Face Inference API (Mistral-7B-Instruct)
- **TTS**: edge-tts (Neural Indian English)
- **Validation**: Pydantic

## Setup

1.  **Clone the repository**
2.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure Environment**
    - Copy `.env.example` to `.env`
    - Add your Hugging Face API Token: `HF_API_TOKEN=hf_...`

## Running the Server

```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.
Swagger UI: `http://localhost:8000/docs`.

## API Usage

**POST** `/generate-manifestation`

**Body**:
```json
{
  "preferred_name": "Jane",
  "birth_date": "1995-05-15",
  "star_sign": "Taurus",
  "strengths": "Persistence",
  "areas_of_improvement": "Public speaking",
  "greatest_achievement": "Ran a marathon",
  "recent_achievement": "Learned React",
  "next_year_goals": "Launch a startup",
  "life_goals": "Financial freedom",
  "legacy": "Empowering women",
  "manifestation_focus": "Confidence"
}
```
