import { useState, useEffect } from 'react'
import { mockTestAPI } from '../api/client'

const MockTest = () => {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const startTest = async () => {
    setLoading(true)
    setError(null)
    setTestStarted(false)
    setTestSubmitted(false)
    setResult(null)
    setAnswers({})

    try {
      const response = await mockTestAPI.startTest(5) // Get 5 questions
      setQuestions(response.data.questions)
      setTestStarted(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start test')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const submitTest = async () => {
    setLoading(true)
    setError(null)

    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        question_id: parseInt(questionId),
        selected_answer: selectedAnswer
      }))

      const response = await mockTestAPI.submitTest(answersArray)
      setResult(response.data)
      setTestSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit test')
    } finally {
      setLoading(false)
    }
  }

  const resetTest = () => {
    setQuestions([])
    setAnswers({})
    setTestStarted(false)
    setTestSubmitted(false)
    setResult(null)
    setError(null)
  }

  if (loading && !testStarted) {
    return (
      <div className="card">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="card">
        <h2>Mock Test</h2>
        <p>Test your HPC knowledge with randomly selected questions from the database.</p>
        
        {error && (
          <div className="alert error">
            {error}
          </div>
        )}
        
        <button onClick={startTest} className="btn">
          Start Mock Test
        </button>
      </div>
    )
  }

  if (testSubmitted && result) {
    return (
      <div className="card">
        <div className="result-card">
          <h2>Test Results</h2>
          <div className={`result-score ${result.passed ? 'pass' : 'fail'}`}>
            {result.score_percentage}%
          </div>
          <div className="result-details">
            <p><strong>Total Questions:</strong> {result.total_questions}</p>
            <p><strong>Correct Answers:</strong> {result.correct_answers}</p>
            <p><strong>Status:</strong> {result.passed ? 'PASSED' : 'FAILED'}</p>
          </div>
          <button onClick={resetTest} className="btn">
            Take Another Test
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Mock Test</h2>
      <p>Answer all questions and submit when ready.</p>
      
      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {questions.map((question, index) => (
        <div key={question.id} className="question-card">
          <div className="question-text">
            {index + 1}. {question.question_text}
          </div>
          <div className="options">
            {['a', 'b', 'c', 'd'].map(option => (
              <label 
                key={option} 
                className={`option ${answers[question.id] === question[`option_${option}`] ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={question[`option_${option}`]}
                  checked={answers[question.id] === question[`option_${option}`]}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
                <span>{option.toUpperCase()}. {question[`option_${option}`]}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          onClick={submitTest} 
          className="btn"
          disabled={loading || Object.keys(answers).length !== questions.length}
        >
          {loading ? 'Submitting...' : 'Submit Test'}
        </button>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Answered: {Object.keys(answers).length} / {questions.length}
        </p>
      </div>
    </div>
  )
}

export default MockTest
