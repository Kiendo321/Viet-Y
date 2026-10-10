import React,{useLayoutEffect,useRef,useState} from 'react';
import {ScanSearch,X} from 'lucide-react';
import {ComposerSelection} from '../data/vietYCatalog';
import {detailsFor} from '../data/garmentDetails';
import {OutfitScene} from './OutfitScene';

export function OutfitPreview({selection,onReady}:{selection:ComposerSelection;onReady:(ready:boolean)=>void}){
 const [open,setOpen]=useState(false),[wires,setWires]=useState<{width:number;height:number;paths:string[]}>({width:0,height:0,paths:[]});
 const root=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),rail=useRef<HTMLElement>(null),trigger=useRef<HTMLButtonElement>(null),closeButton=useRef<HTMLButtonElement>(null);
 const details=detailsFor(selection);
 const close=()=>{setOpen(false);requestAnimationFrame(()=>trigger.current?.focus({preventScroll:true}));};
 useLayoutEffect(()=>{if(open)closeButton.current?.focus({preventScroll:true});},[open]);
 useLayoutEffect(()=>{
  if(!open)return;
  const draw=()=>{
   const outer=root.current?.getBoundingClientRect(),scene=stage.current?.querySelector('svg')?.getBoundingClientRect(),panel=rail.current?.getBoundingClientRect();
   if(!outer||!scene||!panel||!scene.width||!scene.height)return;
   const scale=Math.min(scene.width/1086,scene.height/1448);
   const ox=scene.left-outer.left+(scene.width-1086*scale)/2,oy=scene.top-outer.top+(scene.height-1448*scale)/2;
   const paths=details.flatMap((detail,i)=>{
    const row=rail.current?.querySelectorAll('.detail-row')[i],thumb=row?.querySelector('.detail-zoom')?.getBoundingClientRect();
    if(!thumb||thumb.top<panel.top||thumb.bottom>panel.bottom)return [];
    const [px,py]=detail.point;const x=ox+px*scale,y=oy+py*scale,tx=thumb.left-outer.left-9,ty=thumb.top-outer.top+thumb.height/2;
    return [`M ${x} ${y} L ${tx} ${ty}`];
   });setWires({width:outer.width,height:outer.height,paths});
  };
  draw();const observer=new ResizeObserver(draw);if(root.current)observer.observe(root.current);if(stage.current)observer.observe(stage.current);if(rail.current){observer.observe(rail.current);rail.current.addEventListener('scroll',draw,{passive:true});}
  window.addEventListener('resize',draw);return()=>{observer.disconnect();rail.current?.removeEventListener('scroll',draw);window.removeEventListener('resize',draw);};
 },[open,selection.garment,selection.person,selection.color]);
 return <div className={'workshop-preview-body'+(open?' details-open':'')} ref={root} onKeyDown={e=>{if(e.key==='Escape'&&open){e.preventDefault();close();}}}>
  <div className="outfit-stage" ref={stage}><OutfitScene selection={selection} onReady={onReady}/>
   <button ref={trigger} hidden={open} className="detail-trigger" aria-expanded={open} aria-controls="outfit-details" onClick={()=>setOpen(true)}><ScanSearch size={17}/>Chi tiết</button>
  </div>
  {open&&<aside id="outfit-details" className="outfit-details" ref={rail} aria-label="Chi tiết trang phục"><header><h2>Chi tiết</h2><button ref={closeButton} className="text-button" onClick={close}><X size={16}/>Đóng</button></header>
   <div className="detail-rows">{details.map(d=><section className="detail-row" key={d.title}><div className="detail-zoom"><OutfitScene selection={selection} crop={d.crop} plain label={'Cận cảnh '+d.title}/></div><div><h3>{d.title}</h3><p>{d.body}</p></div></section>)}</div>
  </aside>}
  {open&&wires.width>0&&<svg className="detail-wires" viewBox={`0 0 ${wires.width} ${wires.height}`} aria-hidden="true">{wires.paths.map(d=><g key={d}><path d={d}/><circle cx={d.split(' ')[1]} cy={d.split(' ')[2]} r="3"/><circle cx={d.split(' ')[4]} cy={d.split(' ')[5]} r="3"/></g>)}</svg>}
 </div>;
}
