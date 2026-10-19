import { ImageResponse } from '@vercel/og';
import posts from './fixtures/posts.json' with { type: 'json' };
import { z } from 'zod';
import { postSchema } from '../contracts.ts';
const validatedPosts = z.array(postSchema).parse(posts);

export default function handler(request: Request) {
  const url = new URL(request.url);
  const post = validatedPosts.find(
    (post) => post.slug === url.searchParams.get('slug'),
  );
  if (!post) return new Response('Not found', { status: 404 });
  const locale = url.searchParams.get('locale') === 'de' ? 'de' : 'en';
  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: post.coverColor,
          color: 'white',
          padding: '72px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: 24, letterSpacing: 6 },
              children: 'CAMPAIGN STUDIO / JOURNAL',
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 68, lineHeight: 1.1 },
              children: post.translations[locale].title,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 24 },
              children: `${post.author.name} · ${post.readingTimeMinutes} min`,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
    },
  );
}
