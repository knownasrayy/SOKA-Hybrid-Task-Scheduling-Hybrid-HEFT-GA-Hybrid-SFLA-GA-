import React, { useState, useEffect, useRef } from 'react';
import { STORYLINE_CHAPTERS, StorylineChapter } from './StorylineData';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Compass,
  Trophy
} from 'lucide-react';

interface StorylineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWaypointChange: (waypoint: number) => void;
}

const JOB_COLORS = ['#127BBE', '#FDBB16', '#75BDE0', '#12B0A2', '#F47D52', '#8B5CF6', '#26AEE4', '#E11D48'];

export const StorylineModal: React.FC<StorylineModalProps> = ({
  isOpen,
  onClose,
  onWaypointChange
}) => {
  const [chapterIdx, setChapterIdx] = useState(0);
  const [beatIdx, setBeatIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceAvailable, setVoiceAvailable] = useState(false);

  const tokenRef = useRef(0);
  const timerRef = useRef<any>(null);

  const currentChapter = STORYLINE_CHAPTERS[chapterIdx];
  const currentBeat = currentChapter.beats[beatIdx];

  // Check voice availability
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const hasIdVoice = voices.some((v) => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().startsWith('in'));
      setVoiceAvailable(hasIdVoice || voices.length > 0);
    };
    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;
  }, []);

  // Sync camera waypoint
  useEffect(() => {
    if (!isOpen) return;
    const targetWp = currentBeat?.cameraWaypoint || currentChapter.waypoint;
    onWaypointChange(targetWp);
  }, [isOpen, chapterIdx, beatIdx]);

  // Speech playback & timer for beats
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearTimeout(timerRef.current);
      return;
    }

    if (!isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
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
    const estimatedDuration = Math.max(4.5, textToSpeak.length * 0.075);

    let speechEnded = false;

    if (isVoiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().startsWith('in')) || voices[0];

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (idVoice) {
        utterance.voice = idVoice;
        utterance.lang = idVoice.lang;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (currentToken === tokenRef.current) {
          speechEnded = true;
          advanceBeat();
        }
      };

      utterance.onerror = () => {
        if (currentToken === tokenRef.current && !speechEnded) {
          speechEnded = true;
          advanceBeat();
        }
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        // fallback to timer
      }
    }

    // Safety timer in case speech synthesis fails or is muted
    timerRef.current = setTimeout(() => {
      if (currentToken === tokenRef.current && !speechEnded) {
        advanceBeat();
      }
    }, estimatedDuration * 1000);

    return () => {
      clearTimeout(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, chapterIdx, beatIdx, isPlaying, isVoiceEnabled]);

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

  const prevBeatOrChapter = () => {
    if (beatIdx > 0) {
      setBeatIdx((b) => b - 1);
    } else if (chapterIdx > 0) {
      setChapterIdx((c) => c - 1);
      setBeatIdx(0);
    }
  };

  const nextBeatOrChapter = () => {
    if (chapterIdx < STORYLINE_CHAPTERS.length - 1 || beatIdx < currentChapter.beats.length - 1) {
      advanceBeat();
    }
  };

  const jumpToChapter = (idx: number) => {
    setChapterIdx(idx);
    setBeatIdx(0);
    setIsPlaying(true);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextBeatOrChapter();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevBeatOrChapter();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, chapterIdx, beatIdx]);

  if (!isOpen) return null;

  // Render SVG Diagrams
  const renderDiagram = () => {
    switch (currentChapter.diagram) {
      case 'cloud':
        return (
          <svg viewBox="0 0 680 220" className="w-full max-h-[220px]">
            {/* Users */}
            <g transform="translate(40, 70)">
              <circle cx="20" cy="18" r="14" fill="#127BBE" opacity="0.8" />
              <path d="M4 60 C4 38, 36 38, 36 60 Z" fill="#127BBE" opacity="0.8" />
              <text x="20" y="80" textAnchor="middle" className="font-mono text-[11px] fill-its-silver">Pengguna</text>
            </g>
            <g transform="translate(80, 85)">
              <circle cx="16" cy="14" r="11" fill="#75BDE0" opacity="0.7" />
              <path d="M4 48 C4 30, 28 30, 28 48 Z" fill="#75BDE0" opacity="0.7" />
            </g>

            {/* Directed Workflow Flow */}
            <path d="M 120 100 L 170 100" stroke="#75BDE0" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
            <polygon points="175,100 167,96 167,104" fill="#75BDE0" />

            {/* Scientific DAG Tasks */}
            <g transform="translate(185, 45)">
              <rect x="0" y="0" width="160" height="120" rx="12" fill="#192841" stroke="#127BBE" strokeWidth="1.5" />
              <text x="80" y="24" textAnchor="middle" className="font-mono text-[11px] font-bold fill-its-gold">Scientific Workflow</text>
              {JOB_COLORS.slice(0, 6).map((col, idx) => {
                const rx = 20 + (idx % 3) * 45;
                const ry = 40 + Math.floor(idx / 3) * 35;
                return (
                  <g key={idx}>
                    <rect x={rx} y={ry} width="32" height="24" rx="6" fill={col} opacity="0.9" />
                    <text x={rx + 16} y={ry + 16} textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                      T{idx + 1}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Cloud Connection */}
            <path d="M 355 100 L 405 100" stroke="#FDBB16" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
            <polygon points="410,100 402,96 402,104" fill="#FDBB16" />

            {/* Virtual Machines / Datacenter Racks */}
            <g transform="translate(420, 30)">
              <text x="120" y="16" textAnchor="middle" className="font-mono text-[11px] font-bold fill-its-blue-light">
                Heterogeneous VM Instances
              </text>
              {[1, 2, 3, 4].map((vm, idx) => {
                const vx = idx * 60;
                return (
                  <g key={vm} transform={`translate(${vx}, 26)`}>
                    <rect x="0" y="0" width="48" height="96" rx="8" fill="#192841" stroke="rgba(117,189,224,0.4)" strokeWidth="1.5" />
                    <rect x="6" y="8" width="36" height="16" rx="4" fill="#0B132B" />
                    <circle cx="36" cy="16" r="3" fill="#12B0A2" className="animate-ping" />
                    <rect x="6" y="30" width="36" height="16" rx="4" fill="#0B132B" />
                    <circle cx="36" cy="38" r="3" fill="#127BBE" />
                    <rect x="6" y="52" width="36" height="16" rx="4" fill="#0B132B" />
                    <circle cx="36" cy="60" r="3" fill="#FDBB16" />
                    <text x="24" y="84" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                      VM {vm}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        );

      case 'schedules':
        return (
          <svg viewBox="0 0 680 220" className="w-full max-h-[220px]">
            {/* Bad Schedule (Overloaded) */}
            <g transform="translate(30, 20)">
              <text x="130" y="18" textAnchor="middle" className="font-mono text-xs font-bold fill-red-400">
                ❌ Penjadwalan Buruk (Bottleneck)
              </text>
              {/* Finish line (High makespan) */}
              <line x1="10" y1="45" x2="260" y2="45" stroke="#E11D48" strokeWidth="2" strokeDasharray="4 4" />
              <text x="265" y="49" className="font-mono text-[10px] font-bold fill-red-400">Makespan: 480s</text>

              {/* Overloaded tag */}
              <rect x="5" y="65" width="85" height="20" rx="6" fill="#E11D48" />
              <text x="47" y="79" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">Overload!</text>

              {/* VM 1 Stacked tall */}
              <rect x="30" y="90" width="35" height="24" rx="4" fill="#127BBE" />
              <rect x="30" y="116" width="35" height="24" rx="4" fill="#FDBB16" />
              <rect x="30" y="142" width="35" height="24" rx="4" fill="#12B0A2" />
              {/* VM 2-4 Empty/Idle */}
              <rect x="90" y="142" width="35" height="24" rx="4" fill="#8B5CF6" />
              <text x="160" y="156" className="font-mono text-[10px] fill-its-silver/60">Idle (Nganggur)</text>

              <line x1="10" y1="172" x2="260" y2="172" stroke="rgba(117,189,224,0.3)" strokeWidth="2" />
              <text x="47" y="190" textAnchor="middle" className="font-mono text-[10px] fill-white">VM 1</text>
              <text x="107" y="190" textAnchor="middle" className="font-mono text-[10px] fill-white">VM 2</text>
              <text x="167" y="190" textAnchor="middle" className="font-mono text-[10px] fill-white">VM 3</text>
              <text x="227" y="190" textAnchor="middle" className="font-mono text-[10px] fill-white">VM 4</text>
            </g>

            {/* Separator */}
            <line x1="340" y1="20" x2="340" y2="200" stroke="rgba(117,189,224,0.2)" strokeWidth="1.5" />

            {/* Good Schedule (Hybrid Balanced) */}
            <g transform="translate(370, 20)">
              <text x="130" y="18" textAnchor="middle" className="font-mono text-xs font-bold fill-its-gold">
                ✨ Penjadwalan Hybrid Optimal
              </text>
              {/* Finish line (Short makespan) */}
              <line x1="10" y1="110" x2="260" y2="110" stroke="#FDBB16" strokeWidth="2.5" />
              <text x="265" y="114" className="font-mono text-[10px] font-bold fill-its-gold">Makespan: 210s</text>

              {/* Balanced Blocks */}
              <rect x="30" y="118" width="35" height="48" rx="4" fill="#127BBE" />
              <rect x="90" y="118" width="35" height="48" rx="4" fill="#FDBB16" />
              <rect x="150" y="122" width="35" height="44" rx="4" fill="#12B0A2" />
              <rect x="210" y="120" width="35" height="46" rx="4" fill="#8B5CF6" />

              <line x1="10" y1="172" x2="260" y2="172" stroke="rgba(117,189,224,0.3)" strokeWidth="2" />
              <text x="47" y="190" textAnchor="middle" className="font-mono text-[10px] fill-white">VM 1</text>
              <text x="107" y="190" textAnchor="middle" className="font-mono text-[10px] fill-white">VM 2</text>
              <text x="167" y="190" textAnchor="middle" className="font-mono text-[10px] fill-white">VM 3</text>
              <text x="227" y="190" textAnchor="middle" className="font-mono text-[10px] fill-white">VM 4</text>
            </g>
          </svg>
        );

      case 'choices':
        return (
          <svg viewBox="0 0 680 220" className="w-full max-h-[220px]">
            <g transform="translate(50, 40)">
              <rect x="0" y="0" width="260" height="140" rx="12" fill="#192841" stroke="#E11D48" strokeWidth="1.5" />
              <text x="130" y="32" textAnchor="middle" className="font-mono text-sm font-bold fill-red-400">
                Pencarian Brute Force
              </text>
              <text x="130" y="65" textAnchor="middle" className="font-mono text-2xl font-black fill-white">
                4²⁰ Kombinasi
              </text>
              <text x="130" y="95" textAnchor="middle" className="font-mono text-xs fill-its-silver/80">
                ≈ 1.099.511.627.776 Jadwal
              </text>
              <text x="130" y="120" textAnchor="middle" className="font-mono text-[11px] font-bold fill-red-400">
                ⚠️ Butuh ribuan tahun jika dicek 1-per-1
              </text>
            </g>

            <path d="M 330 110 L 370 110" stroke="#FDBB16" strokeWidth="2.5" />
            <polygon points="375,110 365,105 365,115" fill="#FDBB16" />

            <g transform="translate(390, 40)">
              <rect x="0" y="0" width="240" height="140" rx="12" fill="#192841" stroke="#127BBE" strokeWidth="1.5" />
              <text x="120" y="32" textAnchor="middle" className="font-mono text-sm font-bold fill-its-gold">
                Solusi Cerdas: HYBRID
              </text>
              <g>
                <text x="20" y="65" className="font-mono text-xs fill-its-silver">✓ Heuristik: Mulai dari tebakan bagus</text>
                <text x="20" y="90" className="font-mono text-xs fill-its-silver">✓ Metaheuristik: Hindari lokal optima</text>
                <text x="20" y="115" className="font-mono text-xs font-bold fill-its-blue-light">⚡ Selesai dalam &lt; 2 detik di browser!</text>
              </g>
            </g>
          </svg>
        );

      case 'heftRelay':
        return (
          <svg viewBox="0 0 680 220" className="w-full max-h-[220px]">
            {/* HEFT Upward Rank Engine */}
            <g transform="translate(40, 35)">
              <rect x="0" y="0" width="200" height="140" rx="12" fill="#192841" stroke="#127BBE" strokeWidth="1.5" />
              <text x="100" y="28" textAnchor="middle" className="font-mono text-xs font-bold fill-its-blue-light">
                1. HEFT Deterministic
              </text>
              <text x="100" y="52" textAnchor="middle" className="font-mono text-[11px] fill-its-silver">
                Hitung rank_u & EFT
              </text>
              {/* Mini Gantt bar */}
              <rect x="25" y="70" width="150" height="24" rx="6" fill="#127BBE" opacity="0.8" />
              <text x="100" y="86" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                Best Deterministic Schedule
              </text>
              <text x="100" y="120" textAnchor="middle" className="font-mono text-[10px] font-bold fill-its-gold">
                Cepat: O(v² · p)
              </text>
            </g>

            {/* Golden Baton Injection */}
            <g transform="translate(255, 80)">
              <rect x="0" y="0" width="90" height="30" rx="8" fill="#FDBB16" className="shadow-its-gold animate-bounce" />
              <text x="45" y="19" textAnchor="middle" className="font-mono text-[10px] font-extrabold fill-its-navy">
                Bibit Unggul ➔
              </text>
            </g>

            {/* GA Chromosome Population */}
            <g transform="translate(360, 35)">
              <rect x="0" y="0" width="280" height="140" rx="12" fill="#192841" stroke="#FDBB16" strokeWidth="1.5" />
              <text x="140" y="28" textAnchor="middle" className="font-mono text-xs font-bold fill-its-gold">
                2. GA Population (Gen 0)
              </text>
              {/* Seeded Chromosome #1 */}
              <g transform="translate(20, 45)">
                <text x="0" y="16" className="font-mono text-[10px] font-bold fill-its-gold">Kromosom 1 (HEFT):</text>
                {[2, 1, 3, 2, 4, 1, 3].map((g, i) => (
                  <rect key={i} x={130 + i * 16} y="4" width="14" height="16" rx="3" fill="#FDBB16" />
                ))}
              </g>
              {/* Random Chromosomes */}
              <g transform="translate(20, 75)">
                <text x="0" y="16" className="font-mono text-[10px] fill-its-silver/70">Kromosom 2 (Acak):</text>
                {[1, 4, 2, 3, 1, 2, 4].map((g, i) => (
                  <rect key={i} x={130 + i * 16} y="4" width="14" height="16" rx="3" fill="#75BDE0" opacity="0.5" />
                ))}
              </g>
              <g transform="translate(20, 105)">
                <text x="0" y="16" className="font-mono text-[10px] fill-its-silver/70">Kromosom 3 (Acak):</text>
                {[3, 2, 1, 4, 2, 3, 1].map((g, i) => (
                  <rect key={i} x={130 + i * 16} y="4" width="14" height="16" rx="3" fill="#75BDE0" opacity="0.5" />
                ))}
              </g>
            </g>
          </svg>
        );

      case 'sflaMemeplex':
        return (
          <svg viewBox="0 0 680 220" className="w-full max-h-[220px]">
            {/* Memeplex 1 */}
            <g transform="translate(50, 40)">
              <circle cx="90" cy="70" r="65" fill="#12B0A2" fillOpacity="0.12" stroke="#12B0A2" strokeWidth="2" />
              <text x="90" y="24" textAnchor="middle" className="font-mono text-xs font-bold fill-its-tosca">
                Memeplex A (Habitat 1)
              </text>
              {/* Frogs */}
              <circle cx="65" cy="60" r="10" fill="#12B0A2" />
              <circle cx="115" cy="55" r="10" fill="#12B0A2" />
              <circle cx="85" cy="95" r="12" fill="#FDBB16" />
              <text x="85" y="125" textAnchor="middle" className="font-mono text-[9px] font-bold fill-its-gold">
                Katak Terburuk ➔ GA Crossover
              </text>
            </g>

            {/* Global Shuffle Arrows */}
            <g transform="translate(260, 90)">
              <path d="M 0 0 C 40 -30, 80 -30, 120 0" fill="none" stroke="#FDBB16" strokeWidth="2.5" strokeDasharray="4 4" className="animate-pulse" />
              <path d="M 120 20 C 80 50, 40 50, 0 20" fill="none" stroke="#75BDE0" strokeWidth="2.5" strokeDasharray="4 4" className="animate-pulse" />
              <text x="60" y="16" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                Global Shuffle
              </text>
            </g>

            {/* Memeplex 2 */}
            <g transform="translate(420, 40)">
              <circle cx="90" cy="70" r="65" fill="#F47D52" fillOpacity="0.12" stroke="#F47D52" strokeWidth="2" />
              <text x="90" y="24" textAnchor="middle" className="font-mono text-xs font-bold fill-its-crusta">
                Memeplex B (Habitat 2)
              </text>
              {/* Frogs */}
              <circle cx="65" cy="60" r="10" fill="#F47D52" />
              <circle cx="115" cy="55" r="10" fill="#F47D52" />
              <circle cx="90" cy="95" r="12" fill="#FDBB16" />
              <text x="90" y="125" textAnchor="middle" className="font-mono text-[9px] font-bold fill-its-gold">
                Katak Terburuk ➔ GA Mutasi
              </text>
            </g>
          </svg>
        );

      case 'arenaRace':
        return (
          <svg viewBox="0 0 680 220" className="w-full max-h-[220px]">
            {/* Lane 1: HEFT-GA */}
            <g transform="translate(40, 30)">
              <rect x="0" y="0" width="600" height="65" rx="10" fill="#192841" stroke="#127BBE" strokeWidth="1.5" />
              <text x="20" y="24" className="font-mono text-xs font-bold fill-its-blue-light">
                Lajur 1: Hybrid HEFT-GA (Biru ITS)
              </text>
              <text x="20" y="48" className="font-mono text-[10px] fill-its-silver/80">
                Start: Generasi 0 sudah memiliki bibit HEFT · Konvergensi: Sangat Cepat
              </text>
              {/* Progress Bar */}
              <rect x="360" y="22" width="200" height="20" rx="5" fill="#0B132B" />
              <rect x="360" y="22" width="185" height="20" rx="5" fill="#127BBE" className="shadow-its-glow" />
              <text x="460" y="36" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                Makespan: 212.4s (Memimpin)
              </text>
            </g>

            {/* Lane 2: SFLA-GA */}
            <g transform="translate(40, 115)">
              <rect x="0" y="0" width="600" height="65" rx="10" fill="#192841" stroke="#12B0A2" strokeWidth="1.5" />
              <text x="20" y="24" className="font-mono text-xs font-bold fill-its-tosca">
                Lajur 2: Hybrid SFLA-GA (Teal Tosca)
              </text>
              <text x="20" y="48" className="font-mono text-[10px] fill-its-silver/80">
                Pencarian: Melompat antarmemeplex · Sangat gigih keluar dari jebakan lokal
              </text>
              {/* Progress Bar */}
              <rect x="360" y="22" width="200" height="20" rx="5" fill="#0B132B" />
              <rect x="360" y="22" width="168" height="20" rx="5" fill="#12B0A2" className="shadow-its-glow" />
              <text x="460" y="36" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
                Makespan: 228.1s
              </text>
            </g>
          </svg>
        );

      case 'summaryPodium':
        return (
          <svg viewBox="0 0 680 220" className="w-full max-h-[220px]">
            {/* Podium */}
            <g transform="translate(180, 20)">
              {/* 2nd Place: SFLA-GA */}
              <rect x="20" y="70" width="85" height="90" rx="8" fill="#192841" stroke="#12B0A2" strokeWidth="2" />
              <text x="62" y="110" textAnchor="middle" className="font-mono text-2xl font-black fill-its-tosca">2</text>
              <text x="62" y="135" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">SFLA-GA</text>

              {/* 1st Place: HEFT-GA */}
              <rect x="115" y="35" width="95" height="125" rx="8" fill="#192841" stroke="#FDBB16" strokeWidth="2.5" className="shadow-its-gold" />
              <text x="162" y="75" textAnchor="middle" className="font-mono text-3xl font-black fill-its-gold">1</text>
              <text x="162" y="105" textAnchor="middle" className="font-mono text-xs font-black fill-white">HEFT-GA</text>
              <text x="162" y="125" textAnchor="middle" className="font-mono text-[10px] font-bold fill-its-gold">🏆 JUARA</text>

              {/* 3rd Place: Baseline */}
              <rect x="220" y="100" width="85" height="60" rx="8" fill="#192841" stroke="rgba(117,189,224,0.4)" strokeWidth="1.5" />
              <text x="262" y="130" textAnchor="middle" className="font-mono text-xl font-black fill-its-silver/60">3</text>
              <text x="262" y="148" textAnchor="middle" className="font-mono text-[9px] fill-its-silver/80">SFLA / WCA</text>
            </g>

            {/* Highlights */}
            <g transform="translate(500, 45)">
              <rect x="0" y="0" width="150" height="110" rx="10" fill="#192841" stroke="#127BBE" strokeWidth="1.5" />
              <text x="75" y="24" textAnchor="middle" className="font-mono text-xs font-bold fill-white">Kelebihan HEFT-GA</text>
              <text x="15" y="50" className="font-mono text-[10px] fill-its-gold">★ Makespan: -18.4%</text>
              <text x="15" y="72" className="font-mono text-[10px] fill-its-blue-light">★ Waktu Hitung: 0.8s</text>
              <text x="15" y="94" className="font-mono text-[10px] fill-its-silver">★ Siap Produksi</text>
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 select-none animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-its-blue/30 pb-3 font-mono text-xs text-its-silver">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-its-navy border border-its-blue/40 shadow-its-glow">
            <span className="w-2.5 h-2.5 rounded-full bg-its-gold animate-ping" />
            <span className="font-black text-white tracking-wider">BIOSKOP SOKA · MODE CERITA</span>
          </div>
          <span className="text-its-blue-light font-bold hidden sm:inline">{currentChapter.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Toggle */}
          <button
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
              isVoiceEnabled
                ? 'bg-its-blue/20 text-its-gold border-its-gold/40 shadow-its-glow'
                : 'bg-its-darkNavy text-its-silver/60 border-its-blue/20'
            }`}
            title="Nyalakan / Matikan Suara Narasi (Text-to-Speech)"
          >
            {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isVoiceEnabled ? 'Suara Nyala' : 'Suara Mati'}</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-its-blue/30 bg-its-darkNavy hover:bg-its-blue/20 text-its-silver hover:text-white cursor-pointer ml-2"
            title="Tutup Mode Cerita (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Segmented Progress Bar */}
      <div className="my-2 grid grid-cols-7 gap-2">
        {STORYLINE_CHAPTERS.map((ch, idx) => {
          const isActive = idx === chapterIdx;
          const isDone = idx < chapterIdx;
          return (
            <button
              key={ch.id}
              onClick={() => jumpToChapter(idx)}
              className="group flex flex-col gap-1 text-left cursor-pointer transition-all"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-its-blue to-its-gold shadow-its-gold'
                    : isDone
                    ? 'bg-its-blue'
                    : 'bg-its-darkNavy/80 border border-its-blue/20'
                }`}
              />
              <span
                className={`text-[10px] font-mono truncate transition-colors ${
                  isActive ? 'font-bold text-its-gold' : isDone ? 'text-its-silver' : 'text-its-silver/40'
                }`}
              >
                Bab {ch.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Visual Stage (Center Animated SVG Diagram) */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 my-2">
        <div className="w-full max-w-4xl its-glass-heavy border border-its-blue/40 shadow-its-card rounded-3xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Chapter Subtitle Banner */}
          <div className="flex items-center justify-between text-xs font-mono text-its-silver pb-2 border-b border-its-blue/20 mb-2">
            <span className="font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-its-gold" />
              {currentChapter.subtitle}
            </span>
            <span className="text-its-blue-light font-bold">
              Kalimat {beatIdx + 1} / {currentChapter.beats.length}
            </span>
          </div>

          {/* Rendered SVG Diagram */}
          <div className="my-auto py-2 flex items-center justify-center">
            {renderDiagram()}
          </div>

          {/* Subtitle / Caption Bar */}
          <div className="mt-4 p-4 rounded-2xl bg-its-darkNavy/90 border border-its-blue/30 backdrop-blur-md shadow-its-glow">
            <p className="text-sm md:text-base text-white font-medium text-center leading-relaxed font-sans">
              "{currentBeat.text}"
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-its-blue/30 font-mono text-xs">
        <button
          onClick={prevBeatOrChapter}
          disabled={chapterIdx === 0 && beatIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2 its-btn-secondary rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-2.5 its-btn-gold rounded-xl font-extrabold shadow-its-gold cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Jeda Cerita' : 'Lanjutkan'}</span>
          </button>

          <button
            onClick={() => {
              setBeatIdx(0);
              setIsPlaying(true);
            }}
            className="p-2.5 rounded-xl border border-its-blue/30 bg-its-darkNavy hover:bg-its-blue/20 text-its-silver hover:text-white cursor-pointer"
            title="Ulangi Bab Ini"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={nextBeatOrChapter}
          disabled={chapterIdx === STORYLINE_CHAPTERS.length - 1 && beatIdx === currentChapter.beats.length - 1}
          className="flex items-center gap-1.5 px-4 py-2 its-btn-primary rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
