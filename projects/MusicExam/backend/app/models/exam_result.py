"""ExamResult ORM model."""

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.db.database import Base


class ExamResult(Base):
    __tablename__ = "exam_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    pitch_score = Column(Float, nullable=False)     # 0-100
    rhythm_score = Column(Float, nullable=False)    # 0-100
    total_score = Column(Float, nullable=False)     # 0-100 weighted average
    errors = Column(JSON, nullable=True)            # [{bar, type, detail}, ...]
    suggestions = Column(JSON, nullable=True)       # [str, ...]
    recording_path = Column(String, nullable=True)  # path to saved audio
    created_at = Column(DateTime, server_default=func.now())
