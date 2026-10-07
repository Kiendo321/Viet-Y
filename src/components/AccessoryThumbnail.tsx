import React from 'react';
import { AtlasTile } from './AtlasTile';

export interface AccessoryThumbnailProps {
  accessoryId: string;
  robeHex?: string;
  className?: string;
  selected?: boolean;
}

/**
 * AccessoryThumbnail:
 * Displays visual thumbnail / cutout for catalog accessories.
 * Reuses existing catalog atlas ONLY where semantically correct:
 * - black khăn: row 1, col 0
 * - white trousers: row 1, col 2
 * - leather shoes: row 1, col 3
 * Custom bespoke SVG thumbnails for:
 * - matching khăn (acc-khan-phoi-dong-dieu) colored to robeHex (NEVER the fan tile!)
 * - dark trousers (acc-quan-au-toi-mau)
 * - wooden clogs / guốc mộc (acc-guoc-moc-truyen-thong)
 * - minimalist none (acc-none)
 */
export const AccessoryThumbnail: React.FC<AccessoryThumbnailProps> = ({
  accessoryId,
  robeHex = '#1E232A',
  className = 'w-full h-full',
  selected = false,
}) => {
  // 1. Black Turban: catalog atlas row 1 col 0
  if (accessoryId === 'acc-khan-dong-den') {
    return (
      <AtlasTile
        atlas="catalog"
        row={1}
        col={0}
        alt="Khăn đóng đen truyền thống"
        className={className}
        selected={selected}
      />
    );
  }

  // 2. White Trousers: catalog atlas row 1 col 2
  if (accessoryId === 'acc-quan-trang-ong-rong') {
    return (
      <AtlasTile
        atlas="catalog"
        row={1}
        col={2}
        alt="Quần trắng ống rộng"
        className={className}
        selected={selected}
      />
    );
  }

  // 3. Leather Shoes: catalog atlas row 1 col 3
  if (accessoryId === 'acc-giay-oxford-derby') {
    return (
      <AtlasTile
        atlas="catalog"
        row={1}
        col={3}
        alt="Giày da Oxford/Derby"
        className={className}
        selected={selected}
      />
    );
  }

  // 4. Matching Turban (Khăn phối đồng điệu): bespoke SVG with robeHex
  if (accessoryId === 'acc-khan-phoi-dong-dieu') {
    return (
      <div
        className={`aspect-square flex items-center justify-center p-1.5 bg-[#FFFBF4] rounded-xs overflow-hidden border border-[#DECFB9]/60 ${className}`}
        title="Khăn phối màu đồng điệu tiệp tông áo"
      >
        <svg viewBox="0 0 44 44" className="w-full h-full drop-shadow-2xs" role="img" aria-label="Khăn phối tiệp tông áo">
          {/* Turban wrap folds */}
          <path
            d="M 10 22 C 14 12, 21 8, 26 8 C 31 8, 38 12, 42 22 C 45 28, 43 34, 38 37 C 32 34, 26 31, 22 31 C 18 31, 12 34, 6 37 C 1 34, -1 28, 2 22 Z"
            transform="scale(0.85) translate(4, 5)"
            fill={robeHex}
            stroke="#1C1815"
            strokeWidth="1.2"
          />
          {/* Subtle creases */}
          <path
            d="M 12 21 C 18 15, 24 13, 29 13 C 34 13, 40 15, 46 21"
            transform="scale(0.85) translate(4, 5)"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1"
            opacity="0.45"
          />
          <path
            d="M 14 26 C 20 20, 25 18, 29 18 C 33 18, 38 20, 44 26"
            transform="scale(0.85) translate(4, 5)"
            fill="none"
            stroke="#000000"
            strokeWidth="0.8"
            opacity="0.25"
          />
        </svg>
      </div>
    );
  }

  // 5. Dark Trousers (Quần âu tối màu): bespoke SVG
  if (accessoryId === 'acc-quan-au-toi-mau') {
    return (
      <div
        className={`aspect-square flex items-center justify-center p-1.5 bg-[#FFFBF4] rounded-xs overflow-hidden border border-[#DECFB9]/60 ${className}`}
        title="Quần âu tối màu đương đại"
      >
        <svg viewBox="0 0 44 44" className="w-full h-full drop-shadow-2xs" role="img" aria-label="Quần âu tối màu">
          {/* Folded charcoal trousers */}
          <path
            d="M 12 7 L 32 7 C 33 7, 34 8, 34 9 L 33 39 L 23 39 L 22 17 L 21 39 L 11 39 L 10 9 C 10 8, 11 7, 12 7 Z"
            fill="#23262D"
            stroke="#15171C"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Waistband */}
          <path d="M 10 11 L 34 11" stroke="#3D424E" strokeWidth="1.2" />
          {/* Center crease highlights */}
          <line x1="16" y1="13" x2="16" y2="38" stroke="#3D424E" strokeWidth="0.8" opacity="0.6" />
          <line x1="28" y1="13" x2="28" y2="38" stroke="#3D424E" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </div>
    );
  }

  // 6. Guốc mộc truyền thống: bespoke SVG
  if (accessoryId === 'acc-guoc-moc-truyen-thong') {
    return (
      <div
        className={`aspect-square flex items-center justify-center p-1.5 bg-[#FFFBF4] rounded-xs overflow-hidden border border-[#DECFB9]/60 ${className}`}
        title="Guốc mộc mộc mạc truyền thống"
      >
        <svg viewBox="0 0 44 44" className="w-full h-full drop-shadow-2xs" role="img" aria-label="Guốc mộc truyền thống">
          {/* Wooden clog sole */}
          <path
            d="M 6 25 C 6 21, 14 19, 24 19 C 34 19, 39 22, 38 27 C 37 30, 35 32, 28 32 L 14 32 C 8 32, 6 29, 6 25 Z"
            fill="#8B5A2B"
            stroke="#5C3614"
            strokeWidth="1.2"
          />
          {/* Wooden platform lift */}
          <path d="M 9 32 L 9 36 L 15 36 L 15 32" fill="#5C3614" stroke="#40230C" strokeWidth="0.8" />
          <path d="M 28 32 L 28 36 L 35 36 L 35 32" fill="#5C3614" stroke="#40230C" strokeWidth="0.8" />
          {/* Traditional dark strap */}
          <path
            d="M 16 23 C 18 16, 26 16, 28 23"
            fill="none"
            stroke="#1F1D1B"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // 7. acc-none: Minimalist none icon
  return (
    <div
      className={`aspect-square flex items-center justify-center p-1.5 bg-[#FFFBF4] rounded-xs overflow-hidden border border-dashed border-[#DECFB9] ${className}`}
      title="Không thêm phụ kiện"
    >
      <div className="w-6 h-6 rounded-full border border-dashed border-[#8E101A]/60 flex items-center justify-center text-[10px] font-mono text-[#8E101A]">
        Ø
      </div>
    </div>
  );
};
