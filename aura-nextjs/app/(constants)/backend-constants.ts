export const backendConstants = {
  baseUrl:process.env.BACKEND_BASE_URL || 'http://localhost:1337/api',
  googleLoginUrl: process.env.GOOGLE_LOGIN_URL || 'http://localhost:1337/api/connect/google',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:1337/api/auth/google/callback',
  tokenExpiry: process.env.TOKEN_EXPIRY && parseInt(process.env.TOKEN_EXPIRY) || 60 * 60 * 24 * 7, // 7 days
};
