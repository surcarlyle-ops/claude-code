"""Song ORM model."""

from sqlalchemy import Column, Integer, String, Float, JSON
from app.db.database import Base


class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    difficulty = Column(Integer, nullable=False)  # 1=初级 2=中级 3=高级
    duration = Column(Float, nullable=False)       # seconds
    notation_url = Column(String, nullable=True)   # path to notation image
    midi_url = Column(String, nullable=True)       # path to reference MIDI
    reference_pitch = Column(JSON, nullable=True)  # [[time, freq], ...]
    reference_beats = Column(JSON, nullable=True)  # [beat_time, ...]
