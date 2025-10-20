"""
LLM-based question classification service for HPC topics.
"""
import os
import json
from typing import List, Optional
from openai import OpenAI
from app.core.config import settings
from dotenv import load_dotenv

load_dotenv()

class LLMClassifier:
    """Service for classifying HPC questions using OpenAI's API."""
    
    # Available topics for classification
    TOPICS = [
        "Module 1: Foundations of HPC (Hyper Performance Computing)",
        "Module 2: Parallel computing essentials", 
        "Module 3: Performance Optimization"
    ]
    
    def __init__(self):
        """Initialize the LLM classifier with OpenAI client."""
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("Warning: OPENAI_API_KEY not found. LLM classification will be disabled.")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)
        
    def classify_question(self, question_text: str) -> Optional[str]:
        """
        Classify a single question into one of the predefined topics.
        
        Args:
            question_text: The text of the question to classify
            
        Returns:
            The classified topic or None if classification fails
        """
        if not self.client:
            print("LLM client not available. Skipping classification.")
            return self.TOPICS[0]  # Default fallback
        
        try:
            prompt = self._build_classification_prompt(question_text)
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert in High Performance Computing (HPC) education. Your task is to classify HPC-related questions into specific modules."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,  # Low temperature for consistent classification
                max_tokens=100
            )
            
            classification = response.choices[0].message.content.strip()
            
            # Validate that the classification is one of our predefined topics
            if classification in self.TOPICS:
                return classification
            else:
                # Try to find the closest match
                for topic in self.TOPICS:
                    if topic.lower() in classification.lower() or classification.lower() in topic.lower():
                        return topic
                
                # Default fallback
                return self.TOPICS[0]  # Default to Module 1
                
        except Exception as e:
            print(f"Error classifying question: {str(e)}")
            return self.TOPICS[0]  # Default fallback
    
    def classify_questions_batch(self, questions: List[str]) -> List[Optional[str]]:
        """
        Classify multiple questions in a single API call for efficiency.
        
        Args:
            questions: List of question texts to classify
            
        Returns:
            List of classified topics (same order as input)
        """
        if not self.client:
            print("LLM client not available. Using default classification.")
            return [self.TOPICS[0]] * len(questions)  # Default fallback for all questions
        
        try:
            # Create a batch prompt for multiple questions
            batch_prompt = self._build_batch_classification_prompt(questions)
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert in High Performance Computing (HPC) education. Your task is to classify HPC-related questions into specific modules."},
                    {"role": "user", "content": batch_prompt}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            result = response.choices[0].message.content.strip()
            
            # Parse the JSON response
            try:
                classifications = json.loads(result)
                if isinstance(classifications, list) and len(classifications) == len(questions):
                    # Validate each classification
                    validated_classifications = []
                    for classification in classifications:
                        if classification in self.TOPICS:
                            validated_classifications.append(classification)
                        else:
                            # Find closest match
                            found_match = False
                            for topic in self.TOPICS:
                                if topic.lower() in classification.lower() or classification.lower() in topic.lower():
                                    validated_classifications.append(topic)
                                    found_match = True
                                    break
                            if not found_match:
                                validated_classifications.append(self.TOPICS[0])  # Default fallback
                    return validated_classifications
                else:
                    # Fallback to individual classification
                    return [self.classify_question(q) for q in questions]
            except json.JSONDecodeError:
                # Fallback to individual classification
                return [self.classify_question(q) for q in questions]
                
        except Exception as e:
            print(f"Error in batch classification: {str(e)}")
            # Fallback to individual classification
            return [self.classify_question(q) for q in questions]
    
    def _build_classification_prompt(self, question_text: str) -> str:
        """Build the prompt for single question classification."""
        return f"""
Please classify the following HPC question into one of these exact topics:

1. "Module 1: Foundations of HPC (Hyper Performance Computing)"
2. "Module 2: Parallel computing essentials"
3. "Module 3: Performance Optimization"

Question: {question_text}

Consider the content and focus of the question:
- Module 1 covers basic HPC concepts, system architecture, and fundamental principles
- Module 2 covers parallel programming, MPI, threading, and distributed computing
- Module 3 covers optimization techniques, profiling, and performance tuning

Respond with ONLY the exact topic name from the list above.
"""
    
    def _build_batch_classification_prompt(self, questions: List[str]) -> str:
        """Build the prompt for batch question classification."""
        questions_text = "\n".join([f"{i+1}. {q}" for i, q in enumerate(questions)])
        
        return f"""
Please classify the following HPC questions into one of these exact topics:

1. "Module 1: Foundations of HPC (Hyper Performance Computing)"
2. "Module 2: Parallel computing essentials"
3. "Module 3: Performance Optimization"

Questions:
{questions_text}

Consider the content and focus of each question:
- Module 1 covers basic HPC concepts, system architecture, and fundamental principles
- Module 2 covers parallel programming, MPI, threading, and distributed computing
- Module 3 covers optimization techniques, profiling, and performance tuning

Respond with a JSON array where each element is the exact topic name for the corresponding question (same order as input).
Example: ["Module 1: Foundations of HPC (Hyper Performance Computing)", "Module 2: Parallel computing essentials", ...]
"""

# Global classifier instance
classifier = LLMClassifier()
