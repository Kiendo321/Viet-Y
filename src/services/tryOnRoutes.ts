import express from 'express';
import {randomUUID} from 'node:crypto';
import {validId,VittyStore} from './vittyStore';
import {MediaStore} from './mediaStore';
import {validSelection} from './vittyContract';
import {VittyFailure} from './vittyAgent';
import {normalizeImage,completeTryOn,savedLookFromTurn} from './tryOnAgent';
import {OutfitReference,SavedLook} from './tryOnContract';
import {createGenaiClient} from './genaiConfig';
import {garmentById,eventById,COLORS} from '../data/vietYCatalog';
export function tryOnRouter(store:()=>VittyStore,media:()=>MediaStore,textModel:string){
 const router=express.Router(),active=new Set<string>();
 const run=(work:(req:express.Request,res:express.Response)=>Promise<void>)=>async(req:express.Request,res:express.Response)=>{res.setHeader('Cache-Control','no-store');try{await work(req,res);}catch(e){const f=e instanceof VittyFailure?e:new VittyFailure('STORAGE_UNAVAILABLE');res.status(f.status).json({error:f.code});}};
 router.post('/references',run(async(req,res)=>{
  const s=validSelection(req.body?.selection);if(!s||!validId(req.body?.authorId))throw new VittyFailure('INVALID_REFERENCE',400);
  const png=await normalizeImage(req.body?.image,true),id=randomUUID();
  const reference:OutfitReference={id,authorId:req.body.authorId,selection:s,createdAt:new Date().toISOString(),image:'/api/vitty/media/references/'+id+'.png'};
  await media().putImage('references',id,png);await media().create('references',id,reference);res.status(201).json({reference});
 }));
 router.get('/references/:id',run(async(req,res)=>{if(!validId(req.params.id))throw new VittyFailure('INVALID_REFERENCE',400);const reference=await media().read<OutfitReference>('references',req.params.id);if(!reference)throw new VittyFailure('INVALID_REFERENCE',404);res.json({reference});}));
 router.get('/media/:area/:file',run(async(req,res)=>{
  const id=req.params.file.replace(/\.png$/,'');if(!validId(id)||!req.params.file.endsWith('.png')||!['references','results'].includes(req.params.area))throw new VittyFailure('INVALID_REFERENCE',404);
  const bytes=await media().image(req.params.area as 'references'|'results',id);if(!bytes)throw new VittyFailure('INVALID_REFERENCE',404);
  res.setHeader('X-Content-Type-Options','nosniff');if(req.query.download==='1')res.setHeader('Content-Disposition','attachment; filename="viet-y-'+id+'.png"');res.type('png').send(bytes);
 }));
 router.post('/try-on',run(async(req,res)=>{
  const {id,authorId,avatar,referenceId,consent}=req.body||{};
  if(!validId(id)||!validId(authorId)||!validId(referenceId)||(avatar!=='male'&&avatar!=='female')||consent!==true)throw new VittyFailure('INVALID_REFERENCE',400);
  const reference=await media().read<OutfitReference>('references',referenceId);if(!reference||reference.authorId!==authorId)throw new VittyFailure('INVALID_REFERENCE',400);
  const existing=await store().read(id);
  if(existing?.turn.tryOn?.referenceId===referenceId&&existing.turn.authorId===authorId&&(existing.turn.status==='complete'||existing.turn.status==='pending'&&existing.turn.leaseUntil>Date.now())){res.json({turn:existing.turn});return;}
  if(active.size>=2&&!active.has(id))throw new VittyFailure('BUSY',429);
  const face=await normalizeImage(req.body.face);const owns=!active.has(id);if(owns)active.add(id);
  try{res.json({turn:await completeTryOn(store(),media(),reference,{id,authorId,avatar},face)});}finally{if(owns)active.delete(id);}
 }));
 router.post('/try-on/:id/names',run(async(req,res)=>{
  if(!validId(req.params.id)||!validId(req.body?.authorId))throw new VittyFailure('INVALID_LOOK',400);
  const turn=(await store().read(req.params.id))?.turn;if(!turn?.context||turn.authorId!==req.body.authorId||turn.status!=='complete'||!turn.tryOn?.image)throw new VittyFailure('INVALID_LOOK',400);
  const client=createGenaiClient();if(!client)throw new VittyFailure('PROVIDER_UNCONFIGURED');
  const s=turn.context,controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  try{const response=await client.models.generateContent({model:textModel,contents:'Đề xuất 3 tên ngắn khác nhau bằng tiếng Việt (2–7 từ) cho ảnh Lookbook Việt Y. Không bịa địa điểm hay danh tính. Chỉ trả JSON {"names":[...]} theo ngữ cảnh: '+JSON.stringify({garment:garmentById(s.garment)!.name,event:eventById(s.event)!.name,color:COLORS[s.color].name}),config:{responseMimeType:'application/json',responseJsonSchema:{type:'object',required:['names'],properties:{names:{type:'array',items:{type:'string'}}}},maxOutputTokens:1024,abortSignal:controller.signal}});
   if(response.candidates?.[0]?.finishReason!=='STOP')throw Error('INCOMPLETE');const parsed=JSON.parse(response.text||'{}');const names=Array.isArray(parsed.names)?parsed.names.filter((n:unknown)=>typeof n==='string'&&n.trim().length>0&&n.length<=100).slice(0,3):[];if(!names.length)throw Error('INVALID');res.json({names,model:textModel});
  }catch{throw new VittyFailure('NAME_UNAVAILABLE');}finally{clearTimeout(timer);}
 }));
 router.post('/try-on/:id/save',run(async(req,res)=>{
  if(!validId(req.params.id)||!validId(req.body?.authorId))throw new VittyFailure('INVALID_LOOK',400);
  const turn=(await store().read(req.params.id))?.turn;if(!turn||turn.authorId!==req.body.authorId)throw new VittyFailure('INVALID_LOOK',400);
  const previous=await media().read<SavedLook>('looks',turn.id);if(previous){res.json({look:previous});return;}
  const look=savedLookFromTurn(turn,req.body.title,req.body.concept);await media().create('looks',look.id,look);res.status(201).json({look:await media().read<SavedLook>('looks',look.id)});
 }));
 return router;
}
