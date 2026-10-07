import React from 'react';
import { ALLOWLIST_COLORS } from '../data/catalog';
import { PHOTO_COLORS, photoAsset } from '../data/outfitPhotoAssets';

export interface AccessoryThumbnailProps {
  accessoryId: string;
  robeHex?: string;
  className?: string;
  selected?: boolean;
}
export const AccessoryThumbnail: React.FC<AccessoryThumbnailProps> = ({ accessoryId, robeHex, className = 'w-full h-full' }) => {
  const colorId = ALLOWLIST_COLORS.find(item => item.hex === robeHex)?.id || ALLOWLIST_COLORS[0].id;
  const entries: Record<string, [string, string, string]> = {
    'acc-khan-dong-den': ['hat-black', '410 20 200 140', 'Khăn đóng đen'],
    'acc-khan-phoi-dong-dieu': [`hat-${PHOTO_COLORS[colorId]}`, '410 20 200 140', 'Khăn tiệp tông áo'],
    'acc-quan-trang-ong-rong': ['pants-white', '340 1110 340 290', 'Quần trắng'],
    'acc-quan-au-toi-mau': ['pants-dark', '340 680 340 725', 'Quần âu tối màu'],
    'acc-giay-oxford-derby': ['shoes-oxford', '340 1370 340 110', 'Giày da Oxford'],
    'acc-guoc-moc-truyen-thong': ['shoes-clogs', '340 1365 340 115', 'Guốc mộc'],
  };
  const entry = entries[accessoryId];
  if (!entry) return <span className={`flex items-center justify-center text-[#988773] ${className}`} aria-label="Không thêm phụ kiện">—</span>;
  return <svg className={className} viewBox={entry[1]} role="img" aria-label={`${entry[2]} · ảnh minh họa AI`}>
    <image href={photoAsset(entry[0])} x="0" y="0" width="1024" height="1536" />
  </svg>;
};
