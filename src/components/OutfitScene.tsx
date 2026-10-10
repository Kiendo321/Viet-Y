import React,{useEffect,useState} from 'react';
import {ComposerSelection,COLORS,eventById,garmentById,ACCESSORIES} from '../data/vietYCatalog';
import {browserAsset} from '../assets/browserAssets';
import {resolvePhotoLayers} from '../data/outfitPhotoAssets';
const legacyColors:Record<string,string>={black:'color-sa-kep-den-lot-trang',indigo:'color-muc-cham-co',green:'color-xanh-ngoc-bich',red:'color-do-son-tram',gold:'color-vang-hoang-cuc',ivory:'color-trang-nga-toi-gian'};
export function selectedFigureLayers(s:ComposerSelection){
 const g=garmentById(s.garment)!;
 if(g.variants[s.person]?.[s.color]==='legacy'){
  return resolvePhotoLayers({occasionId:'',garmentId:'',colorId:legacyColors[s.color],styleId:'',userNote:'',accessoryIds:s.accessory==='turban'?['acc-khan-dong-den']:[]});
 }
 return [{part:'figure',src:g.variants[s.person]![s.color]!}];
}
export function OutfitScene({selection,className='',plain=false,onReady}:{selection:ComposerSelection;className?:string;plain?:boolean;onReady?:(ready:boolean)=>void}){
 const legacy=selection.garment==='ngu-than'&&selection.person==='male';
 const g=garmentById(selection.garment)!;
 const occasion=eventById(selection.event)!;
 const figureLayers=selectedFigureLayers(selection).map(layer=>({...layer,src:browserAsset(layer.src)}));
 const background=browserAsset(occasion.image);
 const accessoryPath=ACCESSORIES[selection.accessory]?.image;
 const accessory=accessoryPath?browserAsset(accessoryPath):undefined;
 const externalAccessory=accessory&&selection.accessory!=='turban';
 const sources=[...figureLayers.map(l=>l.src),...(!plain?[background]:[]),...(externalAccessory?[accessory!]:[])];
 const key=sources.join('|');
 const [loaded,setLoaded]=useState(''),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{
  let active=true;setError(false);onReady?.(false);
  Promise.all(sources.map(src=>new Promise<void>((resolve,reject)=>{const image=new window.Image();image.onload=()=>resolve();image.onerror=reject;image.src=src;})))
   .then(()=>{if(active){setLoaded(key);onReady?.(true);}})
   .catch(()=>{if(active)setError(true);});
  return()=>{active=false;};
 },[key,retry]);
 const ready=loaded===key;
 // All garment colors are pre-rendered files; SVG only places photographic layers.
 return <div className={'outfit-scene '+className} aria-busy={!ready} data-scene-key={key}>
  <svg viewBox="0 0 1086 1448" role="img" aria-label={g.name+' · '+COLORS[selection.color].name+' · '+occasion.name} className={ready?'scene-ready':''}>
   {plain?<rect width="1086" height="1448" fill="#F4EFE6"/>:<image data-layer="background" href={background} width="1086" height="1448" preserveAspectRatio="xMidYMid slice"/>}
   {legacy?<svg x="110" y="50" width="866" height="1345" viewBox="220 0 584 1536" preserveAspectRatio="xMidYMid meet">
    {figureLayers.map(l=><image key={l.part} data-layer={l.part} href={l.src} width="1024" height="1536"/>)}
   </svg>:figureLayers.map(l=><image key={l.part} data-layer={l.part} href={l.src} x="46" y="60" width="994" height="1325"/>)}
   {externalAccessory&&<image data-layer="accessory" href={accessory} x={selection.accessory==='wood-beads'?443:454} y={legacy?240:236}
     width={selection.accessory==='wood-beads'?190:178} height={selection.accessory==='wood-beads'?310:135}/>}
  </svg>
  {!ready&&<div className="scene-status" role={error?'alert':'status'}>
   {error?<><span>Ảnh chưa tải được.</span><button className="text-button" onClick={()=>setRetry(x=>x+1)}>Thử lại</button></>:<><span className="spinner"/><span>Đang tải bộ phối</span></>}
  </div>}
 </div>;
}

