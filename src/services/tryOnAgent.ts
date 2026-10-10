import sharp from 'sharp';
import {createGenaiClient} from './genaiConfig';
import {garmentById,eventById,COLORS,ACCESSORIES} from '../data/vietYCatalog';
import type {ComposerSelection} from '../data/vietYCatalog';
import type {VittyStore} from './vittyStore';
import type {VittyTurn} from './vittyContract';
import type {MediaStore} from './mediaStore';
import type {OutfitReference,SavedLook} from './tryOnContract';
import {VittyFailure} from './vittyAgent';
export const IMAGE_MODEL=process.env.GEMINI_IMAGE_MODEL||'gemini-3.1-flash-image';
export const TRYON_PROMPT_VERSION='viet-y-face-v1';
export async function normalizeImage(value:unknown,reference=false):Promise<Buffer>{
 if(typeof value!=='string'||value.length>12*1024*1024)throw new VittyFailure('INVALID_IMAGE',400);
 const match=value.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/);if(!match)throw new VittyFailure('INVALID_IMAGE',400);
 const bytes=Buffer.from(match[2],'base64');if(bytes.length>8*1024*1024||bytes.length<32)throw new VittyFailure('INVALID_IMAGE',400);
 try{const image=sharp(bytes,{limitInputPixels:16000000,animated:false,failOn:'error'}),meta=await image.metadata();
  if(!['png','jpeg','webp'].includes(meta.format||'')||!meta.width||!meta.height||meta.width<64||meta.height<64||(meta.pages||1)>1||(reference&&meta.format!=='png'))throw Error('INVALID');
  return await image.rotate().resize({width:reference?1086:1280,height:reference?1448:1280,fit:'inside',withoutEnlargement:true}).png().toBuffer();
 }catch{throw new VittyFailure('INVALID_IMAGE',400);}
}
export function tryOnPrompt(s:ComposerSelection){
 const garment=garmentById(s.garment)!,event=eventById(s.event)!;
 return `Create one photorealistic portrait by editing IMAGE 1 (the outfit scene). IMAGE 2 is solely the identity reference for the face. Replace the model's face in IMAGE 1 with the recognizable facial identity from IMAGE 2. Do not copy IMAGE 2's clothes or background. Match head angle, perspective, expression and lighting naturally; blend skin at jaw and neck without a pasted seam. Preserve identity-specific facial proportions and natural skin texture; no beauty filter or age change.
Keep IMAGE 1's complete framing, pose, body proportions, hands, clothing, collar geometry, sleeves, fastenings, accessories, colors and event background. Preserve any existing Vietnamese headwear and hairstyle unless the face integration requires a tiny local adjustment. Exactly one person, natural anatomy. Do not add jewelry, props, text or new decorations. Keep the head proportional to the existing body. This is a face-based outfit preview, not a garment fitting simulation.
Outfit: ${garment.name}; color: ${COLORS[s.color].name}; accessory: ${ACCESSORIES[s.accessory].name}. Cultural garment features to preserve: ${garment.anatomy.map(a=>a.title+': '+a.body).join('; ')}. Setting: ${event.name}. These labels describe IMAGE 1; do not invent new elements from them. Return the edited image at portrait 3:4, one image only.`;
}
export async function generateTryOn(reference:Buffer,face:Buffer,selection:ComposerSelection):Promise<Buffer>{
 const client=createGenaiClient();if(!client)throw new VittyFailure('PROVIDER_UNCONFIGURED');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),145000);
 try{
  const response=await client.models.generateContent({model:IMAGE_MODEL,contents:[{role:'user',parts:[{text:tryOnPrompt(selection)},{text:'IMAGE 1: outfit and setting to preserve.'},{inlineData:{mimeType:'image/png',data:reference.toString('base64')}},{text:'IMAGE 2: face identity reference only.'},{inlineData:{mimeType:'image/png',data:face.toString('base64')}}]}],config:{responseModalities:['TEXT','IMAGE'],imageConfig:{aspectRatio:'3:4',imageSize:'1K'},abortSignal:controller.signal}});
  const candidate=response.candidates?.[0];
  if(response.promptFeedback?.blockReason||candidate?.finishReason==='SAFETY')throw new VittyFailure('IMAGE_BLOCKED',422);
  const part=candidate?.content?.parts?.find(p=>!p.thought&&p.inlineData?.mimeType?.startsWith('image/')&&p.inlineData.data);
  if(!part?.inlineData?.data)throw new VittyFailure('IMAGE_UNAVAILABLE');
  const output=await normalizeImage('data:'+part.inlineData.mimeType+';base64,'+part.inlineData.data);
  console.log(JSON.stringify({event:'vitty_tryon_result',model:IMAGE_MODEL,promptVersion:TRYON_PROMPT_VERSION}));return output;
 }catch(e){if(e instanceof VittyFailure)throw e;const status=(e as {status?:number}).status;
  console.warn(JSON.stringify({event:'vitty_tryon_failure',model:IMAGE_MODEL,status:status||null,timeout:controller.signal.aborted}));
  throw new VittyFailure(controller.signal.aborted?'IMAGE_TIMEOUT':status===429?'IMAGE_QUOTA':'IMAGE_UNAVAILABLE',status===429?429:503);
 }finally{clearTimeout(timer);}
}
export type TryOnGenerator=(reference:Buffer,face:Buffer,selection:ComposerSelection)=>Promise<Buffer>;
export async function completeTryOn(store:VittyStore,media:MediaStore,reference:OutfitReference,input:{id:string;authorId:string;avatar:'male'|'female'},face:Buffer,generate:TryOnGenerator=generateTryOn):Promise<VittyTurn>{
 const previous=await store.read(input.id);
 if(previous&&(previous.turn.authorId!==input.authorId||previous.turn.tryOn?.referenceId!==reference.id))throw new VittyFailure('TURN_CONFLICT',409);
 if(previous?.turn.status==='complete'||(previous?.turn.status==='pending'&&previous.turn.leaseUntil>Date.now()))return previous.turn;
 if(previous&&previous.turn.attempt>=2)throw new VittyFailure('IMAGE_UNAVAILABLE');
 const now=new Date().toISOString();
 const today=(await store.all()).filter(t=>t.tryOn&&t.authorId===input.authorId&&t.createdAt.slice(0,10)===now.slice(0,10));
 const totalToday=(await store.all()).filter(t=>t.tryOn&&t.createdAt.slice(0,10)===now.slice(0,10));
 if(!previous&&(today.length>=10||totalToday.length>=50))throw new VittyFailure('DAILY_LIMIT',429);
 const turn:VittyTurn={...input,avatar:previous?.turn.avatar||input.avatar,text:'Thử bộ phối này với ảnh mặt của tôi.',createdAt:previous?.turn.createdAt||now,status:'pending',leaseUntil:Date.now()+185000,attempt:(previous?.turn.attempt||0)+1,context:reference.selection,referenceId:reference.id,tryOn:{referenceId:reference.id,promptVersion:TRYON_PROMPT_VERSION},model:IMAGE_MODEL};
 if(!await store.write(turn,previous?.version||null))return (await store.read(input.id))!.turn;
 const lease=(await store.read(input.id))!;let result:VittyTurn;
 try{
  const png=await media.image('references',reference.id);if(!png)throw new VittyFailure('INVALID_REFERENCE',400);
  const output=await generate(png,face,reference.selection);await media.putImage('results',turn.id,output);
  result={...turn,status:'complete',leaseUntil:0,tryOn:{...turn.tryOn!,image:'/api/vitty/media/results/'+turn.id+'.png'}};
 }catch(e){result={...turn,status:'failed',leaseUntil:0,error:e instanceof VittyFailure?e.code:'IMAGE_UNAVAILABLE'};}
 if(!await store.write(result,lease.version))throw new VittyFailure('TURN_CHANGED',409);return result;
}
export function savedLookFromTurn(turn:VittyTurn,title:unknown,concept:unknown):SavedLook{
 if(turn.status!=='complete'||!turn.tryOn?.image||!turn.context)throw new VittyFailure('IMAGE_UNAVAILABLE',400);
 if(typeof title!=='string'||!title.trim()||title.trim().length>100||typeof concept!=='string'||!concept.trim()||concept.trim().length>60)throw new VittyFailure('INVALID_LOOK',400);
 const s=turn.context,g=garmentById(s.garment)!,event=eventById(s.event)!;
 return {id:turn.id,title:title.trim(),concept:concept.trim(),selection:s,image:turn.tryOn.image,intro:`${g.name} tông ${COLORS[s.color].name.toLowerCase()} trong bối cảnh ${event.name.toLowerCase()}. ${g.intro}`,character:'Nhân vật giữ dáng và trang phục từ bộ phối; gương mặt được tạo dựa trên ảnh người dùng cung cấp.',createdAt:new Date().toISOString(),sourceTurnId:turn.id,imageModel:turn.model||IMAGE_MODEL,promptVersion:turn.tryOn.promptVersion||TRYON_PROMPT_VERSION};
}
