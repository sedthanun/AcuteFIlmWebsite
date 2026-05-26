import HeroSlider from '@/components/HeroSlider';
import TypingText from '@/components/TypingText';
import NewsSection from '@/components/NewsSection';
import SiteVisitor from '@/components/SiteVisitor';
import VideoModal from '@/components/VideoModal';
import { fetchFirestoreCollection } from '@/lib/firestore-rest';

function buildHeroSlides(movieList) {
  const movies = movieList.map((item) => {
    const slug = (item.slug || item.id || '').toLowerCase();
    const imagePath = item.hero || '';

    const customTags = {
      'the-fame': { text: 'AcuteFilm Originals', color: 'var(--primary-color)' },
      'bystander': { text: 'VFX By AcuteFilm', color: '#ffb400' },
      'good-old-friend': { text: 'AcuteFilm Originals', color: 'var(--primary-color)' }
    };

    const currentTag = customTags[slug] || { text: 'AcuteFilm Original', color: 'var(--primary-color)' };

    return {
      id: item.slug || item.id,
      title: item.name,
      subtitle: (item.synopsis || '').substring(0, 100) + '...',
      image: imagePath.startsWith('/') ? imagePath : `/${imagePath}`,
      tag: currentTag.text,
      tagColor: currentTag.color,
      isGof: (slug === 'good-old-friend'),
      release: item.release || '',
    };
  });

  const order = ['the-fame', 'bystander', 'good-old-friend'];
  const finalSlides = [];

  order.forEach((slug) => {
    const movie = movies.find((entry) => (entry.id || '').toLowerCase() === slug);
    if (movie) finalSlides.push(movie);
  });

  if (finalSlides.length < 3) {
    const extras = movies
      .filter((entry) => !order.includes((entry.id || '').toLowerCase()))
      .sort((a, b) => (b.release || '').localeCompare(a.release || ''));

    while (finalSlides.length < 3 && extras.length > 0) {
      finalSlides.push(extras.shift());
    }
  }

  return finalSlides;
}

export default async function Home() {
  const [movies, news] = await Promise.all([
    fetchFirestoreCollection('movies'),
    fetchFirestoreCollection('news'),
  ]);

  const heroSlides = buildHeroSlides(movies);
  const latestNews = news.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3);

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <TypingText />
      <NewsSection news={latestNews} />
      <SiteVisitor />
      <VideoModal />
    </>
  );
}
