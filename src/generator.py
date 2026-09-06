"""Send retrieved context + user query to a local Ollama model for a grounded answer."""

import ollama

MODEL = "llama3.2"


def generate(query: str, context_chunks: list[dict]) -> str:
    """Generate an answer using a local Ollama model with retrieved context."""
    context_block = "\n\n---\n\n".join(
        f"[Source: {c['filename']}]\n{c['text']}" for c in context_chunks
    )

    system_prompt = (
        "You are a helpful assistant that answers questions based on the provided document context. "
        "Use ONLY the information in the context below to answer. "
        "If the context does not contain enough information to answer, say so clearly. "
        "Cite which source file(s) your answer draws from."
    )

    user_message = f"## Retrieved Context\n\n{context_block}\n\n## Question\n\n{query}"

    response = ollama.chat(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    )

    return response.message.content
