-- Migration script to increase question_text column length from 1000 to 5000 characters
-- This script should be run on the existing database

-- First, let's check if the column exists and its current definition
-- Then alter the column to increase its length

ALTER TABLE questions ALTER COLUMN question_text TYPE VARCHAR(5000);

-- Verify the change
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'questions' AND column_name = 'question_text';
