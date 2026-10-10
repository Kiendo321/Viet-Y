import {test,beforeEach,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import App from '../src/App';
import {VittyTurn,validateVittyAnswer} from '../src/services/vittyContract';
const originalFetch=globalThis.fetch;let saved:VittyTurn[]=[];let calls=0;
beforeEach(()=>{
 Object.defineProperty(document,'hidden',{value:false,configurable:true});
 localStorage.clear();saved=[];calls=0;window.history.replaceState({},'','/');window.scrollTo=()=>{};
 globalThis.fetch=async(url,options)=>{
  if(options?.method==='POST'){calls++;const input=JSON.parse(String(options.body));saved=[{...input,status:'complete',createdAt:new Date().toISOString(),leaseUntil:0,attempt:1,answer:validateVittyAnswer({title:'Bạn định đi dịp nào?',intro:'Cho mình biết dịp và phong cách bạn thích nhé.',sections:[],outfits:[],articles:[]})}];return {ok:true,json:async()=>({turn:saved[0]})} as Response;}
  return {ok:true,json:async()=>({turns:saved,before:null,shared:true,storage:'filesystem'})} as Response;
 };
});
afterEach(()=>{cleanup();globalThis.fetch=originalFetch;});
test('Vitty route, starters, formatted answer, avatar choice and browser Back work together',async()=>{
 render(React.createElement(App));fireEvent.click(screen.getByRole('link',{name:'Vitty'}));
 await waitFor(()=>assert.equal(window.location.pathname,'/vitty'));
 fireEvent.click(screen.getByRole('button',{name:'Chọn ảnh đại diện'}));fireEvent.click(screen.getByRole('button',{name:'Chọn gương mặt mẫu nữ'}));
 fireEvent.click(screen.getByRole('button',{name:'Gợi ý câu hỏi'}));assert.equal(screen.getByRole('button',{name:'Tôi muốn thử đồ.'}).textContent,'Tôi muốn thử đồ.');
 fireEvent.click(screen.getByRole('button',{name:'Tôi nên mặc gì?'}));await waitFor(()=>assert.ok(screen.getByRole('heading',{name:'Bạn định đi dịp nào?'})));
 assert.equal(calls,1);assert.equal(saved[0].avatar,'female');assert.ok(screen.getByText('Tôi nên mặc gì?'));
 window.history.back();await waitFor(()=>assert.ok(screen.getByRole('heading',{level:1,name:/Mặc nét Việt/})));
 window.history.forward();await waitFor(()=>assert.ok(screen.getByRole('heading',{name:'Bạn định đi dịp nào?'})));assert.equal(calls,1);
});
test('Draft persists; Shift+Enter and IME Enter do not submit; Escape closes starters',async()=>{
 window.history.replaceState({},'','/vitty');const mounted=render(React.createElement(App));
 const field=screen.getByRole('textbox',{name:'Câu hỏi cho Vitty'});fireEvent.change(field,{target:{value:'Áo tấc khác gì ngũ thân?'}});
 fireEvent.keyDown(field,{key:'Enter',shiftKey:true});fireEvent.keyDown(field,{key:'Enter',isComposing:true});assert.equal(calls,0);
 fireEvent.click(screen.getByRole('button',{name:'Gợi ý câu hỏi'}));fireEvent.keyDown(document,{key:'Escape'});assert.equal(screen.queryByRole('button',{name:'Tôi nên mặc gì?'}),null);
 mounted.unmount();render(React.createElement(App));assert.equal((screen.getByRole('textbox',{name:'Câu hỏi cho Vitty'}) as HTMLTextAreaElement).value,'Áo tấc khác gì ngũ thân?');
});
