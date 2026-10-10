import React,{useEffect,useRef,useState} from 'react';
import {AppShell} from './components/AppShell';
import {Workshop} from './components/Workshop';
import {Home} from './components/Home';
import {Lookbook,LookDetail} from './components/Lookbook';
import {Library,GarmentArticle,EventArticle,NotFound} from './components/Library';
import {useRoute} from './services/navigation';
import {Vitty} from './components/Vitty';
import {ComposerSelection,DEFAULT_SELECTION,selectionFromSearch,composerUrl} from './data/vietYCatalog';
export default function App(){
 const route=useRoute();
 const [selection,setSelection]=useState<ComposerSelection>(()=>route.path==='/xuong-phoi'?selectionFromSearch(route.search):DEFAULT_SELECTION);
 const previous=useRef(route.path);
 useEffect(()=>{
  if(route.path==='/xuong-phoi'&&route.search)setSelection(selectionFromSearch(route.search));
  if(previous.current!==route.path){
   previous.current=route.path;
   document.querySelector<HTMLElement>('#main-content')?.focus({preventScroll:true});
   if(typeof window.scrollTo==='function')window.scrollTo({top:0,behavior:'instant' as ScrollBehavior});
  }
  document.title=route.path==='/'?'Việt Y — Nếp xưa. Cách mặc hôm nay.':'Việt Y · '+(route.path.startsWith('/xuong-phoi')?'Xưởng phối':route.path.startsWith('/lookbook')?'Lookbook':route.path.startsWith('/tu-lieu')?'Tư liệu':route.path==='/vitty'?'Vitty':'Trang');
 },[route.path,route.search]);
 const change=(s:ComposerSelection)=>{setSelection(s);window.history.replaceState({},'',composerUrl(s));};
 let page:React.ReactNode;
 if(route.path==='/')page=<Home/>;
 else if(route.path==='/xuong-phoi')page=<Workshop selection={selection} onChange={change}/>;
 else if(route.path==='/lookbook')page=<Lookbook/>;
 else if(route.path==='/vitty')page=<Vitty search={route.search}/>;
 else if(route.path.startsWith('/lookbook/'))page=<LookDetail id={route.path.slice('/lookbook/'.length)}/>;
 else if(route.path==='/tu-lieu')page=<Library/>;
 else if(route.path.startsWith('/tu-lieu/trang-phuc/'))page=<GarmentArticle id={route.path.slice('/tu-lieu/trang-phuc/'.length)}/>;
 else if(route.path.startsWith('/tu-lieu/su-kien/'))page=<EventArticle id={route.path.slice('/tu-lieu/su-kien/'.length)}/>;
 else page=<NotFound/>;
 return <AppShell path={route.path} workbench={route.path==='/xuong-phoi'} conversation={route.path==='/vitty'}>{page}</AppShell>;
}
