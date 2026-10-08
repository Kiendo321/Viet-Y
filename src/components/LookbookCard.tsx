import React, { useState } from 'react';
import { Download, Share2, ChevronLeft, Bookmark } from 'lucide-react';
import { ALLOWLIST_COLORS, ALLOWLIST_ACCESSORIES, ALLOWLIST_STYLES, CULTURAL_ARTIFACT_MUSEUM, OCCASION_DATA, type OutfitSelection } from '../data/catalog';
import { OutfitFigure } from './OutfitFigure';
import { downloadLookbook } from '../services/lookbookExport';

export function LookbookCard({ selection, onEdit, onSave, saved, dirty }: {
  selection: OutfitSelection; onEdit: () => void; onSave: () => boolean; saved: boolean; dirty: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const color = ALLOWLIST_COLORS.find(item => item.id === selection.colorId)!;
  const style = ALLOWLIST_STYLES.find(item => item.id === selection.styleId)!;
  const accessories = ALLOWLIST_ACCESSORIES.filter(item => selection.accessoryIds.includes(item.id));
  async function download() {
    if (busy) return;
    setBusy(true); setError(null); setFeedback(null);
    try { await downloadLookbook(selection); setFeedback('Đã chuẩn bị thẻ ảnh PNG để tải về.'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Chưa tải được ảnh. Vui lòng thử lại.'); }
    finally { setBusy(false); }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(`Việt phục Remix · ${OCCASION_DATA.name}\nÁo ngũ thân nam · ${color.name}\n${style.name}\n${accessories.map(item => item.name).join(', ')}\nTư liệu: ${CULTURAL_ARTIFACT_MUSEUM.sourceUrl}`);
      setError(null); setFeedback('Đã sao chép tóm tắt và liên kết tư liệu.');
    } catch { setError('Trình duyệt chưa cho phép sao chép. Bạn có thể tải thẻ ảnh PNG.'); }
  }
  return <section className="space-y-6" aria-labelledby="lookbook-title">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-sm text-[#8E101A]">Lookbook của bạn</p><h1 id="lookbook-title" className="font-serif text-3xl font-bold">Một bộ phối, sẵn sàng mang đi</h1>
        <p className="text-sm mt-2 text-[#59473A]">Lưu để sửa tiếp, tải thẻ ảnh để chia sẻ với bạn bè.</p></div>
      <button type="button" onClick={onEdit} className="min-h-11 flex items-center gap-2 px-4 border border-[#DECFB9] rounded-sm"><ChevronLeft size={16}/>Sửa bộ phối</button>
    </div>
    <article className="lookbook-card grid md:grid-cols-2 border border-[#DECFB9] bg-[#FFFBF4] rounded-sm overflow-hidden">
      <div className="bg-[#EFE3CF] p-6"><OutfitFigure selection={selection} className="h-[440px] sm:h-[560px] w-full"/>
        <p className="text-xs text-center mt-4 text-[#59473A]">Ảnh phối từ asset minh họa AI · Mẫu dựng sẵn</p></div>
      <div className="p-6 sm:p-10 space-y-5">
        <p className="text-sm text-[#8E101A]">{OCCASION_DATA.name}</p>
        <h2 className="font-serif text-3xl font-bold">Ngũ thân · {color.name.split(' (')[0]}</h2>
        <p className="text-sm text-[#59473A]">{style.name.split(' (')[0]}</p>
        <ul className="space-y-2 text-sm">{accessories.map(item => <li key={item.id}>• {item.name}</li>)}</ul>
        {selection.userNote && <p className="text-sm border-l-2 border-[#B18C52] pl-4">{selection.userNote}</p>}
        <div className="border-y border-[#DECFB9] py-4 space-y-2 text-sm">
          <h3 className="font-bold text-[#486657]">Hiểu một nét Việt</h3>
          <p>Hiện vật tham chiếu là áo ngũ thân sa kép, ngoài đen lót trắng, có 5 cúc dọc vạt phải. Các sắc áo khác và phụ kiện trong bộ phối là đề xuất sáng tạo.</p>
          <a className="underline text-[#486657]" href={CULTURAL_ARTIFACT_MUSEUM.sourceUrl} target="_blank" rel="noreferrer">Đọc tư liệu bảo tàng</a>
        </div>
        <p role="status" className="text-sm text-[#486657]">{saved ? 'Đã lưu bộ phối trên trình duyệt này.' : dirty ? 'Chưa lưu thay đổi.' : 'Bộ phối chưa được lưu.'}</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={download} className="min-h-11 px-5 bg-[#8E101A] text-white rounded-sm flex items-center gap-2 disabled:opacity-50"><Download size={16}/>{busy ? 'Đang chuẩn bị ảnh…' : 'Tải thẻ lookbook PNG'}</button>
          <button type="button" disabled={saved} onClick={() => { onSave(); }} className="min-h-11 px-4 border border-[#DECFB9] rounded-sm flex items-center gap-2 disabled:opacity-50"><Bookmark size={16}/>{saved ? 'Đã lưu bộ phối' : dirty ? 'Cập nhật bản đã lưu' : 'Lưu bộ phối'}</button>
          <button type="button" onClick={copy} className="min-h-11 px-4 border border-[#DECFB9] rounded-sm flex items-center gap-2"><Share2 size={16}/>Sao chép tóm tắt</button>
        </div>
        <p className="text-xs text-[#59473A]">Thẻ PNG dùng đúng ảnh phối hiện tại từ bộ asset. Ảnh Gemini tạo riêng chỉ giữ trong phiên; hãy tải ảnh đó trước khi đóng trang.</p>
        {feedback && <p role="status" className="text-sm text-[#486657]">{feedback}</p>}
        {error && <p role="alert" className="text-sm text-[#9F1D26]">{error}</p>}
      </div>
    </article>
  </section>;
}
