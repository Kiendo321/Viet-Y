import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base=process.argv[2]?.replace(/\/$/,'');
if(!/^https:\/\/(ux-preview---)?viet-y-ivo7erh2oq-as\.a\.run\.app$/.test(base??''))throw Error('Expected the known Viet Y service');
const get=async url=>{const r=await fetch(base+url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,url);return r;};
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const html=await (await get('/')).text();
const entry=html.match(/src="(\/assets\/[^"\s]+\.js)"/)?.[1];
assert.ok(entry,'Frontend entry missing');
const js=await (await get(entry)).text();
// Read emitted URLs from the deployed client rather than assuming Windows/Linux build hashes agree.
const urls=[...new Set([...js.matchAll(/\/assets\/([^\/"\s]+\.webp)/g)].map(m=>'/assets/'+m[1]))];
assert.equal(urls.length,45,'The deployed client must reference every bundled image');
const files=[];
for(const folder of ['viet-y-v2','outfit-photo-v1'])for(const name of (await readdir(path.join(root,'public/assets',folder))).filter(n=>n.endsWith('.webp')))files.push({folder,name});
const seen=new Set();
for(let i=0;i<urls.length;i+=4)await Promise.all(urls.slice(i,i+4).map(async url=>{
 const emitted=path.posix.basename(url);
 const original=files.find(f=>emitted.startsWith(f.name.slice(0,-5)+'-'));
 assert.ok(original,`Unknown bundled image: ${emitted}`);
 assert.ok(!seen.has(original.name),`Duplicate image: ${emitted}`);seen.add(original.name);
 const response=await get(url);assert.match(response.headers.get('content-type')??'',/image\/webp/);
 assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(await readFile(path.join(root,'public/assets',original.folder,original.name))),`Photo differs: ${emitted}`);
}));
console.log(`PASS: ${entry}; all 45 deployed browser photos match canonical image hashes`);
