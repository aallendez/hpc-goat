from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class QuestionBase(BaseModel):
    question_text: str = Field(..., min_length=10, max_length=1000, description="The question text")
    option_a: str = Field(..., min_length=1, max_length=500, description="Option A")
    option_b: str = Field(..., min_length=1, max_length=500, description="Option B")
    option_c: str = Field(..., min_length=1, max_length=500, description="Option C")
    option_d: str = Field(..., min_length=1, max_length=500, description="Option D")
    correct_answer: str = Field(..., min_length=1, max_length=500, description="The correct answer")

    @validator('correct_answer')
    def validate_correct_answer(cls, v, values):
        """Ensure correct_answer matches one of the options"""
        options = [values.get('option_a'), values.get('option_b'), values.get('option_c'), values.get('option_d')]
        if v not in options:
            raise ValueError('correct_answer must match one of the provided options')
        return v

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class QuestionUpload(BaseModel):
    questions: List[QuestionCreate] = Field(..., min_items=1, max_items=100, description="List of questions to upload")

class MockTestQuestion(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

class MockTestResponse(BaseModel):
    questions: List[MockTestQuestion] = Field(..., min_items=1, description="List of questions for the mock test")

class AnswerSubmission(BaseModel):
    question_id: int = Field(..., gt=0, description="ID of the question")
    selected_answer: str = Field(..., min_length=1, max_length=500, description="The selected answer")

class MockTestSubmission(BaseModel):
    answers: List[AnswerSubmission] = Field(..., min_items=1, description="List of answers for the mock test")

class MockTestResult(BaseModel):
    total_questions: int = Field(..., ge=0, description="Total number of questions")
    correct_answers: int = Field(..., ge=0, description="Number of correct answers")
    score_percentage: float = Field(..., ge=0, le=100, description="Score percentage")
    passed: bool = Field(..., description="Whether the test was passed")
