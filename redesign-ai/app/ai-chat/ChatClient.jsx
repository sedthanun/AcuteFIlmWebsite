'use client';
import { useState, useEffect, useRef } from 'react';
import { getAiResponse, getTypingDelay, setDynamicMovies } from '@/lib/mockAi';

// Markdown parser: **text** → <strong>, and URLs → clickable links
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#00d2ff;text-decoration:underline;">$1</a>');
}

const WELCOME_MESSAGE = 'สวัสดีครับ! 👋 ผมเป็น AcuteFilm AI ผู้ช่วยอัจฉริยะของ AcuteFilm ครับ\n\nสามารถถามอะไรเกี่ยวกับ AcuteFilm ได้เลยนะครับ เช่น ผลงานภาพยนตร์ บริการ หรือข้อมูลติดต่อ 😊';

const SUGGESTIONS = [
  'AcuteFilm คืออะไร?',
  'หนังที่ทำมีอะไรบ้าง?',
  'มีบริการอะไรบ้าง?',
  'ติดต่อยังไง?',
  'ใครก่อตั้ง?',
  'เล่าเรื่อง The Fame',
];

export default function ChatClient({ initialMovies }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize mockAi with movies on mount — with client-side fallback
  useEffect(() => {
    if (isInitialized) return;

    // If build-time data is available and not empty, use it
    if (initialMovies && initialMovies.length > 0) {
      setDynamicMovies(initialMovies);
      setIsInitialized(true);
      return;
    }

    // Fallback: fetch movies client-side from Firestore REST API
    async function fetchMoviesClient() {
      try {
        const res = await fetch(
          `https://firestore.googleapis.com/v1/projects/acutefilmmovies/databases/(default)/documents/movies?t=${Date.now()}`,
          { cache: 'no-store' }
        );
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
            movies.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
            setDynamicMovies(movies);
          }
        }
      } catch (error) {
        console.error('Client-side movie fetch failed:', error);
      } finally {
        setIsInitialized(true);
      }
    }

    fetchMoviesClient();
  }, [initialMovies, isInitialized]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);



  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || isTyping) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Get AI response
    const response = getAiResponse(userMsg);
    const delay = getTypingDelay(response);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Add bot response
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-container">
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-avatar-container">
            <div className="ai-avatar">🤖</div>
            <div className="ai-avatar-ring"></div>
          </div>
          <h1>AcuteFilm AI</h1>
          <p>ผู้ช่วยอัจฉริยะของ AcuteFilm — ถามได้ทุกเรื่อง!</p>
          <div className="ai-status-badge">
            <span className="ai-status-dot"></span>
            ออนไลน์ • พร้อมตอบ
          </div>
        </div>

        {/* Quick Suggestions */}
        {showSuggestions && (
          <div className="ai-suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="ai-suggestion-btn"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Messages Area */}
        <div className="ai-messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-message ${msg.role}`}>
              <div className="ai-msg-avatar">
                {msg.role === 'bot' ? '🤖' : '👤'}
              </div>
              <div
                className="ai-msg-bubble"
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
              />
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="ai-typing-indicator">
              <div className="ai-msg-avatar" style={{ background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)', boxShadow: '0 4px 15px rgba(0, 210, 255, 0.2)' }}>
                🤖
              </div>
              <div className="ai-typing-dots">
                <span className="ai-typing-dot"></span>
                <span className="ai-typing-dot"></span>
                <span className="ai-typing-dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="ai-input-area">
          <div className="ai-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="ai-input-field"
              placeholder="พิมพ์คำถามที่นี่..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              autoComplete="off"
              id="ai-chat-input"
            />
            <button
              className="ai-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              id="ai-send-button"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          <p className="ai-input-hint">กด Enter เพื่อส่ง • AcuteFilm AI ตอบข้อมูลเกี่ยวกับ AcuteFilm เท่านั้น</p>
        </div>
      </div>
    </div>
  );
}
