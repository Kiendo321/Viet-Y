import React from 'react';
import catalogAtlas from '../assets/style-a-catalog-atlas.png';
import editorialAtlas from '../assets/style-a-editorial-atlas.png';

export interface AtlasTileProps {
  atlas: 'catalog' | 'editorial';
  row: 0 | 1;
  col: 0 | 1 | 2 | 3;
  alt: string;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  title?: string;
}

const X_POSITIONS = ['0%', '33.3333%', '66.6667%', '100%'];
const Y_POSITIONS = ['0%', '100%'];

export const AtlasTile: React.FC<AtlasTileProps> = ({
  atlas,
  row,
  col,
  alt,
  className = '',
  selected = false,
  onClick,
  title,
}) => {
  const imgSrc = atlas === 'catalog' ? catalogAtlas : editorialAtlas;
  const backgroundPosition = `${X_POSITIONS[col]} ${Y_POSITIONS[row]}`;

  return (
    <div
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={alt}
      title={title || alt}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative overflow-hidden aspect-square select-none transition-all ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${
        selected ? 'ring-2 ring-[#8E101A] shadow-xs' : ''
      } ${className}`}
      style={{
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: '400% 200%',
        backgroundPosition,
        backgroundRepeat: 'no-repeat',
      }}
    >
      <span className="sr-only">{alt}</span>
    </div>
  );
};
