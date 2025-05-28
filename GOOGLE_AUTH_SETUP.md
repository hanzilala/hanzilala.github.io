# Google Authentication Setup Guide

This guide will help you set up Google authentication for the Hanzii Lala application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "Hanzii Lala Auth")
5. Click "Create"

## Step 2: Enable Google Identity Services

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google Identity"
3. Click on "Google Identity" and click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: "Hanzii Lala"
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if needed
4. For the OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "Hanzii Lala Web Client"
   - Authorized JavaScript origins:
     - For development: `http://localhost:3000`
     - For production: `https://yourdomain.com`
   - Authorized redirect URIs: (leave empty for Google Identity Services)

## Step 4: Configure the Application

1. Copy the Client ID from the credentials page
2. Open `src/config/auth.ts`
3. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:

```typescript
export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: 'your-actual-client-id.googleusercontent.com',
  // ... other config
};
```

## Step 5: Test the Integration

1. Start your development server: `pnpm dev`
2. Open the application in your browser
3. Click the "Sign In" button in the top-right corner
4. Test the Google login flow

## API Integration

The application will send the Google token to your API endpoint:

```
POST https://api.hanzii.net/api/account/loginwithsocial
Content-Type: application/json

{
  "token": "google-jwt-token",
  "provider": "google"
}
```

Expected response format:

```json
{
  "success": true,
  "token": "your-app-jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://avatar-url.com/image.jpg"
  }
}
```

## Security Notes

- Never commit your Google Client ID to public repositories if it's sensitive
- Use environment variables for production deployments
- Ensure your API validates the Google token server-side
- Implement proper CORS policies
- Use HTTPS in production

## Troubleshooting

### "Invalid Client ID" Error
- Verify the Client ID is correct in `auth.ts`
- Check that the domain is added to authorized origins
- Ensure the Google Identity Services API is enabled

### "Popup Blocked" Error
- Allow popups for your domain
- Use the manual login fallback button

### CORS Errors
- Add your domain to authorized JavaScript origins
- Check your API CORS configuration

### Token Validation Fails
- Verify your API is correctly validating the Google JWT token
- Check that the token hasn't expired
- Ensure proper error handling on the API side

## Production Deployment

For production deployment:

1. Update authorized JavaScript origins with your production domain
2. Use environment variables for the Client ID
3. Implement proper error logging
4. Set up monitoring for authentication failures
5. Consider implementing refresh token logic if needed

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Google Cloud Console configuration
3. Test with a simple HTML page first
4. Check the API response format matches expectations 
