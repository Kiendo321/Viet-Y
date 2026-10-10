import {ComposerSelection,GARMENTS,OCCASIONS,normalizeSelection,garmentById,eventById} from '../data/vietYCatalog';
import type {TryOnResult} from './tryOnContract';

export type VittyAvatar = 'male'|'female';
export interface VittySection {title:string;body:string;items:string[];}
export interface VittyOutfit {title:string;reason:string;selection:ComposerSelection;}
export interface VittyArticle {kind:'garment'|'event';id:string;}
export interface VittyDesign {title:string;inspiration:string;silhouette:string;palette:string[];materials:string;details:string;culturalNotes:string;}
export interface VittyAnswer {title:string;intro:string;sections:VittySection[];outfits:VittyOutfit[];articles:VittyArticle[];design:VittyDesign|null;followUp:string;}
export interface VittyTurn {
 id:string;authorId:string;avatar:VittyAvatar;text:string;createdAt:string;
 status:'pending'|'complete'|'failed';leaseUntil:number;attempt:number;
 context?:ComposerSelection;referenceId?:string;tryOn?:TryOnResult;answer?:VittyAnswer;model?:string;error?:string;
}
export interface VittyPage {turns:VittyTurn[];before:string|null;shared:true;storage:'filesystem'|'cloud-storage';}
export const VITTY_STARTERS=['Có những trang phục và sự kiện nào?','Tôi nên mặc gì?','Tôi muốn thử đồ.'] as const;
const text=(v:unknown,max=2000)=>typeof v==='string'?v.trim().slice(0,max):'';
const list=(v:unknown,max=8)=>Array.isArray(v)?v.slice(0,max).map(x=>text(x,900)).filter(Boolean):[];
const object=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
export function validSelection(value:unknown):ComposerSelection|null {
 const v=object(value),normalized=normalizeSelection(v as Partial<ComposerSelection>);
 return (['garment','event','person','color','accessory'] as const).every(k=>v[k]===normalized[k])?normalized:null;
}
export function validateVittyAnswer(value:unknown):VittyAnswer {
 const v=object(value);const intro=text(v.intro),title=text(v.title,160);
 if(!intro&&!title)throw new Error('INVALID_ANSWER');
 const sections=Array.isArray(v.sections)?v.sections.slice(0,6).map(object).map(s=>({title:text(s.title,160),body:text(s.body),items:list(s.items)})).filter(s=>s.body||s.items.length):[];
 const outfits:VittyOutfit[]=Array.isArray(v.outfits)?v.outfits.slice(0,3).flatMap(raw=>{
  const o=object(raw),selection=validSelection(o.selection);
  return selection?[{title:text(o.title,160)||garmentById(selection.garment)!.shortName,reason:text(o.reason,900),selection}]:[];
 }):[];
 const articles:VittyArticle[]=Array.isArray(v.articles)?v.articles.slice(0,4).flatMap<VittyArticle>(raw=>{
  const a=object(raw),id=text(a.id,40);
  return a.kind==='garment'&&garmentById(id)?[{kind:'garment' as const,id}]:a.kind==='event'&&eventById(id)?[{kind:'event' as const,id}]:[];
 }):[];
 const d=object(v.design);const design=text(d.title,160)?{title:text(d.title,160),inspiration:text(d.inspiration,900),silhouette:text(d.silhouette,900),palette:list(d.palette,6),materials:text(d.materials,900),details:text(d.details,1200),culturalNotes:text(d.culturalNotes,1200)}:null;
 return {title,intro,sections,outfits,articles,design,followUp:text(v.followUp,500)};
}
export const VITTY_RESPONSE_SCHEMA={
 type:'object',required:['title','intro','sections','outfits','articles','followUp'],properties:{
  title:{type:'string'},intro:{type:'string'},followUp:{type:'string'},
  sections:{type:'array',items:{type:'object',required:['title','body','items'],properties:{title:{type:'string'},body:{type:'string'},items:{type:'array',items:{type:'string'}}}}},
  outfits:{type:'array',items:{type:'object',required:['title','reason','selection'],properties:{title:{type:'string'},reason:{type:'string'},selection:{type:'object',required:['garment','event','person','color','accessory'],properties:{garment:{type:'string',enum:GARMENTS.map(g=>g.id)},event:{type:'string',enum:OCCASIONS.map(e=>e.id)},person:{type:'string',enum:['male','female']},color:{type:'string',enum:['black','indigo','green','red','gold','ivory','brown']},accessory:{type:'string',enum:['none','silver-collar','pearl-necklace','wood-beads','turban']}}}}}},
  articles:{type:'array',items:{type:'object',required:['kind','id'],properties:{kind:{type:'string',enum:['garment','event']},id:{type:'string'}}}},
  design:{type:'object',properties:{title:{type:'string'},inspiration:{type:'string'},silhouette:{type:'string'},palette:{type:'array',items:{type:'string'}},materials:{type:'string'},details:{type:'string'},culturalNotes:{type:'string'}}}
 }
};
