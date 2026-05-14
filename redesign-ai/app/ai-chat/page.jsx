import ChatClient from './ChatClient';
import './ai-chat.css'; // Make sure styles are loaded

export const metadata = {
  title: 'คุยกับ AI | AcuteFilm',
  description: 'ผู้ช่วยอัจฉริยะของ AcuteFilm — ถามอะไรก็ได้เกี่ยวกับบริษัทและผลงานภาพยนตร์ของเรา',
};

export default function AiChatPage() {
  return <ChatClient initialMovies={[]} />;
}

