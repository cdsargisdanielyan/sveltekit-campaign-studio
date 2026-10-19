import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { manifest } from '../.svelte-kit/output/server/manifest-full.js';

const root = '.svelte-kit/output/client/';
const vite = JSON.parse(await readFile(`${root}.vite/manifest.json`, 'utf8'));
const byFile = new Map(Object.values(vite).map((entry) => [entry.file, entry]));
function add(file, files) {
  if (files.has(file)) return;
  files.add(file);
  const entry = byFile.get(file);
  for (const key of entry?.imports || []) add(vite[key].file, files);
}
let checked = 0;
for (const route of manifest.routes) {
  if (!route.page || !route.id.includes('[locale=locale]')) continue;
  const files = new Set();
  for (const file of manifest.client.imports) add(file, files);
  for (const node of [...route.page.layouts, route.page.leaf]) {
    if (node === undefined) continue;
    const loaded = await manifest.nodes[node]();
    for (const file of loaded.imports || []) add(file, files);
  }
  let bytes = 0;
  for (const file of files)
    if (file.endsWith('.js'))
      bytes += gzipSync(await readFile(root + file)).length;
  const limit = route.id.includes('/dashboard') ? 150 * 1024 : 80 * 1024;
  console.log(
    `${route.id}: ${(bytes / 1024).toFixed(1)} KB gzip / ${limit / 1024} KB`,
  );
  if (bytes > limit)
    throw new Error(`Initial JavaScript budget exceeded: ${route.id}`);
  checked++;
}
if (!checked)
  throw new Error('No page bundles were checked. Inspect the build manifest.');
