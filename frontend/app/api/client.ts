import axios, { type AxiosResponse } from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  topic?: string;
}

export interface TestResult {
  score_percentage: number;
  total_questions: number;
  correct_answers: number;
  passed: boolean;
}

export interface UploadResult {
  created: number;
  skipped: number;
  parsed_questions?: number;
  skipped_questions?: string[];
}

export interface AnswerSubmission {
  question_id: number;
  selected_answer: string;
}

// Questions API
export const questionsAPI = {
  uploadQuestions: (questions: Omit<Question, 'id'>[]): Promise<AxiosResponse<UploadResult>> =>
    apiClient.post('/api/questions/upload', { questions }),
  
  uploadQuestionsFromText: (text: string): Promise<AxiosResponse<UploadResult>> =>
    apiClient.post('/api/questions/upload-text', { text }),
  
  getAllQuestions: (): Promise<AxiosResponse<Question[]>> =>
    apiClient.get('/api/questions/'),
};

// Mock Test API
export const mockTestAPI = {
  startTest: (limit: number = 10, topics?: string[]): Promise<AxiosResponse<{ questions: Question[] }>> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (topics && topics.length > 0) {
      topics.forEach(topic => params.append('topics', topic));
    }
    return apiClient.get(`/api/mocktest/start?${params.toString()}`);
  },
  
  getTopics: (): Promise<AxiosResponse<string[]>> =>
    apiClient.get('/api/mocktest/topics'),
  
  submitTest: (answers: AnswerSubmission[]): Promise<AxiosResponse<TestResult>> =>
    apiClient.post('/api/mocktest/submit', { answers }),
};

export default apiClient;
