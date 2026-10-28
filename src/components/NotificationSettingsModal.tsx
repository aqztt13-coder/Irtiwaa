import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  BellRing,
  Clock,
  Volume2,
  VolumeX,
  Check,
  ShieldAlert,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  NotificationSettings,
  requestNotificationPermission,
  sendBrowserNotification,
  playWaterChime,
} from '../utils/notificationService';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onSaveSettings: (settings: NotificationSettings) => void;
  onTriggerTestReminder: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onTriggerTestReminder,
}) => {
  const [enabled, setEnabled] = useState<boolean>(settings.enabled);
  const [intervalHours, setIntervalHours] = useState<number>(settings.intervalHours || 2);
  const [startHour, setStartHour] = useState<number>(settings.startHour ?? 8);
  const [endHour, setEndHour] = useState<number>(settings.endHour ?? 23);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.soundEnabled);
  const [browserPermission, setBrowserPermission] = useState<string>('default');
  const [testSentToast, setTestSentToast] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setBrowserPermission(res);
    if (res === 'granted') {
      setEnabled(true);
    }
  };

  const handleSendTest = () => {
    if (soundEnabled) {
      playWaterChime();
    }
    sendBrowserNotification(
      'ارتواء | تذكير تجريبي بشرب الماء 💧',
      'هذا تنبيه تجريبي لتأكيد وصول إشعارات الارتواء بنجاح!'
    );
    onTriggerTestReminder();
    setTestSentToast(true);
    setTimeout(() => setTestSentToast(false), 3000);
  };

  const handleSave = () => {
    onSaveSettings({
      enabled,
      intervalHours,
      startHour,
      endHour,
      soundEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-settings-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 id="notification-settings-title" className="text-lg font-bold font-['Tajawal'] text-white">
                إعدادات تنبيهات شرب الماء
              </h2>
              <p className="text-xs text-slate-400">تذكير تلقائي دوري عند عدم تسجيل شرب الماء</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4.5 my-4">
          {/* Main On/Off Toggle */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  enabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700/30 text-slate-500'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-white">تفعيل التنبيهات الدورية</span>
                <span className="text-xs text-slate-400">
                  {enabled ? 'التنبيهات مفعلة وتراقب وقت آخر شرب' : 'التنبيهات متوقفة حالياً'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextState = !enabled;
                setEnabled(nextState);
                if (nextState && browserPermission === 'default') {
                  handleRequestPermission();
                }
              }}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={enabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  enabled ? 'translate-x-0' : '-translate-x-6'
                }`}
              />
            </button>
          </div>

          {/* Browser Permission Prompt Banner */}
          {browserPermission !== 'granted' && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>إذن إشعارات المتصفح: {browserPermission === 'denied' ? 'محظور' : 'غير ممنوح'}</span>
              </div>
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                تفعيل الإذن
              </button>
            </div>
          )}

          {/* Interval Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>تكرار التنبيه إذا لم يتم تسجيل أي شرب</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setIntervalHours(hours)}
                  className={`py-2.5 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                    intervalHours === hours
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs block">كل {hours} {hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتين' : 'ساعات'}</span>
                  {hours === 2 && (
                    <span className="text-[9px] text-cyan-400 font-semibold block mt-0.5">موصى به</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Hours Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              ساعات التنبيه اليومية (فترة الاستيقاظ)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-1">وقت البدء صباحاً</span>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {[6, 7, 8, 9, 10].map((h) => (
                    <option key={h} value={h}>
                      {h}:00 صباحاً
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-1">وقت التوقف قبل النوم</span>
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {[21, 22, 23, 24].map((h) => (
                    <option key={h} value={h}>
                      {h === 24 ? '12:00 منتصف الليل' : `${h - 12}:00 مساءً`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              لن يتم إرسال أي تنبيهات أثناء ساعات النوم لضمان راحتك.
            </p>
          </div>

          {/* Sound Effect Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-xs font-semibold text-slate-200">
                تشغيل رنة قطرات ماء هادئة عند التنبيه
              </span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Test Notification Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSendTest}
              className="w-full py-2.5 rounded-xl border border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال تنبيه تجريبي فوري الآن (تجربة الصوت والإشعار)</span>
            </button>
            {testSentToast && (
              <p className="text-[11px] text-center text-emerald-400 font-medium mt-1.5 animate-fadeIn">
                ✓ تم إرسال التنبيه التجريبي وعزف نغمة الماء بنجاح!
              </p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
