'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSlider() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeroMovies() {
      try {
        const res = await fetch('https://firestore.googleapis.com/v1/projects/acutefilmmovies/databases/(default)/documents/movies');
        if (res.ok) {
          const data = await res.json();
          if (data.documents) {
            const movies = data.documents.map(doc => {
              const item = { id: doc.name.split('/').pop() };
              for (const [key, value] of Object.entries(doc.fields)) {
                item[key] = value.stringValue || value.integerValue || value.booleanValue || '';
              }
              
              const isOriginal = (item.type || '').toLowerCase().includes('acutefilm');
              const image = item.hero || item.poster || '';
              
              return {
                id: item.slug || item.id,
                title: item.name,
                subtitle: (item.synopsis || '').substring(0, 100) + '...',
                image: image.startsWith('/') ? image : `/${image}`,
                tag: item.type || (isOriginal ? 'AcuteFilm Originals' : 'VFX Work'),
                tagColor: isOriginal ? 'var(--primary-color)' : '#ffb400',
                isGof: (item.slug === 'Good-Old-Friend')
              };
            });
            
            // เลือก 3 เรื่องล่าสุด (หรือเรื่องที่มี hero image)
            setSlides(movies.sort((a, b) => (b.release || '').localeCompare(a.release || '')).slice(0, 3));
          }
        }
      } catch (error) {
        console.error('Error loading hero movies:', error);
      } finally {
        setLoading(false);
      }
    }
    loadHeroMovies();
  }, []);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading || slides.length === 0) {
    return (
      <section className="hero" id="hero-slider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </section>
    );
  }

  return (
    <section className="hero" id="hero-slider">
      {slides.map((slide, index) => (
        <div key={slide.id} className={`slide ${index === currentSlideIndex ? 'active' : ''}`}>
          <img src={slide.image} alt={slide.title} className={`hero-bg ${slide.isGof ? 'gof-bg' : ''}`} />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="originals-tag" style={{ color: slide.tagColor, fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '2px' }}>
              {slide.tag}
            </div>
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <Link href={`/movies/${slide.id}`} className="btn-primary">ดูเพิ่มเติม</Link>
          </div>
        </div>
      ))}

      <div className="slider-nav-container">
        <div className="slider-nav-pill">
          <div className="nav-arrows">
            <button className="nav-btn" onClick={prevSlide}><i className="fas fa-chevron-left"></i></button>
            <button className="nav-btn" onClick={nextSlide}><i className="fas fa-chevron-right"></i></button>
          </div>
          
          <div className="nav-items">
            {slides.map((slide, index) => (
              <div key={`nav-${index}`} className={`nav-item ${index === currentSlideIndex ? 'active' : ''}`} onClick={() => setCurrentSlideIndex(index)}>
                <span className="title">{slide.title}</span>
              </div>
            ))}
          </div>

          <div className="nav-controls">
            <button className="nav-btn" onClick={() => setIsPaused(!isPaused)}>
              <i className={`fas fa-${isPaused ? 'play' : 'pause'}`}></i>
            </button>
          </div>

          <div className="pill-progress-track">
            <div 
              key={currentSlideIndex}
              className="pill-progress-bar" 
              style={{
                width: `${100 / slides.length}%`,
                left: `${(currentSlideIndex / slides.length) * 100}%`,
                animation: 'sliderProgress 5s linear forwards',
                animationPlayState: isPaused ? 'paused' : 'running'
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
