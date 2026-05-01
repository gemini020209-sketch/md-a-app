import { useApp } from '../context/AppContext';
import { Camera, Dumbbell, Utensils, HeartPulse, Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import { View } from '../types';

export function DashboardView() {
  const { totalIntake, totalExpenditure, setView } = useApp();
  const gap = totalExpenditure - totalIntake;
  const isPositive = gap > 0;

  return (
    <div className="pt-24 pb-32 px-5 max-w-md mx-auto space-y-8">
      {/* Energy Ring Section */}
      <section className="flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-72 h-72 flex items-center justify-center rounded-full neomorphic-ring-container bg-[#f8f9ff] p-6"
        >
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              className="text-slate-100" 
              cx="144" cy="144" fill="transparent" r="120" 
              stroke="currentColor" strokeWidth="14" 
            />
            <motion.circle 
              initial={{ strokeDashoffset: 754 }}
              animate={{ strokeDashoffset: 754 - (Math.min(1, totalIntake / totalExpenditure) * 754) }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-primary-container" 
              cx="144" cy="144" fill="transparent" r="120" 
              stroke="currentColor" strokeDasharray="754" 
              strokeLinecap="round" strokeWidth="14" 
            />
          </svg>
          <div className="z-10 text-center flex flex-col items-center justify-center w-52 h-52 rounded-full bg-white neomorphic-ring-inset">
            <span className="font-space text-slate-500 mb-1 uppercase tracking-widest text-[10px]">每日热量缺口</span>
            <span className={cn(
              "font-lexend text-5xl font-bold",
              isPositive ? "text-primary" : "text-secondary"
            )}>
              {isPositive ? `+${gap}` : gap}
            </span>
            <span className={cn(
              "font-manrope font-semibold mt-1",
              isPositive ? "text-primary" : "text-secondary"
            )}>
              千卡
            </span>
            <div className="flex gap-4 mt-6 border-t border-slate-100 pt-4 w-32 justify-center">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-space uppercase">摄入</span>
                <span className="text-sm font-lexend font-bold text-on-surface">{totalIntake}</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-space uppercase">消耗</span>
                <span className="text-sm font-lexend font-bold text-on-surface">{totalExpenditure}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Health Indicators */}
      <section className="space-y-4">
        <h2 className="font-lexend text-xl font-bold text-on-surface">生物指标状态</h2>
        
        <StatusCard 
          icon={Utensils}
          title="嘌呤负荷"
          desc="尿酸平衡"
          status="安全"
          variant="success"
        />
        <StatusCard 
          icon={HeartPulse}
          title="升糖负荷"
          desc="血糖反应"
          status="注意"
          variant="warning"
        />
        <StatusCard 
          icon={Calculator}
          title="热量摄入"
          desc="每日能量限制"
          status="良好"
          variant="success"
        />
      </section>

      {/* Floating Buttons */}
      <div className="flex gap-4 pt-4">
        <button 
          onClick={() => setView(View.SCAN)}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 px-6 rounded-[24px] font-manrope font-bold shadow-lg vibrant-glow active:scale-95 transition-all"
        >
          <Camera className="w-5 h-5 fill-current" />
          拍食物
        </button>
        <button 
          onClick={() => setView(View.EXERCISE)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0b1c30] text-white py-4 px-6 rounded-[24px] font-manrope font-bold shadow-lg active:scale-95 transition-all"
        >
          <Dumbbell className="w-5 h-5" />
          记运动
        </button>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, title, desc, status, variant }: { 
  icon: any, title: string, desc: string, status: string, variant: 'success' | 'warning' | 'danger' 
}) {
  const colors = {
    success: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-secondary-container/10 text-secondary-container border-secondary-container/20",
    danger: "bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20",
  };

  const ringColors = {
    success: "bg-primary",
    warning: "bg-secondary-container",
    danger: "bg-tertiary-container",
  };

  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-200 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          variant === 'success' ? "bg-green-50 text-primary" : "bg-orange-50 text-secondary-container"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-manrope font-bold text-on-surface">{title}</p>
          <p className="text-sm text-slate-500">{desc}</p>
        </div>
      </div>
      <div className={cn(
        "px-4 py-1.5 rounded-full font-space text-[12px] font-bold flex items-center gap-1.5 border",
        colors[variant]
      )}>
        <span className={cn("w-2 h-2 rounded-full", ringColors[variant])} />
        {status}
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
