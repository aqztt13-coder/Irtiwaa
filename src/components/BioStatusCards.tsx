import React from 'react';
import { Clock, Scale, AlertCircle, Droplets, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatTimeElapsedArabic, calculateFluidBalance, formatNumberEnglish } from '../utils/hydrationMath';

interface BioStatusCardsProps {
  lastFluidTimestamp: string | null;
  lastUrinationTimestamp: string | null;
  totalEffectiveInMl: number;
  totalUrineOutMl: number;
}

export const BioStatusCards: React.FC<BioStatusCardsProps> = ({
  lastFluidTimestamp,
  lastUrinationTimestamp,
  totalEffectiveInMl,
  totalUrineOutMl,
}) => {
  const balance = calculateFluidBalance(totalEffectiveInMl, totalUrineOutMl);

  // Check if prolonged time (> 2.5 hours) without drinking
  const isHydrationOverdue = (() => {
    if (!lastFluidTimestamp) return false;
    const diffHours = (Date.now() - new Date(lastFluidTimestamp).getTime()) / (1000 * 60 * 60);
    return diffHours >= 2.5;
  })();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Live Time Elapsed Card */}
      <div className="p-5 rounded-3xl glass-panel-elevated relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 light:bg-cyan-50 border border-cyan-500/30 light:border-cyan-200 text-cyan-400 light:text-cyan-600">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 font-['Tajawal']">
              المؤقت الحي للأنشطة
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">تحديث لحظي</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Last Drink */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              isHydrationOverdue
                ? 'bg-amber-500/10 border-amber-500/40 light:bg-amber-50 light:border-amber-300'
                : 'bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border-slate-700/50 dark:border-slate-700/50 light:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mb-1">
              <span>آخر شرب ماء</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-400 light:text-cyan-600" />
            </div>
            <p className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 font-['Tajawal']">
              {formatTimeElapsedArabic(lastFluidTimestamp)}
            </p>
            {isHydrationOverdue && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 light:text-amber-700 font-semibold mt-1">
                <AlertCircle className="w-3 h-3" />
                حان وقت شرب كوب!
              </span>
            )}
          </div>

          {/* Last Urination */}
          <div className="p-3 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mb-1">
              <span>آخر تبول</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
            </div>
            <p className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 font-['Tajawal']">
              {formatTimeElapsedArabic(lastUrinationTimestamp)}
            </p>
            <span className="text-[10px] text-slate-500 dark:text-slate-500 light:text-slate-400 block mt-1">
              متابعة تصريف السوائل
            </span>
          </div>
        </div>
      </div>

      {/* 2. Fluid Balance (الداخل vs الخارج) Card */}
      <div className="p-5 rounded-3xl glass-panel-elevated relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 light:bg-emerald-50 border border-emerald-500/30 light:border-emerald-200 text-emerald-400 light:text-emerald-600">
              <Scale className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 font-['Tajawal']">
              توازن السوائل الحيوية (Fluid Balance)
            </h4>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              balance.badgeColor === 'emerald'
                ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-300 light:text-emerald-800 border-emerald-500/40 light:bg-emerald-50 light:border-emerald-200'
                : balance.badgeColor === 'amber'
                ? 'bg-amber-500/20 text-amber-300 dark:text-amber-300 light:text-amber-800 border-amber-500/40 light:bg-amber-50 light:border-amber-200'
                : 'bg-cyan-500/20 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 border-cyan-500/40 light:bg-cyan-50 light:border-cyan-200'
            }`}
          >
            {balance.statusArabic}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Inflow */}
          <div className="p-2.5 rounded-2xl bg-cyan-950/20 dark:bg-cyan-950/20 light:bg-cyan-50/70 border border-cyan-800/30 dark:border-cyan-800/30 light:border-cyan-200 text-center">
            <span className="text-[10px] text-cyan-300 dark:text-cyan-300 light:text-cyan-700 flex items-center justify-center gap-1 mb-0.5">
              <ArrowDownLeft className="w-3 h-3 text-cyan-400 light:text-cyan-600" />
              الداخل الفعال
            </span>
            <span className="text-sm sm:text-base font-black text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-mono">
              {formatNumberEnglish(totalEffectiveInMl)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 mr-0.5"> مل</span>
          </div>

          {/* Outflow */}
          <div className="p-2.5 rounded-2xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50/70 border border-amber-800/30 dark:border-amber-800/30 light:border-amber-200 text-center">
            <span className="text-[10px] text-amber-300 dark:text-amber-300 light:text-amber-700 flex items-center justify-center gap-1 mb-0.5">
              <ArrowUpRight className="w-3 h-3 text-amber-400 light:text-amber-600" />
              الخارج المقدر
            </span>
            <span className="text-sm sm:text-base font-black text-amber-300 dark:text-amber-300 light:text-amber-800 font-mono">
              {formatNumberEnglish(totalUrineOutMl)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 mr-0.5"> مل</span>
          </div>

          {/* Net difference */}
          <div className="p-2.5 rounded-2xl bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-50 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 block mb-0.5">
              الفارق الصافي
            </span>
            <span
              className={`text-sm sm:text-base font-black font-mono ${
                balance.netBalanceMl >= 0
                  ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-700'
                  : 'text-amber-400 dark:text-amber-400 light:text-amber-700'
              }`}
            >
              {balance.netBalanceMl > 0 ? `+${balance.netBalanceMl}` : balance.netBalanceMl}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 mr-0.5"> مل</span>
          </div>
        </div>
      </div>
    </div>
  );
};
