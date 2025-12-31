const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token || "",
    }),
  });

  return response.json();
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 30 }, // Cache for 30 seconds
  });

  if (response.status === 204 || response.status > 400) {
    return { isPlaying: false };
  }

  const song = await response.json();

  if (!song.item) {
    return { isPlaying: false };
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((a: { name: string }) => a.name).join(", ");
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0]?.url;
  const songUrl = song.item.external_urls.spotify;

  return {
    isPlaying,
    title,
    artist,
    album,
    albumImageUrl,
    songUrl,
  };
}

export async function getRecentlyPlayed() {
  const { access_token } = await getAccessToken();

  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (response.status > 400) {
    return null;
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  const track = data.items[0].track;

  return {
    title: track.name,
    artist: track.artists.map((a: { name: string }) => a.name).join(", "),
    album: track.album.name,
    albumImageUrl: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
  };
}
