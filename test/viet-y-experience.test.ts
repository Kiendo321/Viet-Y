import {test,beforeEach,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import React,{act} from 'react';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import App from '../src/App';
import {navigate} from '../src/services/navigation';
import {GARMENTS,OCCASIONS,LOOKS,normalizeSelection,composerUrl,accessoriesFor} from '../src/data/vietYCatalog';
import {genaiSettings} from '../src/services/genaiConfig';
const originalFetch=globalThis.fetch,originalImage=window.Image;
beforeEach(()=>{
 window.history.replaceState({},'','/');
 window.scrollTo=()=>{};
 globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({text:LOOKS[0].intro,source:'gemini'})}) as Response;
 window.Image=class{onload:(()=>void)|null=null;set src(_:string){queueMicrotask(()=>this.onload?.());}} as any;
});
afterEach(()=>{cleanup();globalThis.fetch=originalFetch;window.Image=originalImage;});
function openWorkshop(){render(React.createElement(App));fireEvent.click(screen.getByRole('link',{name:/^Bắt đầu phối/}));}
test('Workshop uses prepared assets, updates event and color, and contains no generation/save controls',async()=>{
 const calls:string[]=[];globalThis.fetch=async(input)=>{calls.push(String(input));return {ok:true,json:async()=>({})} as Response;};
 openWorkshop();
 fireEvent.click(screen.getByRole('button',{name:'Đỏ son'}));
 assert.ok(document.querySelector('image[data-layer="robe"][href$="coat-red.webp"]'));
 fireEvent.click(screen.getByRole('button',{name:'Lễ ăn hỏi'}));
 assert.ok(document.querySelector('image[data-layer="background"][href$="engagement.webp"]'));
 assert.ok(window.location.search.includes('an-hoi'));
 assert.ok(!screen.queryByRole('button',{name:/Lưu|Gemini|Tạo minh họa/}));
 await waitFor(()=>assert.equal(document.querySelector('.outfit-scene')?.getAttribute('aria-busy'),'false'));
 assert.deepEqual(calls,[]);
});
test('Changing garment normalizes unavailable male variant, color and accessories; feminine assets swap',()=>{
 openWorkshop();
 fireEvent.click(screen.getByRole('button',{name:/Áo Nhật Bình/}));
 assert.equal(screen.getByRole('button',{name:'Nữ'}).getAttribute('aria-pressed'),'true');
 assert.equal(screen.getByRole('button',{name:'Nam'}).hasAttribute('disabled'),true);
 assert.ok(document.querySelector('image[data-layer="figure"][href$="nhatbinh-female-red.webp"]'));
 fireEvent.click(screen.getByRole('button',{name:'Trắng ngà'}));
 assert.ok(document.querySelector('image[data-layer="figure"][href$="nhatbinh-female-ivory.webp"]'));
 fireEvent.click(screen.getByRole('button',{name:'Kiềng bạc'}));
 assert.ok(document.querySelector('image[data-layer="accessory"][href$="silver-collar.webp"]'));
});
test('A direct workshop link restores its configured garment, event, person, color and accessory',()=>{
 window.history.replaceState({},'',composerUrl({garment:'giao-linh',person:'female',event:'van-nghe',color:'gold',accessory:'pearl-necklace'}));
 render(React.createElement(App));
 assert.ok(document.querySelector('image[data-layer="figure"][href$="giaolinh-female-gold.webp"]'));
 assert.ok(document.querySelector('image[data-layer="background"][href$="performance.webp"]'));
 assert.equal(screen.getByRole('button',{name:'Chuỗi ngọc'}).getAttribute('aria-pressed'),'true');
});
test('Landing links have distinct relevant destinations and do not all funnel into the workshop',()=>{
 render(React.createElement(App));
 const paths=new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')));
 assert.ok(paths.has('/lookbook/ngay-hen'));
 assert.ok(paths.has('/tu-lieu/su-kien/le-hoi'));
 assert.ok(paths.has('/tu-lieu'));assert.ok(paths.has('/lookbook'));
});
test('Lookbook tile opens an image detail, receives a context story and offers the actual image download',async()=>{
 window.history.replaceState({},'','/lookbook');render(React.createElement(App));
 fireEvent.click(screen.getByRole('link',{name:/Một ngày hẹn ước/}));
 assert.equal(window.location.pathname,'/lookbook/ngay-hen');
 assert.ok(screen.getByRole('img',{name:'Một ngày hẹn ước'}));
 assert.equal(screen.getByRole('link',{name:'Tải ảnh'}).getAttribute('href'),'/api/lookbook/ngay-hen/download');
 await waitFor(()=>assert.ok(!screen.queryByText('Đang viết câu chuyện')));
 assert.ok(!screen.queryByRole('heading',{name:'Xưởng phối'}));
});
test('A delayed story from a previous image never replaces the currently viewed look',async()=>{
 let complete:(r:Response)=>void=()=>{};
 globalThis.fetch=async(input)=>String(input).includes('ngay-hen')?new Promise(resolve=>{complete=resolve;}):({ok:true,json:async()=>({text:LOOKS[3].intro,source:'gemini'})} as Response);
 window.history.replaceState({},'','/lookbook/ngay-hen');render(React.createElement(App));
 act(()=>navigate('/lookbook/mien-ky-uc'));
 await waitFor(()=>assert.ok(screen.getByRole('heading',{name:'Đi qua miền ký ức'})));
 complete({ok:true,json:async()=>({text:'OLD STORY',source:'gemini'})} as Response);
 await waitFor(()=>assert.ok(screen.getByText(LOOKS[3].intro)));
 assert.ok(!screen.queryByText('OLD STORY'));
});
test('Story failure keeps useful editorial context and gives an explicit retry',async()=>{
 globalThis.fetch=async()=>{throw Error('offline');};
 window.history.replaceState({},'','/lookbook/sac-hoi');render(React.createElement(App));
 assert.ok(await screen.findByRole('button',{name:'Làm mới lời giới thiệu'}));
 assert.ok(screen.getByText(LOOKS[0].intro));
});
test('Library routes expose all required garments and events, with a separate detail article',()=>{
 window.history.replaceState({},'','/tu-lieu');render(React.createElement(App));
 assert.equal(document.querySelectorAll('.garment-record').length,5);
 assert.equal(document.querySelectorAll('.event-record').length,4);
 fireEvent.click(screen.getByRole('link',{name:/Áo Nhật Bình/}));
 assert.ok(screen.getByRole('heading',{level:1,name:'Áo Nhật Bình'}));
 assert.ok(screen.getByRole('heading',{name:'Thời kỳ gắn liền'}));
 assert.ok(screen.getByRole('link',{name:/Phối với dáng áo này/}).getAttribute('href')?.includes('ao=nhat-binh'));
});
test('Unknown detail URL shows recovery instead of a wrong garment or silent redirect',()=>{
 window.history.replaceState({},'','/lookbook/unknown');render(React.createElement(App));
 assert.ok(screen.getByRole('heading',{name:'Trang chưa có ở đây.'}));
 assert.ok(screen.getByRole('link',{name:/Về trang chủ/}));
});
test('Sidebar collapse has explicit state and does not alter the active route',()=>{
 render(React.createElement(App));fireEvent.click(screen.getByRole('button',{name:'Thu gọn điều hướng'}));
 assert.ok(document.querySelector('.app-shell.nav-collapsed'));
 assert.equal(window.location.pathname,'/');
 assert.equal(screen.getByRole('button',{name:'Mở rộng điều hướng'}).getAttribute('aria-expanded'),'false');
});
test('Catalog has five distinct garments, four scenes and compatible options for every supported model',()=>{
 assert.equal(GARMENTS.length,5);assert.equal(OCCASIONS.length,4);
 for(const g of GARMENTS)for(const person of ['male','female'] as const){
  if(!g.variants[person])continue;
  const s=normalizeSelection({garment:g.id,person,color:'black',accessory:'turban'});
  assert.ok(g.variants[person]?.[s.color]);
  assert.ok(accessoriesFor(g.id,person).includes(s.accessory));
  assert.equal(accessoriesFor(g.id,person).length,3);
 }
 const unknown=normalizeSelection({garment:'bad' as any,person:'bad' as any,color:'bad' as any});
 assert.equal(unknown.garment,'ngu-than');
});
test('Vertex mode excludes browser keys and requires a project',()=>{
 assert.equal(genaiSettings({GOOGLE_GENAI_USE_VERTEXAI:'true',GOOGLE_CLOUD_PROJECT:'c3-app-162',GEMINI_API_KEY:'do-not-use'}).provider,'vertex_ai');
 assert.equal(genaiSettings({GOOGLE_GENAI_USE_VERTEXAI:'true'}).configured,false);
});
