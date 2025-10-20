import React from "react";
import { Link, useLocation } from "react-router";

export function meta() {
  return [
    { title: "HPC Goat" },
    { name: "description", content: "Master HPC concepts with interactive mock tests" },
  ];
}

export default function Home() {
  const location = useLocation();

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
          className={`${location.pathname === '/upload' ? 'active' : ''}`}  
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
        <div className="hero-content flex flex-col gap-2">
          <h3 className="text-2xl font-bold">How to Use</h3>
          <p className="text-sm">Copy your questions the exact same way as the video for the parsing to work</p>
          <div className="video-container">
            <script src="https://fast.wistia.com/player.js" async></script>
            <script src="https://fast.wistia.com/embed/hadv0f62mk.js" async type="module"></script>
            <style dangerouslySetInnerHTML={{
              __html: `wistia-player[media-id='hadv0f62mk']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/hadv0f62mk/swatch'); display: block; filter: blur(5px); padding-top:50.44%; }`
            }}></style>
            <wistia-player media-id="hadv0f62mk" aspect="1.9825750242013553"></wistia-player>
          </div>
        </div>
      </div>
    </div>
  );
}
