import React,{useEffect,useRef,useState} from 'react';
import {ArrowUp,ArrowDown,ArrowUpRight,BookOpen,Check,ChevronDown,RotateCw,X} from 'lucide-react';
import {Link} from '../services/navigation';
import {ComposerSelection,GARMENTS,OCCASIONS,COLORS,ACCESSORIES,composerUrl,garmentById,eventById,selectionFromSearch} from '../data/vietYCatalog';
import {browserAsset} from '../assets/browserAssets';
import {VittyAnswer,VittyAvatar,VittyPage,VittyTurn,VITTY_STARTERS,validateVittyAnswer} from '../services/vittyContract';
import {OutfitScene} from './OutfitScene';

const VITTY_IMAGE=new URL('../assets/vitty/vitty-a-cultural-guide.png',import.meta.url).href;
const AVATARS={male:browserAsset('/assets/outfit-photo-v1/avatar.webp'),female:browserAsset('/assets/viet-y-v2/nguthan-female-ivory.webp')};
// Studio's preview serves frontend modules but its API paths currently return startup HTML.
// The stable preview tag runs this same backend with Vertex; public routes stay same-origin.
const API_BASE=import.meta.env?.VITE_VITTY_API_BASE||(window.location.hostname.startsWith('ais-dev-')&&window.location.hostname.endsWith('.run.app')?'https://ux-preview---viet-y-ivo7erh2oq-as.a.run.app':'');
const local={read:(key:string)=>{try{return localStorage.getItem('vitty:'+key);}catch{return null;}},write:(key:string,value:string)=>{try{localStorage.setItem('vitty:'+key,value);}catch{}},remove:(key:string)=>{try{localStorage.removeItem('vitty:'+key);}catch{}}};
function ownId(){const saved=local.read('author');if(saved)return saved;const id=crypto.randomUUID();local.write('author',id);return id;}
const errorText:Record<string,string>={PROVIDER_UNCONFIGURED:'Vitty chưa kết nối được dịch vụ trả lời.',ANSWER_UNAVAILABLE:'Vitty chưa trả lời được lúc này. Bạn có thể thử lại.',STORAGE_UNAVAILABLE:'Chưa kết nối được lịch sử trò chuyện. Thử tải lại.',DURABLE_STORAGE_UNCONFIGURED:'Lịch sử trò chuyện chưa sẵn sàng. Thử lại sau.',BUSY:'Vitty đang trả lời một vài câu hỏi. Bạn thử lại sau một chút nhé.',INVALID_MESSAGE:'Câu hỏi cần từ 1 đến 4.000 ký tự.',TURN_CONFLICT:'Lượt này đã được gửi với nội dung khác. Hãy tải lại hội thoại.',NETWORK:'Chưa nhận được phản hồi. Câu hỏi được giữ lại để bạn thử lại.'};
async function request<T>(url:string,options?:RequestInit):Promise<T>{
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),options?.method==='POST'?85000:12000);
 try{const response=await fetch(API_BASE+url,{...options,signal:controller.signal});const body=await response.json();if(!response.ok)throw new Error(body.error||'NETWORK');return body;}
 catch(e){if(e instanceof Error&&errorText[e.message])throw e;throw new Error('NETWORK');}
 finally{clearTimeout(timeout);}
}
function Face({who,className=''}:{who:'vitty'|VittyAvatar;className?:string}){
 return <span className={'vitty-face '+who+' '+className}><img src={who==='vitty'?VITTY_IMAGE:AVATARS[who]} alt="" draggable={false}/></span>;
}
function Fan(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9a10 10 0 0 1 18 0L13 19h-2L3 9Z M12 3v16 M6.5 5 12 19 M17.5 5 12 19 M3 9l9 10 9-10 M10.5 20h3"/></svg>;}
function Answer({answer}:{answer:VittyAnswer}){
 const {title,intro,sections,outfits,articles,design,followUp}=answer;
 return <div className="vitty-answer">
  {title&&<h2>{title}</h2>}{intro&&<p>{intro}</p>}
  {sections.map((s,i)=><section key={i}>{s.title&&<h3>{s.title}</h3>}{s.body&&<p>{s.body}</p>}{s.items.length>0&&<ul>{s.items.map((item,j)=><li key={j}>{item}</li>)}</ul>}</section>)}
  {outfits.length>0&&<div className="vitty-outfits">{outfits.map((o,i)=><Link key={i} to={composerUrl(o.selection)} className="vitty-outfit"><OutfitScene selection={o.selection}/><div><h3>{o.title}</h3><p>{o.reason}</p><span>{COLORS[o.selection.color].name} · {eventById(o.selection.event)!.shortName}</span><strong>Phối bộ này <ArrowUpRight size={16}/></strong></div></Link>)}</div>}
  {design&&<section className="vitty-design"><h3>{design.title}</h3><p>{design.inspiration}</p><dl>{[['Phom dáng',design.silhouette],['Chất liệu',design.materials],['Điểm nhấn',design.details],['Nét văn hóa',design.culturalNotes]].filter(([,v])=>v).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{design.palette.length>0&&<div className="vitty-palette">{design.palette.map((c,i)=><span key={i}>{c}</span>)}</div>}</section>}
  {articles.length>0&&<div className="vitty-articles">{articles.map((a,i)=><Link key={i} to={'/tu-lieu/'+(a.kind==='garment'?'trang-phuc':'su-kien')+'/'+a.id}><BookOpen size={16}/>{a.kind==='garment'?garmentById(a.id)!.shortName:eventById(a.id)!.shortName}<ArrowUpRight size={14}/></Link>)}</div>}
  {followUp&&<p className="vitty-follow-up">{followUp}</p>}
 </div>;
}
const welcome:VittyAnswer={title:'Chào bạn, mình là Vitty.',intro:'Một dáng áo, một dịp đặc biệt, hay ý tưởng bạn đang ấp ủ — mình cùng khám phá nhé.',sections:[{title:'Bạn muốn bắt đầu từ đâu?',body:'Mình có thể giải thích nét đặc trưng của Việt phục, cùng bạn chọn bộ phối cho một dịp, hoặc phát triển ý tưởng thiết kế từ cảm hứng văn hóa.',items:[]}],outfits:[],articles:[],design:null,followUp:''};
function restoredOutbox():VittyTurn|null{try{const saved=JSON.parse(local.read('outbox')||'null');return saved?.id&&typeof saved.text==='string'?saved:null;}catch{return null;}}
function mergeTurns(before:VittyTurn[],after:VittyTurn[]){const merged=new Map(before.map(t=>[t.id,t]));after.forEach(t=>merged.set(t.id,t));return [...merged.values()].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id));}
export function Vitty({search=''}:{search?:string}){
 const [author]=useState(ownId),[avatar,setAvatar]=useState<VittyAvatar>(()=>local.read('avatar')==='female'?'female':'male');
 const [draft,setDraft]=useState(()=>local.read('draft')||''),[turns,setTurns]=useState<VittyTurn[]>([]),[outbox,setOutbox]=useState<VittyTurn|null>(restoredOutbox);
 const [loading,setLoading]=useState(true),[sending,setSending]=useState(false),[error,setError]=useState(''),[syncError,setSyncError]=useState('');
 const [before,setBefore]=useState<string|null>(null),[loadingOlder,setLoadingOlder]=useState(false),[fan,setFan]=useState(false),[avatarOpen,setAvatarOpen]=useState(false),[newMessages,setNewMessages]=useState(false);
 const [context,setContext]=useState<ComposerSelection|null>(()=>new URLSearchParams(search).has('ao')?selectionFromSearch(search):null);
 const transcript=useRef<HTMLDivElement>(null),input=useRef<HTMLTextAreaElement>(null),suggestions=useRef<HTMLDivElement>(null),avatarPicker=useRef<HTMLDivElement>(null);
 const nearBottom=useRef(true),boot=useRef(true),turnsRef=useRef(turns),outboxRef=useRef(outbox),fanButton=useRef<HTMLButtonElement>(null),avatarButton=useRef<HTMLButtonElement>(null);
 turnsRef.current=turns;outboxRef.current=outbox;
 const scrollBottom=()=>{const el=transcript.current;if(el)el.scrollTop=el.scrollHeight;nearBottom.current=true;setNewMessages(false);};
 useEffect(()=>{if(nearBottom.current)scrollBottom();},[turns,outbox]);
 useEffect(()=>{local.write('draft',draft);if(input.current){input.current.style.height='auto';input.current.style.height=Math.min(input.current.scrollHeight,120)+'px';}},[draft]);
 useEffect(()=>{
  let active=true,timer:ReturnType<typeof setTimeout>;let busy=false;
  async function refresh(){
   if(!active||busy||document.hidden)return;busy=true;
   try{const page=await request<VittyPage>('/api/vitty');if(!active)return;
    const old=turnsRef.current,changed=page.turns.some(t=>!old.some(o=>o.id===t.id&&o.status===t.status&&o.attempt===t.attempt));
    setTurns(previous=>mergeTurns(previous,page.turns));if(boot.current)setBefore(page.before);setSyncError('');
    const pending=outboxRef.current;const received=page.turns.find(t=>t.id===pending?.id);
    if(received&&received.status!=='pending'){local.remove('outbox');setOutbox(null);setError('');}
    if(changed&&!nearBottom.current&&!boot.current)setNewMessages(true);
    if(boot.current||nearBottom.current)requestAnimationFrame(scrollBottom);boot.current=false;
   }catch(e){if(active)setSyncError((e as Error).message==='NETWORK'?'Chưa tải được hội thoại. Kết nối sẽ được thử lại.':errorText[(e as Error).message]||errorText.STORAGE_UNAVAILABLE);}
   finally{busy=false;if(active){setLoading(false);timer=setTimeout(refresh,3500);}}
  }
  const visible=()=>{if(!document.hidden){clearTimeout(timer);void refresh();}};
  void refresh();document.addEventListener('visibilitychange',visible);
  return()=>{active=false;clearTimeout(timer);document.removeEventListener('visibilitychange',visible);};
 },[]);
 useEffect(()=>{
  if(!fan&&!avatarOpen)return;
  const close=(e:PointerEvent)=>{const target=e.target as Node;if(!suggestions.current?.contains(target)&&!fanButton.current?.contains(target))setFan(false);if(!avatarPicker.current?.contains(target)&&!avatarButton.current?.contains(target))setAvatarOpen(false);};
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(fan){setFan(false);fanButton.current?.focus();}if(avatarOpen){setAvatarOpen(false);avatarButton.current?.focus();}}};
  document.addEventListener('pointerdown',close);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',key);};
 },[fan,avatarOpen]);
 async function send(text:string,retry?:VittyTurn){
  if(sending||!text.trim()||text.length>4000)return;
  const turn:VittyTurn=retry||{id:crypto.randomUUID(),authorId:author,avatar,text:text.trim(),createdAt:new Date().toISOString(),status:'pending',leaseUntil:Date.now()+100000,attempt:0,...(context?{context}:{})};
  setSending(true);setError('');setFan(false);setOutbox(turn);local.write('outbox',JSON.stringify(turn));
  if(!retry){setDraft('');local.write('draft','');}
  nearBottom.current=true;requestAnimationFrame(scrollBottom);
  try{const {turn:received}=await request<{turn:VittyTurn}>('/api/vitty/turns',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:turn.id,authorId:turn.authorId,avatar:turn.avatar,text:turn.text,...(turn.context?{context:turn.context}:{})})});
   setTurns(previous=>mergeTurns(previous,[received]));setOutbox(null);local.remove('outbox');setSyncError('');requestAnimationFrame(scrollBottom);
  }catch(e){setError(errorText[(e as Error).message]||errorText.NETWORK);}
  finally{setSending(false);input.current?.focus({preventScroll:true});}
 }
 async function older(){if(!before||loadingOlder)return;setLoadingOlder(true);const el=transcript.current,oldHeight=el?.scrollHeight||0,oldTop=el?.scrollTop||0;
  try{const page=await request<VittyPage>('/api/vitty?before='+before);setTurns(previous=>mergeTurns(page.turns,previous));setBefore(page.before);requestAnimationFrame(()=>{if(el)el.scrollTop=el.scrollHeight-oldHeight+oldTop;});}
  catch(e){setSyncError(errorText[(e as Error).message]||errorText.NETWORK);}finally{setLoadingOlder(false);}
 }
 const displayed=outbox&&!turns.some(t=>t.id===outbox.id)?mergeTurns(turns,[outbox]):turns;
 return <section className="vitty-page" aria-label="Trò chuyện với Vitty">
  <header className="vitty-header"><div className="vitty-identity"><Face who="vitty"/><div><h1>Vitty</h1><p>Tư vấn Việt phục & ý tưởng thiết kế</p></div></div><div className="vitty-header-actions"><span className="vitty-shared">Trò chuyện chung</span><div className="vitty-avatar-control"><button ref={avatarButton} className="vitty-avatar-button" aria-label="Chọn ảnh đại diện" aria-expanded={avatarOpen} aria-controls="vitty-avatars" onClick={()=>{setAvatarOpen(!avatarOpen);setFan(false);}}><Face who={avatar}/><ChevronDown size={15}/></button>{avatarOpen&&<div ref={avatarPicker} id="vitty-avatars" className="vitty-avatar-options"><p>Ảnh đại diện của bạn</p>{(['male','female'] as const).map(a=><button key={a} aria-label={a==='male'?'Chọn gương mặt mẫu nam':'Chọn gương mặt mẫu nữ'} aria-pressed={avatar===a} onClick={()=>{setAvatar(a);local.write('avatar',a);setAvatarOpen(false);avatarButton.current?.focus();}}><Face who={a}/><span>{a==='male'?'Mẫu nam':'Mẫu nữ'}</span>{avatar===a&&<Check size={16}/>}</button>)}</div>}</div></div></header>
  <div className="vitty-transcript" ref={transcript} role="log" aria-label="Hội thoại chung với Vitty" aria-live="off" tabIndex={0} onScroll={()=>{const el=transcript.current;if(el){nearBottom.current=el.scrollHeight-el.scrollTop-el.clientHeight<100;if(nearBottom.current)setNewMessages(false);}}}>
   <div className="vitty-message-list">{before&&<button className="vitty-older" onClick={older} disabled={loadingOlder}>{loadingOlder?'Đang tải…':'Xem tin nhắn trước'}</button>}
    <article className="vitty-message assistant"><Face who="vitty"/><div className="vitty-message-content"><span className="vitty-speaker">Vitty</span><div className="vitty-bubble"><Answer answer={welcome}/></div></div></article>
    {loading&&<p className="vitty-sync" role="status">Đang kết nối hội thoại…</p>}
    {displayed.map(turn=><React.Fragment key={turn.id}><article className="vitty-message user"><Face who={turn.avatar}/><div className="vitty-message-content"><span className="vitty-speaker">{turn.authorId===author?'Bạn':'Khách'}</span><div className="vitty-bubble"><p>{turn.text}</p>{turn.context&&<span className="vitty-turn-context">{garmentById(turn.context.garment)!.shortName} · {eventById(turn.context.event)!.shortName}</span>}</div></div></article>
     <article className="vitty-message assistant"><Face who="vitty"/><div className="vitty-message-content"><span className="vitty-speaker">Vitty</span><div className="vitty-bubble">{turn.status==='complete'&&turn.answer?<Answer answer={validateVittyAnswer(turn.answer)}/>:turn.status==='failed'?<div className="vitty-failure"><p>{errorText[turn.error||'']||errorText.ANSWER_UNAVAILABLE}</p>{turn.authorId===author&&<button onClick={()=>send(turn.text,turn)} disabled={sending}><RotateCw size={15}/>Thử lại</button>}</div>:<div className="vitty-waiting"><span className="vitty-dots" aria-hidden="true"><i/><i/><i/></span><span>{turn.attempt===0?'Đang gửi câu hỏi…':'Vitty đang suy nghĩ…'}</span>{turn.leaseUntil<Date.now()&&turn.authorId===author&&<button disabled={sending} onClick={()=>send(turn.text,turn)}>Thử lại</button>}</div>}</div></div></article>
    </React.Fragment>)}
   </div>
  </div>
  <footer className="vitty-composer-zone"><div className="vitty-composer-inner">
   <div className="vitty-tools">{newMessages&&<button className="vitty-new" onClick={scrollBottom}><ArrowDown size={15}/>Tin nhắn mới</button>}<div className="vitty-fan-control"><button ref={fanButton} className={'vitty-fan-button '+(fan?'open':'')} aria-label="Gợi ý câu hỏi" aria-expanded={fan} aria-controls="vitty-starters" onClick={()=>{setFan(!fan);setAvatarOpen(false);}}><Fan/></button>{fan&&<div ref={suggestions} id="vitty-starters" className="vitty-starters">{VITTY_STARTERS.map(s=><button key={s} disabled={sending} onClick={()=>send(s)}>{s}<ArrowUpRight size={17}/></button>)}</div>}</div></div>
   {context&&<div className="vitty-context"><span>Đang trao đổi: {garmentById(context.garment)!.shortName} · {COLORS[context.color].name} · {eventById(context.event)!.shortName}</span><button aria-label="Bỏ ngữ cảnh bộ phối" onClick={()=>setContext(null)}><X size={16}/></button></div>}
   {(error||syncError)&&<div className="vitty-error" role="alert"><p>{error||syncError}</p>{outbox&&!sending&&<button onClick={()=>send(outbox.text,outbox)}><RotateCw size={15}/>Thử lại</button>}</div>}
   <form className="vitty-composer" onSubmit={e=>{e.preventDefault();void send(draft);}}><label className="sr-only" htmlFor="vitty-question">Câu hỏi cho Vitty</label><textarea ref={input} id="vitty-question" rows={1} placeholder="Bạn muốn tìm hiểu hay phối gì hôm nay?" maxLength={4000} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void send(draft);}}}/><button aria-label={sending?'Đang gửi':'Gửi câu hỏi'} disabled={sending||!draft.trim()} type="submit">{sending?<span className="vitty-send-wait"/>:<ArrowUp size={22}/>}</button></form>
   <span className="sr-only" role="status" aria-live="polite">{sending?'Đang gửi câu hỏi':turns.at(-1)?.status==='complete'?'Vitty đã trả lời':''}</span>
  </div></footer>
 </section>;
}
