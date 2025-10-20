import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { mockTestAPI, type Question, type TestResult, type AnswerSubmission } from '../api/client';

// Utility function to detect and format code snippets
const formatQuestionText = (text: string) => {
  // Split text by newlines to process line by line
  const lines = text.split('\n');
  const formattedElements: React.ReactNode[] = [];
  let currentCodeBlock: string[] = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line looks like code
    const isCodeLine = line.includes('#pragma') || 
                      line.includes('#include') ||
                      line.includes('#define') ||
                      line.includes('#ifdef') ||
                      line.includes('#ifndef') ||
                      line.includes('for(') || 
                      line.includes('if(') || 
                      line.includes('{') || 
                      line.includes('}') ||
                      line.includes('int ') ||
                      line.includes('float ') ||
                      line.includes('double ') ||
                      line.includes('char ') ||
                      line.includes('void ') ||
                      line.includes('return') ||
                      line.includes('while(') ||
                      line.includes('do {') ||
                      line.includes('//') ||
                      line.includes('/*') ||
                      line.includes('*/') ||
                      // More specific MPI detection - only if it looks like a function call
                      (line.includes('MPI_') && (line.includes('(') || line.includes(';') || line.includes('='))) ||
                      (inCodeBlock && (line.trim() === '' || line.includes(';') || line.includes('{') || line.includes('}')));
    
    if (isCodeLine) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        currentCodeBlock = [line];
      } else {
        // Continue code block
        currentCodeBlock.push(line);
      }
    } else {
      if (inCodeBlock) {
        // End of code block, render it
        formattedElements.push(
          <div key={`code-${i}`} className="question-code">
            <code>{currentCodeBlock.join('\n')}</code>
          </div>
        );
        currentCodeBlock = [];
        inCodeBlock = false;
      }
      
      // Add regular text
      if (line.trim()) {
        formattedElements.push(
          <span key={`text-${i}`}>{line}</span>
        );
        if (i < lines.length - 1) {
          formattedElements.push(<br key={`br-${i}`} />);
        }
      }
    }
  }
  
  // Handle case where text ends with code block
  if (inCodeBlock && currentCodeBlock.length > 0) {
    formattedElements.push(
      <div key="code-end" className="question-code">
        <code>{currentCodeBlock.join('\n')}</code>
      </div>
    );
  }
  
  return formattedElements;
};

export function meta() {
  return [
    { title: 'Mock Test - HPC Goat' },
    { name: 'description', content: 'Take a mock test to test your HPC knowledge' },
  ];
}

export default function MockTest() {
  const location = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showTopicFilter, setShowTopicFilter] = useState(false);

  // Load available topics on component mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await mockTestAPI.getTopics();
        setAvailableTopics(response.data);
      } catch (err) {
        console.error('Failed to load topics:', err);
      }
    };
    loadTopics();
  }, []);

  const startTest = async () => {
    setLoading(true);
    setError(null);
    setTestStarted(false);
    setTestSubmitted(false);
    setResult(null);
    setAnswers({});

    try {
      const topicsToUse = selectedTopics.length > 0 ? selectedTopics : undefined;
      const response = await mockTestAPI.startTest(1000, topicsToUse); // Get all questions
      setQuestions(response.data.questions);
      setTestStarted(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to start test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSelectAllTopics = () => {
    setSelectedTopics(availableTopics);
  };

  const handleClearTopics = () => {
    setSelectedTopics([]);
  };

  const submitTest = async () => {
    setLoading(true);
    setError(null);

    try {
      const answersArray: AnswerSubmission[] = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        question_id: parseInt(questionId),
        selected_answer: selectedAnswer
      }));

      const response = await mockTestAPI.submitTest(answersArray);
      setResult(response.data);
      setTestSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setQuestions([]);
    setAnswers({});
    setTestStarted(false);
    setTestSubmitted(false);
    setResult(null);
    setError(null);
    setSelectedTopics([]);
    setShowTopicFilter(false);
  };

  if (loading && !testStarted) {
    return (
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1>HPC Goat</h1>
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

        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <h3>Preparing your test...</h3>
            <p>Loading questions from our database</p>
          </div>
        </div>
      </div>
    );
  }

  if (!testStarted) {
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

        <div className="test-intro">
          <div className="test-intro-content">
            <h2 className="test-title">Ready to Test Your HPC Knowledge?</h2>
            <p className="test-description">
              Challenge yourself with all available questions from our comprehensive HPC database. 
              Test your understanding of parallel computing, distributed systems, and high-performance algorithms.
            </p>
            
            <div className="test-features">
              <div className="feature">
                <span className="feature-icon">⏱️</span>
                <span>No time limit</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Instant results</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>All questions</span>
              </div>
            </div>

            {/* Topic Filter Section */}
            {availableTopics.length > 0 && (
              <div className="topic-filter-section">
                <div className="topic-filter-header">
                  <h3>Filter by Topics (Optional)</h3>
                  <button 
                    type="button"
                    onClick={() => setShowTopicFilter(!showTopicFilter)}
                    className="btn btn-secondary btn-sm"
                  >
                    {showTopicFilter ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
                
                {showTopicFilter && (
                  <div className="topic-filter-content">
                    <div className="topic-filter-actions">
                      <button 
                        type="button"
                        onClick={handleSelectAllTopics}
                        className="btn btn-outline btn-sm"
                      >
                        Select All
                      </button>
                      <button 
                        type="button"
                        onClick={handleClearTopics}
                        className="btn btn-outline btn-sm"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="topic-checkboxes">
                      {availableTopics.map((topic) => (
                        <label key={topic} className="topic-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => handleTopicToggle(topic)}
                          />
                          <span className="checkbox-label">{topic}</span>
                        </label>
                      ))}
                    </div>
                    
                    {selectedTopics.length > 0 && (
                      <div className="selected-topics">
                        <strong>Selected topics:</strong> {selectedTopics.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="alert error">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <h4>Error</h4>
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            <button onClick={startTest} className="btn btn-primary btn-lg">
              <span className="btn-icon">🚀</span>
              Start Mock Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (testSubmitted && result) {
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

        <div className="results-section">
          <div className="results-card">
            <div className="results-header">
              <h2 className="results-title">Test Results</h2>
              <div className={`results-score ${result.passed ? 'pass' : 'fail'}`}>
                <span className="score-number">{result.score_percentage}%</span>
                <span className="score-label">Score</span>
              </div>
            </div>
            
            <div className="results-status">
              <div className={`status-badge ${result.passed ? 'pass' : 'fail'}`}>
                {result.passed ? '🎉 PASSED' : '❌ FAILED'}
              </div>
            </div>
            
            <div className="results-details">
              <div className="detail-item">
                <span className="detail-label">Total Questions</span>
                <span className="detail-value">{result.total_questions}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Correct Answers</span>
                <span className="detail-value">{result.correct_answers}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Incorrect Answers</span>
                <span className="detail-value">{result.total_questions - result.correct_answers}</span>
              </div>
            </div>
            
            <div className="results-actions">
              <button onClick={resetTest} className="btn btn-primary btn-lg">
                <span className="btn-icon">🔄</span>
                Take Another Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Sticky Progress Bar */}
      <div className="sticky-progress">
        <div className="test-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {Object.keys(answers).length} / {questions.length} answered
            {Object.keys(answers).length < questions.length}
          </span>
        </div>
      </div>

      <div className="test-section">
        <div className="test-header">
          <h2 className="test-title">Mock Test in Progress</h2>
        </div>
        
        {error && (
          <div className="alert error">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <h4>Error</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="questions-container">
          {questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                <div className="question-meta">
                  {question.topic && (
                    <span className="question-topic">{question.topic}</span>
                  )}
                  <span className="question-status">
                    {answers[question.id] ? '✓ Answered' : '○ Not answered'}
                  </span>
                </div>
              </div>
              <div className="question-text">
                {formatQuestionText(question.question_text)}
              </div>
              <div className="options">
                {['a', 'b', 'c', 'd'].map(option => (
                  <label 
                    key={option} 
                    className={`option ${answers[question.id] === question[`option_${option}` as keyof Question] ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={question[`option_${option}` as keyof Question] as string}
                      checked={answers[question.id] === question[`option_${option}` as keyof Question]}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                    <span className="option-letter">{option.toUpperCase()}</span>
                    <span className="option-text">{question[`option_${option}` as keyof Question] as string}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="test-footer">
          <div className="test-summary">
            <div className="summary-item">
              <span className="summary-label">Progress</span>
              <span className="summary-value">
                {Object.keys(answers).length} / {questions.length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Completion</span>
              <span className="summary-value">
                {Math.round((Object.keys(answers).length / questions.length) * 100)}%
              </span>
            </div>
          </div>
          
          <button 
            onClick={submitTest} 
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Submitting...
              </>
            ) : (
              <>
                <span className="btn-icon">📤</span>
                Submit Test
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
