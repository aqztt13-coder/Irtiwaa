import React from 'react';
import { LayoutDashboard, Droplets, Activity, ListOrdered, BarChart2 } from 'lucide-react';

export type MobileTab = 'dashboard' | 'timeline' | 'analytics';

interface MobileTabBarProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onOpenQuickWater: () => void;
  onOpenUrinationModal: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickWater,
  onOpenUrinationModal,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto mb-3 pointer-events-auto">
        <nav
          className="flex items-center justify-around px-2 py-2 rounded-3xl bg-[#0F172A]/90 dark:bg-[#0F172A]/95 light:bg-white/95 backdrop-blur-2xl border border-white/10 dark:border-white/10 light:border-slate-300 shadow-2xl shadow-black/50"
          aria-label="شريط التنقل السفلي"
        >
          {/* 1. Dashboard Tab */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              currentTab === 'dashboard'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">الرئيسية</span>
          </button>

          {/* 2. Quick Water Button */}
          <button
            onClick={onOpenQuickWater}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
            title="تسجيل شرب ماء"
            aria-label="تسجيل شرب ماء"
          >
            <Droplets className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-0.5">+ ماء</span>
          </button>

          {/* 3. Quick Urination Button */}
          <button
            onClick={onOpenUrinationModal}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer font-bold"
            title="تسجيل تبول"
            aria-label="تسجيل تبول"
          >
            <Activity className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">+ تبول</span>
          </button>

          {/* 4. Timeline Tab */}
          <button
            onClick={() => onSelectTab('timeline')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              currentTab === 'timeline'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">السجل</span>
          </button>

          {/* 5. Analytics Tab */}
          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              currentTab === 'analytics'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">التحليلات</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
