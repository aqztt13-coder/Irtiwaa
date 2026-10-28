import React from 'react';
import { Droplet, X, Plus, BellRing, Sparkles } from 'lucide-react';

interface InAppReminderBannerProps {
  isVisible: boolean;
  message: string;
  onQuickDrink: (amountMl: number) => void;
  onDismiss: () => void;
}

export const InAppReminderBanner: React.FC<InAppReminderBannerProps> = ({
  isVisible,
  message,
  onQuickDrink,
  onDismiss,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-bounce-short">
      <div className="p-4 rounded-3xl bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-2xl border-2 border-cyan-400 shadow-2xl shadow-cyan-500/25 text-slate-100 dark:text-slate-100 light:text-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 animate-pulse">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold font-['Tajawal'] text-white dark:text-white light:text-slate-900">
                  حان وقت شرب الماء! 💧
                </h4>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              </div>
              <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-0.5 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick action: +250 ml directly */}
        <div className="mt-3 pt-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center gap-2">
          <button
            onClick={() => onQuickDrink(250)}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>شربت كوباً الآن (+250 مل)</span>
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-2 rounded-xl bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            تأجيل
          </button>
        </div>
      </div>
    </div>
  );
};
