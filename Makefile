.PHONY: backend frontend ingest setup-backend setup-frontend

# Start the backend API server
backend:
	cd backend && source .venv/bin/activate && uvicorn src.api:app --reload

# Start the frontend dev server
frontend:
	cd frontend && npm run dev

# Run ingestion
ingest:
	cd backend && source .venv/bin/activate && python -c "from src.ingest import ingest; print(f'{ingest()} chunks ingested')"

# First-time backend setup
setup-backend:
	cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# First-time frontend setup
setup-frontend:
	cd frontend && npm install
