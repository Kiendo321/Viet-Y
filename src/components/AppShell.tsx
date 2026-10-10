import React,{useEffect,useRef} from 'react';
import {House,Scissors,Images,BookOpen,MessagesSquare,PanelLeftClose,PanelLeftOpen,Menu,X} from 'lucide-react';
import {Link} from '../services/navigation';
const items=[{to:'/',label:'Trang chủ',Icon:House},{to:'/xuong-phoi',label:'Xưởng phối',Icon:Scissors},{to:'/lookbook',label:'Lookbook',Icon:Images},{to:'/tu-lieu',label:'Tư liệu',Icon:BookOpen},{to:'/vitty',label:'Vitty',Icon:MessagesSquare}];
export function Brand({compact=false}:{compact?:boolean}){
 return <span className="brand"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 29 16 16 29 3 16Z M16 8 24 16 16 24 8 16Z M3 16H29 M16 3V29" fill="none" stroke="currentColor" strokeWidth="1.25"/></svg>{!compact&&<span>Việt Y</span>}</span>;
}
export function AppShell({path,children,workbench,conversation=false}:{path:string;children:React.ReactNode;workbench:boolean;conversation?:boolean}){
 const [collapsed,setCollapsed]=React.useState(false);
 const [mobileOpen,setMobileOpen]=React.useState(false);
 const [isMobile,setMobile]=React.useState(()=>window.innerWidth<760);
 const menu=useRef<HTMLButtonElement>(null),panel=useRef<HTMLElement>(null);
 useEffect(()=>{const update=()=>{const mobile=window.innerWidth<760;setMobile(mobile);if(!mobile)setMobileOpen(false);};window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update);},[]);
 useEffect(()=>{setMobileOpen(false);},[path]);
 useEffect(()=>{
  if(!mobileOpen||!isMobile)return;
  const previous=document.activeElement as HTMLElement;const old=document.body.style.overflow;document.body.style.overflow='hidden';
  panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();setMobileOpen(false);}
   if(e.key==='Tab'){
    const nodes=Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')||[])
     .filter(node=>node.getClientRects().length>0&&!node.closest('[inert]'));
    const first=nodes[0],last=nodes[nodes.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
   }
  };
  window.addEventListener('keydown',key);
  return()=>{window.removeEventListener('keydown',key);document.body.style.overflow=old;(previous||menu.current)?.focus();};
 },[mobileOpen,isMobile]);
 return <div className={'app-shell '+(collapsed?'nav-collapsed ':'')+(workbench?'is-workbench ':'')+(conversation?'is-conversation':'')}>
  <a className="skip-link" href="#main-content">Đến nội dung</a>
  <div className="mobile-bar" inert={isMobile&&mobileOpen} aria-hidden={isMobile&&mobileOpen?true:undefined}><Link to="/" aria-label="Việt Y · Trang chủ"><Brand/></Link><button ref={menu} className="icon-button" aria-label="Mở điều hướng" aria-expanded={mobileOpen} onClick={()=>setMobileOpen(true)}><Menu size={22}/></button></div>
  {mobileOpen&&<button className="nav-backdrop" tabIndex={-1} aria-hidden="true" onClick={()=>setMobileOpen(false)}/>}
  <aside ref={panel} className={'sidebar '+(mobileOpen?'mobile-open':'')} inert={isMobile&&!mobileOpen} aria-hidden={isMobile&&!mobileOpen?true:undefined} role={isMobile&&mobileOpen?'dialog':undefined} aria-modal={isMobile&&mobileOpen?true:undefined} aria-label="Điều hướng Việt Y">
   <div className="sidebar-brand"><Link to="/" aria-label="Việt Y · Trang chủ" onNavigate={()=>setMobileOpen(false)}><Brand compact={collapsed&&!isMobile}/></Link><button className="icon-button mobile-close" aria-label="Đóng điều hướng" onClick={()=>setMobileOpen(false)}><X size={20}/></button></div>
   <nav aria-label="Các trang">{items.map(({to,label,Icon})=>{
    const active=to==='/'?path==='/':path.startsWith(to);
    return <Link key={to} to={to} className={'nav-item '+(active?'active':'')} aria-current={active?'page':undefined} title={collapsed?label:undefined} onNavigate={()=>setMobileOpen(false)}><Icon size={20}/><span>{label}</span></Link>;
   })}</nav>
   <div className="sidebar-bottom"><p>Một nét Việt.<br/>Một cách riêng.</p><button className="nav-toggle" onClick={()=>setCollapsed(!collapsed)} aria-label={collapsed?'Mở rộng điều hướng':'Thu gọn điều hướng'} aria-expanded={!collapsed}>{collapsed?<PanelLeftOpen size={19}/>:<PanelLeftClose size={19}/>}<span>Thu gọn</span></button></div>
  </aside>
  <main id="main-content" className="main-content" tabIndex={-1} inert={isMobile&&mobileOpen} aria-hidden={isMobile&&mobileOpen?true:undefined}>{children}</main>
 </div>;
}
