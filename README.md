# ask-joseph

An AI-powered interactive resume. Visitors see a responsive, styled resume and can ask natural language questions about my professional experience — answered in real time using a local RAG pipeline.

## How It Works

A markdown file is the single source of truth. The backend chunks it by section, embeds it into a local vector database, and retrieves relevant context to answer questions using a local LLM. The frontend renders the markdown as a two-column resume layout with a chat interface.

## Tech Stack

- **Frontend:** React, TypeScript, Chakra UI, Vite
- **Backend:** Python, FastAPI, ChromaDB, Ollama (llama3.2)
- **RAG:** Section-based chunking, cosine similarity retrieval, grounded generation

## Getting Started

### Prerequisites

```bash
# Ollama (local LLM runtime) — pulls models on first use
brew install ollama
ollama serve

# Python 3.11+
brew install python@3.11

# Node.js 18+
brew install node
```

### Setup

```bash
make setup-backend
make setup-frontend
```

### Run

```bash
# First time: ingest the resume into the vector database
make ingest

# Start both servers (in separate terminals)
make backend   # API on http://localhost:8000
make frontend  # App on http://localhost:5173
```

## Learn More

- [Backend](./backend/README.md) — API, ingestion pipeline, and RAG architecture
- [Frontend](./frontend/README.md) — React app setup and configuration
