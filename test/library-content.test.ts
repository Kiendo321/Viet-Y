import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GARMENTS,OCCASIONS,normalizeSelection} from '../src/data/vietYCatalog';
import {GARMENT_ARTICLES,EVENT_ARTICLES,RESEARCH_SOURCES} from '../src/data/libraryArticles';
import {detailsFor} from '../src/data/garmentDetails';
test('Every catalog entry has a complete reading route and valid evidence/relationships',()=>{
 for(const garment of GARMENTS){
  const article=GARMENT_ARTICLES[garment.id];assert.ok(article.opening.length>0);
  assert.ok(article.questions.length>0);assert.ok(article.chapters.some(c=>c.kind==='history'&&c.sourceIds.length));
  assert.equal(new Set(article.chapters.map(c=>c.id)).size,article.chapters.length);
  for(const chapter of article.chapters){assert.ok(chapter.paragraphs.every(p=>p.trim().length>0));for(const source of chapter.sourceIds)assert.ok(source in RESEARCH_SOURCES);}
  for(const event of article.related)assert.ok(OCCASIONS.some(e=>e.id===event));
  for(const person of Object.keys(garment.variants)){
   const s=normalizeSelection({garment:garment.id,person:person as 'male'|'female'});
   const details=detailsFor(s);assert.equal(details.length,3);
   for(const d of details){const [x,y,w,h]=d.crop;assert.ok(x>=0&&y>=0&&x+w<=1086&&y+h<=1448);}
  }
 }
 for(const event of OCCASIONS){const article=EVENT_ARTICLES[event.id];assert.ok(article.chapters.length&&article.checklist.length);for(const id of article.garments)assert.ok(GARMENTS.some(g=>g.id===id));}
});
