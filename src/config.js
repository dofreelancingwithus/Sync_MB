export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080', // Changed to match your Spring Boot port
  ENDPOINTS: {
    ANALYZE_FACE: '/api/songs/analyze-face',
    ANALYZE_TEXT: '/api/songs/analyze', // Changed to match your backend
    SONGS: '/api/songs',
    ADD_SONG: '/api/songs'
  }
};

export const MOOD_EMOJIS = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  calm: '😌',
  neutral: '😐',
  excited: '🤩',
  fearful: '😨',
  disgusted: '🤢'
};

export const MOOD_COLORS = {
  happy: 'success',
  sad: 'primary',
  angry: 'danger',
  calm: 'info',
  neutral: 'secondary',
  excited: 'warning',
  fearful: 'dark',
  disgusted: 'dark'
};

export const DEFAULT_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  ANALYZE_ERROR: 'Failed to analyze mood. Please try again.',
  NO_MOOD_DETECTED: 'No mood detected. Please try again.',
  INVALID_INPUT: 'Invalid input. Please check your data.'
};