"""Read documents from /docs, chunk them, embed them, and store in ChromaDB."""

from pathlib import Path

import chromadb
import ollama

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"
CHROMA_DIR = Path(__file__).resolve().parent.parent / "chroma_db"
COLLECTION_NAME = "documents"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
EMBEDDING_MODEL = "nomic-embed-text"


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Generate embeddings using Ollama."""
    response = ollama.embed(model=EMBEDDING_MODEL, input=texts)
    return response.embeddings


def read_documents() -> list[dict]:
    """Read all .txt and .md files from the docs directory."""
    docs = []
    for file_path in sorted(DOCS_DIR.iterdir()):
        if file_path.suffix in (".txt", ".md"):
            text = file_path.read_text(encoding="utf-8").strip()
            if text:
                docs.append({"filename": file_path.name, "text": text})
    return docs


def chunk_text(text: str, filename: str) -> list[dict]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end]
        chunks.append({
            "text": chunk,
            "filename": filename,
            "start": start,
        })
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks


def ingest() -> int:
    """Run the full ingestion pipeline. Returns the number of chunks stored."""
    docs = read_documents()
    if not docs:
        return 0

    all_chunks = []
    for doc in docs:
        all_chunks.extend(chunk_text(doc["text"], doc["filename"]))

    texts = [c["text"] for c in all_chunks]
    embeddings = embed_texts(texts)

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    existing = client.list_collections()
    if COLLECTION_NAME in [c.name for c in existing]:
        client.delete_collection(COLLECTION_NAME)

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    ids = [f"{c['filename']}_{c['start']}" for c in all_chunks]
    metadatas = [{"filename": c["filename"], "start": c["start"]} for c in all_chunks]

    collection.add(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(all_chunks)
