'use client';
import { useState, useEffect } from 'react';

export default function TypingText() {
  const words = ["Video Production", "Video Editing", "Visual Effects", "Motion Graphics", "Color Grading"];
  const [wordIndex, setWordIndex] = useState(0);
  const [fadeType, setFadeType] = useState('fade-in');

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setFadeType('fade-out');
      
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFadeType('fade-in');
      }, 500); // Wait for fade out to complete
      
    }, 3000);

    return () => clearInterval(wordInterval);
  }, []);

  return (
    <section className="what-we-do">
      <div className="container">
        <h2 className="section-title">What we do?</h2>
        <div className="typing-container">
          <span id="typing-text" className={fadeType === 'fade-out' ? 'fade-out' : ''}>
            {words[wordIndex]}
          </span>
        </div>
      </div>
    </section>
  );
}
