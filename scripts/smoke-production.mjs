import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, readFile, readdir, rm, symlink } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stage = await mkdtemp(path.join(root, '.runtime-smoke-'));
let child;
let childDone;
let output = '';
const summary = [];
try {
  // Stage only deployable files: no server.ts, src/, tsx entry point or .env.
  for (const name of ['server.js', 'package.json', 'dist', 'public']) {
    await cp(path.join(root, name), path.join(stage, name), { recursive: true });
  }
  await symlink(path.join(root, 'node_modules'), path.join(stage, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise((resolve, reject) => reservation.close(err => err ? reject(err) : resolve()));
  child = spawn(process.execPath, ['server.js'], {
    cwd: stage,
    env: { ...process.env, PORT: String(port), NODE_ENV: 'development', GEMINI_API_KEY: '', GOOGLE_GENAI_USE_VERTEXAI: 'false' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  childDone = once(child, 'exit');
  child.stdout.on('data', data => { output += data; });
  child.stderr.on('data', data => { output += data; });
  const base = `http://127.0.0.1:${port}`;
  let health;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Server exited before readiness: ${output}`);
    try {
      const response = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(1000) });
      assert.equal(response.status, 200);
      health = await response.json();
      break;
    } catch { await delay(100); }
  }
  assert.ok(health, `Server did not become ready: ${output}`);
  assert.equal(health.status, 'ok');
  assert.equal(health.hasApiKey, false);
  summary.push('PASS: compiled server starts without TypeScript source and honors PORT');
  const html = await readFile(path.join(stage, 'dist', 'index.html'), 'utf8');
  for (const route of ['/', '/xuong-phoi', '/lookbook', '/lookbook/ngay-hen', '/tu-lieu', '/tu-lieu/trang-phuc/nhat-binh', '/tu-lieu/su-kien/an-hoi', '/vitty']) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(await response.text(), html);
  }
  summary.push('PASS: homepage and SPA route return the production HTML');
  const references = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+\.(?:js|css))"/g)].map(match => match[1]);
  assert.ok(references.length >= 2);
  for (const url of references) {
    const response = await fetch(`${base}${url}`);
    assert.equal(response.status, 200);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(path.join(stage, 'dist', url.slice(1))));
  }
  summary.push(`PASS: ${references.length} frontend JS/CSS bundles match build output`);
  const bundledPhotos=(await readdir(path.join(stage,'dist','assets'))).filter(name=>name.endsWith('.webp'));
  const canonicalPhotos=(await Promise.all(['viet-y-v2','outfit-photo-v1'].map(folder=>readdir(path.join(stage,'public','assets',folder))))).flat().filter(name=>name.endsWith('.webp'));
  const authoredPhotos=(await Promise.all(['landing','vitty'].map(folder=>readdir(path.join(root,'src','assets',folder))))).flat().filter(name=>name.endsWith('.webp'));
  assert.equal(bundledPhotos.length,canonicalPhotos.length+authoredPhotos.length,'Every browser photo must be emitted by Vite');
  for(const name of bundledPhotos){
    const response=await fetch(`${base}/assets/${name}`);
    assert.equal(response.status,200);
    assert.match(response.headers.get('content-type'),/image\/webp/);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile(path.join(stage,'dist','assets',name)));
  }
  summary.push(`PASS: all ${bundledPhotos.length} bundled browser photos are served as intact WebP images`);
  const photoDirectory = path.join(stage, 'public', 'assets', 'outfit-photo-v1');
  const photos = (await readdir(photoDirectory)).filter(name => name.endsWith('.webp'));
  assert.equal(photos.length, 18);
  for (const name of photos) {
    const response = await fetch(`${base}/assets/outfit-photo-v1/${name}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /image\/webp/);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(path.join(photoDirectory, name)));
  }
  summary.push('PASS: all 18 outfit WebP assets are served intact');
  const missingApi = await fetch(`${base}/api/not-a-real-route`);
  assert.equal(missingApi.status, 404);
  assert.equal((await missingApi.json()).error, 'API_ENDPOINT_NOT_FOUND');
  const v2Directory = path.join(stage, 'public', 'assets', 'viet-y-v2');
  const v2 = (await readdir(v2Directory)).filter(name => name.endsWith('.webp'));
  assert.equal(v2.length, 27);
  for (const name of v2) {
    const response = await fetch(`${base}/assets/viet-y-v2/${name}`);
    assert.equal(response.status, 200);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(path.join(v2Directory, name)));
  }
  const collection = await (await fetch(`${base}/api/lookbook`)).json();
  assert.equal(collection.shared, true);
  assert.equal(collection.looks.length, 6);
  for (const look of collection.looks) {
    const story = await (await fetch(`${base}/api/lookbook/${look.id}/story`)).json();
    assert.equal(story.source, 'editorial');
    assert.equal(story.text, look.intro);
    const download = await fetch(`${base}/api/lookbook/${look.id}/download`);
    assert.equal(download.status, 200);
    assert.match(download.headers.get('content-disposition'), /attachment/);
    assert.deepEqual(Buffer.from(await download.arrayBuffer()), await readFile(path.join(stage, 'public', look.image.slice(1).replace(/\.webp$/, '.png'))));
  }
  for (const route of ['/api/stylist/suggest', '/api/image/generate', '/api/image/recolor']) {
    assert.equal((await fetch(`${base}${route}`, {method:'POST'})).status, 410);
  }
  assert.equal((await fetch(`${base}/api/lookbook/unknown/story`)).status, 404);
  const fonts = await fetch(`${base}/fonts/fonts.css`);
  assert.equal(fonts.status, 200);
  assert.match(await fonts.text(), /Be Vietnam Pro/);
  summary.push('PASS: 27 new assets, six shared looks, intact PNG downloads, self-hosted fonts and truthful story fallback');
  console.log(summary.join('\n'));
} finally {
  if (child && child.exitCode === null) child.kill();
  if (childDone) await childDone;
  if (path.dirname(stage) !== root || !path.basename(stage).startsWith('.runtime-smoke-')) {
    throw new Error('Refusing cleanup outside the smoke-test directory');
  }
  await rm(stage, { recursive: true, force: true });
}
