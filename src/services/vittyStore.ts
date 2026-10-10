import {mkdir,readdir,readFile,writeFile,rename,unlink} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {Storage} from '@google-cloud/storage';
import {VittyTurn,VittyPage} from './vittyContract';

export const validId=(id:unknown):id is string=>typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
interface Versioned {turn:VittyTurn;version:string;}
export interface VittyStore {
 kind:VittyPage['storage'];read(id:string):Promise<Versioned|null>;
 write(turn:VittyTurn,expected:string|null):Promise<boolean>;all():Promise<VittyTurn[]>;
}
const ordered=(turns:VittyTurn[])=>turns.sort((a,b)=>a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id));
const missing=(e:unknown)=>(e as {code?:string|number}).code==='ENOENT'||(e as {code?:number}).code===404;
const locks=new Map<string,Promise<unknown>>();
async function locked<T>(key:string,work:()=>Promise<T>):Promise<T>{
 const before=locks.get(key)||Promise.resolve();const task=before.catch(()=>{}).then(work);locks.set(key,task);
 try{return await task;}finally{if(locks.get(key)===task)locks.delete(key);}
}
export function filesystemStore(directory:string):VittyStore {
 const root=path.resolve(directory),file=(id:string)=>{if(!validId(id))throw new Error('INVALID_ID');return path.join(root,id+'.json');};
 const read=async(id:string):Promise<Versioned|null>=>{
  try{const value=JSON.parse(await readFile(file(id),'utf8'));return {turn:value.turn,version:value.version};}
  catch(e){if(missing(e))return null;throw e;}
 };
 return {kind:'filesystem',read,
  write:(turn,expected)=>locked(file(turn.id),async()=>{
   await mkdir(root,{recursive:true});const current=await read(turn.id);if((current?.version||null)!==expected)return false;
   const temp=file(turn.id)+'.'+randomUUID()+'.tmp';
   try{await writeFile(temp,JSON.stringify({version:randomUUID(),turn}),{flag:'wx',mode:0o600});await rename(temp,file(turn.id));return true;}
   finally{await unlink(temp).catch(e=>{if(!missing(e))throw e;});}
  }),
  all:async()=>{await mkdir(root,{recursive:true});const names=await readdir(root);return ordered((await Promise.all(names.filter(n=>n.endsWith('.json')&&validId(n.slice(0,-5))).map(async n=>(await read(n.slice(0,-5)))!.turn))));}
 };
}
export function cloudFileStore(bucketName:string,prefix='vitty/shared/'):VittyStore {
 const bucket=new Storage({projectId:process.env.GOOGLE_CLOUD_PROJECT}).bucket(bucketName);
 const file=(id:string)=>{if(!validId(id))throw new Error('INVALID_ID');return bucket.file(prefix+id+'.json');};
 return {kind:'cloud-storage',
  read:async id=>{try{
   // Pin the read to the generation whose metadata was fetched; never pair stale bytes with a newer generation.
   const [metadata]=await file(id).getMetadata();const generation=String(metadata.generation);
   const [bytes]=await bucket.file(prefix+id+'.json',{generation}).download();return {turn:JSON.parse(bytes.toString()),version:generation};
  }catch(e){if(missing(e))return null;throw e;}},
  write:async(turn,expected)=>{try{
   await file(turn.id).save(JSON.stringify(turn),{resumable:false,contentType:'application/json',preconditionOpts:{ifGenerationMatch:expected===null?0:Number(expected)}});return true;
  }catch(e){if((e as {code?:number}).code===412)return false;throw e;}},
  all:async()=>{
   const [files]=await bucket.getFiles({prefix});
   const turns=await Promise.all(files.filter(f=>validId(f.name.slice(prefix.length).replace(/\.json$/,''))).map(async f=>{
    const [bytes]=await f.download();return JSON.parse(bytes.toString()) as VittyTurn;
   }));return ordered(turns);
  }
 };
}
export function configuredVittyStore():VittyStore {
 if(process.env.VITTY_STORAGE_BUCKET)return cloudFileStore(process.env.VITTY_STORAGE_BUCKET);
 if(process.env.K_SERVICE)throw new Error('DURABLE_STORAGE_UNCONFIGURED');
 return filesystemStore(process.env.VITTY_DATA_DIR||path.resolve('.vitty-data'));
}
export async function vittyPage(store:VittyStore,before?:string):Promise<VittyPage>{
 const all=await store.all();const cursor=before?all.findIndex(t=>t.id===before):all.length;
 const eligible=all.slice(0,cursor<0?all.length:cursor);const turns=eligible.slice(-40);
 return {turns,before:eligible.length>turns.length?turns[0].id:null,shared:true,storage:store.kind};
}
