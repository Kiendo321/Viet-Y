import { ALLOWLIST_COLORS, ALLOWLIST_ACCESSORIES, ALLOWLIST_STYLES, OCCASION_DATA, type OutfitSelection } from '../data/catalog';
import { resolvePhotoLayers } from '../data/outfitPhotoAssets';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Chưa tải đủ ảnh bộ phối. Vui lòng thử lại.'));
    image.src = src;
  });
}

/** Draw the same asset URLs and order as the preview. No recoloring or AI call. */
export async function createLookbookPng(selection: OutfitSelection): Promise<Blob> {
  await document.fonts?.ready;
  const images = await Promise.all(resolvePhotoLayers(selection).map(layer => loadImage(layer.src)));
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Trình duyệt chưa hỗ trợ xuất ảnh.');
  const ctx = context;
  const color = ALLOWLIST_COLORS.find(item => item.id === selection.colorId)!;
  const style = ALLOWLIST_STYLES.find(item => item.id === selection.styleId)!;
  ctx.fillStyle = '#F7F0E4'; ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = '#DECFB9'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, 1020, 1290);
  ctx.fillStyle = '#8E101A'; ctx.font = 'bold 44px "Noto Serif", serif';
  ctx.fillText('Việt phục Remix', 70, 112);
  ctx.fillStyle = '#59473A'; ctx.font = '22px "Be Vietnam Pro", sans-serif';
  ctx.fillText('LOOKBOOK · NGÀY HỘI Ở TRƯỜNG', 70, 160);
  ctx.fillStyle = '#FFFBF4'; ctx.fillRect(60, 210, 500, 1020);
  for (const image of images) ctx.drawImage(image, 220, 0, 584, 1536, 121, 215, 380, 1000);
  let y = 258;
  function text(content: string, size = 26, weight = 'normal', fill = '#30251F') {
    ctx.fillStyle = fill; ctx.font = `${weight} ${size}px "Be Vietnam Pro", sans-serif`;
    let line = '';
    for (const word of content.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > 400 && line) { ctx.fillText(line, 600, y); y += size * 1.5; line = word; }
      else line = next;
    }
    if (line) { ctx.fillText(line, 600, y); y += size * 1.5; }
  }
  text('Áo ngũ thân nam', 34, 'bold'); y += 25;
  ctx.fillStyle = color.hex || '#30251F'; ctx.beginPath(); ctx.arc(616, y, 14, 0, Math.PI * 2); ctx.fill(); y += 45;
  text(color.name.split(' (')[0], 30, 'bold'); y += 20;
  text(OCCASION_DATA.name, 24); y += 24;
  text(style.name.split(' (')[0], 24, 'bold'); y += 18;
  const accessories = ALLOWLIST_ACCESSORIES.filter(item => selection.accessoryIds.includes(item.id));
  for (const item of accessories) text(`• ${item.name}`, 22);
  y += 35;
  text('Ghi chú văn hóa', 25, 'bold', '#486657');
  text('Hiện vật tham chiếu: áo sa kép, ngoài đen lót trắng. Các sắc áo khác và phụ kiện là gợi ý remix.', 22);
  y += 20;
  text('Nguồn: Bảo tàng Lịch sử Quốc gia. Xem liên kết tư liệu trong ứng dụng.', 20);
  ctx.fillStyle = '#59473A'; ctx.font = '20px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Ảnh phối từ asset minh họa AI · Mẫu dựng sẵn · Không phải ảnh hiện vật', 70, 1280);
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Không xuất được ảnh.')), 'image/png'));
}

export async function downloadLookbook(selection: OutfitSelection) {
  const blob = await createLookbookPng(selection);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `viet-phuc-lookbook-${selection.colorId.replace('color-', '')}.png`;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
