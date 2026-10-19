import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { z } from 'zod';

const chunkSchema = z.object({
  file: z.string(),
  imports: z.array(z.string()).optional(),
});
const viteSchema = z.record(z.string(), chunkSchema);
const serverSchema = z.object({
  client: z.object({ imports: z.array(z.string()) }),
  routes: z.array(
    z.object({
      id: z.string(),
      page: z
        .object({ layouts: z.array(z.number().optional()), leaf: z.number() })
        .nullish(),
    }),
  ),
  nodes: z.array(
    z.custom<() => Promise<unknown>>((value) => typeof value === 'function'),
  ),
});
const module: unknown = await import(
  pathToFileURL(resolve('.svelte-kit/output/server/manifest-full.js')).href
);
const { manifest } = z.object({ manifest: serverSchema }).parse(module);
const root = '.svelte-kit/output/client/';
const vite = viteSchema.parse(
  JSON.parse(await readFile(`${root}.vite/manifest.json`, 'utf8')),
);
const byFile = new Map(Object.values(vite).map((entry) => [entry.file, entry]));

function add(file: string, files: Set<string>): void {
  if (files.has(file)) return;
  files.add(file);
  for (const key of byFile.get(file)?.imports || []) {
    const entry = vite[key];
    if (!entry) throw new Error(`Missing build dependency: ${key}`);
    add(entry.file, files);
  }
}

let checked = 0;
for (const route of manifest.routes) {
  if (!route.page || !route.id.includes('[locale=locale]')) continue;
  const files = new Set<string>();
  for (const file of manifest.client.imports) add(file, files);
  for (const node of [...route.page.layouts, route.page.leaf]) {
    if (node === undefined) continue;
    const factory = manifest.nodes[node];
    if (!factory) throw new Error(`Missing page bundle: ${node}`);
    const loaded = z
      .object({ imports: z.array(z.string()).default([]) })
      .parse(await factory());
    for (const file of loaded.imports) add(file, files);
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
