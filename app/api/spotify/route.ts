import { NextResponse } from "next/server";
import { getNowPlaying, getRecentlyPlayed } from "@/lib/spotify";

export const revalidate = 30; // Revalidate every 30 seconds

export async function GET() {
  try {
    // First try to get currently playing
    const nowPlaying = await getNowPlaying();

    if (nowPlaying.isPlaying) {
      return NextResponse.json({
        isPlaying: true,
        title: nowPlaying.title,
        artist: nowPlaying.artist,
        album: nowPlaying.album,
        albumImageUrl: nowPlaying.albumImageUrl,
        songUrl: nowPlaying.songUrl,
      });
    }

    // If not playing, get recently played
    const recentlyPlayed = await getRecentlyPlayed();

    if (recentlyPlayed) {
      return NextResponse.json({
        isPlaying: false,
        title: recentlyPlayed.title,
        artist: recentlyPlayed.artist,
        album: recentlyPlayed.album,
        albumImageUrl: recentlyPlayed.albumImageUrl,
        songUrl: recentlyPlayed.songUrl,
      });
    }

    // No data available
    return NextResponse.json({
      isPlaying: false,
      title: null,
    });
  } catch (error) {
    console.error("Spotify API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Spotify data" },
      { status: 500 }
    );
  }
}
