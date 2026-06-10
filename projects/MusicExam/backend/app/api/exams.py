"""Exam session & scoring API."""

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.student import Student
from app.models.song import Song
from app.models.exam_result import ExamResult
from app.services.scoring_engine import score_performance

router = APIRouter()


@router.post("/submit")
async def submit_exam(
    student_id: int = Form(...),
    song_id: int = Form(...),
    audio: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """Submit a recorded performance for scoring."""
    student = await db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="考生不存在")

    song = await db.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="曲目不存在")

    # Save audio and run scoring engine
    result = await score_performance(audio, song)

    exam_result = ExamResult(
        student_id=student_id,
        song_id=song_id,
        pitch_score=result["pitch_score"],
        rhythm_score=result["rhythm_score"],
        total_score=result["total_score"],
        errors=result["errors"],
        suggestions=result["suggestions"],
        recording_path=result["recording_path"],
    )
    db.add(exam_result)
    await db.commit()
    await db.refresh(exam_result)
    return {
        "id": exam_result.id,
        "pitch_score": exam_result.pitch_score,
        "rhythm_score": exam_result.rhythm_score,
        "total_score": exam_result.total_score,
        "errors": exam_result.errors,
        "suggestions": exam_result.suggestions,
    }