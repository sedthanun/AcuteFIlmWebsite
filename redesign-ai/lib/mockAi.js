/**
 * Mock AI Engine สำหรับ AcuteFilm
 * ระบบตอบคำถามอัตโนมัติแบบ keyword matching
 * ตอบเป็นภาษาไทยเป็นหลัก
 */

// ===== Knowledge Base: ข้อมูล AcuteFilm ทั้งหมด =====
const KNOWLEDGE = {
  company: {
    name: 'AcuteFilm',
    fullName: 'AcuteFilm Production',
    founder: 'เสฏฐนันท์ จงเจตน์ดี (Sedthanun Chongchetdee)',
    founderRole: 'CEO & Founder',
    location: 'กรุงเทพมหานคร, ประเทศไทย',
    email: 'acutefilmofficial@gmail.com',
    line: '0910158552',
    facebook: 'https://www.facebook.com/acutefilm',
    youtube: 'https://www.youtube.com/@acutefilm',
    github: 'https://github.com/sedthanun/AcuteFIlmWebsite/',
    website: 'https://acutefilmmovies.web.app',
    description: 'AcuteFilm เป็นบริษัทผลิตสื่อวิดีโอและภาพยนตร์ครบวงจร เชี่ยวชาญด้าน Video Production, Video Editing, Visual Effects (VFX), Motion Graphics และ Color Grading',
  },

  services: [
    { name: 'Video Production', desc: 'ผลิตวิดีโอครบวงจร ตั้งแต่ Pre-Production ถึง Post-Production' },
    { name: 'Video Editing', desc: 'ตัดต่อวิดีโอคุณภาพสูง ทั้งภาพยนตร์สั้น โฆษณา และคอนเทนต์' },
    { name: 'Visual Effects (VFX)', desc: 'สร้างเอฟเฟกต์พิเศษ งาน Compositing และ CGI' },
    { name: 'Motion Graphics', desc: 'ออกแบบและสร้างกราฟิกเคลื่อนไหว ไตเติ้ล และ Infographic' },
    { name: 'Color Grading', desc: 'ปรับแต่งสีภาพยนตร์ให้ได้อารมณ์ตามต้องการ' },
  ],

  movies: [],

  clients: [
    'Hoyayo•Japan',
    'Phoenix Next',
    'MStudio',
    'Shinesaeng Ad.Venture',
  ],
};

// ===== Response Templates =====
const RESPONSES = {
  greeting: [
    'สวัสดีครับ! 👋 ยินดีต้อนรับสู่ AcuteFilm AI ครับ มีอะไรให้ช่วยไหมครับ?',
    'สวัสดีครับ! ดีใจที่ได้พูดคุยด้วยนะครับ ถามอะไรเกี่ยวกับ AcuteFilm ได้เลยครับ 😊',
    'หวัดดีครับ! 🎬 พร้อมตอบคำถามเกี่ยวกับ AcuteFilm แล้วครับ ถามได้เลยนะครับ',
  ],

  about: [
    `🎬 **AcuteFilm** คือบริษัทผลิตสื่อวิดีโอและภาพยนตร์ครบวงจรครับ\n\nก่อตั้งโดย **${KNOWLEDGE.company.founder}** ตำแหน่ง ${KNOWLEDGE.company.founderRole}\n\n📍 ตั้งอยู่ที่ ${KNOWLEDGE.company.location}\n\nเรายินดีให้บริการ Video Production, VFX, Motion Graphics, Color Grading และอื่นๆ อีกมากมายครับ!`,
  ],

  services: [
    `🛠️ **บริการของ AcuteFilm** มีดังนี้ครับ:\n\n${KNOWLEDGE.services.map((s, i) => `${i + 1}. **${s.name}** — ${s.desc}`).join('\n')}\n\nสนใจบริการไหนเป็นพิเศษ สอบถามเพิ่มเติมได้เลยนะครับ! 😊`,
  ],

  contact: [
    `📬 **ช่องทางติดต่อ AcuteFilm** ครับ:\n\n📧 Email: ${KNOWLEDGE.company.email}\n📱 LINE ID: ${KNOWLEDGE.company.line}\n📍 Location: ${KNOWLEDGE.company.location}\n\n🔗 Social Media:\n• Facebook: facebook.com/acutefilm\n• YouTube: youtube.com/@acutefilm\n\nติดต่อมาได้เลยนะครับ ยินดีให้บริการครับ! 💙`,
  ],

  founder: [
    `👤 **ผู้ก่อตั้ง AcuteFilm**\n\n🎬 **${KNOWLEDGE.company.founder}**\nตำแหน่ง: ${KNOWLEDGE.company.founderRole}\n\nเป็นผู้กำกับภาพยนตร์และผู้ก่อตั้ง AcuteFilm โดยมีผลงานกำกับภาพยนตร์สั้นหลายเรื่อง เช่น The Fame, Your Choice และ Good Old Friend ครับ`,
  ],

  clients: [
    `🤝 **ลูกค้าที่เคยร่วมงานกับ AcuteFilm** ครับ:\n\n${KNOWLEDGE.clients.map(c => `• ${c}`).join('\n')}\n\nและอีกมากมาย! สามารถดูผลงานทั้งหมดได้ที่เว็บไซต์ของเราครับ 😊`,
  ],

  fallback: [
    'ขอโทษครับ ไม่แน่ใจว่าเข้าใจคำถามถูกต้องไหม 🤔 ลองถามเกี่ยวกับ:\n\n• **ข้อมูล AcuteFilm** — "AcuteFilm คืออะไร"\n• **ผลงานภาพยนตร์** — "หนังที่ทำมีอะไรบ้าง"\n• **บริการ** — "มีบริการอะไรบ้าง"\n• **ติดต่อ** — "ติดต่อยังไง"\n• **ผู้ก่อตั้ง** — "ใครก่อตั้ง"\n\nแล้วลองถามใหม่ได้เลยครับ! 😊',
    'อืม... ไม่แน่ใจเรื่องนี้ครับ 😅 แต่ถ้าถามเกี่ยวกับ AcuteFilm เช่น หนัง, บริการ, หรือช่องทางติดต่อ ตอบได้เลยครับ!',
  ],

  thanks: [
    'ยินดีครับ! 😊 มีอะไรอยากรู้อีกถามได้เลยนะครับ',
    'ด้วยความยินดีครับ! 💙 มีคำถามเพิ่มเติมอีกไหมครับ?',
    'ไม่เป็นไรครับ ยินดีช่วยเสมอ! 🎬',
  ],
};

// ===== Keyword Matching Engine =====
export function setDynamicMovies(movies) {
  KNOWLEDGE.movies = movies;
}

function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '');
}

function findMovieByName(input) {
  const normInput = normalizeString(input);
  return KNOWLEDGE.movies.find(m => {
    const normName = normalizeString(m.name);
    const normNameTh = normalizeString(m.nameTh);
    const normSlug = normalizeString(m.slug);
    
    return (normName && normInput.includes(normName)) ||
           (normNameTh && normInput.includes(normNameTh)) ||
           (normSlug && normInput.includes(normSlug));
  });
}

function getWatchUrl(embedUrl) {
  if (!embedUrl) return null;
  // Convert YouTube embed URL to watch URL
  const embedMatch = embedUrl.match(/youtube\.com\/embed\/([^?&]+)/);
  if (embedMatch) return `https://www.youtube.com/watch?v=${embedMatch[1]}`;
  // If it's already a watch URL or other link, return as-is
  if (embedUrl.startsWith('http')) return embedUrl;
  return null;
}

function generateMovieResponse(movie) {
  const watchUrl = getWatchUrl(movie.video);
  return `🎬 **${movie.name}** ${movie.nameTh ? `(${movie.nameTh})` : ''}\n\n• ประเภท: ${movie.type || '-'}\n• แนว: ${movie.genre || '-'}\n• ปีที่ออก: ${movie.release || '-'}\n• เรื่องย่อ: ${movie.synopsis || '-'}\n• นักแสดง: ${movie.actors || '-'}\n• กำกับ: ${movie.director || '-'}${watchUrl ? `\n\n🎥 **รับชมได้ที่:** ${watchUrl}` : ''}\n\nสนใจอยากรู้เพิ่มเติมเรื่องอื่นไหมครับ? 😊`;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Main AI Response Function
 * @param {string} userMessage - ข้อความจาก user
 * @returns {string} - คำตอบจาก AI
 */
export function getAiResponse(userMessage) {
  const input = userMessage.trim().toLowerCase();

  // Empty input
  if (!input) return 'กรุณาพิมพ์ข้อความด้วยนะครับ 😊';

  // ทักทาย
  if (/^(สวัสดี|หวัดดี|hello|hi|hey|ดี|yo|ไง|เฮ|halo|สวัสดีครับ|สวัสดีค่ะ)/.test(input)) {
    return pickRandom(RESPONSES.greeting);
  }

  // ขอบคุณ
  if (/ขอบคุณ|ขอบใจ|thank|thanks|thx|ดีใจ/.test(input)) {
    return pickRandom(RESPONSES.thanks);
  }

  // ถามเกี่ยวกับหนังเฉพาะเรื่อง
  const movie = findMovieByName(input);
  if (movie) {
    // ถ้าถามหาเรื่องย่อโดยเฉพาะ
    if (/เรื่องย่อ|เนื้อเรื่อง|เล่า|synopsis|เรื่องราว|เกี่ยวกับอะไร/.test(input)) {
      return `📖 **เรื่องย่อ ${movie.name}**\n\n${movie.synopsis || '-'}\n\nถ้าอยากรู้ข้อมูลอื่นๆ เช่น นักแสดง หรือช่องทางรับชม พิมพ์ถามได้เลยนะครับ! 😊`;
    }
    // ถ้าถามว่าดูที่ไหน / watch
    if (/ดูได้|ดูที่ไหน|ดูยังไง|ดูหนัง|รับชม|watch|ลิงก์|link|url|วิดีโอ|video|trailer|ตัวอย่าง/.test(input)) {
      const watchUrl = getWatchUrl(movie.video);
      if (watchUrl) {
        return `🎥 **รับชม ${movie.name}** ได้ที่ลิงก์นี้เลยครับ:\n\n${watchUrl}\n\nเพลิดเพลินกับการรับชมนะครับ! 🍿`;
      }
      return `ขออภัยครับ เรื่อง **${movie.name}** ยังไม่มีลิงก์วิดีโอในขณะนี้ครับ 😅 ลองติดตามได้ที่ Facebook หรือ YouTube ของ AcuteFilm นะครับ!`;
    }
    // ถ้าถามปกติตอบข้อมูลรวม
    return generateMovieResponse(movie);
  }

  // ถามเกี่ยวกับหนังทั้งหมด (แยกเป็น 2 กรณี)
  if (/หนัง|ภาพยนตร์|\bmovie\b|\bmovies\b|\bfilm\b|\bfilms\b|ผลงาน|เรื่อง|portfolio|งานที่ทำ|เคยทำอะไร|โปรเจค|project/.test(input)) {
    if (KNOWLEDGE.movies.length === 0) return 'กำลังดึงข้อมูลภาพยนตร์ กรุณารอสักครู่นะครับ... ⏳';

    // ถ้าถาม "ผลงาน / portfolio / งานที่ทำ" → แสดงทั้งหมด
    if (/ผลงาน|portfolio|งานที่ทำ|เคยทำอะไร|โปรเจค|project|ทั้งหมด|ทุกเรื่อง|all/.test(input)) {
      return `🎬 **ผลงานทั้งหมดของ AcuteFilm** ครับ:\n\n${KNOWLEDGE.movies.map(m => `• **${m.name}** ${m.nameTh ? `(${m.nameTh})` : ''} — ${m.type || ''}`).join('\n')}\n\nสนใจเรื่องย่อเรื่องไหน พิมพ์ชื่อเรื่องถามได้เลยนะครับ! 🍿`;
    }

    // ถ้าถาม "หนัง / ภาพยนตร์ / movie" → แสดงเฉพาะ AcuteFilm Originals
    const originals = KNOWLEDGE.movies.filter(m => m.type && m.type.toLowerCase().includes('original'));
    if (originals.length > 0) {
      return `🎬 **ภาพยนตร์ AcuteFilm Originals** ครับ:\n\n${originals.map(m => `• **${m.name}** ${m.nameTh ? `(${m.nameTh})` : ''} (${m.release || '-'})`).join('\n')}\n\nสนใจเรื่องย่อเรื่องไหน พิมพ์ชื่อเรื่องถามได้เลยนะครับ! 🍿\n\n💡 ถ้าอยากดูผลงานทั้งหมดรวมงาน Client ลองพิมพ์ "ผลงานทั้งหมด" ได้นะครับ`;
    }
    // fallback ถ้าไม่มี originals ก็แสดงทั้งหมด
    return `🎬 **ผลงานภาพยนตร์ของ AcuteFilm** ทั้งหมดครับ:\n\n${KNOWLEDGE.movies.map(m => `• **${m.name}** ${m.nameTh ? `(${m.nameTh})` : ''}`).join('\n')}\n\nสนใจเรื่องย่อเรื่องไหน พิมพ์ชื่อเรื่องถามได้เลยนะครับ! 🍿`;
  }

  // ถามเกี่ยวกับบริการ
  if (/บริการ|service|ทำอะไร|รับงาน|ราคา|ถ่าย|ตัดต่อ|vfx|motion|editing|production|color.?grad/.test(input)) {
    return pickRandom(RESPONSES.services);
  }

  // ถามเกี่ยวกับการติดต่อ
  if (/ติดต่อ|contact|email|line|โทร|เบอร์|ที่อยู่|location|address|อีเมล/.test(input)) {
    return pickRandom(RESPONSES.contact);
  }

  // ถามเกี่ยวกับผู้ก่อตั้ง
  if (/ก่อตั้ง|founder|ceo|เจ้าของ|ผู้สร้าง|เสฏฐ|sedthanun|ใครสร้าง|ใครทำ|big|บิ๊ก/.test(input)) {
    return pickRandom(RESPONSES.founder);
  }

  // ถามเกี่ยวกับ AcuteFilm โดยรวม
  if (/acutefilm|acute.?film|คืออะไร|เกี่ยวกับ|about|เล่าให้ฟัง|company|บริษัท|เป็นใคร/.test(input)) {
    return pickRandom(RESPONSES.about);
  }

  // ถามเกี่ยวกับลูกค้า
  if (/ลูกค้า|client|customer|ร่วมงาน|เคยทำ/.test(input)) {
    return pickRandom(RESPONSES.clients);
  }

  // ถามเกี่ยวกับเว็บไซต์
  if (/เว็บ|website|web|url|link|ลิงก์/.test(input)) {
    return `🌐 เว็บไซต์ AcuteFilm: **${KNOWLEDGE.company.website}**\n\nสามารถเข้าชมผลงาน ข่าวสาร และข้อมูลเพิ่มเติมได้ที่เว็บไซต์ครับ! 😊`;
  }

  // ถามเรื่อง Social Media
  if (/facebook|fb|เฟส|youtube|ยูทูป|social|โซเชี่ยล|ig|instagram/.test(input)) {
    return `📱 **Social Media ของ AcuteFilm** ครับ:\n\n• Facebook: facebook.com/acutefilm\n• YouTube: youtube.com/@acutefilm\n• GitHub: github.com/sedthanun\n\nไปกดติดตามกันได้เลยนะครับ! 💙`;
  }

  // ถาม AI เป็นใคร
  if (/เป็นใคร|คุณคือ|you are|who are|แนะนำตัว|ชื่ออะไร/.test(input)) {
    return '🤖 ผมเป็น **AcuteFilm AI** ครับ — ผู้ช่วย AI ของ AcuteFilm ที่พร้อมตอบคำถามเกี่ยวกับบริษัท ผลงานภาพยนตร์ บริการ และข้อมูลต่างๆ ครับ\n\nถามอะไรได้เลยนะครับ! 😊';
  }

  // Fallback
  return pickRandom(RESPONSES.fallback);
}

/**
 * Simulate typing delay (สำหรับให้ดู realistic)
 * @param {string} response - ข้อความตอบกลับ
 * @returns {number} - delay in ms
 */
export function getTypingDelay(response) {
  // ให้ดูตอบเร็วขึ้น: 15ms ต่อตัวอักษร, min 500ms, max 1500ms
  const delay = Math.min(Math.max(response.length * 15, 500), 1500);
  return delay;
}
