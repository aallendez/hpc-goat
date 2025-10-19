from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db import models, schemas
from typing import List, Optional
import random

def get_question_by_text(db: Session, question_text: str):
    return db.query(models.Question).filter(models.Question.question_text == question_text).first()

def create_question(db: Session, question: schemas.QuestionCreate):
    db_question = models.Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def create_questions_bulk(db: Session, questions: List[schemas.QuestionCreate]):
    created_questions = []
    skipped_questions = []
    
    for question in questions:
        existing = get_question_by_text(db, question.question_text)
        if existing:
            skipped_questions.append(question.question_text)
        else:
            db_question = models.Question(**question.dict())
            db.add(db_question)
            created_questions.append(db_question)
    
    db.commit()
    
    for question in created_questions:
        db.refresh(question)
    
    return {
        "created": len(created_questions),
        "skipped": len(skipped_questions),
        "skipped_questions": skipped_questions
    }

def get_random_questions(db: Session, limit: int = 10):
    all_questions = db.query(models.Question).all()
    if len(all_questions) <= limit:
        return all_questions
    return random.sample(all_questions, limit)

def get_question_by_id(db: Session, question_id: int):
    return db.query(models.Question).filter(models.Question.id == question_id).first()

def evaluate_answers(db: Session, answers: List[schemas.AnswerSubmission]):
    correct_count = 0
    total_questions = len(answers)
    
    for answer in answers:
        question = get_question_by_id(db, answer.question_id)
        if question and question.correct_answer == answer.selected_answer:
            correct_count += 1
    
    score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
    passed = score_percentage >= 70  # 70% passing threshold
    
    return {
        "total_questions": total_questions,
        "correct_answers": correct_count,
        "score_percentage": round(score_percentage, 2),
        "passed": passed
    }
