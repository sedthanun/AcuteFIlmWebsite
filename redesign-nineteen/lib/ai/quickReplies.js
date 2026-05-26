const COMPANY = {
  name: 'AcuteFilm',
  fullName: 'AcuteFilm Production',
  founder: 'เสฏฐนันท์ จงเจตน์ดี (Sedthanun Chongchetdee)',
  founderRole: 'CEO & Founder',
  location: 'กรุงเทพมหานคร, ประเทศไทย',
  website: 'https://acutefilmmovies.web.app',
  email: 'acutefilmofficial@gmail.com',
  line: '0910158552',
  facebook: 'https://www.facebook.com/acutefilm',
  youtube: 'https://www.youtube.com/@acutefilm',
  description: 'AcuteFilm เป็นบริษัทผลิตสื่อวิดีโอและภาพยนตร์ครบวงจร เชี่ยวชาญด้าน Video Production, Video Editing, Visual Effects (VFX), Motion Graphics และ Color Grading',
};

const STATE = {
  movies: [],
};

const GREETING_PATTERN = /^(สวัสดี|หวัดดี|hello|hi|hey|yo|ไง|เฮ|halo)(ครับ|ค่ะ)?$/i;
const THANKS_PATTERN = /(ขอบคุณ|ขอบใจ|thank|thanks|thx)/i;
const ABOUT_PATTERN = /^(acutefilm คืออะไร|acute.?film คืออะไร|acutefilm|acute.?film|เกี่ยวกับ acutefilm|บริษัท acute.?film)$/i;
const SERVICES_PATTERN = /^(มีบริการอะไรบ้าง|บริการอะไรบ้าง|บริการ|services?)$/i;
const CONTACT_PATTERN = /(ติดต่อ|contact|email|line|โทร|เบอร์|เว็บไซต์|website|facebook|youtube|โซเชียล|social|ติดต่อยังไง|ติดต่อยังไงครับ|ติดต่อยังไงคะ|ติดต่อทางไหน|ช่องทางติดต่อ)/i;
const FOUNDER_PATTERN = /^(ใครก่อตั้ง|ใครสร้าง|ผู้ก่อตั้ง|founder|ceo)$/i;

// Company / people queries
const CLIENTS_PATTERN = /(ลูกค้าของเรา|ลูกค้า|client|clients|who i've worked with|worked with|worked with)/i;

// Movie catalog queries
const OUR_MOVIES_PATTERN = /(หนังของเรา|movies?ของเรา|our movies|our films|ผลงานของเรา|หนังที่เป็นของเรา|หนังที่ทำมีอะไรบ้าง)/i;
const MOVIE_LIST_PATTERN = /^(ผลงานทั้งหมด|portfolio list|movie list|รายการหนัง|รายการหนังทั้งหมด|รายชื่อหนังทั้งหมด|แสดงหนังทั้งหมด|หนังที่ทำทั้งหมด|หนังทั้งหมด|portfolio|หนังที่ทำมีอะไรบ้าง|ผลงานมีอะไรบ้าง|มีผลงานอะไรบ้าง)$/i;

// Movie detail / watch queries
const WATCH_PATTERN = /(ดูได้|ดูที่ไหน|ดูยังไง|รับชม|watch|ลิงก์|link|url|วิดีโอ|video|trailer|ตัวอย่าง)/i;
const MOVIE_DETAIL_PATTERN = /(เล่าเรื่อง|เรื่องย่อ|เนื้อเรื่อง|เกี่ยวกับอะไร|synopsis|story|detail|ข้อมูล|สรุปเรื่อง|สรุปหนังเรื่อง|สรุปหนัง|สรุป)/i;
const GENERIC_MOVIE_DETAIL_PATTERN = /(เล่าเรื่อง(หนัง)?(เรื่องนี้|เรื่องไหนก็ได้|หนังเรื่องนี้|หนังเรื่องไหน)?|เรื่องย่อ(หนัง)?|สรุปหนังเรื่อง|สรุปเรื่อง|สรุปหนัง|สรุป)/i;
const DIRECTOR_PATTERN = /(ผู้กำกับ|director|กำกับ|กำกับโดย)/i;
const ACTORS_PATTERN = /(นักแสดง|cast|แสดงโดย|starring)/i;
const GENRE_PATTERN = /(แนวหนัง|genre|ประเภท|หมวดหมู่|แนว)/i;
const YEAR_PATTERN = /(ปี(?:ที่|ของ)?(?:.*)?ฉาย|ปีที่ออก|ฉายปีไหน|release|ปีที่สร้าง|ปีออก|สร้างปีไหน|ออกฉายเมื่อไหร่|ปีไหนที่ออก|ฉายเมื่อไหร่|ออกปีไหน|ปีไหนฉาย|release date|ปี release)/i;
const MOVIE_QUERY_PATTERN = /(หนัง|ภาพยนตร์|movie|film|เรื่อง|เล่าเรื่อง|เรื่องย่อ|ดู|รับชม|watch|trailer|ตัวอย่าง)/i;
const SEQUEL_PATTERN = /(?:ภาค|part|season|ss)\s*(\d+)|(?:ภาคต่อ|ตอนต่อ|ต่อจาก|sequel)|(?:\b\d+\s*(?:ภาค|part|season|ss)\b)/i;
const LOW_SIGNAL_PATTERN = /^[\s\d\W_]*$|^.$/u;
const SERVICE_TOPIC_PATTERN = /(vfx|visual effects|visual effect|fx|เอฟเฟกต์|โมชั่นกราฟิก|motion graphics|motion graphic|โมชั่นกราฟิกส์|color grading|colorgrade|color grade|เกรดสี|ทำสี|ปรับสี|ตัดต่อ|editing|post production|post-production|production|โปรดักชัน|โปรดักชั่น|ถ่ายทำ|บริการ|service|work|งาน|สนใจทำ|รับงาน|ประเมิน)/i;
const PRICING_PATTERN = /(ราคา|เรต|ค่าใช้จ่าย|งบ|budget|quote|quotation|cost|price|pricing|เท่าไหร่|กี่บาท)/i;
const COMPLEX_PATTERN = /(ทำไม|ยังไง|อย่างไร|วิเคราะห์|เปรียบเทียบ|เหมาะ|เหมาะกับใคร|เหมาะกับวัยรุ่น|เหมาะกับเด็ก|เหมาะกับผู้ใหญ่|เหมาะกับ pitch|ควร|ควรโปรโมต|ควรนำเสนอ|ควรทำยังไง|แนะนำ|pitch|proposal|เสนอ|ไอเดีย|จุดขาย|ขาย|marketing|market|recommend|analy|summary|ภาพรวม|ราคา|เท่าไหร่|งบ|budget|quote|ประเมิน)/i;

function normalizeString(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9ก-๙]/g, '');
}

function tokenizeMovieText(value) {
  const commonWords = new Set([
    'drama',
    'thriller',
    'sci-fi',
    'scifi',
    'horror',
    'romance',
    'action',
    'comedy',
    'visual',
    'effects',
    'production',
    'cut',
    'vfx',
    'film',
    'movie',
    'acutefilm',
    'originals',
    'one',
    'shot',
    'pictures',
    'bangkok',
    'thailand',
    'the',
    'and',
    'of',
    'to',
    'for',
    'with',
  ]);

  return String(value || '')
    .toLowerCase()
    .split(/[^a-z0-9ก-๙]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !commonWords.has(token));
}

function getWatchUrl(videoUrl) {
  if (!videoUrl) return '';
  const embedMatch = videoUrl.match(/youtube\.com\/embed\/([^?&]+)/);
  if (embedMatch) return `https://www.youtube.com/watch?v=${embedMatch[1]}`;
  return videoUrl.startsWith('http') ? videoUrl : '';
}

function normalizeIntentInput(input) {
  return String(input || '').trim().toLowerCase().replace(/[!?？！。]/g, '').trim();
}

function detectServiceName(input) {
  const lowered = String(input || '').toLowerCase();
  if (/(color grading|colorgrade|color grade|เกรดสี|ทำสี|ปรับสี|สี)/i.test(lowered)) return 'Color Grading';
  if (/(vfx|visual effects|visual effect|เอฟเฟกต์ภาพ|เอฟเฟกต์|fx)/i.test(lowered)) return 'VFX';
  if (/(motion graphics|motion graphic|โมชั่นกราฟิก|โมชั่น|โมชั่นกราฟิกส์)/i.test(lowered)) return 'Motion Graphics';
  if (/(video editing|editing|ตัดต่อ|ตัดต่อวิดีโอ|post production|post-production)/i.test(lowered)) return 'Video Editing';
  if (/(video production|production|โปรดักชัน|โปรดักชั่น|ถ่ายทำ|งานโปรดักชัน)/i.test(lowered)) return 'Video Production';
  return 'บริการ';
}

function findExactMovieByText(input) {
  const normalizedInput = normalizeString(input);
  const catalog = STATE.movies;
  const exactMatch = catalog.find((movie) => {
    return [movie.name, movie.nameTh, movie.slug]
      .filter(Boolean)
      .some((candidate) => normalizeString(candidate) === normalizedInput);
  });
  if (exactMatch) return exactMatch;

  const tokenMatch = catalog.find((movie) => {
    return [movie.name, movie.nameTh, movie.slug]
      .filter(Boolean)
      .some((candidate) => {
        const normalizedCandidate = normalizeString(candidate);
        const remainder = normalizedInput.startsWith(normalizedCandidate)
          ? normalizedInput.slice(normalizedCandidate.length)
          : '';
        if (normalizedInput === normalizedCandidate) return true;
        if (normalizedInput.includes(normalizedCandidate) && /^\d+$/.test(remainder)) {
          return false;
        }
        return (
          normalizedCandidate &&
          (normalizedInput.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedInput))
        );
      });
  });

  if (tokenMatch) return tokenMatch;

  const inputTokens = tokenizeMovieText(input);
  const wordMatch = catalog.find((movie) => {
    return [movie.name, movie.nameTh, movie.slug]
      .filter(Boolean)
      .some((candidate) => {
        const candidateTokens = tokenizeMovieText(candidate);
        if (!candidateTokens.length || !inputTokens.length) return false;
        return inputTokens.some((token) => candidateTokens.includes(token));
      });
  });

  return wordMatch || null;
}

function hasKnownMovieMention(input) {
  return Boolean(findExactMovieByText(input));
}

function detectMissingInstallment(input) {
  const requested = input.match(SEQUEL_PATTERN);
  if (!requested) return null;

  const movie = findExactMovieByText(input);
  if (!movie) return null;

  const requestedNo = requested[1];
  const normalizedInput = normalizeString(input);
  const alreadyExists = STATE.movies.some((candidate) => {
    if (candidate.id === movie.id) return false;
    return [candidate.name, candidate.nameTh, candidate.slug]
      .filter(Boolean)
      .some((candidateName) => {
        const normalizedName = normalizeString(candidateName);
        return normalizedName && normalizedInput.includes(normalizedName);
      });
  });

  if (alreadyExists) return null;

  return { movie, requestedNo };
}

function detectNumberedSequel(input) {
  const normalizedInput = normalizeString(input);
  const explicitSequelMatch = String(input || '').match(/(?:ภาค|part|season|ss)\s*(\d{1,2})|(\d{1,2})\s*(?:ภาค|part|season|ss)/i);
  const numberMatch = explicitSequelMatch || String(input || '').match(/(\d{1,2})$/);
  if (!numberMatch) return null;

  const movie = findExactMovieByText(input);
  if (!movie) return null;

  const titleVariants = [movie.name, movie.nameTh, movie.slug].filter(Boolean).map(normalizeString);
  const titleMentioned = titleVariants.some((variant) => variant && normalizedInput.includes(variant));
  if (!titleMentioned) return null;

  const hasExplicitExistingSequel = STATE.movies.some((candidate) => {
    if (candidate.id === movie.id) return false;
    return [candidate.name, candidate.nameTh, candidate.slug]
      .filter(Boolean)
      .some((candidateName) => normalizedInput.includes(normalizeString(candidateName)));
  });

  if (hasExplicitExistingSequel) return null;

  const requestedNo = numberMatch[1] || numberMatch[2] || numberMatch[0];
  return { movie, requestedNo };
}

function renderMovieList() {
  const catalog = STATE.movies;
  if (!catalog.length) {
    return 'กำลังดึงข้อมูลภาพยนตร์จาก Firestore กรุณารอสักครู่นะครับ';
  }
  const rows = catalog.map((movie) => {
    return `• ${movie.name}${movie.nameTh ? ` (${movie.nameTh})` : ''}`;
  }).join('\n');

  return `ผลงานที่ AcuteFilm ร่วมทำทั้งหมด มีดังนี้ครับ\n\n${rows}`;
}

function renderOriginalsList() {
  const catalog = STATE.movies.filter((movie) => String(movie.type || '').trim().toLowerCase() === 'acutefilm originals');
  if (!catalog.length) {
    return 'กำลังดึงข้อมูลผลงาน AcuteFilm Originals กรุณารอสักครู่นะครับ';
  }
  const rows = catalog.map((movie) => {
    return `• ${movie.name}${movie.nameTh ? ` (${movie.nameTh})` : ''}`;
  }).join('\n');

  return `ผลงาน AcuteFilm Originals มีดังนี้ครับ\n\n${rows}`;
}

function renderMovieCatalogHint() {
  return 'ผลงาน AcuteFilm Originals ทั้งหมดมีดังนี้ครับ\nถ้าอยากดูผลงานทั้งหมดที่ร่วมทำ พิมพ์ว่า "ผลงานทั้งหมด" ได้เลยครับ';
}

function renderMovieNotFound() {
  return 'ขอโทษครับ ตอนนี้ยังไม่มีข้อมูลหนังเรื่องนี้อยู่ในระบบครับ';
}

function renderMovieDetail(movie) {
  return `เรื่อง ${movie.name}${movie.nameTh ? ` (${movie.nameTh})` : ''}\nเรื่องย่อ: ${movie.synopsis || '-'}\nประเภท: ${movie.type || '-'}\nปีที่ออก: ${movie.release || '-'}`;
}

function renderMovieDirector(movie) {
  return `ผู้กำกับของเรื่อง ${movie.name} คือ ${movie.director || '-'} ครับ`;
}

function renderMovieActors(movie) {
  return `นักแสดงของเรื่อง ${movie.name} คือ ${movie.actors || '-'} ครับ`;
}

function renderMovieGenre(movie) {
  const genre = movie.genre || movie.type || '-';
  return `แนวหนังของเรื่อง ${movie.name} คือ ${genre} ครับ`;
}

function renderMovieYear(movie) {
  return `ปีที่ฉายของเรื่อง ${movie.name} คือ ${movie.release || '-'} ครับ`;
}

function renderWatchLink(movie) {
  const watchUrl = getWatchUrl(movie.video);
  if (!watchUrl) {
    return `ขอโทษครับ ตอนนี้ยังไม่มีลิงก์รับชมของเรื่อง ${movie.name} อยู่ในระบบครับ`;
  }
  return `ลิงก์รับชม ${movie.name}: ${watchUrl}`;
}

function renderClients() {
  return 'ลูกค้าหรือพาร์ตเนอร์ที่เคยร่วมงานกับ AcuteFilm ได้แก่ Hoyayo•Japan, Phoenix Next, M Studio และ Shinesaeng ครับ';
}

function renderGenericFallback() {
  return 'ขอโทษครับ ผมยังไม่สามารถช่วยคุณในเรื่องนี้ได้ครับ แต่ถ้าเป็นเรื่อง AcuteFilm ผลงาน บริการ หรือช่องทางติดต่อ ถามได้เลยครับ';
}

function getTheFameMovie() {
  return STATE.movies.find((movie) => {
    return normalizeString(movie.name) === normalizeString('The Fame')
      || normalizeString(movie.slug) === normalizeString('the-fame');
  }) || null;
}

export function setQuickReplyMovies(movies) {
  STATE.movies = Array.isArray(movies) ? movies : [];
}

export function getQuickReplyResult(userMessage) {
  const rawInput = String(userMessage || '');
  const input = rawInput.trim();
  const lowered = normalizeIntentInput(input);
  const isGenericMovieDetailPrompt = /^(เล่าเรื่อง|เล่าเรื่องหนังเรื่องไหนก็ได้|เล่าเรื่องหนังเรื่องอะไรก็ได้|สรุปเรื่อง|สรุปหนังเรื่อง)/i.test(lowered);

  if (!input) {
    return { text: renderGenericFallback(), confidence: 'handled', intent: 'empty' };
  }

  if (isGenericMovieDetailPrompt && !findExactMovieByText(input)) {
    return {
      text: 'ได้ครับ พิมพ์ชื่อหนังที่ต้องการเล่าเรื่องมาได้เลยครับ ถ้ามีชื่อหนังในระบบที่ใกล้เคียงกับที่พิมพ์ ผมจะเล่าเรื่องให้ฟังครับ',
      confidence: 'handled',
      intent: 'movie_detail_prompt',
    };
  }

  if (GREETING_PATTERN.test(lowered)) {
    return { text: 'สวัสดีครับ ยินดีต้อนรับสู่ AcuteFilm AI ครับ', confidence: 'handled', intent: 'greeting' };
  }

  if (THANKS_PATTERN.test(lowered)) {
    return { text: 'ยินดีครับ หากมีคำถามเพิ่มเติมถามได้เลยครับ', confidence: 'handled', intent: 'thanks' };
  }

  if (ABOUT_PATTERN.test(lowered)) {
    return {
      text: `${COMPANY.name} คือบริษัทผลิตสื่อวิดีโอและภาพยนตร์ครบวงจรครับ ก่อตั้งโดย ${COMPANY.founder} ตำแหน่ง ${COMPANY.founderRole} ตั้งอยู่ที่ ${COMPANY.location} ครับ`,
      confidence: 'exact',
      intent: 'about',
    };
  }

  if (SERVICES_PATTERN.test(lowered)) {
    return {
      text: 'บริการของ AcuteFilm มี Video Production, Video Editing, Visual Effects (VFX), Motion Graphics และ Color Grading ครับ',
      confidence: 'exact',
      intent: 'services',
    };
  }

  if (FOUNDER_PATTERN.test(lowered)) {
    return {
      text: `ผู้ก่อตั้ง AcuteFilm คือ ${COMPANY.founder} ตำแหน่ง ${COMPANY.founderRole} ครับ`,
      confidence: 'exact',
      intent: 'founder',
    };
  }

  if (CLIENTS_PATTERN.test(lowered)) {
    return {
      text: renderClients(),
      confidence: 'exact',
      intent: 'clients',
    };
  }

  if (OUR_MOVIES_PATTERN.test(lowered)) {
    const catalog = STATE.movies.filter((movie) => String(movie.type || '').trim().toLowerCase() === 'acutefilm originals');
    if (catalog.length) {
      return {
        text: renderOriginalsList(),
        confidence: 'exact',
        intent: 'our_movies',
        quickAction: {
          label: 'ดูผลงานทั้งหมด',
          message: 'ผลงานทั้งหมด',
        },
      };
    }

    return {
      text: 'ผลงาน AcuteFilm Originals มีดังนี้ครับ\nถ้าอยากดูผลงานทั้งหมดที่ร่วมทำ กดปุ่มด้านล่างได้เลยครับ',
      confidence: 'exact',
      intent: 'our_movies',
      quickAction: {
        label: 'ดูผลงานทั้งหมด',
        message: 'ผลงานทั้งหมด',
      },
    };
  }

  if (MOVIE_LIST_PATTERN.test(lowered)) {
    return {
      text: renderMovieList(),
      confidence: 'exact',
      intent: 'movie_list',
    };
  }

  const movie = findExactMovieByText(input);
  const hasSequelIndicator = /(?:ภาค|part|season|ss)\s*\d+|(?:\d+\s*(?:ภาค|part|season|ss)\b)|(?:\b(?:ภาคต่อ|ตอนต่อ|ต่อจาก|sequel)\b)/i.test(lowered);
  const detailMovie = hasSequelIndicator ? null : movie;
  const isDetailQuery = GENERIC_MOVIE_DETAIL_PATTERN.test(lowered) || MOVIE_DETAIL_PATTERN.test(lowered);
  if (isDetailQuery) {
    if (/\d+$/.test(normalizeString(input))) {
      return {
        text: renderMovieNotFound(),
        confidence: 'handled',
        intent: 'movie_not_found',
      };
    }
    if (detailMovie) {
      return { text: renderMovieDetail(detailMovie), confidence: 'exact', intent: 'movie_detail' };
    }

    return {
      text: renderMovieNotFound(),
      confidence: 'handled',
      intent: 'movie_not_found',
    };
  }

  const missingInstallment = detectMissingInstallment(input);
  if (missingInstallment) {
    const suffix = missingInstallment.requestedNo ? `ภาค ${missingInstallment.requestedNo}` : 'ภาคต่อ';
    return {
      text: `ตอนนี้ยังไม่พบข้อมูล ${missingInstallment.movie.name} ${suffix} ในระบบครับ`,
      confidence: 'handled',
      intent: 'missing_installment',
    };
  }

  const numberedSequel = detectNumberedSequel(input);
  if (numberedSequel) {
    const suffix = numberedSequel.requestedNo ? `ภาค ${numberedSequel.requestedNo}` : 'ภาคต่อ';
    return {
      text: `ตอนนี้ยังไม่พบข้อมูล ${numberedSequel.movie.name} ${suffix} ในระบบครับ`,
      confidence: 'handled',
      intent: 'missing_numbered_sequel',
    };
  }

  if (movie && WATCH_PATTERN.test(lowered)) {
    return { text: renderWatchLink(movie), confidence: 'exact', intent: 'movie_watch_link' };
  }

  if (movie && DIRECTOR_PATTERN.test(lowered)) {
    return { text: renderMovieDirector(movie), confidence: 'exact', intent: 'movie_director' };
  }

  if (movie && ACTORS_PATTERN.test(lowered)) {
    return { text: renderMovieActors(movie), confidence: 'exact', intent: 'movie_actors' };
  }

  if (movie && GENRE_PATTERN.test(lowered)) {
    return { text: renderMovieGenre(movie), confidence: 'exact', intent: 'movie_genre' };
  }

  if (movie && YEAR_PATTERN.test(lowered)) {
    return { text: renderMovieYear(movie), confidence: 'exact', intent: 'movie_year' };
  }

  if (CONTACT_PATTERN.test(lowered)) {
    return {
      text: `ติดต่อ AcuteFilm ได้ที่เว็บไซต์ ${COMPANY.website} หรืออีเมล ${COMPANY.email} และ LINE ${COMPANY.line} ครับ\nFacebook: ${COMPANY.facebook}\nYouTube: ${COMPANY.youtube}`,
      confidence: 'exact',
      intent: 'contact',
    };
  }

  if (COMPLEX_PATTERN.test(lowered)) {
    return { text: '', confidence: 'fallback', intent: 'complex' };
  }

  if (SERVICE_TOPIC_PATTERN.test(lowered)) {
    return {
      text: `AcuteFilm รับทำ ${detectServiceName(input)} ติดต่อมาได้เลยครับ`,
      confidence: 'handled',
      intent: 'service_topic',
    };
  }

  if (LOW_SIGNAL_PATTERN.test(input) || input.length <= 1) {
    return { text: renderGenericFallback(), confidence: 'handled', intent: 'low_signal' };
  }

  return { text: '', confidence: 'fallback', intent: 'fallback' };
}

export function getQuickReplyTypingDelay(response) {
  const delay = Math.min(Math.max(String(response || '').length * 15, 500), 1500);
  return delay;
}
