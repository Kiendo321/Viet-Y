import React from 'react';
import {ArrowRight,ArrowUpRight,BookOpen,Images} from 'lucide-react';
import {browserAsset} from '../assets/browserAssets';
import {Link} from '../services/navigation';
import {ACCESSORIES,COLORS,GARMENTS,OCCASIONS,composerUrl} from '../data/vietYCatalog';
import {Brand} from './AppShell';
import {BraidedFlowerLogo} from './HeritageOrnaments';
const studioHero=new URL('../assets/landing/studio-hero.webp',import.meta.url).href;
export function Home(){
 return <div className="home home-studio">
  <section className="studio-hero" aria-labelledby="studio-title">
   <img className="studio-hero-art" src={studioHero} alt="Người mẫu nam mặc ngũ thân chàm và người mẫu nữ mặc Nhật Bình đỏ bên bảng chất liệu Việt phục" fetchPriority="high" width="2172" height="724"/>
   <div className="studio-hero-copy">
    <h1 id="studio-title"><span>Mặc nét Việt.</span><span>Phối chất riêng.</span></h1>
    <p className="studio-intro">Khám phá và phối Việt phục theo dịp, dáng áo, màu sắc và phụ kiện. Từ cảm hứng truyền thống đến phong cách của riêng bạn.</p>
    <div className="studio-actions"><Link to="/xuong-phoi" className="studio-primary">Vào xưởng phối <ArrowRight size={18}/></Link><Link to="/tu-lieu" className="studio-secondary">Khám phá Việt phục</Link></div>
    <p className="studio-signature"><BraidedFlowerLogo/>Chọn dịp · Thử phối · Hiểu nét Việt</p>
   </div>
  </section>
  <section className="studio-flow" aria-labelledby="flow-title">
   <div className="studio-flow-intro"><h2 id="flow-title">Từ ý tưởng <br/>đến bộ phối của bạn</h2><p>Bắt đầu từ nơi bạn sẽ đến. Chọn một dáng áo, rồi thử những điểm nhấn để tìm cách phối hợp gu.</p></div>
   <ol className="studio-steps">
    <li className="studio-step"><div className="studio-step-heading"><span aria-hidden="true">01</span><div><h3>Chọn dịp</h3><p>Đặt bộ phối trong bối cảnh bạn sẽ đến.</p></div></div><div className="studio-mini-occasions">{OCCASIONS.map(event=><Link key={event.id} to={composerUrl({event:event.id})} aria-label={'Phối đồ cho '+event.name}><img src={browserAsset(event.image)} alt="" loading="lazy" width="1086" height="1448"/><span>{event.shortName}</span></Link>)}</div></li>
    <li className="studio-step"><div className="studio-step-heading"><span aria-hidden="true">02</span><div><h3>Chọn áo</h3><p>Tìm dáng áo có nét riêng bạn yêu thích.</p></div></div><div className="studio-mini-garments">{GARMENTS.map(garment=><Link key={garment.id} to={composerUrl({garment:garment.id})} aria-label={'Thử phối '+garment.name}><img src={browserAsset(garment.cover)} alt="" loading="lazy" width="1086" height="1448"/><span>{garment.shortName}</span></Link>)}</div></li>
    <li className="studio-step"><div className="studio-step-heading"><span aria-hidden="true">03</span><div><h3>Thêm nét riêng</h3><p>Thử sắc màu, chọn phụ kiện, xem tổng thể.</p></div></div><div className="studio-color-preview" aria-label="Sắc màu phối đồ">{Object.values(COLORS).map(color=><span key={color.name} title={color.name} style={{backgroundColor:color.hex}}/>)}</div><div className="studio-accessory-preview">{(['turban','pearl-necklace','wood-beads'] as const).map(id=><figure key={id}>{id==='turban'?<svg viewBox="417 23 182 130" aria-hidden="true"><image href={browserAsset(ACCESSORIES[id].image!)} width="1024" height="1536"/></svg>:<img src={browserAsset(ACCESSORIES[id].image!)} alt="" loading="lazy" width="1024" height="1536"/>}<figcaption>{ACCESSORIES[id].name}</figcaption></figure>)}</div></li>
   </ol>
  </section>
  <section className="studio-garments" aria-labelledby="garments-title">
   <div className="studio-section-heading"><div><h2 id="garments-title">Nhiều dáng áo, nhiều cách mặc</h2><p>Mỗi dáng áo mang một câu chuyện. Khám phá nét đặc trưng để phối theo cách của bạn.</p></div><Link to="/tu-lieu" className="studio-text-link">Khám phá trang phục <ArrowRight size={17}/></Link></div>
   <div className="studio-garment-grid">{GARMENTS.map(garment=><Link key={garment.id} to={'/tu-lieu/trang-phuc/'+garment.id} className={'studio-garment-cover garment-tone-'+garment.id} aria-label={'Tìm hiểu '+garment.name}><img src={browserAsset(garment.cover)} alt="" loading="lazy" width="1086" height="1448"/><div><h3>{garment.shortName}</h3><p>{garment.subtitle}</p><span className="studio-cover-arrow" aria-hidden="true"><ArrowUpRight size={19}/></span></div></Link>)}</div>
  </section>
  <section className="studio-collection" aria-labelledby="collection-title">
   <div className="studio-collection-mark" aria-hidden="true"><Images size={30}/><span>Lookbook</span><BraidedFlowerLogo/></div>
   <div className="studio-collection-copy"><h2 id="collection-title">Một bộ sưu tập.<br/>Một dấu ấn riêng.</h2><p>Dành một không gian cho gu của bạn. Những bộ phối cùng chủ đề, sắc màu và cảm hứng có thể kể nên một câu chuyện mang dấu ấn riêng.</p><Link to="/lookbook" className="studio-text-link">Đến Lookbook <ArrowRight size={18}/></Link></div>
   <div className="studio-collection-themes" aria-hidden="true"><span>Sắc màu</span><span>Chủ đề</span><span>Câu chuyện</span></div>
  </section>
  <section className="studio-knowledge"><BookOpen size={23} aria-hidden="true"/><div><h2>Phối theo gu, hiểu điều đang mặc.</h2><p>Từ cổ áo, hàng khuy đến bối cảnh sử dụng — tìm hiểu những chi tiết làm nên nét riêng của Việt phục.</p></div><Link to="/tu-lieu" className="studio-text-link">Đọc tư liệu <ArrowRight size={18}/></Link></section>
  <footer className="home-footer studio-footer"><Brand/><p>Nếp xưa. Cách mặc hôm nay.</p><div><Link to="/xuong-phoi">Xưởng phối</Link><Link to="/lookbook">Lookbook</Link><Link to="/tu-lieu">Tư liệu</Link></div></footer>
 </div>;
}

