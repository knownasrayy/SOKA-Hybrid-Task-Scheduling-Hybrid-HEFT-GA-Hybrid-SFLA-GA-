import React, { useState, useEffect, useRef } from 'react';
import { SPEAKER_NOTES } from './speakerNotes';
import { Canvas3D } from '../three/Canvas3D';
import { StorylineModal } from '../storyline/StorylineModal';
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
  Layers,
  Sparkles
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
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showPresenter, setShowPresenter] = useState(false);
  const [showStoryline, setShowStoryline] = useState(false);
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

  // Handle URL hash sync
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

      if (e.key === 'ArrowRight' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'g' || e.key === 'G' || e.key === 'Escape') {
        setShowGrid((prev) => !prev);
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
        setShowStoryline((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

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
    <div className="h-screen w-screen flex flex-col bg-its-cyber overflow-hidden select-none relative font-sans text-white">
      {/* 3D WebGL Background Scene */}
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
          className="fixed top-4 right-4 z-50 its-glass border border-its-blue/50 px-3 py-1.5 rounded-xl text-xs font-mono text-its-silver hover:text-white hover:border-its-gold transition-all shadow-its-glow cursor-pointer"
        >
          Tampilkan HUD (H)
        </button>
      )}

      {/* Top Cybernetic Header (ITS Identity 2026) */}
      {!isHudHidden && (
        <header className="relative z-20 h-12 px-5 flex items-center justify-between border-b border-its-blue/30 its-glass text-xs font-mono">
          <div className="flex items-center gap-3">
            {/* Official ITS Techno-Shield Wordmark */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-its-darkNavy/80 border border-its-blue/40 shadow-its-glow">
              <span className="w-2.5 h-2.5 rounded-full bg-its-gold animate-pulse" />
              <span className="font-extrabold text-white tracking-wider text-xs">ITS HYBRIDLAB</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-its-blue text-white font-mono font-bold">SOKA</span>
            </div>

            <span className="text-its-blue-light/30 hidden md:inline">|</span>
            <span className="hidden md:inline text-its-silver/80 text-xs font-mono truncate max-w-xs">
              Optimasi Cloud · HEFT-GA vs SFLA-GA
            </span>
          </div>

          {/* Toolbar Controls */}
          <div className="flex items-center gap-2">
            {/* Storyline Mode (Tombol 'S') */}
            <button
              onClick={() => setShowStoryline(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-its-gold/60 bg-gradient-to-r from-its-gold/20 to-its-blue/20 text-its-gold hover:text-white hover:border-its-gold text-xs font-mono font-bold shadow-its-gold transition-all cursor-pointer animate-pulse"
              title="Mode Cerita & Bioskop SOKA (Tombol S)"
            >
              <Sparkles className="w-3.5 h-3.5 text-its-gold" />
              <span>Storyline (S)</span>
            </button>

            {/* Quality Mode Toggle (Tombol 'M') */}
            {!is2DFallback && (
              <button
                onClick={cycleQualityMode}
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-its-blue/30 bg-its-darkNavy/80 hover:bg-its-blue/20 text-its-silver hover:text-white text-xs font-mono transition-all cursor-pointer"
                title="Ganti Mode Kualitas Grafis (M)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {qualityMode === 'high' ? 'High' : qualityMode === 'perf' ? 'Perf' : 'Balanced'}
                </span>
                <kbd className="text-[9px] px-1 rounded bg-black/40 text-its-silver border border-white/10">M</kbd>
              </button>
            )}

            {/* 3D / 2D Fallback Toggle (Tombol '2') */}
            <button
              onClick={() => setIs2DFallback(!is2DFallback)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                is2DFallback
                  ? 'bg-its-darkNavy text-its-silver border-its-blue/30'
                  : 'bg-its-blue/30 text-its-gold border-its-gold/50 shadow-its-glow'
              }`}
              title="Toggle 3D WebGL / 2D Fallback (2)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{is2DFallback ? '2D Mode' : '3D WebGL'}</span>
              <kbd className="text-[9px] px-1 rounded bg-black/40 text-its-silver border border-white/10">2</kbd>
            </button>

            {/* Reset Camera (Tombol 'R') */}
            {!is2DFallback && (
              <button
                onClick={handleResetCamera}
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-its-blue/30 bg-its-darkNavy/80 hover:bg-its-blue/20 text-its-silver hover:text-white text-xs font-mono transition-all cursor-pointer"
                title="Reset Posisi Kamera 3D (R)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
                <kbd className="text-[9px] px-1 rounded bg-black/40 text-its-silver border border-white/10">R</kbd>
              </button>
            )}

            {/* Explore Orbit Mode (Tombol 'E') */}
            {!is2DFallback && (
              <button
                onClick={() => {
                  setIsExploreMode(!isExploreMode);
                  if (!isExploreMode) setIsOverlayMinimized(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  isExploreMode
                    ? 'bg-its-gold text-its-deepNavy border-its-gold font-bold shadow-its-gold'
                    : 'bg-its-darkNavy/80 border-its-blue/30 text-its-silver hover:text-white'
                }`}
                title="Toggle Orbit Drag & Zoom Bebas 3D (E)"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isExploreMode ? 'Orbit Bebas' : 'Waypoint'}</span>
                <kbd className="text-[9px] px-1 rounded bg-black/40 text-its-silver border border-white/10">E</kbd>
              </button>
            )}

            {/* Presenter Notes Modal (Tombol 'P') */}
            <button
              onClick={() => setShowPresenter(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-its-blue/30 bg-its-darkNavy/80 hover:bg-its-blue/20 text-its-silver hover:text-white cursor-pointer"
              title="Catatan Pembicara & Stopwatch Timer (P)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Presenter</span>
              <kbd className="text-[9px] px-1 rounded bg-black/40 text-its-silver border border-white/10">P</kbd>
            </button>

            {/* Slide TOC Menu (Tombol 'G') */}
            <button
              onClick={() => setShowGrid(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-its-blue/30 bg-its-darkNavy/80 hover:bg-its-blue/20 text-its-silver hover:text-white cursor-pointer"
              title="Daftar Isi 25 Slide (G)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Menu</span>
              <kbd className="text-[9px] px-1 rounded bg-black/40 text-its-silver border border-white/10">G</kbd>
            </button>

            {/* Fullscreen (Tombol 'F') */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg border border-its-blue/30 bg-its-darkNavy/80 hover:bg-its-blue/20 text-its-silver hover:text-white cursor-pointer"
              title="Layar Penuh (F)"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>
      )}

      {/* Explore Mode Banner */}
      {isExploreMode && !is2DFallback && (
        <div className="relative z-20 bg-its-gold/20 border-b border-its-gold/40 text-its-gold px-4 py-1.5 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 animate-spin text-its-gold" />
            <span>
              <strong>Mode Explore 3D Aktif:</strong> Klik & drag mouse untuk rotasi 360°, scroll mouse untuk zoom, sorot objek untuk inspeksi raycast.
            </span>
          </div>
          <button
            onClick={() => setIsOverlayMinimized(!isOverlayMinimized)}
            className="px-2 py-0.5 rounded bg-its-gold text-its-deepNavy font-bold hover:bg-white transition-colors cursor-pointer"
          >
            {isOverlayMinimized ? 'Tampilkan Kartu Slide' : 'Minimalkan Kartu Slide'}
          </button>
        </div>
      )}

      {/* Main Slide Presentation Stage */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-3 md:p-6 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full max-w-6xl aspect-[16/9] max-h-[88vh] its-glass-heavy border border-its-blue/40 shadow-its-card rounded-3xl p-5 md:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 pointer-events-auto ${
            isOverlayMinimized ? 'opacity-20 scale-95 hover:opacity-100' : 'opacity-100 scale-100'
          }`}
        >
          <CurrentComponent />
        </div>
      </main>

      {/* Bottom Deck Navigation Bar */}
      {!isHudHidden && (
        <footer className="relative z-20 h-14 px-6 its-glass border-t border-its-blue/30 flex items-center justify-between">
          {/* Prev Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide <= 1}
            className="flex items-center gap-1.5 px-4 py-2 its-btn-secondary rounded-xl font-mono text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Slide Title & Progress */}
          <div className="flex items-center gap-4 flex-1 max-w-xl mx-6">
            <span className="font-mono text-xs font-extrabold text-its-gold whitespace-nowrap">
              {currentSlide.toString().padStart(2, '0')} / {totalSlides}
            </span>

            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono text-its-silver">
                <span className="truncate max-w-[280px] font-bold text-white">{currentSlideObj.title}</span>
                <span className="text-its-blue-light">{currentSlideObj.section}</span>
              </div>
              {/* Progress Bar with ITS Gold Glow */}
              <div className="w-full h-2 bg-its-darkNavy/80 rounded-full overflow-hidden border border-its-blue/30">
                <div
                  className="h-full bg-gradient-to-r from-its-blue to-its-gold shadow-its-glow transition-all duration-300"
                  style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Shortcuts Hint & Next Button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-its-silver/70">
              <kbd className="px-1.5 py-0.5 rounded bg-its-darkNavy border border-its-blue/30 text-white font-bold">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-its-darkNavy border border-its-blue/30 text-white font-bold">→</kbd>
              <span>atau</span>
              <kbd className="px-2 py-0.5 rounded bg-its-darkNavy border border-its-blue/30 text-white font-bold">Spasi</kbd>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide >= totalSlides}
              className="flex items-center gap-1.5 px-5 py-2 its-btn-gold rounded-xl font-mono text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-its-gold"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}

      {/* Grid Modal / Table of Contents (G / Esc) */}
      {showGrid && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
          <div className="its-glass-heavy border border-its-blue/40 shadow-its-glow rounded-3xl max-w-4xl w-full max-h-[85vh] p-6 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-its-blue/30 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-its-blue/30 border border-its-blue text-its-gold">
                  <Grid className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-xl text-white">Daftar Isi Slide Deck ({totalSlides} Slide)</h3>
                  <span className="text-xs font-mono text-its-silver">Pilih slide untuk melompat langsung</span>
                </div>
              </div>
              <button
                onClick={() => setShowGrid(false)}
                className="p-1.5 rounded-xl border border-its-blue/30 bg-its-darkNavy hover:bg-its-blue/20 text-its-silver hover:text-white cursor-pointer"
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
                    setShowGrid(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    currentSlide === s.id
                      ? 'bg-its-blue/30 border-its-gold text-white font-bold shadow-its-glow scale-102'
                      : 'bg-its-darkNavy/70 border-its-blue/20 hover:border-its-blue hover:bg-its-navy/60 text-its-silver'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-black text-its-gold">#{s.id.toString().padStart(2, '0')}</span>
                    <span className="text-its-blue-light truncate max-w-[65px]">{s.section.split('·')[0]}</span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-2">{s.title}</div>
                </button>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-its-blue/20 text-xs font-mono text-its-silver flex justify-between">
              <span>Klik kartu slide untuk navigasi</span>
              <span>Tekan <kbd className="px-1.5 py-0.5 rounded bg-its-darkNavy border border-its-blue/40 font-bold text-white">Esc</kbd> untuk menutup</span>
            </div>
          </div>
        </div>
      )}

      {/* Presenter Notes Modal (P) */}
      {showPresenter && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
          <div className="its-glass-heavy border border-its-blue/40 shadow-its-glow rounded-3xl max-w-2xl w-full p-6 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-its-blue/30 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-its-blue/30 border border-its-blue text-its-gold">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Catatan Presenter (Slide {currentSlide})</h3>
                  <span className="text-xs font-mono text-its-blue-light">{currentNotes?.section}</span>
                </div>
              </div>

              {/* Presentation Timer */}
              <div className="flex items-center gap-2 px-3 py-1 bg-its-darkNavy border border-its-blue/40 rounded-xl font-mono text-sm font-black">
                <Clock className="w-4 h-4 text-its-gold" />
                <span className="text-white">{formatTimer(timerSeconds)}</span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 hover:text-its-gold cursor-pointer"
                  title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setTimerSeconds(0);
                    setIsTimerRunning(false);
                  }}
                  className="p-1 hover:text-red-400 cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setShowPresenter(false)}
                className="p-1.5 rounded-xl border border-its-blue/30 bg-its-darkNavy hover:bg-its-blue/20 text-its-silver hover:text-white cursor-pointer ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 my-2">
              <div className="p-3 bg-its-darkNavy/80 rounded-xl border border-its-blue/30">
                <span className="text-xs font-mono font-bold text-its-silver/80 block mb-1">Judul Slide Aktif:</span>
                <h4 className="font-extrabold text-base text-white">{currentSlideObj.title}</h4>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-its-gold block mb-2">
                  Poin Bicara untuk Rayhan:
                </span>
                <ul className="space-y-2.5">
                  {currentNotes?.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-its-silver leading-relaxed">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-its-blue/30 border border-its-blue text-its-gold flex-none mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Slide Preview */}
              {currentSlide < totalSlides && (
                <div className="p-3 bg-its-navy/60 rounded-xl border border-its-blue/20 font-mono text-xs">
                  <span className="text-its-silver/70 block text-[10px]">Slide Selanjutnya ({currentSlide + 1}):</span>
                  <span className="font-bold text-its-gold">{SLIDES_REGISTRY[currentSlide].title}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-its-blue/20 flex items-center justify-between text-xs font-mono text-its-silver">
              <span>Estimasi Durasi Slide: ~{currentNotes?.durationMinutes || 1.5} menit</span>
              <button
                onClick={() => setShowPresenter(false)}
                className="its-btn-primary px-4 py-1.5 rounded-xl text-xs font-mono font-bold"
              >
                Tutup (P)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Storyline Mode Modal (S) */}
      <StorylineModal
        isOpen={showStoryline}
        onClose={() => setShowStoryline(false)}
        onWaypointChange={(wp) => goToSlide(wp)}
      />
    </div>
  );
};
