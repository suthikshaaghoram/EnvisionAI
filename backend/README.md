# EnvisionAI Backend API

A robust, modular FastAPI backend for the EnvisionAI SaaS platform.

## 🏗️ Architecture

This project follows a strict modular architecture:

```
backend/
├── app/
│   ├── main.py                 # Entry point
│   ├── core/                   # Config, Security
│   ├── api/                    # Route Handlers
│   ├── models/                 # DB Models
│   ├── schemas/                # Pydantic Schemas
│   ├── services/               # Business Logic (LLM, TTS, Vector)
│   ├── db/                     # Database Session
│   └── utils/                  # Helpers
├── .env.example
└── requirements.txt
```

## 🚀 Setup & Run

### 1. Prerequisites
- Python 3.11+
- PostgreSQL (running locally)
- Qdrant (local or cloud)

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your details:
```bash
cp .env.example .env
```
Update `POSTGRES_USER`, `POSTGRES_PASSWORD`, `HF_API_TOKEN` etc.

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Locally
```bash
uvicorn app.main:app --reload
```

## 🔌 API Documentation
Once running, visit:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🧪 Features
- **Auth**: JWT based registration & login.
- **Manifestation**: AI-powered personalized generation.
- **Voice**: TTS using Indian/Tamil accents.
- **History**: Async database storage.
- **Search**: Vector-based semantic search.
