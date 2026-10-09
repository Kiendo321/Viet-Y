import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base=process.argv[2]?.replace(/\/$/,'');
if(!base||!/^https:\/\/(ux-preview---)?viet-y-ivo7erh2oq-as\.a\.run\.app$/.test(base))throw Error('Expected the known Viet Y Cloud Run service or its preview tag');
const get=async url=>{const r=await fetch(base+url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,`HTTP ${r.status}: ${url}`);return r;};
const hash=b=>createHash('sha256').update(b).digest('hex');
const health=await (await get('/api/health')).json();
assert.equal(health.version,'experience-v2');assert.equal(health.provider,'vertex_ai');assert.equal(health.configured,true);
assert.deepEqual(health.catalog,{garments:5,events:4,looks:6});assert.equal(health.vto,false);
console.log('PASS: experience-v2, Vertex configured, 5 garments / 4 events / 6 shared looks, VTO off');
const html=await (await get('/')).text();
assert.match(html,/Việt Y/);
for(const route of ['/xuong-phoi','/lookbook/ngay-hen','/tu-lieu/trang-phuc/giao-linh','/tu-lieu/su-kien/van-nghe'])assert.equal(await (await get(route)).text(),html);
const assets=(await readdir(path.join(root,'public/assets/viet-y-v2'))).filter(n=>n.endsWith('.webp'));
for(let i=0;i<assets.length;i+=4)await Promise.all(assets.slice(i,i+4).map(async name=>{
 const remote=Buffer.from(await (await get('/assets/viet-y-v2/'+name)).arrayBuffer());
 assert.equal(hash(remote),hash(await readFile(path.join(root,'public/assets/viet-y-v2',name))));
}));
console.log(`PASS: SPA deep routes and ${assets.length} deployed photo assets match local hashes`);
const collection=await (await get('/api/lookbook')).json();assert.equal(collection.shared,true);assert.equal(collection.looks.length,6);
for(const id of ['ngay-hen','mien-ky-uc']){
 const start=Date.now();const story=await (await get(`/api/lookbook/${id}/story`)).json();
 console.log(JSON.stringify({lookId:id,source:story.source,model:story.model,elapsedMs:Date.now()-start,text:story.text}));
 assert.equal(story.source,'gemini',`Real Vertex generation failed for ${id}: ${story.reason}`);assert.ok(story.text.length>=100);
 const look=collection.looks.find(l=>l.id===id);const image=await get(`/api/lookbook/${id}/download`);
 assert.match(image.headers.get('content-disposition'),/attachment/);
 assert.equal(hash(Buffer.from(await image.arrayBuffer())),hash(await readFile(path.join(root,'public',look.image.slice(1).replace(/\.webp$/,'.png')))));
}
console.log('PASS: real Gemini stories and original PNG downloads for female and male concepts');
