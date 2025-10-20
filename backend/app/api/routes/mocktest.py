from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import schemas, crud
from typing import List, Optional

router = APIRouter()

@router.get("/start", response_model=schemas.MockTestResponse)
async def start_mock_test(
    limit: int = 10,
    topics: Optional[List[str]] = Query(None, description="Filter questions by topics"),
    db: Session = Depends(get_db)
):
    """
    Start a mock test by returning a random subset of questions.
    Optionally filter by topics.
    """
    try:
        questions = crud.get_random_questions(db, limit, topics)
        if not questions:
            raise HTTPException(status_code=404, detail="No questions available in database")
        
        mock_questions = []
        for question in questions:
            mock_questions.append(schemas.MockTestQuestion(
                id=question.id,
                question_text=question.question_text,
                option_a=question.option_a,
                option_b=question.option_b,
                option_c=question.option_c,
                option_d=question.option_d,
                topic=question.topic
            ))
        
        return schemas.MockTestResponse(questions=mock_questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting mock test: {str(e)}")

@router.get("/topics", response_model=List[str])
async def get_available_topics(db: Session = Depends(get_db)):
    """
    Get all available topics for filtering questions.
    """
    try:
        topics = crud.get_available_topics(db)
        return topics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting topics: {str(e)}")

@router.post("/submit", response_model=schemas.MockTestResult)
async def submit_mock_test(
    submission: schemas.MockTestSubmission,
    db: Session = Depends(get_db)
):
    """
    Submit answers for evaluation and return results.
    """
    try:
        if not submission.answers:
            raise HTTPException(status_code=400, detail="No answers provided")
        
        result = crud.evaluate_answers(db, submission.answers)
        return schemas.MockTestResult(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating answers: {str(e)}")
