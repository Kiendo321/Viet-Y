import React,{useEffect,useRef,useState} from 'react';
import {Upload,ArrowUpRight,Download,Bookmark,Check,Sparkles,RotateCw} from 'lucide-react';
import {Link} from '../services/navigation';
import {apiRequest,apiUrl,jsonPost} from '../services/apiClient';
import {imageFileData} from '../services/outfitReference';
import {OutfitReference,TRYON_ERRORS,SavedLook} from '../services/tryOnContract';
import {VittyTurn,VittyAvatar} from '../services/vittyContract';
import {COLORS,garmentById,eventById} from '../data/vietYCatalog';
const message=(e:unknown)=>TRYON_ERRORS[(e as Error).message]||TRYON_ERRORS.NETWORK;
export function TryOnReference({reference,author,avatar,onTurn}:{reference:OutfitReference;author:string;avatar:VittyAvatar;onTurn:(turn:VittyTurn)=>void}){
 const [photo,setPhoto]=useState<File|null>(null),[preview,setPreview]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const input=useRef<HTMLInputElement>(null),pending=useRef<string|null>(null);
 useEffect(()=>{setPhoto(null);setError('');pending.current=null;},[reference.id]);
 useEffect(()=>{if(!photo){setPreview('');return;}const url=URL.createObjectURL(photo);setPreview(url);return()=>URL.revokeObjectURL(url);},[photo]);
 async function generate(){if(!photo||busy)return;setBusy(true);setError('');
  const id=pending.current||crypto.randomUUID();pending.current=id;
  try{const face=await imageFileData(photo);onTurn({id,authorId:author,avatar,text:'Thử bộ phối này với ảnh mặt của tôi.',context:reference.selection,referenceId:reference.id,tryOn:{referenceId:reference.id},createdAt:new Date().toISOString(),status:'pending',leaseUntil:Date.now()+185000,attempt:1});
   const response=await apiRequest<{turn:VittyTurn}>('/api/vitty/try-on',jsonPost({id,authorId:author,avatar,referenceId:reference.id,face,consent:true}),170000);onTurn(response.turn);
   if(response.turn.status==='complete'){pending.current=null;setPhoto(null);if(input.current)input.current.value='';}
   else if(response.turn.status==='failed')setError(TRYON_ERRORS[response.turn.error||'']||TRYON_ERRORS.IMAGE_UNAVAILABLE);
  }catch(e){setError(message(e));}finally{setBusy(false);}
 }
 const s=reference.selection;
 return <div className="vitty-reference" aria-busy={busy}>
  <img className="vitty-reference-image" src={apiUrl(reference.image)} alt={'Bộ phối tham chiếu: '+garmentById(s.garment)!.name}/>
  <div className="vitty-reference-copy"><h2>Thử bộ phối của bạn</h2><p>{garmentById(s.garment)!.shortName} · {COLORS[s.color].name}<br/>{eventById(s.event)!.name}</p>
   <input ref={input} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" aria-label="Tải ảnh mặt để thử đồ" disabled={busy} onChange={e=>{const next=e.target.files?.[0];if(!next)return;if(next.size>8*1024*1024||!['image/png','image/jpeg','image/webp'].includes(next.type)){setError(TRYON_ERRORS.INVALID_IMAGE);return;}pending.current=null;setError('');setPhoto(next);}}/>
   <div className="vitty-tryon-controls"><button className="secondary-link" disabled={busy} onClick={()=>input.current?.click()}><Upload size={17}/>{photo?'Đổi ảnh mặt':'Tải ảnh mặt'}</button>{preview&&<img className="vitty-face-upload" src={preview} alt="Ảnh mặt đã chọn"/>}</div>
   {photo&&<><p className="vitty-upload-note">Ảnh mặt được gửi đến Gemini để tạo ảnh. Kết quả xuất hiện trong hội thoại chung; ảnh mặt gốc không được lưu.</p><button className="primary-link" disabled={busy} onClick={generate}>{busy?<><span className="spinner"/>Đang tạo ảnh thử đồ</>:<><Sparkles size={17}/>Tạo ảnh thử đồ</>}</button></>}
   {busy&&<p className="vitty-upload-note" role="status">Kết quả sẽ được giữ trong hội thoại khi hoàn tất.</p>}{error&&<p className="vitty-upload-error" role="alert">{error}</p>}
  </div>
 </div>;
}
export function TryOnResultCard({turn,author}:{turn:VittyTurn;author:string}){
 const [open,setOpen]=useState(false),[name,setName]=useState(()=>garmentById(turn.context!.garment)!.shortName+' · '+COLORS[turn.context!.color].name);
 const [names,setNames]=useState<string[]>([]),[naming,setNaming]=useState(false),[saving,setSaving]=useState(false),[saved,setSaved]=useState<string|null>(null),[error,setError]=useState('');
 useEffect(()=>{let live=true;void apiRequest<{look:SavedLook}>('/api/lookbook/'+turn.id).then(r=>{if(live)setSaved(r.look.id);}).catch(()=>{});return()=>{live=false;};},[turn.id]);
 async function suggest(){setNaming(true);setError('');try{const result=await apiRequest<{names:string[]}>('/api/vitty/try-on/'+turn.id+'/names',jsonPost({authorId:author}),24000);setNames(result.names);}catch(e){setError(message(e));}finally{setNaming(false);}}
 async function save(){if(saving)return;setSaving(true);setError('');try{const {look}=await apiRequest<{look:SavedLook}>('/api/vitty/try-on/'+turn.id+'/save',jsonPost({authorId:author,title:name,concept:eventById(turn.context!.event)!.name}));setSaved(look.id);setOpen(false);}catch(e){setError(message(e));}finally{setSaving(false);}}
 return <div className="vitty-result"><h2>Bộ phối của bạn đã sẵn sàng</h2><img className="vitty-result-image" src={apiUrl(turn.tryOn!.image!)} alt={'Ảnh thử '+garmentById(turn.context!.garment)!.name}/>
  <div className="vitty-result-actions"><a className="text-button" href={apiUrl('/api/vitty/media/results/'+turn.id+'.png?download=1')} download={'viet-y-'+turn.id+'.png'}><Download size={17}/>Tải ảnh</a>{saved?<Link className="secondary-link" to={'/lookbook/'+saved}><Check size={17}/>Đã lưu · Xem ảnh</Link>:turn.authorId===author&&<button className="primary-link" aria-expanded={open} onClick={()=>setOpen(!open)}><Bookmark size={17}/>Lưu vào Lookbook</button>}</div>
  {open&&!saved&&<form className="vitty-save-form" onSubmit={e=>{e.preventDefault();void save();}}><div className="vitty-name-heading"><label htmlFor={'name-'+turn.id}>Tên ảnh</label><button type="button" className="text-button" disabled={naming} onClick={suggest}>{naming?<span className="spinner"/>:<Sparkles size={15}/>}Gợi ý tên</button></div><input id={'name-'+turn.id} maxLength={100} required value={name} onChange={e=>setName(e.target.value)}/>{names.length>0&&<div className="vitty-name-options">{names.map(n=><button key={n} type="button" aria-pressed={name===n} onClick={()=>setName(n)}>{n}</button>)}</div>}
   <button className="primary-link" disabled={saving||!name.trim()} type="submit">{saving?<span className="spinner"/>:<Check size={17}/>} {saving?'Đang lưu':'Lưu bộ ảnh'}</button>
  </form>}{error&&<p className="vitty-upload-error" role="alert">{error}</p>}
 </div>;
}
export function MissingOutfit(){return <div className="vitty-missing-outfit"><p>Chọn trang phục, màu và bối cảnh ở Xưởng phối, rồi bấm “Thử đồ với Vitty” để gửi bộ phối vào đây.</p><Link className="primary-link" to="/xuong-phoi">Chọn bộ phối <ArrowUpRight size={17}/></Link></div>;}
export function FailedTryOn({turn,onRetry}:{turn:VittyTurn;onRetry?:()=>void}){return <div className="vitty-failure"><p>{TRYON_ERRORS[turn.error||'']||TRYON_ERRORS.IMAGE_UNAVAILABLE}</p>{onRetry&&<button onClick={onRetry}><RotateCw size={15}/>Chọn lại ảnh mặt</button>}</div>;}
