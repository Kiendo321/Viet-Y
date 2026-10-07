import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Palette,
  Layers,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  Bookmark,
  Eye,
  PanelRight,
  X,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  OCCASION_DATA,
  ALLOWLIST_GARMENTS,
  ALLOWLIST_COLORS,
  ALLOWLIST_ACCESSORIES,
  ALLOWLIST_STYLES,
  OutfitSelection,
} from '../data/catalog';
import { OutfitFigure } from './OutfitFigure';
import { AccessoryThumbnail } from './AccessoryThumbnail';
import { LeafBranchOrnament } from './HeritageOrnaments';

interface Step3WorkbenchProps {
  selection: OutfitSelection;
  onUpdateSelection: (updater: (prev: OutfitSelection) => OutfitSelection) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSaveOutfit?: () => void;
}

// Short display names for the 6 allowlist colors
const COLOR_SHORT_NAMES: Record<string, string> = {
  'color-sa-kep-den-lot-trang': 'Đen',
  'color-muc-cham-co': 'Chàm',
  'color-xanh-ngoc-bich': 'Ngọc',
  'color-do-son-tram': 'Đỏ son',
  'color-vang-hoang-cuc': 'Vàng',
  'color-trang-nga-toi-gian': 'Ngà',
};

// Accessory groups for mutually exclusive behavior
const HEADWEAR_IDS = ['acc-khan-dong-den', 'acc-khan-phoi-dong-dieu'];
const TROUSER_IDS = ['acc-quan-trang-ong-rong', 'acc-quan-au-toi-mau'];
const FOOTWEAR_IDS = ['acc-giay-oxford-derby', 'acc-guoc-moc-truyen-thong'];

export const Step3Workbench: React.FC<Step3WorkbenchProps> = ({
  selection,
  onUpdateSelection,
  onPrevStep,
  onNextStep,
  onSaveOutfit,
}) => {
  // Detail rail toggle (default open on wide screens)
  const [isDetailRailOpen, setIsDetailRailOpen] = useState<boolean>(() =>
    typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 1280px)').matches : true
  );

  // Zoom modal state & accessible focus refs
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const zoomTriggerRef = useRef<HTMLButtonElement | null>(null);
  const zoomDialogRef = useRef<HTMLDivElement | null>(null);
  const zoomCloseRef = useRef<HTMLButtonElement | null>(null);

  // Source accordion toggle
  const [isSourceAccordionOpen, setIsSourceAccordionOpen] = useState<boolean>(false);

  // Save feedback toast
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Focus management & Escape key handling for Zoom modal
  useEffect(() => {
    if (!isZoomOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    zoomCloseRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsZoomOpen(false);
        return;
      }

      if (e.key === 'Tab' && zoomDialogRef.current) {
        const focusables = zoomDialogRef.current.querySelectorAll<HTMLElement>(
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
      zoomTriggerRef.current?.focus();
    };
  }, [isZoomOpen]);

  const currentColor =
    ALLOWLIST_COLORS.find((c) => c.id === selection.colorId) || ALLOWLIST_COLORS[0];
  const currentGarment =
    ALLOWLIST_GARMENTS.find((g) => g.id === selection.garmentId) || ALLOWLIST_GARMENTS[0];

  // Accessory state calculations
  const hasBlackTurban = selection.accessoryIds.includes('acc-khan-dong-den');
  const hasMatchingTurban = selection.accessoryIds.includes('acc-khan-phoi-dong-dieu');
  const hasWhiteTrousers = selection.accessoryIds.includes('acc-quan-trang-ong-rong');
  const hasDarkTrousers = selection.accessoryIds.includes('acc-quan-au-toi-mau');
  const hasLeatherShoes = selection.accessoryIds.includes('acc-giay-oxford-derby');
  const hasClogs = selection.accessoryIds.includes('acc-guoc-moc-truyen-thong');

  // Strip labels
  const headwearStripLabel = hasBlackTurban
    ? 'Khăn đóng đen'
    : hasMatchingTurban
    ? 'Khăn tiệp tông áo'
    : 'Không chọn khăn';

  const trousersStripLabel = hasDarkTrousers
    ? 'Quần âu tối màu'
    : hasWhiteTrousers
    ? 'Quần trắng ống rộng'
    : 'Quần trắng (nền minh họa)';

  const shoesStripLabel = hasLeatherShoes
    ? 'Giày da Oxford/Derby'
    : hasClogs
    ? 'Guốc mộc'
    : 'Giày tối (nền minh họa)';

  // Mutually exclusive accessory toggle handler
  const handleToggleAccessory = (accId: string) => {
    onUpdateSelection((prev) => {
      if (accId === 'acc-none') {
        return { ...prev, accessoryIds: ['acc-none'] };
      }

      // Determine which group this accessory belongs to
      let groupIds: string[] = [];
      if (HEADWEAR_IDS.includes(accId)) groupIds = HEADWEAR_IDS;
      else if (TROUSER_IDS.includes(accId)) groupIds = TROUSER_IDS;
      else if (FOOTWEAR_IDS.includes(accId)) groupIds = FOOTWEAR_IDS;

      // Remove acc-none and any other item in the same mutually exclusive group
      const filtered = prev.accessoryIds.filter((id) => id !== 'acc-none' && !groupIds.includes(id));
      const wasAlreadySelected = prev.accessoryIds.includes(accId);

      const next = wasAlreadySelected
        ? filtered // Unchecked
        : [...filtered, accId]; // Selected, replacing any peer in the same group

      return {
        ...prev,
        accessoryIds: next.length > 0 ? next : ['acc-none'],
      };
    });
  };

  // Reset step 3 choices to default
  const handleResetStep3 = () => {
    onUpdateSelection((prev) => ({
      ...prev,
      colorId: ALLOWLIST_COLORS[0].id, // Sa kép ngoài đen lót trắng
      styleId: ALLOWLIST_STYLES[0].id, // Tham chiếu tư liệu
      accessoryIds: [ALLOWLIST_ACCESSORIES[1].id], // Khăn đóng đen
    }));
  };

  // Save outfit trigger
  const handleSaveCurrent = () => {
    if (onSaveOutfit) {
      onSaveOutfit();
    }
    setSaveToast('Đã lưu cấu hình bản phối vào bộ sưu tập!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <section className="styling-workbench space-y-5">
      <style>{`
        .styling-workbench .workbench-paper {
          background: radial-gradient(ellipse at 45% 35%, #fffdf8 0%, #f7eddc 70%, #efe0c7 100%);
        }
        .styling-workbench .workbench-stage { grid-template-columns: minmax(0, 1fr); }
        .styling-workbench .workbench-details { border-top: 1px solid #decfb9; padding-top: 16px; }
        .styling-workbench .workbench-inspector h4 { font-size: 14px; }
        .styling-workbench .workbench-inspector button { min-height: 44px; }
        .styling-workbench .workbench-inspector textarea { font-size: 14px; }
        .styling-workbench .workbench-details p { font-size: 11px; line-height: 1.5; }
        .styling-workbench .workbench-details > div:first-child { grid-column: 1 / -1; }
        @media (min-width: 640px) and (max-width: 1279px) {
          .styling-workbench .workbench-details { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        }
        @media (min-width: 1024px) {
          .styling-workbench .workbench-columns { grid-template-columns: 310px minmax(0, 1fr); }
          .styling-workbench .workbench-preview { position: sticky; top: 142px; }
        }
        @media (min-width: 1280px) {
          .styling-workbench .workbench-columns { grid-template-columns: 330px minmax(0, 1fr); gap: 28px; }
          .styling-workbench .workbench-stage.details-open { grid-template-columns: minmax(0, 1fr) 190px; }
          .styling-workbench .workbench-details { border-top: 0; border-left: 1px solid #decfb9; padding-top: 0; padding-left: 16px; }
        }
        @media (max-width: 1023px) {
          .styling-workbench .workbench-preview { grid-row: 1; }
          .styling-workbench .workbench-figure { max-width: 230px; }
        }
      `}</style>
      {/* Step 3 Header */}
      <div className="border-b border-[#DECFB9] pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#9F1D26] font-semibold block">
            Bước 3 / 6 · Xưởng phối đồ Việt phục
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30251F] mt-0.5">
            Sắc áo, phụ kiện & phong cách
          </h2>
          <p className="text-xs text-[#30251F]/70 mt-1 max-w-2xl">
            Chọn sắc áo và phụ kiện. Xem bộ phối thay đổi ngay bên cạnh.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#486657]/10 text-[#486657] font-semibold border border-[#486657]/20">
            Thử màu trực tiếp
          </span>
        </div>
      </div>

      {/* Main Full-Width Editorial Workbench */}
      <div className="workbench-columns grid items-start gap-5">
        {/* ========================================================
            LEFT INSPECTOR (About 320-360px)
           ======================================================== */}
        <aside
          aria-label="Bảng điều khiển thông số trang phục"
          className="workbench-inspector w-full min-w-0 bg-[#FFFBF4]/70 border border-[#DECFB9] rounded-sm p-4 space-y-4"
        >
          {/* 1. Labeled Occasion & Garment (Only one supported choice, no fake dropdowns) */}
          <div className="space-y-3 pb-3 border-b border-[#DECFB9]/70">
            {/* Occasion display */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-[10px] text-[#9F1D26] uppercase font-semibold">
                  Dịp mặc
                </span>
                <span className="text-[10px] text-[#486657] font-medium bg-[#486657]/10 px-1.5 py-0.2 rounded-2xs">
                  Ngày hội sinh viên
                </span>
              </div>
              <div className="p-2.5 bg-white/70 border border-[#DECFB9]/60 rounded-xs">
                <h4 className="font-serif font-bold text-xs text-[#30251F]">
                  {OCCASION_DATA.name}
                </h4>
                <p className="text-[11px] text-[#30251F]/70 mt-0.5 leading-snug">
                  {OCCASION_DATA.subTitle}
                </p>
              </div>
            </div>

            {/* Garment display */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-[10px] text-[#9F1D26] uppercase font-semibold">
                  Trang phục chính
                </span>
                <span className="text-[10px] text-[#486657] font-medium bg-[#486657]/10 px-1.5 py-0.2 rounded-2xs">
                  1 hiện vật nguồn
                </span>
              </div>
              <div className="p-2.5 bg-white/70 border border-[#DECFB9]/60 rounded-xs">
                <h4 className="font-serif font-bold text-xs text-[#30251F] leading-snug">
                  {currentGarment.name}
                </h4>
                <p className="text-[11px] text-[#30251F]/70 mt-0.5 leading-snug">
                  Áo ngũ thân nam · Tham chiếu hiện vật bảo tàng
                </p>
              </div>
            </div>
          </div>

          {/* 2. Compact Two-Way Style Switch */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#9F1D26]" />
                <span className="font-serif font-bold text-xs text-[#30251F]">Định hướng phong cách</span>
              </div>
              <span className="text-[10px] text-[#30251F]/60 italic font-serif">2 lựa chọn</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F5EFE3] rounded-xs border border-[#DECFB9]/80">
              {ALLOWLIST_STYLES.map((st) => {
                const isSelected = selection.styleId === st.id;
                const shortLabel = st.id === 'style-tham-chieu-tu-lieu' ? 'Tư liệu' : 'Remix';
                return (
                  <button
                    key={st.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={st.name}
                    onClick={() => onUpdateSelection((prev) => ({ ...prev, styleId: st.id }))}
                    className={`py-2 px-2 text-center rounded-2xs transition-all text-xs ${
                      isSelected
                        ? 'bg-[#9F1D26] text-white font-semibold shadow-xs'
                        : 'text-[#30251F]/80 hover:bg-white/60 font-medium'
                    }`}
                  >
                    <span className="block text-xs">{shortLabel}</span>
                    <span className={`block text-[9px] truncate ${isSelected ? 'text-white/80' : 'text-[#30251F]/55'}`}>
                      {st.id === 'style-tham-chieu-tu-lieu' ? 'Bám sát nguồn' : 'Đương đại'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. SIX Round Fabric Swatches with Short Names */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#9F1D26]" />
                <span className="font-serif font-bold text-xs text-[#30251F]">Sắc áo</span>
              </div>
              <span className="sr-only">
                {currentColor.hex}
              </span>
            </div>

            {/* Concise selected-color live label identifying source vs modern remix */}
            <div
              aria-live="polite"
              className="p-2 bg-white/70 border border-[#DECFB9]/60 rounded-xs text-[11px] flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] text-[#30251F]/60 block">Đang chọn:</span>
                <span className="font-serif font-bold text-[#30251F]">{currentColor.name.split(' (')[0]}</span>
              </div>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-2xs font-semibold ${
                  currentColor.isSourceFact
                    ? 'bg-[#486657]/15 text-[#486657]'
                    : 'bg-[#9F1D26]/10 text-[#9F1D26]'
                }`}
              >
                {currentColor.isSourceFact ? 'Màu hiện vật nguồn' : 'Gợi ý phối hiện đại'}
              </span>
            </div>

            {/* 6 Fabric Swatch Circles */}
            <div className="grid grid-cols-6 gap-2 pt-1">
              {ALLOWLIST_COLORS.map((col) => {
                const isSelected = selection.colorId === col.id;
                const shortName = COLOR_SHORT_NAMES[col.id] || col.name.slice(0, 4);
                return (
                  <button
                    key={col.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={col.name}
                    title={col.name}
                    onClick={() => onUpdateSelection((prev) => ({ ...prev, colorId: col.id }))}
                    className="min-h-[56px] flex flex-col items-center gap-1.5 group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9F1D26]"
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all relative flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#9F1D26] ring-2 ring-[#9F1D26]/40 scale-105 shadow-sm'
                          : 'border-[#DECFB9] group-hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex, backgroundImage: "linear-gradient(125deg, #ffffff28, transparent 45%, #00000028), repeating-linear-gradient(45deg, transparent 0 2px, #ffffff0a 2px 3px)" }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
                    </div>
                    <span
                      className={`text-[10px] font-medium leading-none ${
                        isSelected ? 'text-[#9F1D26] font-bold' : 'text-[#30251F]/70'
                      }`}
                    >
                      {shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Accessory Tiles with Bespoke Thumbnails & Mutually Exclusive Behavior */}
          <div className="space-y-3 pt-2 border-t border-[#DECFB9]/70">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#9F1D26]" />
                <span className="font-serif font-bold text-xs text-[#30251F]">Phụ kiện phối kèm</span>
              </div>
              <span className="text-[10px] text-[#30251F]/60 italic font-serif">Chọn theo nhóm</span>
            </div>

            {/* Group A: Headwear */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#30251F]/70 uppercase tracking-wider block font-semibold">
                Khăn đội đầu (Chọn 1 trong 2)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[ALLOWLIST_ACCESSORIES[1], ALLOWLIST_ACCESSORIES[2]].map((acc) => {
                  const isSelected = selection.accessoryIds.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={acc.name}
                      onClick={() => handleToggleAccessory(acc.id)}
                      className={`p-2 rounded-xs border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-white border-[#486657] ring-1 ring-[#486657] shadow-xs'
                          : 'bg-[#FFFBF4]/80 border-[#DECFB9] hover:border-[#486657]/40'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xs overflow-hidden shrink-0 border border-black/10">
                        <AccessoryThumbnail
                          accessoryId={acc.id}
                          robeHex={currentColor.hex}
                          selected={isSelected}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-[#30251F] block leading-snug">
                          {acc.id === 'acc-khan-dong-den' ? 'Khăn đen' : 'Khăn đồng điệu'}
                        </span>
                        <span className="text-[11px] text-[#30251F]/60 block leading-snug">
                          {acc.id === 'acc-khan-dong-den' ? 'Khăn đóng truyền thống' : 'Tiệp sắc áo'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group B: Trousers */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#30251F]/70 uppercase tracking-wider block font-semibold">
                Quần suông (Chọn 1 trong 2)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[ALLOWLIST_ACCESSORIES[3], ALLOWLIST_ACCESSORIES[4]].map((acc) => {
                  const isSelected = selection.accessoryIds.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={acc.name}
                      onClick={() => handleToggleAccessory(acc.id)}
                      className={`p-2 rounded-xs border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-white border-[#486657] ring-1 ring-[#486657] shadow-xs'
                          : 'bg-[#FFFBF4]/80 border-[#DECFB9] hover:border-[#486657]/40'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xs overflow-hidden shrink-0 border border-black/10">
                        <AccessoryThumbnail
                          accessoryId={acc.id}
                          robeHex={currentColor.hex}
                          selected={isSelected}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-[#30251F] block leading-snug">
                          {acc.id === 'acc-quan-trang-ong-rong' ? 'Quần trắng' : 'Quần âu tối'}
                        </span>
                        <span className="text-[11px] text-[#30251F]/60 block leading-snug">
                          {acc.id === 'acc-quan-trang-ong-rong' ? 'Ống rộng' : 'Âu phục đương đại'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group C: Footwear */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#30251F]/70 uppercase tracking-wider block font-semibold">
                Giày dép (Chọn 1 trong 2)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[ALLOWLIST_ACCESSORIES[5], ALLOWLIST_ACCESSORIES[6]].map((acc) => {
                  const isSelected = selection.accessoryIds.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={acc.name}
                      onClick={() => handleToggleAccessory(acc.id)}
                      className={`p-2 rounded-xs border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-white border-[#486657] ring-1 ring-[#486657] shadow-xs'
                          : 'bg-[#FFFBF4]/80 border-[#DECFB9] hover:border-[#486657]/40'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xs overflow-hidden shrink-0 border border-black/10">
                        <AccessoryThumbnail
                          accessoryId={acc.id}
                          robeHex={currentColor.hex}
                          selected={isSelected}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-[#30251F] block leading-snug">
                          {acc.id === 'acc-giay-oxford-derby' ? 'Giày da' : 'Guốc mộc'}
                        </span>
                        <span className="text-[11px] text-[#30251F]/60 block leading-snug">
                          {acc.id === 'acc-giay-oxford-derby' ? 'Oxford / Derby' : 'Gợi ý phối'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group D: None option */}
            <div className="pt-1">
              {(() => {
                const acc = ALLOWLIST_ACCESSORIES[0]; // acc-none
                const isSelected = selection.accessoryIds.includes(acc.id);
                return (
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={acc.name}
                    onClick={() => handleToggleAccessory('acc-none')}
                    className={`w-full p-2 rounded-xs border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-white border-[#9F1D26] ring-1 ring-[#9F1D26] shadow-xs'
                        : 'bg-[#FFFBF4]/60 border-[#DECFB9] hover:border-[#9F1D26]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-2xs overflow-hidden shrink-0">
                        <AccessoryThumbnail accessoryId="acc-none" />
                      </div>
                      <span className="text-[11px] font-serif font-semibold text-[#30251F]">
                        Tối giản: Không phụ kiện
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#9F1D26]" />}
                  </button>
                );
              })()}
            </div>
          </div>

          {/* 5. User Note Textarea */}
          <div className="space-y-1.5 pt-2 border-t border-[#DECFB9]/70">
            <label htmlFor="user-outfit-note" className="block text-xs font-serif font-bold text-[#30251F]">
              Ghi chú phối đồ cá nhân (Tùy chọn)
            </label>
            <textarea
              id="user-outfit-note"
              rows={2}
              value={selection.userNote || ''}
              onChange={(e) => onUpdateSelection((prev) => ({ ...prev, userNote: e.target.value }))}
              placeholder="Ví dụ: Dự định mặc trong lễ khai mạc ngày hội, đi cùng cặp kính kim loại..."
              className="w-full text-xs p-2.5 rounded-xs border border-[#DECFB9] bg-white text-[#30251F] placeholder:text-[#30251F]/40 focus:border-[#9F1D26] focus:outline-hidden focus:ring-1 focus:ring-[#9F1D26] transition-all resize-none"
            />
          </div>

          {/* 6. Navigation Buttons */}
          <div className="pt-3 border-t border-[#DECFB9] flex flex-col gap-2">
            <button
              type="button"
              onClick={onNextStep}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 bg-[#9F1D26] hover:bg-[#79171E] text-white text-xs font-semibold rounded-xs shadow transition-all"
            >
              <span>Sang bước 4: Gợi ý từ Gemini</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onPrevStep}
              className="w-full min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#DECFB9] text-[#30251F] text-xs font-semibold rounded-xs hover:bg-white/80 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại bước 2: Hiện vật nguồn</span>
            </button>
          </div>
        </aside>

        {/* ========================================================
            RIGHT STAGE: C1 DOMINATES (Warm Studio Paper Stage)
           ======================================================== */}
        <section
          aria-label="Sân khấu trực quan hóa bản phối trang phục"
          className="workbench-preview min-w-0 w-full space-y-4"
        >
          {/* Main Stage Card */}
          <div className="workbench-paper border border-[#DECFB9] rounded-sm p-4 sm:p-6 shadow-xs relative overflow-hidden">
            {/* Subtle botanical line accent at corners */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-[#C5A880]/40 pointer-events-none" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-[#C5A880]/40 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-[#C5A880]/40 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-[#C5A880]/40 pointer-events-none" />

            {/* Stage Header & Actions Toolbar */}
            <div className="flex flex-col gap-3 pb-4 border-b border-[#DECFB9]/70">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9F1D26] font-semibold block">
                  Bản phối của bạn
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                    style={{ backgroundColor: currentColor.hex }}
                    aria-hidden="true"
                  />
                  <h3 className="font-serif font-bold text-lg text-[#30251F]">
                    Áo ngũ thân nam · {COLOR_SHORT_NAMES[currentColor.id]}
                  </h3>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                {/* Phóng to dialog button */}
                <button
                  ref={zoomTriggerRef}
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="min-h-[44px] px-2.5 py-1 text-xs border border-[#DECFB9] bg-white/80 hover:bg-white text-[#30251F] font-medium rounded-xs flex items-center gap-1.5 shadow-2xs transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#9F1D26]"
                  title="Phóng to bản vẽ minh họa"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#9F1D26]" />
                  <span>Phóng to</span>
                </button>

                {/* Xem chi tiết áo disclosure button */}
                <button
                  type="button"
                  aria-expanded={isDetailRailOpen}
                  onClick={() => setIsDetailRailOpen((prev) => !prev)}
                  className={`min-h-[44px] px-2.5 py-1 text-xs border rounded-xs flex items-center gap-1.5 shadow-2xs transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#9F1D26] ${
                    isDetailRailOpen
                      ? 'bg-[#486657] text-white border-[#486657] font-semibold'
                      : 'bg-white/80 border-[#DECFB9] text-[#30251F] hover:bg-white font-medium'
                  }`}
                  title="Đóng / mở cột xem chi tiết cổ áo & cúc áo"
                >
                  <PanelRight className="w-3.5 h-3.5" />
                  <span>{isDetailRailOpen ? 'Ẩn chi tiết' : 'Xem chi tiết áo'}</span>
                </button>

                {/* Đặt lại button */}
                <button
                  type="button"
                  onClick={handleResetStep3}
                  className="min-h-[44px] px-2.5 py-1 text-xs border border-[#DECFB9] bg-white/80 hover:bg-white text-[#30251F] font-medium rounded-xs flex items-center gap-1.5 shadow-2xs transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#9F1D26]"
                  title="Đặt lại các lựa chọn bước 3 về mặc định"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#30251F]/70" />
                  <span>Đặt lại</span>
                </button>

                {/* Lưu bản phối button */}
                <button
                  type="button"
                  onClick={handleSaveCurrent}
                  className="min-h-[44px] px-3 py-1 text-xs bg-[#8E101A] hover:bg-[#700C14] text-white font-semibold rounded-xs flex items-center gap-1.5 shadow-2xs transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#8E101A]"
                  title="Lưu bản phối này vào danh sách"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Lưu bản phối</span>
                </button>
              </div>
            </div>

            {/* Toast feedback */}
            {saveToast && (
              <div role="status" className="mt-2 p-2 bg-[#486657]/10 border border-[#486657]/30 text-[#486657] text-xs font-semibold rounded-xs flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{saveToast}</span>
              </div>
            )}

            {/* Main Stage Illustration & Detail Rail Row */}
            <div className={`workbench-stage grid gap-5 py-4 ${isDetailRailOpen ? "details-open" : ""}`}>
              {/* Full Fashion Illustration Artwork */}
              <div className="w-full min-w-0 flex-1 flex flex-col items-center justify-center relative rounded-sm bg-[#eadbc3]/25 border border-[#decfb9]/50 overflow-hidden">
                <div aria-hidden="true" className="absolute inset-y-5 left-4 w-10 border-x border-[#b18c52]/20 pointer-events-none" />
                <LeafBranchOrnament className="absolute bottom-8 left-0 w-36 h-64 opacity-15 pointer-events-none" />
                <LeafBranchOrnament flip className="absolute top-6 right-0 w-24 h-44 opacity-10 pointer-events-none" />
                <div className="workbench-figure relative w-full max-w-[300px]">
                  <OutfitFigure selection={selection} viewMode="full" className="w-full h-auto" />
                </div>
                <p className="relative text-[11px] text-[#30251F]/65 italic text-center mt-1 mb-4 px-3 font-serif">
                  Bản minh họa phối màu · Phom áo chưa đối chiếu hiện vật
                </p>
              </div>

              {/* Detail Rail C2 (Collapsible on wide screens) */}
              {isDetailRailOpen && (
                <div className="workbench-details w-full min-w-0 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-[#DECFB9]/70 pb-1.5">
                    <span className="font-mono text-[10px] text-[#9F1D26] uppercase font-semibold">
                      Chi tiết áo
                    </span>
                    <span className="text-[9px] text-[#486657] font-medium">Minh họa</span>
                  </div>

                  {/* 1. Close-up Collar & Inner Lining Peek */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-serif font-bold text-[#30251F]">Cổ áo & lớp lót</span>
                    </div>
                    <div className="w-full h-28 bg-[#FFFBF4] rounded-xs border border-[#DECFB9]/70 overflow-hidden flex items-center justify-center">
                      <OutfitFigure selection={selection} viewMode="collar-detail" className="w-full h-full" showShadow={false} />
                    </div>
                    <p className="text-[10px] text-[#30251F]/65 leading-tight">
                      Cận cảnh cổ áo trong bản minh họa.
                    </p>
                  </div>

                  {/* 2. Close-up 5 Round Fasteners on Right Lapel */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-serif font-bold text-[#30251F]">Hàng khuy</span>
                    </div>
                    <div className="w-full h-32 bg-[#FFFBF4] rounded-xs border border-[#DECFB9]/70 overflow-hidden flex items-center justify-center">
                      <OutfitFigure selection={selection} viewMode="fasteners-detail" className="w-full h-full" showShadow={false} />
                    </div>
                    <p className="text-[10px] text-[#30251F]/65 leading-tight">
                      Hiện vật nguồn có 5 cúc dọc vạt phải, từ cổ đến eo.
                    </p>
                  </div>

                  {/* 3. Woven Silk Texture Preview */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-serif font-bold text-[#30251F]">Sắc vải</span>
                      <span className="text-[9px] font-mono text-[#30251F]/50">{currentColor.hex}</span>
                    </div>
                    <div className="w-full h-16 rounded-xs overflow-hidden">
                      <OutfitFigure selection={selection} viewMode="fabric-swatch" className="w-full h-full" />
                    </div>
                    <p className="text-[10px] text-[#30251F]/65 leading-tight italic">
                      Mô phỏng sắc màu, không phải mẫu vải hiện vật.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Accessory Strip under Main Stage */}
            <div className="mt-4 pt-3 border-t border-[#DECFB9]/70">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#30251F]/65 block mb-2 font-semibold">
                Bộ phối hiện tại
              </span>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                {/* Item 1: Áo */}
                <div className="p-2 bg-white/70 border border-[#DECFB9]/70 rounded-xs flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-2xs"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] text-[#30251F]/60 block font-mono">Thân áo</span>
                    <span className="text-xs font-semibold text-[#30251F] block leading-snug">
                      {currentColor.name.split(' (')[0]}
                    </span>
                  </div>
                </div>

                {/* Item 2: Khăn */}
                <div className="p-2 bg-white/70 border border-[#DECFB9]/70 rounded-xs flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xs overflow-hidden shrink-0 border border-black/10">
                    <AccessoryThumbnail
                      accessoryId={hasBlackTurban ? 'acc-khan-dong-den' : hasMatchingTurban ? 'acc-khan-phoi-dong-dieu' : 'acc-none'}
                      robeHex={currentColor.hex}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-[#30251F]/60 block font-mono">Khăn đội</span>
                    <span className="text-xs font-semibold text-[#30251F] block leading-snug">
                      {headwearStripLabel}
                    </span>
                  </div>
                </div>

                {/* Item 3: Quần */}
                <div className="p-2 bg-white/70 border border-[#DECFB9]/70 rounded-xs flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xs overflow-hidden shrink-0 border border-black/10">
                    <AccessoryThumbnail
                      accessoryId={hasDarkTrousers ? 'acc-quan-au-toi-mau' : 'acc-quan-trang-ong-rong'}
                      robeHex={currentColor.hex}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-[#30251F]/60 block font-mono">Quần suông</span>
                    <span className="text-xs font-semibold text-[#30251F] block leading-snug">
                      {trousersStripLabel}
                    </span>
                  </div>
                </div>

                {/* Item 4: Giày */}
                <div className="p-2 bg-white/70 border border-[#DECFB9]/70 rounded-xs flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xs overflow-hidden shrink-0 border border-black/10">
                    <AccessoryThumbnail
                      accessoryId={hasClogs && !hasLeatherShoes ? 'acc-guoc-moc-truyen-thong' : 'acc-giay-oxford-derby'}
                      robeHex={currentColor.hex}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-[#30251F]/60 block font-mono">Giày dép</span>
                    <span className="text-xs font-semibold text-[#30251F] block leading-snug">
                      {shoesStripLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Source Accordion: Tư liệu & phối hiện đại */}
          <div className="bg-[#FFFBF4] border border-[#DECFB9] rounded-sm p-4 text-xs space-y-2">
            <button
              type="button"
              aria-expanded={isSourceAccordionOpen}
              onClick={() => setIsSourceAccordionOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-left font-serif font-bold text-sm text-[#30251F] hover:text-[#9F1D26] transition-colors"
            >
              <span>Tư liệu & phối hiện đại</span>
              <ChevronDown
                className={`w-4 h-4 text-[#30251F]/60 transition-transform ${
                  isSourceAccordionOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isSourceAccordionOpen && (
              <div className="pt-2 border-t border-[#DECFB9]/60 text-[11px] text-[#30251F]/80 space-y-2 leading-relaxed animate-in fade-in">
                <p>
                  • <strong>Nguồn khảo cứu hiện vật gốc:</strong> Bài viết tiếp nhận hiện vật của Bảo tàng Lịch sử Quốc gia:
                  <a
                    href="https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#486657] hover:underline font-semibold ml-1"
                  >
                    <span>Xem bài viết bảo tàng</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                <p>
                  • <strong>Duy nhất một hiện vật nguồn:</strong> Nguồn bài viết chỉ ghi nhận chiếc áo ngũ thân sa kép nam may bằng lụa La Khê (ngoài đen lót trong trắng). Các màu sắc (chàm, ngọc, đỏ son, vàng, ngà) và phụ kiện (khăn, quần, giày) là gợi ý phối hiện đại mở rộng dành cho sinh viên tham gia ngày hội, không phải hiện vật được bảo tàng chứng thực.
                </p>
                <p>
                  • <strong>Giới hạn hình minh họa:</strong> Bộ phối giúp xem màu sắc và phụ kiện; chưa mô phỏng chất liệu, độ vừa vặn hay phom áo theo hiện vật.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ========================================================
          ZOOM MODAL DIALOG (High-Res Figure Display with Focus Trap)
         ======================================================== */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-2xs animate-in fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            ref={zoomDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Phóng to minh họa bản phối"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFBF4] border border-[#DECFB9] rounded-md shadow-2xl max-w-lg w-full p-4 sm:p-6 text-[#30251F] max-h-[92vh] overflow-y-auto space-y-4 focus:outline-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#DECFB9]/80 pb-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9F1D26] font-semibold block">
                  Phóng to minh họa
                </span>
                <h3 id="zoom-figure-title" className="font-serif font-bold text-lg text-[#30251F]">
                  Áo ngũ thân nam · {COLOR_SHORT_NAMES[currentColor.id]}
                </h3>
              </div>
              <button
                ref={zoomCloseRef}
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#30251F]/70 hover:text-[#9F1D26] hover:bg-black/5 transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#9F1D26]"
                aria-label="Đóng phóng to"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Figure Illustration */}
            <div className="w-full flex items-center justify-center py-2 bg-[#FDFBF7] rounded-xs border border-[#DECFB9]/60">
              <div className="w-full max-w-[280px] sm:max-w-[340px]">
                <OutfitFigure selection={selection} viewMode="full" className="w-full h-auto" idSuffix="modal" />
              </div>
            </div>

            {/* Modal Metadata Footer */}
            <div className="space-y-1.5 text-xs text-[#30251F]/80 border-t border-[#DECFB9]/70 pt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span>Phối khăn: <strong>{headwearStripLabel}</strong></span>
                <span className="font-mono text-[#486657] font-semibold">{currentColor.hex}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Quần: <strong>{trousersStripLabel}</strong></span>
                <span>Giày: <strong>{shoesStripLabel}</strong></span>
              </div>
              <p className="text-[10px] text-[#30251F]/60 italic text-center pt-1 font-serif">
                Bản minh họa phối màu · Phom áo chưa đối chiếu hiện vật
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2 border-t border-[#DECFB9]/70">
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="px-4 py-2 bg-[#9F1D26] hover:bg-[#79171E] text-white text-xs font-semibold rounded-xs shadow-xs transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

