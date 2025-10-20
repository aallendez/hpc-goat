from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db import models, schemas
from typing import List, Optional
import random
from app.services.llm_classifier import classifier

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
    
    # Separate new questions from existing ones
    new_questions = []
    for question in questions:
        existing = get_question_by_text(db, question.question_text)
        if existing:
            skipped_questions.append(question.question_text)
        else:
            new_questions.append(question)
    
    # Classify new questions if any
    if new_questions:
        try:
            # Extract question texts for batch classification
            question_texts = [q.question_text for q in new_questions]
            
            # Classify all questions at once
            topics = classifier.classify_questions_batch(question_texts)
            
            # Create database objects with topics
            for i, question in enumerate(new_questions):
                question_dict = question.dict()
                question_dict['topic'] = topics[i] if i < len(topics) and topics[i] else None
                
                db_question = models.Question(**question_dict)
                db.add(db_question)
                created_questions.append(db_question)
                
        except Exception as e:
            print(f"Error in topic classification: {str(e)}")
            # Fallback: create questions without topics
            for question in new_questions:
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

def get_random_questions(db: Session, limit: int = 10, topics: Optional[List[str]] = None):
    """
    Get random questions, optionally filtered by topics.
    
    Args:
        db: Database session
        limit: Maximum number of questions to return
        topics: List of topics to filter by. If None, returns questions from all topics.
    
    Returns:
        List of random questions
    """
    query = db.query(models.Question)
    
    if topics:
        query = query.filter(models.Question.topic.in_(topics))
    
    all_questions = query.all()
    if len(all_questions) <= limit:
        return all_questions
    return random.sample(all_questions, limit)

def get_question_by_id(db: Session, question_id: int):
    return db.query(models.Question).filter(models.Question.id == question_id).first()

def get_available_topics(db: Session) -> List[str]:
    """Get all available topics from the database."""
    topics = db.query(models.Question.topic).filter(models.Question.topic.isnot(None)).distinct().all()
    return [topic[0] for topic in topics if topic[0]]

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
