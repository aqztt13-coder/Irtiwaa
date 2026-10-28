import React, { useState } from 'react';
import { X, Calculator, Check, Dumbbell, SunMedium, User } from 'lucide-react';
import { UserTargetSettings, calculateDailyTarget, formatNumberEnglish } from '../utils/hydrationMath';

interface TargetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: UserTargetSettings;
  onSaveSettings: (settings: UserTargetSettings) => void;
}

export const TargetCalculatorModal: React.FC<TargetCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSaveSettings,
}) => {
  const [weightKg, setWeightKg] = useState<number>(currentSettings.weightKg || 70);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>(
    currentSettings.activityLevel || 'moderate'
  );
  const [climate, setClimate] = useState<'normal' | 'hot'>(currentSettings.climate || 'normal');
  const [useCustomOverride, setUseCustomOverride] = useState<boolean>(
    Boolean(currentSettings.customTargetMl)
  );
  const [customMl, setCustomMl] = useState<number>(currentSettings.customTargetMl || 2500);

  if (!isOpen) return null;

  const computedTarget = calculateDailyTarget({
    weightKg,
    activityLevel,
    climate,
    customTargetMl: useCustomOverride ? customMl : undefined,
  });

  const baseFormula = weightKg * 35;
  const activityBonus = activityLevel === 'active' ? 800 : activityLevel === 'moderate' ? 400 : 0;
  const climateBonus = climate === 'hot' ? 500 : 0;

  const handleSave = () => {
    onSaveSettings({
      weightKg,
      activityLevel,
      climate,
      customTargetMl: useCustomOverride ? customMl : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calc-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 id="calc-modal-title" className="text-lg font-bold font-['Tajawal'] text-white">
                حاسبة الهدف اليومي للماء
              </h2>
              <p className="text-xs text-slate-400">حساب طبي مبني على الوزن والنشاط والمناخ</p>
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

        <div className="space-y-4 my-4">
          {/* 1. Body weight */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>وزن الجسم (كجم)</span>
              </label>
              <span className="text-sm font-bold text-cyan-400 font-mono">{weightKg} كجم</span>
            </div>
            <input
              type="range"
              min="35"
              max="160"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>35 كجم</span>
              <span>70 كجم</span>
              <span>100 كجم</span>
              <span>160 كجم</span>
            </div>
          </div>

          {/* 2. Activity Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              <span>مستوى النشاط البدني</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActivityLevel('sedentary')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  activityLevel === 'sedentary'
                    ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-300'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="block text-xs font-bold">خامل / مكتبي</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">+0 مل</span>
              </button>

              <button
                type="button"
                onClick={() => setActivityLevel('moderate')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  activityLevel === 'moderate'
                    ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-300'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="block text-xs font-bold">نشاط معتدل</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">+400 مل</span>
              </button>

              <button
                type="button"
                onClick={() => setActivityLevel('active')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  activityLevel === 'active'
                    ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-300'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="block text-xs font-bold">رياضي عالي</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">+800 مل</span>
              </button>
            </div>
          </div>

          {/* 3. Climate / Weather */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              <span>الطقس ودرجة الحرارة</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setClimate('normal')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  climate === 'normal'
                    ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-300'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="block text-xs font-bold">معتدل / مكيف</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">+0 مل</span>
              </button>

              <button
                type="button"
                onClick={() => setClimate('hot')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  climate === 'hot'
                    ? 'bg-amber-500/20 border-amber-400/80 text-amber-300'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="block text-xs font-bold">حار / صيفي</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">+500 مل</span>
              </button>
            </div>
          </div>

          {/* Calculated Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/40 shadow-inner">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300 font-semibold">
                الاحتياج اليومي الموصى به:
              </span>
              <span className="text-xl font-black text-cyan-400 font-mono">
                {formatNumberEnglish(computedTarget)} مل
              </span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-0.5 pt-2 border-t border-slate-800">
              <p>• الأساس السريري ({weightKg} كجم × 35 مل): {baseFormula} مل</p>
              {activityBonus > 0 && <p>• تعويض النشاط البدني: +{activityBonus} مل</p>}
              {climateBonus > 0 && <p>• تعويض المناخ الحار والتعرق: +{climateBonus} مل</p>}
            </div>
          </div>

          {/* Manual override toggle */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={useCustomOverride}
                onChange={(e) => setUseCustomOverride(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-400"
              />
              <span>تحديد رقم مخصص يدوياً (تخطي الحساب التلقائي)</span>
            </label>
            {useCustomOverride && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  step="50"
                  min="500"
                  max="6000"
                  value={customMl}
                  onChange={(e) => setCustomMl(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                  placeholder="2500"
                />
                <span className="text-xs text-slate-400">مل/يوم</span>
              </div>
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
            <span>حفظ واعتماد الهدف ({computedTarget} مل)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
