import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 text-slate-100 dark:text-slate-100 light:text-slate-900 border border-cyan-500/30 shadow-2xl backdrop-blur-md animate-fadeIn">
      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4" />
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1.5 text-xs font-bold font-['Tajawal'] text-cyan-400 light:text-cyan-700">
          <span>وضع عدم الاتصال (Offline)</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <p className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600">
          التطبيق يعمل بكامل وظائفه بدون إنترنت، وجميع بياناتك محفوظة محلياً.
        </p>
      </div>
    </div>
  );
};
