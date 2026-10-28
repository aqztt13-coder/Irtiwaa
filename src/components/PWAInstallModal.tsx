import React from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, WifiOff, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn dir-rtl text-right font-['IBM_Plex_Sans_Arabic',sans-serif]">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-elevated p-6 sm:p-7 overflow-hidden border border-cyan-500/30 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-['Tajawal'] text-white dark:text-white light:text-slate-900">
              تثبيت تطبيق «ارتواء» على جهازك
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              استخدم التطبيق في أي وقت بدون إنترنت كتطبيق أصلي
            </p>
          </div>
        </div>

        {/* Offline Features Highlights */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-cyan-950/20 dark:bg-cyan-950/20 light:bg-cyan-50/70 border border-cyan-500/20 flex items-start gap-2">
            <WifiOff className="w-4 h-4 text-cyan-400 light:text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-cyan-300 dark:text-cyan-300 light:text-cyan-800 block">يعمل بدون إنترنت</span>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600">تسجيل الماء والتبول متاح دوماً بلا شبكة</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/20 dark:bg-emerald-950/20 light:bg-emerald-50/70 border border-emerald-500/20 flex items-start gap-2">
            <Zap className="w-4 h-4 text-emerald-400 light:text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-300 dark:text-emerald-300 light:text-emerald-800 block">سرعة فائقة واستجابة</span>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600">فتح فوري وشاشة كاملة بدون شريط متصفح</p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 mb-4">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>التطبيق مثبت بالفعل على جهازك!</span>
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              يمكنك تشغيله مباشرة من أيقونة الشاشة الرئيسية حتى أثناء انقطاع الإنترنت التام.
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Instructions */
          <div className="p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 space-y-3 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 light:text-cyan-700">
              <Share2 className="w-4 h-4" />
              <span>طريقة التثبيت على الآيفون والآيباد (iOS Safari):</span>
            </div>
            <ol className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 space-y-2 mr-2">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                <span>اضغط على زر <strong>المشاركة (Share)</strong> في أسفل شاشة متصفح سفاري.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  انزل للأسفل واضغط على
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-700/80 light:bg-slate-200 text-white light:text-slate-900 font-bold">
                    <PlusSquare className="w-3.5 h-3.5" /> إضافة إلى الشاشة الرئيسية
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                <span>اضغط <strong>إضافة (Add)</strong> في الزاوية العلوية ليظهر التطبيق في شاشتك الرئيسية.</span>
              </li>
            </ol>
          </div>
        ) : isInstallable ? (
          /* Android / Desktop Chrome 1-click Install */
          <div className="mb-5 space-y-3">
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>تثبيت التطبيق الآن بضغطة واحدة</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-400 light:text-slate-500">
              سيتم تثبيت التطبيق مباشرة على جهازك وسيعمل بوضع ملء الشاشة بدون إنترنت.
            </p>
          </div>
        ) : (
          /* Generic Guide */
          <div className="p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 space-y-2 mb-5">
            <span className="text-xs font-bold text-cyan-400 light:text-cyan-700 block">للتثبيت عبر المتصفح:</span>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
              افتح قائمة المتصفح (الثلاث نقاط أو زر المشاركة) واختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong> لتثبيت أيقونة التطبيق واستخدامه دائماً دون الحاجة لشبكة الإنترنت.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-200 flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>بياناتك آمنة وخاصة على جهازك بنسبة 100%</span>
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
