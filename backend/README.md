# Local Document AI Assistant

A 100% local, free RAG (Retrieval-Augmented Generation) system that lets you ask questions about your own documents from the terminal. Nothing leaves your machine.

## Prerequisites

Install [Ollama](https://ollama.com) (free, open source). After installing, make sure it's running:

```bash
ollama --version
```

## Setup

```bash
# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Usage

```bash
python -m src.cli
```

Inside the CLI:

- Type `ingest` to index all `.txt` and `.md` files in the `docs/` folder.
- Type any question to search your documents and get an AI-generated answer.
- Type `quit` to exit.

On first run, the app will auto-pull the `llama3.2` model (~2GB) and the embedding model (~80MB). After that, everything runs instantly from local cache.

## Adding Documents

Drop `.txt` or `.md` files into the `docs/` directory, then run `ingest` in the CLI to re-index.

## Architecture

1. **Ingest** (`src/ingest.py`): Reads files, splits into overlapping chunks, generates embeddings with `all-MiniLM-L6-v2` (local), stores in ChromaDB.
2. **Retrieve** (`src/retriever.py`): Converts your question to an embedding, finds the closest chunks via cosine similarity.
3. **Generate** (`src/generator.py`): Sends retrieved context + your question to Llama 3.2 running locally via Ollama.

## Stack

- **Ollama** + **Llama 3.2**: Local LLM (no API key, no network)
- **sentence-transformers**: Local embedding generation
- **ChromaDB**: Local vector database (persisted to disk)
- **Rich**: Terminal UI formatting
