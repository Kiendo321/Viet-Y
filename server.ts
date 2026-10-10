import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';
import {ThinkingLevel} from '@google/genai';
import {createGenaiClient,genaiSettings} from './src/services/genaiConfig.js';
import {LOOKS,GARMENTS,OCCASIONS,lookById,Look} from './src/data/vietYCatalog.js';
import {produceLookStory,completeStoryText,LookStory} from './src/services/lookStory.js';
import {configuredVittyStore,validId,vittyPage,VittyStore} from './src/services/vittyStore.js';
import {completeVittyTurn,generateVitty,VittyFailure} from './src/services/vittyAgent.js';
import {validSelection} from './src/services/vittyContract.js';
import {configuredMediaStore,MediaStore} from './src/services/mediaStore.js';
import {tryOnRouter} from './src/services/tryOnRoutes.js';
import {IMAGE_MODEL} from './src/services/tryOnAgent.js';
import {OutfitReference,SavedLook} from './src/services/tryOnContract.js';

dotenv.config();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
export const PRIMARY_TEXT_MODEL=process.env.GEMINI_TEXT_MODEL||'gemini-3.8-flash';
export const BACKUP_TEXT_MODEL=process.env.GEMINI_BACKUP_TEXT_MODEL||'gemini-3.7-flash';
const storyCache=new Map<string,{value:LookStory;expires:number}>();
const pendingStories=new Map<string,Promise<LookStory>>();
async function storyFor(look:Look):Promise<LookStory>{
 const id=look.id;
 const cached=storyCache.get(id);
 if(cached&&cached.expires>Date.now())return cached.value;
 const pending=pendingStories.get(id);if(pending)return pending;
 const client=createGenaiClient();
 if(!client)return {text:look.intro,source:'editorial',model:null,reason:'PROVIDER_UNCONFIGURED'};
 if(pendingStories.size>=3)return {text:look.intro,source:'editorial',model:null,reason:'BUSY'};
 const work=produceLookStory(look,[PRIMARY_TEXT_MODEL,BACKUP_TEXT_MODEL],async(model,prompt)=>{
  const controller=new AbortController();
  let timeout:ReturnType<typeof setTimeout>;
  try{
   console.log(JSON.stringify({event:'lookbook_story_request',lookId:id,model}));
   const request=client.models.generateContent({model,contents:prompt,config:{
    temperature:.7,maxOutputTokens:2048,thinkingConfig:{thinkingLevel:ThinkingLevel.LOW},abortSignal:controller.signal
   }});
   const response=await Promise.race([request,new Promise<never>((_,reject)=>{
    timeout=setTimeout(()=>{controller.abort();reject(new Error('Story timeout'));},9000);
   })]);
   console.log(JSON.stringify({event:'lookbook_model_response',lookId:id,model,finishReason:response.candidates?.[0]?.finishReason,thoughtTokens:response.usageMetadata?.thoughtsTokenCount,outputTokens:response.usageMetadata?.candidatesTokenCount}));
   return completeStoryText(response);
  }catch(error){
   const failure=error as {status?:number;message?:string};
   console.warn(JSON.stringify({event:'lookbook_model_failure',lookId:id,model,status:typeof failure.status==='number'?failure.status:null,kind:controller.signal.aborted?'TIMEOUT':failure.message==='INCOMPLETE_STORY'?'INCOMPLETE_STORY':'PROVIDER_ERROR'}));
   throw error;
  }finally{clearTimeout(timeout!);}
 });
 pendingStories.set(id,work);
 try{
  const result=await work;
  if(storyCache.size>=200)storyCache.delete(storyCache.keys().next().value!);
  storyCache.set(id,{value:result,expires:Date.now()+(result.source==='gemini'?12*60*60*1000:30000)});
  console.log(JSON.stringify({event:'lookbook_story_result',lookId:id,source:result.source,model:result.model}));
  return result;
 }finally{pendingStories.delete(id);}
}
async function startServer(){
 const app=express();
 app.disable('x-powered-by');
 app.use(['/api/vitty/references','/api/vitty/try-on'],express.json({limit:'13mb'}));
 app.use(express.json({limit:'1mb'}));
 let vittyStore:VittyStore|null=null;
 const store=()=>vittyStore||(vittyStore=configuredVittyStore());
 let mediaStore:MediaStore|null=null;
 const media=()=>mediaStore||(mediaStore=configuredMediaStore());
 const findLook=async(id:string)=>lookById(id)||(validId(id)?await media().read<SavedLook>('looks',id):null);
 const activeVitty=new Set<string>();
 const vittyOrigins=new Set((process.env.VITTY_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean));
 app.use(['/api/vitty','/api/lookbook'],(req,res,next)=>{
  const origin=req.get('Origin');
  if(origin){
   let sameHost=false;try{sameHost=new URL(origin).host===req.get('Host');}catch{}
   if(!sameHost&&!vittyOrigins.has(origin)){res.status(403).json({error:'ORIGIN_NOT_ALLOWED'});return;}
   res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
   res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
  }
  if(req.method==='OPTIONS'){res.sendStatus(204);return;}next();
 });
 app.use('/api/vitty',tryOnRouter(store,media,PRIMARY_TEXT_MODEL));
 const vittyError=(res:express.Response,e:unknown)=>{
  const failure=e instanceof VittyFailure?e:new VittyFailure((e as Error).message==='DURABLE_STORAGE_UNCONFIGURED'?'DURABLE_STORAGE_UNCONFIGURED':'STORAGE_UNAVAILABLE');
  res.status(failure.status).json({error:failure.code});
 };
 app.get('/api/vitty',async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.query.before&&!validId(req.query.before)){res.status(400).json({error:'INVALID_CURSOR'});return;}
  try{const page=await vittyPage(store(),req.query.before as string|undefined);
   for(let i=0;i<page.turns.length;i++){const t=page.turns[i];if(t.tryOn&&t.status==='pending'&&t.leaseUntil<Date.now()){const current=await store().read(t.id);if(current?.turn.status==='pending'&&current.turn.leaseUntil<Date.now()){const expired={...current.turn,status:'failed' as const,leaseUntil:0,error:'IMAGE_TIMEOUT'};if(await store().write(expired,current.version))page.turns[i]=expired;}}}
   res.json(page);
  }catch(e){vittyError(res,e);}
 });
 app.post('/api/vitty/turns',async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  const {id,authorId,avatar,text,context,referenceId}=req.body||{};
  if(!validId(id)||!validId(authorId)||(avatar!=='male'&&avatar!=='female')||typeof text!=='string'||!text.trim()||text.length>4000){res.status(400).json({error:'INVALID_MESSAGE'});return;}
  const selection=context===undefined?undefined:validSelection(context);
  if(selection===null){res.status(400).json({error:'INVALID_CONTEXT'});return;}
  if(activeVitty.size>=3&&!activeVitty.has(id)){res.status(429).json({error:'BUSY'});return;}
  const ownsSlot=!activeVitty.has(id);if(ownsSlot)activeVitty.add(id);
  try{
   let reference:OutfitReference|null=null,referencePng:Buffer|undefined;
   if(referenceId!==undefined){if(!validId(referenceId))throw new VittyFailure('INVALID_CONTEXT',400);reference=await media().read<OutfitReference>('references',referenceId);if(!reference||reference.authorId!==authorId)throw new VittyFailure('INVALID_CONTEXT',400);referencePng=await media().image('references',referenceId)||undefined;if(!referencePng)throw new VittyFailure('INVALID_CONTEXT',400);}
   res.json({turn:await completeVittyTurn(store(),{id,authorId,avatar,text:text.trim(),...(reference?{context:reference.selection,referenceId:reference.id}:selection?{context:selection}:{})},(turn,history)=>generateVitty(turn,history,[PRIMARY_TEXT_MODEL,BACKUP_TEXT_MODEL],referencePng))});
  }
  catch(e){vittyError(res,e);}finally{if(ownsSlot)activeVitty.delete(id);}
 });
 app.get('/api/health',(_req,res)=>res.json({
  status:'ok',brand:'Việt Y',version:'experience-v2',hasApiKey:Boolean(process.env.GEMINI_API_KEY&&process.env.GEMINI_API_KEY!=='MY_GEMINI_API_KEY'),
  provider:genaiSettings().provider,configured:genaiSettings().configured,textModel:PRIMARY_TEXT_MODEL,backupTextModel:BACKUP_TEXT_MODEL,
  catalog:{garments:GARMENTS.length,events:OCCASIONS.length,looks:LOOKS.length},vto:true,imageModel:IMAGE_MODEL
 }));
 app.get('/api/lookbook',async(_req,res)=>{res.setHeader('Cache-Control','no-store');try{const saved=await media().list<SavedLook>('looks');res.json({looks:[...saved.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),...LOOKS],shared:true});}catch(e){vittyError(res,e);}});
 app.get('/api/lookbook/:id',async(req,res)=>{try{const look=await findLook(req.params.id);if(!look){res.status(404).json({error:'LOOK_NOT_FOUND'});return;}res.json({look});}catch(e){vittyError(res,e);}});
 app.get('/api/lookbook/:id/story',async(req,res)=>{
  let look:Look|null|undefined;try{look=await findLook(req.params.id);}catch(e){vittyError(res,e);return;}
  if(!look){res.status(404).json({error:'LOOK_NOT_FOUND'});return;}
  res.setHeader('Cache-Control','no-store');
  try{res.json(await storyFor(look));}
  catch{res.json({text:look.intro,source:'editorial',model:null,reason:'STORY_UNAVAILABLE'});}
 });
 app.get('/api/lookbook/:id/download',async(req,res)=>{
  let look:Look|null|undefined;try{look=await findLook(req.params.id);}catch(e){vittyError(res,e);return;}
  if(!look){res.status(404).json({error:'LOOK_NOT_FOUND'});return;}
  if(validId(look.id)){try{const image=await media().image('results',look.id);if(!image){res.status(404).json({error:'IMAGE_NOT_FOUND'});return;}res.setHeader('Content-Disposition','attachment; filename="viet-y-'+look.id+'.png"');res.type('png').send(image);}catch(e){vittyError(res,e);}return;}
  // Resolve only known catalog IDs, never a request-supplied filesystem path.
  const file=path.resolve(__dirname,'public',look.image.slice(1).replace(/\.webp$/,'.png'));
  res.download(file,'viet-y-'+look.id+'.png',error=>{
   if(error&&!res.headersSent)res.status(404).json({error:'IMAGE_NOT_FOUND'});
  });
 });
 app.all(['/api/stylist/suggest','/api/image/generate','/api/image/recolor'],(_req,res)=>{
  res.status(410).json({error:'FEATURE_RETIRED',message:'Tính năng không còn thuộc xưởng phối hiện tại.'});
 });
 app.all('/api/*',(_req,res)=>res.status(404).json({error:'API_ENDPOINT_NOT_FOUND'}));
 app.use((error:unknown,_req:express.Request,res:express.Response,next:express.NextFunction)=>{if(error){res.status((error as {status?:number}).status===413?413:400).json({error:'INVALID_IMAGE'});return;}next();});
 app.use('/assets',express.static(path.resolve(__dirname,'public','assets'),{maxAge:'1h'}));
 app.use(express.static(path.resolve(__dirname,'public')));
 if(process.env.NODE_ENV!=='production'){
  const {createServer:createViteServer}=await import('vite');
  const vite=await createViteServer({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);
 }else{
  app.use(express.static(path.resolve(__dirname,'dist')));
  app.get('*',(_req,res)=>res.sendFile(path.resolve(__dirname,'dist','index.html')));
 }
 const port=Number(process.env.PORT)||3000;
 app.listen(port,process.env.LOCAL_LISTEN_HOST||'0.0.0.0',()=>console.log('Việt Y server running on port '+port));
}
startServer().catch(error=>{console.error('Server startup failed',error?.message);process.exit(1);});
