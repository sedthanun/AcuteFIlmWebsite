import { notFound } from 'next/navigation';
import { fetchFirestoreCollection } from '@/lib/firestore-rest';

export async function generateStaticParams() {
  const news = await fetchFirestoreCollection('news');
  return news.map((item) => ({ slug: item.slug })).filter((item) => item.slug);
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const newsItems = await fetchFirestoreCollection('news');
  const news = newsItems.find((item) => (item.slug || '').toLowerCase() === (slug || '').toLowerCase());

  if (!news) {
    return { title: 'Not Found | AcuteFilm' };
  }

  const SITE_URL = 'https://acutefilmmovies.web.app';
  const plainText = (news.content || news.story || '').replace(/<[^>]*>?/gm, '');
  const description = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
  const imagePath = news.poster || '';
  const imageUrl = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const absoluteImageUrl = `${SITE_URL}${encodeURI(imageUrl)}`;

  return {
    title: `${news.name} | AcuteFilm News`,
    description,
    openGraph: {
      title: `${news.name} | AcuteFilm News`,
      description,
      images: [
        {
          url: absoluteImageUrl,
          secureUrl: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: news.name,
          type: 'image/jpeg',
        },
      ],
      url: `${SITE_URL}/news/${slug}`,
      siteName: 'AcuteFilm',
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${news.name} | AcuteFilm News`,
      description,
      images: [absoluteImageUrl],
    }
  };
}

export default async function NewsDetail({ params }) {
  const resolvedParams = await params;
  const newsItems = await fetchFirestoreCollection('news');
  const news = newsItems.find((item) => (item.slug || '').toLowerCase() === (resolvedParams.slug || '').toLowerCase());

  if (!news) {
    notFound();
  }

  const categories = (news.category || 'News').split(',');

  return (
    <>
      <style>{`
        .news-detail-header {
            margin-bottom: 2rem;
        }
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            margin-bottom: 1.5rem;
            transition: color 0.2s ease;
        }
        .back-btn:hover {
            color: var(--text-main);
        }
        .news-category-badge {
            background: rgba(99, 222, 241, 0.05);
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
            padding: 0.35rem 0.9rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            display: inline-block;
            transition: all 0.3s ease;
        }
        .news-category-badge:hover {
            background: var(--primary-color);
            color: #000;
            box-shadow: 0 0 15px rgba(99, 222, 241, 0.4);
        }
        .news-detail-title {
            font-size: clamp(1.6rem, 5vw, 3rem);
            line-height: 1.2;
            color: var(--text-main);
            font-weight: 700;
        }
        .news-detail-card {
            padding: clamp(1.2rem, 4vw, 2.5rem);
            border-radius: 32px;
            overflow: hidden;
        }
        .news-featured-img {
            width: 100%;
            max-width: 900px;
            aspect-ratio: 16 / 9;
            object-fit: cover;
            border-radius: 0;
            margin: 0 auto 2rem auto;
            box-shadow: none;
            display: block;
        }
        .news-body {
            font-size: clamp(1rem, 2.5vw, 1.2rem);
            line-height: 1.9;
            color: var(--text-main);
            margin-bottom: 2rem;
        }
        .news-footer-bar {
            border-top: 1px solid var(--surface-border);
            padding-top: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .news-date {
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        .share-links {
            display: flex;
            gap: 1.5rem;
        }
        .share-links a {
            color: var(--text-main);
            opacity: 0.6;
            transition: 0.3s;
            text-decoration: none;
        }
        .share-links a:hover {
            opacity: 1;
        }
        @media (max-width: 768px) {
            .news-detail-header {
                margin-bottom: 1rem;
            }
            .news-detail-title {
                margin-bottom: 0;
            }
            .news-featured-img {
                width: 100vw;
                max-width: 100vw;
                margin-left: calc(50% - 50vw);
                margin-right: calc(50% - 50vw);
                margin-bottom: 1.5rem;
            }
        }
      `}</style>

      <section className="news-section news-detail-section">
        <div className="container">
          <a href="/news" className="back-btn">
            <i className="fas fa-arrow-left"></i> ย้อนกลับ
          </a>
          <div className="news-detail-header">
            <div id="news-categories-container" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {categories.map((cat, i) => (
                <span key={i} className="news-category-badge">{cat.trim()}</span>
              ))}
            </div>
            <h1 id="news-title-hero" className="news-detail-title">{news.name}</h1>
          </div>

          <img id="news-featured-img" src={news.poster?.startsWith('/') ? news.poster : `/${news.poster}`} alt={news.name} className="news-featured-img" />

          <div className="glass news-detail-card">
            <div id="news-content" className="news-body" dangerouslySetInnerHTML={{ __html: news.content || news.story }}></div>

            <div className="news-footer-bar">
              <div id="news-date" className="news-date">
                เผยแพร่เมื่อ: <strong>{news.date}</strong>
              </div>
              <div className="share-links">
                <a id="fb-share" href={`https://www.facebook.com/sharer/sharer.php?u=https://acutefilmmovies.web.app/news/${news.slug}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook fa-xl"></i></a>
                <a id="tw-share" href={`https://twitter.com/intent/tweet?url=https://acutefilmmovies.web.app/news/${news.slug}&text=${news.name}`} target="_blank" rel="noopener noreferrer"><i className="fas fa-retweet fa-xl"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
