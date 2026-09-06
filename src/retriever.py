"""Semantic search against the local ChromaDB vector store."""

from pathlib import Path

import chromadb

from src.ingest import CHROMA_DIR, COLLECTION_NAME, embed_texts


def retrieve(query: str, top_k: int = 3) -> list[dict]:
    """Return the top_k most relevant chunks for a query."""
    if not Path(CHROMA_DIR).exists():
        return []

    query_embedding = embed_texts([query])

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    try:
        collection = client.get_collection(name=COLLECTION_NAME)
    except Exception:
        return []

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    for i in range(len(results["ids"][0])):
        chunks.append({
            "text": results["documents"][0][i],
            "filename": results["metadatas"][0][i]["filename"],
            "distance": results["distances"][0][i],
        })
    return chunks
