import { db } from '@/lib/db';
import { getBaseUrl } from '@/lib/seo';

export async function GET() {
  const baseUrl = getBaseUrl();
  const products = db.getProducts();
  const categories = db.getCategories();
  const blogs = db.getBlogs();

  const staticPages = [
    '',
    '/about',
    '/products',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/terms',
  ];

  const now = new Date().toISOString();

  const staticUrls = staticPages
    .map(
      (path) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${path === '' ? 'daily' : 'weekly'}</changefreq>
      <priority>${path === '' ? '1.0' : '0.8'}</priority>
    </url>`
    )
    .join('');

  const categoryUrls = categories
    .map(
      (cat) => `
    <url>
      <loc>${baseUrl}/category/${cat.slug}</loc>
      <lastmod>${cat.updatedAt || now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join('');

  const productUrls = products
    .map(
      (prod) => `
    <url>
      <loc>${baseUrl}/product/${prod.slug}</loc>
      <lastmod>${prod.updatedAt || now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join('');

  const blogUrls = blogs
    .map(
      (blog) => `
    <url>
      <loc>${baseUrl}/blog/${blog.slug}</loc>
      <lastmod>${blog.updatedAt || now}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${categoryUrls}
  ${productUrls}
  ${blogUrls}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
