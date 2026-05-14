'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('https://firestore.googleapis.com/v1/projects/acutefilmmovies/databases/(default)/documents/news');
        if (res.ok) {
          const data = await res.json();
          if (data.documents) {
            const newsList = data.documents.map(doc => {
              const item = { id: doc.name.split('/').pop() };
              for (const [key, value] of Object.entries(doc.fields)) {
                item[key] = value.stringValue || value.integerValue || value.booleanValue || '';
              }
              return item;
            });
            // เอาแค่ 3 ข่าวล่าสุด โดยเรียงจากวันที่
            setNews(newsList.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3));
          }
        }
      } catch (error) {
        console.error('Error loading news from Firestore:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  useEffect(() => {
    if (loading || news.length === 0) return;

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.news-card-animate');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [loading, news]);

  return (
    <section className="news-section animate-on-scroll" ref={sectionRef}>
      <div className="container">
        <div className="section-title">
          <h2>Our News</h2>
          <hr />
        </div>

        <div className="news-grid" id="news-container">
          {loading ? (
            <div className="loading-spinner-container" style={{ gridColumn: '1 / -1', padding: '3rem 0' }}>
              <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
          ) : (
            news.map((item, index) => (
              <div
                key={item.id || index}
                className="news-card news-card-animate"
                style={{ opacity: 0, transform: 'translateY(30px)', transition: `all 0.6s ease-out ${index * 0.1}s` }}
              >
                <img src={item.poster?.startsWith('/') ? item.poster : `/${item.poster}`} alt={item.name} loading="lazy" />
                <div className="card-content">
                  <span className="category-tag" style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    {item.category}
                  </span>
                  <h3>{item.name}</h3>
                  <Link href={`/news/${item.slug}`} className="card-link">อ่านต่อ</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
