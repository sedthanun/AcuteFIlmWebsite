import Link from 'next/link';

// ดึงข้อมูลล่วงหน้า (Pre-rendering / SSG) เพื่อให้โหลดเร็วขึ้น
async function getMovies() {
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/acutefilmmovies/databases/(default)/documents/movies?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.documents) {
        const movies = data.documents.map(doc => {
          const fields = doc.fields;
          const item = { id: doc.name.split('/').pop() };
          for (const [key, value] of Object.entries(fields)) {
            item[key] = value.stringValue || value.integerValue || value.booleanValue || '';
          }
          return item;
        });
        return movies.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
      }
    }
  } catch (error) {
    console.error('REST API Error:', error);
  }

    return [];
}

export const metadata = {
  title: 'ผลงานภาพยนตร์ | AcuteFilm',
  description: 'ผลงานภาพยนตร์สั้น ภาพยนตร์ Featured film และซีรีส์ที่ได้ร่วมทำ'
};

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <>
      <section className="hero" id="movie-hero" style={{ height: '50vh' }}>
        <img src="/img/lights.jpg" alt="Movie Hero" className="hero-bg" style={{ objectPosition: 'center 20%' }} />
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-color))' }}></div>
        <div className="container">
            <div className="hero-content">
                <h1>ภาพยนตร์</h1>
                <p>ผลงานภาพยนตร์สั้น,<br/>ภาพยนตร์ Featured film และซีรีส์ที่ได้ร่วมทำ</p>
            </div>
        </div>
      </section>

      <section className="news-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="movie-grid">
            {movies.length === 0 ? (
                <p style={{ color: 'red', gridColumn: '1 / -1', textAlign: 'center' }}>ไม่สามารถโหลดข้อมูลหนังได้ หรือยังไม่มีข้อมูล</p>
            ) : (
                movies.map(item => {
                    const isOriginal = (item.type || '').toLowerCase().includes('acutefilm');
                    const themeColor = isOriginal ? 'var(--primary-color)' : '#ffb400';

                    return (
                        <div key={item.id} className="movie-card">
                            <img src={item.poster?.startsWith('/') ? item.poster : `/${item.poster}`} alt={item.name} loading="lazy" />
                            <div className="card-content">
                                <h3>{item.name}</h3>
                                <p style={{ color: themeColor, fontSize: '0.8rem', marginBottom: '0.8rem', fontWeight: 'bold' }}>{item.type || ''}</p>
                                <Link href={`/movies/${item.slug}`} className="card-link" style={{ fontSize: '0.9rem' }}>
                                    ดูเพิ่มเติม
                                </Link>
                            </div>
                        </div>
                    );
                })
            )}
          </div>
        </div>
      </section>
    </>
  );
}
