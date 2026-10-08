import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, ChevronRight } from 'lucide-react';
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
import { Step3Workbench } from './components/Step3Workbench';
import { CulturalCard } from './components/CulturalCard';
import { SavedOutfitsDrawer, SavedOutfitEntry } from './components/SavedOutfitsDrawer';
import { EditorialLanding } from './components/EditorialLanding';
import { AiTools } from './components/AiTools';
import { LookbookCard } from './components/LookbookCard';
import { selectionKey, readSavedOutfits, persistOutfits } from './services/outfitStorage';
import { BraidedFlowerLogo } from './components/HeritageOrnaments';

export default function App() {
  // Landing, workbench, and lookbook share one selection.
  const [activeView, setActiveView] = useState<'landing' | 'flow'>('landing');

  // Internal view IDs retained for existing landing links: 2 = sources, 3 = workbench, 6 = lookbook.
  const [currentStep, setCurrentStep] = useState<number>(3);

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
  type Step4Status = 'idle' | 'loading' | 'success' | 'fallback' | 'error';
  const [step4Status, setStep4Status] = useState<Step4Status>('idle');
  const [step4StatusCode, setStep4StatusCode] = useState<number | null>(null);
  const [step4ErrorCode, setStep4ErrorCode] = useState<string | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [suggestSource, setSuggestSource] = useState<'gemini' | 'curated_fallback' | null>(null);
  const [actualModelUsed, setActualModelUsed] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<StylistRecommendation[]>(FALLBACK_RECOMMENDATIONS);
  const latestRequestIdRef = useRef<number>(0);

  // AI Image generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageStatusCode, setImageStatusCode] = useState<number | null>(null);
  const [imageErrorCode, setImageErrorCode] = useState<string | null>(null);
  const [originalAiImage, setOriginalAiImage] = useState<string | null>(null);

  // Saved outfits state (localStorage)
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfitEntry[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeSavedId, setActiveSavedId] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [generatedSelectionKey, setGeneratedSelectionKey] = useState<string | null>(null);
  const hasSavedCurrent = savedOutfits.some(entry => selectionKey(entry.selection) === selectionKey(selection));
  const isDirty = !hasSavedCurrent && activeSavedId !== null;

  // Load saved outfits from localStorage on mount
  useEffect(() => {
    try {
      setSavedOutfits(readSavedOutfits(localStorage));
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

  // Handle Gemini Stylist Call (Explicit state machine: idle | loading | success | fallback | error, double-submit protection)
  const handleAskStylist = async () => {
    if (step4Status === 'loading') return; // Prevent double submit

    const reqId = ++latestRequestIdRef.current;
    setStep4Status('loading');
    setSuggestError(null);
    setStep4StatusCode(null);
    setStep4ErrorCode(null);

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
        setStep4Status('fallback');
        setStep4StatusCode(res.status);
        setStep4ErrorCode('INVALID_CONTENT_TYPE');
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
        setStep4Status('fallback');
        setStep4StatusCode(res.status);
        setStep4ErrorCode('PARSE_ERROR');
        setSuggestSource('curated_fallback');
        setActualModelUsed(null);
        setSuggestions(FALLBACK_RECOMMENDATIONS);
        return;
      }

      if (reqId !== latestRequestIdRef.current) return;

      setStep4StatusCode(data.statusCode || res.status);
      setStep4ErrorCode(data.error || null);

      // ONLY report Gemini success if source is genuinely 'gemini' and model is returned
      if (res.ok && data.source === 'gemini' && data.model && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setSuggestSource('gemini');
        setActualModelUsed(data.model);
        setSuggestError(null);
        setStep4Status('success');
      } else {
        const errorMsg = data.message || 'Mô hình Gemini chưa phản hồi.';
        setSuggestError(errorMsg);
        setSuggestSource('curated_fallback');
        setActualModelUsed(null);
        setSuggestions(data.suggestions || FALLBACK_RECOMMENDATIONS);
        setStep4Status('fallback');
      }
    } catch (err: any) {
      if (reqId !== latestRequestIdRef.current) return;
      console.error('Stylist call error:', err);
      let errorMsg = err?.message || 'Không thể kết nối đến máy chủ.';
      let errCode = 'NETWORK_ERROR';
      if (err?.name === 'AbortError') {
        errorMsg = 'Yêu cầu vượt quá thời gian chờ (timeout 30s). Đã chuyển sang mẫu tĩnh dự phòng.';
        errCode = 'CLIENT_TIMEOUT';
      }
      setSuggestError(errorMsg);
      setStep4Status('error');
      setStep4ErrorCode(errCode);
      setSuggestions(FALLBACK_RECOMMENDATIONS);
      setSuggestSource('curated_fallback');
      setActualModelUsed(null);
    } finally {
      clearTimeout(timeoutId);
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
  };

  // Handle AI Image Generation (Double-submit protected, no false quota promises, keeps fallback diagram)
  const handleGenerateAiImage = async () => {
    if (isGeneratingImage) return; // Prevent double submit
    setIsGeneratingImage(true);
    setImageError(null);
    setImageStatusCode(null);
    setImageErrorCode(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 25000);

    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colorId: selection.colorId,
          accessoryId: selection.accessoryIds[0] || 'acc-none',
          accessoryIds: selection.accessoryIds,
          styleId: selection.styleId,
          customNote: selection.userNote,
        }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));
      setImageStatusCode(data.statusCode || res.status);
      setImageErrorCode(data.error || null);

      if (!res.ok) {
        const isQuota = res.status === 429 || data.error === 'QUOTA_EXCEEDED';
        const msg = isQuota
          ? 'Hạn mức tạo ảnh AI hiện không khả dụng (429 Quota). Bạn vẫn có thể tiếp tục phối màu, phụ kiện và lưu cấu hình bình thường.'
          : (data.message || 'Không thể sinh ảnh minh họa AI. Hệ thống vẫn bảo lưu các lựa chọn của bạn.');
        throw new Error(msg);
      }

      if (typeof data.imageUrl !== 'string' || !/^data:image\/(png|jpeg|webp);base64,/.test(data.imageUrl)) throw new Error('Máy chủ chưa trả về ảnh hợp lệ.');
      setGeneratedSelectionKey(selectionKey(selection));
      setOriginalAiImage(data.imageUrl);
    } catch (err: any) {
      console.error('Image generation failed:', err);
      if (err?.name === 'AbortError') {
        setImageError('Yêu cầu tạo ảnh vượt quá thời gian chờ (timeout 25s). Hệ thống vẫn bảo lưu các lựa chọn của bạn.');
        setImageErrorCode('CLIENT_TIMEOUT');
        setImageStatusCode(504);
      } else {
        setImageError(err?.message || 'Không thể tạo ảnh minh họa AI.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsGeneratingImage(false);
    }
  };

  const navigate = (step: number) => {
    setActiveView('flow');
    setCurrentStep(step === 1 ? 3 : step);
    // Native scrolling is only attempted in a real browser.
    if (typeof window.scrollTo === 'function' && !navigator.userAgent.includes('jsdom')) window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSaveOutfit = (saveAsNew = false): boolean => {
    if (hasSavedCurrent && !saveAsNew) return true;
    const existingId = !saveAsNew ? activeSavedId : null;
    const entry: SavedOutfitEntry = {
      id: existingId || `outfit-${crypto.randomUUID()}`,
      savedAt: new Date().toLocaleString('vi-VN'),
      selection: { ...selection, accessoryIds: [...selection.accessoryIds] },
      colorName: currentColor.name, colorHex: currentColor.hex,
      styleName: currentStyle.name, accessoryNames: currentAccessories.map(a => a.name),
    };
    const updated = [entry, ...savedOutfits.filter(item => item.id !== entry.id)].slice(0, 40);
    try {
      persistOutfits(localStorage, updated);
      setSavedOutfits(updated); setActiveSavedId(entry.id); setStorageError(null);
      return true;
    } catch {
      setStorageError('Chưa lưu được trên trình duyệt này. Bộ phối vẫn còn trên màn hình; hãy tải thẻ lookbook để giữ lại.');
      return false;
    }
  };
  const handleDeleteSavedOutfit = (id: string): boolean => {
    const updated = savedOutfits.filter(item => item.id !== id);
    try {
      persistOutfits(localStorage, updated);
      setSavedOutfits(updated); setStorageError(null);
      if (activeSavedId === id) setActiveSavedId(null);
      return true;
    } catch { setStorageError('Chưa xóa được bộ phối trên thiết bị.'); return false; }
  };
  const handleLoadSavedOutfit = (entry: SavedOutfitEntry) => {
    setSelection({ ...entry.selection, accessoryIds: [...entry.selection.accessoryIds] });
    setActiveSavedId(entry.id); setIsDrawerOpen(false); setStorageError(null); navigate(3);
  };
  const closeDrawer = React.useCallback(() => setIsDrawerOpen(false), []);
  const aiImage = generatedSelectionKey === selectionKey(selection) ? originalAiImage : null;
  const saveLabel = hasSavedCurrent ? 'Đã lưu bộ phối' : isDirty ? 'Cập nhật bản đã lưu' : 'Lưu bản phối';

  return <div className="min-h-screen bg-[#F7F0E4] text-[#30251F] flex flex-col font-sans">
    {activeView === 'landing' ? <EditorialLanding selection={selection} onUpdateSelection={setSelection}
      onGoToStep={navigate} onOpenSavedDrawer={() => setIsDrawerOpen(true)} savedCount={savedOutfits.length}/> : <>
      <header className="sticky top-0 z-40 bg-[#F7F0E4]/95 backdrop-blur-md border-b border-[#DECFB9]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setActiveView('landing')} className="flex items-center gap-2.5 text-left min-h-11" aria-label="Về trang mở đầu Việt phục Remix">
            <BraidedFlowerLogo className="w-8 h-8 shrink-0"/><div><span className="font-serif-display font-bold text-lg block leading-tight">Việt phục Remix</span><span className="hidden sm:block text-xs text-[#59473A]">Phối áo ngũ thân cho ngày hội ở trường</span></div>
          </button>
          <nav className="flex items-center gap-3 sm:gap-6 text-sm" aria-label="Điều hướng sản phẩm">
            <button type="button" onClick={() => navigate(3)} className="min-h-11 text-[#8E101A] font-semibold">Phối đồ</button>
            <button type="button" onClick={() => navigate(2)} className="min-h-11 hidden sm:block">Tư liệu</button>
            <button type="button" onClick={() => setIsDrawerOpen(true)} className="min-h-11 flex items-center gap-1"><Bookmark size={16}/><span>Đã lưu ({savedOutfits.length})</span></button>
          </nav>
        </div>
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center gap-4 pb-2 text-sm" aria-label="Luồng tạo bộ phối">
          <button type="button" onClick={() => navigate(3)} aria-current={currentStep === 3 ? 'step' : undefined} className={`min-h-11 px-4 rounded-sm ${currentStep === 3 ? 'bg-[#8E101A] text-white' : ''}`}>1. Xưởng phối</button>
          <ChevronRight size={14}/>
          <button type="button" onClick={() => navigate(6)} aria-current={currentStep === 6 ? 'step' : undefined} className={`min-h-11 px-4 rounded-sm ${currentStep === 6 ? 'bg-[#8E101A] text-white' : ''}`}>2. Lookbook</button>
          <span role="status" className="ml-auto hidden sm:block text-xs text-[#486657]">{hasSavedCurrent ? 'Đã lưu' : isDirty ? 'Chưa lưu thay đổi' : 'Chưa lưu'}</span>
        </nav>
      </header>
      <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-5">
        {storageError && <div role="alert" className="p-4 bg-[#FFFBF4] border border-[#9F1D26] text-sm text-[#9F1D26]">{storageError}</div>}
        {currentStep === 2 ? <section className="max-w-4xl mx-auto space-y-4"><button type="button" onClick={() => navigate(3)} className="min-h-11 underline">Trở về xưởng phối</button><CulturalCard/></section> : currentStep === 6 ? <>
          <LookbookCard selection={selection} onEdit={() => navigate(3)} onSave={() => handleSaveOutfit()} saved={hasSavedCurrent} dirty={isDirty}/>
          {isDirty && <button type="button" onClick={() => handleSaveOutfit(true)} className="min-h-11 px-4 border border-[#DECFB9] rounded-sm text-sm">Lưu thành bộ phối mới</button>}
        </> : <Step3Workbench selection={selection} onUpdateSelection={setSelection} onPrevStep={() => navigate(2)}
          onNextStep={() => navigate(6)} onSaveOutfit={() => handleSaveOutfit()} saveLabel={saveLabel} saved={hasSavedCurrent} dirty={isDirty}
          onSaveAsNew={() => handleSaveOutfit(true)} aiTools={<AiTools selection={selection} status={step4Status} suggestions={suggestions}
            source={suggestSource} model={actualModelUsed} error={suggestError} errorCode={step4ErrorCode}
            onAsk={handleAskStylist} onApply={handleApplySuggestion} image={aiImage} imageBusy={isGeneratingImage}
            imageError={imageError} imageErrorCode={imageErrorCode} onGenerate={handleGenerateAiImage}/>}/>
        }
      </main>
    </>}
    <footer className="mt-auto border-t border-[#DECFB9] py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-sm text-[#59473A] space-y-3">
        <p className="font-serif font-bold text-[#30251F]">Việt phục Remix · Xưởng phối cho ngày hội ở trường</p>
        <div className="flex flex-wrap gap-4"><a href={CULTURAL_ARTIFACT_MUSEUM.sourceUrl} target="_blank" rel="noreferrer" className="underline text-[#486657]">Tư liệu bảo tàng</a><a href="https://github.com/Kiendo321/Viet-Y/issues" target="_blank" rel="noreferrer" className="underline">Góp ý sản phẩm</a></div>
        <details><summary className="cursor-pointer min-h-11">Về bản thử nghiệm & dữ liệu của bạn</summary><div className="space-y-2 max-w-3xl"><p>MVP dành cho học sinh, sinh viên khám phá áo ngũ thân nam trên mẫu dựng sẵn. Hiện hỗ trợ một dịp: ngày hội Việt phục ở trường, sáu sắc áo và các nhóm phụ kiện.</p><p>Bộ phối được lưu trên trình duyệt này. Nếu xóa dữ liệu trình duyệt, bản lưu cũng mất. Khi bấm gọi Gemini, lựa chọn và ghi chú được gửi tới dịch vụ AI của Google; ứng dụng chưa sử dụng ảnh cá nhân.</p><p>Ảnh phối là asset minh họa AI đã chuẩn bị. Ảnh Gemini tạo theo yêu cầu chỉ giữ trong phiên; tải ảnh trước khi đóng trang. Thông tin văn hóa dẫn về tư liệu bảo tàng; các màu remix và phụ kiện là đề xuất sáng tạo.</p></div></details>
      </div>
    </footer>
    <SavedOutfitsDrawer isOpen={isDrawerOpen} onClose={closeDrawer} savedOutfits={savedOutfits}
      onLoadOutfit={handleLoadSavedOutfit} onDeleteOutfit={handleDeleteSavedOutfit}/>
  </div>;
}
