export default function middleware(req) {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();

  // Social media crawlers / bots
  const isCrawler = /facebookexternalhit|facebot|zalobot|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i.test(ua);

  if (isCrawler) {
    const url = new URL(req.url);
    const match = url.pathname.match(/^\/tin-tuc\/(.+)$/);
    if (match && match[1]) {
      const ogUrl = new URL('/api/og', url.origin);
      ogUrl.searchParams.set('id', match[1]);
      return fetch(ogUrl);
    }
  }
}

export const config = {
  matcher: '/tin-tuc/:path*',
};
