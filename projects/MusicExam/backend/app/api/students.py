"""Student registration & face binding API."""

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.student import Student
from app.services.face_service import save_face_image

router = APIRouter()


@router.post("/register")
async def register_student(
    name: str = Form(...),
    student_number: str = Form(...),
    face_image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """Register a student with name, student number, and face photo."""
    # Check duplicate student_number
    existing = await db.execute(
        select(Student).where(Student.student_number == student_number)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="学号已存在")

    face_path = await save_face_image(face_image, student_number)

    student = Student(
        name=name,
        student_number=student_number,
        face_image_path=face_path,
    )
    db.add(student)
    await db.commit()
    await db.refresh(student)
    return {"id": student.id, "name": student.name, "student_number": student.student_number}


@router.get("/{student_id}")
async def get_student(student_id: int, db: AsyncSession = Depends(get_db)):
    """Get student info by ID."""
    student = await db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="考生不存在")
    return {
        "id": student.id,
        "name": student.name,
        "student_number": student.student_number,
    }