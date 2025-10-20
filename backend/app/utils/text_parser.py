import re
from typing import List, Dict, Optional
from app.db.schemas import QuestionCreate

class QuestionTextParser:
    """Parser for extracting questions from copied text format"""
    
    def __init__(self):
        # Regex patterns for different question formats
        self.question_pattern = re.compile(r'Question \d+.*?(?=Question \d+|$)', re.DOTALL)
        
    def parse_text(self, text: str) -> List[QuestionCreate]:
        """Parse the entire text and extract all questions"""
        questions = []
        
        # Split text into individual questions
        question_blocks = self.question_pattern.findall(text)
        
        for block in question_blocks:
            question = self._parse_single_question(block)
            if question:
                questions.append(question)
        
        return questions
    
    def _parse_single_question(self, block: str) -> Optional[QuestionCreate]:
        """Parse a single question block"""
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        
        if not lines:
            return None
            
        # Find the question text
        question_text = ""
        options = {}
        correct_answer = ""
        
        # Look for the question text - collect all non-option lines
        question_candidates = []
        in_options = False
        code_block = []
        in_code_block = False
        
        for line in lines:
            if line.startswith('Option'):
                in_options = True
                # If we were in a code block, add it to question text
                if in_code_block and code_block:
                    question_candidates.append('\n'.join(code_block))
                    code_block = []
                    in_code_block = False
            elif not in_options and line and not line.startswith('Question') and not line.isdigit() and not line.startswith('Point'):
                # Check if this looks like code (contains #pragma, #include, for, if, etc.)
                # More specific MPI detection - only if it looks like a function call
                is_mpi_code = 'MPI_' in line and ('(' in line or ';' in line or '=' in line)
                if any(keyword in line for keyword in ['#pragma', '#include', '#define', '#ifdef', '#ifndef', 'for(', 'if(', '{', '}', 'int ', 'float ', 'double ', 'char ', 'void ', 'return', 'while(', 'do {', '//', '/*', '*/']) or is_mpi_code:
                    in_code_block = True
                    code_block.append(line)
                elif in_code_block:
                    # Continue code block if we're already in one
                    code_block.append(line)
                else:
                    question_candidates.append(line)
        
        # If we ended in a code block, add it to question text
        if in_code_block and code_block:
            question_candidates.append('\n'.join(code_block))
        
        # Combine all question candidates into the question text
        if question_candidates:
            question_text = '\n'.join(question_candidates)
        
        # Extract options
        current_option = None
        for line in lines:
            if line.startswith('Option'):
                # Extract option letter and text
                match = re.match(r'Option ([A-E])\s*(.*)', line)
                if match:
                    current_option = match.group(1)
                    option_text = match.group(2).strip()
                    if option_text:
                        options[current_option] = option_text
            elif current_option and line and not line.startswith('Option'):
                # This is continuation of the previous option
                if current_option in options:
                    options[current_option] += " " + line
                else:
                    options[current_option] = line
        
        # Handle True/False questions
        if 'True' in block and 'False' in block:
            options = {'A': 'True', 'B': 'False'}
            correct_answer = 'True'  # Default to True, user can edit
        else:
            # For multiple choice, use the first option as default correct answer
            if options:
                correct_answer = list(options.values())[0]
        
        # Ensure we have at least 4 options for standard MCQ
        while len(options) < 4:
            letter = chr(ord('A') + len(options))
            options[letter] = f"Option {letter}"
        
        # Create the question
        if question_text and len(options) >= 2:
            return QuestionCreate(
                question_text=question_text,
                option_a=options.get('A', ''),
                option_b=options.get('B', ''),
                option_c=options.get('C', ''),
                option_d=options.get('D', ''),
                correct_answer=correct_answer
            )
        
        return None

def parse_questions_from_text(text: str) -> List[QuestionCreate]:
    """Main function to parse questions from text format"""
    parser = QuestionTextParser()
    return parser.parse_text(text)
