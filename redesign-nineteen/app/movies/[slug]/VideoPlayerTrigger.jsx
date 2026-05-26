'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function VideoPlayerTrigger({ videoUrl, thumbnail }) {
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = (
    <div className={`vm-modal ${isActive ? 'active' : ''}`} onClick={(e) => {
        if(e.target.className.includes('vm-modal')) setIsActive(false);
    }}>
      <div className="vm-container">
        <button className="vm-close" aria-label="Close Video" onClick={() => setIsActive(false)}>
          <i className="fas fa-times"></i>
        </button>
        <div className="vm-video-wrapper">
          <iframe 
            id="videoPlayer" 
            src={isActive ? videoUrl : undefined} 
            frameBorder="0" 
            allow="autoplay; encrypted-media" 
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="vm-trigger-wrapper glass" 
        onClick={() => setIsActive(true)}
        style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', cursor: 'pointer', position: 'relative' }}
      >
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <img src={thumbnail} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} alt="Video Thumbnail" />
          <div className="play-button-overlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '2rem', transition: '0.3s', boxShadow: '0 0 30px var(--primary-glow)' }}>
            <i className="fas fa-play" style={{ marginLeft: '5px' }}></i>
          </div>
        </div>
      </div>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
