const SUPABASE_URL = 'https://goxemgrlabpzxoxuxzbd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveGVtZ3JsYWJwenhveHV4emJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzg5MzksImV4cCI6MjA4OTg1NDkzOX0.0Zd5rco7w7vOvKGIF6DoLbgfrd-An6qICUuaOQBmPVY';
const SITE_URL = 'https://stem.hoangmaistarschool.edu.vn';
const DEFAULT_IMAGE = SITE_URL + '/hero.png';

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  let title = 'Ngày Hội STEM - Kiến Tạo Thế Giới Xanh';
  let description = 'Cuộc thi STEM dành cho học sinh trường Ngôi Sao Hoàng Mai.';
  let image = DEFAULT_IMAGE;
  let articleUrl = SITE_URL + '/tin-tuc/' + id;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/news?id=eq.${id}&select=title,summary,image`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      title = data[0].title || title;
      description = data[0].summary || description;
      if (data[0].image) image = data[0].image;
    }
  } catch (e) {
    // fallback to defaults
  }

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"/>
<title>${esc(title)} | Ngày Hội STEM NSHM</title>
<meta name="description" content="${esc(description)}"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="${esc(articleUrl)}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:image" content="${esc(image)}"/>
<meta property="og:site_name" content="Ngày Hội STEM - Ngôi Sao Hoàng Mai"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${esc(image)}"/>
<meta http-equiv="refresh" content="0;url=${esc(articleUrl)}"/>
</head>
<body>
<p>Đang chuyển hướng...</p>
<script>window.location.href="${esc(articleUrl)}";</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const config = { runtime: 'edge' };
