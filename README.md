# ask-joseph

An AI-powered interactive resume. Visitors see a responsive, styled resume and can ask natural language questions about my professional experience — answered in real time using a local RAG pipeline.

## How It Works

A markdown file is the single source of truth. The backend chunks it by section, embeds it into a local vector database, and retrieves relevant context to answer questions using a local LLM. The frontend renders the markdown as a two-column resume layout with a chat interface.

## Tech Stack

- **Frontend:** React, TypeScript, Chakra UI, Vite
- **Backend:** Python, FastAPI, ChromaDB, Ollama (llama3.2)
- **RAG:** Section-based chunking, cosine similarity retrieval, grounded generation

## Learn More

- [Backend](./backend/README.md) — API, ingestion pipeline, and RAG architecture
- [Frontend](./frontend/README.md) — React app setup and configuration
