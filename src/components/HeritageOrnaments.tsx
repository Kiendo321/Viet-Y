import React from 'react';

/**
 * Traditional 4-Petal Diamond Cord Knot Logo (Hoa kết dây 4 cánh hình diamond)
 * Vietnamese silk braid cord knot motif - elegant interlacing diamond petals in vermilion & brass.
 */
export const BraidedFlowerLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Delicate outer diamond guideline */}
    <path
      d="M22 2 L42 22 L22 42 L2 22 Z"
      stroke="#B18C52"
      strokeWidth="0.8"
      strokeOpacity="0.45"
      strokeDasharray="2 2"
    />

    {/* 4 Interlacing diamond petals */}
    {/* North petal */}
    <path
      d="M22 5 C25 12, 28 17, 22 22 C16 17, 19 12, 22 5 Z"
      fill="#8E101A"
      fillOpacity="0.12"
      stroke="#8E101A"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* South petal */}
    <path
      d="M22 39 C25 32, 28 27, 22 22 C16 27, 19 32, 22 39 Z"
      fill="#8E101A"
      fillOpacity="0.12"
      stroke="#8E101A"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* East petal */}
    <path
      d="M39 22 C32 25, 27 28, 22 22 C27 16, 32 19, 39 22 Z"
      fill="#8E101A"
      fillOpacity="0.12"
      stroke="#8E101A"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* West petal */}
    <path
      d="M5 22 C12 25, 17 28, 22 22 C17 16, 12 19, 5 22 Z"
      fill="#8E101A"
      fillOpacity="0.12"
      stroke="#8E101A"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Continuous decorative looping silk cord ribbon */}
    <path
      d="M13 13 C18 10, 26 10, 31 13 C34 18, 34 26, 31 31 C26 34, 18 34, 13 31 C10 26, 10 18, 13 13 Z"
      stroke="#8E101A"
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Central diamond blossom core */}
    <path
      d="M22 17 L27 22 L22 27 L17 22 Z"
      fill="#F7EEDD"
      stroke="#8E101A"
      strokeWidth="1.5"
    />
    <circle cx="22" cy="22" r="2.5" fill="#8E101A" />
    <circle cx="22" cy="22" r="1.2" fill="#B18C52" />

    {/* 4 Golden diamond tip accents */}
    <circle cx="22" cy="7" r="1.25" fill="#B18C52" />
    <circle cx="22" cy="37" r="1.25" fill="#B18C52" />
    <circle cx="7" cy="22" r="1.25" fill="#B18C52" />
    <circle cx="37" cy="22" r="1.25" fill="#B18C52" />
  </svg>
);

/**
 * Editorial Headline Flourish Underline (Đường lượn dưới chữ Remix kèm hoa vàng kim)
 */
export const HeadlineFlourish: React.FC<{ className?: string }> = ({ className = 'w-64 h-8' }) => (
  <svg
    viewBox="0 0 320 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Flowing vermilion curve */}
    <path
      d="M4 18 C60 28, 140 32, 220 16 C260 8, 295 12, 316 22"
      stroke="#8E101A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Soft secondary gold line */}
    <path
      d="M24 24 C80 34, 160 36, 235 20"
      stroke="#B18C52"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* Little floral accent at tail */}
    <circle cx="316" cy="22" r="3" fill="#8E101A" />
    <circle cx="316" cy="22" r="1.5" fill="#B18C52" />
    <path
      d="M312 18 C314 14, 318 14, 320 18"
      stroke="#B18C52"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Custom Paper Wave Divider for Discovery Ribbon
 * Seamless SVG wave that transitions from the hero into the ivory paper ribbon
 */
export const PaperWaveDivider: React.FC<{ className?: string }> = ({ className = 'w-full' }) => (
  <div className={`relative ${className} overflow-hidden pointer-events-none select-none`}>
    <svg
      viewBox="0 0 1440 90"
      fill="none"
      preserveAspectRatio="none"
      className="w-full h-[54px] sm:h-[70px] lg:h-[84px] block"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Thin Gold accent thread */}
      <path
        d="M0 48 C 240 18, 480 68, 760 36 C 1040 4, 1260 52, 1440 30"
        stroke="#B18C52"
        strokeWidth="1.5"
        strokeOpacity="0.85"
        fill="none"
      />
      {/* Main ivory paper fill */}
      <path
        d="M0 50 C 240 20, 480 70, 760 38 C 1040 6, 1260 54, 1440 32 L 1440 90 L 0 90 Z"
        fill="#F7EEDD"
      />
    </svg>
  </div>
);

/**
 * Subtle Botanical Leaf Branch Ornament (Góc nhã nhặn nét son & đồng thau)
 */
export const LeafBranchOrnament: React.FC<{ className?: string; flip?: boolean }> = ({
  className = 'w-16 h-16',
  flip = false,
}) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${flip ? '-scale-x-100' : ''}`}
    aria-hidden="true"
  >
    {/* Graceful curved stem in brass */}
    <path
      d="M10 70 C25 55, 38 35, 68 12"
      stroke="#B18C52"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    {/* Subtle secondary twig */}
    <path
      d="M32 44 C42 42, 52 46, 62 40"
      stroke="#B18C52"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />

    {/* Leaf 1 - Vermilion tone */}
    <path
      d="M26 48 C22 38, 30 35, 35 39 C38 43, 33 50, 26 48 Z"
      fill="#8E101A"
      fillOpacity="0.16"
      stroke="#8E101A"
      strokeWidth="1"
    />
    {/* Leaf 2 - Vermilion tone */}
    <path
      d="M44 32 C41 22, 50 20, 55 24 C58 28, 52 35, 44 32 Z"
      fill="#8E101A"
      fillOpacity="0.16"
      stroke="#8E101A"
      strokeWidth="1"
    />
    {/* Leaf 3 - Golden Brass tone */}
    <path
      d="M60 17 C62 10, 71 11, 72 16 C73 21, 65 22, 60 17 Z"
      fill="#B18C52"
      fillOpacity="0.28"
      stroke="#B18C52"
      strokeWidth="1"
    />
    {/* Leaf 4 on twig */}
    <path
      d="M50 43 C52 37, 60 38, 61 42 C61 46, 54 47, 50 43 Z"
      fill="#B18C52"
      fillOpacity="0.22"
      stroke="#B18C52"
      strokeWidth="0.9"
    />

    {/* Delicate bud dots */}
    <circle cx="68" cy="12" r="2" fill="#8E101A" />
    <circle cx="62" cy="40" r="1.5" fill="#B18C52" />
  </svg>
);
