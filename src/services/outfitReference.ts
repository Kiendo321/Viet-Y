import {ComposerSelection,ACCESSORIES,eventById} from '../data/vietYCatalog';
import {selectedFigureLayers} from '../components/OutfitScene';
import {browserAsset} from '../assets/browserAssets';
const blobData=(blob:Blob)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result as string);reader.onerror=reject;reader.readAsDataURL(blob);});
export async function imageFileData(file:File){if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024)throw Error('INVALID_IMAGE');return blobData(file);}
// The same viewBox, placements, crop and layer order as OutfitScene; no UI chrome.
export async function exportOutfitPng(s:ComposerSelection):Promise<string>{
 const sources=[eventById(s.event)!.image,...selectedFigureLayers(s).map(l=>l.src),...(s.accessory!=='none'&&s.accessory!=='turban'?[ACCESSORIES[s.accessory].image!]:[])];
 const images=await Promise.all(sources.map(async src=>{const response=await fetch(browserAsset(src));if(!response.ok)throw Error('INVALID_REFERENCE');return blobData(await response.blob());}));
 const legacy=s.garment==='ngu-than'&&s.person==='male';const layers=images.slice(1,1+selectedFigureLayers(s).length);
 const body=legacy?`<svg x="110" y="50" width="866" height="1345" viewBox="220 0 584 1536" preserveAspectRatio="xMidYMid meet">${layers.map(h=>`<image href="${h}" width="1024" height="1536"/>`).join('')}</svg>`:layers.map(h=>`<image href="${h}" x="46" y="60" width="994" height="1325"/>`).join('');
 const accessory=images.length>1+layers.length?`<image href="${images.at(-1)}" x="${s.accessory==='wood-beads'?443:454}" y="${legacy?240:236}" width="${s.accessory==='wood-beads'?190:178}" height="${s.accessory==='wood-beads'?310:135}"/>`:'';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1086" height="1448" viewBox="0 0 1086 1448"><image href="${images[0]}" width="1086" height="1448" preserveAspectRatio="xMidYMid slice"/>${body}${accessory}</svg>`;
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 try{const image=new Image();await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=reject;image.src=url;});const canvas=document.createElement('canvas');canvas.width=1086;canvas.height=1448;canvas.getContext('2d')!.drawImage(image,0,0);return canvas.toDataURL('image/png');}finally{URL.revokeObjectURL(url);}
}
