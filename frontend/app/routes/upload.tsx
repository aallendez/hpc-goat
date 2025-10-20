import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { questionsAPI, type UploadResult } from '../api/client';

export function meta() {
  return [
    { title: 'Upload Questions - HPC Goat' },
    { name: 'description', content: 'Upload multiple choice questions for HPC knowledge base' },
  ];
}

export default function UploadQuestions() {
  const location = useLocation();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Removed uploadMode state as we only support text format

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await questionsAPI.uploadQuestionsFromText(text);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload questions');
    } finally {
      setLoading(false);
    }
  };

  // Removed JSON submit handler

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
Use OpenMP for inter-node communication`;

  const exampleText = `Question 1
What is the primary purpose of a High Performance Computing (HPC) system?

Option A
To run web applications

Option B
To perform complex scientific calculations and simulations

Option C
To store large amounts of data

Option D
To manage network traffic

Question 2
Which programming model is commonly used in HPC for parallel computing?

Option A
MPI (Message Passing Interface)

Option B
HTTP

Option C
REST API

Option D
SQL`;

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="font-bold hover:underline cursor-pointer"><h1>HPC Goat</h1></Link>
          <p>Master HPC concepts with interactive mock tests</p>
        </div>
      </header>
      
      <nav className="nav">
        <Link 
          to="/upload" 
          className={location.pathname === '/upload' ? 'active' : ''}
        >
          <span className="nav-icon">📤</span>
          Upload Questions
        </Link>
        <Link 
          to="/mocktest" 
          className={location.pathname === '/mocktest' ? 'active' : ''}
        >
          <span className="nav-icon">🧠</span>
          Take Mock Test
        </Link>
      </nav>

      <div className="upload-section">
        <div className="upload-header">
          <h2 className="upload-title">Upload Questions</h2>
          <p className="upload-subtitle">
            Add new HPC questions to expand our knowledge base. <br />You can upload questions from <a href="https://blackboard.ie.edu/ultra/courses/_125091_1/outline" className='text-blue-500 underline hover:text-blue-600 px-1' target="_blank" rel="noopener noreferrer"> Blackboard</a> or create them manually.
          </p>
        </div>

        <div className="upload-card">
          <form onSubmit={handleTextSubmit} className="upload-form flex flex-col gap-4">
            <div className="form-group">
              <label htmlFor="text" className="form-label">
                Questions
              </label>
              <div className="textarea-container">
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste copied questions from websites here..."
                  className="form-textarea"
                  required
                  rows={15}
                />
                <div className="textarea-footer">
                  <span className="char-count">{text.length} characters</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading || !text.trim()}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">📤</span>
                    Upload Questions
                  </>
                )}
              </button>
            </div>

            <div className="example-section">
              <h4 className="example-title">Example Format</h4>
              <p className="example-description">
                Copy and paste questions in this format:
              </p>
              <div className="example-code">
                <pre>{exampleText}</pre>
              </div>
            </div>
          </form>

          {error && (
            <div className="alert error">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <h4>Upload Failed</h4>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="alert success">
              <div className="alert-icon">✅</div>
              <div className="alert-content">
                <h4>Upload Successful!</h4>
                <div className="result-stats">
                  <div className="stat-item">
                    <span className="stat-value">{result.created}</span>
                    <span className="stat-label">Created</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{result.skipped}</span>
                    <span className="stat-label">Skipped</span>
                  </div>
                  {result.parsed_questions && (
                    <div className="stat-item">
                      <span className="stat-value">{result.parsed_questions}</span>
                      <span className="stat-label">Parsed</span>
                    </div>
                  )}
                </div>
                {result.skipped_questions && result.skipped_questions.length > 0 && (
                  <div className="skipped-questions">
                    <h5>Skipped Questions:</h5>
                    <ul>
                      {result.skipped_questions.map((text, index) => (
                        <li key={index}>{text}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
