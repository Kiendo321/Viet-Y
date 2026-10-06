import React, { useState, useRef, useEffect } from 'react';
import { Check, ArrowRight, ChevronDown, Eye, X } from 'lucide-react';
import {
  ALLOWLIST_COLORS,
  OutfitSelection,
} from '../data/catalog';
import { AtlasTile } from './AtlasTile';
import { OutfitColorPreview } from './OutfitColorPreview';

interface LookComposerPanelProps {
  selection: OutfitSelection;
  onUpdateSelection: (updater: (prev: OutfitSelection) => OutfitSelection) => void;
  onGoToStep: (step: number) => void;
  className?: string;
}

// 4 Modern Remix Robes from Catalog Atlas Row 0 (All 4 are modern remix suggestions)
const CATALOG_ROBES = [
  { col: 0 as const, colorId: 'color-do-son-tram', name: 'Đỏ son trầm' },
  { col: 1 as const, colorId: 'color-muc-cham-co', name: 'Mực chàm' },
  { col: 2 as const, colorId: 'color-trang-nga-toi-gian', name: 'Trắng ngà' },
  { col: 3 as const, colorId: 'color-xanh-ngoc-bich', name: 'Xanh ngọc' },
];

// 3 Real Accessories from Catalog Atlas Row 1 (Fan is excluded as it has no catalog ID)
const CATALOG_ACCESSORIES = [
  { col: 0 as const, id: 'acc-khan-dong-den', name: 'Khăn đóng', title: 'Khăn đóng đen truyền thống' },
  { col: 2 as const, id: 'acc-quan-trang-ong-rong', name: 'Quần trắng', title: 'Quần trắng ống rộng' },
  { col: 3 as const, id: 'acc-giay-oxford-derby', name: 'Giày da', title: 'Giày da Oxford/Derby' },
];

export const LookComposerPanel: React.FC<LookComposerPanelProps> = ({
  selection,
  onUpdateSelection,
  onGoToStep,
  className = '',
}) => {
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Focus trap, scroll lock, and cleanup focus restoration for modal dialog
  useEffect(() => {
    if (!isPreviewModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsPreviewModalOpen(false);
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      // Chỉ trả focus trong cleanup của lần modal mở
      triggerButtonRef.current?.focus();
    };
  }, [isPreviewModalOpen]);

  const currentColor =
    ALLOWLIST_COLORS.find((c) => c.id === selection.colorId) || ALLOWLIST_COLORS[0];

  const handleSelectRobeColor = (colorId: string, isRemix: boolean) => {
    onUpdateSelection((prev) => ({
      ...prev,
      colorId,
      styleId: isRemix ? 'style-remix-duong-dai' : 'style-tham-chieu-tu-lieu',
    }));
  };

  const handleToggleAccessory = (accId: string) => {
    onUpdateSelection((prev) => {
      const withoutNone = prev.accessoryIds.filter((id) => id !== 'acc-none');
      const exists = withoutNone.includes(accId);
      const next = exists
        ? withoutNone.filter((id) => id !== accId)
        : [...withoutNone, accId];
      return {
        ...prev,
        accessoryIds: next.length > 0 ? next : ['acc-none'],
      };
    });
  };

  return (
    <aside
      aria-label="Bảng phối đồ nổi Ngũ thân"
      className={`bg-[#F7EEDD]/95 border border-[#DECFB9] rounded-[10px] shadow-[0_12px_36px_-6px_rgba(48,37,31,0.12)] p-4 sm:p-5 text-[#30251F] ${className}`}
    >
      {/* Panel Header - Clean, no redundant eyebrow */}
      <div className="flex items-center justify-between border-b border-[#DECFB9]/70 pb-2.5 mb-3.5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#30251F] leading-tight">
            Ngũ thân
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-serif text-[#30251F]/70 italic block">
            {selection.styleId === 'style-tham-chieu-tu-lieu' ? 'Bám sát hiện vật' : 'Remix đương đại'}
          </span>
          <span className="inline-block px-2 py-0.5 bg-[#8E101A]/10 text-[#8E101A] rounded-xs text-[10px] font-mono font-medium">
            Áo ngũ thân nam
          </span>
        </div>
      </div>

      {/* 1. Garment 4-Thumbnail Row (Catalog Atlas Row 0) */}
      <div className="space-y-1.5 mb-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#30251F]/80">Dáng áo & sắc lụa</span>
          <span className="font-serif text-[#8E101A] font-semibold text-[11px]">
            {currentColor.name.split(' (')[0]}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {CATALOG_ROBES.map((robe) => {
            const isSelected = selection.colorId === robe.colorId;
            return (
              <button
                key={robe.colorId}
                type="button"
                onClick={() => handleSelectRobeColor(robe.colorId, true)}
                className={`group relative rounded-sm p-1 border transition-all text-left ${
                  isSelected
                    ? 'border-[#8E101A] bg-white ring-2 ring-[#8E101A]/40 shadow-xs'
                    : 'border-[#DECFB9] bg-[#FFFBF4]/80 hover:border-[#8E101A]/40'
                }`}
                title={`Chọn áo ${robe.name}`}
                aria-pressed={isSelected}
              >
                <div className="w-full aspect-square rounded-xs overflow-hidden relative">
                  <AtlasTile
                    atlas="catalog"
                    row={0}
                    col={robe.col}
                    alt={robe.name}
                    className="w-full h-full"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8E101A] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#30251F] font-medium block truncate text-center mt-1">
                  {robe.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Swatch Dots */}
      <div className="space-y-1.5 mb-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#30251F]/75">Bảng màu khám phá</span>
          <span className="text-[10px] text-[#30251F]/60 font-serif italic">
            * 1 màu nguồn, 5 gợi ý
          </span>
        </div>

        <div className="flex items-center justify-between gap-1.5 p-1.5 bg-[#FFFBF4]/90 rounded-xs border border-[#DECFB9]/60">
          {ALLOWLIST_COLORS.map((col) => {
            const isSelected = selection.colorId === col.id;
            const isSource = col.id === 'color-sa-kep-den-lot-trang';
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => handleSelectRobeColor(col.id, !isSource)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all relative flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'border-[#8E101A] scale-110 shadow-sm ring-2 ring-[#8E101A]/50'
                    : 'border-[#DECFB9] hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                title={`${col.name} ${isSource ? '(Hiện vật nguồn)' : '(Gợi ý remix)'}`}
                aria-label={`Chọn màu ${col.name}`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
              </button>
            );
          })}
        </div>

        {/* Nút nhỏ xem thử màu trực tiếp */}
        <div className="flex justify-end pt-0.5">
          <button
            ref={triggerButtonRef}
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8E101A] hover:text-[#700C14] hover:underline underline-offset-2 py-0.5 px-1 rounded-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8E101A]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem thử màu trực tiếp</span>
          </button>
        </div>
      </div>

      {/* 3. Suggested Accessories - 3 Real Catalog Accessories Only (Fan excluded) */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#30251F]/80">Phụ kiện gợi ý</span>
          <span className="text-[10px] text-[#30251F]/60">Chọn để phối cùng</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CATALOG_ACCESSORIES.map((acc) => {
            const isSelected = selection.accessoryIds.includes(acc.id);
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleToggleAccessory(acc.id)}
                className={`p-1 rounded-sm border transition-all text-left ${
                  isSelected
                    ? 'border-[#486657] bg-white ring-2 ring-[#486657]/40 shadow-xs'
                    : 'border-[#DECFB9] bg-[#FFFBF4]/80 hover:border-[#486657]/40'
                }`}
                title={acc.title}
                aria-pressed={isSelected}
              >
                <div className="w-full aspect-square rounded-xs overflow-hidden relative">
                  <AtlasTile
                    atlas="catalog"
                    row={1}
                    col={acc.col}
                    alt={acc.title}
                    className="w-full h-full"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#486657] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#30251F] font-medium block truncate text-center mt-1">
                  {acc.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={() => onGoToStep(3)}
        className="w-full min-h-[46px] py-2.5 px-4 bg-[#8E101A] hover:bg-[#700C14] text-white font-medium text-xs rounded-xs shadow-md flex items-center justify-center gap-2 transition-all group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A]"
      >
        <span>Vào phòng phối đồ với cấu hình này</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Footer Info & Compact Disclosure */}
      <div className="mt-3.5 pt-2.5 border-t border-[#DECFB9]/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#30251F]/70">
          <span className="font-mono text-[10px] text-[#8E101A] font-semibold uppercase tracking-wider bg-[#8E101A]/10 px-1.5 py-0.5 rounded-xs">
            Minh họa AI
          </span>
          <button
            type="button"
            onClick={() => setIsDisclosureOpen(!isDisclosureOpen)}
            className="inline-flex items-center gap-1 text-[11px] text-[#30251F]/70 hover:text-[#8E101A] underline underline-offset-2"
          >
            <span>Nguồn tư liệu & màu sắc</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isDisclosureOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isDisclosureOpen && (
          <div className="text-[11px] leading-relaxed text-[#30251F]/80 bg-[#FFFBF4] p-2.5 rounded-xs border border-[#DECFB9] space-y-1">
            <p>
              • <strong>Màu tham chiếu:</strong> Áo ngoài đen lót trong trắng là mô tả hiện vật cụ thể do Bảo tàng Lịch sử Quốc gia tiếp nhận.
            </p>
            <p>
              • <strong>Màu & phụ kiện remix:</strong> Đỏ son, chàm, ngà, ngọc cùng khăn đóng, quần trắng, giày da là gợi ý phối hiện đại cho sinh viên, không phải hiện vật bảo tàng.
            </p>
          </div>
        )}
      </div>

      {/* Dialog Modal xem thử màu trực tiếp */}
      {isPreviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs"
          onClick={() => setIsPreviewModalOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-color-dialog-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFBF4] border border-[#DECFB9] rounded-md shadow-2xl max-w-sm w-full p-4 sm:p-5 text-[#30251F] max-h-[92vh] overflow-y-auto space-y-3.5 focus:outline-hidden"
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between border-b border-[#DECFB9]/80 pb-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9F1D26] font-semibold block">
                  Phối màu trực quan
                </span>
                <h3 id="preview-color-dialog-title" className="font-serif font-bold text-base text-[#30251F]">
                  Xem thử màu áo trực tiếp
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#30251F]/70 hover:text-[#9F1D26] hover:bg-black/5 transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#9F1D26]"
                aria-label="Đóng bảng xem thử"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Component OutfitColorPreview */}
            <OutfitColorPreview selection={selection} compact={true} />

            {/* 6 Color Swatches inside dialog (Chỉ đổi colorId, không đổi phụ kiện) */}
            <div className="space-y-2 pt-1 border-t border-[#DECFB9]/70">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#30251F]/80">Chọn sắc áo khác</span>
                <span className="text-[10px] font-mono text-[#486657] font-semibold">
                  {currentColor.name}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2 p-2 bg-white/70 rounded-xs border border-[#DECFB9]/60">
                {ALLOWLIST_COLORS.map((col) => {
                  const isSelected = selection.colorId === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => onUpdateSelection((prev) => ({ ...prev, colorId: col.id }))}
                      className={`aspect-square rounded-full border transition-all flex items-center justify-center relative ${
                        isSelected
                          ? 'border-[#8E101A] ring-2 ring-[#8E101A]/50 scale-105 shadow-xs'
                          : 'border-[#DECFB9] hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      aria-pressed={isSelected}
                      title={col.name}
                      aria-label={`Chọn màu ${col.name}`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-[#30251F]/60 italic text-center">
                Thử màu không tốn lượt AI. Khăn tiệp tông sẽ theo màu áo; phụ kiện khác giữ nguyên.
              </p>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#DECFB9]/70">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-3 py-1.5 border border-[#DECFB9] text-[#30251F] text-xs rounded-xs hover:bg-black/5 transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  onGoToStep(3);
                }}
                className="px-3.5 py-1.5 bg-[#8E101A] hover:bg-[#700C14] text-white text-xs font-semibold rounded-xs shadow-xs transition-colors flex items-center gap-1"
              >
                <span>Sang bước 3</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
