import { ALLOWLIST_GARMENTS, ALLOWLIST_COLORS, ALLOWLIST_ACCESSORIES, ALLOWLIST_STYLES, OCCASION_DATA, type OutfitSelection } from '../data/catalog';
import type { SavedOutfitEntry } from '../components/SavedOutfitsDrawer';

export const OUTFIT_STORAGE_KEY = 'viet_phuc_remix_outfits';

/** Ignore accessory order, but include every choice and the user's note. */
export function selectionKey(selection: OutfitSelection): string {
  return JSON.stringify([selection.occasionId, selection.garmentId, selection.colorId,
    [...selection.accessoryIds].sort(), selection.styleId, selection.userNote || '']);
}

export function readSavedOutfits(storage: Pick<Storage, 'getItem'>): SavedOutfitEntry[] {
  const raw: unknown = JSON.parse(storage.getItem(OUTFIT_STORAGE_KEY) || '[]');
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry): entry is SavedOutfitEntry => {
    const s = entry?.selection;
    return typeof entry?.id === 'string' && typeof entry.savedAt === 'string'
      && typeof entry.colorName === 'string' && typeof entry.styleName === 'string'
      && Array.isArray(entry.accessoryNames) && entry.accessoryNames.every((name: unknown) => typeof name === 'string')
      && s?.occasionId === OCCASION_DATA.id
      && ALLOWLIST_GARMENTS.some(item => item.id === s.garmentId)
      && ALLOWLIST_COLORS.some(item => item.id === s.colorId)
      && ALLOWLIST_STYLES.some(item => item.id === s.styleId)
      && Array.isArray(s.accessoryIds)
      && s.accessoryIds.every((id: unknown) => ALLOWLIST_ACCESSORIES.some(item => item.id === id))
      && (s.userNote === undefined || typeof s.userNote === 'string');
  }).slice(0, 40);
}

/** Persist first: a failed write must never produce a successful UI state. */
export function persistOutfits(storage: Pick<Storage, 'setItem'>, entries: SavedOutfitEntry[]) {
  storage.setItem(OUTFIT_STORAGE_KEY, JSON.stringify(entries));
}
