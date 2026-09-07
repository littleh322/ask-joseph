"""HTTP API for the Local Document AI Assistant."""

import os
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Header, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from src.ingest import DOCS_DIR, ingest
from src.retriever import retrieve
from src.generator import generate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["*"],
)

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")
AVATAR_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp")


def require_admin(authorization: str = Header(...)):
    if authorization != f"Bearer {ADMIN_PASSWORD}":
        raise HTTPException(status_code=401, detail="Unauthorized")


def find_avatar() -> Path | None:
    for ext in AVATAR_EXTENSIONS:
        path = DOCS_DIR / f"avatar{ext}"
        if path.exists():
            return path
    return None


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str
    sources: list[dict]


class LoginRequest(BaseModel):
    password: str


class ResumeBody(BaseModel):
    content: str


@app.get("/resume")
def get_resume():
    for file_path in sorted(DOCS_DIR.iterdir()):
        if file_path.suffix == ".md":
            return {"filename": file_path.name, "content": file_path.read_text(encoding="utf-8")}
    return {"filename": None, "content": ""}


@app.get("/avatar")
def get_avatar():
    path = find_avatar()
    if not path:
        raise HTTPException(status_code=404, detail="No avatar found")
    media_types = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}
    return FileResponse(path, media_type=media_types.get(path.suffix, "image/png"))


@app.post("/admin/login")
def admin_login(req: LoginRequest):
    if req.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"authenticated": True, "token": ADMIN_PASSWORD}


@app.put("/admin/resume", dependencies=[Depends(require_admin)])
def save_resume(body: ResumeBody):
    md_files = [f for f in DOCS_DIR.iterdir() if f.suffix == ".md"]
    if md_files:
        target = md_files[0]
    else:
        target = DOCS_DIR / "resume.md"
    target.write_text(body.content, encoding="utf-8")
    chunk_count = ingest()
    return {"filename": target.name, "chunks": chunk_count}


@app.post("/admin/avatar", dependencies=[Depends(require_admin)])
async def upload_avatar(file: UploadFile):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    ext = Path(file.filename).suffix.lower()
    if ext not in AVATAR_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Allowed formats: {', '.join(AVATAR_EXTENSIONS)}")
    for old_ext in AVATAR_EXTENSIONS:
        old = DOCS_DIR / f"avatar{old_ext}"
        if old.exists():
            old.unlink()
    dest = DOCS_DIR / f"avatar{ext}"
    dest.write_bytes(await file.read())
    return {"filename": dest.name}


@app.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    chunks = retrieve(req.question, top_k=5)
    if not chunks:
        return AskResponse(answer="No indexed documents found. Run ingestion first.", sources=[])
    answer = generate(req.question, chunks)
    sources = [{"filename": c["filename"], "distance": c["distance"]} for c in chunks]
    return AskResponse(answer=answer, sources=sources)
