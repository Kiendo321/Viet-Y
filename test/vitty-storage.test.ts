import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readdir} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {filesystemStore,vittyPage} from '../src/services/vittyStore';
import {completeVittyTurn,VittyFailure} from '../src/services/vittyAgent';
import {DEFAULT_SELECTION} from '../src/data/vietYCatalog';
import {validateVittyAnswer,VittyTurn} from '../src/services/vittyContract';
const answer=validateVittyAnswer({title:'Gợi ý cho chuyến tham quan',intro:'Chọn dáng gọn, thuận di chuyển.',sections:[],outfits:[],articles:[]});
test('Shared file history survives a new adapter; duplicate concurrent requests call provider once',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vitty-test-'));
 try{const store=filesystemStore(dir);let calls=0;let release:()=>void;const gate=new Promise<void>(r=>release=r);
  const input={id:randomUUID(),authorId:randomUUID(),avatar:'male' as const,text:'Mặc gì đi di tích?'};
  const first=completeVittyTurn(store,input,async()=>{calls++;await gate;return {answer,model:'test'};});
  while(!(await store.read(input.id)))await new Promise(r=>setTimeout(r,1));
  const duplicate=await completeVittyTurn(store,input,async()=>{throw new Error('Must not call provider twice');});assert.equal(duplicate.status,'pending');release!();
  const result=await first;assert.equal(result.status,'complete');assert.equal(calls,1);
  const restored=filesystemStore(dir);assert.deepEqual((await vittyPage(restored)).turns,[result]);
  await assert.rejects(completeVittyTurn(restored,{...input,text:'Different request'},async()=>({answer,model:'test'})),e=>e instanceof VittyFailure&&e.code==='TURN_CONFLICT');
  assert.equal((await readdir(dir)).filter(n=>n.endsWith('.json')).length,1);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('Failed answer retries keep the original user turn, timestamp and avatar',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vitty-test-'));
 try{const store=filesystemStore(dir),input={id:randomUUID(),authorId:randomUUID(),avatar:'female' as const,text:'Tôi muốn thử đồ.'};
  const failed=await completeVittyTurn(store,input,async()=>{throw new VittyFailure('ANSWER_UNAVAILABLE');});assert.equal(failed.status,'failed');assert.equal(failed.answer,undefined);
  const recovered=await completeVittyTurn(filesystemStore(dir),{...input,avatar:'male'},async()=>({answer,model:'test'}));
  assert.equal(recovered.createdAt,failed.createdAt);assert.equal(recovered.avatar,'female');assert.equal(recovered.attempt,2);assert.equal((await store.all()).length,1);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('Pagination retains old files; request paths cannot escape the configured directory',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vitty-test-'));
 try{const store=filesystemStore(dir),authorId=randomUUID();
  for(let i=0;i<44;i++){const turn:VittyTurn={id:randomUUID(),authorId,avatar:'male',text:'Question '+i,createdAt:new Date(1700000000000+i*1000).toISOString(),status:'complete',answer,leaseUntil:0,attempt:1};await store.write(turn,null);}
  const latest=await vittyPage(store);assert.equal(latest.turns.length,40);assert.ok(latest.before);
  const older=await vittyPage(store,latest.before!);assert.equal(older.turns.length,4);assert.equal(older.before,null);assert.equal((await store.all()).length,44);
  await assert.rejects(store.read('../secret'),/INVALID_ID/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('Model cards reject unavailable outfit combinations, unknown articles and arbitrary links',()=>{
 const validated=validateVittyAnswer({title:'Thử phối',intro:'Gợi ý',outfits:[{title:'Valid',selection:DEFAULT_SELECTION},{title:'Invalid',selection:{...DEFAULT_SELECTION,garment:'nhat-binh',person:'male'}},{title:'External',selection:{garment:'https://example.com'}}],articles:[{kind:'garment',id:'ngu-than'},{kind:'event',id:'https://example.com'}],sections:[{title:'An toàn',body:'<script>example</script>',items:[]}]});
 assert.equal(validated.outfits.length,1);assert.deepEqual(validated.articles,[{kind:'garment',id:'ngu-than'}]);assert.equal(validated.sections[0].body,'<script>example</script>');
});
