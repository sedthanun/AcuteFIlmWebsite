import ChatClient from './ChatClient';
import './ai-chat.css'; // Make sure styles are loaded
import { fetchFirestoreCollection } from '@/lib/firestore-rest';

export const metadata = {
  title: 'คุยกับ AI | AcuteFilm',
  description: 'ผู้ช่วยอัจฉริยะของ AcuteFilm — ถามอะไรก็ได้เกี่ยวกับบริษัทและผลงานภาพยนตร์ของเรา',
};

export default async function AiChatPage() {
  let movies = [];

  try {
    movies = await fetchFirestoreCollection('movies');
    movies.sort((a, b) => String(b.release || '').localeCompare(String(a.release || '')));
  } catch (error) {
    console.error('AI chat movie prefetch failed:', error);
  }

  return <ChatClient initialMovies={movies} />;
}
