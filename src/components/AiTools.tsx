import React from 'react';
import { OutfitFigure } from './OutfitFigure';
import { ALLOWLIST_COLORS, type OutfitSelection, type StylistRecommendation } from '../data/catalog';

export function AiTools(props: {
  selection: OutfitSelection; status: string; suggestions: StylistRecommendation[];
  source: string | null; model: string | null; error: string | null; errorCode: string | null;
  onAsk: () => void; onApply: (rec: StylistRecommendation) => void;
  image: string | null; imageBusy: boolean; imageError: string | null; imageErrorCode: string | null;
  onGenerate: () => void;
}) {
  const success = props.status === 'success' && props.source === 'gemini' && Boolean(props.model);
  const fallback = props.status === 'fallback' || props.status === 'error';
  return <section className="ai-tools space-y-3" aria-label="Công cụ AI tùy chọn">
    <details className="bg-[#FFFBF4] border border-[#DECFB9] rounded-sm p-4">
      <summary className="min-h-11 cursor-pointer font-serif font-bold text-base">Gợi ý Gemini · tùy chọn</summary>
      <div className="mt-3 space-y-4">
        <p className="text-sm text-[#59473A]">Muốn có điểm bắt đầu? Nhờ Gemini đề xuất hai cách phối từ danh mục đang hỗ trợ. Bạn vẫn có thể tự phối và hoàn tất ngay.</p>
        <button type="button" disabled={props.status === 'loading'} onClick={props.onAsk} className="min-h-11 px-5 bg-[#8E101A] text-white rounded-sm disabled:opacity-50">{props.status === 'loading' ? 'Đang gọi Gemini stylist…' : fallback ? 'Thử gọi lại Gemini' : 'Nhờ Gemini gợi ý 2 bộ phối'}</button>
        <p role="status" className="text-sm text-[#486657]">{props.status === 'loading' ? 'Đang kết nối Gemini. Các mẫu dưới đây chưa phải kết quả yêu cầu này.' : success ? 'Đã nhận gợi ý trực tiếp từ Gemini.' : fallback ? 'AI chưa sẵn sàng. Bạn có thể dùng mẫu có sẵn hoặc tiếp tục tự phối.' : 'Mẫu tham khảo ban đầu — chưa gọi Gemini'}</p>
        <div className="grid sm:grid-cols-2 gap-4">{props.suggestions.map(rec => {
          const s = { ...props.selection, garmentId: rec.garmentId, colorId: rec.colorId, accessoryIds: [rec.accessoryId], styleId: rec.styleId };
          const color = ALLOWLIST_COLORS.find(item => item.id === rec.colorId)!;
          return <article key={rec.id} className="border border-[#DECFB9] rounded-sm p-4 flex gap-4 items-start">
            <OutfitFigure selection={s} className="w-20 h-40 shrink-0"/>
            <div className="space-y-2 min-w-0"><p className="text-xs text-[#486657]">{success ? 'Gợi ý Gemini · Ảnh asset có sẵn' : props.status === 'loading' ? 'Mẫu tham khảo — chưa phải kết quả request' : 'Mẫu phối có sẵn · Ảnh asset'}</p>
              <h3 className="font-serif font-bold">{color.name.split(' (')[0]}</h3><p className="text-sm leading-relaxed text-[#59473A]">{rec.reason}</p>
              <button type="button" onClick={() => props.onApply(rec)} className="min-h-11 px-4 border border-[#8E101A] rounded-sm text-[#8E101A] font-semibold text-sm">Áp dụng bộ phối</button>
            </div>
          </article>;
        })}</div>
        <details className="text-xs text-[#59473A]"><summary className="cursor-pointer min-h-11">Nguồn kết quả & chi tiết dịch vụ</summary><p>{props.source || 'Mẫu tham khảo'} · {props.model || 'Chưa có mô hình phản hồi'} · {props.errorCode || ''}</p>{props.error && <p>{props.error}</p>}</details>
      </div>
    </details>
    <details className="bg-[#FFFBF4] border border-[#DECFB9] rounded-sm p-4">
      <summary className="min-h-11 cursor-pointer font-serif font-bold text-base">Tạo minh họa Gemini · tùy chọn</summary>
      <div className="mt-3 space-y-4">
        <p className="text-sm text-[#59473A]">Tạo một hình ảnh concept riêng từ cấu hình đang chọn. Kết quả AI có thể khác ảnh phối và cần được kiểm tra bằng mắt.</p>
        <button type="button" disabled={props.imageBusy} onClick={props.onGenerate} className="min-h-11 px-5 border border-[#8E101A] text-[#8E101A] rounded-sm disabled:opacity-50">{props.imageBusy ? 'Đang tạo minh họa…' : 'Tạo minh họa AI'}</button>
        {props.imageBusy && <p role="status" className="text-sm">Đang tạo ảnh. Bạn vẫn có thể lưu và hoàn tất bằng bộ phối hiện tại.</p>}
        {props.imageError && <div role="alert" className="text-sm text-[#9F1D26] space-y-2"><p>Chưa tạo được ảnh AI. Bộ phối của bạn vẫn được giữ; bạn có thể hoàn tất và tải thẻ lookbook.</p><details><summary className="cursor-pointer min-h-11">Chi tiết lỗi</summary><p>{props.imageErrorCode} · {props.imageError}</p></details></div>}
        {props.image && <div className="space-y-2"><img src={props.image} alt="Minh họa mới do Gemini tạo" className="max-h-[520px] max-w-full rounded-sm"/><p className="text-xs">Ảnh Gemini · Cần kiểm tra chi tiết trang phục · Chỉ giữ trong phiên</p><a download="viet-phuc-gemini.png" href={props.image} className="min-h-11 inline-flex items-center underline">Tải ảnh Gemini</a></div>}
      </div>
    </details>
  </section>;
}
