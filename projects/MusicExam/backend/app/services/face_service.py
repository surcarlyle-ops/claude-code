"""Face image saving service."""

import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "uploads/faces"

os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_face_image(file: UploadFile, student_number: str) -> str:
    """Save uploaded face image to disk, return relative path."""
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{student_number}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)
    return filepath
