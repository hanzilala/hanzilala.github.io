// Authentication configuration
export const AUTH_CONFIG = {
  // Google Client ID from environment variable or fallback
  // To get a Google Client ID:
  // 1. Go to https://console.cloud.google.com/
  // 2. Create a new project or select existing one
  // 3. Enable Google+ API
  // 4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
  // 5. Set authorized JavaScript origins to your domain (e.g., http://localhost:3000, https://yourdomain.com)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

  // API endpoints
  API_BASE_URL: 'https://api.hanzii.net/api',
  LOGIN_ENDPOINT: '/account/loginwithsocial',
}; 
