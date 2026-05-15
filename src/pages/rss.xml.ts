import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = async (context) => {
  const site = context.site || new URL('https://liuforge.dev');
  const posts = (await getCollection('blog')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const items = posts.map((post) => {
    const link = new URL(`/blog/${post.id.replace(/\.mdx$/, '')}`, site).toString();
    return `<item><title>${escapeXml(post.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><description>${escapeXml(post.data.description)}</description></item>`;
  }).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>LiuForge</title><link>${site.toString()}</link><description>个人品牌主页、项目作品集与日记随笔</description>${items}</channel></rss>`, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
