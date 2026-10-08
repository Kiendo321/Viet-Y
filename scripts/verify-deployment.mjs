import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.argv[2] || '').replace(/\/$/, '');
assert.match(base, /^https:\/\/(?:viet-y-171206540455\.asia-southeast1\.run\.app|(?:ux-preview---)?viet-y-ivo7erh2oq-as\.a\.run\.app)$/);
const get = url => fetch(`${base}${url}`, { signal: AbortSignal.timeout(45000) });
const checks = [];
const healthResponse = await get('/api/health');
assert.equal(healthResponse.status, 200);
const health = await healthResponse.json();
assert.equal(health.status, 'ok');
checks.push({ name: 'public health', status: 'pass', hasApiKey: health.hasApiKey, provider: health.provider, configured: health.configured });
const homepage = await get('/');
assert.equal(homepage.status, 200);
assert.match(homepage.headers.get('content-type'), /text\/html/);
const html = await homepage.text();
assert.match(html, /id="root"/);
const spa = await get('/lookbook');
assert.equal(spa.status, 200);
assert.equal(await spa.text(), html);
checks.push({ name: 'homepage and SPA', status: 'pass' });
const references = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+\.(?:js|css))"/g)].map(match => match[1]);
assert.ok(references.length >= 2);
for (const url of references) {
  const response = await get(url);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), url.endsWith('.css') ? /text\/css/ : /javascript/);
  assert.ok((await response.arrayBuffer()).byteLength > 100);
}
checks.push({ name: 'frontend bundles', status: 'pass', count: references.length });
const directory = path.join(root, 'public', 'assets', 'outfit-photo-v1');
const photos = (await readdir(directory)).filter(name => name.endsWith('.webp'));
assert.equal(photos.length, 18);
for (const name of photos) {
  const response = await get(`/assets/outfit-photo-v1/${name}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image\/webp/);
  const remote = Buffer.from(await response.arrayBuffer());
  const local = await readFile(path.join(directory, name));
  assert.equal(createHash('sha256').update(remote).digest('hex'), createHash('sha256').update(local).digest('hex'));
}
checks.push({ name: 'outfit assets', status: 'pass', count: photos.length });
const invalid = await get('/api/not-a-real-route');
assert.equal(invalid.status, 404);
assert.equal((await invalid.json()).error, 'API_ENDPOINT_NOT_FOUND');
checks.push({ name: 'API JSON routing', status: 'pass' });
const report = { checkedAt: new Date().toISOString(), url: base, checks, liveGeminiCall: false };
await writeFile(path.join(root, 'docs', 'DEPLOYMENT-HTTP-CHECK.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
