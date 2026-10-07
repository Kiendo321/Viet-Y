import { OutfitSelection } from './catalog';

/** Prepared photographic assets; selection changes URLs, never pixel colors. */
export const PHOTO_ASSET_ROOT = '/assets/outfit-photo-v1/';
export const PHOTO_COLORS: Record<string, string> = {
  'color-sa-kep-den-lot-trang': 'black',
  'color-muc-cham-co': 'indigo',
  'color-xanh-ngoc-bich': 'green',
  'color-do-son-tram': 'red',
  'color-vang-hoang-cuc': 'gold',
  'color-trang-nga-toi-gian': 'ivory',
};
export const photoAsset = (name: string) => `${PHOTO_ASSET_ROOT}${name}.webp`;
export function resolvePhotoLayers(selection: OutfitSelection) {
  const color = PHOTO_COLORS[selection.colorId] || 'black';
  const ids = selection.accessoryIds;
  return [
    { part: 'shoes', src: photoAsset(ids.includes('acc-guoc-moc-truyen-thong') && !ids.includes('acc-giay-oxford-derby') ? 'shoes-clogs' : 'shoes-oxford') },
    { part: 'trousers', src: photoAsset(ids.includes('acc-quan-au-toi-mau') ? 'pants-dark' : 'pants-white') },
    { part: 'avatar', src: photoAsset('avatar') },
    { part: 'robe', src: photoAsset(`coat-${color}`) },
    ...(ids.includes('acc-khan-dong-den') || ids.includes('acc-khan-phoi-dong-dieu')
      ? [{ part: 'headwear', src: photoAsset(`hat-${ids.includes('acc-khan-dong-den') ? 'black' : color}`) }] : []),
  ];
}
export const PHOTO_CROPS = {
  full: '220 0 584 1536',
  'collar-detail': '406 246 212 114',
  'fasteners-detail': '376 300 180 340',
  'fabric-swatch': '470 650 130 130',
};
