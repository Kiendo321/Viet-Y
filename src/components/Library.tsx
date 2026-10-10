import {browserAsset} from '../assets/browserAssets';
import React from 'react';
import {ArrowUpRight,ArrowLeft,ArrowRight} from 'lucide-react';
import {GARMENTS,OCCASIONS,garmentById,eventById,composerUrl,normalizeSelection,DEFAULT_SELECTION,Garment,ColorId,Person,ComposerSelection} from '../data/vietYCatalog';
import {GARMENT_ARTICLES,EVENT_ARTICLES,ReadingChapter} from '../data/libraryArticles';
import {detailsFor} from '../data/garmentDetails';
import {OutfitScene} from './OutfitScene';
import {Link} from '../services/navigation';
function photoSelection(g:Garment,person:Person,color:ColorId,event=GARMENT_ARTICLES[g.id].related[0]):ComposerSelection{
 return normalizeSelection({...DEFAULT_SELECTION,garment:g.id,person,color,event});
}
function Chapters({chapters}:{chapters:ReadingChapter[]}){return <>{chapters.map(c=><section className="reading-chapter" id={c.id} key={c.id}><h2>{c.title}</h2><div className="reading-prose">{c.paragraphs.map(p=><p key={p}>{p}</p>)}</div></section>)}</>;}
function Contents({items}:{items:{id:string;title:string}[]}){return <nav className="article-contents" aria-label="Trong bài">{items.map(i=><a key={i.id} href={'#'+i.id}>{i.title}</a>)}</nav>;}
export function Library(){
 return <section className="library library-magazine page"><header className="page-heading"><h1>Tư liệu</h1><p>Dáng áo, miền văn hóa và những cách mặc hôm nay.</p></header>
  <div className="library-columns"><section><h2>Trang phục <span>{GARMENTS.length} bài</span></h2><div className="garment-list">{GARMENTS.map(g=><Link key={g.id} to={'/tu-lieu/trang-phuc/'+g.id} className="garment-record"><div className="garment-record-image"><OutfitScene selection={photoSelection(g,g.variants.male?'male':'female',g.id==='tu-than'?'brown':'red')} label={g.name}/></div><div><h3>{g.name}</h3><p>{g.subtitle}</p></div><ArrowUpRight size={20}/></Link>)}</div></section>
  <section><h2>Sự kiện <span>{OCCASIONS.length} bài</span></h2><div className="event-list">{OCCASIONS.map(e=><Link key={e.id} to={'/tu-lieu/su-kien/'+e.id} className="event-record"><img src={browserAsset(e.image)} alt={'Không gian '+e.name} loading="lazy"/><div><h3>{e.name}</h3><p>{e.mood}</p><ArrowUpRight size={20}/></div></Link>)}</div></section></div>
 </section>;
}
export function GarmentArticle({id}:{id:string}){
 const g=garmentById(id);if(!g)return <NotFound/>;
 const article=GARMENT_ARTICLES[g.id],first=photoSelection(g,g.variants.male?'male':'female',g.id==='tu-than'?'brown':'red'),second=photoSelection(g,g.variants.female?'female':'male','ivory');
 const details=detailsFor(first);
 return <article className="article magazine-article page"><Link to="/tu-lieu" className="back-link"><ArrowLeft size={16}/>Tư liệu / Trang phục</Link>
  <header className="magazine-heading"><div><h1>{g.name}</h1><p>{g.intro}</p></div><Link to={composerUrl({garment:g.id,person:g.variants.male?'male':'female'})} className="primary-link">Phối với dáng áo này <ArrowUpRight size={19}/></Link></header>
  <Contents items={[{id:'cau-chuyen',title:'Câu chuyện'},{id:'lich-su',title:'Lịch sử'},{id:'ket-cau',title:'Kết cấu'},{id:'chat-lieu',title:'Chất liệu'},{id:'bien-the',title:'Biến thể'},{id:'y-nghia',title:'Ý nghĩa'},{id:'ung-dung',title:'Mặc hôm nay'}]}/>
  <div className="magazine-triptych"><figure><OutfitScene selection={first} label={'Bộ phối '+g.name}/></figure><figure><OutfitScene selection={first} crop={details[0].crop} label={'Cận cảnh '+details[0].title}/></figure><figure><OutfitScene selection={second} label={'Một cách phối '+g.name}/></figure></div>
  <div className="article-facts"><section><h2>Thời kỳ gắn liền</h2><p>{g.era}</p></section><section><h2>Nét nhận diện</h2><p>{g.subtitle}</p></section></div>
  <section className="magazine-opening" id="cau-chuyen"><div><h2>Một dáng áo,<br/>nhiều câu chuyện</h2><div className="opening-prose">{article.opening.map(p=><p key={p}>{p}</p>)}</div></div><figure><OutfitScene selection={first} crop={details[1].crop} label={'Chi tiết '+details[1].title}/><figcaption>{details[1].title} — nhìn gần để hiểu dáng áo.</figcaption></figure></section>
  <Chapters chapters={article.chapters.slice(0,1)}/>
  <section className="magazine-anatomy" id="ket-cau"><h2>Nhìn từ kết cấu</h2><div>{details.map(d=><section key={d.title}><figure><OutfitScene selection={first} crop={d.crop} label={'Cận cảnh '+d.title}/></figure><h3>{d.title}</h3><p>{d.body}</p></section>)}</div><dl className="construction-notes">{g.anatomy.map(a=><div key={a.title}><dt>{a.title}</dt><dd>{a.body}</dd></div>)}</dl></section>
  <Chapters chapters={article.chapters.slice(1)}/>
  <section className="contemporary-spread" id="ung-dung"><div><h2>Từ di sản<br/>đến đời sống</h2><p>{g.symbol}</p><ul>{g.contemporary.map(t=><li key={t}>{t}</li>)}</ul></div><div className="context-images">{article.related.map(event=>{const e=eventById(event)!;return <Link key={event} to={'/tu-lieu/su-kien/'+event}><div><OutfitScene selection={{...first,event}} label={g.name+' trong bối cảnh '+e.name}/></div><span>{e.name}<ArrowRight size={18}/></span></Link>;})}</div></section>
  <section className="reading-faq"><h2>Điều thường được hỏi</h2>{article.questions.map(q=><details key={q.question}><summary>{q.question}</summary><p>{q.answer}</p></details>)}</section>
  <RelatedGarments exclude={id}/>
 </article>;
}
function RelatedGarments({exclude,ids}:{exclude?:string;ids?:string[]}){return <section className="magazine-related"><h2>Khám phá dáng áo</h2><div>{GARMENTS.filter(g=>ids?ids.includes(g.id):g.id!==exclude).slice(0,3).map(g=><Link key={g.id} to={'/tu-lieu/trang-phuc/'+g.id}><figure><img src={browserAsset(g.cover)} alt="" loading="lazy"/></figure><span>{g.name}<ArrowUpRight size={18}/></span></Link>)}</div></section>;}
export function EventArticle({id}:{id:string}){
 const e=eventById(id);if(!e)return <NotFound/>;
 const article=EVENT_ARTICLES[e.id];
 return <article className="article magazine-article event-magazine page"><Link to="/tu-lieu" className="back-link"><ArrowLeft size={16}/>Tư liệu / Sự kiện</Link>
  <header className="magazine-heading"><div><h1>{e.name}</h1><p>{e.intro}</p></div><Link to={composerUrl({event:e.id})} className="primary-link">Phối cho dịp này <ArrowUpRight size={19}/></Link></header>
  <Contents items={[{id:'boi-canh',title:'Bối cảnh'},{id:'lua-chon',title:'Chọn trang phục'},{id:'khong-gian',title:'Không gian'},{id:'luu-y',title:'Lưu ý'},{id:'chuan-bi',title:'Chuẩn bị'}]}/>
  <figure className="event-reading-cover"><img src={browserAsset(e.image)} alt={'Không gian '+e.name}/><figcaption>{e.mood}</figcaption></figure>
  <div className="article-facts"><section><h2>Không khí & tính chất</h2><p>{e.nature}</p></section><section><h2>Điểm nhấn</h2><p>{e.highlight}</p></section></div>
  <Chapters chapters={article.chapters.slice(0,2)}/>
  <section className="event-look-spread"><h2>Hình dung một bộ phối</h2><div>{article.garments.slice(0,2).map(id=>{const g=garmentById(id)!;return <Link key={id} to={composerUrl({garment:id,event:e.id,person:g.variants.male?'male':'female',color:id==='tu-than'?'brown':'red'})}><figure><OutfitScene selection={photoSelection(g,g.variants.male?'male':'female',id==='tu-than'?'brown':'red',e.id)} label={g.name+' · '+e.name}/></figure><span>{g.name}<ArrowUpRight size={18}/></span></Link>;})}</div></section>
  <Chapters chapters={article.chapters.slice(2)}/>
  <section className="event-practical" id="chuan-bi"><div><h2>Những dịp có thể bắt đầu</h2><ul>{article.examples.map(t=><li key={t}>{t}</li>)}</ul><h3>Gợi ý chuẩn bị</h3><ul>{e.recommendations.map(t=><li key={t}>{t}</li>)}</ul></div><div><h2>Trước khi lên đường</h2><ul>{article.checklist.map(t=><li key={t}>{t}</li>)}</ul><h3>Điều nên tránh</h3><ul>{e.avoid.map(t=><li key={t}>{t}</li>)}</ul></div></section>
  <RelatedGarments ids={article.garments}/>
  <section className="related-articles"><h2>Một dịp khác</h2>{OCCASIONS.filter(x=>x.id!==id).slice(0,2).map(x=><Link key={x.id} to={'/tu-lieu/su-kien/'+x.id}>{x.name}<ArrowRight size={18}/></Link>)}</section>
 </article>;
}
export function NotFound(){return <section className="page missing-page"><h1>Trang chưa có ở đây.</h1><Link to="/" className="primary-link">Về trang chủ <ArrowRight size={18}/></Link></section>;}

