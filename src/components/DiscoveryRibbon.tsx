import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { CULTURAL_ARTIFACT_MUSEUM } from '../data/catalog';
import { AtlasTile } from './AtlasTile';
import { PaperWaveDivider, LeafBranchOrnament } from './HeritageOrnaments';

interface DiscoveryRibbonProps {
  onGoToStep: (step: number) => void;
  onSelectColor: (colorId: string) => void;
}

const FABRIC_SWATCHES = [
  { col: 0 as const, name: 'Đỏ son', colorId: 'color-do-son-tram' },
  { col: 1 as const, name: 'Mực chàm', colorId: 'color-muc-cham-co' },
  { col: 2 as const, name: 'Trắng ngà', colorId: 'color-trang-nga-toi-gian' },
  { col: 3 as const, name: 'Xanh ngọc', colorId: 'color-xanh-ngoc-bich' },
];

export const DiscoveryRibbon: React.FC<DiscoveryRibbonProps> = ({
  onGoToStep,
  onSelectColor,
}) => {
  return (
    <section className="relative z-20 -mt-[70px] overflow-hidden" aria-label="Khám phá sắc áo, ngày hội và tư liệu">
      {/* Curved top paper wave divider overlapping hero */}
      <PaperWaveDivider className="w-full" />

      {/* Main ivory paper container - Opens immediately into 3 horizontal sections without intro block */}
      <div className="bg-[#F7EEDD] paper-texture text-[#30251F] pt-6 pb-14 px-4 sm:px-6 lg:px-[3.5vw] border-b border-[#DECFB9] relative">
        {/* Subtle decorative leaf branch ornament in bottom right */}
        <div className="absolute right-2 sm:right-6 bottom-3 pointer-events-none opacity-35 select-none hidden sm:block">
          <LeafBranchOrnament className="w-20 h-20" />
        </div>

        {/* 3 Horizontal Editorial Sections (col ratio: 1.3fr 1.2fr 0.7fr, gap 24px) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.2fr_0.7fr] gap-6 lg:gap-6 items-start max-w-7xl mx-auto">
          {/* 1. SẮC ÁO (1.3fr) */}
          <article className="space-y-0">
            <h2 className="font-serif-display text-2xl lg:text-[30px] font-normal italic text-[#30251F] leading-tight">
              Sắc áo
            </h2>

            {/* 4 Fabric Thumbnails (margin 12px below heading, height 120-145px) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-3">
              {FABRIC_SWATCHES.map((swatch) => (
                <button
                  key={swatch.colorId}
                  type="button"
                  onClick={() => {
                    onSelectColor(swatch.colorId);
                    onGoToStep(3);
                  }}
                  className="group text-left"
                  title={`Chọn lụa ${swatch.name} — chuyển sang bước phối`}
                >
                  <div className="h-[120px] sm:h-[135px] w-full rounded-xs overflow-hidden border border-[#DECFB9] group-hover:border-[#8E101A] transition-all shadow-xs relative">
                    <AtlasTile
                      atlas="editorial"
                      row={0}
                      col={swatch.col}
                      alt={`Mẫu lụa ${swatch.name}`}
                      className="w-full h-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="block text-[11px] font-medium text-[#30251F] truncate mt-1">
                    {swatch.name}
                  </span>
                </button>
              ))}
            </div>

            {/* 1 Short sentence description */}
            <p className="text-xs text-[#30251F]/75 mt-2 leading-relaxed">
              4 sắc lụa mở rộng cho ngày hội: đỏ son, mực chàm, trắng ngà và xanh ngọc.
            </p>

            {/* Action link */}
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E101A] hover:text-[#700C14] transition-colors mt-2 group"
            >
              <span>Xem bảng chọn sắc áo & phụ kiện</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </article>

          {/* 2. NGÀY HỘI VĂN HÓA (1.2fr) */}
          <article className="space-y-0">
            <h2 className="font-serif-display text-2xl lg:text-[30px] font-normal text-[#30251F] leading-tight">
              Ngày hội văn hóa
            </h2>

            {/* 3 Event Thumbnails (margin 12px below heading, height 120-145px) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mt-3">
              <div className="h-[120px] sm:h-[135px] w-full rounded-xs overflow-hidden border border-[#DECFB9] shadow-xs">
                <AtlasTile
                  atlas="editorial"
                  row={1}
                  col={0}
                  alt="Không gian sân trường ngày hội"
                  className="w-full h-full"
                />
              </div>
              <div className="h-[120px] sm:h-[135px] w-full rounded-xs overflow-hidden border border-[#DECFB9] shadow-xs">
                <AtlasTile
                  atlas="editorial"
                  row={1}
                  col={1}
                  alt="Nhóm sinh viên mặc Việt phục"
                  className="w-full h-full"
                />
              </div>
              <div className="h-[120px] sm:h-[135px] w-full rounded-xs overflow-hidden border border-[#DECFB9] shadow-xs">
                <AtlasTile
                  atlas="editorial"
                  row={1}
                  col={2}
                  alt="Hoạt động ngày hội trường"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* 1 Short sentence description */}
            <p className="text-xs text-[#30251F]/75 mt-2 leading-relaxed">
              Không gian diễu hành câu lạc bộ và chụp ảnh kỷ niệm học đường cùng áo ngũ thân.
            </p>

            {/* Action link */}
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#486657] hover:text-[#32493E] transition-colors mt-2 group"
            >
              <span>Khám phá bối cảnh ngày hội</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </article>

          {/* 3. TƯ LIỆU (0.7fr) */}
          <article className="space-y-0">
            <h2 className="font-serif-display text-2xl lg:text-[30px] font-normal text-[#30251F] leading-tight">
              Tư liệu
            </h2>

            {/* 1 Macro Thumbnail (margin 12px below heading, height 120-145px) */}
            <div className="h-[120px] sm:h-[135px] w-full rounded-xs overflow-hidden border border-[#DECFB9] shadow-xs mt-3">
              <AtlasTile
                atlas="editorial"
                row={1}
                col={3}
                alt="Minh họa AI chi tiết cúc và đường may"
                className="w-full h-full"
              />
            </div>

            {/* 1 Short sentence description */}
            <p className="text-xs text-[#30251F]/80 mt-2 leading-relaxed">
              Mô tả 1 hiện vật áo sa kép nam do Bảo tàng Lịch sử Quốc gia tiếp nhận.
            </p>

            {/* Detail action link + museum external link */}
            <div className="flex flex-col gap-1.5 mt-2 text-xs">
              <button
                type="button"
                onClick={() => onGoToStep(2)}
                className="inline-flex items-center gap-1 font-semibold text-[#8E101A] hover:underline text-left"
              >
                <span>Xem 6 dữ kiện nguồn đầy đủ</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>
              <a
                href={CULTURAL_ARTIFACT_MUSEUM.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#486657] hover:underline font-medium text-[11px]"
              >
                <span>Bài viết Bảo tàng</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
