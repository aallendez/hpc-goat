import { useState } from 'react'
import { questionsAPI } from '../api/client'

const UploadQuestions = () => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [uploadMode, setUploadMode] = useState('text') // 'text' or 'json'

  const handleTextSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await questionsAPI.uploadQuestionsFromText(text)
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload questions')
    } finally {
      setLoading(false)
    }
  }

  const handleJsonSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const questionsData = JSON.parse(text)
      const response = await questionsAPI.uploadQuestions(questionsData)
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload questions')
    } finally {
      setLoading(false)
    }
  }

  const sampleText = `Question 1
Question 1
1 Point
Question 1
For a financial modelling application running on a distributed memory system, you need to ensure minimal latency in data exchanges. What is the best approach to achieve this?

Option A
Use blocking communication to ensure data consistency

Option B
Implement non-blocking communication to overlap computation and communication

Option C
Use a single node for centralized memory access

Option D
Employ static scheduling to pre-assign tasks

Option E
Use OpenMP for inter-node communication`

  const sampleJson = [
    {
      question_text: "What is the primary purpose of a High Performance Computing (HPC) system?",
      option_a: "To run web applications",
      option_b: "To perform complex scientific calculations and simulations",
      option_c: "To store large amounts of data",
      option_d: "To manage network traffic",
      correct_answer: "To perform complex scientific calculations and simulations"
    },
    {
      question_text: "Which programming model is commonly used in HPC for parallel computing?",
      option_a: "MPI (Message Passing Interface)",
      option_b: "HTTP",
      option_c: "REST API",
      option_d: "SQL",
      correct_answer: "MPI (Message Passing Interface)"
    }
  ]

  const loadSample = () => {
    if (uploadMode === 'text') {
      setText(sampleText)
    } else {
      setText(JSON.stringify(sampleJson, null, 2))
    }
  }

  return (
    <div className="card">
      <h2>Upload Questions</h2>
      <p>Upload multiple choice questions by copying and pasting from websites or using JSON format.</p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ marginRight: '1rem' }}>
          <input
            type="radio"
            name="uploadMode"
            value="text"
            checked={uploadMode === 'text'}
            onChange={(e) => setUploadMode(e.target.value)}
            style={{ marginRight: '0.5rem' }}
          />
          Text Format (Copy from websites)
        </label>
        <label>
          <input
            type="radio"
            name="uploadMode"
            value="json"
            checked={uploadMode === 'json'}
            onChange={(e) => setUploadMode(e.target.value)}
            style={{ marginRight: '0.5rem' }}
          />
          JSON Format
        </label>
      </div>
      
      <form onSubmit={uploadMode === 'text' ? handleTextSubmit : handleJsonSubmit}>
        <div className="form-group">
          <label htmlFor="text">
            {uploadMode === 'text' ? 'Questions (Text format):' : 'Questions (JSON format):'}
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={uploadMode === 'text' 
              ? "Paste copied questions from websites here..." 
              : "Enter questions in JSON format..."
            }
            className={uploadMode === 'json' ? 'json-input' : ''}
            required
            rows={15}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <button 
            type="button" 
            onClick={loadSample}
            className="btn"
            style={{ marginRight: '1rem', background: '#6b7280' }}
          >
            Load Sample {uploadMode === 'text' ? 'Text' : 'JSON'}
          </button>
        </div>
        
        <button 
          type="submit" 
          className="btn" 
          disabled={loading || !text.trim()}
        >
          {loading ? 'Uploading...' : 'Upload Questions'}
        </button>
      </form>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {result && (
        <div className="alert success">
          <h3>Upload Results:</h3>
          <p><strong>Created:</strong> {result.created} questions</p>
          <p><strong>Skipped:</strong> {result.skipped} questions (already exist)</p>
          {result.parsed_questions && (
            <p><strong>Parsed:</strong> {result.parsed_questions} questions from text</p>
          )}
          {result.skipped_questions && result.skipped_questions.length > 0 && (
            <div>
              <p><strong>Skipped Questions:</strong></p>
              <ul>
                {result.skipped_questions.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UploadQuestions
