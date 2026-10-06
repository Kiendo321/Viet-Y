import React, { useId } from 'react';
import { ALLOWLIST_COLORS, OutfitSelection } from '../data/catalog';

interface OutfitColorPreviewProps {
  selection: OutfitSelection;
  compact?: boolean;
  className?: string;
}

/**
 * OutfitColorPreview:
 * Visualizes the traditional Vietnamese Áo Ngũ Thân on an elegant, neutral silhouette.
 * Updates robe color instantly based on selection.colorId without API/fetch calls.
 * Clear SVG data-parts: "robe", "lining", "trousers", "headwear", "shoes".
 */
export const OutfitColorPreview: React.FC<OutfitColorPreviewProps> = ({
  selection,
  compact = false,
  className = '',
}) => {
  const idPrefix = useId();
  const shadingId = `${idPrefix}-shading`;
  const foldOverlayId = `${idPrefix}-folds`;

  const selectedColor =
    ALLOWLIST_COLORS.find((c) => c.id === selection.colorId) || ALLOWLIST_COLORS[0];

  // Headwear selection
  const hasBlackTurban = selection.accessoryIds.includes('acc-khan-dong-den');
  const hasMatchingTurban = selection.accessoryIds.includes('acc-khan-phoi-dong-dieu');
  const hasBothTurbans = hasBlackTurban && hasMatchingTurban;
  const showHeadwear = hasBlackTurban || hasMatchingTurban;

  // Khăn đóng đen luôn đen (#1C1F24); Khăn phối đồng điệu tiệp tông màu áo; đen ưu tiên nếu chọn cả 2
  const isBlackTurbanActive = hasBlackTurban;
  const headwearColor = isBlackTurbanActive
    ? '#1C1F24'
    : hasMatchingTurban
    ? selectedColor.hex
    : '#1C1F24';

  const headwearLabel = isBlackTurbanActive
    ? (hasBothTurbans ? 'Khăn đóng đen (ưu tiên)' : 'Khăn đóng đen (đã chọn)')
    : hasMatchingTurban
    ? 'Khăn tiệp tông áo (đã chọn)'
    : 'Không chọn khăn';

  // Trousers selection & explicit precedence rule
  const hasDarkTrousers = selection.accessoryIds.includes('acc-quan-au-toi-mau');
  const hasWhiteTrousers = selection.accessoryIds.includes('acc-quan-trang-ong-rong');
  const hasBothTrousers = hasDarkTrousers && hasWhiteTrousers;

  // Precedence: Quần âu tối màu ưu tiên khi cả 2 loại quần cùng được chọn
  const isDarkTrousersActive = hasDarkTrousers;
  const isWhiteTrousersActive = hasWhiteTrousers && !hasDarkTrousers;

  const trousersColor = isDarkTrousersActive ? '#23262D' : '#F6F3EB';
  const trousersBorder = isDarkTrousersActive ? '#15171C' : '#D5C9B8';

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

  const shoesColor = hasClogs && !hasLeatherShoes ? '#7A5432' : '#1A1D22';

  const shoesLabel = isLeatherActive
    ? (hasBothShoes ? 'Giày da Oxford/Derby (ưu tiên)' : 'Giày da (đã chọn)')
    : hasClogs
    ? 'Guốc mộc (đã chọn)'
    : 'Giày tối (nền minh họa)';

  const robeHex = selectedColor.hex || '#1E232A';

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

      {/* SVG Canvas */}
      <div className="relative w-full flex items-center justify-center py-1">
        <svg
          viewBox="0 0 280 370"
          className={`w-full ${compact ? 'max-h-[260px]' : 'max-h-[330px]'} drop-shadow-xs transition-all duration-300`}
          role="img"
          aria-label={`Bản xem thử màu áo ${selectedColor.name}`}
        >
          <defs>
            {/* Subtle shading overlay to give natural fabric drapery while preserving exact base hex */}
            <linearGradient id={shadingId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
            </linearGradient>

            <linearGradient id={foldOverlayId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Neutral head & neck silhouette */}
          <g data-part="head-silhouette" opacity="0.95">
            {/* Head oval */}
            <path
              d="M140 38 C128 38 122 47 122 60 C122 75 130 87 140 87 C150 87 158 75 158 60 C158 47 152 38 140 38 Z"
              fill="#DBC7AF"
            />
            {/* Neck */}
            <path d="M134 83 L134 100 L146 100 L146 83 Z" fill="#CFB79E" />
          </g>

          {/* Headwear (Khăn đóng đen hoặc khăn phối đồng điệu) */}
          <g data-part="headwear">
            {showHeadwear ? (
              <g>
                {/* Traditional wrapped folds of Vietnamese Khăn Đóng */}
                <path
                  d="M120 48 C126 40 134 36 140 36 C146 36 154 40 160 48 C163 52 163 58 159 61 C153 58 145 55 140 55 C135 55 127 58 121 61 C117 58 117 52 120 48 Z"
                  fill={headwearColor}
                  stroke="#111315"
                  strokeWidth="1.2"
                />
                <path
                  d="M123 55 C129 50 135 48 140 48 C145 48 151 50 157 55"
                  fill="none"
                  stroke="#DECFB9"
                  strokeWidth="0.8"
                  opacity="0.4"
                />
              </g>
            ) : (
              /* Natural tidy hair knot silhouette */
              <path
                d="M123 46 C129 42 135 40 140 40 C145 40 151 42 157 46 C152 44 146 43 140 43 C134 43 128 44 123 46 Z"
                fill="#2B2623"
              />
            )}
          </g>

          {/* Shoes (Giày da Oxford/Derby hoặc Guốc mộc) */}
          <g data-part="shoes">
            {/* Left Shoe */}
            <path
              d="M116 348 C116 344 121 342 126 342 L131 342 C134 345 134 349 133 352 L110 352 C112 350 114 349 116 348 Z"
              fill={shoesColor}
              stroke="#111315"
              strokeWidth="1"
            />
            {/* Right Shoe */}
            <path
              d="M149 342 L154 342 C159 342 164 344 164 348 C166 349 168 350 170 352 L147 352 C146 349 146 345 149 342 Z"
              fill={shoesColor}
              stroke="#111315"
              strokeWidth="1"
            />
          </g>

          {/* Trousers (Quần trắng ống rộng hoặc Quần âu tối màu) */}
          <g data-part="trousers">
            {/* Left trouser leg */}
            <path
              d="M114 265 L108 344 L132 344 L135 265 Z"
              fill={trousersColor}
              stroke={trousersBorder}
              strokeWidth="1"
            />
            {/* Right trouser leg */}
            <path
              d="M145 265 L148 344 L172 344 L166 265 Z"
              fill={trousersColor}
              stroke={trousersBorder}
              strokeWidth="1"
            />
            {/* Inseam divider */}
            <line
              x1="139"
              y1="270"
              x2="141"
              y2="340"
              stroke={trousersBorder}
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>

          {/* Inner Lining (Lớp lót lụa trắng đặc trưng của ngũ thân sa kép) */}
          <g data-part="lining">
            {/* Inner collar lining peek */}
            <path
              d="M133 93 L138 97 L143 93 L142 90 L134 90 Z"
              fill="#FAF8F5"
              stroke="#DECFB9"
              strokeWidth="0.75"
            />
            {/* Inner sleeve cuffs peek */}
            <path
              d="M60 216 L65 219 L66 215 L62 213 Z"
              fill="#FAF8F5"
              stroke="#DECFB9"
              strokeWidth="0.5"
            />
            <path
              d="M218 213 L214 215 L215 219 L220 216 Z"
              fill="#FAF8F5"
              stroke="#DECFB9"
              strokeWidth="0.5"
            />
            {/* Hem lining peek */}
            <path
              d="M93 268 L187 268 L186 270 L94 270 Z"
              fill="#FAF8F5"
              opacity="0.9"
            />
          </g>

          {/* Outer Robe Body & Sleeves (Áo ngũ thân nam tay chẽn) */}
          <g data-part="robe">
            {/* Left Sleeve (Tay chẽn) */}
            <path
              d="M114 105 L60 214 L75 220 L115 152 Z"
              fill={robeHex}
              stroke="#1C1815"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Right Sleeve (Tay chẽn) */}
            <path
              d="M166 105 L220 214 L205 220 L165 152 Z"
              fill={robeHex}
              stroke="#1C1815"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Main Robe Flaps & Skirt (Thân áo 5 thân xòe nhẹ tới qua gối) */}
            <path
              d="M125 96 C116 102 110 114 108 132 L92 268 C124 273 156 273 188 268 L172 132 C170 114 164 102 155 96 Z"
              fill={robeHex}
              stroke="#1C1815"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />

            {/* Diagonal overlapping front right flap (Vạt cài chéo sang nách phải) */}
            <path
              d="M136 96 C144 102 152 112 156 128 L158 155 C164 185 167 220 172 268 C144 271 118 270 94 267 C97 225 104 180 112 145 Z"
              fill={robeHex}
              stroke="#1C1815"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />

            {/* Shading overlay layer (Preserves base hex, adds subtle dimensional volume) */}
            <path
              d="M125 96 C116 102 110 114 108 132 L92 268 C124 273 156 273 188 268 L172 132 C170 114 164 102 155 96 Z"
              fill={`url(#${shadingId})`}
              pointerEvents="none"
            />
            <path
              d="M125 96 C116 102 110 114 108 132 L92 268 C124 273 156 273 188 268 L172 132 C170 114 164 102 155 96 Z"
              fill={`url(#${foldOverlayId})`}
              pointerEvents="none"
            />

            {/* Upright Standing Collar (Cổ đứng) */}
            <path
              d="M132 88 C136 86 144 86 148 88 L149 97 C144 99 136 99 131 97 Z"
              fill={robeHex}
              stroke="#1C1815"
              strokeWidth="1.2"
            />

            {/* 5 Distinct Round Loop Buttons (5 cúc vạt phải từ cổ xuống nách/eo) */}
            <g data-part="buttons" fill="#D4AF37" stroke="#30251F" strokeWidth="0.6">
              {/* Cúc 1: Cổ */}
              <circle cx="146" cy="94" r="1.6" />
              {/* Cúc 2: Xương quai xanh */}
              <circle cx="151" cy="108" r="1.6" />
              {/* Cúc 3: Nách phải */}
              <circle cx="156" cy="122" r="1.6" />
              {/* Cúc 4: Sườn trên */}
              <circle cx="157" cy="138" r="1.6" />
              {/* Cúc 5: Eo phải */}
              <circle cx="158" cy="154" r="1.6" />
            </g>

            {/* Subtle fabric fold seam lines */}
            <path
              d="M138 98 C144 116 148 138 152 170"
              fill="none"
              stroke="#000000"
              strokeWidth="0.8"
              opacity="0.25"
            />
            <path
              d="M126 150 C123 182 120 220 116 265"
              fill="none"
              stroke="#000000"
              strokeWidth="0.7"
              opacity="0.2"
            />
          </g>
        </svg>
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

        <p className="text-[10px] text-[#30251F]/65 italic text-center pt-0.5">
          Bản minh họa phối màu · Phom áo chưa đối chiếu hiện vật
        </p>
      </div>
    </div>
  );
};
