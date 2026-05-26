import {
  getQuickReplyResult,
  getQuickReplyTypingDelay,
  setQuickReplyMovies,
} from '@/lib/ai/quickReplies';

export function setDynamicMovies(movies) {
  setQuickReplyMovies(movies);
}

export function getAiResponse(userMessage) {
  return getAiResponseResult(userMessage).text;
}

export function getAiResponseResult(userMessage) {
  return getQuickReplyResult(userMessage);
}

export function getTypingDelay(response) {
  return getQuickReplyTypingDelay(response);
}
