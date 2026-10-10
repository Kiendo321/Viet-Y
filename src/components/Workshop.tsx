import React from 'react';
import {Check,ChevronDown,RotateCcw} from 'lucide-react';
import {GARMENTS,OCCASIONS,COLORS,ACCESSORIES,ComposerSelection,GarmentId,EventId,Person,ColorId,AccessoryId,normalizeSelection,accessoriesFor,garmentById,eventById} from '../data/vietYCatalog';
import {OutfitPreview} from './OutfitDetails';
function Picker({label,value,children}:{label:string;value:string;children:React.ReactNode}){
 const details=React.useRef<HTMLDetailsElement>(null);
 const close=()=>{if(!details.current)return;details.current.open=false;details.current.querySelector<HTMLElement>('summary')?.focus({preventScroll:true});};
 return <details ref={details} className="choice-picker" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))e.currentTarget.open=false;}} onKeyDown={e=>{if(e.key==='Escape'&&e.currentTarget.open){e.preventDefault();e.stopPropagation();close();}}}>
  <summary><span>{label}</span><strong>{value}</strong><ChevronDown size={18}/></summary>
  <div className="picker-options" onClick={e=>{if((e.target as HTMLElement).closest('button'))close();}}>{children}</div>
 </details>;
}
export function Workshop({selection,onChange}:{selection:ComposerSelection;onChange:(s:ComposerSelection)=>void}){
 const garment=garmentById(selection.garment)!;const occasion=eventById(selection.event)!;
 const [feedback,setFeedback]=React.useState(''),[ready,setReady]=React.useState(false);
 const update=(patch:Partial<ComposerSelection>)=>{const next=normalizeSelection({...selection,...patch});onChange(next);setFeedback(patch.garment&&next.person!==selection.person?'Đã chuyển sang mẫu nữ': 'Đã cập nhật bộ phối');};
 const colors=Object.keys(garment.variants[selection.person]!) as ColorId[];
 return <section className="workshop" aria-label="Xưởng phối">
  <div className="workshop-title"><h1>Xưởng phối</h1><button className="text-button" onClick={()=>{onChange(normalizeSelection({garment:'ngu-than',person:'male',event:'le-hoi',color:'indigo',accessory:'none'}));setFeedback('Đã đặt lại bộ phối');}}><RotateCcw size={16}/>Đặt lại</button></div>
  <div className="workshop-grid">
   <div className="workshop-controls">
    <div className="choice-group"><h2>Đi đâu hôm nay?</h2>
     <Picker label="Sự kiện" value={occasion.name}>{OCCASIONS.map(e=><button key={e.id} className={'picker-row '+(e.id===selection.event?'selected':'')} aria-pressed={e.id===selection.event} onClick={()=>update({event:e.id})}><img src={e.image} alt="" loading="lazy"/><span>{e.name}</span>{e.id===selection.event&&<Check size={17}/>}</button>)}</Picker>
    </div>
    <div className="choice-group"><h2>Chọn dáng áo</h2>
     <div className="segmented" aria-label="Mẫu người">{(['male','female'] as Person[]).map(p=><button key={p} disabled={!garment.variants[p]} aria-pressed={selection.person===p} onClick={()=>update({person:p})}>{p==='male'?'Nam':'Nữ'}</button>)}</div>
     <Picker label="Trang phục" value={garment.name}>{GARMENTS.map(g=><button key={g.id} className={'picker-row '+(g.id===selection.garment?'selected':'')} aria-pressed={g.id===selection.garment} onClick={()=>update({garment:g.id})}><img className="garment-picker-image" src={g.cover} alt="" loading="lazy"/><span>{g.name}<small>{g.subtitle}</small></span>{g.id===selection.garment&&<Check size={17}/>}</button>)}</Picker>
    </div>
    <div className="choice-group"><div className="group-heading"><h2>Màu áo</h2><span>{COLORS[selection.color].name}</span></div>
     <div className="color-options" aria-label="Màu áo">{colors.map(color=><button key={color} className={'color-choice '+(color===selection.color?'selected':'')} aria-label={COLORS[color].name} aria-pressed={color===selection.color} onClick={()=>update({color})}><span style={{backgroundColor:COLORS[color].hex}}>{color===selection.color&&<Check size={17} color={color==='ivory'?'#2E2828':'white'}/>}</span><small>{COLORS[color].name}</small></button>)}</div>
    </div>
    <div className="choice-group"><h2>Thêm điểm nhấn</h2>
     <div className="accessory-options" aria-label="Phụ kiện">{accessoriesFor(selection.garment,selection.person).map(id=><button key={id} className={'accessory-choice '+(id===selection.accessory?'selected':'')} aria-pressed={id===selection.accessory} onClick={()=>update({accessory:id})}>
      <div>{id==='turban'?<svg viewBox="410 20 200 140" aria-hidden="true"><image href={ACCESSORIES[id].image} width="1024" height="1536"/></svg>:ACCESSORIES[id].image?<img src={ACCESSORIES[id].image} alt="" loading="lazy"/>:<span className="no-accessory-line"/>}</div><span>{ACCESSORIES[id].name}</span>{id===selection.accessory&&<Check className="accessory-check" size={14}/>}</button>)}</div>
    </div>
    <p className="selection-feedback" role="status" aria-live="polite">{feedback}</p>
   </div>
   <div className="workshop-preview"><OutfitPreview selection={selection} onReady={setReady}/><div className="preview-caption"><div><h2>{garment.shortName} · {COLORS[selection.color].name}</h2><p>{occasion.name}</p></div><span className={'preview-state '+(ready?'ready':'')}><span/>{ready?'Đang xem':'Đang tải'}</span></div></div>
  </div>
 </section>;
}

