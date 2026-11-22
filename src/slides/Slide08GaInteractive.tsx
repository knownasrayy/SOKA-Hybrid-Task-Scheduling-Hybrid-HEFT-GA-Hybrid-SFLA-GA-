import React, { useState } from 'react';
import { Badge } from '../components/Badge';
import { Highlight } from '../components/Highlight';
import { Stepper } from '../components/Stepper';
import { NarrationPanel } from '../components/NarrationPanel';
import { GaPopulationView } from '../viz/GaPopulationView';
import { SMALL_STEPPER_PROBLEM } from '../data/defaultDatasets';
import { gaSolver } from '../sim/algorithms/ga';
import { createRNG } from '../sim/rng';

export const Slide08GaInteractive: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const stepsData = React.useMemo(() => {
    const recorded: any[] = [];
    gaSolver.run(SMALL_STEPPER_PROBLEM, { recordSteps: true, populationSize: 6, maxGenerations: 5 }, createRNG(101), (evt) => {
      recorded.push(evt);
    });
    return recorded;
  }, []);

  const totalSteps = stepsData.length || 5;
  const currentEvt = stepsData[step - 1] || {
    title: 'Inisialisasi GA',
    description: 'Enam kromosom acak dibangkitkan. Nilai fitness masih tinggi karena belum konvergen.',
    populationSnapshot: [
      { id: 0, assignment: [0, 1, 2, 0, 1, 2], fitness: 1.45 },
      { id: 1, assignment: [2, 2, 1, 0, 0, 1], fitness: 1.62 },
      { id: 2, assignment: [1, 0, 0, 2, 1, 0], fitness: 1.88 },
      { id: 3, assignment: [2, 1, 0, 2, 0, 1], fitness: 1.51 }
    ]
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
          <Badge label="08 · OPERATOR GA INTERAKTIF" color="ink" />
          <span className="font-mono text-xs text-muted">Seleksi Turnamen, Crossover 2-Titik, & Mutasi</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight mb-2">
          Bagaimana Operator <Highlight>Genetika</Highlight> Mengeksplorasi Jadwal.
        </h2>
      </div>

      <div className="my-auto">
        <GaPopulationView
          population={currentEvt.populationSnapshot || []}
          crossoverPoints={[1, 3]}
          mutatedGenes={step > 2 ? [[2, 4]] : []}
          vmCount={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <NarrationPanel
          title={currentEvt.title}
          description={currentEvt.description}
          phase={`Generasi ${step} dari ${totalSteps}`}
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
