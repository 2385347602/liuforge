import type { APIRoute } from 'astro';

const pages = [
  '/',
  '/en',
  '/blog',
  '/projects',
  '/about',
  '/timeline',
  '/links',
  '/guestbook',
  '/gallery',
  '/resume',
  '/tags',
  '/search',
  '/diary',
  '/tools',
  '/rankings',
  '/gear',
];

export const GET: APIRoute = (context) => {
  const site = context.site || new URL('https://liuforge.dev');
  const urls = pages.map((page) => `<url><loc>${new URL(page, site).toString()}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
