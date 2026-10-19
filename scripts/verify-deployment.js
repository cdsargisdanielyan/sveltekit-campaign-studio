import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = process.env.EDGE_OUTPUT_DIR || '.vercel/output';
const config = JSON.parse(await readFile(`${root}/config.json`, 'utf8'));
assert.equal(config.version, 3);
assert.deepEqual(config.routes[0], { src: '/api/og', dest: '/blog-og' });
const edge = JSON.parse(
  await readFile(`${root}/functions/blog-og.func/.vc-config.json`, 'utf8'),
);
assert.equal(edge.runtime, 'edge');
for (const locale of ['en', 'de']) {
  const files = await readdir(`${root}/static/og/${locale}`);
  assert.equal(files.length, 20);
  for (const file of files) {
    const image = await readFile(`${root}/static/og/${locale}/${file}`);
    assert.equal(image.subarray(1, 4).toString(), 'PNG');
  }
}
if (!process.env.EDGE_OUTPUT_DIR) {
  const node = JSON.parse(
    await readFile(
      `${root}/functions/![-]/catchall.func/.vc-config.json`,
      'utf8',
    ),
  );
  assert.equal(node.runtime, 'nodejs24.x');
}
console.log(
  'Verified Edge route, runtime declarations, and 40 localized OG PNGs.',
);
