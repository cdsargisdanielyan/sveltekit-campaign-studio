import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { z } from 'zod';
const root = process.env.EDGE_OUTPUT_DIR || '.vercel/output';
// Root api/ files trigger Vercel's independent function compiler, bypassing
// SvelteKit and duplicating the explicitly packaged Edge route.
assert.equal(
  existsSync('api'),
  false,
  'Keep route implementations inside src/',
);
const config = z
  .object({ version: z.literal(3), routes: z.array(z.unknown()) })
  .parse(JSON.parse(await readFile(`${root}/config.json`, 'utf8')));
assert.deepEqual(config.routes[0], { src: '/api/og', dest: '/blog-og' });
z.object({ runtime: z.literal('edge') }).parse(
  JSON.parse(
    await readFile(`${root}/functions/blog-og.func/.vc-config.json`, 'utf8'),
  ),
);
const edgeSource = await readFile(
  `${root}/functions/blog-og.func/index.js`,
  'utf8',
);
const edge: { default: (request: Request) => Promise<Response> } = await import(
  `data:text/javascript;base64,${Buffer.from(edgeSource).toString('base64')}`
);
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async (input) => {
    const asset = new URL(String(input));
    assert.equal(asset.origin, 'https://deployment.test');
    assert.equal(asset.pathname, '/og/de/sub-second-lcp-on-a-content-site.png');
    return new Response(await readFile(`${root}/static${asset.pathname}`));
  };
  const image = await edge.default(
    new Request(
      'https://deployment.test/api/og?slug=sub-second-lcp-on-a-content-site&locale=de',
    ),
  );
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('Content-Type'), 'image/png');
  assert.equal(
    Buffer.from(await image.arrayBuffer())
      .subarray(1, 4)
      .toString(),
    'PNG',
  );
  const missing = await edge.default(
    new Request('https://deployment.test/api/og?slug=missing'),
  );
  assert.equal(missing.status, 404);
} finally {
  globalThis.fetch = originalFetch;
}
for (const locale of ['en', 'de']) {
  const files = await readdir(`${root}/static/og/${locale}`);
  assert.equal(files.length, 20);
  for (const file of files) {
    const image = await readFile(`${root}/static/og/${locale}/${file}`);
    assert.equal(image.subarray(1, 4).toString(), 'PNG');
  }
}
if (!process.env.EDGE_OUTPUT_DIR) {
  z.object({ runtime: z.literal('nodejs24.x') }).parse(
    JSON.parse(
      await readFile(
        `${root}/functions/![-]/catchall.func/.vc-config.json`,
        'utf8',
      ),
    ),
  );
}
console.log(
  'Verified Edge route, runtime declarations, and 40 localized OG PNGs.',
);
