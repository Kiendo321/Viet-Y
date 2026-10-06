import React from 'react';
import { CatalogItem } from '../data/catalog';

interface GarmentDiagramProps {
  selectedColor: CatalogItem;
  styleMode: string;
  hasAccessories?: string[];
}

export const GarmentDiagram: React.FC<GarmentDiagramProps> = ({
  selectedColor,
  styleMode,
}) => {
  const isOriginal = selectedColor.id === 'color-sa-kep-den-lot-trang';
  const robeColor = selectedColor.hex || '#1E232A';

  return (
    <div className="relative w-full aspect-[3/4] bg-[#FFFBF4] rounded-sm overflow-hidden flex flex-col items-center justify-between p-5 border border-[#DECFB9] select-none">
      {/* Texture overlay watermark */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#30251F 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Top Editorial Bar */}
      <div className="w-full flex items-center justify-between border-b border-[#DECFB9] pb-2 z-10">
        <div className="text-[11px] uppercase tracking-wider text-[#30251F]/80 font-mono">
          Sơ đồ cấu trúc tham chiếu
        </div>
        <div className="text-[10px] text-[#9F1D26] font-medium tracking-wide uppercase">
          Chưa tạo bằng AI
        </div>
      </div>

      {/* Clear inference warning banner right below header */}
      <div className="w-full bg-[#9F1D26]/5 border border-[#9F1D26]/20 px-2.5 py-1 text-[10px] text-[#79171E] leading-tight rounded-xs z-10 mt-1">
        <span className="font-semibold text-[#9F1D26]">Lưu ý tư liệu: </span>
        Chi tiết cổ áo, vạt và phom vẽ là minh họa, chưa xác minh từ hiện vật.
      </div>

      {/* Visual SVG Diagram */}
      <div className="relative w-full max-w-[280px] h-[310px] flex items-center justify-center my-auto">
        <svg
          viewBox="0 0 300 420"
          className="w-full h-full drop-shadow-sm transition-all duration-500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Inner white lining peek at neckline */}
          <path
            d="M 130 55 L 150 78 L 170 55 Z"
            fill="#FFFFFF"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />

          {/* Underlayer robe hem peeking (Lót trong màu trắng) */}
          <path
            d="M 98 340 L 202 340 L 206 348 L 94 348 Z"
            fill="#FFFFFF"
            stroke="#1E293B"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Main Robe Body */}
          <path
            d="M 125 58 
               C 110 58, 60 110, 48 180 
               L 66 185 
               C 74 140, 95 120, 102 120 
               L 100 340 
               C 100 350, 130 355, 150 355 
               C 170 355, 200 350, 200 340 
               L 198 120 
               C 205 120, 226 140, 234 185 
               L 252 180 
               C 240 110, 190 58, 175 58 
               Z"
            fill={robeColor}
            fillOpacity={isOriginal ? '0.88' : '0.92'}
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Sa Kép Visual Sheer texture if original */}
          {isOriginal && (
            <path
              d="M 102 120 L 100 340 C 130 355, 170 355, 200 340 L 198 120 Z"
              fill="url(#sakhap-hatch)"
              opacity="0.35"
            />
          )}

          {/* Collar Area (Explicitly labeled as illustration) */}
          <path
            d="M 126 42 
               C 126 38, 174 38, 174 42 
               L 174 58 
               C 174 61, 126 61, 126 58 
               Z"
            fill={robeColor}
            stroke="#1E293B"
            strokeWidth="2"
          />

          {/* Diagonal Right-Side Closure Lapel (Vạt phải) */}
          <path
            d="M 150 58 
               C 152 75, 170 85, 176 100 
               C 180 115, 170 145, 168 180 
               L 165 345"
            stroke={isOriginal ? '#4B5563' : '#1E293B'}
            strokeWidth="1.8"
          />

          {/* 5 Traditional Buttons from collar to waist along right lapel */}
          {/* Cúc 1: cổ */}
          <circle cx="152" cy="52" r="3.5" fill="#D97706" stroke="#1E293B" strokeWidth="1.5" />
          {/* Cúc 2: dưới cổ vạt phải */}
          <circle cx="164" cy="74" r="3.5" fill="#D97706" stroke="#1E293B" strokeWidth="1.5" />
          {/* Cúc 3: ngực phải */}
          <circle cx="173" cy="100" r="3.5" fill="#D97706" stroke="#1E293B" strokeWidth="1.5" />
          {/* Cúc 4: sườn phải */}
          <circle cx="171" cy="128" r="3.5" fill="#D97706" stroke="#1E293B" strokeWidth="1.5" />
          {/* Cúc 5: eo phải */}
          <circle cx="168" cy="158" r="3.5" fill="#D97706" stroke="#1E293B" strokeWidth="1.5" />

          {/* Compact Sleeves (Ống tay nhỏ gọn hơn áo tấc và giao lĩnh) */}
          <line x1="48" y1="180" x2="66" y2="185" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="234" y1="185" x2="252" y2="180" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* POINTER 1: 5 cúc dọc vạt phải từ cổ xuống eo (Dữ kiện nguồn) */}
          <line x1="178" y1="110" x2="230" y2="110" stroke="#0E5A53" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="230" cy="110" r="2" fill="#0E5A53" />
          <text x="235" y="108" fill="#0E5A53" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">5 cúc vạt phải</text>
          <text x="235" y="118" fill="#1E293B" fontSize="7.5" fontFamily="sans-serif">từ cổ xuống eo (nguồn)</text>

          {/* POINTER 2: Ống tay nhỏ gọn (Dữ kiện nguồn) */}
          <line x1="56" y1="188" x2="20" y2="215" stroke="#0E5A53" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="20" cy="215" r="2" fill="#0E5A53" />
          <text x="5" y="228" fill="#0E5A53" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">Ống tay nhỏ gọn</text>
          <text x="5" y="238" fill="#1E293B" fontSize="7.5" fontFamily="sans-serif">hơn áo tấc/giao lĩnh</text>

          {/* POINTER 3: Cổ áo (Minh họa chưa xác minh) */}
          <line x1="180" y1="46" x2="230" y2="40" stroke="#BA2D1D" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="230" cy="40" r="2" fill="#BA2D1D" />
          <text x="235" y="38" fill="#BA2D1D" fontSize="8" fontWeight="600" fontFamily="sans-serif">Cổ áo</text>
          <text x="235" y="47" fill="#7A1D14" fontSize="7" fontFamily="sans-serif">minh họa, chưa xác minh</text>

          {/* POINTER 4: Hai lớp đen - trắng (Dữ kiện nguồn) */}
          <line x1="150" y1="344" x2="150" y2="380" stroke="#0E5A53" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="150" cy="380" r="2" fill="#0E5A53" />
          <text x="150" y="393" textAnchor="middle" fill="#0E5A53" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">Ngoài đen, lót trong trắng</text>
          <text x="150" y="403" textAnchor="middle" fill="#1E293B" fontSize="7.5" fontFamily="sans-serif">(Dữ kiện nguồn bài viết)</text>

          <defs>
            <pattern id="sakhap-hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
            </pattern>
          </defs>
        </svg>
      </div>

      {/* Diagram Footer Annotation */}
      <div className="w-full text-center border-t border-[#1E293B]/10 pt-2 z-10">
        <p className="text-xs text-[#1E293B]/80 font-serif">
          {selectedColor.name} · {styleMode}
        </p>
        <p className="text-[10px] text-[#1E293B]/60 mt-0.5">
          Phom vẽ tà áo là minh họa, chưa xác minh từ hiện vật.
        </p>
      </div>
    </div>
  );
};
