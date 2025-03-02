export const APP_CONFIG = {
  MAX_TIME_MINUTES: 180,
  MIN_TIME_MINUTES: 1,
  DEFAULT_INCREMENT: 0,
  MAX_INCREMENT: 60,
} as const;

export const STORAGE_KEYS = {
  THEME: '@app/theme',
  USER_PREFERENCES: '@app/preferences',
  LAST_PLAYED: '@app/last_played',
} as const;

export const ANIMATION_CONFIG = {
  SPRING: {
    damping: 10,
    stiffness: 100,
    mass: 1,
  },
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
} as const; 