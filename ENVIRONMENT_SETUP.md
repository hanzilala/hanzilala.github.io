# Environment Variables Setup Guide

This guide explains how to set up environment variables for the Hanziilala application, both for local development and GitHub Pages deployment.

## Overview

The application uses environment variables to configure:
- **Google Client ID**: For Google authentication
- **API Base URL**: For backend API endpoints (optional override)

## Local Development Setup

### 1. Create Environment File

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Configure Google Authentication

1. **Get Google Client ID**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the **Google Identity Services API**
   - Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
   - Set **Application type** to "Web application"
   - Add **Authorized JavaScript origins**:
     - For development: `http://localhost:3000`
     - For production: `https://thangtmc73.github.io`

2. **Update .env file**:
   ```env
   GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
   ```

### 3. Start Development Server

```bash
pnpm dev
```

The application will now use your custom Google Client ID for authentication.

## GitHub Pages Deployment Setup

### 1. Configure Repository Secrets

1. Go to your GitHub repository: `https://github.com/thangtmc73/hanzii-lala`
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `GOOGLE_CLIENT_ID`
   - **Value**: Your Google Client ID from Google Cloud Console

### 2. Update Google Cloud Console

Add your GitHub Pages URL to authorized origins:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins**:
   ```
   https://thangtmc73.github.io
   ```

### 3. Enable GitHub Pages

1. Go to repository **Settings** > **Pages**
2. Set **Source** to "GitHub Actions"
3. The deployment workflow will automatically trigger on pushes to `master` branch

### 4. Deploy

Push your changes to the `master` branch:
```bash
git add .
git commit -m "Add environment variable support"
git push origin master
```

The GitHub Actions workflow will:
1. Build the application with your `GOOGLE_CLIENT_ID` secret
2. Deploy to GitHub Pages automatically

Your app will be available at: `https://thangtmc73.github.io/hanzii-lala/`

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | Yes | Fallback ID (for demo) |
| `API_BASE_URL` | Backend API base URL | No | `https://api.hanzii.net/api` |

## Troubleshooting

### "Invalid Client ID" Error
- Verify the Client ID is correct in your environment file
- Check that your domain is added to authorized origins in Google Cloud Console
- Ensure the Google Identity Services API is enabled

### GitHub Actions Build Fails
- Verify the `GOOGLE_CLIENT_ID` secret is set in repository settings
- Check the Actions tab for detailed error logs
- Ensure the secret value doesn't have extra spaces or characters

### Authentication Not Working on GitHub Pages
- Verify your GitHub Pages URL is added to Google Cloud Console authorized origins
- Check browser console for CORS or authentication errors
- Ensure the deployed site is using HTTPS

## Security Notes

- Never commit your actual Google Client ID to the repository
- Use GitHub Secrets for production deployment
- Ensure your API validates Google tokens server-side
- Use HTTPS in production environments

## Development vs Production

| Environment | Configuration Method | File Location |
|-------------|---------------------|---------------|
| **Local Development** | `.env` file | Root directory |
| **GitHub Pages** | Repository Secrets | GitHub Settings |

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google Cloud Console configuration
3. Review the GitHub Actions logs for build errors
4. Ensure all authorized origins are correctly configured 
