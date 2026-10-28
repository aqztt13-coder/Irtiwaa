import React from 'react';
import { Droplet, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { formatNumberEnglish } from '../utils/hydrationMath';

interface HydrationRingProps {
  currentWaterMl: number;
  targetMl: number;
  progressPercent: number;
  remainingMl: number;
}

export const HydrationRing: React.FC<HydrationRingProps> = ({
  currentWaterMl,
  targetMl,
  progressPercent,
  remainingMl,
}) => {
  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, progressPercent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;
  const isGoalReached = progressPercent >= 100;
  const waveHeight = Math.min(100, Math.max(8, clampedPercent));

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl glass-panel-elevated overflow-hidden group">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/15 dark:bg-cyan-500/15 light:bg-cyan-500/10 blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-125" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-600/15 dark:bg-blue-600/15 light:bg-blue-600/5 blur-3xl pointer-events-none" />

      {/* Header status */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 light:bg-cyan-50 border border-cyan-500/30 light:border-cyan-200 text-cyan-400 light:text-cyan-600">
            <Droplet className="w-5 h-5 fill-cyan-400/20 light:fill-cyan-500/20" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-['Tajawal']">
              مؤشر شرب الماء اليومي
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
              الهدف: {formatNumberEnglish(targetMl)} مل
            </p>
          </div>
        </div>

        {isGoalReached ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 light:bg-emerald-100 light:text-emerald-800 border border-emerald-500/40 light:border-emerald-300 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            اكتمل الهدف!
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 dark:text-cyan-300 light:bg-cyan-50 light:text-cyan-700 border border-cyan-500/20 light:border-cyan-200">
            متبقٍ {formatNumberEnglish(remainingMl)} مل
          </span>
        )}
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative my-2 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center drop-shadow-[0_0_12px_rgba(6,182,212,0.3)] light:drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="70%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <clipPath id="circleClip">
              <circle cx={size / 2} cy={size / 2} r={radius - strokeWidth / 2 - 4} />
            </clipPath>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/80 dark:text-slate-800/80 light:text-slate-100"
            fill="transparent"
          />

          {/* Progress Path */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#ringGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Wave Container */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ clipPath: 'url(#circleClip)' }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/20 via-sky-500/10 to-transparent light:from-cyan-500/15 light:via-sky-500/5 transition-all duration-1000 ease-out"
            style={{ height: `${waveHeight}%` }}
          >
            <div className="w-[200%] h-6 -top-3 absolute left-0 bg-gradient-to-r from-cyan-400/20 via-sky-300/10 to-cyan-400/20 rounded-[45%] animate-wave" />
          </div>
        </div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white dark:text-white light:text-slate-900 font-['Tajawal'] font-mono">
              {progressPercent}%
            </span>
          </div>

          <div className="mt-1 flex items-center justify-center gap-1.5 text-cyan-300 dark:text-cyan-300 light:text-cyan-700 font-semibold text-sm">
            <span className="font-mono">{formatNumberEnglish(currentWaterMl)}</span>
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-400 font-normal">/</span>
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 font-normal text-xs font-mono">
              {formatNumberEnglish(targetMl)} مل
            </span>
          </div>

          <div className="mt-2">
            {isGoalReached ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 dark:text-emerald-300 light:bg-emerald-50 light:text-emerald-700 font-medium border border-emerald-500/30 light:border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                أحسنت! أتممت هدف الماء
              </span>
            ) : progressPercent >= 75 ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 dark:text-cyan-300 light:bg-cyan-50 light:text-cyan-700 font-medium border border-cyan-500/30 light:border-cyan-200">
                أوشكت على الوصول
              </span>
            ) : progressPercent >= 40 ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 dark:text-blue-300 light:bg-blue-50 light:text-blue-700 font-medium border border-blue-500/30 light:border-blue-200">
                استمر في شرب الماء
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 dark:text-cyan-300 light:bg-cyan-50 light:text-cyan-700 font-medium border border-cyan-500/30 light:border-cyan-200 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                ابدأ ترطيب يومك
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 dark:border-white/5 light:border-slate-100">
        <div className="text-center p-2.5 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border border-transparent light:border-slate-200">
          <span className="block text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">إجمالي شرب الماء</span>
          <span className="text-sm font-bold text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-mono">
            {formatNumberEnglish(currentWaterMl)} مل
          </span>
        </div>
        <div className="text-center p-2.5 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border border-transparent light:border-slate-200">
          <span className="block text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">المتبقي للهدف</span>
          <span className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 font-mono">
            {formatNumberEnglish(remainingMl)} مل
          </span>
        </div>
      </div>
    </div>
  );
};
