/**
 * Checks if there's a window.sessionStorage object
 */
export const hasSessionStorage = () => (process.client && window && window.sessionStorage)
