"""Song library API."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.song import Song

router = APIRouter()


@router.get("/")
async def list_songs(
    difficulty: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all songs, optionally filtered by difficulty level."""
    query = select(Song)
    if difficulty is not None:
        query = query.where(Song.difficulty == difficulty)
    result = await db.execute(query)
    songs = result.scalars().all()
    return [
        {
            "id": s.id,
            "title": s.title,
            "difficulty": s.difficulty,
            "duration": s.duration,
            "notation_url": s.notation_url,
            "midi_url": s.midi_url,
        }
        for s in songs
    ]


@router.get("/{song_id}")
async def get_song(song_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single song with full reference data."""
    song = await db.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="曲目不存在")
    return {
        "id": song.id,
        "title": song.title,
        "difficulty": song.difficulty,
        "duration": song.duration,
        "notation_url": song.notation_url,
        "midi_url": song.midi_url,
        "reference_pitch": song.reference_pitch,
        "reference_beats": song.reference_beats,
    }