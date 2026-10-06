import React, { useState } from 'react';
import { Bookmark, ArrowRight, Menu, X } from 'lucide-react';
import { OutfitSelection } from '../data/catalog';
import { BraidedFlowerLogo, HeadlineFlourish, LeafBranchOrnament } from './HeritageOrnaments';
import { LookComposerPanel } from './LookComposerPanel';
import { DiscoveryRibbon } from './DiscoveryRibbon';
import { heroBg } from '../assets/assetUrls';

interface EditorialLandingProps {
  selection: OutfitSelection;
  onUpdateSelection: (updater: (prev: OutfitSelection) => OutfitSelection) => void;
  onGoToStep: (step: number) => void;
  onOpenSavedDrawer: () => void;
  savedCount: number;
}

export const EditorialLanding: React.FC<EditorialLandingProps> = ({
  selection,
  onUpdateSelection,
  onGoToStep,
  onOpenSavedDrawer,
  savedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F0E4] text-[#30251F] flex flex-col font-sans selection:bg-[#8E101A]/20 selection:text-[#30251F]">
      {/* 1. SEAMLESS HERO SCENE:
          - Mobile (<768px): Photo layer is 390px tall. Copy at y=100px. Panel starts at y=400px in normal flow.
          - Tablet (768..1279px): Photo layer is 460px tall. Copy font 62px at left-24px, y=100px. Panel in normal flow starts at ~484px, centered with max-w-[760px].
          - Desktop (>=1280px / xl): 3-zone layout (left copy, center model face clear, right floating panel at right:3vw, top:110px, width:32vw). Hero height xl:h-[720px].
      */}
      <section
        className="relative w-full overflow-hidden bg-[#F7F0E4] xl:h-[720px]"
        aria-label="Cảnh chính Việt phục Remix"
      >
        {/* Background photo layer:
            Mobile: 390px tall.
            Tablet: 460px tall.
            Desktop: Full bleed cover layer.
        */}
        <div className="absolute top-0 left-0 w-full h-[390px] md:h-[460px] xl:h-full overflow-hidden pointer-events-none z-0">
          <img
            src={heroBg}
            alt="Cảnh thời trang Việt phục lụa đỏ và hiên gỗ truyền thống"
            className="w-full h-full object-cover object-[20%_30%] md:object-[35%_25%] xl:object-[58%_top]"
          />
          {/* Subtle ivory wash:
              Left side gradient ensuring high contrast for typography and buttons.
              Right side remains 100% crisp and unwashed.
          */}
          <div
            className="absolute inset-0 pointer-events-none xl:hidden"
            style={{
              background:
                'linear-gradient(to right, rgba(247, 240, 228, 0.85) 0%, rgba(247, 240, 228, 0.45) 45%, rgba(247, 240, 228, 0) 65%)',
            }}
          />
          <div
            className="hidden xl:block absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(247, 240, 228, 0.72) 0%, rgba(247, 240, 228, 0.35) 32%, rgba(247, 240, 228, 0) 52%)',
            }}
          />
        </div>

        {/* 2. HEADER ON SCENE (Height 68px, xl:h-[78px]) */}
        <header className="relative z-40 w-full h-[68px] xl:h-[78px] px-4 sm:px-6 xl:px-[3.5vw] flex items-center justify-between">
          {/* Subtle brass/vermilion corner ornament on left (visible on tablet/desktop) */}
          <div className="absolute left-1 top-1 pointer-events-none opacity-25 select-none hidden sm:block">
            <LeafBranchOrnament className="w-14 h-14" />
          </div>

          {/* Brand Logo & Wordmark - Compact on mobile & tablet */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <BraidedFlowerLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-xs" />
            <div>
              <span className="font-serif-display font-bold text-[21px] sm:text-2xl text-[#8E101A] tracking-tight block leading-tight">
                Việt phục Remix
              </span>
              <span className="hidden xl:block text-[10px] text-[#30251F]/70 font-mono uppercase tracking-widest font-sans">
                Gợi ý trang phục học đường
              </span>
            </div>
          </div>

          {/* Desktop Navigation: Only shown on xl (>=1280px) on ivory pill surface */}
          <nav className="hidden xl:flex items-center gap-7 text-xs font-medium bg-[#F7EEDD]/90 backdrop-blur-xs border border-[#DECFB9]/90 px-5 py-1.5 rounded-full shadow-xs text-[#30251F]">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('composer-panel');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="min-h-[36px] flex items-center text-[#30251F]/90 hover:text-[#8E101A] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A]"
            >
              Ngũ thân
            </button>

            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="min-h-[36px] flex items-center text-[#30251F]/90 hover:text-[#8E101A] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A]"
            >
              Ngày hội văn hóa
            </button>

            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="min-h-[36px] flex items-center text-[#30251F]/90 hover:text-[#8E101A] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A]"
            >
              Sắc áo
            </button>

            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="min-h-[36px] flex items-center text-[#30251F]/90 hover:text-[#8E101A] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A]"
            >
              Tư liệu
            </button>

            <span className="w-px h-3.5 bg-[#DECFB9]" />

            <button
              type="button"
              onClick={onOpenSavedDrawer}
              className="min-h-[36px] flex items-center gap-1.5 text-[#30251F] hover:text-[#8E101A] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A]"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#8E101A]" />
              <span>Đã lưu</span>
              <span className="text-[11px] font-mono text-[#30251F]/65">({savedCount})</span>
            </button>
          </nav>

          {/* Compact Menu & Saved Buttons (<1280px: Mobile & Tablet) */}
          <div className="xl:hidden flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenSavedDrawer}
              className="min-h-[44px] min-w-[44px] px-2.5 py-1 bg-[#F7EEDD]/95 border border-[#DECFB9] rounded-full flex items-center justify-center gap-1 text-xs text-[#30251F] shadow-xs active:scale-95"
              aria-label="Xem bộ phối đã lưu"
            >
              <Bookmark className="w-4 h-4 text-[#8E101A]" />
              <span className="text-[11px] font-mono font-medium">({savedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] bg-[#F7EEDD]/95 border border-[#DECFB9] rounded-full flex items-center justify-center text-[#30251F] hover:text-[#8E101A] shadow-xs active:scale-95"
              aria-label="Mở menu điều hướng"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Compact Dropdown Nav Menu (<1280px) */}
        {mobileMenuOpen && (
          <div className="xl:hidden relative z-50 bg-[#F7EEDD] border-b border-[#DECFB9] px-5 py-4 shadow-lg space-y-3">
            <button
              type="button"
              onClick={() => {
                onGoToStep(1);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-sm font-medium text-[#30251F] hover:text-[#8E101A] flex items-center justify-between"
            >
              <span>Ngày hội văn hóa</span>
              <ArrowRight className="w-4 h-4 text-[#8E101A]" />
            </button>
            <button
              type="button"
              onClick={() => {
                onGoToStep(3);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-sm font-medium text-[#30251F] hover:text-[#8E101A] flex items-center justify-between"
            >
              <span>Sắc áo & Phụ kiện</span>
              <ArrowRight className="w-4 h-4 text-[#8E101A]" />
            </button>
            <button
              type="button"
              onClick={() => {
                onGoToStep(2);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-sm font-medium text-[#30251F] hover:text-[#8E101A] flex items-center justify-between"
            >
              <span>Tư liệu hiện vật nguồn</span>
              <ArrowRight className="w-4 h-4 text-[#8E101A]" />
            </button>
          </div>
        )}

        {/* 3. HERO CONTENT:
            - Mobile (<768px): Wrapper flow-root (y=68px). Copy top-[32px] => H1 y=100px. Panel pt-[332px] => starts y=400px.
            - Tablet (768..1279px): Wrapper flow-root. Copy top-[32px] left-6 => H1 y=100px, font 62px. Panel pt-[416px] => starts y=484px, max-w-[760px] centered in normal flow (does not cover model face).
            - Desktop (>=1280px / xl): xl:absolute xl:inset-0. Left copy at xl:left-[3.5vw], xl:top-[110px]. Floating right panel at xl:right-[3vw], xl:top-[110px], xl:w-[32vw].
        */}
        <div className="relative z-30 flow-root xl:absolute xl:inset-0">
          {/* Left Column: Headline, Tagline, CTA Button & AI Label */}
          <div className="absolute top-[32px] left-4 md:left-6 max-w-[225px] min-[375px]:max-w-[240px] md:max-w-[420px] xl:left-[3.5vw] xl:top-[110px] xl:w-[40vw] xl:max-w-[550px] space-y-2.5 md:space-y-4">
            {/* Grand Headline: Exactly 2 lines (Việt phục / Remix), Line 1 whitespace-nowrap */}
            <div className="space-y-0.5">
              <h1 className="font-serif-display font-normal text-[40px] min-[375px]:text-[44px] md:text-[62px] xl:text-[clamp(88px,7.6vw,118px)] text-[#8E101A] tracking-[-0.035em] leading-[0.9] select-none">
                <span className="block whitespace-nowrap">Việt phục</span>
                <span className="block italic text-[#8E101A]">Remix</span>
              </h1>

              {/* Decorative underline flourish */}
              <HeadlineFlourish className="w-40 min-[375px]:w-48 sm:w-56 md:w-60 xl:w-64 h-5 sm:h-7 -mt-1" />
            </div>

            {/* Tagline */}
            <p className="font-serif text-[15px] min-[375px]:text-base md:text-xl xl:text-[25px] text-[#30251F]/90 font-normal italic leading-snug">
              Phối theo gu, hiểu nét Việt
            </p>

            {/* CTA Pill Button (Red pill with slender arrow) */}
            <div className="pt-0.5 space-y-2">
              <button
                type="button"
                onClick={() => onGoToStep(1)}
                className="w-[215px] min-[375px]:w-[230px] md:w-[260px] min-h-[44px] sm:min-h-[50px] bg-[#8E101A] hover:bg-[#700C14] text-white font-medium text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 sm:gap-3 group active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8E101A]"
              >
                <span className="tracking-wide">Phối ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Short AI Label with clear contrast */}
              <div className="inline-flex items-center gap-1.5 text-[10px] text-[#30251F] bg-[#F7EEDD]/95 px-2 py-0.5 rounded-full border border-[#DECFB9]/70 shadow-xs">
                <span className="font-mono text-[#8E101A] font-bold uppercase tracking-wider text-[9px]">
                  Minh họa AI
                </span>
                <span>· Gợi ý phối hiện đại</span>
              </div>
            </div>
          </div>

          {/* Right Column: LookComposerPanel
              - Mobile (<768px): mt-0 pt-[332px] => starts at y=400px cleanly below 390px photo on ivory background.
              - Tablet (768..1279px): mt-0 pt-[416px] => starts at y=484px cleanly below 460px photo, centered with max-w-[760px] in normal flow.
              - Desktop (>=1280px / xl): xl:absolute xl:right-[3vw] xl:top-[110px] xl:w-[32vw] xl:max-w-[460px] xl:pt-0 xl:mx-0.
          */}
          <div
            id="composer-panel"
            className="mt-0 pt-[332px] md:pt-[416px] xl:pt-0 px-4 md:px-6 xl:px-0 pb-8 xl:pb-0 w-full md:max-w-[760px] md:mx-auto xl:mx-0 xl:absolute xl:right-[3vw] xl:top-[110px] xl:w-[32vw] xl:max-w-[460px] xl:min-w-[390px]"
          >
            <LookComposerPanel
              selection={selection}
              onUpdateSelection={onUpdateSelection}
              onGoToStep={onGoToStep}
            />
          </div>
        </div>
      </section>

      {/* 4. DISCOVERY RIBBON (Curved paper wave divider overlapping hero by 70px & 3 horizontal editorial sections) */}
      <DiscoveryRibbon
        onGoToStep={onGoToStep}
        onSelectColor={(colorId) => {
          onUpdateSelection((prev) => ({
            ...prev,
            colorId,
            styleId:
              colorId === 'color-sa-kep-den-lot-trang'
                ? 'style-tham-chieu-tu-lieu'
                : 'style-remix-duong-dai',
          }));
        }}
      />
    </div>
  );
};
