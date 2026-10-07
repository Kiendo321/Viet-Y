import React from 'react';
import { ALLOWLIST_COLORS, OutfitSelection } from '../data/catalog';
import { OutfitFigure } from './OutfitFigure';

export interface OutfitColorPreviewProps {
  selection: OutfitSelection;
  compact?: boolean;
  className?: string;
}

/**
 * OutfitColorPreview:
 * Backward-compatible card component for landing dialog and quick preview panels.
 * Delegates visual illustration to the shared OutfitFigure vector engine.
 */
export const OutfitColorPreview: React.FC<OutfitColorPreviewProps> = ({
  selection,
  compact = false,
  className = '',
}) => {
  const selectedColor =
    ALLOWLIST_COLORS.find((c) => c.id === selection.colorId) || ALLOWLIST_COLORS[0];
  const robeHex = selectedColor.hex || '#1E232A';

  // Headwear selection
  const hasBlackTurban = selection.accessoryIds.includes('acc-khan-dong-den');
  const hasMatchingTurban = selection.accessoryIds.includes('acc-khan-phoi-dong-dieu');
  const hasBothTurbans = hasBlackTurban && hasMatchingTurban;

  const isBlackTurbanActive = hasBlackTurban;
  const headwearLabel = isBlackTurbanActive
    ? (hasBothTurbans ? 'Khăn đóng đen (ưu tiên)' : 'Khăn đóng đen (đã chọn)')
    : hasMatchingTurban
    ? 'Khăn tiệp tông áo (đã chọn)'
    : 'Không chọn khăn';

  // Trousers selection & explicit precedence rule
  const hasDarkTrousers = selection.accessoryIds.includes('acc-quan-au-toi-mau');
  const hasWhiteTrousers = selection.accessoryIds.includes('acc-quan-trang-ong-rong');
  const hasBothTrousers = hasDarkTrousers && hasWhiteTrousers;

  const isDarkTrousersActive = hasDarkTrousers;
  const isWhiteTrousersActive = hasWhiteTrousers && !hasDarkTrousers;

  const trousersLabel = isDarkTrousersActive
    ? (hasBothTrousers ? 'Quần âu tối màu (ưu tiên)' : 'Quần âu tối màu (đã chọn)')
    : isWhiteTrousersActive
    ? 'Quần trắng ống rộng (đã chọn)'
    : 'Quần trắng (nền minh họa)';

  // Shoes selection & precedence
  const hasLeatherShoes = selection.accessoryIds.includes('acc-giay-oxford-derby');
  const hasClogs = selection.accessoryIds.includes('acc-guoc-moc-truyen-thong');
  const hasBothShoes = hasLeatherShoes && hasClogs;
  const isLeatherActive = hasLeatherShoes;

  const shoesLabel = isLeatherActive
    ? (hasBothShoes ? 'Giày da Oxford/Derby (ưu tiên)' : 'Giày da (đã chọn)')
    : hasClogs
    ? 'Guốc mộc (đã chọn)'
    : 'Giày tối (nền minh họa)';

  return (
    <div
      className={`bg-[#FFFBF4] border border-[#DECFB9] rounded-sm p-4 sm:p-5 flex flex-col justify-between select-none shadow-xs text-[#30251F] ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#DECFB9]/70 pb-2.5 mb-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9F1D26] font-semibold block">
            Xem thử màu áo
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
              style={{ backgroundColor: robeHex }}
              aria-hidden="true"
            />
            <h4 className="font-serif font-bold text-sm text-[#30251F]">
              {selectedColor.name}
            </h4>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#486657]/10 text-[#486657] font-medium shrink-0">
          Thử màu trực tiếp
        </span>
      </div>

      {/* SVG Canvas delegating to reusable OutfitFigure */}
      <div className="relative w-full flex items-center justify-center py-1">
        <div className={`w-full ${compact ? 'max-h-[260px]' : 'max-h-[330px]'} flex justify-center`}>
          <OutfitFigure selection={selection} viewMode="full" className="w-full h-auto" />
        </div>
      </div>

      {/* Footer Notes & Precedence Notice */}
      <div className="pt-2.5 border-t border-[#DECFB9]/70 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-[#30251F]/80">
          <span className="truncate pr-2">
            {trousersLabel} · {headwearLabel}
          </span>
          <span className="font-mono text-[10px] text-[#486657] font-semibold shrink-0">
            {selectedColor.hex}
          </span>
        </div>

        <div className="text-[10px] text-[#30251F]/70">
          <span>{shoesLabel}</span>
        </div>

        {hasBothTrousers && (
          <p className="text-[10px] text-[#9F1D26] italic">
            * Chọn cả 2 loại quần: Ưu tiên hiển thị Quần âu tối màu
          </p>
        )}

        {hasBothTurbans && (
          <p className="text-[10px] text-[#9F1D26] italic">
            * Chọn cả 2 loại khăn: Ưu tiên hiển thị Khăn đóng đen
          </p>
        )}

        <p className="text-[10px] text-[#30251F]/65 italic text-center pt-0.5 font-serif">
          Bản minh họa phối màu · Phom áo chưa đối chiếu hiện vật
        </p>
      </div>
    </div>
  );
};
