import React,{useEffect,useState} from 'react';
import {ArrowUpRight,ArrowLeft,Download,Camera,ArrowRight} from 'lucide-react';
import {LOOKS,lookById,garmentById,eventById,COLORS} from '../data/vietYCatalog';
import {Link} from '../services/navigation';
import {NotFound} from './Library';
export function Lookbook(){
 const [concept,setConcept]=useState('Tất cả');
 const concepts=['Tất cả',...new Set(LOOKS.map(l=>l.concept))];
 const looks=concept==='Tất cả'?LOOKS:LOOKS.filter(l=>l.concept===concept);
 return <section className="lookbook page"><header className="page-heading"><h1>Lookbook</h1><p>Những bộ phối, những khoảnh khắc, một câu chuyện chung.</p></header>
  <div className="concept-tabs" aria-label="Chủ đề lookbook">{concepts.map(c=><button key={c} aria-pressed={concept===c} className={concept===c?'active':''} onClick={()=>setConcept(c)}>{c}</button>)}</div>
  <div className="lookbook-grid">{looks.map(l=><Link key={l.id} to={'/lookbook/'+l.id} className="look-tile"><div><img src={l.image} alt={l.title} loading="lazy"/><span className="tile-open"><ArrowUpRight size={22}/></span></div><h2>{l.title}</h2><p>{l.concept}</p></Link>)}
   <Link to="/xuong-phoi" className="empty-look-tile"><Camera size={30}/><span>Thử một kiểu phối</span><ArrowUpRight size={19}/></Link>
  </div>
 </section>;
}
type StoryState={id:string;text:string;status:'loading'|'ready'|'fallback';};
export function LookDetail({id}:{id:string}){
 const look=lookById(id),[story,setStory]=useState<StoryState|null>(null),[retry,setRetry]=useState(0);
 useEffect(()=>{
  if(!look)return;const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),22000);
  let active=true;setStory({id,text:look.intro,status:'loading'});
  fetch('/api/lookbook/'+encodeURIComponent(id)+'/story',{signal:controller.signal})
   .then(async r=>{const data=await r.json();if(!r.ok||typeof data.text!=='string')throw Error('story');return data;})
   .then(data=>{if(active)setStory({id,text:data.text,status:data.source==='gemini'?'ready':'fallback'});})
   .catch(()=>{if(active)setStory({id,text:look.intro,status:'fallback'});})
   .finally(()=>clearTimeout(timeout));
  return()=>{active=false;controller.abort();clearTimeout(timeout);};
 },[id,retry]);
 if(!look)return <NotFound/>;
 const garment=garmentById(look.selection.garment)!,occasion=eventById(look.selection.event)!;
 const current=story?.id===id?story:null;
 return <article className="look-detail page"><Link to="/lookbook" className="back-link"><ArrowLeft size={16}/>Lookbook</Link><div className="look-detail-grid">
  <figure><img src={look.image} alt={look.title}/></figure><div className="look-detail-copy"><h1>{look.title}</h1><p className="look-concept">{look.concept}</p><div className="look-story" aria-busy={current?.status==='loading'}><p>{current?.text||look.intro}</p>{current?.status==='loading'&&<span className="story-status" role="status"><span className="spinner"/>Đang viết câu chuyện</span>}{current?.status==='fallback'&&<button className="text-button" onClick={()=>setRetry(x=>x+1)}>Làm mới lời giới thiệu</button>}</div>
  <dl className="look-context"><div><dt>Trang phục</dt><dd><Link to={'/tu-lieu/trang-phuc/'+garment.id}>{garment.name}<ArrowUpRight size={14}/></Link></dd></div><div><dt>Bối cảnh</dt><dd><Link to={'/tu-lieu/su-kien/'+occasion.id}>{occasion.name}<ArrowUpRight size={14}/></Link></dd></div><div><dt>Tông màu</dt><dd><span className="inline-swatch" style={{backgroundColor:COLORS[look.selection.color].hex}}/>{COLORS[look.selection.color].name}</dd></div></dl>
  <a className="primary-link" href={'/api/lookbook/'+look.id+'/download'} download={'viet-y-'+look.id+'.png'}><Download size={18}/>Tải ảnh</a>
  <Link to="/lookbook" className="quiet-link">Xem bộ sưu tập <ArrowRight size={17}/></Link>
  </div></div></article>;
}

