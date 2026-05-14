'use client';
import { useState, useEffect } from 'react';

export default function VideoModal() {
  const [isActive, setIsActive] = useState(false);
  const videoUrl = "https://www.youtube.com/embed/utHQKQkClao?si=zGyGdqgCKFquyU-J&autoplay=1&mute=1";
  
  useEffect(() => {
    // Check if it's the first time in this session
    if (!sessionStorage.getItem('videoShown')) {
      const timer = setTimeout(() => {
        setIsActive(true);
        document.body.style.overflow = 'hidden';
        sessionStorage.setItem('videoShown', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsActive(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div id="videoModal" className={`vm-modal ${isActive ? 'active' : ''}`} onClick={(e) => {
      if (e.target.id === 'videoModal') closeModal();
    }}>
      <div className="vm-container">
        <button id="closeModal" className="vm-close" aria-label="Close Video" onClick={closeModal}>
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
}
