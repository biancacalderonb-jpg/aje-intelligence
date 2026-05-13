import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

  try {
    new URL(url); // validate URL shape
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AJEIntelligence/1.0; +https://aje-intelligence.vercel.app)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return NextResponse.json({ error: 'Fetch failed' }, { status: 404 });

    const html = await res.text();

    // Match both attribute orderings of og:image
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    if (match?.[1]) {
      return NextResponse.json({ image: match[1] }, {
        headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
      });
    }

    return NextResponse.json({ error: 'No og:image found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Error fetching URL' }, { status: 500 });
  }
}
