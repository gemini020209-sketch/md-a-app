import { AppProvider, useApp } from './context/AppContext';
import { Header, BottomNav } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ScanView } from './components/ScanView';
import { ExerciseView } from './components/ExerciseView';
import { ReportView } from './components/ReportView';
import { View } from './types';

function ViewManager() {
  const { currentView } = useApp();

  const getTitle = () => {
    switch (currentView) {
      case View.DASHBOARD: return '数据看板';
      case View.SCAN: return '美食扫描';
      case View.EXERCISE: return '运动记录';
      case View.REPORT: return '趋势报告';
      default: return 'VigorTrack';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {currentView !== View.SCAN && <Header title={getTitle()} />}
      
      <main>
        {currentView === View.DASHBOARD && <DashboardView />}
        {currentView === View.SCAN && <ScanView />}
        {currentView === View.EXERCISE && <ExerciseView />}
        {currentView === View.REPORT && <ReportView />}
      </main>

      {currentView !== View.SCAN && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ViewManager />
    </AppProvider>
  );
}
