import React, { useState } from 'react';
import { ExternalLink, BookOpen, ShieldCheck, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react';
import { CULTURAL_ARTIFACT_MUSEUM } from '../data/catalog';

export const CulturalCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const data = CULTURAL_ARTIFACT_MUSEUM;

  return (
    <article className="bg-[#FFFBF4] border border-[#DECFB9] rounded-sm p-5 space-y-4 shadow-xs relative">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DECFB9] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#9F1D26]" />
          <h3 className="font-serif font-bold text-base text-[#30251F] tracking-tight">
            Thẻ tư liệu hiện vật có nguồn duy nhất
          </h3>
        </div>

        {/* Source link directly adjacent to title */}
        <a
          href={data.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#486657] hover:text-[#9F1D26] hover:underline"
          title="Xem bài viết gốc trên trang Bảo tàng Lịch sử Quốc gia"
        >
          <span>Nguồn: {data.institution}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Artifact Title & Provenance */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#30251F]/70 font-mono uppercase tracking-wider mb-1">
          <span className="font-semibold text-[#486657]">HIỆN VẬT THAM CHIẾU NGUỒN</span>
          <span>·</span>
          <span>Bảo tàng Lịch sử Quốc gia tiếp nhận</span>
        </div>
        <h4 className="font-serif text-lg font-semibold text-[#30251F]">
          {data.name}
        </h4>
        <p className="text-xs text-[#30251F]/80 mt-1 leading-relaxed">
          {data.provenanceNote}
        </p>
      </div>

      {/* Strict Academic Scope Disclaimer */}
      <div className="bg-[#9F1D26]/5 border-l-2 border-[#9F1D26] p-3 text-xs text-[#79171E] leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-[11px] mb-1">
          <Info className="w-3.5 h-3.5 text-[#9F1D26]" />
          <span>Giới hạn khoa học bắt buộc</span>
        </div>
        <p>{data.disclaimer}</p>
        <p className="mt-1 text-[11px] text-[#79171E]/90">
          * Tuyệt đối không tự thêm ý nghĩa triết lý, biểu tượng màu sắc hay quy chuẩn không có trong bài viết của Bảo tàng.
        </p>
      </div>

      {/* Accordion toggle button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-xs font-semibold text-[#30251F] uppercase tracking-wider border-t border-b border-[#DECFB9]"
      >
        <span>Dữ kiện nguồn từ bài viết Bảo tàng (Toàn văn đối chiếu)</span>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#9F1D26]" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-1 text-xs text-[#30251F]/90 leading-relaxed">
          {/* Exact Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F7F0E4] p-3.5 rounded-xs border border-[#DECFB9]">
            <div>
              <span className="font-bold text-[#30251F] flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-[#486657]" />
                1. Người may & Chất liệu:
              </span>
              <p className="text-[#30251F]/80 pl-4">{data.sourceFacts.craft}</p>
              <p className="text-[#30251F]/80 pl-4">{data.sourceFacts.material}</p>
            </div>
            <div>
              <span className="font-bold text-[#30251F] flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-[#486657]" />
                2. Cấu trúc hai lớp:
              </span>
              <p className="text-[#30251F]/80 pl-4">{data.sourceFacts.layers}</p>
            </div>
            <div>
              <span className="font-bold text-[#30251F] flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-[#486657]" />
                3. Hệ thống cúc:
              </span>
              <p className="text-[#30251F]/80 pl-4">{data.sourceFacts.buttons}</p>
            </div>
            <div>
              <span className="font-bold text-[#30251F] flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-[#486657]" />
                4. Cấu tạo ống tay:
              </span>
              <p className="text-[#30251F]/80 pl-4">{data.sourceFacts.sleeves}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-[#30251F] flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-[#486657]" />
                5. Hệ hoa văn dệt trên áo:
              </span>
              <p className="text-[#30251F]/80 pl-4">{data.sourceFacts.patterns}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-[#30251F] flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-[#486657]" />
                6. Phong thái trang phục:
              </span>
              <p className="text-[#30251F]/80 pl-4">{data.sourceFacts.bearing}</p>
            </div>
          </div>

          {/* Separation between source facts and modern campus suggestions */}
          <div className="bg-[#FFFBF4] p-3 rounded-xs border border-[#DECFB9] space-y-1">
            <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#30251F]">
              Phân biệt: Dữ kiện nguồn vs Gợi ý phối hiện đại
            </h5>
            <p className="text-[11px] text-[#30251F]/70">
              • <strong>Dữ kiện nguồn:</strong> Duy nhất chiếc áo nam sa kép được Bảo tàng mô tả (ngoài đen lót trắng, 5 cúc vạt phải, ống tay nhỏ gọn hơn áo tấc/giao lĩnh, hoa văn hồi văn/thủy ba/ngũ phúc).
            </p>
            <p className="text-[11px] text-[#30251F]/70">
              • <strong>Gợi ý phối hiện đại:</strong> Khăn đóng, quần âu, giày da, các màu áo mở rộng (chàm, ngọc, son...) là phương án remix thực tế dành riêng cho sinh viên trong ngày hội, không nằm trong hồ sơ hiện vật bảo tàng.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#DECFB9] text-[11px] text-[#30251F]/60 italic">
            <ShieldCheck className="w-3.5 h-3.5 text-[#486657]" />
            <span>
              Toàn bộ dữ liệu lịch sử được chốt theo nguồn Bảo tàng Lịch sử Quốc gia; hệ thống không cho phép AI tự suy diễn thêm ý nghĩa lịch sử.
            </span>
          </div>
        </div>
      )}
    </article>
  );
};
