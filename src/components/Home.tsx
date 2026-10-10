import {browserAsset} from '../assets/browserAssets';
import React from 'react';
import {ArrowUpRight,ArrowRight} from 'lucide-react';
import {Link} from '../services/navigation';
import {LOOKS,OCCASIONS} from '../data/vietYCatalog';
import {Brand} from './AppShell';
import {HeadlineFlourish,PaperWaveDivider} from './HeritageOrnaments';
import {heroBg} from '../assets/assetUrls';
export function Home(){
 return <div className="home">
  <section className="home-hero">
   <figure className="hero-scene"><img src={heroBg} alt="Ngũ thân đỏ son, khăn đóng và lụa đỏ bên hiên gỗ truyền thống" fetchPriority="high"/></figure>
   <div className="hero-copy">
    <div className="hero-heading"><h1>Việt Y</h1><HeadlineFlourish className="hero-flourish"/><p className="hero-motto">Phối theo gu,<br/>hiểu nét Việt.</p></div>
    <div className="hero-invitation"><p>Tìm dáng áo, sắc màu và cách phối cho khoảnh khắc của bạn.</p><div className="hero-actions"><Link to="/xuong-phoi" className="primary-link">Bắt đầu phối <ArrowUpRight size={20}/></Link><Link to="/tu-lieu" className="quiet-link">Khám phá Việt phục <ArrowRight size={17}/></Link></div></div>
   </div>
   <PaperWaveDivider className="hero-wave"/>
  </section>
  <section className="home-story"><div><h2>Thích Việt phục.<br/><em>Bắt đầu từ đâu?</em></h2></div><div><p>Áo nào hợp ngày đi hội? Màu nào vừa với phông ảnh? Thêm một phụ kiện có làm mất nét riêng của áo?</p><p>Việt Y đưa từng lựa chọn vào cùng một khung hình. Bạn thử cách phối, nhìn thấy tổng thể và hiểu thêm câu chuyện phía sau dáng áo.</p></div></section>
  <section className="home-occasions"><div className="section-heading"><h2>Mỗi dịp, một nét riêng.</h2><Link to="/tu-lieu" className="quiet-link">Tìm hiểu bối cảnh <ArrowRight size={18}/></Link></div><div className="occasion-editorial">{OCCASIONS.map(e=><Link key={e.id} to={'/tu-lieu/su-kien/'+e.id} className="occasion-cover"><img src={browserAsset(e.image)} alt="" loading="lazy"/><span><strong>{e.name}</strong><ArrowUpRight size={22}/></span></Link>)}</div></section>
  <section className="home-mechanism"><figure><img src={browserAsset(LOOKS[3].image)} alt="Giao lĩnh xanh rêu giữa kiến trúc cổ" loading="lazy"/></figure><div><h2>Nhìn thấy bộ phối.<br/><em>Trước khi mặc.</em></h2><div className="benefit-lines"><div><h3>Chọn đúng dịp</h3><p>Đặt dáng áo trong không gian bạn sẽ đến.</p></div><div><h3>Thử nét riêng</h3><p>Đổi màu và phụ kiện, xem tổng thể ngay.</p></div><div><h3>Hiểu điều đang mặc</h3><p>Khám phá cổ áo, kết cấu và câu chuyện văn hóa.</p></div></div><Link to="/xuong-phoi" className="primary-link">Vào xưởng phối <ArrowUpRight size={20}/></Link></div></section>
  <section className="home-lookbook"><div className="section-heading"><h2>Những khoảnh khắc<br/><em>đã thành câu chuyện.</em></h2><Link to="/lookbook" className="quiet-link">Xem lookbook <ArrowRight size={18}/></Link></div><div className="home-look-grid">{[LOOKS[0],LOOKS[2],LOOKS[4]].map(l=><Link key={l.id} to={'/lookbook/'+l.id} className="image-story"><img src={browserAsset(l.image)} alt={l.title} loading="lazy"/><span>{l.title}<ArrowUpRight size={18}/></span></Link>)}</div></section>
  <section className="home-voices"><div className="section-heading"><h2>Một nét Việt,<br/>nhiều cách bắt đầu.</h2><span className="demo-caption">Góc nhìn minh họa cho demo</span></div><div className="voice-grid"><blockquote><p>“Mình muốn đi hội với một bộ áo có nét riêng, nhưng vẫn biết vì sao từng món hợp nhau.”</p><footer>Người trẻ yêu văn hóa</footer></blockquote><blockquote><p>“Thử màu áo trên đúng bối cảnh giúp cả nhóm dễ hình dung bộ ảnh chung hơn.”</p><footer>Nhóm chuẩn bị bộ ảnh kỷ niệm</footer></blockquote></div></section>
  <footer className="home-footer"><Brand/><p>Nếp xưa. Cách mặc hôm nay.</p><div><Link to="/lookbook">Lookbook</Link><Link to="/tu-lieu">Tư liệu</Link></div></footer>
 </div>;
}

