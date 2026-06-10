"""MusicExam backend — FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import students, songs, exams, results
from app.db.database import engine, Base

app = FastAPI(title="MusicExam API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router, prefix="/api/students", tags=["students"])
app.include_router(songs.router, prefix="/api/songs", tags=["songs"])
app.include_router(exams.router, prefix="/api/exams", tags=["exams"])
app.include_router(results.router, prefix="/api/results", tags=["results"])


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
