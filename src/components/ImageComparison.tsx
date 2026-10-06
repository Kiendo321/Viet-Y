import React, { useState } from 'react';
import { Download, SlidersHorizontal, RefreshCw, Eye, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { ALLOWLIST_COLORS, CatalogItem } from '../data/catalog';

interface ImageComparisonProps {
  originalImage: string | null;
  recoloredImage: string | null;
  selectedColor: CatalogItem;
  isRecoloring: boolean;
  recolorError: string | null;
  onRecolor: (newColorId: string) => void;
  onResetRecolor: () => void;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImage,
  recoloredImage,
  selectedColor,
  isRecoloring,
  recolorError,
  onRecolor,
  onResetRecolor,
}) => {
  const [viewMode, setViewMode] = useState<'current' | 'before_after'>('current');
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');
  const [targetColorId, setTargetColorId] = useState<string>('');

  if (!originalImage) return null;

  const currentDisplayImage = recoloredImage && activeTab === 'after' ? recoloredImage : originalImage;

  const handleDownload = (imgUrl: string, suffix: string) => {
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `viet-phuc-remix-ngu-than-${suffix}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Magazine Image Frame with Permanent Label */}
      <div className="relative w-full aspect-[3/4] bg-[#203448] rounded-sm overflow-hidden border border-[#DECFB9] shadow-md">
        <img
          src={currentDisplayImage}
          alt="Minh họa AI áo ngũ thân nam"
          className="w-full h-full object-cover object-center transition-opacity duration-300"
        />

        {/* PERMANENT MANDATORY DISCLAIMER BADGE (Cannot be removed) */}
        <div className="absolute top-3 left-3 right-3 bg-[#111827]/85 backdrop-blur-sm text-white/90 px-3 py-2 text-[11px] leading-snug border-l-2 border-[#9F1D26] rounded-xs shadow-md select-none">
          <span className="font-semibold text-[#9F1D26] uppercase tracking-wider block text-[10px]">
            Lưu ý bắt buộc
          </span>
          Ảnh minh họa AI, không phải hiện vật sa kép hay tư liệu bảo tàng.
        </div>

        {/* View mode toggle button if recolor exists */}
        {recoloredImage && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center bg-[#111827]/90 text-white rounded-xs p-1 text-xs border border-white/10 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveTab('before')}
              className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                activeTab === 'before' ? 'bg-[#FFFBF4] text-[#30251F] font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              Ảnh gốc trước
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('after')}
              className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                activeTab === 'after' ? 'bg-[#9F1D26] text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              Đã đổi sắc áo
            </button>
          </div>
        )}

        {/* Download Button in image corner */}
        <button
          type="button"
          onClick={() => handleDownload(currentDisplayImage, activeTab)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#FFFBF4]/95 hover:bg-white text-[#30251F] text-xs font-semibold px-3 py-1.5 rounded-xs shadow border border-[#DECFB9] transition-all active:scale-95"
          title="Tải ảnh minh họa về thiết bị"
        >
          <Download className="w-3.5 h-3.5 text-[#9F1D26]" />
          <span>Tải ảnh</span>
        </button>
      </div>

      {/* Recolor Section: "Đổi riêng tông áo" */}
      <div className="p-4 bg-[#FFFBF4] border border-[#DECFB9] rounded-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#9F1D26]" />
            <h4 className="text-sm font-semibold font-serif text-[#30251F]">
              Đổi riêng sắc áo (AI Image Recolor)
            </h4>
          </div>
          {recoloredImage && (
            <button
              type="button"
              onClick={onResetRecolor}
              className="text-xs text-[#9F1D26] hover:underline"
            >
              Quay lại ảnh ban đầu
            </button>
          )}
        </div>

        <p className="text-xs text-[#30251F]/70 leading-relaxed">
          Biến đổi màu sắc của áo trong khi giữ lại kết cấu trang phục (tay chẽn, 5 cúc bên phải).
          <span className="block mt-0.5 text-[#9F1D26] font-medium">
            * Nếu chi tiết không giữ trọn vẹn, đây là giới hạn của công nghệ tạo ảnh AI.
          </span>
        </p>

        {/* Color Palette Selector for Recolor */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {ALLOWLIST_COLORS.map((c) => {
            const isSelectedForRecolor = c.id === targetColorId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setTargetColorId(c.id)}
                className={`relative flex flex-col items-center p-2 rounded-xs border text-left transition-all ${
                  isSelectedForRecolor
                    ? 'border-[#9F1D26] bg-[#9F1D26]/5 ring-1 ring-[#9F1D26]'
                    : 'border-[#DECFB9] bg-[#FFFBF4] hover:border-[#9F1D26]/40'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-black/20 shadow-xs mb-1.5"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[11px] font-medium text-center line-clamp-1 text-[#30251F]">
                  {c.name.split(' (')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Submit Recolor Button */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            disabled={!targetColorId || isRecoloring}
            onClick={() => targetColorId && onRecolor(targetColorId)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#9F1D26] hover:bg-[#79171E] disabled:bg-[#9F1D26]/40 text-white text-xs font-semibold rounded-xs shadow transition-colors"
          >
            {isRecoloring ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang biến đổi sắc áo...</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Thực hiện đổi màu bằng AI</span>
              </>
            )}
          </button>
        </div>

        {recolorError && (
          <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Chưa thể đổi màu lúc này</p>
              <p className="text-amber-800/90 text-[11px] mt-0.5">{recolorError}</p>
              <p className="text-[11px] text-amber-700 mt-1 italic">
                Ảnh hiện tại vẫn được bảo lưu an toàn.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
