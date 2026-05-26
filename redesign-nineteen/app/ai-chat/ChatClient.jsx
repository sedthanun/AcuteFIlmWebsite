'use client';
import { useState, useEffect, useRef } from 'react';
import { getAiResponseResult, getTypingDelay, setDynamicMovies } from '@/lib/mockAi';

// Markdown parser: **text** → <strong>, and URLs → clickable links
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#00d2ff;text-decoration:underline;">$1</a>');
}

function formatProcessingTime(milliseconds) {
  const seconds = Math.max(milliseconds / 1000, 0.1);
  return `${seconds.toFixed(seconds < 10 ? 1 : 0)} วินาที`;
}

function getCurrentTimestamp() {
  return new Date().getTime();
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

const MOVIE_QUERY_PATTERN = /หนัง|ภาพยนตร์|ผลงาน|portfolio|movie|film|เรื่องย่อ|เล่าเรื่อง|สรุป|สรุปเรื่อง|สรุปหนัง|ดู|รับชม|trailer|ตัวอย่าง/i;
const LOW_SIGNAL_PATTERN = /^[\s\d\W_]*$|^.$/u;
const PRICING_PATTERN = /(ราคา|เรต|ค่าใช้จ่าย|งบ|budget|quote|quotation|cost|price|pricing|เท่าไหร่|กี่บาท)/i;
const INITIALIZATION_RETRY_COUNT = 50;
const INITIALIZATION_RETRY_DELAY = 100;
const MOVIE_DATA_UNAVAILABLE_MESSAGE = 'ขออภัยครับ ตอนนี้ยังโหลดข้อมูลภาพยนตร์ไม่ได้ ลองรีเฟรชหน้าเว็บหรือกลับมาถามใหม่อีกครั้งนะครับ';
const API_FALLBACK_MESSAGE = 'ขอโทษครับ ผมยังไม่สามารถช่วยคุณในเรื่องนี้ได้ครับ แต่ถ้าเป็นเรื่อง AcuteFilm ผลงาน บริการ หรือช่องทางติดต่อ ถามได้เลยครับ';

async function getOpenRouterResponse(message) {
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`AI API failed: ${response.status}`);
  }

  const data = await response.json();
  const answer = data?.answer || data?.text;
  if (!answer) {
    throw new Error('AI API returned an empty response');
  }

  return answer;
}

export default function ChatClient({ initialMovies }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initializedRef = useRef(false);
  const hasMovieDataRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize mockAi with build-time movie data only
  useEffect(() => {
    if (isInitialized) return;

    if (initialMovies && initialMovies.length > 0) {
      setDynamicMovies(initialMovies);
      hasMovieDataRef.current = true;
      initializedRef.current = true;
      setIsInitialized(true);
      return;
    }

    initializedRef.current = true;
    setIsInitialized(true);
  }, [initialMovies, isInitialized]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);



  const waitForInitialization = async () => {
    if (initializedRef.current) return;

    for (let attempt = 0; attempt < INITIALIZATION_RETRY_COUNT && !initializedRef.current; attempt += 1) {
      await new Promise(resolve => setTimeout(resolve, INITIALIZATION_RETRY_DELAY));
    }
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || isTyping) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);

    const startedAt = getCurrentTimestamp();
    const isMovieQuery = MOVIE_QUERY_PATTERN.test(userMsg.toLowerCase());
    const isPricingQuery = PRICING_PATTERN.test(userMsg);
    const isLowSignal = LOW_SIGNAL_PATTERN.test(userMsg) || userMsg.length <= 1;

    if (!isInitialized && isMovieQuery) {
      await waitForInitialization();
    }

    const localResponse = getAiResponseResult(userMsg);
    const localText = String(localResponse?.text || '').trim();
    const localIntent = String(localResponse?.intent || '');
    let response = localText;
    if (isLowSignal && !isPricingQuery) {
      response = localText || API_FALLBACK_MESSAGE;
    } else if (isMovieQuery && !hasMovieDataRef.current && !localText) {
      response = MOVIE_DATA_UNAVAILABLE_MESSAGE;
    }
    if (!response && localIntent !== 'low_signal' && localIntent !== 'empty') {
      try {
        response = await getOpenRouterResponse(userMsg);
      } catch (error) {
        console.warn('AI API response failed, using safe fallback:', error);
        response = localText || API_FALLBACK_MESSAGE;
      }
    }
    if (!response) {
      response = localText || API_FALLBACK_MESSAGE;
    }
    const delay = getTypingDelay(response);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Add bot response
    setMessages(prev => [...prev, {
      role: 'bot',
      text: response,
      quickAction: localResponse?.quickAction || null,
      processingTime: formatProcessingTime(getCurrentTimestamp() - startedAt),
    }]);
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
              <div className="ai-msg-content">
                <div
                  className="ai-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                />
                {msg.role === 'bot' && msg.quickAction ? (
                  <div className="ai-suggestions" style={{ justifyContent: 'flex-start', padding: '0', marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="ai-suggestion-btn"
                      onClick={() => handleSuggestionClick(msg.quickAction.message)}
                    >
                      {msg.quickAction.label}
                    </button>
                  </div>
                ) : null}
                {msg.role === 'bot' && msg.processingTime ? (
                  <div className="ai-msg-meta">ประมวลผลใน {msg.processingTime}</div>
                ) : null}
              </div>
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
