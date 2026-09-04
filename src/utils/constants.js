// API origin. Vite inlines VITE_API_URL at build time - see .env.production.
// Falls back to localhost so `npm run dev` keeps working with no env file.
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
