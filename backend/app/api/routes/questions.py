from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import schemas, crud
from app.utils.text_parser import parse_questions_from_text
from typing import List
from pydantic import BaseModel

router = APIRouter()

class TextUpload(BaseModel):
    text: str

@router.post("/upload", response_model=dict)
async def upload_questions(
    question_data: schemas.QuestionUpload,
    db: Session = Depends(get_db)
):
    """
    Upload a list of MCQ questions in JSON format.
    If a question already exists (by question text), skip insertion.
    """
    try:
        result = crud.create_questions_bulk(db, question_data.questions)
        return {
            "message": "Questions processed successfully",
            "created": result["created"],
            "skipped": result["skipped"],
            "skipped_questions": result["skipped_questions"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing questions: {str(e)}")

@router.post("/upload-text", response_model=dict)
async def upload_questions_from_text(
    text_data: TextUpload,
    db: Session = Depends(get_db)
):
    """
    Upload questions from copied text format.
    Parses the text and extracts questions with options.
    """
    try:
        # Parse the text to extract questions
        questions = parse_questions_from_text(text_data.text)
        
        if not questions:
            raise HTTPException(status_code=400, detail="No valid questions found in the text")
        
        # Create questions in database
        result = crud.create_questions_bulk(db, questions)
        return {
            "message": "Questions processed successfully from text",
            "created": result["created"],
            "skipped": result["skipped"],
            "skipped_questions": result["skipped_questions"],
            "parsed_questions": len(questions)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in upload_questions_from_text: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

@router.get("/", response_model=List[schemas.Question])
async def get_all_questions(db: Session = Depends(get_db)):
    """Get all questions in the database."""
    from app.db import models
    questions = db.query(models.Question).all()
    return questions
