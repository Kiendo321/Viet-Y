import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import sharp from 'sharp';
import {filesystemStore} from '../src/services/vittyStore';
import {filesystemMediaStore} from '../src/services/mediaStore';
import {completeTryOn,normalizeImage,savedLookFromTurn,tryOnPrompt} from '../src/services/tryOnAgent';
import {DEFAULT_SELECTION} from '../src/data/vietYCatalog';
import type {OutfitReference,SavedLook} from '../src/services/tryOnContract';
import {generateVitty,VittyFailure} from '../src/services/vittyAgent';
const sample=()=>sharp({create:{width:96,height:128,channels:3,background:'#994433'}}).png().toBuffer();
test('Uploads decode actual image bytes, reject disguised files and strip metadata',async()=>{
 const png=await sample();const normalized=await normalizeImage('data:image/png;base64,'+png.toString('base64'),true);const meta=await sharp(normalized).metadata();assert.equal(meta.format,'png');assert.equal(meta.width,96);assert.equal(meta.exif,undefined);
 await assert.rejects(normalizeImage('data:image/png;base64,'+Buffer.from('<svg>'+('x'.repeat(100))+'</svg>').toString('base64')),/INVALID_IMAGE/);
 await assert.rejects(normalizeImage('data:image/svg+xml;base64,PHN2Zz4='),/INVALID_IMAGE/);
 const tiny=await sharp({create:{width:20,height:20,channels:3,background:'#fff'}}).png().toBuffer();await assert.rejects(normalizeImage('data:image/png;base64,'+tiny.toString('base64')),/INVALID_IMAGE/);
});
test('Image jobs deduplicate paid calls, survive restart and save one immutable Lookbook item',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'viet-y-tryon-'));
 try{const store=filesystemStore(path.join(dir,'chat')),media=filesystemMediaStore(path.join(dir,'media')),authorId=randomUUID(),id=randomUUID(),png=await sample();
  const ref:OutfitReference={id:randomUUID(),authorId,selection:DEFAULT_SELECTION,createdAt:new Date().toISOString(),image:'test'};await media.putImage('references',ref.id,png);await media.create('references',ref.id,ref);
  let calls=0,release!:()=>void;const gate=new Promise<void>(r=>release=r);const input={id,authorId,avatar:'male' as const};
  const first=completeTryOn(store,media,ref,input,png,async()=>{calls++;await gate;return png;});
  while(!(await store.read(id)))await new Promise(r=>setTimeout(r,1));
  const duplicate=await completeTryOn(store,media,ref,input,png,async()=>{throw Error('DUPLICATE CALL');});assert.equal(duplicate.status,'pending');release();
  const done=await first;assert.equal(done.status,'complete');assert.equal(calls,1);assert.equal((await filesystemStore(path.join(dir,'chat')).read(id))!.turn.tryOn!.image,'/api/vitty/media/results/'+id+'.png');
  assert.ok(!(JSON.stringify(done).includes(png.toString('base64'))));
  const look=savedLookFromTurn(done,'Một ngày hội','Chủ đề mở');const created=await Promise.all([media.create('looks',id,look),media.create('looks',id,{...look,title:'Không thay thế tên'})]);assert.equal(created.filter(Boolean).length,1);
  assert.equal((await filesystemMediaStore(path.join(dir,'media')).read<SavedLook>('looks',id))!.title,'Một ngày hội');assert.deepEqual(await media.image('results',id),png);
  await assert.rejects(completeTryOn(store,media,ref,{...input,authorId:randomUUID()},png),e=>e instanceof VittyFailure&&e.code==='TURN_CONFLICT');
  assert.throws(()=>savedLookFromTurn(done,'','Lễ hội'),/INVALID_LOOK/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('Failed generation is truthful and an explicit retry preserves the original turn',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'viet-y-tryon-'));
 try{const store=filesystemStore(path.join(dir,'chat')),media=filesystemMediaStore(path.join(dir,'media')),png=await sample(),authorId=randomUUID();const ref:OutfitReference={id:randomUUID(),authorId,selection:DEFAULT_SELECTION,createdAt:new Date().toISOString(),image:'test'};await media.putImage('references',ref.id,png);
  const input={id:randomUUID(),authorId,avatar:'female' as const};const failed=await completeTryOn(store,media,ref,input,png,async()=>{throw new VittyFailure('IMAGE_QUOTA',429);});assert.equal(failed.status,'failed');assert.equal(failed.error,'IMAGE_QUOTA');assert.equal(failed.tryOn!.image,undefined);assert.equal(await media.image('results',input.id),null);
  const success=await completeTryOn(store,media,ref,input,png,async()=>png);assert.equal(success.createdAt,failed.createdAt);assert.equal(success.attempt,2);assert.equal((await store.all()).length,1);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('Without PNG context the try-on request resolves to the Workshop flow without invoking a provider',async()=>{
 const answer=await generateVitty({id:randomUUID(),authorId:randomUUID(),avatar:'male',text:'Tôi muốn thử đồ',createdAt:new Date().toISOString(),status:'pending',leaseUntil:0,attempt:1},[],[]);assert.equal(answer.model,'workflow');assert.match(answer.answer.intro,/Thử đồ với Vitty/);
 assert.match(tryOnPrompt(DEFAULT_SELECTION),/IMAGE 2 is solely the identity/);assert.ok(!tryOnPrompt(DEFAULT_SELECTION).includes('[object Object]'));
 const source=await readFile(new URL('../src/services/outfitReference.ts',import.meta.url),'utf8');assert.match(source,/1086/);assert.match(source,/1448/);
});
