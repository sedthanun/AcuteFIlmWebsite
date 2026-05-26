import { notFound } from 'next/navigation';
import { fetchFirestoreCollection } from '@/lib/firestore-rest';
import VideoPlayerTrigger from './VideoPlayerTrigger';

export async function generateStaticParams() {
  const movies = await fetchFirestoreCollection('movies');
  return movies.map((item) => ({ slug: item.slug })).filter((item) => item.slug);
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const movies = await fetchFirestoreCollection('movies');
  const movie = movies.find((item) => (item.slug || '').toLowerCase() === (slug || '').toLowerCase());

  if (!movie) {
    return { title: 'Not Found | AcuteFilm' };
  }

  const SITE_URL = 'https://acutefilmmovies-v2.web.app';
  const description = (movie.synopsis || '').substring(0, 160) + (movie.synopsis?.length > 160 ? '...' : '');
  const imagePath = movie.hero || movie.poster || '';
  const imageUrl = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const absoluteImageUrl = `${SITE_URL}${encodeURI(imageUrl)}`;

  return {
    title: `${movie.name} | AcuteFilm`,
    description,
    openGraph: {
      title: `${movie.name} | AcuteFilm`,
      description,
      images: [
        {
          url: absoluteImageUrl,
          secureUrl: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: movie.name,
          type: 'image/jpeg',
        },
      ],
      url: `${SITE_URL}/movies/${slug}`,
      siteName: 'AcuteFilm',
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.name} | AcuteFilm`,
      description,
      images: [absoluteImageUrl],
    }
  };
}

export default async function MovieDetail({ params }) {
  const resolvedParams = await params;
  const movies = await fetchFirestoreCollection('movies');
  const movie = movies.find((item) => (item.slug || '').toLowerCase() === (resolvedParams.slug || '').toLowerCase());

  if (!movie) {
    notFound();
  }

  const isOriginal = (movie.type || '').toLowerCase().includes('acutefilm');
  const themeColor = isOriginal ? 'var(--primary-color)' : '#ffb400';
  const roleText = movie.contribution || (isOriginal ? 'Full Production' : 'VFX Work');
  const roles = roleText.split(',').map(r => r.trim());

  let videoUrl = movie.video || '';
  if (videoUrl && !videoUrl.includes('autoplay=')) {
      videoUrl += (videoUrl.includes('?') ? '&' : '?') + "autoplay=1";
  }

  return (
    <>
      <section className="hero" id="movie-hero" style={{ height: '60vh', alignItems: 'flex-start', paddingBottom: '4rem' }}>
        <img id="hero-bg" src={(movie.hero || movie.poster)?.startsWith('/') ? (movie.hero || movie.poster) : `/${movie.hero || movie.poster}`} alt={movie.name} className="hero-bg" style={{ filter: 'brightness(0.4) blur(10px)' }} />
        <div className="hero-overlay" style={{ background: 'linear-gradient(to top, var(--bg-color), transparent)' }}></div>
        <div className="container">
            <div className="hero-content">
                <h1 id="movie-title-hero" style={{ fontSize: '4rem', fontWeight: 700 }}>{movie.name}</h1>
                <p id="movie-genre-hero" style={{ color: themeColor, fontWeight: 600, marginBottom: '0.8rem' }}>{movie.genre}</p>
                <div id="movie-type-hero" style={{ color: themeColor, fontSize: '0.85rem', fontWeight: 'normal', opacity: 0.8, letterSpacing: '2px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem', display: 'inline-block' }}>
                  {movie.type || ''}
                </div>
            </div>
        </div>
      </section>

      <section className="news-section" style={{ paddingTop: 0, marginTop: '-100px', position: 'relative', zIndex: 10 }}>
        <div className="container movie-detail-container">
            <div className="movie-details-info">
                <div className="glass" style={{ padding: '3rem', borderRadius: '24px', marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>เรื่องย่อ (Synopsis)</h2>
                    <p
                        id="movie-synopsis"
                        style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem', whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ __html: movie.synopsis || '' }}
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', borderTop: '1px solid var(--surface-border)', paddingTop: '2rem' }}>
                        <div>
                            <h5 style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Release Year</h5>
                            <p id="movie-release" style={{ fontWeight: 600 }}>{movie.release}</p>
                        </div>
                        <div>
                            <h5 style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Director</h5>
                            <p id="movie-director" style={{ fontWeight: 600 }}>{movie.director || 'Sedthanun Chongchetdee'}</p>
                        </div>
                        <div>
                            <h5 style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Our Role</h5>
                            <p id="movie-role" style={{ fontWeight: 600 }}>
                              {roles.map((r, i) => <span key={i}>{r}<br/></span>)}
                            </p>
                        </div>
                        <div>
                            <h5 style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Actors</h5>
                            <p id="movie-actors" style={{ fontWeight: 600 }}>{movie.actors}</p>
                        </div>
                    </div>
                </div>

                <VideoPlayerTrigger videoUrl={videoUrl} thumbnail={(movie.hero || movie.poster)?.startsWith('/') ? (movie.hero || movie.poster) : `/${movie.hero || movie.poster}`} />

                <div className="share-links" style={{ marginTop: '3rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                    <a id="fb-share" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://acutefilmmovies-v2.web.app/movies/${movie.slug}`)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.7, transition: '0.3s' }}>
                        <i className="fab fa-facebook fa-2x"></i> <span>Share</span>
                    </a>
                    <a id="tw-share" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://acutefilmmovies-v2.web.app/movies/${movie.slug}`)}&text=${encodeURIComponent(`Watching ${movie.name}`)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.7, transition: '0.3s' }}>
                        <i className="fab fa-x-twitter fa-2x"></i> <span>Post</span>
                    </a>
                </div>
            </div>

            <div className="movie-poster-sidebar">
                <img id="movie-poster-img" src={movie.poster?.startsWith('/') ? movie.poster : `/${movie.poster}`} alt={movie.name} style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid var(--surface-border)' }} />
            </div>

        </div>
      </section>
    </>
  );
}
