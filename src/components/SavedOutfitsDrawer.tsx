import React from 'react';
import { Bookmark, Trash2, ArrowUpRight, Copy, Check, Clock, AlertCircle } from 'lucide-react';
import { OutfitSelection } from '../data/catalog';

export interface SavedOutfitEntry {
  id: string;
  savedAt: string;
  selection: OutfitSelection;
  colorName: string;
  colorHex?: string;
  styleName: string;
  accessoryNames: string[];
}

interface SavedOutfitsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: SavedOutfitEntry[];
  onLoadOutfit: (entry: SavedOutfitEntry) => void;
  onDeleteOutfit: (id: string) => void;
}

export const SavedOutfitsDrawer: React.FC<SavedOutfitsDrawerProps> = ({
  isOpen,
  onClose,
  savedOutfits,
  onLoadOutfit,
  onDeleteOutfit,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySummary = (entry: SavedOutfitEntry) => {
    const text = `[Việt phục Remix - Ngày hội văn hóa]
Bộ phối: Áo ngũ thân nam tay chẽn
- Tông màu: ${entry.colorName}
- Phong cách: ${entry.styleName}
- Phụ kiện: ${entry.accessoryNames.join(', ') || 'Không thêm'}
(Tạo từ ứng dụng Việt phục Remix cho sinh viên)`;

    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFBF4] border border-[#DECFB9] w-full max-w-lg rounded-sm shadow-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#DECFB9]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#9F1D26]" />
            <h3 className="font-serif font-bold text-base text-[#30251F]">
              Cấu hình bộ phối đã lưu ({savedOutfits.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 text-[#30251F]/70 hover:text-[#9F1D26] transition-colors"
          >
            Đóng
          </button>
        </div>

        {/* Notice about storage & AI images */}
        <div className="p-3 bg-[#F7F0E4] text-xs text-[#30251F]/80 border-b border-[#DECFB9] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#9F1D26] shrink-0 mt-0.5" />
          <p>
            Các cấu hình được lưu cục bộ trong trình duyệt (<span className="font-mono font-medium">localStorage</span>).
            <span className="font-semibold block text-[#30251F]">
              Ảnh minh họa AI chỉ lưu trong phiên; hãy bấm &ldquo;Tải ảnh&rdquo; về máy để lưu trữ vĩnh viễn.
            </span>
          </p>
        </div>

        {/* List of saved outfits */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {savedOutfits.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#30251F]/50 font-serif">
              Bạn chưa lưu bộ phối nào. Khi hoàn thiện các bước, hãy bấm &ldquo;Lưu bộ phối này&rdquo;.
            </div>
          ) : (
            savedOutfits.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#FFFBF4] border border-[#DECFB9] p-3.5 rounded-xs space-y-2 hover:border-[#9F1D26]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: entry.colorHex || '#1E232A' }}
                    />
                    <h4 className="font-serif font-bold text-sm text-[#30251F]">
                      {entry.colorName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#30251F]/50">
                    <Clock className="w-3 h-3" />
                    <span>{entry.savedAt}</span>
                  </div>
                </div>

                <div className="text-xs text-[#30251F]/70 space-y-0.5">
                  <p>
                    <span className="font-medium text-[#30251F]">Phong cách:</span> {entry.styleName}
                  </p>
                  <p>
                    <span className="font-medium text-[#30251F]">Phụ kiện:</span>{' '}
                    {entry.accessoryNames.join(', ') || 'Không thêm'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#DECFB9] text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLoadOutfit(entry)}
                      className="inline-flex items-center gap-1 font-semibold text-[#486657] hover:text-[#9F1D26] hover:underline"
                    >
                      <span>Áp dụng lại</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySummary(entry)}
                      className="inline-flex items-center gap-1 text-[#30251F]/70 hover:text-[#30251F]"
                    >
                      {copiedId === entry.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#486657]" />
                          <span className="text-[#486657]">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteOutfit(entry.id)}
                    className="text-[#9F1D26] hover:opacity-80 p-1"
                    title="Xóa bộ phối"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#DECFB9] bg-[#F7F0E4] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#9F1D26] hover:bg-[#79171E] text-white text-xs font-medium rounded-xs transition-colors"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};
