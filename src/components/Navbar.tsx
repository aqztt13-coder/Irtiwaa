import { Moon, Sun, Calculator, Download, RotateCcw, Droplets, Bell, BellRing, Smartphone } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenCalculator: () => void;
  onOpenExport: () => void;
  onOpenNotificationSettings: () => void;
  onOpenInstallModal: () => void;
  isNotificationsEnabled: boolean;
  onResetToday: () => void;
  canReset: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenCalculator,
  onOpenExport,
  onOpenNotificationSettings,
  onOpenInstallModal,
  isNotificationsEnabled,
  onResetToday,
  canReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B1120]/80 border-b border-white/10 dark:bg-[#0B1120]/80 light:bg-white/80 light:border-slate-200 transition-colors pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            {/* Custom SVG Logo: Droplet with ECG pulse and glowing gradient */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 p-1.5 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] flex items-center justify-center transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 100 120"
                className="w-full h-full drop-shadow-[0_2px_8px_rgba(6,182,212,0.8)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="60%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06B6D4" floodOpacity="0.8" />
                  </filter>
                </defs>
                {/* Water Droplet Path */}
                <path
                  d="M50 8 C50 8 16 55 16 82 C16 100.7 31.3 114 50 114 C68.7 114 84 100.7 84 82 C84 55 50 8 50 8 Z"
                  fill="url(#dropGrad)"
                  fillOpacity="0.25"
                  stroke="url(#dropGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* ECG / Vital Wave passing through droplet */}
                <path
                  d="M24 78 L38 78 L44 64 L50 94 L56 70 L62 82 L76 78"
                  stroke="#38BDF8"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
                {/* Glowing Core Dot */}
                <circle cx="50" cy="94" r="3" fill="#67E8F9" />
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white dark:text-white light:text-slate-900 font-['Tajawal',sans-serif]">
                ارتواء <span className="text-cyan-400 font-medium text-base tracking-normal">| Irtiwaa</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Hydro-Bio
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
              المتابعة الذكية للتوازن المائي والوظائف الحيوية
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Target Calculator */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200 light:border-slate-300 transition-all hover:border-cyan-500/40 shadow-sm cursor-pointer"
            title="حاسبة الهدف اليومي"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">حاسبة الهدف</span>
          </button>

          {/* Notification Settings */}
          <button
            onClick={onOpenNotificationSettings}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all shadow-sm cursor-pointer ${
              isNotificationsEnabled
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 light:bg-cyan-50 light:border-cyan-300 light:text-cyan-700 shadow-cyan-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200 light:border-slate-300 hover:border-cyan-500/40'
            }`}
            title="إعدادات التنبيهات الدورية"
          >
            {isNotificationsEnabled ? (
              <BellRing className="w-4 h-4 text-cyan-400 animate-pulse" />
            ) : (
              <Bell className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden md:inline">التنبيهات</span>
            {isNotificationsEnabled && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            )}
          </button>

          {/* Install PWA Button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 light:text-cyan-800 border border-cyan-500/40 light:border-cyan-300 light:bg-cyan-50 transition-all shadow-sm cursor-pointer"
            title="تثبيت التطبيق للاستخدام بدون إنترنت"
          >
            <Smartphone className="w-4 h-4 text-cyan-400 light:text-cyan-600" />
            <span className="hidden sm:inline">تثبيت التطبيق</span>
          </button>

          {/* Export Data */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200 light:border-slate-300 transition-all hover:border-cyan-500/40 shadow-sm cursor-pointer"
            title="تصدير السجل اليومي"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">تصدير السجل</span>
          </button>

          {/* Reset / Clear Today */}
          {canReset && (
            <button
              onClick={onResetToday}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer"
              title="تصفير بيانات اليوم"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 light:bg-slate-100 light:text-slate-700 light:border-slate-300 transition-colors cursor-pointer"
            title={isDarkMode ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            aria-label="تبديل الوضع"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
