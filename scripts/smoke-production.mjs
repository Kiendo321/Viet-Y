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
    env: { ...process.env, PORT: String(port), NODE_ENV: 'development', GEMINI_API_KEY: '' },
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
  for (const route of ['/', '/lookbook']) {
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
  const fallback = await fetch(`${base}/api/stylist/suggest`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  });
  assert.equal(fallback.status, 200);
  const result = await fallback.json();
  assert.equal(result.error, 'API_KEY_MISSING');
  assert.equal(result.source, 'curated_fallback');
  assert.equal(result.suggestions.length, 2);
  summary.push('PASS: API routing and missing-key fallback work without Gemini calls');
  console.log(summary.join('\n'));
} finally {
  if (child && child.exitCode === null) child.kill();
  if (childDone) await childDone;
  if (path.dirname(stage) !== root || !path.basename(stage).startsWith('.runtime-smoke-')) {
    throw new Error('Refusing cleanup outside the smoke-test directory');
  }
  await rm(stage, { recursive: true, force: true });
}
