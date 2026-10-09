import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {GARMENTS,OCCASIONS,LOOKS,ACCESSORIES} from '../src/data/vietYCatalog';
import {cleanLookStory,lookStoryPrompt,produceLookStory} from '../src/services/lookStory';
test('Every exposed variant, event, accessory and look has a real local asset',()=>{
 const urls=[...GARMENTS.flatMap(g=>Object.values(g.variants).flatMap(v=>Object.values(v!))),...OCCASIONS.map(e=>e.image),...LOOKS.map(l=>l.image),...Object.values(ACCESSORIES).flatMap(a=>a.image?[a.image]:[])];
 for(const url of urls)if(url!=='legacy')assert.ok(existsSync('public'+url),url);
 for(const look of LOOKS)assert.ok(existsSync('public'+look.image.replace(/\.webp$/,'.png')));
});
test('Lookbook prompt contains validated cultural context and the exact selected occasion/person',()=>{
 const p=lookStoryPrompt(LOOKS[1]);
 assert.ok(p.includes('Áo Nhật Bình'));assert.ok(p.includes('Lễ ăn hỏi'));assert.ok(p.includes(LOOKS[1].character));
 assert.ok(p.includes('Không bịa'));assert.ok(p.includes('chưa có thử đồ'));
});
test('Malformed, empty, HTML or oversized story outputs are rejected',()=>{
 for(const text of ['',null,'short','<script>'+LOOKS[0].intro+'</script>','x'.repeat(1601)])assert.equal(cleanLookStory(text),null);
 assert.equal(cleanLookStory(LOOKS[0].intro),LOOKS[0].intro);
});
test('Primary model failure uses the backup and truthfully records which model produced the story',async()=>{
 const calls:string[]=[];const r=await produceLookStory(LOOKS[0],['primary','backup'],async model=>{calls.push(model);if(model==='primary')throw Error('quota');return LOOKS[0].intro;});
 assert.deepEqual(calls,['primary','backup']);assert.equal(r.source,'gemini');assert.equal(r.model,'backup');
});
test('When both models fail, the editorial paragraph is usable and never marked Gemini success',async()=>{
 const r=await produceLookStory(LOOKS[2],['a','b'],async()=>{throw Error('timeout');});
 assert.equal(r.text,LOOKS[2].intro);assert.equal(r.source,'editorial');assert.equal(r.model,null);
});

