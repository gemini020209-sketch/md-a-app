import { useState } from 'react';
import { Minus, Plus, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { View } from '../types';
import { EXERCISES } from '../constants';
import { cn } from '../lib/utils';

export function ExerciseView() {
  const { setView, addExerciseLog, user } = useApp();
  const [selectedExerciseId, setSelectedExerciseId] = useState(EXERCISES[0].id);
  const [duration, setDuration] = useState(45);

  const selectedExercise = EXERCISES.find(e => e.id === selectedExerciseId)!;
  const caloriesBurned = Math.round(selectedExercise.met * user.weight * (duration / 60));

  const handleConfirm = () => {
    addExerciseLog(selectedExerciseId, duration);
    setView(View.DASHBOARD);
  };

  return (
    <div className="pt-24 pb-32 px-5 max-w-md mx-auto space-y-8">
      {/* Exercise Grid */}
      <section className="space-y-4">
        <h2 className="font-lexend text-xl font-bold text-on-surface">选择运动</h2>
        <div className="grid grid-cols-3 gap-3">
          {EXERCISES.map(ex => {
            const isActive = selectedExerciseId === ex.id;
            const Icon = getIcon(ex.icon);
            return (
              <button 
                key={ex.id}
                onClick={() => setSelectedExerciseId(ex.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-5 rounded-[24px] shadow-sm transition-all border-2 active:scale-95",
                  isActive 
                    ? "bg-white border-primary text-primary" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-primary/20"
                )}
              >
                <Icon className={cn("w-8 h-8 mb-2", isActive && "fill-current/10")} />
                <span className="font-space text-[12px] font-bold uppercase tracking-tight">{ex.name}</span>
              </button>
            );
          })}
          <button className="flex flex-col items-center justify-center p-5 bg-white border-2 border-dashed border-slate-200 rounded-[24px] text-slate-300">
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-space text-[12px] font-bold uppercase">其他</span>
          </button>
        </div>
      </section>

      {/* Dial Picker Simulation */}
      <section className="flex flex-col items-center py-4">
        <div className="relative w-64 h-64 flex items-center justify-center rounded-full shadow-[0_15px_30px_rgba(34,197,94,0.08)] bg-white">
          {/* Inner Neomorphic Dial */}
          <div className="absolute inset-4 rounded-full neomorphic-ring-inset flex flex-col items-center justify-center bg-[#f8f9ff]">
            <span className="font-lexend text-6xl font-bold text-primary leading-none">{duration}</span>
            <span className="font-space text-[12px] font-bold text-slate-500 mt-2 uppercase tracking-widest">分钟</span>
          </div>
          
          {/* SVG Dial Marker */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 8" />
             <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: duration / 120 }}
              d="M 128,10 A 118,118 0 0 1 216,48" 
              fill="none" 
              stroke="#22c55e" 
              strokeLinecap="round" 
              strokeWidth="6" 
             />
          </svg>
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-4 h-4 bg-primary border-4 border-white rounded-full shadow-md" />
        </div>

        <div className="flex gap-12 mt-8">
           <button 
             onClick={() => setDuration(d => Math.max(5, d - 5))}
             className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md text-primary active:scale-90 transition-transform"
           >
             <Minus className="w-6 h-6" />
           </button>
           <button 
             onClick={() => setDuration(d => Math.min(120, d + 5))}
             className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md text-primary active:scale-90 transition-transform"
           >
             <Plus className="w-6 h-6" />
           </button>
        </div>
      </section>

      {/* Rewards Card */}
      <section className="bg-gradient-to-br from-primary/10 to-surface-container-high p-6 rounded-[32px] border border-white relative overflow-hidden shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-2">
            <div className="inline-flex px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest font-space">
              达成阶段里程牌
            </div>
            <p className="font-lexend text-2xl font-bold text-primary">消耗了 {caloriesBurned} kcal!</p>
            <p className="text-sm text-slate-500">
              相当于 <span className="font-bold text-secondary-container">{Math.round(caloriesBurned / 300)} 杯奶茶</span>!
            </p>
          </div>
          <div className="w-24 h-24 shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1544333346-64e4fe1fdeb5?auto=format&fit=crop&q=80&w=150" 
              alt="Milk Tea" 
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      <button 
        onClick={handleConfirm}
        className="w-full h-16 bg-primary text-white font-manrope font-bold text-lg rounded-full shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
        完成运动
        <CheckCircle2 className="w-6 h-6" />
      </button>
    </div>
  );
}

import { 
  Activity, 
  Waves, 
  Bike, 
  Home, 
  Accessibility 
} from 'lucide-react';

function getIcon(name: string) {
  const icons: any = {
    directions_run: Activity,
    pool: Waves,
    directions_bike: Bike,
    house: Home,
    self_improvement: Accessibility
  };
  return icons[name] || Activity;
}
