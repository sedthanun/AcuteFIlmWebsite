'use client';
import { useState, useEffect } from 'react';

import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname === '/admin') return null;

  return (
    <button 
      id="scrollToTopBtn" 
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`} 
      aria-label="Scroll to top"
      onClick={scrollToTop}
    >
      <i className="fas fa-chevron-up"></i>
    </button>
  );
}
