# Welcome to Local Doc Assistant

This is a sample document to test the RAG pipeline.

## What is RAG?

RAG stands for Retrieval-Augmented Generation. It is a technique that combines information retrieval with text generation. Instead of relying solely on what a language model has memorized during training, RAG first searches a knowledge base for relevant documents, then passes those documents as context to the model so it can generate grounded, accurate answers.

## How This Project Works

1. **Ingestion**: Place `.txt` or `.md` files in the `docs/` folder. The system reads each file, splits it into overlapping chunks, generates vector embeddings using a local model, and stores them in ChromaDB.

2. **Retrieval**: When you ask a question, the system converts your question into an embedding, searches ChromaDB for the most similar document chunks, and returns the top matches.

3. **Generation**: The retrieved chunks are assembled into a context prompt and sent to Claude along with your question. Claude generates an answer grounded in your documents.

## Benefits of Local RAG

- Your documents never leave your machine (embeddings are generated locally).
- You can query private or proprietary documents without uploading them anywhere.
- The system is fast and lightweight, running entirely on your laptop.
- Answers are grounded in your actual documents, reducing hallucination.
