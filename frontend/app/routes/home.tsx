import React from "react";
import { Link, useLocation } from "react-router";

export function meta() {
  return [
    { title: "HPC Saviour" },
    { name: "description", content: "Master HPC concepts with interactive mock tests" },
  ];
}

export default function Home() {
  const location = useLocation();

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1>HPC Saviour</h1>
          <p>Master HPC concepts with interactive mock tests</p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
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

      <div className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Master High Performance Computing</h2>
          <p className="hero-subtitle">
            Practice with real HPC questions, track your progress, and ace your exams. 
            Our intelligent system adapts to your learning pace.
          </p>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Comprehensive Question Bank</h3>
          <p>Access hundreds of carefully curated HPC questions covering all major topics from parallel computing to distributed systems.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Smart Mock Tests</h3>
          <p>Take adaptive mock tests that focus on your weak areas and provide detailed explanations for each answer.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Progress Tracking</h3>
          <p>Monitor your improvement with detailed analytics and performance metrics to optimize your study strategy.</p>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h3>Ready to Start Learning?</h3>
          <p>Choose your path and begin your HPC mastery journey today.</p>
          <div className="cta-buttons">
            <Link to="/upload" className="btn btn-primary">
              <span className="btn-icon">📤</span>
              Upload Questions
            </Link>
            <Link to="/mocktest" className="btn btn-secondary">
              <span className="btn-icon">🧠</span>
              Take Mock Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
