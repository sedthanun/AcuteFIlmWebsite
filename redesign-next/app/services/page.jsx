export default function Services() {
  return (
    <>
      <style>{`
        .client-grid {
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 3rem; 
            align-items: center; 
            justify-items: center;
        }
        @media (max-width: 768px) {
            .client-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
            }
        }
        .client-logo-wrapper {
            width: 100%;
            max-width: 200px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .client-logo-wrapper img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: grayscale(1) brightness(0.8) opacity(0.5);
            transition: all 0.3s ease;
        }
        .client-logo-wrapper:hover img {
            filter: grayscale(0) brightness(1) opacity(1) !important;
            transform: scale(1.1);
        }
      `}</style>

      <section className="hero" style={{ height: '60vh', padding: 0, position: 'relative', overflow: 'hidden' }}>
        <img src="/img/hero3.jpg" alt="Production Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), var(--bg-color))', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
      </section>

      <section className="news-section">
        <div className="container">
          <div className="section-title">
            <h2>Who I've worked with</h2>
            <hr />
          </div>
          <div className="glass" style={{ padding: '5rem 3rem', borderRadius: '30px' }}>
            <div className="client-grid">
              <div className="client-logo-wrapper">
                <img src="/img/logo-1.png" alt="Client 1" />
              </div>
              <div className="client-logo-wrapper">
                <img src="/img/logo-2.png" alt="Phoenix Next" />
              </div>
              <div className="client-logo-wrapper">
                <img src="/img/logo-3.png" alt="M Studio" />
              </div>
              <div className="client-logo-wrapper">
                <img src="/img/logo-4.png" alt="Shinesaeng" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="news-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-title">
            <h2>Showreel</h2>
            <hr />
          </div>
          <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid var(--surface-border)' }}>
            <iframe 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              src="https://www.youtube.com/embed/rEqWoTIXiSw" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </section>
    </>
  );
}
