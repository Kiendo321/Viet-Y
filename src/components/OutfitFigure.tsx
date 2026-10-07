import React, { useEffect, useState } from 'react';
import { ALLOWLIST_COLORS, OutfitSelection } from '../data/catalog';
import { PHOTO_CROPS, resolvePhotoLayers } from '../data/outfitPhotoAssets';

export type OutfitFigureViewMode = keyof typeof PHOTO_CROPS;
export interface OutfitFigureProps {
  selection: OutfitSelection;
  viewMode?: OutfitFigureViewMode;
  className?: string;
  idSuffix?: string;
  showShadow?: boolean;
}

/** SVG is only a viewport for raster cutouts. All views share the same files. */
export const OutfitFigure: React.FC<OutfitFigureProps> = ({ selection, viewMode = 'full', className = '' }) => {
  const layers = resolvePhotoLayers(selection);
  const key = layers.map(layer => layer.src).join('|');
  const [assetState, setAssetState] = useState<{ key: string; status: 'loading' | 'ready' | 'error' }>({ key, status: 'loading' });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setAssetState({ key, status: 'loading' });
    const loads = key.split('|').map(src => new Promise<void>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Photo asset unavailable'));
      image.src = src;
    }));
    Promise.all(loads).then(() => {
      if (!cancelled) setAssetState({ key, status: 'ready' });
    }).catch(() => {
      if (!cancelled) setAssetState({ key, status: 'error' });
    });
    return () => { cancelled = true; };
  }, [key, retry]);
  const status = assetState.key === key ? assetState.status : 'loading';
  const color = ALLOWLIST_COLORS.find(item => item.id === selection.colorId) || ALLOWLIST_COLORS[0];
  return (
    <div className={`relative ${className}`} data-photo-view={viewMode} aria-busy={status === 'loading'}>
      <svg viewBox={PHOTO_CROPS[viewMode]} preserveAspectRatio={viewMode === 'full' ? 'xMidYMid meet' : 'xMidYMid slice'}
        className="block w-full h-full" style={{ visibility: status === 'ready' ? 'visible' : 'hidden' }}
        role="img" aria-label={`Ảnh phối mẫu ${color.name} · Minh họa AI`}>
        {layers.map(layer => <image key={layer.part} data-part={layer.part} href={layer.src}
          x="0" y="0" width="1024" height="1536" />)}
      </svg>
      {status !== 'ready' && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F7F0E5]/80 text-center p-3 text-xs text-[#59473A]"
        role={status === 'error' ? 'alert' : 'status'}>
        <span>{status === 'error' ? 'Chưa tải được ảnh phối mẫu.' : 'Đang tải ảnh mẫu…'}</span>
        {status === 'error' && <button type="button" className="underline min-h-11 px-3" onClick={() => setRetry(value => value + 1)}>Thử tải lại ảnh</button>}
      </div>}
    </div>
  );
};
