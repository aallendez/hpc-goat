-- Migration to add topic field to questions table
-- This script adds the topic column to the existing questions table

-- Add the topic column
ALTER TABLE questions ADD COLUMN IF NOT EXISTS topic VARCHAR(100);

-- Create an index on topic for faster filtering
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);

-- Update existing questions with default topic classification
-- This is a temporary measure - in production, you'd want to run the LLM classification
-- on existing questions to properly classify them
UPDATE questions 
SET topic = 'Module 1: Foundations of HPC (Hyper Performance Computing)'
WHERE topic IS NULL;
