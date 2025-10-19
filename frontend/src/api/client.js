import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Questions API
export const questionsAPI = {
  uploadQuestions: (questions) => 
    apiClient.post('/questions/upload', { questions }),
  
  uploadQuestionsFromText: (text) => 
    apiClient.post('/questions/upload-text', { text }),
  
  getAllQuestions: () => 
    apiClient.get('/questions/'),
}

// Mock Test API
export const mockTestAPI = {
  startTest: (limit = 10) => 
    apiClient.get(`/mocktest/start?limit=${limit}`),
  
  submitTest: (answers) => 
    apiClient.post('/mocktest/submit', { answers }),
}

export default apiClient
