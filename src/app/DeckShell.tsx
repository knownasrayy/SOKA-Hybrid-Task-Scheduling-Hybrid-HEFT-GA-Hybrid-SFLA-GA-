import React, { useState, useEffect } from 'react';
import { SPEAKER_NOTES } from './speakerNotes';
import { Canvas3D } from '../three/Canvas3D';
import { StorylineModal } from '../storyline/StorylineModal';
import { StorylineOverlayDock } from '../storyline/StorylineOverlayDock';
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  Maximize,
  Minimize,
  FileText,
  Clock,
  Compass,
  X,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Sparkles,
  Presentation
} from 'lucide-react';

// Import All 25 Slides
import { Slide01Cover } from '../slides/Slide01Cover';
import { Slide02Ketentuan } from '../slides/Slide02Ketentuan';
import { Slide03MasalahCloud } from '../slides/Slide03MasalahCloud';
import { Slide04TaksonomiPola } from '../slides/Slide04TaksonomiPola';
import { Slide05PetaPilihan } from '../slides/Slide05PetaPilihan';
import { Slide06HeftGaOverview } from '../slides/Slide06HeftGaOverview';
import { Slide07HeftInteractive } from '../slides/Slide07HeftInteractive';
import { Slide08GaInteractive } from '../slides/Slide08GaInteractive';
import { Slide09HeftGaIntegration } from '../slides/Slide09HeftGaIntegration';
import { Slide10HeftGaSpec } from '../slides/Slide10HeftGaSpec';
import { Slide11SflaGaOverview } from '../slides/Slide11SflaGaOverview';
import { Slide12SflaInteractive } from '../slides/Slide12SflaInteractive';
import { Slide13SflaGaMemeplex } from '../slides/Slide13SflaGaMemeplex';
import { Slide14SflaGaShuffle } from '../slides/Slide14SflaGaShuffle';
import { Slide15SflaGaSpec } from '../slides/Slide15SflaGaSpec';
import { Slide16SetupEksperimen } from '../slides/Slide16SetupEksperimen';
import { Slide17SimulatorLive } from '../slides/Slide17SimulatorLive';
import { Slide18HasilStatistik } from '../slides/Slide18HasilStatistik';
import { Slide19WinnerSpotlight } from '../slides/Slide19WinnerSpotlight';
import { Slide20WinnerDeepDive } from '../slides/Slide20WinnerDeepDive';
import { Slide21Perbandingan3Arah } from '../slides/Slide21Perbandingan3Arah';
import { Slide22KesimpulanDaftarPustaka } from '../slides/Slide22KesimpulanDaftarPustaka';
import { Slide23RealWorldScenario } from '../slides/Slide23RealWorldScenario';
import { Slide24WhatIfDashboard } from '../slides/Slide24WhatIfDashboard';
import { Slide25RekomendasiIndustri } from '../slides/Slide25RekomendasiIndustri';

const SLIDES_REGISTRY = [
  { id: 1, title: 'Cover & Pembuka', section: 'A · Pembuka', component: Slide01Cover },
  { id: 2, title: 'Ketentuan Tugas', section: 'A · Pembuka', component: Slide02Ketentuan },
  { id: 3, title: 'Formulasi Masalah Cloud', section: 'A · Pembuka', component: Slide03MasalahCloud },
  { id: 4, title: 'Taksonomi Hybrid', section: 'A · Pembuka', component: Slide04TaksonomiPola },
  { id: 5, title: 'Peta Pilihan & Referensi', section: 'A · Pembuka', component: Slide05PetaPilihan },
  { id: 6, title: 'Overview HEFT-GA', section: 'B · Hybrid HEFT-GA', component: Slide06HeftGaOverview },
  { id: 7, title: 'HEFT Interaktif', section: 'B · Hybrid HEFT-GA', component: Slide07HeftInteractive },
  { id: 8, title: 'GA Interaktif', section: 'B · Hybrid HEFT-GA', component: Slide08GaInteractive },
  { id: 9, title: 'Integrasi HEFT→GA', section: 'B · Hybrid HEFT-GA', component: Slide09HeftGaIntegration },
  { id: 10, title: 'Spesifikasi HEFT-GA', section: 'B · Hybrid HEFT-GA', component: Slide10HeftGaSpec },
  { id: 11, title: 'Overview SFLA-GA', section: 'C · Hybrid SFLA-GA', component: Slide11SflaGaOverview },
  { id: 12, title: 'SFLA Interaktif', section: 'C · Hybrid SFLA-GA', component: Slide12SflaInteractive },
  { id: 13, title: 'GA dalam Memeplex', section: 'C · Hybrid SFLA-GA', component: Slide13SflaGaMemeplex },
  { id: 14, title: 'Global Shuffle', section: 'C · Hybrid SFLA-GA', component: Slide14SflaGaShuffle },
  { id: 15, title: 'Spesifikasi SFLA-GA', section: 'C · Hybrid SFLA-GA', component: Slide15SflaGaSpec },
  { id: 16, title: 'Setup Eksperimen', section: 'D · Eksperimen & Pemenang', component: Slide16SetupEksperimen },
  { id: 17, title: 'Simulator Live', section: 'D · Eksperimen & Pemenang', component: Slide17SimulatorLive },
  { id: 18, title: 'Hasil & Uji Statistik', section: 'D · Eksperimen & Pemenang', component: Slide18HasilStatistik },
  { id: 19, title: 'Winner Spotlight', section: 'D · Eksperimen & Pemenang', component: Slide19WinnerSpotlight },
  { id: 20, title: 'Deep Dive Pemenang', section: 'D · Eksperimen & Pemenang', component: Slide20WinnerDeepDive },
  { id: 21, title: 'Perbandingan 3 Arah', section: 'D · Eksperimen & Pemenang', component: Slide21Perbandingan3Arah },
  { id: 22, title: 'Kesimpulan & Referensi', section: 'D · Eksperimen & Pemenang', component: Slide22KesimpulanDaftarPustaka },
  { id: 23, title: 'Studi Kasus Real World', section: 'E · Demo 2 Real World', component: Slide23RealWorldScenario },
  { id: 24, title: 'Dashboard What-If', section: 'E · Demo 2 Real World', component: Slide24WhatIfDashboard },
  { id: 25, title: 'Rekomendasi Industri', section: 'E · Demo 2 Real World', component: Slide25RekomendasiIndustri }
];

export const DeckShell: React.FC = () => {
  // Two first-class views: 'story3d' (default full-screen 3D Storyline) vs 'ppt' (25-slide deck)
  const [viewMode, setViewMode] = useState<'story3d' | 'ppt'>('story3d');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showPresenter, setShowPresenter] = useState(false);
  const [showDiagramModal, setShowDiagramModal] = useState(false);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [is2DFallback, setIs2DFallback] = useState(false);
  const [isHudHidden, setIsHudHidden] = useState(false);
  const [qualityMode, setQualityMode] = useState<'high' | 'balanced' | 'perf'>('balanced');
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const [isOverlayMinimized, setIsOverlayMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Presenter Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const totalSlides = SLIDES_REGISTRY.length;

  const cycleQualityMode = () => {
    setQualityMode((prev) => (prev === 'high' ? 'perf' : prev === 'perf' ? 'balanced' : 'high'));
  };

  // Sync URL hash (if user opens #/slide/X directly, switch to PPT mode at that slide)
  useEffect(() => {
    const handleHashChange = () => {
      const match = window.location.hash.match(/#\/slide\/(\d+)/);
      if (match) {
        const slideNum = parseInt(match[1], 10);
        if (slideNum >= 1 && slideNum <= totalSlides) {
          setCurrentSlide(slideNum);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [totalSlides]);

  const goToSlide = (num: number) => {
    const target = Math.max(1, Math.min(totalSlides, num));
    setCurrentSlide(target);
    window.location.hash = `#/slide/${target}`;
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const handleResetCamera = () => {
    setCameraResetKey((k) => k + 1);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (showDiagramModal) return;

      if (viewMode === 'ppt') {
        if (e.key === 'ArrowRight' || (e.key === ' ' && !e.shiftKey)) {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey)) {
          e.preventDefault();
          prevSlide();
        }
      }

      if (e.key === 'g' || e.key === 'G') {
        setShowGrid((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowGrid(false);
        setShowPresenter(false);
        setShowDiagramModal(false);
      } else if (e.key === 'p' || e.key === 'P') {
        setShowPresenter((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'e' || e.key === 'E') {
        setIsExploreMode((prev) => !prev);
      } else if (e.key === '2') {
        setIs2DFallback((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        handleResetCamera();
      } else if (e.key === 'h' || e.key === 'H') {
        setIsHudHidden((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        cycleQualityMode();
      } else if (e.key === 's' || e.key === 'S') {
        setViewMode((m) => (m === 'story3d' ? 'ppt' : 'story3d'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, viewMode, showDiagramModal]);

  // Timer Tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentSlideObj = SLIDES_REGISTRY[currentSlide - 1];
  const CurrentComponent = currentSlideObj.component;
  const currentNotes = SPEAKER_NOTES[currentSlide];

  return (
    <div className="h-screen h-[100dvh] w-screen flex flex-col bg-its-cyber overflow-hidden select-none relative font-sans text-its-navy">
      {/* Persistent Sunlit 3D Floating Archipelago Canvas */}
      {!is2DFallback && (
        <Canvas3D
          currentSlide={currentSlide}
          isExploreMode={isExploreMode}
          qualityMode={qualityMode}
          resetKey={cameraResetKey}
          className="absolute inset-0 pointer-events-auto z-0"
        />
      )}

      {/* Discrete floating pill when HUD is hidden */}
      {isHudHidden && (
        <button
          onClick={() => setIsHudHidden(false)}
          className="fixed top-4 right-4 z-50 its-glass-heavy border border-its-blue/40 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-its-navy hover:border-its-blue shadow-its-card cursor-pointer"
        >
          Tampilkan HUD (H)
        </button>
      )}

      {/* Clean Single-Row Top Header (Bright Frosted ITS Identity 2026) */}
      {!isHudHidden && (
        <header className="relative z-30 h-14 shrink-0 px-4 md:px-5 flex items-center justify-between gap-3 border-b border-its-blue/20 its-glass-heavy text-xs font-mono">
          {/* Left: Official ITS Brand Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-its-cover text-white shadow-sm whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-its-gold" />
              <span className="font-extrabold tracking-wider text-xs">ITS HYBRIDLAB</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-its-blue text-white font-bold">SOKA</span>
            </div>
          </div>

          {/* Center: Prominent Two-Mode Switcher (3D Storyline vs Versi PPT) */}
          <div className="flex items-center p-1 rounded-xl bg-sky-100/90 border border-its-blue/20 shrink-0">
            <button
              onClick={() => {
                setViewMode('story3d');
                setIs2DFallback(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'story3d'
                  ? 'bg-its-blue text-white shadow-sm'
                  : 'text-its-navy hover:bg-white/70'
              }`}
              title="Mode Analogi 3D & Storyline Interaktif (S)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Storyline</span>
            </button>

            <button
              onClick={() => setViewMode('ppt')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'ppt'
                  ? 'bg-its-blue text-white shadow-sm'
                  : 'text-its-navy hover:bg-white/70'
              }`}
              title="Versi Slide Presentasi PPT Lengkap 25 Slide (S)"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Versi PPT (25 Slide)</span>
            </button>
          </div>

          {/* Right: Compact Single-Line Controls (Zero Wrapping!) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!is2DFallback && (
              <button
                onClick={() => {
                  setIsExploreMode(!isExploreMode);
                  if (!isExploreMode) setIsOverlayMinimized(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isExploreMode
                    ? 'bg-its-gold text-its-navy border-amber-500 shadow-sm'
                    : 'bg-white border-its-blue/25 text-its-navy hover:border-its-blue hover:bg-sky-50'
                }`}
                title="Toggle Orbit 360° & Zoom Bebas (E)"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">{isExploreMode ? 'Orbit Aktif' : 'Orbit 360°'}</span>
                <kbd className="text-[9px] px-1 rounded bg-its-navy/10 text-its-navy font-bold">E</kbd>
              </button>
            )}

            {!is2DFallback && (
              <button
                onClick={handleResetCamera}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-its-blue/25 bg-white hover:bg-sky-50 hover:border-its-blue text-its-navy text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                title="Reset Posisi Kamera 3D (R)"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0 text-its-blue" />
                <span className="hidden xl:inline">Reset</span>
                <kbd className="text-[9px] px-1 rounded bg-its-navy/10 text-its-navy font-bold">R</kbd>
              </button>
            )}

            {viewMode === 'ppt' && (
              <button
                onClick={() => setIs2DFallback(!is2DFallback)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  is2DFallback
                    ? 'bg-its-navy text-white border-its-navy'
                    : 'bg-white text-its-navy border-its-blue/25 hover:border-its-blue'
                }`}
                title="Toggle 3D WebGL / 2D Polos (2)"
              >
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">{is2DFallback ? '2D' : '3D'}</span>
              </button>
            )}

            <button
              onClick={() => setShowPresenter(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-its-blue/25 bg-white hover:bg-sky-50 hover:border-its-blue text-its-navy text-xs font-bold cursor-pointer whitespace-nowrap"
              title="Catatan Presenter & Timer (P)"
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-its-blue" />
              <span className="hidden lg:inline">Presenter</span>
              <kbd className="text-[9px] px-1 rounded bg-its-navy/10 text-its-navy font-bold">P</kbd>
            </button>

            <button
              onClick={() => setShowGrid(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-its-blue/25 bg-white hover:bg-sky-50 hover:border-its-blue text-its-navy text-xs font-bold cursor-pointer whitespace-nowrap"
              title="Daftar Isi 25 Slide (G)"
            >
              <Grid className="w-3.5 h-3.5 shrink-0 text-its-blue" />
              <span className="hidden lg:inline">Menu</span>
              <kbd className="text-[9px] px-1 rounded bg-its-navy/10 text-its-navy font-bold">G</kbd>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg border border-its-blue/25 bg-white hover:bg-sky-50 hover:border-its-blue text-its-navy cursor-pointer shrink-0"
              title="Layar Penuh (F)"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>
      )}

      {/* Explore Mode Banner (Crisp High-Contrast Daylight Style!) */}
      {isExploreMode && !is2DFallback && !isHudHidden && (
        <div className="relative z-30 shrink-0 bg-amber-100/95 border-b border-amber-400 text-its-navy px-4 py-1.5 text-xs font-mono flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="truncate">
              <strong>Mode Orbit 360° Aktif:</strong> Klik & seret mouse untuk putar kepulauan 3D, scroll untuk zoom, klik objek untuk inspeksi.
            </span>
          </div>
          {viewMode === 'ppt' && (
            <button
              onClick={() => setIsOverlayMinimized(!isOverlayMinimized)}
              className="px-3 py-1 rounded-lg bg-its-navy text-white font-bold hover:bg-its-blue transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isOverlayMinimized ? 'Tampilkan Kartu Slide' : 'Sembunyikan Kartu Slide'}
            </button>
          )}
        </div>
      )}

      {/* MODE 1: FULL-SCREEN 3D STORYLINE & ANALOGY DOCK */}
      {viewMode === 'story3d' && !isHudHidden && (
        <StorylineOverlayDock
          onWaypointChange={(wp) => setCurrentSlide(wp)}
          onOpenPptAtSlide={(slideNum) => {
            goToSlide(slideNum);
            setViewMode('ppt');
          }}
          onOpenDiagramModal={() => setShowDiagramModal(true)}
          isExploreMode={isExploreMode}
        />
      )}

      {/* MODE 2: VERSI PPT — ITS 2026 KEYNOTE STUDIO (DISTINCT FROM LECTURER DECK) */}
      {viewMode === 'ppt' && (
        <div className="flex-1 min-h-0 relative z-10 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 flex items-stretch gap-4 px-3 pt-3 pb-16 md:px-6 md:pt-4 md:pb-20 overflow-hidden pointer-events-none">
            {/* Left Vertical Chapter Rail (Desktop XL) */}
            {!isHudHidden && !isOverlayMinimized && (
              <aside className="hidden xl:flex flex-col w-52 shrink-0 its-glass-heavy rounded-2xl overflow-hidden pointer-events-auto border border-its-blue/25 shadow-its-card">
                <div className="px-3.5 py-2.5 bg-gradient-to-r from-its-cover to-its-blue text-white flex items-center justify-between">
                  <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest">Alur Presentasi</span>
                  <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-its-gold text-its-navy">
                    {currentSlide}/{totalSlides}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
                  {[
                    { code: 'A', label: 'Pendahuluan', start: 1, end: 5 },
                    { code: 'B', label: 'Hybrid HEFT-GA', start: 6, end: 10 },
                    { code: 'C', label: 'Hybrid SFLA-GA', start: 11, end: 15 },
                    { code: 'D', label: 'Eksperimen & Hasil', start: 16, end: 22 },
                    { code: 'E', label: 'Demo Real World', start: 23, end: 25 }
                  ].map((sec) => {
                    const isActive = currentSlide >= sec.start && currentSlide <= sec.end;
                    const isPassed = currentSlide > sec.end;
                    return (
                      <div
                        key={sec.code}
                        className={`rounded-xl p-2 transition-all border ${
                          isActive
                            ? 'bg-sky-50/95 border-its-blue/40 shadow-sm'
                            : 'bg-white/50 border-transparent hover:bg-white/90 hover:border-its-blue/20'
                        }`}
                      >
                        <button
                          onClick={() => goToSlide(sec.start)}
                          className="w-full text-left flex items-center gap-2 cursor-pointer"
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-black shrink-0 ${
                              isActive
                                ? 'bg-its-cover text-its-gold shadow-sm'
                                : isPassed
                                ? 'bg-its-blue/15 text-its-blue'
                                : 'bg-slate-100 text-its-silver'
                            }`}
                          >
                            {sec.code}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-xs font-bold truncate ${
                                isActive ? 'text-its-navy' : 'text-its-navy/75'
                              }`}
                            >
                              {sec.label}
                            </div>
                            <div className="text-[10px] font-mono text-its-silver">
                              Slide {sec.start}–{sec.end}
                            </div>
                          </div>
                        </button>

                        {isActive && (
                          <div className="mt-2 pt-1.5 border-t border-its-blue/15 flex flex-wrap gap-1">
                            {SLIDES_REGISTRY.slice(sec.start - 1, sec.end).map((s) => (
                              <button
                                key={s.id}
                                onClick={() => goToSlide(s.id)}
                                title={s.title}
                                className={`h-5 px-1.5 rounded-md font-mono text-[10px] font-bold transition-all cursor-pointer ${
                                  s.id === currentSlide
                                    ? 'bg-its-blue text-white shadow-sm'
                                    : 'bg-white text-its-navy/70 border border-its-blue/15 hover:border-its-blue hover:text-its-blue'
                                }`}
                              >
                                {s.id}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 border-t border-its-blue/15 bg-sky-50/60">
                  <button
                    onClick={() => {
                      setViewMode('story3d');
                      setIs2DFallback(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-its-cover text-white hover:bg-its-blue font-mono text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-its-gold" />
                    <span>Buka 3D Storyline</span>
                  </button>
                </div>
              </aside>
            )}

            {/* Main ITS 2026 Keynote Frame */}
            <main className="flex-1 min-w-0 min-h-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-full h-full max-w-6xl max-h-full its-keynote-frame rounded-3xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto relative ${
                  isOverlayMinimized ? 'opacity-10 scale-95 hover:opacity-95' : 'opacity-100 scale-100'
                }`}
              >
                {/* Top Official ITS Tricolor Accent Ribbon */}
                <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-its-cover via-its-blue to-its-gold" />

                {/* Keynote Frame Subtle Top Metadata Bar */}
                <div className="px-5 md:px-7 py-2 shrink-0 flex items-center justify-between border-b border-its-blue/10 bg-gradient-to-r from-sky-50/70 via-white/80 to-amber-50/40 text-[11px] font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-its-blue shrink-0" />
                    <span className="font-bold text-its-cover uppercase tracking-wider truncate">
                      {currentSlideObj.section}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 text-its-silver">
                    <span className="hidden sm:inline font-semibold text-its-blue">ITS · Departemen TI · SOKA 2026</span>
                    <span className="px-2 py-0.5 rounded-full bg-its-cover/10 text-its-cover font-extrabold">
                      SLIDE {currentSlide.toString().padStart(2, '0')} / {totalSlides}
                    </span>
                  </div>
                </div>

                {/* Slide Content Area with Subtle Blueprint Dot-Grid */}
                <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-7 its-dot-grid relative">
                  <CurrentComponent />
                </div>
              </div>
            </main>
          </div>

          {/* Floating Navy Capsule Dock (Original Keynote Navigation — Zero Resemblance to Full-Width Footer) */}
          {!isHudHidden && (
            <div className="pointer-events-none fixed inset-x-0 bottom-3 md:bottom-4 z-30 flex justify-center px-3">
              <nav className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 rounded-full bg-its-navy/95 backdrop-blur-xl text-white border border-its-blue/40 shadow-2xl max-w-full">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide <= 1}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-its-blue text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  title="Slide Sebelumnya (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5 px-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-its-gold text-its-navy font-mono text-[11px] font-black shrink-0">
                    {currentSlide.toString().padStart(2, '0')} / {totalSlides}
                  </span>

                  <div className="hidden sm:flex flex-col min-w-0 max-w-[240px] md:max-w-[320px]">
                    <span className="text-xs font-bold text-white truncate leading-tight">
                      {currentSlideObj.title}
                    </span>
                    <div className="w-full h-1 mt-1 bg-white/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-its-gold transition-all duration-300 rounded-full"
                        style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowGrid(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-sky-200 transition-all cursor-pointer shrink-0"
                  title="Daftar Isi Semua Slide (G)"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide >= totalSlides}
                  className="h-8 px-3.5 rounded-full flex items-center gap-1 bg-its-gold hover:bg-amber-300 text-its-navy font-mono text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-sm"
                  title="Slide Berikutnya (→ / Spasi)"
                >
                  <span className="hidden sm:inline">Lanjut</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Grid Modal / Table of Contents (G) */}
      {showGrid && (
        <div className="fixed inset-0 z-50 bg-its-navy/45 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="its-glass-heavy rounded-3xl max-w-4xl w-full max-h-[85vh] p-6 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-its-blue/20 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-its-blue text-white">
                  <Grid className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-xl text-its-navy">Daftar Isi Presentasi ({totalSlides} Slide)</h3>
                  <span className="text-xs font-mono text-its-silver">Klik kartu untuk membuka slide di Versi PPT</span>
                </div>
              </div>
              <button
                onClick={() => setShowGrid(false)}
                className="p-1.5 rounded-xl border border-its-blue/25 bg-white hover:bg-sky-50 text-its-navy cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-5 gap-3 p-1">
              {SLIDES_REGISTRY.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    goToSlide(s.id);
                    setViewMode('ppt');
                    setShowGrid(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    currentSlide === s.id
                      ? 'bg-its-blue text-white border-its-blue font-bold shadow-its-glow'
                      : 'bg-white border-its-blue/20 hover:border-its-blue hover:bg-sky-50 text-its-navy'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={`font-black ${currentSlide === s.id ? 'text-its-gold' : 'text-its-blue'}`}>
                      #{s.id.toString().padStart(2, '0')}
                    </span>
                    <span className={`truncate max-w-[65px] ${currentSlide === s.id ? 'text-sky-100' : 'text-its-silver'}`}>
                      {s.section.split('·')[0]}
                    </span>
                  </div>
                  <div className="text-xs font-bold line-clamp-2">{s.title}</div>
                </button>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-its-blue/15 text-xs font-mono text-its-silver flex justify-between">
              <span>Klik kartu slide untuk navigasi langsung</span>
              <span>Tekan <kbd className="px-1.5 py-0.5 rounded bg-sky-50 border border-its-blue/30 font-bold text-its-navy">Esc</kbd> untuk menutup</span>
            </div>
          </div>
        </div>
      )}

      {/* Presenter Notes Modal (P) */}
      {showPresenter && (
        <div className="fixed inset-0 z-50 bg-its-navy/45 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="its-glass-heavy rounded-3xl max-w-2xl w-full p-6 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-its-blue/20 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-its-blue text-white">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-lg text-its-navy">Catatan Presenter (Slide {currentSlide})</h3>
                  <span className="text-xs font-mono text-its-blue font-semibold">{currentNotes?.section}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 border border-its-blue/30 rounded-xl font-mono text-sm font-black text-its-navy">
                <Clock className="w-4 h-4 text-its-blue" />
                <span>{formatTimer(timerSeconds)}</span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 hover:text-its-blue cursor-pointer"
                  title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setTimerSeconds(0);
                    setIsTimerRunning(false);
                  }}
                  className="p-1 hover:text-red-600 cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setShowPresenter(false)}
                className="p-1.5 rounded-xl border border-its-blue/25 bg-white hover:bg-sky-50 text-its-navy cursor-pointer ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 my-2">
              <div className="p-3 bg-sky-50 rounded-xl border border-its-blue/20">
                <span className="text-xs font-mono font-bold text-its-blue block mb-1">Judul Slide Aktif:</span>
                <h4 className="font-extrabold text-base text-its-navy">{currentSlideObj.title}</h4>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-its-blue block mb-2">
                  Poin Bicara untuk Rayhan:
                </span>
                <ul className="space-y-2.5">
                  {currentNotes?.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-its-navy leading-relaxed">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded-full bg-its-gold text-its-navy flex-none mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {currentSlide < totalSlides && (
                <div className="p-3 bg-its-slate rounded-xl border border-its-blue/15 font-mono text-xs">
                  <span className="text-its-silver block text-[10px]">Slide Selanjutnya ({currentSlide + 1}):</span>
                  <span className="font-bold text-its-navy">{SLIDES_REGISTRY[currentSlide].title}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-its-blue/15 flex items-center justify-between text-xs font-mono text-its-silver">
              <span>Estimasi Durasi Slide: ~{currentNotes?.durationMinutes || 1.5} menit</span>
              <button
                onClick={() => setShowPresenter(false)}
                className="its-btn-primary px-4 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                Tutup (P)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional Diagram Explainer Modal */}
      <StorylineModal
        isOpen={showDiagramModal}
        onClose={() => setShowDiagramModal(false)}
        onWaypointChange={(wp) => setCurrentSlide(wp)}
      />
    </div>
  );
};
