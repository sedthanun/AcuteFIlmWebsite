import HeroSlider from '@/components/HeroSlider';
import TypingText from '@/components/TypingText';
import NewsSection from '@/components/NewsSection';
import SiteVisitor from '@/components/SiteVisitor';
import VideoModal from '@/components/VideoModal';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <TypingText />
      <NewsSection />
      <SiteVisitor />
      <VideoModal />
    </>
  );
}
