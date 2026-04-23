/**
 * Pagination constants used throughout the application
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 10,
} as const;

/**
 * API and network timeout constants (in milliseconds)
 */
export const TIMEOUTS = {
  WEBHOOK: 5000,
  API_REQUEST: 10000,
} as const;

/**
 * Debounce delays (in milliseconds)
 */
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 150,
} as const;
