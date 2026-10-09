import React,{useEffect,useState} from 'react';
export function navigate(to:string,replace=false) {
 if(!to.startsWith('/')||to.startsWith('//')) return;
 const current=window.location.pathname+window.location.search+window.location.hash;
 if(current===to) return;
 window.history[replace?'replaceState':'pushState']({},'',to);
 window.dispatchEvent(new window.PopStateEvent('popstate'));
}
export function useRoute(){
 const read=()=>({path:window.location.pathname.replace(/\/$/,'')||'/',search:window.location.search});
 const [route,setRoute]=useState(read);
 useEffect(()=>{const update=()=>setRoute(read());window.addEventListener('popstate',update);return()=>window.removeEventListener('popstate',update);},[]);
 return route;
}
export function Link({to,children,onNavigate,...props}:Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>,'href'> & {to:string;onNavigate?:()=>void}){
 return <a {...props} href={to} onClick={event=>{
 props.onClick?.(event);
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||props.target==='_blank') return;
 event.preventDefault();navigate(to);onNavigate?.();
 }}>{children}</a>;
}

