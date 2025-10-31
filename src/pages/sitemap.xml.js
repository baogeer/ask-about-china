import { getCollection } from 'astro:content';

export async function GET({ site }) {
    const blog = await getCollection('blog');
    const urls = blog.map((post) => {
        const url = new URL(`/${post.id.replace('.md', '')}/`, site);
        const pubDate = new Date(post.data.pubDate).toISOString().replace(/\.\d{3}Z$/, 'Z');
        return `
  <url>
    <loc>${url.href}</loc>
    <news:news>
      <news:publication>
        <news:name>China Expat &amp; Travel Guide</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXML(post.data.title)}</news:title>
    </news:news>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
  ${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

// 防止 XML 特殊字符报错
function escapeXML(str = '') {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
