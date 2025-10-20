-- Initialize the HPC Saviour database
-- This script creates the questions table if it doesn't exist

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question_text VARCHAR(5000) UNIQUE NOT NULL,
    option_a VARCHAR(500),
    option_b VARCHAR(500),
    option_c VARCHAR(500),
    option_d VARCHAR(500),
    correct_answer VARCHAR(500),
    topic VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on question_text for faster lookups
CREATE INDEX IF NOT EXISTS idx_questions_text ON questions(question_text);

-- Insert some sample questions if the table is empty
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer)
SELECT 
    'What is the primary purpose of a High Performance Computing (HPC) system?' as question_text,
    'To run web applications' as option_a,
    'To perform complex scientific calculations and simulations' as option_b,
    'To store large amounts of data' as option_c,
    'To manage network traffic' as option_d,
    'To perform complex scientific calculations and simulations' as correct_answer
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'What is the primary purpose of a High Performance Computing (HPC) system?');

INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer)
SELECT 
    'Which programming model is commonly used in HPC for parallel computing?' as question_text,
    'MPI (Message Passing Interface)' as option_a,
    'HTTP' as option_b,
    'REST API' as option_c,
    'SQL' as option_d,
    'MPI (Message Passing Interface)' as correct_answer
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'Which programming model is commonly used in HPC for parallel computing?');

INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer)
SELECT 
    'What does MPI stand for in HPC context?' as question_text,
    'Message Processing Interface' as option_a,
    'Message Passing Interface' as option_b,
    'Multi-Processing Interface' as option_c,
    'Memory Processing Interface' as option_d,
    'Message Passing Interface' as correct_answer
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'What does MPI stand for in HPC context?');

INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer)
SELECT 
    'Which of the following is NOT a characteristic of HPC systems?' as question_text,
    'High computational power' as option_a,
    'Large memory capacity' as option_b,
    'Single-threaded processing' as option_c,
    'Parallel processing capabilities' as option_d,
    'Single-threaded processing' as correct_answer
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'Which of the following is NOT a characteristic of HPC systems?');

INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer)
SELECT 
    'What is the main advantage of using clusters in HPC?' as question_text,
    'Lower cost per computation' as option_a,
    'Better scalability and fault tolerance' as option_b,
    'Simpler programming model' as option_c,
    'Reduced power consumption' as option_d,
    'Better scalability and fault tolerance' as correct_answer
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'What is the main advantage of using clusters in HPC?');
