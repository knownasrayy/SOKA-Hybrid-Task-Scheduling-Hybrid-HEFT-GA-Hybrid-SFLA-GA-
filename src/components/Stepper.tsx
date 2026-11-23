import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (spd: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onPrev,
  onNext,
  onTogglePlay,
  onReset,
  speed,
  onChangeSpeed
}) => {
  return (
    <div className="flex items-center justify-between gap-3 p-2.5 its-glass rounded-xl">
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          disabled={currentStep <= 1}
          className="p-1.5 rounded-lg its-btn-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Langkah Sebelumnya (←)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePlay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg its-btn-gold font-mono font-bold text-xs cursor-pointer shadow-sm"
          title={isPlaying ? 'Pause' : 'Auto Play'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
        </button>

        <button
          onClick={onNext}
          disabled={currentStep >= totalSteps}
          className="p-1.5 rounded-lg its-btn-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Langkah Berikutnya (→)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onReset}
          className="p-1.5 rounded-lg its-btn-secondary cursor-pointer ml-1"
          title="Reset Langkah"
        >
          <RotateCcw className="w-4 h-4 text-its-blue" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-bold text-its-navy">
          Langkah <span className="bg-its-gold text-its-navy px-1.5 py-0.5 rounded font-black">{currentStep}</span> / {totalSteps}
        </span>

        <div className="flex items-center gap-1 font-mono text-[11px]">
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-1.5 py-0.5 rounded border ${
                speed === s
                  ? 'bg-its-blue text-white border-its-blue font-bold'
                  : 'bg-white border-its-blue/25 text-its-navy hover:border-its-blue'
              } cursor-pointer`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
