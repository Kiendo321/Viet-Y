// Studio serves frontend modules; the stable preview tag supplies the same backend.
export const API_BASE=import.meta.env?.VITE_VITTY_API_BASE||(typeof window!=='undefined'&&window.location.hostname.startsWith('ais-dev-')&&window.location.hostname.endsWith('.run.app')?'https://ux-preview---viet-y-ivo7erh2oq-as.a.run.app':'');
export const apiUrl=(path:string)=>path.startsWith('/api/')?API_BASE+path:path;
export function browserAuthor(){try{const saved=localStorage.getItem('vitty:author');if(saved)return saved;const id=crypto.randomUUID();localStorage.setItem('vitty:author',id);return id;}catch{return crypto.randomUUID();}}
export async function apiRequest<T>(path:string,options?:RequestInit,timeoutMs=15000):Promise<T>{
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{const response=await fetch(apiUrl(path),{...options,signal:controller.signal});const body=await response.json();if(!response.ok)throw new Error(body.error||'NETWORK');return body;}
 catch(e){if(e instanceof Error&&e.name!=='AbortError'&&e.message!=='Failed to fetch')throw e;throw new Error('NETWORK');}finally{clearTimeout(timer);}
}
export const jsonPost=(body:unknown):RequestInit=>({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
