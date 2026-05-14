'use client';
import { useEffect } from 'react';

export default function AboutUs() {
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .about-hero {
            padding: 80px 0 20px;
            height: 40vh;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            text-align: center;
            background-color: var(--bg-color);
        }

        .contact-section {
            margin-top: -40px;
            position: relative;
            z-index: 10;
            padding-bottom: 5rem;
        }

        .contact-container {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 2rem;
            width: 100%;
        }

        @media (max-width: 992px) {
            .contact-container {
                grid-template-columns: minmax(0, 1fr);
            }
        }

        @media (max-width: 768px) {
            .about-hero {
                height: auto;
                padding: 120px 0 20px;
            }
            .about-hero h1 {
                font-size: 2.2rem !important;
            }
            .contact-section {
                margin-top: 0;
                padding-bottom: 3rem;
            }
            .contact-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2.5rem;
                width: 100%;
            }
            .contact-glass, .founder-glass {
                background: transparent;
                border: none;
                backdrop-filter: none;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: 2rem;
                width: 100%;
                text-align: center;
                align-items: center;
            }
            .contact-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 0.8rem;
                width: 100%;
            }
            .contact-icon {
                background: transparent;
                border: none;
                width: auto;
                height: auto;
                font-size: 1.5rem;
                color: var(--primary-color);
                margin: 0 auto;
            }
            .contact-text {
                width: 100%;
                text-align: center;
            }
            .contact-text h3 {
                font-size: 0.65rem;
                letter-spacing: 2px;
                color: var(--primary-color);
                margin-bottom: 0.2rem;
                opacity: 0.8;
                text-align: center;
            }
            .contact-text p {
                font-size: 0.95rem;
                font-weight: 400;
                word-break: break-all;
                text-align: center;
            }
            .founder-glass {
                gap: 1.2rem;
            }
            .founder-avatar-wrapper {
                width: 100px;
                height: 100px;
                margin-bottom: 1.5rem;
            }
            .founder-avatar-wrapper::before {
                inset: -6px;
                border-width: 1px;
                opacity: 0.4;
            }
            .founder-name {
                font-size: 1.2rem;
            }
            .founder-title {
                font-size: 0.8rem;
                opacity: 0.7;
            }
            .social-mini {
                justify-content: center;
            }
        }

        .contact-glass {
            padding: 4rem;
            border-radius: 40px;
            display: flex;
            flex-direction: column;
            gap: 3rem;
        }

        .contact-item {
            display: flex;
            gap: 2rem;
            align-items: flex-start;
        }

        .contact-icon {
            width: 60px;
            height: 60px;
            background: rgba(99, 222, 241, 0.1);
            border: 1px solid var(--primary-color);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            font-size: 1.5rem;
            flex-shrink: 0;
            transition: var(--transition);
        }

        .contact-item:hover .contact-icon {
            background: var(--primary-color);
            color: #000;
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(99, 222, 241, 0.3);
        }

        .contact-text h3 {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .contact-text p {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--text-main);
        }

        .founder-glass {
            padding: 3rem;
            border-radius: 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .founder-avatar-wrapper {
            position: relative;
            width: 180px;
            height: 180px;
            margin-bottom: 2rem;
        }

        .founder-avatar-wrapper::before {
            content: '';
            position: absolute;
            inset: -10px;
            border: 2px dashed var(--primary-color);
            border-radius: 50%;
            animation: rotate 10s linear infinite;
            opacity: 0.3;
        }

        @keyframes rotate {
            to { transform: rotate(360deg); }
        }

        .founder-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            border: 4px solid var(--bg-color);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .founder-name {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .founder-title {
            color: var(--primary-color);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 1.5rem;
        }

        .social-mini {
            display: flex;
            gap: 1rem;
        }

        .social-mini a {
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            text-decoration: none;
            transition: var(--transition);
        }

        .social-mini a:hover {
            background: var(--primary-color);
            color: #000;
        }
        
        .reveal-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal-item.active {
            opacity: 1;
            transform: translateY(0);
        }
      `}</style>

      <section className="about-hero">
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '100%' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 8vw, 5.5rem)' }}>ติดต่อเรา</h1>
            <p>ร่วมงานกับเรา</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-container animate-on-scroll">
            <div className="glass contact-glass reveal-item">
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-text">
                  <h3>Email Address</h3>
                  <p>acutefilmofficial<wbr />@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div className="contact-text">
                  <h3>Location</h3>
                  <p>Bangkok, Thailand</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fab fa-line"></i>
                </div>
                <div className="contact-text">
                  <h3>LINE ID</h3>
                  <p>0910158552</p>
                </div>
              </div>

            </div>

            <div className="glass founder-glass reveal-item">
              <div className="founder-avatar-wrapper">
                <img src="/img/big.jpg" alt="Sedthanun Chongchetdee" className="founder-img" />
              </div>
              <h2 className="founder-name">Sedthanun Chongchetdee</h2>
              <p className="founder-title">CEO & Founder</p>
              <div className="social-mini">
                <a href="https://www.facebook.com/bigjjds" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/big.jjds/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
