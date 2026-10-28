import React from 'react';
import { Activity, Plus, AlertTriangle, Moon, Check, Droplet } from 'lucide-react';
import { URINE_COLOR_SCALE, formatNumberEnglish } from '../utils/hydrationMath';

interface UrinationTrackerCardProps {
  onOpenModal: () => void;
  count: number;
  totalOutputMl: number;
  averageColorLevel: number;
  urgencyCount: number;
  nocturnalCount: number;
}

export const UrinationTrackerCard: React.FC<UrinationTrackerCardProps> = ({
  onOpenModal,
  count,
  totalOutputMl,
  averageColorLevel,
  urgencyCount,
  nocturnalCount,
}) => {
  const roundedColor = Math.min(8, Math.max(1, Math.round(averageColorLevel || 2)));
  const avgColorItem = URINE_COLOR_SCALE[roundedColor - 1];

  return (
    <div className="p-6 rounded-3xl glass-panel-elevated relative overflow-hidden group">
      {/* Background ambient amber glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 light:bg-amber-50 border border-amber-500/30 light:border-amber-200 text-amber-400 light:text-amber-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-['Tajawal']">
              تتبع التبول والمخرجات
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">مؤشر الإخراج الكلوي والترطيب</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 dark:text-amber-300 light:bg-amber-50 light:text-amber-800 border border-amber-500/30 light:border-amber-200 font-mono">
          {count} مرات اليوم
        </span>
      </div>

      {/* Primary Big Quick-Log Button */}
      <button
        onClick={onOpenModal}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer mb-5"
      >
        <div className="p-1 rounded-lg bg-slate-950/20 text-slate-950">
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </div>
        <span>تسجيل تبول جديد</span>
      </button>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Total output */}
        <div className="p-3 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">إجمالي المخرجات</span>
          <div className="mt-1">
            <span className="text-base sm:text-lg font-black text-amber-400 dark:text-amber-400 light:text-amber-600 font-mono">
              {formatNumberEnglish(totalOutputMl)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 mr-1">مل</span>
          </div>
        </div>

        {/* Average Color */}
        <div className="p-3 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">متوسط اللون</span>
          <div className="mt-1 flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-full border border-white/30 dark:border-white/30 light:border-slate-300 shadow-sm"
              style={{ backgroundColor: avgColorItem.color }}
            />
            <span className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 font-mono">
              {count > 0 ? `درجة ${averageColorLevel}` : 'لا يوجد'}
            </span>
          </div>
        </div>

        {/* Urgency / Nocturia */}
        <div className="p-3 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">إلحاح / ليلي</span>
          <div className="mt-1 flex items-center gap-2 text-xs font-semibold font-mono">
            <span
              className={urgencyCount > 0 ? 'text-amber-400 light:text-amber-700' : 'text-slate-400 light:text-slate-400'}
              title="مرات الإلحاح المفاجئ"
            >
              {urgencyCount} إلحاح
            </span>
            <span className="text-slate-500">•</span>
            <span
              className={nocturnalCount > 0 ? 'text-indigo-400 light:text-indigo-700' : 'text-slate-400 light:text-slate-400'}
              title="مرات الاستيقاظ الليلي"
            >
              {nocturnalCount} ليلي
            </span>
          </div>
        </div>
      </div>

      {/* Health status guidance */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between text-xs">
        <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">
          المعدل الطبيعي للبالغين: <strong className="text-slate-200 dark:text-slate-200 light:text-slate-900 font-mono">4 إلى 8 مرات</strong>
        </span>
        <span
          className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
            count >= 4 && count <= 8
              ? 'bg-emerald-500/20 text-emerald-400 light:bg-emerald-50 light:text-emerald-700'
              : count > 8
              ? 'bg-amber-500/20 text-amber-400 light:bg-amber-50 light:text-amber-700'
              : 'bg-cyan-500/20 text-cyan-400 light:bg-cyan-50 light:text-cyan-700'
          }`}
        >
          {count >= 4 && count <= 8 ? 'معدل مثالي' : count > 8 ? 'إخراج مرتفع' : 'قيد المتابعة'}
        </span>
      </div>
    </div>
  );
};
