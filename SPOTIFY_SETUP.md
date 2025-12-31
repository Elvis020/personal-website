# Spotify Integration Setup

Connect your Spotify account to show what you're currently listening to on your About page.

## Prerequisites
- A Spotify account (free or premium)
- ~10 minutes for setup

---

## Step 1: Create Spotify Developer App

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **Create App**
4. Fill in the details:
   - **App name:** `Personal Website` (or anything you like)
   - **App description:** `Now playing widget for my personal site`
   - **Redirect URI:** `http://localhost:3000/callback`
   - **APIs used:** Check "Web API"
5. Click **Save**
6. Go to **Settings** and copy your:
   - **Client ID**
   - **Client Secret** (click "View client secret")

---

## Step 2: Get Authorization Code

Open this URL in your browser (replace `YOUR_CLIENT_ID` with your actual Client ID):

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing%20user-read-recently-played
```

1. You'll be prompted to authorize the app
2. Click **Agree**
3. You'll be redirected to `http://localhost:3000/callback?code=XXXXXXX`
4. Copy the `code` value from the URL (everything after `code=`)

> Note: The page will show an error (since we don't have a callback handler) - that's fine, we just need the code from the URL.

---

## Step 3: Get Refresh Token

Run this curl command in your terminal (replace the placeholder values):

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTHORIZATION_CODE" \
  -d "redirect_uri=http://localhost:3000/callback" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

You'll receive a JSON response like:
```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "AQBXXXXXXXXXXXXXXXX",
  "scope": "user-read-currently-playing user-read-recently-played"
}
```

Copy the `refresh_token` value - this is what we need!

---

## Step 4: Add Environment Variables

Create a `.env.local` file in your project root:

```bash
# Spotify API credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

---

## Step 5: Restart and Test

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Go to your About page
3. Play a song on Spotify
4. The widget should update within 30 seconds

---

## How It Works

- The app uses your `refresh_token` to get temporary access tokens
- It checks the Spotify API every 30 seconds for updates
- Shows "Now Playing" with a green indicator when music is active
- Shows "Recently Played" when nothing is playing
- Displays album art, song title, and artist name
- Clicking opens the song in Spotify

---

## Troubleshooting

**"Not playing" even though music is playing:**
- Make sure you authorized with the correct Spotify account
- Check that your environment variables are set correctly
- Restart the dev server after adding `.env.local`

**Getting errors in console:**
- Verify your Client ID and Secret are correct
- Make sure the refresh token was copied completely
- The authorization code expires quickly - if it's been a while, get a new one

**Album art not showing:**
- The `next.config.ts` should have `i.scdn.co` in the image domains
- Restart the dev server after config changes

---

## Files Created

- `lib/spotify.ts` - API utility functions
- `app/api/spotify/route.ts` - Next.js API route
- `next.config.ts` - Updated to allow Spotify images
- `app/about/page.tsx` - Updated with Spotify component
