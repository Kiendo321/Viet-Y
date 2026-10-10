import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost:3000',
});

// Configure DOM globals before React Testing Library loads
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  HTMLInputElement: dom.window.HTMLInputElement,
  HTMLButtonElement: dom.window.HTMLButtonElement,
  Node: dom.window.Node,
  localStorage: dom.window.localStorage,
  requestAnimationFrame: (callback:FrameRequestCallback)=>setTimeout(()=>callback(Date.now()),0),
  ResizeObserver: class { observe(){} unobserve(){} disconnect(){} },
});

Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
  writable: true,
});
