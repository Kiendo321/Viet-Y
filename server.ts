import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';
import {ThinkingLevel} from '@google/genai';
import {createGenaiClient,genaiSettings} from './src/services/genaiConfig.js';
import {LOOKS,GARMENTS,OCCASIONS,lookById} from './src/data/vietYCatalog.js';
import {produceLookStory,completeStoryText,LookStory} from './src/services/lookStory.js';
import {configuredVittyStore,validId,vittyPage,VittyStore} from './src/services/vittyStore.js';
import {completeVittyTurn,generateVitty,VittyFailure} from './src/services/vittyAgent.js';
import {validSelection} from './src/services/vittyContract.js';

dotenv.config();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
export const PRIMARY_TEXT_MODEL=process.env.GEMINI_TEXT_MODEL||'gemini-3.8-flash';
export const BACKUP_TEXT_MODEL=process.env.GEMINI_BACKUP_TEXT_MODEL||'gemini-3.7-flash';
const storyCache=new Map<string,{value:LookStory;expires:number}>();
const pendingStories=new Map<string,Promise<LookStory>>();
async function storyFor(id:string):Promise<LookStory>{
 const look=lookById(id)!;
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
  // Only six curated entries: cache is naturally bounded; duplicate requests share a model call.
  storyCache.set(id,{value:result,expires:Date.now()+(result.source==='gemini'?12*60*60*1000:30000)});
  console.log(JSON.stringify({event:'lookbook_story_result',lookId:id,source:result.source,model:result.model}));
  return result;
 }finally{pendingStories.delete(id);}
}
async function startServer(){
 const app=express();
 app.disable('x-powered-by');
 app.use(express.json({limit:'1mb'}));
 let vittyStore:VittyStore|null=null;
 const store=()=>vittyStore||(vittyStore=configuredVittyStore());
 const activeVitty=new Set<string>();
 const vittyOrigins=new Set((process.env.VITTY_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean));
 app.use('/api/vitty',(req,res,next)=>{
  const origin=req.get('Origin');
  if(origin){
   let sameHost=false;try{sameHost=new URL(origin).host===req.get('Host');}catch{}
   if(!sameHost&&!vittyOrigins.has(origin)){res.status(403).json({error:'ORIGIN_NOT_ALLOWED'});return;}
   res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
   res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
  }
  if(req.method==='OPTIONS'){res.sendStatus(204);return;}next();
 });
 const vittyError=(res:express.Response,e:unknown)=>{
  const failure=e instanceof VittyFailure?e:new VittyFailure((e as Error).message==='DURABLE_STORAGE_UNCONFIGURED'?'DURABLE_STORAGE_UNCONFIGURED':'STORAGE_UNAVAILABLE');
  res.status(failure.status).json({error:failure.code});
 };
 app.get('/api/vitty',async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.query.before&&!validId(req.query.before)){res.status(400).json({error:'INVALID_CURSOR'});return;}
  try{res.json(await vittyPage(store(),req.query.before as string|undefined));}catch(e){vittyError(res,e);}
 });
 app.post('/api/vitty/turns',async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  const {id,authorId,avatar,text,context}=req.body||{};
  if(!validId(id)||!validId(authorId)||(avatar!=='male'&&avatar!=='female')||typeof text!=='string'||!text.trim()||text.length>4000){res.status(400).json({error:'INVALID_MESSAGE'});return;}
  const selection=context===undefined?undefined:validSelection(context);
  if(selection===null){res.status(400).json({error:'INVALID_CONTEXT'});return;}
  if(activeVitty.size>=3&&!activeVitty.has(id)){res.status(429).json({error:'BUSY'});return;}
  const ownsSlot=!activeVitty.has(id);if(ownsSlot)activeVitty.add(id);
  try{res.json({turn:await completeVittyTurn(store(),{id,authorId,avatar,text:text.trim(),...(selection?{context:selection}:{})},(turn,history)=>generateVitty(turn,history,[PRIMARY_TEXT_MODEL,BACKUP_TEXT_MODEL]))});}
  catch(e){vittyError(res,e);}finally{if(ownsSlot)activeVitty.delete(id);}
 });
 app.get('/api/health',(_req,res)=>res.json({
  status:'ok',brand:'Việt Y',version:'experience-v2',hasApiKey:Boolean(process.env.GEMINI_API_KEY&&process.env.GEMINI_API_KEY!=='MY_GEMINI_API_KEY'),
  provider:genaiSettings().provider,configured:genaiSettings().configured,textModel:PRIMARY_TEXT_MODEL,backupTextModel:BACKUP_TEXT_MODEL,
  catalog:{garments:GARMENTS.length,events:OCCASIONS.length,looks:LOOKS.length},vto:false
 }));
 app.get('/api/lookbook',(req,res)=>res.json({looks:LOOKS,shared:true}));
 app.get('/api/lookbook/:id/story',async(req,res)=>{
  const look=lookById(req.params.id);
  if(!look){res.status(404).json({error:'LOOK_NOT_FOUND'});return;}
  res.setHeader('Cache-Control','no-store');
  try{res.json(await storyFor(look.id));}
  catch{res.json({text:look.intro,source:'editorial',model:null,reason:'STORY_UNAVAILABLE'});}
 });
 app.get('/api/lookbook/:id/download',(req,res)=>{
  const look=lookById(req.params.id);
  if(!look){res.status(404).json({error:'LOOK_NOT_FOUND'});return;}
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
