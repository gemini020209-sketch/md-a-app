import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { Lightbulb, TrendingDown, Target, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export function ReportView() {
  const [range, setRange] = useState<'week' | 'month'>('week');
  
  const mockData = [
    { day: '周一', value: -350 },
    { day: '周二', value: -420 },
    { day: '周三', value: -120 },
    { day: '周四', value: -380 },
    { day: '周五', value: -550 },
    { day: '周六', value: -420 },
    { day: '周日', value: -200 },
  ];

  const radarData = [
    { subject: '蛋白质', A: 120, fullMark: 150 },
    { subject: '脂肪', A: 98, fullMark: 150 },
    { subject: '碳水', A: 86, fullMark: 150 },
    { subject: '嘌呤', A: 99, fullMark: 150 },
    { subject: '纤维', A: 85, fullMark: 150 },
  ];

  return (
    <div className="pt-24 pb-32 px-5 max-w-md mx-auto space-y-8">
      {/* Range Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-full flex w-full max-w-[240px] shadow-inner">
          <button 
            onClick={() => setRange('week')}
            className={cn(
              "flex-1 py-1.5 px-6 rounded-full font-bold text-xs transition-all",
              range === 'week' ? "bg-white shadow-sm text-primary" : "text-slate-400"
            )}
          >周</button>
          <button 
             onClick={() => setRange('month')}
             className={cn(
              "flex-1 py-1.5 px-6 rounded-full font-bold text-xs transition-all",
              range === 'month' ? "bg-white shadow-sm text-primary" : "text-slate-400"
            )}
          >月</button>
        </div>
      </div>

      {/* Insight Card */}
      <section className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
        <div className="bg-orange-500 text-white p-2 rounded-xl">
           <Lightbulb className="w-5 h-5" />
        </div>
        <div>
           <h3 className="font-bold text-orange-900 text-sm mb-1">本周洞察</h3>
           <p className="text-xs text-orange-800/80 leading-relaxed">
             本周检测到 3 次高嘌呤摄入。建议本周末增加绿叶蔬菜比例，控制碳水总量。
           </p>
        </div>
      </section>

      {/* Metabolism Chart */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
             <span className="font-space text-[10px] font-bold text-primary uppercase tracking-widest">代谢趋势</span>
             <h2 className="font-lexend text-xl font-bold">每日热量差</h2>
          </div>
          <div className="text-right">
             <span className="font-lexend text-2xl font-bold text-orange-500">-420</span>
             <span className="text-[10px] text-slate-400 block uppercase font-space">平均千卡/天</span>
          </div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm h-64">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                 <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                 />
                 <Bar 
                  dataKey="value" 
                  fill="#22c55e" 
                  radius={[6, 6, 0, 0]} 
                  fillOpacity={0.4}
                  activeBar={{ fill: "#22c55e", fillOpacity: 1 }}
                />
              </BarChart>
           </ResponsiveContainer>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
         {/* Nutrition Radar */}
         <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm">
            <div className="mb-4">
               <span className="font-space text-[10px] font-bold text-tertiary uppercase tracking-widest">成分占比</span>
               <h3 className="font-manrope font-bold text-sm">营养雷达</h3>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#94a3b8' }} />
                    <Radar name="营养" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                 </RadarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Weight Trend */}
         <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <span className="font-space text-[10px] font-bold text-blue-500 uppercase tracking-widest">身体指标</span>
                  <h3 className="font-manrope font-bold text-sm">体重趋势</h3>
               </div>
               <div className="flex items-center gap-1 text-primary">
                  <TrendingDown className="w-3 h-3" />
                  <span className="font-bold text-[10px]">-0.8 kg</span>
               </div>
            </div>
            <div className="space-y-4">
                <div className="h-12 flex items-end gap-1">
                   {[40, 45, 52, 48, 60, 55, 50].map((v, i) => (
                     <div key={i} className="flex-1 bg-slate-50 rounded-t-sm relative group overflow-hidden" style={{ height: `${v}%` }}>
                        <div className={cn(
                          "absolute top-0 inset-x-0 h-1",
                          i === 6 ? "bg-primary" : "bg-slate-200"
                        )} />
                     </div>
                   ))}
                </div>
                <div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-lexend font-bold">72.4</span>
                      <span className="text-xs font-bold text-slate-400">kg</span>
                   </div>
                   <p className="text-[10px] text-slate-400 mt-1">最后称重：今天 8:15 AM</p>
                </div>
            </div>
         </div>
      </div>

      {/* Performance Score */}
      <section className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl neomorphic-ring flex items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex-1 z-10">
           <h4 className="font-manrope font-bold mb-1">代谢评分</h4>
           <p className="text-xs text-slate-500 leading-relaxed">
             本周您的能量效率在活跃成年人中排名前 5%。
           </p>
           <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-green-50 text-primary text-[10px] font-bold rounded-full border border-green-100">科学性</span>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100">准确度</span>
           </div>
        </div>
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
           <svg className="w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="200" strokeDashoffset="30" strokeLinecap="round" />
           </svg>
           <span className="absolute font-lexend text-2xl font-bold text-primary">85</span>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      </section>
    </div>
  );
}
