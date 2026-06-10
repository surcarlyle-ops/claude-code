"""Exam results & history API."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.exam_result import ExamResult

router = APIRouter()


@router.get("/{result_id}")
async def get_result(result_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single exam result by ID."""
    result = await db.get(ExamResult, result_id)
    if not result:
        raise HTTPException(status_code=404, detail="结果不存在")
    return {
        "id": result.id,
        "student_id": result.student_id,
        "song_id": result.song_id,
        "pitch_score": result.pitch_score,
        "rhythm_score": result.rhythm_score,
        "total_score": result.total_score,
        "errors": result.errors,
        "suggestions": result.suggestions,
        "created_at": str(result.created_at),
    }


@router.get("/student/{student_id}")
async def get_student_history(student_id: int, db: AsyncSession = Depends(get_db)):
    """Get all exam results for a student, newest first."""
    query = (
        select(ExamResult)
        .where(ExamResult.student_id == student_id)
        .order_by(ExamResult.created_at.desc())
    )
    result = await db.execute(query)
    records = result.scalars().all()
    return [
        {
            "id": r.id,
            "song_id": r.song_id,
            "pitch_score": r.pitch_score,
            "rhythm_score": r.rhythm_score,
            "total_score": r.total_score,
            "created_at": str(r.created_at),
        }
        for r in records
    ]