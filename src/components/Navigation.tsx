import { Bell, LayoutGrid, Aperture, Dumbbell, BarChart3, Camera, Play } from 'lucide-react';
import { View } from '../types';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export function Header({ title }: { title: string }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-primary/5">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-lexend">{title}</h1>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-primary transition-colors">
        <Bell className="w-5 h-5" />
      </button>
    </header>
  );
}

export function BottomNav() {
  const { currentView, setView } = useApp();

  const navItems = [
    { view: View.DASHBOARD, label: '首页', icon: LayoutGrid },
    { view: View.SCAN, label: '扫描', icon: Aperture },
    { view: View.EXERCISE, label: '运动', icon: Dumbbell },
    { view: View.REPORT, label: '报告', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-white border-t border-slate-100 rounded-t-[24px] shadow-[0_-10px_30px_rgba(34,197,94,0.08)]">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        const Icon = item.icon;
        return (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={cn(
              "flex flex-col items-center transition-all p-2 relative rounded-xl",
              isActive ? "text-primary" : "text-slate-400 hover:bg-slate-50"
            )}
          >
            <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current/10")} />
            <span className="font-lexend text-[11px] font-medium">{item.label}</span>
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
