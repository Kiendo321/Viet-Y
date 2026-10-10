import {mkdir,readFile,readdir,writeFile,rename,unlink,link} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {Storage} from '@google-cloud/storage';
import {validId} from './vittyStore';
type Area='references'|'results'|'looks';
export interface MediaStore {
 read<T>(area:Area,id:string):Promise<T|null>;create<T>(area:Area,id:string,value:T):Promise<boolean>;
 list<T>(area:Area):Promise<T[]>;image(area:'references'|'results',id:string):Promise<Buffer|null>;
 putImage(area:'references'|'results',id:string,value:Buffer):Promise<void>;
}
const missing=(e:unknown)=>['ENOENT',404].includes((e as {code:string|number}).code);
const key=(area:Area,id:string,ext:string)=>{if(!validId(id))throw Error('INVALID_ID');return area+'/'+id+ext;};
export function filesystemMediaStore(root:string):MediaStore {
 const file=(area:Area,id:string,ext='.json')=>path.resolve(root,key(area,id,ext));
 const read=async<T>(area:Area,id:string):Promise<T|null>=>{try{return JSON.parse(await readFile(file(area,id),'utf8'));}catch(e){if(missing(e))return null;throw e;}};
 return {read,create:async(area,id,value)=>{const target=file(area,id),temp=target+'.'+randomUUID()+'.tmp';await mkdir(path.dirname(target),{recursive:true});try{await writeFile(temp,JSON.stringify(value),{flag:'wx',mode:0o600});await link(temp,target);return true;}catch(e){if((e as {code:string}).code==='EEXIST')return false;throw e;}finally{await unlink(temp).catch(()=>{});}},
 list:async<T>(area:Area)=>{await mkdir(path.resolve(root,area),{recursive:true});const files=await readdir(path.resolve(root,area));return (await Promise.all(files.filter(n=>n.endsWith('.json')&&validId(n.slice(0,-5))).map(n=>read<T>(area,n.slice(0,-5))))).filter(x=>x!==null) as T[];},
 image:async(area,id)=>{try{return await readFile(file(area,id,'.png'));}catch(e){if(missing(e))return null;throw e;}},
 putImage:async(area,id,value)=>{const target=file(area,id,'.png');await mkdir(path.dirname(target),{recursive:true});const temp=target+'.'+randomUUID()+'.tmp';try{await writeFile(temp,value,{flag:'wx',mode:0o600});await rename(temp,target);}finally{await unlink(temp).catch(()=>{});}}
 };
}
export function cloudMediaStore(bucketName:string):MediaStore {
 const bucket=new Storage({projectId:process.env.GOOGLE_CLOUD_PROJECT}).bucket(bucketName),prefix='vitty/media/';
 const file=(area:Area,id:string,ext='.json')=>bucket.file(prefix+key(area,id,ext));
 const read=async<T>(area:Area,id:string):Promise<T|null>=>{try{const [bytes]=await file(area,id).download();return JSON.parse(bytes.toString());}catch(e){if(missing(e))return null;throw e;}};
 return {read,create:async(area,id,value)=>{try{await file(area,id).save(JSON.stringify(value),{resumable:false,contentType:'application/json',preconditionOpts:{ifGenerationMatch:0}});return true;}catch(e){if((e as {code:number}).code===412)return false;throw e;}},
 list:async<T>(area:Area)=>{const [files]=await bucket.getFiles({prefix:prefix+area+'/'});return (await Promise.all(files.filter(f=>f.name.endsWith('.json')&&validId(f.name.split('/').at(-1)!.slice(0,-5))).map(async f=>JSON.parse((await f.download())[0].toString()) as T)));},
 image:async(area,id)=>{try{return (await file(area,id,'.png').download())[0];}catch(e){if(missing(e))return null;throw e;}},
 putImage:async(area,id,value)=>{await file(area,id,'.png').save(value,{resumable:false,contentType:'image/png'});}
 };
}
export function configuredMediaStore():MediaStore {if(process.env.VITTY_STORAGE_BUCKET)return cloudMediaStore(process.env.VITTY_STORAGE_BUCKET);if(process.env.K_SERVICE)throw Error('DURABLE_STORAGE_UNCONFIGURED');return filesystemMediaStore(process.env.VITTY_MEDIA_DIR||'.vitty-media');}
