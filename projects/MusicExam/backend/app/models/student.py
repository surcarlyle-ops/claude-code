"""Student ORM model."""

from sqlalchemy import Column, Integer, String
from app.db.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    student_number = Column(String, unique=True, nullable=False)
    face_image_path = Column(String, nullable=True)  # path to saved face photo
