"""Scoring engine — CREPE pitch + Librosa rhythm → weighted composite score.

Stub implementation that returns placeholder scores.
Real pipeline will be wired in a later phase.
"""

import os
import uuid
from fastapi import UploadFile

AUDIO_UPLOAD_DIR = "uploads/audio"

os.makedirs(AUDIO_UPLOAD_DIR, exist_ok=True)


async def score_performance(audio: UploadFile, song) -> dict:
    """Score a student performance against a reference song.

    Returns dict with pitch_score, rhythm_score, total_score, errors,
    suggestions, and recording_path.
    """
    # Save uploaded audio
    ext = audio.filename.split(".")[-1] if audio.filename else "wav"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(AUDIO_UPLOAD_DIR, filename)
    content = await audio.read()
    with open(filepath, "wb") as f:
        f.write(content)

    # TODO: real CREPE + Librosa pipeline — stub for now
    pitch_score = 92.0
    rhythm_score = 85.0
    total_score = round(pitch_score * 0.6 + rhythm_score * 0.4, 1)

    return {
        "pitch_score": pitch_score,
        "rhythm_score": rhythm_score,
        "total_score": total_score,
        "errors": [
            {"bar": 3, "type": "pitch", "detail": "音高偏低，偏低了大二度"},
            {"bar": 8, "type": "rhythm", "detail": "节奏偏快，比参考快0.3秒"},
        ],
        "suggestions": [
            "第3-5小节音准偏低，建议单独慢速练习",
            "中段节奏偏快，可以跟着节拍器先练",
            "高音部分不错，继续保持！",
        ],
        "recording_path": filepath,
    }
