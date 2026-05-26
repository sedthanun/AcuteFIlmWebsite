import Link from 'next/link';
import { fetchFirestoreCollection } from '@/lib/firestore-rest';

export const metadata = {
  title: 'ข่าวสาร | AcuteFilm',
  description: 'ข่าวสารและอัปเดตล่าสุดจาก AcuteFilm'
};

export default async function NewsPage() {
  const newsList = await fetchFirestoreCollection('news');
  const sortedNews = newsList.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  return (
    <>
      <section className="hero" id="news-hero" style={{ height: '50vh' }}>
        <img src="/img/lens.jpg" alt="News Hero" className="hero-bg" />
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-color))' }}></div>
        <div className="container">
            <div className="hero-content">
                <h1>ข่าวสาร กิจกรรม</h1>
                <p>อัปเดตข่าวสารล่าสุดจาก AcuteFilm<br/>และเบื้องหลังการถ่ายทำ</p>
            </div>
        </div>
      </section>

      <section className="news-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="news-grid">
            {sortedNews.length === 0 ? (
              <p style={{ color: 'red', gridColumn: '1 / -1', textAlign: 'center' }}>ไม่สามารถโหลดข้อมูลข่าวสารได้ หรือยังไม่มีข้อมูล</p>
            ) : (
              sortedNews.map((item) => (
                <div key={item.id || item.slug} className="news-card">
                  <img src={item.poster?.startsWith('/') ? item.poster : `/${item.poster}`} alt={item.name} loading="lazy" />
                  <div className="card-content">
                    <span className="category-tag" style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    <h3>{item.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.date}</p>
                    <Link href={`/news/${item.slug}`} className="card-link">
                      อ่านต่อ
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
