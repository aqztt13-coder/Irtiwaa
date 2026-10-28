import React, { useState } from 'react';
import {
  X,
  Clock,
  Activity,
  AlertCircle,
  Moon,
  CheckCircle2,
  HelpCircle,
  Info,
} from 'lucide-react';
import { URINE_COLOR_SCALE, UrineColorInfo } from '../utils/hydrationMath';

interface UrinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveUrination: (data: {
    amountMl: number;
    colorLevel: number;
    timestamp: string;
    isUrgent: boolean;
    isNocturnal: boolean;
    notes?: string;
  }) => void;
}

export const UrinationModal: React.FC<UrinationModalProps> = ({
  isOpen,
  onClose,
  onSaveUrination,
}) => {
  // Current local time in HH:mm format
  const now = new Date();
  const defaultTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const [timeValue, setTimeValue] = useState<string>(defaultTimeStr);
  const [selectedAmount, setSelectedAmount] = useState<number>(300); // 150, 300, 450
  const [colorLevel, setColorLevel] = useState<number>(3); // 1 to 8
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isNocturnal, setIsNocturnal] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const currentColorInfo: UrineColorInfo =
    URINE_COLOR_SCALE.find((c) => c.level === colorLevel) || URINE_COLOR_SCALE[2];

  const handleSave = () => {
    // Construct ISO string with selected time today
    const [hours, minutes] = timeValue.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(hours || 0, minutes || 0, 0, 0);

    onSaveUrination({
      amountMl: selectedAmount,
      colorLevel,
      timestamp: dateObj.toISOString(),
      isUrgent,
      isNocturnal,
      notes: notes.trim() ? notes.trim() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto pb-safe"
        role="dialog"
        aria-modal="true"
        aria-labelledby="urination-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 id="urination-modal-title" className="text-lg font-bold font-['Tajawal'] text-white">
                تسجيل عملية تبول جديدة
              </h2>
              <p className="text-xs text-slate-400">متابعة دقيقة للمخرجات واللون لتقييم صحة الكلى والجسم</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 my-4">
          {/* 1. Time Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              وقت العملية
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => {
                  const n = new Date();
                  setTimeValue(
                    `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`
                  );
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-medium text-cyan-400 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                الوقت الحالي
              </button>
            </div>
          </div>

          {/* 2. Amount Estimator Buttons (150, 300, 450) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              تقدير الكمية الناتجة
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedAmount(150)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedAmount === 150
                    ? 'bg-amber-500/20 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.25)] text-amber-300'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-sm font-bold">قليل</span>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5">~ 150 مل</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAmount(300)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedAmount === 300
                    ? 'bg-amber-500/20 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.25)] text-amber-300'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-sm font-bold">متوسط</span>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5">~ 300 مل</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAmount(450)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedAmount === 450
                    ? 'bg-amber-500/20 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.25)] text-amber-300'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-sm font-bold">غزير</span>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5">~ 450 مل</span>
              </button>
            </div>
          </div>

          {/* 3. Interactive Urine Color Scale (1 to 8) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>مؤشر لون البول (درجة {colorLevel} من 8)</span>
              </label>
              <span className="text-[11px] text-slate-400">انقر لاختيار اللون المطابق</span>
            </div>

            {/* Color circles row */}
            <div className="grid grid-cols-8 gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
              {URINE_COLOR_SCALE.map((item) => {
                const isSelected = item.level === colorLevel;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setColorLevel(item.level)}
                    style={{ backgroundColor: item.color }}
                    className={`relative h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'ring-4 ring-cyan-400 scale-110 z-10 shadow-lg shadow-cyan-500/50'
                        : 'opacity-85 hover:opacity-100 hover:scale-105'
                    }`}
                    title={`الدرجة ${item.level}: ${item.title}`}
                  >
                    <span
                      className={`text-xs font-bold font-mono ${
                        item.level <= 3 ? 'text-slate-800' : 'text-white'
                      }`}
                    >
                      {item.level}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Immediate Clinical Evaluation Card */}
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-start gap-3 transition-all">
              <div
                className="w-5 h-5 rounded-full mt-0.5 flex-shrink-0 shadow-md border border-white/20"
                style={{ backgroundColor: currentColorInfo.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-['Tajawal']">
                    التقييم: {currentColorInfo.title}
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      currentColorInfo.level <= 3
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : currentColorInfo.level <= 5
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {currentColorInfo.level <= 3
                      ? 'حالة ممتازة'
                      : currentColorInfo.level <= 5
                      ? 'تنبيه ترطيب'
                      : 'تحذير جفاف'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentColorInfo.advice}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Special flags: Urgency & Nocturia */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsUrgent(!isUrgent)}
              className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                isUrgent
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="block text-xs font-bold">إلحاح مفاجئ</span>
                  <span className="block text-[10px] text-slate-400">صعوبة في التأجيل</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isUrgent}
                readOnly
                className="w-4 h-4 rounded text-amber-500 accent-amber-500"
              />
            </button>

            <button
              type="button"
              onClick={() => setIsNocturnal(!isNocturnal)}
              className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                isNocturnal
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="block text-xs font-bold">استيقاظ ليلي</span>
                  <span className="block text-[10px] text-slate-400">أثناء فترة النوم</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isNocturnal}
                readOnly
                className="w-4 h-4 rounded text-indigo-500 accent-indigo-500"
              />
            </button>
          </div>

          {/* 5. Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ملاحظات إضافية (اختياري)
            </label>
            <input
              type="text"
              placeholder="مثال: بعد ممارسة الرياضة، بعد شرب القهوة..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer text-center"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>حفظ التسجيل الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
