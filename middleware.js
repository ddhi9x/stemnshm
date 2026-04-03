import { NextResponse } from 'next/server';

export const config = {
  matcher: '/tin-tuc/:id*',
};

export default function middleware(req) {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();

  // Social media crawlers / bots
  const isCrawler = /facebookexternalhit|facebot|zalobot|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|googlebot|bingbot/i.test(ua);

  if (isCrawler) {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const articleId = parts[parts.length - 1];
    
    if (articleId && articleId !== 'tin-tuc') {
      const ogUrl = new URL('/api/og', url.origin);
      ogUrl.searchParams.set('id', articleId);
      return NextResponse.rewrite(ogUrl);
    }
  }

  return NextResponse.next();
}
