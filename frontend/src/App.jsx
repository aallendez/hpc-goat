import { Routes, Route, Link, useLocation } from 'react-router-dom'
import UploadQuestions from './pages/UploadQuestions'
import MockTest from './pages/MockTest'
import './index.css'

function App() {
  const location = useLocation()

  return (
    <div className="container">
      <header className="header">
        <h1>HPC Saviour</h1>
        <p>Master HPC concepts with interactive mock tests</p>
      </header>
      
      <nav className="nav">
        <Link 
          to="/upload" 
          className={location.pathname === '/upload' ? 'active' : ''}
        >
          Upload Questions
        </Link>
        <Link 
          to="/test" 
          className={location.pathname === '/test' ? 'active' : ''}
        >
          Take Mock Test
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<UploadQuestions />} />
        <Route path="/upload" element={<UploadQuestions />} />
        <Route path="/test" element={<MockTest />} />
      </Routes>
    </div>
  )
}

export default App
