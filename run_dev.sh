#!/bin/bash

# EnvisionAI Startup Script

echo "🚀 Starting EnvisionAI Development Environment..."

# 1. Check/Install Python Dependencies
echo "Ensure backend dependencies are installed..."
# (We already did this, but good to ensure env is valid)
if [ ! -d "backend/venv" ]; then
    echo "Backend venv missing. Creating..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# 2. Check Postgres
if ! lsof -i :5432 > /dev/null; then
    echo "⚠️  WARNING: Postgres (port 5432) is not detected."
    echo "The backend requires a running Postgres database."
    echo "If you have Homebrew installed, you might try:"
    echo "  brew services start postgresql"
    echo "Or ensure your Postgres server is running."
    echo "Press Enter to continue anyway, or Ctrl+C to abort."
    # We don't want to block non-interactively if user runs this blindly, but 
    # for a dev script usage it's fine.
    # read -t 5 || true  # wait 5 seconds or continue
fi

# 3. Start Servers
echo "Starting Backend & Frontend..."

# Function to kill all background jobs on exit
trap 'kill $(jobs -p)' EXIT

# Backend
(
    cd backend
    source venv/bin/activate
    echo "Starting Backend on http://localhost:8000..."
    uvicorn app.main:app --reload
) &
BACKEND_PID=$!

# Frontend
(
    cd frontend
    # ensure npm install if node_modules missing
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    echo "Starting Frontend on http://localhost:5173..."
    npm run dev
) &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

wait
