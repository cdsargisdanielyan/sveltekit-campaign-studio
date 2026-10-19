import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { ImageResponse } from '@vercel/og';
import posts from '../src/lib/server/fixtures/posts.json' with { type: 'json' };
import { z } from 'zod';
import { postSchema } from '../src/lib/contracts.ts';

const validatedPosts = z.array(postSchema).parse(posts);

// Vercel Build Output API: explicit Edge route alongside the adapter's Node functions.
// Kit 3 removed the legacy per-route Edge adapter option.
if (process.env.VERCEL) {
  const root = process.env.EDGE_OUTPUT_DIR || '.vercel/output';
  for (const locale of ['en', 'de'] as const) {
    await mkdir(`${root}/static/og/${locale}`, { recursive: true });
    for (const post of validatedPosts) {
      const image = new ImageResponse(
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 72,
              background: post.coverColor,
              color: 'white',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontSize: 24 },
                  children: 'CAMPAIGN STUDIO / JOURNAL',
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 68 },
                  children: post.translations[locale].title,
                },
              },
              {
                type: 'div',
                props: { style: { fontSize: 24 }, children: post.author.name },
              },
            ],
          },
        },
        { width: 1200, height: 630 },
      );
      await writeFile(
        `${root}/static/og/${locale}/${post.slug}.png`,
        Buffer.from(await image.arrayBuffer()),
      );
    }
  }
  const dir = `${root}/functions/blog-og.func`;
  await mkdir(dir, { recursive: true });
  await writeFile(
    `${dir}/.vc-config.json`,
    JSON.stringify({ runtime: 'edge', entrypoint: 'index.js' }),
  );
  const slugs = JSON.stringify(validatedPosts.map((post) => post.slug));
  await writeFile(
    `${dir}/index.js`,
    `const slugs=new Set(${slugs});
export default async function(request){
 const url=new URL(request.url),slug=url.searchParams.get('slug'),locale=url.searchParams.get('locale')==='de'?'de':'en';
 if(!slugs.has(slug))return new Response('Not found',{status:404});
 const asset=await fetch(new URL('/og/'+locale+'/'+slug+'.png',url.origin));
 return new Response(asset.body,{status:asset.status,headers:{'Content-Type':'image/png','Cache-Control':'public, max-age=3600, s-maxage=86400','X-Content-Type-Options':'nosniff'}});
}`,
  );
  const config = z
    .object({ routes: z.array(z.unknown()) })
    .passthrough()
    .parse(JSON.parse(await readFile(`${root}/config.json`, 'utf8')));
  config.routes.unshift({ src: '/api/og', dest: '/blog-og' });
  await writeFile(`${root}/config.json`, JSON.stringify(config, null, 2));
  console.log('Packaged Edge OG route and 40 localized PNGs.');
}
