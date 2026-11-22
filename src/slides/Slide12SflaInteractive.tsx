import React, { useState } from 'react';
import { Badge } from '../components/Badge';
import { Highlight } from '../components/Highlight';
import { Stepper } from '../components/Stepper';
import { NarrationPanel } from '../components/NarrationPanel';
import { SflaPondView } from '../viz/SflaPondView';
import { SMALL_STEPPER_PROBLEM } from '../data/defaultDatasets';
import { sflaSolver } from '../sim/algorithms/sfla';
import { createRNG } from '../sim/rng';

export const Slide12SflaInteractive: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const stepsData = React.useMemo(() => {
    const recorded: any[] = [];
    sflaSolver.run(SMALL_STEPPER_PROBLEM, { recordSteps: true, populationSize: 12, memeplexCount: 3, evaluationBudget: 300 }, createRNG(42), (evt) => {
      recorded.push(evt);
    });
    return recorded;
  }, []);

  const totalSteps = stepsData.length || 4;
  const currentEvt = stepsData[step - 1] || {
    title: 'Partisi Memeplex',
    description: '12 katak diurutkan berdasarkan fitness dan dibagi ke dalam 3 memeplex.',
    frogs: Array.from({ length: 12 }, (_, i) => ({
      id: i,
      memeplex: i % 3,
      position: [0, 1, 2, 0, 1, 2],
      fitness: 1.2 + i * 0.05
    }))
  };

  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= totalSteps) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500 / speed);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, speed]);

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="12 · CARA KERJA SFLA INTERAKTIF" color="green" />
          <span className="font-mono text-xs text-muted">Populasi Katak, Memeplex, & Lompatan Lokal</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight mb-2">
          Katak Terburuk (Xw) <Highlight color="green">Melompat</Highlight> Menuju Katak Terbaik (Xb).
        </h2>
      </div>

      <div className="my-auto">
        <SflaPondView
          frogs={currentEvt.frogs || []}
          memeplexCount={3}
          activeMemeplex={step % 3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <NarrationPanel
          title={currentEvt.title}
          description={currentEvt.description}
          phase={`Siklus ${step} dari ${totalSteps}`}
        />

        <Stepper
          currentStep={step}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          onPrev={() => setStep((s) => Math.max(1, s - 1))}
          onNext={() => setStep((s) => Math.min(totalSteps, s + 1))}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onReset={() => {
            setStep(1);
            setIsPlaying(false);
          }}
          speed={speed}
          onChangeSpeed={setSpeed}
        />
      </div>
    </div>
  );
};
