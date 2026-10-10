import {browserAsset} from '../assets/browserAssets';
import React from 'react';
import {ArrowUpRight,ArrowLeft,ArrowRight} from 'lucide-react';
import {GARMENTS,OCCASIONS,garmentById,eventById,composerUrl} from '../data/vietYCatalog';
import {Link} from '../services/navigation';
export function Library(){
 return <section className="library page"><header className="page-heading"><h1>Tư liệu</h1><p>Một dáng áo, một bối cảnh, một câu chuyện để hiểu thêm.</p></header>
  <div className="library-columns"><section><h2>Trang phục <span>{GARMENTS.length}</span></h2><div className="garment-list">{GARMENTS.map(g=><Link key={g.id} to={'/tu-lieu/trang-phuc/'+g.id} className="garment-record"><div className="garment-record-image"><img src={browserAsset(g.cover)} alt="" loading="lazy"/></div><div><h3>{g.name}</h3><p>{g.subtitle}</p></div><ArrowUpRight size={20}/></Link>)}</div></section>
  <section><h2>Sự kiện <span>{OCCASIONS.length}</span></h2><div className="event-list">{OCCASIONS.map(e=><Link key={e.id} to={'/tu-lieu/su-kien/'+e.id} className="event-record"><img src={browserAsset(e.image)} alt="" loading="lazy"/><div><h3>{e.name}</h3><p>{e.mood}</p><ArrowUpRight size={20}/></div></Link>)}</div></section></div>
 </section>;
}
export function GarmentArticle({id}:{id:string}){
 const g=garmentById(id);if(!g)return <NotFound/>;
 return <article className="article page"><Link to="/tu-lieu" className="back-link"><ArrowLeft size={16}/>Trang phục</Link>
  <div className="article-hero garment-hero"><div><h1>{g.name}</h1><p className="article-lead">{g.intro}</p><div className="era-block"><h2>Thời kỳ gắn liền</h2><p>{g.era}</p></div><Link to={composerUrl({garment:g.id,person:g.variants.male?'male':'female'})} className="primary-link">Phối với dáng áo này <ArrowUpRight size={19}/></Link></div><figure><img src={browserAsset(g.cover)} alt={g.name}/></figure></div>
  <section className="anatomy"><h2>Nhìn từ kết cấu</h2><div>{g.anatomy.map(b=><section key={b.title}><h3>{b.title}</h3><p>{b.body}</p></section>)}</div></section>
  <section className="meaning"><h2>Nét nghĩa trong dáng áo</h2><p>{g.symbol}</p></section>
  <section className="application"><h2>Mặc trong đời sống hôm nay</h2><ul>{g.contemporary.map(x=><li key={x}>{x}</li>)}</ul></section>
  <div className="related-articles"><h2>Khám phá thêm</h2>{GARMENTS.filter(x=>x.id!==id).slice(0,2).map(x=><Link key={x.id} to={'/tu-lieu/trang-phuc/'+x.id}>{x.name}<ArrowRight size={18}/></Link>)}</div>
 </article>;
}
export function EventArticle({id}:{id:string}){
 const e=eventById(id);if(!e)return <NotFound/>;
 return <article className="article page"><Link to="/tu-lieu" className="back-link"><ArrowLeft size={16}/>Sự kiện</Link>
  <div className="article-hero event-hero"><div><h1>{e.name}</h1><p className="article-lead">{e.intro}</p><div className="era-block"><h2>Không khí & tính chất</h2><p>{e.nature}</p></div><Link to={composerUrl({event:e.id})} className="primary-link">Phối cho dịp này <ArrowUpRight size={19}/></Link></div><figure><img src={browserAsset(e.image)} alt={'Bối cảnh '+e.name}/></figure></div>
  <section className="meaning"><h2>{e.mood}</h2><p>{e.highlight}</p></section>
  <section className="event-guidance"><div><h2>Điểm nổi bật</h2><ul>{e.features.map(t=><li key={t}>{t}</li>)}</ul><h2>Gợi ý chuẩn bị</h2><ul>{e.recommendations.map(t=><li key={t}>{t}</li>)}</ul></div><div><h2>Điều nên tránh</h2><ul>{e.avoid.map(t=><li key={t}>{t}</li>)}</ul></div></section>
  <div className="related-articles"><h2>Một dịp khác</h2>{OCCASIONS.filter(x=>x.id!==id).slice(0,2).map(x=><Link key={x.id} to={'/tu-lieu/su-kien/'+x.id}>{x.name}<ArrowRight size={18}/></Link>)}</div>
 </article>;
}
export function NotFound(){return <section className="page missing-page"><h1>Trang chưa có ở đây.</h1><Link to="/" className="primary-link">Về trang chủ <ArrowRight size={18}/></Link></section>;}

