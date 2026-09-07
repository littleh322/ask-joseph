"""HTTP API for the Local Document AI Assistant."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from src.ingest import DOCS_DIR, read_pdf
from src.retriever import retrieve
from src.generator import generate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str
    sources: list[dict]


@app.get("/documents")
def documents(type: str | None = None):
    docs = []
    for file_path in sorted(DOCS_DIR.iterdir()):
        if file_path.suffix in (".txt", ".md"):
            content = file_path.read_text(encoding="utf-8").strip()
            if content:
                docs.append({"filename": file_path.name, "type": "text", "content": content})
        elif file_path.suffix == ".pdf":
            docs.append({"filename": file_path.name, "type": "pdf", "content": None})
    if type:
        docs = [d for d in docs if d["type"] == type]
    return docs


@app.get("/documents/{filename}")
def document_file(filename: str):
    file_path = DOCS_DIR / filename
    if not file_path.exists() or not file_path.is_relative_to(DOCS_DIR):
        return {"error": "Not found"}
    return FileResponse(file_path, media_type="application/pdf")


@app.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    chunks = retrieve(req.question, top_k=3)
    if not chunks:
        return AskResponse(answer="No indexed documents found. Run ingestion first.", sources=[])

    answer = generate(req.question, chunks)
    sources = [{"filename": c["filename"], "distance": c["distance"]} for c in chunks]
    return AskResponse(answer=answer, sources=sources)
