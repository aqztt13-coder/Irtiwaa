import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  SlidersHorizontal,
  Check,
  Sparkles,
} from 'lucide-react';

interface QuickAddWaterProps {
  onAddWater: (amountMl: number) => void;
}

export const QuickAddWater: React.FC<QuickAddWaterProps> = ({ onAddWater }) => {
  const [customAmount, setCustomAmount] = useState<number>(300);
  const [showCustomSlider, setShowCustomSlider] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const triggerAdd = (amount: number) => {
    onAddWater(amount);
    setAddedToast(`+${amount} مل ماء نقي`);
    setTimeout(() => {
      setAddedToast(null);
    }, 2000);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel-elevated relative overflow-hidden">
      {/* Toast Alert */}
      {addedToast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 animate-bounce">
          <Check className="w-4 h-4" />
          <span>تم تسجيل {addedToast} بنجاح</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-['Tajawal']">
              تسجيل شرب الماء
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-600">اختر كمية الماء بلمسة واحدة سريعة</p>
          </div>
        </div>

        <button
          onClick={() => setShowCustomSlider(!showCustomSlider)}
          className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            showCustomSlider
              ? 'bg-cyan-500/20 text-cyan-300 light:text-cyan-800 border-cyan-500/40'
              : 'bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 text-slate-300 light:text-slate-700 border-slate-700/60 light:border-slate-300 hover:border-cyan-500/30'
          }`}
          title="تخصيص كمية يدوية"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">كمية مخصصة</span>
        </button>
      </div>

      {/* Quick Add Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 150 ml */}
        <button
          onClick={() => triggerAdd(150)}
          className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 dark:from-slate-800/80 dark:to-slate-900/80 light:from-white light:to-slate-50 hover:from-cyan-900/30 hover:to-slate-800/90 light:hover:from-cyan-50 light:hover:to-white border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 hover:border-cyan-500/50 transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 light:bg-cyan-100 flex items-center justify-center text-cyan-400 light:text-cyan-700 group-hover:bg-cyan-500/20 mb-1.5 transition-colors">
            <span className="text-xs font-bold font-mono">150</span>
          </div>
          <span className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">كوب صغير</span>
          <span className="text-[11px] text-cyan-400 light:text-cyan-600 font-semibold mt-0.5">+150 مل</span>
        </button>

        {/* 250 ml */}
        <button
          onClick={() => triggerAdd(250)}
          className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 dark:from-slate-800/80 dark:to-slate-900/80 light:from-white light:to-slate-50 hover:from-cyan-900/30 hover:to-slate-800/90 light:hover:from-cyan-50 light:hover:to-white border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 hover:border-cyan-500/50 transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 light:bg-cyan-100 flex items-center justify-center text-cyan-400 light:text-cyan-700 group-hover:bg-cyan-500/20 mb-1.5 transition-colors">
            <span className="text-xs font-bold font-mono">250</span>
          </div>
          <span className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">كوب قياسي</span>
          <span className="text-[11px] text-cyan-400 light:text-cyan-600 font-semibold mt-0.5">+250 مل</span>
        </button>

        {/* 330 ml */}
        <button
          onClick={() => triggerAdd(330)}
          className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 dark:from-slate-800/80 dark:to-slate-900/80 light:from-white light:to-slate-50 hover:from-cyan-900/30 hover:to-slate-800/90 light:hover:from-cyan-50 light:hover:to-white border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 hover:border-cyan-500/50 transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 light:bg-cyan-100 flex items-center justify-center text-cyan-400 light:text-cyan-700 group-hover:bg-cyan-500/20 mb-1.5 transition-colors">
            <span className="text-xs font-bold font-mono">330</span>
          </div>
          <span className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">عبوة مياه</span>
          <span className="text-[11px] text-cyan-400 light:text-cyan-600 font-semibold mt-0.5">+330 مل</span>
        </button>

        {/* 500 ml */}
        <button
          onClick={() => triggerAdd(500)}
          className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 dark:from-slate-800/80 dark:to-slate-900/80 light:from-white light:to-slate-50 hover:from-cyan-900/30 hover:to-slate-800/90 light:hover:from-cyan-50 light:hover:to-white border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 hover:border-cyan-500/50 transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 light:bg-cyan-100 flex items-center justify-center text-cyan-400 light:text-cyan-700 group-hover:bg-cyan-500/20 mb-1.5 transition-colors">
            <span className="text-xs font-bold font-mono">500</span>
          </div>
          <span className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">قارورة رياضية</span>
          <span className="text-[11px] text-cyan-400 light:text-cyan-600 font-semibold mt-0.5">+500 مل</span>
        </button>
      </div>

      {/* Custom Slider Drawer */}
      {showCustomSlider && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-cyan-500/30 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 light:text-slate-700 mb-2">
            <span>تحديد كمية ماء دقيقة:</span>
            <span className="text-base font-bold text-cyan-400 light:text-cyan-700 font-mono">
              {customAmount} مل
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="1200"
            step="25"
            value={customAmount}
            onChange={(e) => setCustomAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 dark:bg-slate-700 light:bg-slate-300 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>50 مل</span>
            <span>250 مل</span>
            <span>500 مل</span>
            <span>750 مل</span>
            <span>1200 مل</span>
          </div>
          <button
            onClick={() => triggerAdd(customAmount)}
            className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل {customAmount} مل ماء</span>
          </button>
        </div>
      )}
    </div>
  );
};
