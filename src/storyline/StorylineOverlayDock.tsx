import React, { useState, useEffect, useRef } from 'react';
import { STORYLINE_CHAPTERS } from './StorylineData';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Presentation,
  Compass,
  MapPin
} from 'lucide-react';

interface StorylineOverlayDockProps {
  onWaypointChange: (waypoint: number) => void;
  onOpenPptAtSlide: (slideNum: number) => void;
  onOpenDiagramModal: () => void;
  isExploreMode?: boolean;
}

export const StorylineOverlayDock: React.FC<StorylineOverlayDockProps> = ({
  onWaypointChange,
  onOpenPptAtSlide,
  onOpenDiagramModal,
  isExploreMode = false
}) => {
  const [chapterIdx, setChapterIdx] = useState(0);
  const [beatIdx, setBeatIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  const tokenRef = useRef(0);
  const timerRef = useRef<any>(null);

  const currentChapter = STORYLINE_CHAPTERS[chapterIdx];
  const currentBeat = currentChapter.beats[beatIdx];

  // Sync 3D camera waypoint whenever chapter or beat changes
  useEffect(() => {
    const wp = currentBeat?.cameraWaypoint || currentChapter.waypoint;
    onWaypointChange(wp);
  }, [chapterIdx, beatIdx]);

  // Playback & optional TTS
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearTimeout(timerRef.current);
      return;
    }

    tokenRef.current++;
    const currentToken = tokenRef.current;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const textToSpeak = currentBeat.text;
    const estDuration = Math.max(5.5, textToSpeak.length * 0.068);
    let speechEnded = false;

    if (isVoiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const idVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().startsWith('in')) || voices[0];
      const u = new SpeechSynthesisUtterance(textToSpeak);
      if (idVoice) {
        u.voice = idVoice;
        u.lang = idVoice.lang;
      }
      u.rate = 1.0;
      u.onend = () => {
        if (currentToken === tokenRef.current) {
          speechEnded = true;
          advanceBeat();
        }
      };
      u.onerror = () => {
        if (currentToken === tokenRef.current && !speechEnded) {
          speechEnded = true;
          advanceBeat();
        }
      };
      try {
        window.speechSynthesis.speak(u);
      } catch {
        // fallback to timer
      }
    }

    timerRef.current = setTimeout(() => {
      if (currentToken === tokenRef.current && !speechEnded) {
        advanceBeat();
      }
    }, estDuration * 1000);

    return () => {
      clearTimeout(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [chapterIdx, beatIdx, isPlaying, isVoiceEnabled]);

  const advanceBeat = () => {
    if (beatIdx < currentChapter.beats.length - 1) {
      setBeatIdx((b) => b + 1);
    } else if (chapterIdx < STORYLINE_CHAPTERS.length - 1) {
      setChapterIdx((c) => c + 1);
      setBeatIdx(0);
    } else {
      setIsPlaying(false);
    }
  };

  const prevStep = () => {
    if (beatIdx > 0) {
      setBeatIdx((b) => b - 1);
    } else if (chapterIdx > 0) {
      const prevCh = STORYLINE_CHAPTERS[chapterIdx - 1];
      setChapterIdx((c) => c - 1);
      setBeatIdx(prevCh.beats.length - 1);
    }
  };

  const nextStep = () => {
    advanceBeat();
  };

  const jumpChapter = (idx: number) => {
    setChapterIdx(idx);
    setBeatIdx(0);
  };

  // Island quick jump buttons
  const quickIslands = [
    { label: 'Gerbang Cloud', wp: 1, color: 'bg-its-blue' },
    { label: 'Pulau HEFT-GA', wp: 9, color: 'bg-its-cover' },
    { label: 'Pulau Katak SFLA-GA', wp: 12, color: 'bg-its-tosca' },
    { label: 'Podium Juara', wp: 19, color: 'bg-its-gold' }
  ];

  return (
    <>
      {/* 1. Top Floating Quick Island Navigator Pill (Positioned neatly below header / explore banner) */}
      <div
        className={`pointer-events-none fixed inset-x-0 z-20 flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 transition-all duration-300 ${
          isExploreMode ? 'top-[96px]' : 'top-[64px]'
        }`}
      >
        <div className="pointer-events-auto its-glass rounded-2xl px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 shadow-its-card overflow-x-auto max-w-full scrollbar-none">
          <MapPin className="w-3.5 h-3.5 text-its-blue shrink-0" />
          <span className="text-[11px] font-mono font-bold text-its-silver mr-1 hidden sm:inline">Lompat Pulau:</span>
          {quickIslands.map((isl) => (
            <button
              key={isl.label}
              onClick={() => onWaypointChange(isl.wp)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/80 hover:bg-its-blue hover:text-white border border-its-blue/20 text-[11px] font-mono font-bold text-its-navy transition-all cursor-pointer whitespace-nowrap"
            >
              <span className={`w-2 h-2 rounded-full ${isl.color}`} />
              <span>{isl.label}</span>
            </button>
          ))}
        </div>

        {/* Analogy Info Pill */}
        <div className="pointer-events-auto hidden lg:flex items-center gap-2 its-glass-gold rounded-2xl px-3.5 py-1.5 text-xs font-mono font-bold text-its-navy shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{currentChapter.analogyLabel}</span>
        </div>
      </div>

      {/* 2. Bottom Floating Storyline Narrator Dock (Directly Anchored to Bottom: Never Cut Off!) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-2 sm:bottom-3 md:bottom-5 z-20 flex justify-center px-2 sm:px-4 md:px-6">
        <div className="pointer-events-auto w-full max-w-4xl its-glass-heavy rounded-2xl p-2.5 sm:p-4 shadow-its-card border border-its-blue/30 max-h-[42vh] flex flex-col justify-between overflow-y-auto">
          {/* Chapter Pills Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 border-b border-its-blue/15 scrollbar-none">
            {STORYLINE_CHAPTERS.map((ch, idx) => {
              const active = idx === chapterIdx;
              const passed = idx < chapterIdx;
              return (
                <button
                  key={ch.id}
                  onClick={() => jumpChapter(idx)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    active
                      ? 'bg-its-blue text-white shadow-sm ring-2 ring-its-blue/30'
                      : passed
                      ? 'bg-sky-100 text-its-blue hover:bg-sky-200'
                      : 'bg-its-slate text-its-silver hover:bg-sky-50 hover:text-its-navy'
                  }`}
                >
                  {ch.shortTitle}
                </button>
              );
            })}
          </div>

          {/* Title & Narration Sentence & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 rounded bg-its-gold text-its-navy font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0">
                  {currentBeat.stepTag || `Bab ${currentChapter.id}`}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-its-silver font-semibold shrink-0">
                  Langkah {beatIdx + 1}/{currentChapter.beats.length}
                </span>
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-its-navy truncate">
                  {currentChapter.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-its-navy/90 leading-snug font-medium line-clamp-2 md:line-clamp-3">
                {currentBeat.text}
              </p>
            </div>

            {/* Right Action Controls: Compact, Never Wrap Out of Sight */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-its-blue/15">
              <button
                onClick={prevStep}
                disabled={chapterIdx === 0 && beatIdx === 0}
                className="p-1.5 sm:p-2 rounded-xl its-btn-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Langkah Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl its-btn-gold font-mono text-xs font-extrabold cursor-pointer whitespace-nowrap shadow-sm"
                title={isPlaying ? 'Jeda Cerita' : 'Putar Otomatis'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Jeda' : 'Putar Cerita'}</span>
              </button>

              <button
                onClick={nextStep}
                disabled={chapterIdx === STORYLINE_CHAPTERS.length - 1 && beatIdx === currentChapter.beats.length - 1}
                className="p-1.5 sm:p-2 rounded-xl its-btn-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Langkah Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
                  isVoiceEnabled
                    ? 'bg-its-blue text-white border-its-blue'
                    : 'bg-white text-its-silver border-its-blue/25 hover:text-its-navy'
                }`}
                title={isVoiceEnabled ? 'Suara Narasi Aktif' : 'Aktifkan Suara Narasi (TTS ID)'}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={onOpenDiagramModal}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl its-btn-secondary font-mono text-xs font-bold cursor-pointer whitespace-nowrap"
                title="Buka Diagram Explainer Lengkap"
              >
                <Compass className="w-3.5 h-3.5 text-its-blue" />
                <span>Diagram</span>
              </button>

              <button
                onClick={() => onOpenPptAtSlide(currentChapter.relatedSlide)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-its-cover text-white hover:bg-its-blue font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm"
                title="Buka Slide PPT Terkait"
              >
                <Presentation className="w-3.5 h-3.5 text-its-gold" />
                <span>Slide #{currentChapter.relatedSlide}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
