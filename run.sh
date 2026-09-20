#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "🔥 Starting Apex Day Planner & Revenue TMA Server..."

# Build frontend if not built
if [ ! -d "backend/static" ] || [ ! -f "backend/static/index.html" ]; then
    echo "📦 Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
fi

cd backend
source venv/bin/activate
exec python main.py
