import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Bookmark,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Info,
  Calendar,
  Layers,
  Palette,
  Compass,
  Image as ImageIcon,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import {
  OCCASION_DATA,
  ALLOWLIST_GARMENTS,
  ALLOWLIST_COLORS,
  ALLOWLIST_ACCESSORIES,
  ALLOWLIST_STYLES,
  CULTURAL_ARTIFACT_MUSEUM,
  FALLBACK_RECOMMENDATIONS,
  OutfitSelection,
  StylistRecommendation,
} from './data/catalog';
import { GarmentDiagram } from './components/GarmentDiagram';
import { ImageComparison } from './components/ImageComparison';
import { CulturalCard } from './components/CulturalCard';
import { SavedOutfitsDrawer, SavedOutfitEntry } from './components/SavedOutfitsDrawer';
import { EditorialLanding } from './components/EditorialLanding';
import { BraidedFlowerLogo } from './components/HeritageOrnaments';

export default function App() {
  // Navigation view: 'landing' (editorial showcase) vs 'flow' (6-step styling workflow)
  const [activeView, setActiveView] = useState<'landing' | 'flow'>('landing');

  // Current active step (1 to 6) in the styling flow
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selection state
  const [selection, setSelection] = useState<OutfitSelection>({
    occasionId: OCCASION_DATA.id,
    garmentId: ALLOWLIST_GARMENTS[0].id,
    colorId: ALLOWLIST_COLORS[0].id,
    accessoryIds: [ALLOWLIST_ACCESSORIES[1].id], // Mặc định khăn đóng đen (gợi ý phối)
    styleId: ALLOWLIST_STYLES[0].id,
    userNote: '',
  });

  // Stylist AI suggestions state
  const [hasCalledStylist, setHasCalledStylist] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [suggestSource, setSuggestSource] = useState<'gemini' | 'curated_fallback' | null>(null);
  const [actualModelUsed, setActualModelUsed] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<StylistRecommendation[]>(FALLBACK_RECOMMENDATIONS);
  const latestRequestIdRef = useRef<number>(0);

  // AI Image generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [originalAiImage, setOriginalAiImage] = useState<string | null>(null);
  const [recoloredAiImage, setRecoloredAiImage] = useState<string | null>(null);
  const [isRecoloring, setIsRecoloring] = useState<boolean>(false);
  const [recolorError, setRecolorError] = useState<string | null>(null);

  // Saved outfits state (localStorage)
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfitEntry[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [hasSavedCurrent, setHasSavedCurrent] = useState<boolean>(false);

  // Hero image load error state
  const [heroImageError, setHeroImageError] = useState<boolean>(false);

  // Load saved outfits from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('viet_phuc_remix_outfits');
      if (saved) {
        setSavedOutfits(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read saved outfits from localStorage:', e);
    }

    // Ping health endpoint to confirm backend readiness
    fetch('/api/health')
      .then((res) => res.json())
      .catch((err) => {
        console.warn('Health check failed:', err);
      });
  }, []);

  const currentColor = ALLOWLIST_COLORS.find((c) => c.id === selection.colorId) || ALLOWLIST_COLORS[0];
  const currentGarment = ALLOWLIST_GARMENTS.find((g) => g.id === selection.garmentId) || ALLOWLIST_GARMENTS[0];
  const currentStyle = ALLOWLIST_STYLES.find((s) => s.id === selection.styleId) || ALLOWLIST_STYLES[0];
  const currentAccessories = ALLOWLIST_ACCESSORIES.filter((a) => selection.accessoryIds.includes(a.id));

  // Handle Gemini Stylist Call (Guaranteed loading, 30s timeout, Content-Type check, double-submit protection)
  const handleAskStylist = async () => {
    if (isSuggesting) return; // Prevent double submit

    const reqId = ++latestRequestIdRef.current;
    setIsSuggesting(true);
    setSuggestError(null);
    setHasCalledStylist(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const res = await fetch('/api/stylist/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          occasion: OCCASION_DATA.name,
          preference: selection.userNote,
          currentSelection: selection,
        }),
        signal: controller.signal,
      });

      if (reqId !== latestRequestIdRef.current) return;

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        const errorDesc = `Máy chủ phản hồi không đúng định dạng JSON (HTTP ${res.status}). Đã kích hoạt mẫu tĩnh dự phòng.`;
        setSuggestError(errorDesc);
        setSuggestSource('curated_fallback');
        setActualModelUsed(null);
        setSuggestions(FALLBACK_RECOMMENDATIONS);
        return;
      }

      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr: any) {
        setSuggestError(`Không thể đọc định dạng phản hồi từ máy chủ (HTTP ${res.status}). Đã kích hoạt mẫu tĩnh dự phòng.`);
        setSuggestSource('curated_fallback');
        setActualModelUsed(null);
        setSuggestions(FALLBACK_RECOMMENDATIONS);
        return;
      }

      if (reqId !== latestRequestIdRef.current) return;

      // ONLY report Gemini success if source is genuinely 'gemini' and model is returned
      if (res.ok && data.source === 'gemini' && data.model && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setSuggestSource('gemini');
        setActualModelUsed(data.model);
        setSuggestError(null);
      } else {
        const errorMsg = data.message || 'Mô hình Gemini chưa phản hồi.';
        setSuggestError(errorMsg);
        setSuggestSource('curated_fallback');
        setActualModelUsed(null);
        setSuggestions(data.suggestions || FALLBACK_RECOMMENDATIONS);
      }
    } catch (err: any) {
      if (reqId !== latestRequestIdRef.current) return;
      console.error('Stylist call error:', err);
      let errorMsg = err?.message || 'Không thể kết nối đến máy chủ.';
      if (err?.name === 'AbortError') {
        errorMsg = 'Yêu cầu vượt quá thời gian chờ (timeout 30s). Đã chuyển sang mẫu tĩnh dự phòng.';
      }
      setSuggestError(errorMsg);
      setSuggestions(FALLBACK_RECOMMENDATIONS);
      setSuggestSource('curated_fallback');
      setActualModelUsed(null);
    } finally {
      clearTimeout(timeoutId);
      if (reqId === latestRequestIdRef.current) {
        setIsSuggesting(false);
      }
    }
  };

  // Apply suggestion
  const handleApplySuggestion = (rec: StylistRecommendation) => {
    setSelection((prev) => ({
      ...prev,
      garmentId: rec.garmentId,
      colorId: rec.colorId,
      accessoryIds: [rec.accessoryId],
      styleId: rec.styleId,
    }));
    setHasSavedCurrent(false);
  };

  // Handle AI Image Generation
  const handleGenerateAiImage = async () => {
    if (isGeneratingImage) return;
    setIsGeneratingImage(true);
    setImageError(null);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colorId: selection.colorId,
          accessoryId: selection.accessoryIds[0] || 'acc-none',
          styleId: selection.styleId,
          customNote: selection.userNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi tạo ảnh minh họa.');
      }

      setOriginalAiImage(data.imageUrl);
      setRecoloredAiImage(null);
    } catch (err: any) {
      console.error('Image generation failed:', err);
      setImageError(err?.message || 'Không thể tạo ảnh minh họa AI.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle AI Image Recolor
  const handleRecolorImage = async (newColorId: string) => {
    if (!originalAiImage || isRecoloring) return;

    setIsRecoloring(true);
    setRecolorError(null);
    try {
      const res = await fetch('/api/image/recolor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousImageBase64: originalAiImage,
          newColorId,
          currentColorName: currentColor.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi đổi màu sắc áo.');
      }

      setRecoloredAiImage(data.imageUrl);
      setSelection((prev) => ({ ...prev, colorId: newColorId }));
      setHasSavedCurrent(false);
    } catch (err: any) {
      console.error('Recolor failed:', err);
      setRecolorError(err?.message || 'Không thể thực hiện đổi sắc áo.');
    } finally {
      setIsRecoloring(false);
    }
  };

  // Handle Save Outfit to localStorage
  const handleSaveOutfit = () => {
    const entry: SavedOutfitEntry = {
      id: `outfit-${Date.now()}`,
      savedAt: new Date().toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      selection,
      colorName: currentColor.name,
      colorHex: currentColor.hex,
      styleName: currentStyle.name,
      accessoryNames: currentAccessories.map((a) => a.name),
    };

    const updated = [entry, ...savedOutfits];
    setSavedOutfits(updated);
    try {
      localStorage.setItem('viet_phuc_remix_outfits', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    setHasSavedCurrent(true);
  };

  const handleDeleteSavedOutfit = (id: string) => {
    const updated = savedOutfits.filter((item) => item.id !== id);
    setSavedOutfits(updated);
    try {
      localStorage.setItem('viet_phuc_remix_outfits', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage delete failed:', e);
    }
  };

  const handleLoadSavedOutfit = (entry: SavedOutfitEntry) => {
    setSelection(entry.selection);
    setIsDrawerOpen(false);
    setHasSavedCurrent(true);
    setActiveView('flow');
    setCurrentStep(3);
  };

  const stepsList = [
    { num: 1, label: 'Dịp mặc' },
    { num: 2, label: 'Hiện vật nguồn' },
    { num: 3, label: 'Sắc áo & Phụ kiện' },
    { num: 4, label: 'Gợi ý Gemini' },
    { num: 5, label: 'Minh họa AI' },
    { num: 6, label: 'Phiếu tóm tắt' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F0E4] text-[#30251F] flex flex-col font-sans selection:bg-[#9F1D26]/15 selection:text-[#30251F]">
      {/* 1. EDITORIAL LANDING VIEW */}
      {activeView === 'landing' && (
        <EditorialLanding
          selection={selection}
          onUpdateSelection={setSelection}
          onGoToStep={(step) => {
            setActiveView('flow');
            setCurrentStep(step);
          }}
          onOpenSavedDrawer={() => setIsDrawerOpen(true)}
          savedCount={savedOutfits.length}
        />
      )}

      {/* 2. 6-STEP STYLING FLOW HEADER */}
      {activeView === 'flow' && (
        <header className="sticky top-0 z-40 bg-[#F7F0E4]/95 backdrop-blur-md border-b border-[#DECFB9]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            {/* Brand Emblem & Wordmark */}
            <button
              type="button"
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A] rounded-xs"
              aria-label="Về trang mở đầu Việt phục Remix"
            >
              <BraidedFlowerLogo className="w-8 h-8 shrink-0" />
              <div>
                <span className="font-serif-display font-bold text-lg text-[#30251F] tracking-tight group-hover:text-[#8E101A] transition-colors block leading-tight">
                  Việt phục Remix
                </span>
                <span className="text-[10px] text-[#30251F]/60 font-medium uppercase tracking-wider block font-sans">
                  Gợi ý trang phục học đường
                </span>
              </div>
            </button>

            {/* Clean Editorial Navigation */}
            <nav className="flex items-center gap-4 sm:gap-6 text-xs font-medium">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="min-h-[44px] flex items-center text-[#8E101A] font-semibold border-b-2 border-[#8E101A]"
              >
                Phối đồ
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="min-h-[44px] flex items-center text-[#30251F]/80 hover:text-[#8E101A] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A] rounded-xs"
              >
                Tư liệu
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="min-h-[44px] flex items-center gap-1.5 text-[#30251F] hover:text-[#8E101A] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A] rounded-xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#8E101A]" />
                <span>Đã lưu</span>
                <span className="text-[11px] text-[#30251F]/60 font-mono">({savedOutfits.length})</span>
              </button>
            </nav>
          </div>

          {/* Stepper Bar (Active only when in 6-step styling workflow) */}
          <div className="border-t border-[#DECFB9]/60 bg-[#FFFBF4]/80 py-2">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
              <div className="overflow-x-auto no-scrollbar flex items-center gap-1 min-w-max">
                {stepsList.map((s, idx) => {
                  const isActive = currentStep === s.num;
                  const isPast = currentStep > s.num;
                  return (
                    <React.Fragment key={s.num}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(s.num)}
                        className={`min-h-[38px] flex items-center gap-1.5 py-1 px-3 text-xs font-medium rounded-xs transition-all ${
                          isActive
                            ? 'bg-[#8E101A] text-white shadow-xs font-semibold'
                            : isPast
                            ? 'text-[#486657] hover:bg-[#DECFB9]/30 font-medium'
                            : 'text-[#30251F]/50 hover:text-[#30251F]'
                        }`}
                      >
                        <span className="font-mono text-[11px] opacity-85">{s.num}.</span>
                        <span>{s.label}</span>
                        {isPast && <Check className="w-3 h-3 text-[#486657]" />}
                      </button>
                      {idx < stepsList.length - 1 && (
                        <span className="text-[#DECFB9] text-xs px-1">·</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveView('landing')}
                className="text-xs text-[#30251F]/70 hover:text-[#8E101A] shrink-0 font-medium underline underline-offset-4 hidden sm:inline-block"
              >
                ← Trang mở đầu
              </button>
            </div>
          </div>
        </header>
      )}

      {/* VIEW 2: 6-STEP STYLING FLOW */}
      {activeView === 'flow' && (
        <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6">
          {/* STEP 1: CHỌN DỊP MẶC */}
          {currentStep === 1 && (
            <section className="space-y-5">
              <div className="border-b border-[#DECFB9] pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#9F1D26] font-semibold">
                  Bước 1 / 6
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
                  Chọn bối cảnh & dịp mặc
                </h2>
                <p className="text-xs text-[#30251F]/70 mt-1">
                  Bối cảnh Ngày hội văn hóa ở trường: sinh viên tìm hiểu trang phục truyền thống qua tư liệu hiện vật cụ thể và gợi ý phối đồ học đường.
                </p>
              </div>

              {/* Occasion Card */}
              <div className="bg-[#FFFBF4] border border-[#DECFB9] p-5 sm:p-6 rounded-sm shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#9F1D26] font-mono uppercase tracking-wider mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Dịp được chỉ định cho đề án</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#30251F]">
                      {OCCASION_DATA.name}
                    </h3>
                    <p className="text-xs text-[#30251F]/60 font-serif italic mt-0.5">
                      {OCCASION_DATA.subTitle}
                    </p>
                    <p className="text-xs text-[#30251F]/80 mt-3 leading-relaxed">
                      {OCCASION_DATA.description}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#30251F] text-white text-[10px] font-mono uppercase tracking-wider shrink-0 rounded-xs">
                    Mặc định
                  </span>
                </div>

                {/* Guidelines for students */}
                <div className="mt-4 pt-4 border-t border-[#DECFB9]">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#30251F] mb-2.5">
                    Lưu ý thực tế cho sinh viên tham gia ngày hội (đối chiếu tư liệu):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {OCCASION_DATA.studentTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#30251F]/80">
                        <span className="text-[#486657] font-bold mt-0.5">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 bg-[#9F1D26] hover:bg-[#79171E] text-white text-xs font-semibold rounded-xs shadow transition-all"
                >
                  <span>Sang bước 2: Hiện vật tham chiếu</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 2: CHỌN MẪU THAM CHIẾU TƯ LIỆU */}
          {currentStep === 2 && (
            <section className="space-y-5">
              <div className="border-b border-[#DECFB9] pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#9F1D26] font-semibold">
                  Bước 2 / 6
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
                  Mẫu nghiên cứu tham chiếu
                </h2>
                <p className="text-xs text-[#30251F]/70 mt-1">
                  Dữ kiện nguồn duy nhất: Bài viết của Bảo tàng Lịch sử Quốc gia về hiện vật tiếp nhận.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Garment details card */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-[#FFFBF4] border border-[#DECFB9] p-5 rounded-sm shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#486657] font-semibold">
                        HIỆN VẬT THAM CHIẾU NGUỒN
                      </span>
                      <span className="text-[11px] bg-[#F7F0E4] border border-[#DECFB9] px-2 py-0.5 text-[#30251F] font-medium rounded-xs">
                        1 hiện vật nguồn
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#30251F]">
                      {currentGarment.name}
                    </h3>

                    {/* Scientific Scope Limitation */}
                    <div className="bg-[#9F1D26]/5 border-l-2 border-[#9F1D26] p-3 text-xs text-[#79171E] leading-relaxed">
                      <p className="font-semibold mb-0.5">Giới hạn khoa học:</p>
                      <p>
                        Đây là mô tả của MỘT hiện vật cụ thể do Bảo tàng Lịch sử Quốc gia tiếp nhận, không khái quát hóa cho mọi áo ngũ thân. Không tự thêm cổ đứng, chiều dài tay, biểu tượng màu sắc hay ý nghĩa không có trong nguồn.
                      </p>
                    </div>

                    {/* Exact Facts from Museum Article */}
                    <div className="bg-[#F7F0E4] p-3.5 rounded-xs border border-[#DECFB9] space-y-2 text-xs">
                      <div className="font-semibold text-[#30251F] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#9F1D26]" />
                        <span>Dữ kiện nguồn từ bài viết Bảo tàng:</span>
                      </div>
                      <ul className="space-y-1.5 text-[#30251F]/85 pl-1">
                        <li>• <strong>Người may & chất liệu:</strong> {CULTURAL_ARTIFACT_MUSEUM.sourceFacts.craft} {CULTURAL_ARTIFACT_MUSEUM.sourceFacts.material}</li>
                        <li>• <strong>Cấu tạo hai lớp:</strong> {CULTURAL_ARTIFACT_MUSEUM.sourceFacts.layers}</li>
                        <li>• <strong>Hệ thống cúc:</strong> {CULTURAL_ARTIFACT_MUSEUM.sourceFacts.buttons}</li>
                        <li>• <strong>Ống tay:</strong> {CULTURAL_ARTIFACT_MUSEUM.sourceFacts.sleeves}</li>
                        <li>• <strong>Hoa văn:</strong> {CULTURAL_ARTIFACT_MUSEUM.sourceFacts.patterns}</li>
                        <li>• <strong>Phong thái:</strong> {CULTURAL_ARTIFACT_MUSEUM.sourceFacts.bearing}</li>
                      </ul>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs">
                      <a
                        href={CULTURAL_ARTIFACT_MUSEUM.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#486657] hover:underline font-semibold"
                      >
                        <span>Xem nguồn: Bài viết Bảo tàng Lịch sử Quốc gia</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Vector diagram preview */}
                <div className="md:col-span-5">
                  <GarmentDiagram selectedColor={currentColor} styleMode={currentStyle.name} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 border border-[#DECFB9] text-[#30251F] text-xs font-semibold rounded-xs hover:bg-[#FFFBF4]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại bước 1</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 bg-[#9F1D26] hover:bg-[#79171E] text-white text-xs font-semibold rounded-xs shadow transition-all"
                >
                  <span>Sang bước 3: Sắc áo & Phụ kiện</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 3: CHỌN SẮC ÁO, PHỤ KIỆN & PHONG CÁCH */}
          {currentStep === 3 && (
            <section className="space-y-6">
              <div className="border-b border-[#DECFB9] pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#9F1D26] font-semibold">
                  Bước 3 / 6
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
                  Sắc áo, phụ kiện & phong cách
                </h2>
                <p className="text-xs text-[#30251F]/70 mt-1">
                  Phân biệt rõ: Dữ kiện nguồn hiện vật vs Các gợi ý phối hiện đại mở rộng cho sinh viên.
                </p>
              </div>

              {/* 1. Style Selector */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#9F1D26]" />
                  <h3 className="font-serif font-bold text-sm text-[#30251F]">
                    1. Chọn phong cách định hướng
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALLOWLIST_STYLES.map((st) => {
                    const isSelected = selection.styleId === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelection((prev) => ({ ...prev, styleId: st.id }))}
                        className={`text-left p-4 rounded-sm border transition-all ${
                          isSelected
                            ? 'border-[#9F1D26] bg-[#FFFBF4] ring-2 ring-[#9F1D26] shadow-xs'
                            : 'border-[#DECFB9] bg-[#FFFBF4]/80 hover:border-[#9F1D26]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${st.isSourceFact ? 'text-[#486657]' : 'text-[#9F1D26]'}`}>
                            {st.badge}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#9F1D26]" />}
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#30251F]">
                          {st.name}
                        </h4>
                        <p className="text-xs text-[#30251F]/75 mt-1 leading-relaxed">
                          {st.shortDesc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Color Palette Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#9F1D26]" />
                    <h3 className="font-serif font-bold text-sm text-[#30251F]">
                      2. Chọn bảng màu thân áo
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#30251F]/60 font-serif italic">
                    * Màu đen ngoài lót trắng là theo hiện vật nguồn; các màu khác là gợi ý mở rộng.
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ALLOWLIST_COLORS.map((col) => {
                    const isSelected = selection.colorId === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelection((prev) => ({ ...prev, colorId: col.id }))}
                        className={`p-3 text-left rounded-sm border transition-all bg-[#FFFBF4] ${
                          isSelected
                            ? 'border-[#9F1D26] ring-2 ring-[#9F1D26] shadow-xs'
                            : 'border-[#DECFB9] hover:border-[#9F1D26]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-5 h-5 rounded-full border border-black/20 shrink-0 shadow-xs"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span className={`text-[10px] font-mono font-medium line-clamp-1 uppercase ${col.isSourceFact ? 'text-[#486657] font-bold' : 'text-[#9F1D26]'}`}>
                            {col.badge}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#30251F] line-clamp-1">
                          {col.name}
                        </h4>
                        <p className="text-[11px] text-[#30251F]/70 mt-1 line-clamp-2">
                          {col.shortDesc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Accessory Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#9F1D26]" />
                    <h3 className="font-serif font-bold text-sm text-[#30251F]">
                      3. Phụ kiện đi kèm (Gợi ý phối cho sinh viên)
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#30251F]/60 font-serif italic">
                    * Hiện vật nguồn chỉ mô tả chiếc áo
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {ALLOWLIST_ACCESSORIES.map((acc) => {
                    const isSelected = selection.accessoryIds.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          if (acc.id === 'acc-none') {
                            setSelection((prev) => ({ ...prev, accessoryIds: ['acc-none'] }));
                          } else {
                            const withoutNone = selection.accessoryIds.filter((id) => id !== 'acc-none');
                            const alreadyIn = withoutNone.includes(acc.id);
                            const nextIds = alreadyIn
                              ? withoutNone.filter((id) => id !== acc.id)
                              : [...withoutNone, acc.id];
                            setSelection((prev) => ({
                              ...prev,
                              accessoryIds: nextIds.length > 0 ? nextIds : ['acc-none'],
                            }));
                          }
                        }}
                        className={`min-h-[44px] p-3 text-left rounded-sm border transition-all ${
                          isSelected
                            ? 'bg-[#FFFBF4] border-[#486657] ring-1 ring-[#486657]'
                            : 'bg-[#FFFBF4] border-[#DECFB9] hover:border-[#9F1D26]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-[#486657] uppercase font-semibold">
                            {acc.badge}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#486657]" />}
                        </div>
                        <h4 className="font-serif font-semibold text-xs text-[#30251F]">
                          {acc.name}
                        </h4>
                        <p className="text-[11px] text-[#30251F]/70 mt-0.5 line-clamp-2">
                          {acc.shortDesc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#DECFB9]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 border border-[#DECFB9] text-[#30251F] text-xs font-semibold rounded-xs hover:bg-[#FFFBF4]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 bg-[#9F1D26] hover:bg-[#79171E] text-white text-xs font-semibold rounded-xs shadow transition-all"
                >
                  <span>Sang bước 4: Gợi ý từ Gemini</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 4: GỢI Ý TỪ GEMINI */}
          {currentStep === 4 && (
            <section className="space-y-6">
              <div className="border-b border-[#DECFB9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#9F1D26] font-semibold">
                    Bước 4 / 6
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
                    Stylist Gemini gợi ý bộ phối
                  </h2>
                  <p className="text-xs text-[#30251F]/70 mt-1">
                    Hệ thống AI đề xuất 2 phương án thời trang dựa trên danh mục kiểm duyệt nghiêm ngặt.
                  </p>
                </div>

                {/* Primary Call Button */}
                <button
                  type="button"
                  disabled={isSuggesting}
                  onClick={handleAskStylist}
                  className="min-h-[44px] flex items-center justify-center gap-2 px-6 py-2.5 bg-[#9F1D26] hover:bg-[#79171E] disabled:bg-[#9F1D26]/50 text-white text-xs font-semibold rounded-xs shadow transition-colors shrink-0"
                >
                  {isSuggesting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang gọi Gemini stylist...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{hasCalledStylist ? 'Gọi lại Gemini gợi ý' : 'Nhờ Gemini gợi ý 2 bộ phối'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Notification Banner (Honest & Clean) */}
              {!hasCalledStylist ? (
                <div className="p-4 bg-[#FFFBF4] border border-[#DECFB9] text-[#30251F] rounded-sm text-xs flex items-start gap-3 shadow-xs">
                  <Info className="w-4 h-4 text-[#B18C52] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#30251F]">
                      Mẫu minh họa tĩnh — chưa gọi Gemini
                    </span>
                    <p className="text-[#30251F]/80 text-[11px] mt-0.5 leading-relaxed">
                      Bấm nút <strong>&ldquo;Nhờ Gemini gợi ý 2 bộ phối&rdquo;</strong> ở trên để máy chủ gọi mô hình AI phân tích cấu hình hiện tại của bạn. Hai thẻ bên dưới hiện là mẫu tĩnh để bạn tham khảo trước.
                    </p>
                  </div>
                </div>
              ) : suggestSource === 'gemini' ? (
                <div className="p-4 bg-[#FFFBF4] border-2 border-[#486657] text-[#30251F] rounded-sm text-xs flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#486657]" />
                    <span>
                      Gợi ý trực tiếp từ: <strong className="font-mono text-[#486657]">Gemini Stylist</strong> (đối chiếu danh mục chuẩn).
                    </span>
                  </div>
                  <span className="text-[11px] text-[#486657] font-mono uppercase tracking-wider font-semibold">
                    2 đề xuất AI
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-[#FFFBF4] border-2 border-[#B18C52] text-[#30251F] rounded-sm text-xs space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#79171E]">
                    <AlertTriangle className="w-4 h-4 text-[#9F1D26]" />
                    <span>Mẫu tĩnh dự phòng — Gemini chưa phản hồi</span>
                  </div>
                  <p className="text-[#30251F]/80 text-[11px] leading-relaxed">
                    <strong>Nguyên nhân:</strong> {suggestError || 'Mô hình AI hiện đang bận hoặc quá thời gian chờ.'}
                  </p>
                  <p className="text-[#30251F]/70 text-[11px]">
                    Hệ thống không giả danh AI. Bạn có thể chọn mẫu tĩnh dự phòng bên dưới hoặc tiếp tục tự phối thủ công ở bước 3.
                  </p>
                </div>
              )}

              {/* Technical Details Disclosure (Tucked cleanly away from the main experience) */}
              <details className="text-xs text-[#30251F]/75 bg-[#FFFBF4] border border-[#DECFB9] p-3 rounded-xs group">
                <summary className="cursor-pointer font-medium hover:text-[#9F1D26] flex items-center justify-between list-none">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#B18C52]" />
                    <span>Chi tiết kỹ thuật (Mô hình & máy chủ)</span>
                  </span>
                  <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-2.5 pt-2.5 border-t border-[#DECFB9] space-y-1 text-[11px] text-[#30251F]/80 font-mono">
                  <p>• Mô hình chính: <code>gemini-3.8-flash</code> (thinkingLevel: LOW, timeout 12s)</p>
                  <p>• Mô hình dự phòng: <code>gemini-3.7-flash</code> (kích hoạt khi 429/503/timeout)</p>
                  <p>• Mô hình phản hồi thực tế: <code>{actualModelUsed || 'Chưa phản hồi (Mẫu tĩnh)'}</code></p>
                  <p>• Nguồn dữ liệu: <code>{suggestSource || 'Chưa gọi'}</code></p>
                  <p>• Ràng buộc: Khóa reason/badge theo chuẩn tư liệu bảo tàng, chống ảo giác.</p>
                </div>
              </details>

              {/* 2 Suggested Outfits Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((rec) => {
                  const recColor = ALLOWLIST_COLORS.find((c) => c.id === rec.colorId);
                  const recAccessory = ALLOWLIST_ACCESSORIES.find((a) => a.id === rec.accessoryId);
                  const recStyle = ALLOWLIST_STYLES.find((s) => s.id === rec.styleId);
                  const isSelected =
                    selection.colorId === rec.colorId &&
                    selection.accessoryIds.includes(rec.accessoryId) &&
                    selection.styleId === rec.styleId;

                  const sourceBadge = !hasCalledStylist
                    ? 'Mẫu minh họa tĩnh — chưa gọi Gemini'
                    : suggestSource === 'gemini'
                    ? `Gemini • ${actualModelUsed || 'gemini-3.8-flash'}`
                    : 'Mẫu tĩnh dự phòng — Gemini chưa phản hồi';

                  return (
                    <div
                      key={rec.id}
                      className={`bg-[#FFFBF4] border-2 p-5 rounded-sm flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-[#9F1D26] shadow-md ring-1 ring-[#9F1D26]'
                          : 'border-[#DECFB9] hover:border-[#9F1D26]/30'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Prominent source status label on card */}
                        <div className="flex flex-col gap-1 border-b border-[#DECFB9] pb-2">
                          <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                            !hasCalledStylist
                              ? 'text-[#30251F]/60'
                              : suggestSource === 'gemini'
                              ? 'text-[#486657]'
                              : 'text-[#B18C52]'
                          }`}>
                            {sourceBadge}
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-[#9F1D26] font-bold">
                              {rec.highlightTag}
                            </span>
                            {isSelected && (
                              <span className="text-[11px] text-[#486657] font-semibold flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Đang áp dụng
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="font-serif text-lg font-bold text-[#30251F]">
                          {rec.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-[#30251F]/85 bg-[#F7F0E4] p-3 rounded-xs border border-[#DECFB9]">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: recColor?.hex }}
                            />
                            <span><strong>Màu áo:</strong> {recColor?.name}</span>
                          </div>
                          <p><strong>Phong cách:</strong> {recStyle?.name}</p>
                          <p><strong>Phụ kiện:</strong> {recAccessory?.name}</p>
                        </div>

                        <p className="text-xs text-[#30251F]/75 italic leading-relaxed">
                          &ldquo;{rec.reason}&rdquo;
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-[#DECFB9] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleApplySuggestion(rec)}
                          className={`w-full min-h-[44px] py-2 px-3 text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#486657] text-white'
                              : 'bg-[#9F1D26] hover:bg-[#79171E] text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã chọn bộ phối này</span>
                            </>
                          ) : (
                            <span>Chọn áp dụng bộ phối này</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Manual Edit summary banner */}
              <div className="bg-[#FFFBF4] border border-[#DECFB9] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#30251F]">
                    Bộ phối hiện hành của bạn:
                  </h4>
                  <p className="text-xs text-[#30251F]/80 mt-0.5">
                    Áo {currentColor.name} · {currentStyle.name} · {currentAccessories.map((a) => a.name).join(', ') || 'Không phụ kiện'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="min-h-[44px] flex items-center text-xs font-semibold text-[#9F1D26] hover:underline shrink-0"
                >
                  Tùy chỉnh thủ công tại bước 3 →
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 border border-[#DECFB9] text-[#30251F] text-xs font-semibold rounded-xs hover:bg-[#FFFBF4]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 bg-[#9F1D26] hover:bg-[#79171E] text-white text-xs font-semibold rounded-xs shadow transition-all"
                >
                  <span>Sang bước 5: Tạo minh họa AI</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 5: TẠO HÌNH ẢNH AI MINH HỌA */}
          {currentStep === 5 && (
            <section className="space-y-6">
              <div className="border-b border-[#DECFB9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#9F1D26] font-semibold">
                    Bước 5 / 6
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
                    Minh họa hình ảnh concept
                  </h2>
                  <p className="text-xs text-[#30251F]/70 mt-1">
                    Mô hình hình ảnh AI Studio (<span className="font-mono text-[#486657]">gemini-3.1-flash-image</span>).
                  </p>
                </div>

                {/* Primary Image Generate Button */}
                <button
                  type="button"
                  disabled={isGeneratingImage}
                  onClick={handleGenerateAiImage}
                  className="min-h-[44px] flex items-center justify-center gap-2 px-6 py-2.5 bg-[#9F1D26] hover:bg-[#79171E] disabled:bg-[#9F1D26]/50 text-white text-xs font-semibold rounded-xs shadow transition-colors shrink-0"
                >
                  {isGeneratingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mô hình đang sinh ảnh...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span>{originalAiImage ? 'Tạo lại minh họa AI mới' : 'Bấm tạo minh họa AI'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error or quota warning */}
              {imageError && (
                <div className="p-4 bg-[#FFFBF4] border border-[#B18C52] text-[#30251F] rounded-sm text-xs space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-[#79171E]">
                    <AlertTriangle className="w-4 h-4 text-[#9F1D26]" />
                    <span>Chưa thể sinh ảnh AI lúc này: {imageError}</span>
                  </div>
                  <p className="text-[#30251F]/80 text-[11px] leading-relaxed">
                    Nếu mô hình bận, bạn vẫn có thể tham khảo sơ đồ cấu trúc áo bên dưới và tiếp tục sang bước 6 để lưu cấu hình bộ phối.
                  </p>
                </div>
              )}

              {/* Main Visual Display */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7">
                  {originalAiImage ? (
                    <ImageComparison
                      originalImage={originalAiImage}
                      recoloredImage={recoloredAiImage}
                      selectedColor={currentColor}
                      isRecoloring={isRecoloring}
                      recolorError={recolorError}
                      onRecolor={handleRecolorImage}
                      onResetRecolor={() => setRecoloredAiImage(null)}
                    />
                  ) : (
                    <div className="space-y-3">
                      <GarmentDiagram selectedColor={currentColor} styleMode={currentStyle.name} />
                      <div className="text-center">
                        <button
                          type="button"
                          disabled={isGeneratingImage}
                          onClick={handleGenerateAiImage}
                          className="w-full min-h-[44px] py-2.5 px-4 bg-[#9F1D26] hover:bg-[#79171E] disabled:bg-[#9F1D26]/40 text-white text-xs font-semibold rounded-xs shadow transition-colors flex items-center justify-center gap-2"
                        >
                          {isGeneratingImage ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Đang gọi mô hình tạo ảnh...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Bấm &ldquo;Tạo minh họa bằng AI&rdquo; để xem ảnh mẫu</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar with Configuration Specs */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-[#FFFBF4] border border-[#DECFB9] p-4 sm:p-5 rounded-sm space-y-3 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-[#486657] font-mono uppercase tracking-wider font-semibold">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Thông số bộ phối hiện tại</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#30251F]">
                      {currentGarment.name}
                    </h3>

                    <div className="space-y-2 text-xs border-t border-[#DECFB9] pt-2 text-[#30251F]/85">
                      <div>
                        <span className="font-semibold block text-[#30251F]">Màu sắc áo:</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: currentColor.hex }}
                          />
                          <span>{currentColor.name}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold block text-[#30251F]">Phong cách:</span>
                        <p className="text-[#30251F]/70">{currentStyle.name}</p>
                      </div>
                      <div>
                        <span className="font-semibold block text-[#30251F]">Phụ kiện:</span>
                        <p className="text-[#30251F]/70">
                          {currentAccessories.map((a) => a.name).join(', ') || 'Không thêm phụ kiện'}
                        </p>
                      </div>
                    </div>

                    {/* Disclaimers & Ethics */}
                    <div className="pt-2 border-t border-[#DECFB9] text-[11px] text-[#30251F]/70 space-y-1.5 leading-relaxed">
                      <p className="font-medium text-[#9F1D26]">
                        Quy chuẩn công nghệ:
                      </p>
                      <p>
                        • Ảnh concept được tạo từ mô tả văn bản; không sử dụng ảnh hiện vật bảo tàng hay ảnh cá nhân.
                      </p>
                      <p>
                        • Ảnh minh họa AI không phải hiện vật sa kép, không khẳng định hoa văn hay chất liệu trong ảnh là tư liệu bảo tàng.
                      </p>
                    </div>
                  </div>

                  {/* Quick Save button right in Step 5 */}
                  <button
                    type="button"
                    onClick={handleSaveOutfit}
                    className={`w-full min-h-[44px] py-2.5 px-4 text-xs font-semibold rounded-xs border transition-colors flex items-center justify-center gap-2 ${
                      hasSavedCurrent
                        ? 'bg-[#486657] text-white border-[#486657]'
                        : 'bg-[#FFFBF4] hover:bg-[#F7F0E4] text-[#30251F] border-[#DECFB9]'
                    }`}
                  >
                    {hasSavedCurrent ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã lưu vào bộ nhớ trình duyệt</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 text-[#9F1D26]" />
                        <span>Lưu bộ phối này</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 border border-[#DECFB9] text-[#30251F] text-xs font-semibold rounded-xs hover:bg-[#FFFBF4]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại bước 4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 bg-[#9F1D26] hover:bg-[#79171E] text-white text-xs font-semibold rounded-xs shadow transition-all"
                >
                  <span>Sang bước 6: Thẻ văn hóa & Lưu</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 6: THẺ TƯ LIỆU VĂN HÓA & HOÀN TẤT */}
          {currentStep === 6 && (
            <section className="space-y-6">
              <div className="border-b border-[#DECFB9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#9F1D26] font-semibold">
                    Bước 6 / 6
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
                    Thẻ tư liệu văn hóa & Hoàn tất
                  </h2>
                  <p className="text-xs text-[#30251F]/70 mt-1">
                    Tôn vinh nguồn sử liệu chính thức duy nhất, lưu cấu hình trình duyệt và xuất phiếu phối đồ cho ngày hội.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveOutfit}
                    className={`min-h-[44px] px-5 py-2 text-xs font-semibold rounded-xs border transition-colors flex items-center gap-1.5 ${
                      hasSavedCurrent
                        ? 'bg-[#486657] text-white border-[#486657]'
                        : 'bg-[#9F1D26] hover:bg-[#79171E] text-white border-transparent shadow'
                    }`}
                  >
                    {hasSavedCurrent ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã lưu bộ phối</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        <span>Lưu bộ phối vào máy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Cultural Card with Museum Link */}
              <CulturalCard />

              {/* Final Outfit Summary Slip */}
              <div className="bg-[#FFFBF4] border border-[#DECFB9] p-5 rounded-sm space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#DECFB9] pb-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#30251F] font-semibold">
                    Phiếu tóm tắt bộ phối sinh viên
                  </div>
                  <span className="text-[11px] font-mono text-[#486657] font-semibold">
                    Ngày hội văn hóa học đường
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#30251F]/60 block mb-0.5">Trang phục:</span>
                    <span className="font-serif font-bold text-sm text-[#30251F]">{currentGarment.name}</span>
                  </div>
                  <div>
                    <span className="text-[#30251F]/60 block mb-0.5">Sắc áo:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: currentColor.hex }}
                      />
                      <span className="font-medium text-[#30251F]">{currentColor.name}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#30251F]/60 block mb-0.5">Phụ kiện & Phong cách:</span>
                    <span className="text-[#30251F] font-medium">
                      {currentAccessories.map((a) => a.name).join(', ') || 'Không phụ kiện'} ({currentStyle.name})
                    </span>
                  </div>
                </div>

                <div className="bg-[#F7F0E4] p-3 text-xs text-[#30251F]/80 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#DECFB9]">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[#30251F]">Lưu ý phiên lưu trữ:</span>
                    <p className="text-[11px] text-[#30251F]/70">
                      Cấu hình lưu lâu dài trên trình duyệt của bạn qua localStorage. Ảnh AI chỉ lưu trong phiên hiện tại trừ khi bạn đã tải xuống.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `[Việt phục Remix - Ngày hội văn hóa]\nÁo: Ngũ thân nam tay chẽn (${currentColor.name})\nPhong cách: ${currentStyle.name}\nPhụ kiện: ${currentAccessories.map((a) => a.name).join(', ')}`;
                      navigator.clipboard.writeText(text);
                      alert('Đã sao chép tóm tắt bộ phối vào bộ nhớ tạm để chia sẻ với bạn bè!');
                    }}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-1.5 text-xs bg-[#FFFBF4] border border-[#DECFB9] text-[#30251F] rounded-xs hover:border-[#9F1D26] shrink-0 font-medium"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#9F1D26]" />
                    <span>Sao chép tóm tắt</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 border border-[#DECFB9] text-[#30251F] text-xs font-semibold rounded-xs hover:bg-[#FFFBF4]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại ảnh minh họa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setActiveView('landing');
                  }}
                  className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 bg-[#9F1D26] text-white text-xs font-semibold rounded-xs hover:bg-[#79171E] shadow transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Về trang mở đầu</span>
                </button>
              </div>
            </section>
          )}
        </main>
      )}

      {/* Editorial Magazine Footer */}
      <footer className="mt-auto border-t border-[#DECFB9] bg-[#F7F0E4] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#30251F]/70">
          <div>
            <span className="font-serif font-bold text-[#30251F]">Việt phục Remix</span> · Ứng dụng gợi ý phối trang phục học đường trên nền tảng tư liệu bảo tàng.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CULTURAL_ARTIFACT_MUSEUM.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9F1D26] hover:underline font-medium"
            >
              Hồ sơ Bảo tàng Lịch sử Quốc gia
            </a>
            <span>·</span>
            <span>Nguồn tham khảo: Bài viết hiện vật Bảo tàng Lịch sử Quốc gia tiếp nhận</span>
          </div>
        </div>
      </footer>

      {/* Saved Outfits Drawer Modal */}
      <SavedOutfitsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedOutfits={savedOutfits}
        onLoadOutfit={handleLoadSavedOutfit}
        onDeleteOutfit={handleDeleteSavedOutfit}
      />
    </div>
  );
}
