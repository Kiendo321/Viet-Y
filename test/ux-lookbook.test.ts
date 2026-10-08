import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';
import App from '../src/App';
import { selectionKey, readSavedOutfits, OUTFIT_STORAGE_KEY } from '../src/services/outfitStorage';
import { genaiSettings } from '../src/services/genaiConfig';

const nativeFetch = globalThis.fetch;
const nativeImage = window.Image;
const nativeSetItem = window.Storage.prototype.setItem;
beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({status:'ok'}) }) as Response;
  window.Image = class {
    onload: (() => void) | null = null;
    set src(_: string) { queueMicrotask(() => this.onload?.()); }
  } as any;
});
afterEach(() => { cleanup(); globalThis.fetch = nativeFetch; window.Image = nativeImage; window.Storage.prototype.setItem = nativeSetItem; });
function enter() { render(React.createElement(App)); fireEvent.click(screen.getByRole('button', { name: /^Phối ngay$/ })); }
function finish() { fireEvent.click(screen.getByRole('button', { name: 'Hoàn tất & xem lookbook' })); }

test('Saved edits update one entry and reopen the new color', async () => {
  enter(); fireEvent.click(screen.getByRole('button', { name: 'Lưu bản phối' }));
  const old = JSON.parse(localStorage.getItem(OUTFIT_STORAGE_KEY)!);
  assert.equal(old.length, 1);
  fireEvent.click(screen.getByRole('button', { name: /Đỏ son trầm/ }));
  assert.equal(JSON.parse(localStorage.getItem(OUTFIT_STORAGE_KEY)!)[0].selection.colorId, old[0].selection.colorId);
  finish(); assert.ok(screen.getByText('Chưa lưu thay đổi.'));
  fireEvent.click(screen.getByRole('button', { name: 'Cập nhật bản đã lưu' }));
  const updated = JSON.parse(localStorage.getItem(OUTFIT_STORAGE_KEY)!);
  assert.equal(updated.length, 1); assert.equal(updated[0].id, old[0].id);
  assert.equal(updated[0].selection.colorId, 'color-do-son-tram');
  fireEvent.click(screen.getByRole('button', { name: /Đã lưu \(1\)/ }));
  const dialog = await screen.findByRole('dialog', { name: /Bộ phối đã lưu/ });
  assert.ok(dialog.querySelector('image[data-part="robe"][href$="coat-red.webp"]'));
  fireEvent.click(within(dialog).getByRole('button', { name: 'Áp dụng lại' }));
  assert.ok(screen.getByRole('button', { name: 'Đã lưu bộ phối' }).hasAttribute('disabled'));
});

test('Failed storage write does not report success or add an entry', () => {
  enter(); window.Storage.prototype.setItem = () => { throw new Error('quota'); };
  fireEvent.click(screen.getByRole('button', { name: 'Lưu bản phối' }));
  assert.ok(screen.getByRole('alert').textContent?.includes('Chưa lưu được'));
  assert.equal(localStorage.getItem(OUTFIT_STORAGE_KEY), null);
  assert.equal(screen.queryByText(/Đã lưu cấu hình bản phối vào bộ sưu tập/), null);
  assert.ok(screen.getByRole('button', { name: /Đã lưu \(0\)/ }));
});

test('Save as new preserves both configurations', () => {
  enter(); fireEvent.click(screen.getByRole('button', { name: 'Lưu bản phối' }));
  fireEvent.click(screen.getByRole('button', { name: /^Mực chàm/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Lưu thành bộ phối mới' }));
  const entries = JSON.parse(localStorage.getItem(OUTFIT_STORAGE_KEY)!);
  assert.equal(entries.length, 2); assert.notEqual(entries[0].id, entries[1].id);
  assert.notEqual(entries[0].selection.colorId, entries[1].selection.colorId);
});

test('Drawer traps focus, closes with Escape and restores focus', async () => {
  enter(); const trigger = screen.getByRole('button', { name: /Đã lưu \(0\)/ }); trigger.focus(); fireEvent.click(trigger);
  const dialog = await screen.findByRole('dialog');
  const close = within(dialog).getByRole('button', { name: /^Đóng$/ });
  assert.equal(document.activeElement, close);
  fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
  assert.equal(document.activeElement, within(dialog).getByRole('button', { name: 'Đóng bảng' }));
  fireEvent.keyDown(window, { key: 'Tab' }); assert.equal(document.activeElement, close);
  fireEvent.keyDown(window, { key: 'Escape' });
  assert.equal(screen.queryByRole('dialog'), null); assert.equal(document.activeElement, trigger);
  assert.equal(document.body.style.overflow, '');
});

test('Style presets change actual color and accessory assets', () => {
  enter(); fireEvent.click(screen.getByRole('button', { name: /Remix đương đại \(Đề xuất/ }));
  const figure = document.querySelector('[data-photo-view="full"]')!;
  assert.ok(figure.querySelector('image[href$="coat-indigo.webp"]'));
  assert.ok(figure.querySelector('image[href$="pants-dark.webp"]'));
  fireEvent.click(screen.getByRole('button', { name: /Tham chiếu tư liệu \(Bám sát/ }));
  assert.ok(figure.querySelector('image[href$="coat-black.webp"]'));
  assert.ok(figure.querySelector('image[href$="pants-white.webp"]'));
});

test('Late image for a previous selection is not shown on the new outfit', async () => {
  let resolveRequest: (value: Response) => void = () => {};
  globalThis.fetch = async (input) => String(input).includes('/api/image/generate')
    ? new Promise<Response>(resolve => { resolveRequest = resolve; })
    : ({ ok: true, json: async () => ({ status: 'ok' }) }) as Response;
  enter(); fireEvent.click(screen.getByText('Tạo minh họa Gemini · tùy chọn'));
  fireEvent.click(screen.getByRole('button', { name: 'Tạo minh họa AI' }));
  fireEvent.click(screen.getByRole('button', { name: /Đỏ son trầm/ }));
  resolveRequest({ok:true,status:200,json:async()=>({imageUrl:'data:image/png;base64,aGVsbG8='})} as Response);
  await waitFor(() => assert.equal(screen.getByRole('button', { name: 'Tạo minh họa AI' }).hasAttribute('disabled'), false));
  assert.equal(screen.queryByAltText('Minh họa mới do Gemini tạo'), null);
});

test('Malformed entries are excluded; fingerprint includes notes but ignores accessory order', () => {
  localStorage.setItem(OUTFIT_STORAGE_KEY, JSON.stringify([null, {}, { id: 'bad', selection: { accessoryIds: null } }]));
  assert.deepEqual(readSavedOutfits(localStorage), []);
  const a = { occasionId:'o',garmentId:'g',colorId:'c',styleId:'s',accessoryIds:['a','b'],userNote:'one' };
  assert.equal(selectionKey(a), selectionKey({...a,accessoryIds:['b','a']}));
  assert.notEqual(selectionKey(a), selectionKey({...a,userNote:'two'}));
});

test('Vertex mode excludes Gemini API key; Developer API stays the default', () => {
  const vertex = genaiSettings({GOOGLE_GENAI_USE_VERTEXAI:'true',GOOGLE_CLOUD_PROJECT:'c3-app-162',GEMINI_API_KEY:'unused'});
  assert.equal(vertex.configured, true); assert.equal(vertex.apiKey, undefined); assert.equal(vertex.location,'global');
  assert.equal(genaiSettings({GEMINI_API_KEY:'MY_GEMINI_API_KEY'}).configured,false);
  assert.equal(genaiSettings({GEMINI_API_KEY:'test'}).provider,'gemini_api');
  assert.equal(genaiSettings({GOOGLE_GENAI_USE_VERTEXAI:'true'}).configured,false);
});
