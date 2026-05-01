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
        // เพิ่ม Cache Buster เพื่อให้ได้ข้อมูลล่าสุดเหมือนในหน้า Movie Detail
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/acutefilmmovies/databases/(default)/documents/movies?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.documents) {
            const movies = data.documents.map(doc => {
              const item = { id: doc.name.split('/').pop() };
              for (const [key, value] of Object.entries(doc.fields)) {
                item[key] = value.stringValue || value.integerValue || value.booleanValue || '';
              }
              
              const slug = (item.slug || item.id || '').toLowerCase();
              const imagePath = item.hero || '';
              
              // Custom Tag สำหรับแต่ละเรื่อง (แก้ไขตรงนี้ได้เลยทั้งข้อความและสี)
              const customTags = {
                'the-fame': { text: 'AcuteFilm Original', color: 'var(--primary-color)' },
                'bystander': { text: 'VFX By AcuteFilm', color: '#ffb400' },
                'good-old-friend': { text: 'AcuteFilm Original', color: 'var(--primary-color)' }
              };
              
              const currentTag = customTags[slug] || { text: 'AcuteFilm Original', color: 'var(--primary-color)' };
              
              return {
                id: item.slug || item.id,
                title: item.name,
                subtitle: (item.synopsis || '').substring(0, 100) + '...',
                image: imagePath.startsWith('/') ? imagePath : `/${imagePath}`,
                tag: currentTag.text,
                tagColor: currentTag.color,
                isGof: (slug === 'good-old-friend')
              };
            });
            
            // กำหนดลำดับสไลด์ตามที่คุณลูกค้าต้องการ
            const order = ['the-fame', 'bystander', 'good-old-friend'];
            const finalSlides = [];
            
            order.forEach(slug => {
              const movie = movies.find(m => (m.id || '').toLowerCase() === slug);
              if (movie) finalSlides.push(movie);
            });

            // ถ้าหา 3 เรื่องบนไม่เจอ (เผื่อไว้) ให้เอาเรื่องใหม่ล่าสุดมาเติมให้ครบ 3
            if (finalSlides.length < 3) {
              const extras = movies
                .filter(m => !order.includes((m.id || '').toLowerCase()))
                .sort((a, b) => (b.release || '').localeCompare(a.release || ''));
              
              while (finalSlides.length < 3 && extras.length > 0) {
                finalSlides.push(extras.shift());
              }
            }

            setSlides(finalSlides);
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
          <img src={`${slide.image}?t=${Date.now()}`} alt={slide.title} className={`hero-bg ${slide.isGof ? 'gof-bg' : ''}`} />
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
