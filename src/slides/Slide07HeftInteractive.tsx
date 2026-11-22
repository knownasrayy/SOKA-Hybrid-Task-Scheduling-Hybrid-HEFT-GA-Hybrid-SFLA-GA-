import React, { useState } from 'react';
import { Badge } from '../components/Badge';
import { Stepper } from '../components/Stepper';
import { NarrationPanel } from '../components/NarrationPanel';
import { DagView } from '../viz/DagView';
import { GanttChart } from '../viz/GanttChart';
import { SMALL_STEPPER_PROBLEM } from '../data/defaultDatasets';
import { heftSolver } from '../sim/algorithms/heft';
import { createRNG } from '../sim/rng';

export const Slide07HeftInteractive: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Generate HEFT execution steps on small instance (6 tasks, 3 VMs)
  const stepsData = React.useMemo(() => {
    const recorded: any[] = [];
    heftSolver.run(SMALL_STEPPER_PROBLEM, { recordSteps: true }, createRNG(42), (evt) => {
      recorded.push(evt);
    });
    return recorded;
  }, []);

  const totalSteps = stepsData.length || 6;
  const currentEvt = stepsData[step - 1] || {
    title: 'Inisialisasi',
    description: 'Menghitung upward rank dari task keluar ke task masuk.',
    activeTaskId: 0,
    activeVmId: 0
  };

  // Build partial schedule up to current step
  const scheduledTasks = new Set<number>();
  for (let i = 0; i < step; i++) {
    if (stepsData[i]?.activeTaskId !== undefined) {
      scheduledTasks.add(stepsData[i].activeTaskId);
    }
  }

  // Partial schedule
  const partialSchedule = React.useMemo(() => {
    const fullRes = heftSolver.run(SMALL_STEPPER_PROBLEM, {}, createRNG(42));
    return fullRes.schedule.filter((s) => scheduledTasks.has(s.taskId));
  }, [step]);

  // Auto-play timer
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= totalSteps) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1400 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, speed]);

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="07 · CARA KERJA HEFT INTERAKTIF" color="blue" />
          <span className="font-mono text-xs text-muted">Contoh Kasus 6 Task & 3 VM</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight mb-2">
          Upward Rank → Urutan Prioritas → Earliest Finish Time (EFT).
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        <div>
          <DagView
            problem={SMALL_STEPPER_PROBLEM}
            activeTaskId={currentEvt.activeTaskId}
            scheduledTasks={scheduledTasks}
            height={240}
          />
        </div>
        <div>
          <GanttChart
            schedule={partialSchedule}
            vms={SMALL_STEPPER_PROBLEM.vms}
            highlightTaskId={currentEvt.activeTaskId}
            height={200}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <NarrationPanel
          title={currentEvt.title}
          description={currentEvt.description}
          phase={`Langkah ${step} dari ${totalSteps}`}
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
