import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
  profile_photo_url?: string;
}

interface CachedData {
  rating: number;
  user_ratings_total: number;
  reviews: Review[];
  timestamp: number;
  source: 'google_api' | 'fallback';
}

let cache: CachedData | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const FALLBACK_DATA: CachedData = {
  rating: 4.9,
  user_ratings_total: 142,
  reviews: [
    {
      author_name: 'Ananya R.',
      rating: 5,
      text: 'LuxeAxis transformed our ECR villa beyond our expectations. Flawless execution and unmatched attention to detail.',
      relative_time_description: '2 weeks ago',
    },
    {
      author_name: 'Karthik S.',
      rating: 5,
      text: 'Exceptional 3D visualization and hassle-free project management. Delivered ahead of schedule.',
      relative_time_description: '1 month ago',
    },
    {
      author_name: 'Priyah M.',
      rating: 5,
      text: 'As NRIs based in Singapore, managing interior work was effortless with their digital portal updates.',
      relative_time_description: '2 months ago',
    },
  ],
  timestamp: Date.now(),
  source: 'fallback',
};

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // Serve from memory cache if fresh (< 1 hour)
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  // If credentials are not provided, return curated fallback rating & reviews
  if (!apiKey || !placeId) {
    return NextResponse.json(FALLBACK_DATA, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=rating,user_ratings_total,reviews&key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[google-reviews] Google API returned ${res.status}`);
      return NextResponse.json(cache || FALLBACK_DATA);
    }

    const data = await res.json();

    if (data.status === 'OK' && data.result) {
      const freshData: CachedData = {
        rating: data.result.rating ?? 4.9,
        user_ratings_total: data.result.user_ratings_total ?? 142,
        reviews: data.result.reviews || FALLBACK_DATA.reviews,
        timestamp: Date.now(),
        source: 'google_api',
      };

      cache = freshData;
      return NextResponse.json(freshData, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    console.warn(`[google-reviews] Places API status: ${data.status}`);
    return NextResponse.json(cache || FALLBACK_DATA);
  } catch (err) {
    console.error(
      '[google-reviews] Failed to fetch Google Place details:',
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(cache || FALLBACK_DATA);
  }
}
