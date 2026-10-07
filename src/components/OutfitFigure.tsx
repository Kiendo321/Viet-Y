import React, { useId } from 'react';
import { ALLOWLIST_COLORS, OutfitSelection } from '../data/catalog';

export type OutfitFigureViewMode = 'full' | 'collar-detail' | 'fasteners-detail' | 'fabric-swatch';

export interface OutfitFigureProps {
  selection: OutfitSelection;
  viewMode?: OutfitFigureViewMode;
  className?: string;
  idSuffix?: string;
  showShadow?: boolean;
}

/**
 * OutfitFigure:
 * Reusable color illustration inspired by an Áo Ngũ Thân; not a reconstruction of the source artifact.
 * Features:
 * - Natural dignified upright posture, narrow tailored sleeves (tay chẽn nhỏ gọn).
 * - Standing band collar (cổ đứng), white inner silk lining peek (lớp lót trắng).
 * - 5 round loop buttons along right front flap (5 cúc vạt phải từ cổ xuống eo).
 * - Same vector shapes across full-body and close-up views (collar, fasteners) via viewBox cropping.
 * - Honest truthful rendering: SVG color preview, not an AI photograph.
 * - Strict SVG groups: "robe", "lining", "trousers", "headwear", "shoes", "buttons".
 */
export const OutfitFigure: React.FC<OutfitFigureProps> = ({
  selection,
  viewMode = 'full',
  className = '',
  idSuffix = '',
  showShadow = true,
}) => {
  const baseId = useId().replace(/:/g, '');
  const uniqueId = idSuffix ? `${baseId}-${idSuffix}` : baseId;

  const shadingId = `${uniqueId}-shading`;
  const foldOverlayId = `${uniqueId}-folds`;
  const silkWeaveId = `${uniqueId}-weave`;
  const shadowId = `${uniqueId}-shadow`;

  const selectedColor =
    ALLOWLIST_COLORS.find((c) => c.id === selection.colorId) || ALLOWLIST_COLORS[0];
  const robeHex = selectedColor.hex || '#1E232A';

  // Headwear selection
  const hasBlackTurban = selection.accessoryIds.includes('acc-khan-dong-den');
  const hasMatchingTurban = selection.accessoryIds.includes('acc-khan-phoi-dong-dieu');
  const showHeadwear = hasBlackTurban || hasMatchingTurban;

  // Precedence: Black turban stays #1C1F24 even if both selected; matching turban takes robeHex
  const isBlackTurbanActive = hasBlackTurban;
  const headwearColor = isBlackTurbanActive
    ? '#1C1F24'
    : hasMatchingTurban
    ? robeHex
    : '#1C1F24';

  // Trousers selection & explicit precedence rule
  const hasDarkTrousers = selection.accessoryIds.includes('acc-quan-au-toi-mau');
  const hasWhiteTrousers = selection.accessoryIds.includes('acc-quan-trang-ong-rong');
  const isDarkTrousersActive = hasDarkTrousers;

  const trousersColor = isDarkTrousersActive ? '#23262D' : '#F6F3EB';
  const trousersBorder = isDarkTrousersActive ? '#15171C' : '#D5C9B8';

  // Shoes selection
  const hasLeatherShoes = selection.accessoryIds.includes('acc-giay-oxford-derby');
  const hasClogs = selection.accessoryIds.includes('acc-guoc-moc-truyen-thong');

  // Guốc mộc has distinct wooden profile; Leather shoes / default has dark leather profile
  const isClogsActive = hasClogs && !hasLeatherShoes;
  const shoesColor = isClogsActive ? '#8B5A2B' : '#1A1D22';

  // ViewBox mapping
  let viewBox = '0 20 320 575';
  if (viewMode === 'collar-detail') {
    // Zoom tightly into standing collar & inner lining peek
    viewBox = '112 68 96 90';
  } else if (viewMode === 'fasteners-detail') {
    // Zoom into diagonal flap & 5 round loop buttons from neck to waist
    viewBox = '126 96 92 155';
  }

  // Fabric swatch standalone view
  if (viewMode === 'fabric-swatch') {
    return (
      <div className={`relative overflow-hidden rounded-xs border border-[#DECFB9] ${className}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full" role="img" aria-label={`Mô phỏng sắc vải ${selectedColor.name}`}>
          <defs>
            <pattern id={silkWeaveId} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 8 8 M 8 0 L 0 8" stroke="#000000" strokeWidth="0.5" strokeOpacity="0.08" />
              <rect x="0" y="0" width="4" height="4" fill="#FFFFFF" fillOpacity="0.04" />
            </pattern>
            <linearGradient id={`${silkWeaveId}-grad`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
              <stop offset="45%" stopColor="#000000" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <rect width="160" height="160" fill={robeHex} />
          <rect width="160" height="160" fill={`url(#${silkWeaveId})`} />
          <rect width="160" height="160" fill={`url(#${silkWeaveId}-grad)`} />
        </svg>
      </div>
    );
  }

  return (
    <svg
      viewBox={viewBox}
      className={`w-full drop-shadow-xs transition-all duration-300 select-none ${className}`}
      role="img"
      aria-label={`Minh họa áo ngũ thân màu ${selectedColor.name}`}
    >
      <defs>
        {/* Subtle fabric drapery gradient - preserves base robeHex */}
        <linearGradient id={shadingId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.14" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="68%" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
        </linearGradient>

        {/* Vertical drape shading */}
        <linearGradient id={foldOverlayId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>

        {/* Soft grounded shadow under feet */}
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#30251F" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#30251F" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#30251F" stopOpacity="0" />
        </radialGradient>
        <pattern id={silkWeaveId} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 0 H4 M0 0 V4" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="0.35" />
        </pattern>
      </defs>

      {/* Grounded shadow under feet (full view only) */}
      {showShadow && viewMode === 'full' && (
        <ellipse cx="160" cy="582" rx="72" ry="7.5" fill={`url(#${shadowId})`} pointerEvents="none" />
      )}

      {/* Neutral head & neck silhouette */}
      <g data-part="head-silhouette" opacity="0.95">
        {/* Head oval */}
        <path
          d="M 160 40 C 146 40 139 50 139 67 C 139 84 148 95 160 95 C 172 95 181 84 181 67 C 181 50 174 40 160 40 Z"
          fill="#DBC7AF"
        />
        {/* Ears */}
        <ellipse cx="138" cy="67" rx="3" ry="5.5" fill="#CFB79E" />
        <ellipse cx="182" cy="67" rx="3" ry="5.5" fill="#CFB79E" />
        {/* Neck */}
        <path d="M 152 90 L 152 116 L 168 116 L 168 90 Z" fill="#CFB79E" />
        <g fill="none" stroke="#755E4A" strokeLinecap="round" opacity="0.65">
          <path d="M147 64 Q151 62 155 64 M165 64 Q169 62 173 64" strokeWidth="0.8" />
          <path d="M160 67 L158 77 L161 78 M154 84 Q160 87 166 84" strokeWidth="0.7" />
          <path d="M147 68 H154 M166 68 H173" strokeWidth="0.8" />
        </g>
      </g>

      {/* Headwear: Khăn đóng đen hoặc khăn tiệp tông */}
      <g data-part="headwear">
        {showHeadwear ? (
          <g>
            {/* Vietnamese Khăn Đóng folded wraps silhouette */}
            <path
              d="M 136 52 C 144 42, 154 37, 160 37 C 166 37, 176 42, 184 52 C 188 58, 188 66, 182 70 C 174 66, 166 62, 160 62 C 154 62, 146 66, 138 70 C 132 66, 132 58, 136 52 Z"
              fill={headwearColor}
              stroke="#111315"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Fine fold lines */}
            <path
              d="M 140 60 C 147 54, 154 51, 160 51 C 166 51, 173 54, 180 60"
              fill="none"
              stroke={isBlackTurbanActive ? '#665D55' : '#DECFB9'}
              strokeWidth="0.8"
              opacity="0.5"
            />
            <path
              d="M 142 54 C 148 47, 154 44, 160 44 C 166 44, 172 47, 178 54"
              fill="none"
              stroke={isBlackTurbanActive ? '#665D55' : '#DECFB9'}
              strokeWidth="0.8"
              opacity="0.45"
            />
          </g>
        ) : (
          /* Natural tidy hair knot */
          <path
            d="M 141 50 C 147 45, 154 42, 160 42 C 166 42, 173 45, 179 50 C 174 48, 167 47, 160 47 C 153 47, 146 48, 141 50 Z"
            fill="#2B2623"
          />
        )}
      </g>

      {/* Shoes (Giày da Oxford/Derby hoặc Guốc mộc truyền thống) */}
      <g data-part="shoes">
        {isClogsActive ? (
          /* Guốc mộc truyền thống: Đế gỗ cong mộc mạc và quai ngang */
          <g>
            {/* Left Clog */}
            <path
              d="M 126 565 C 126 561 132 559 138 559 L 148 559 C 152 562 153 567 151 572 L 122 572 C 123 569 125 566 126 565 Z"
              fill={shoesColor}
              stroke="#5C3614"
              strokeWidth="1.1"
            />
            {/* Left Clog Platform cut & strap */}
            <path d="M 124 570 L 150 570" stroke="#40230C" strokeWidth="1" />
            <path d="M 132 560 C 134 556 142 556 144 560" fill="none" stroke="#1F1D1B" strokeWidth="2.2" />

            {/* Right Clog */}
            <path
              d="M 172 559 L 182 559 C 188 559 194 561 194 565 C 195 566 197 569 198 572 L 169 572 C 167 567 168 562 172 559 Z"
              fill={shoesColor}
              stroke="#5C3614"
              strokeWidth="1.1"
            />
            {/* Right Clog Platform cut & strap */}
            <path d="M 170 570 L 196 570" stroke="#40230C" strokeWidth="1" />
            <path d="M 176 560 C 178 556 186 556 188 560" fill="none" stroke="#1F1D1B" strokeWidth="2.2" />
          </g>
        ) : (
          /* Giày da Oxford/Derby tối màu đương đại */
          <g>
            {/* Left Shoe */}
            <path
              d="M 124 565 C 124 560 130 558 138 558 L 148 558 C 152 561 153 566 151 571 L 120 571 C 121 568 123 566 124 565 Z"
              fill={shoesColor}
              stroke="#111315"
              strokeWidth="1.1"
            />
            {/* Left Shoe sole & heel */}
            <path d="M 120 570 L 151 570" stroke="#0D0E10" strokeWidth="1.3" />

            {/* Right Shoe */}
            <path
              d="M 172 558 L 182 558 C 190 558 196 560 196 565 C 197 566 199 568 200 571 L 169 571 C 167 566 168 561 172 558 Z"
              fill={shoesColor}
              stroke="#111315"
              strokeWidth="1.1"
            />
            {/* Right Shoe sole & heel */}
            <path d="M 169 570 L 200 570" stroke="#0D0E10" strokeWidth="1.3" />
          </g>
        )}
      </g>

      {/* Trousers (Quần trắng ống rộng hoặc Quần âu tối màu) */}
      <g data-part="trousers">
        {/* Left trouser leg */}
        <path
          d="M 128 360 L 120 558 L 151 558 L 155 360 Z"
          fill={trousersColor}
          stroke={trousersBorder}
          strokeWidth="1.1"
        />
        {/* Right trouser leg */}
        <path
          d="M 165 360 L 169 558 L 200 558 L 192 360 Z"
          fill={trousersColor}
          stroke={trousersBorder}
          strokeWidth="1.1"
        />
        {/* Inseam divider */}
        <line
          x1="158"
          y1="370"
          x2="162"
          y2="550"
          stroke={trousersBorder}
          strokeWidth="0.8"
          opacity="0.6"
        />
      </g>

      {/* Inner Lining (Lớp lót lụa trắng đặc trưng của áo ngũ thân sa kép) */}
      <g data-part="lining">
        {/* Inner collar lining peek */}
        <path
          d="M 151 106 L 158 111 L 164 106 L 163 103 L 152 103 Z"
          fill="#FAF8F5"
          stroke="#DECFB9"
          strokeWidth="0.8"
        />
        {/* Inner left sleeve cuff peek */}
        <path
          d="M 102 342 L 118 346 L 119 342 L 104 339 Z"
          fill="#FAF8F5"
          stroke="#DECFB9"
          strokeWidth="0.6"
        />
        {/* Inner right sleeve cuff peek */}
        <path
          d="M 216 339 L 201 342 L 202 346 L 218 342 Z"
          fill="#FAF8F5"
          stroke="#DECFB9"
          strokeWidth="0.6"
        />
        {/* Hem lining peek */}
        <path
          d="M 104 448 L 216 448 L 215 451 L 105 451 Z"
          fill="#FAF8F5"
          opacity="0.9"
        />
      </g>

      {/* Outer Robe Body & Narrow Sleeves (Áo ngũ thân nam tay chẽn) */}
      <g data-part="robe">
        {/* Left Sleeve (Tay nhỏ gọn / tay chẽn) */}
        <path
          d="M 126 128 L 102 340 L 120 347 L 132 176 Z"
          fill={robeHex}
          stroke="#1C1815"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Right Sleeve (Tay nhỏ gọn / tay chẽn) */}
        <path
          d="M 194 128 L 218 340 L 200 347 L 188 176 Z"
          fill={robeHex}
          stroke="#1C1815"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Natural relaxed hands at thighs */}
        <ellipse cx="110" cy="354" rx="5.5" ry="9" fill="#CFB79E" />
        <ellipse cx="210" cy="354" rx="5.5" ry="9" fill="#CFB79E" />

        {/* Main Robe Flaps & Skirt (Thân áo 5 thân xòe nhẹ tới qua gối) */}
        <path
          d="M 140 114 C 128 122 120 138 118 160 L 103 448 C 141 454 179 454 217 448 L 202 160 C 200 138 192 122 180 114 Z"
          fill={robeHex}
          stroke="#1C1815"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* Diagonal overlapping front right flap (Vạt cài chéo sang nách phải) */}
        <path
          d="M 154 114 C 163 122 173 134 178 152 L 180 180 C 187 215 190 260 196 448 C 164 452 136 451 106 447 C 109 395 116 340 124 172 Z"
          fill={robeHex}
          stroke="#1C1815"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Shading overlay layer (Preserves base robeHex) */}
        <path
          d="M 140 114 C 128 122 120 138 118 160 L 103 448 C 141 454 179 454 217 448 L 202 160 C 200 138 192 122 180 114 Z"
          fill={`url(#${shadingId})`}
          pointerEvents="none"
        />
        <path
          d="M 140 114 C 128 122 120 138 118 160 L 103 448 C 141 454 179 454 217 448 L 202 160 C 200 138 192 122 180 114 Z"
          fill={`url(#${foldOverlayId})`}
          pointerEvents="none"
        />

        {/* Upright Standing Collar (Cổ áo minh họa) */}
        <path
          d="M 140 114 C 128 122 120 138 118 160 L 103 448 C 141 454 179 454 217 448 L 202 160 C 200 138 192 122 180 114 Z"
          fill={`url(#${silkWeaveId})`}
          pointerEvents="none"
        />
        <path
          d="M 150 102 C 154 100 166 100 170 102 L 171 113 C 165 115 155 115 149 113 Z"
          fill={robeHex}
          stroke="#1C1815"
          strokeWidth="1.2"
        />

        {/* 5 Distinct Round Loop Buttons (5 cúc minh họa vạt phải từ cổ xuống eo) */}
        <g data-part="buttons" fill="#D4AF37" stroke="#30251F" strokeWidth="0.7">
          {/* Cúc 1: Cổ */}
          <circle cx="166" cy="110" r="1.8" />
          {/* Cúc 2: Xương quai xanh */}
          <circle cx="173" cy="128" r="1.8" />
          {/* Cúc 3: Nách phải */}
          <circle cx="178" cy="148" r="1.8" />
          {/* Cúc 4: Sườn trên */}
          <circle cx="179" cy="172" r="1.8" />
          {/* Cúc 5: Eo phải */}
          <circle cx="180" cy="196" r="1.8" />
        </g>

        {/* Subtle fabric fold seam lines */}
        <path
          d="M 155 118 C 162 140 166 168 171 210"
          fill="none"
          stroke="#000000"
          strokeWidth="0.8"
          opacity="0.25"
        />
        <path
          d="M 141 176 C 137 215 133 260 128 440"
          fill="none"
          stroke="#000000"
          strokeWidth="0.7"
          opacity="0.2"
        />
      </g>
    </svg>
  );
};
