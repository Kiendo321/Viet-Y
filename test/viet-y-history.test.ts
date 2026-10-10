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
test('Routes retain browser history; Back and Forward return to the corresponding page',async()=>{
 render(React.createElement(App));
 fireEvent.click(screen.getByRole('link',{name:/^Bắt đầu phối/}));
 assert.equal(window.location.pathname,'/xuong-phoi');
 fireEvent.click(screen.getByRole('link',{name:'Lookbook'}));
 assert.equal(window.location.pathname,'/lookbook');
 window.history.back();
 await waitFor(()=>assert.ok(screen.getByRole('heading',{level:1,name:'Xưởng phối'})));
 window.history.back();
 await waitFor(()=>assert.ok(screen.getByRole('heading',{level:1,name:'Việt Y'})));
 window.history.forward();
 await waitFor(()=>assert.ok(screen.getByRole('heading',{level:1,name:'Xưởng phối'})));
});
