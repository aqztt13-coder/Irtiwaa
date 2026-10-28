import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileJson, Copy, Check, Trash2, AlertTriangle } from 'lucide-react';
import { WaterLogItem, UrinationLogItem } from '../utils/hydrationMath';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  waterLogs: WaterLogItem[];
  urinationLogs: UrinationLogItem[];
  onClearToday: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  waterLogs,
  urinationLogs,
  onClearToday,
}) => {
  const [copiedType, setCopiedType] = useState<'csv' | 'json' | null>(null);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  if (!isOpen) return null;

  const generateCSV = () => {
    const rows = [
      ['النوع', 'الوقت', 'الكمية (مل)', 'اللون / الدرجة', 'إلحاح', 'ليلي', 'ملاحظات'],
    ];

    waterLogs.forEach((w) => {
      rows.push([
        'شرب ماء',
        new Date(w.timestamp).toLocaleString('en-US'),
        String(w.amountMl),
        '-',
        '-',
        '-',
        '-',
      ]);
    });

    urinationLogs.forEach((u) => {
      rows.push([
        'تبول',
        new Date(u.timestamp).toLocaleString('en-US'),
        String(u.amountMl),
        `درجة ${u.colorLevel}`,
        u.isUrgent ? 'نعم' : 'لا',
        u.isNocturnal ? 'نعم' : 'لا',
        u.notes || '-',
      ]);
    });

    return '\uFEFF' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  };

  const generateJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalWaterDrinks: waterLogs.length,
        totalUrinations: urinationLogs.length,
      },
      waterLogs,
      urinationLogs,
    };
    return JSON.stringify(data, null, 2);
  };

  const handleDownload = (content: string, fileName: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, type: 'csv' | 'json') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-lg font-bold font-['Tajawal'] text-white">
                تصدير سجل الماء والتبول
              </h2>
              <p className="text-xs text-slate-400">حفظ أو مشاركة السجل الصحي مع الطبيب</p>
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

        <div className="space-y-4 my-5">
          {/* Summary Box */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">مرات شرب الماء:</span>{' '}
              <strong className="text-cyan-400 font-mono text-sm">{waterLogs.length}</strong>
            </div>
            <div>
              <span className="text-slate-400">مرات التبول:</span>{' '}
              <strong className="text-amber-400 font-mono text-sm">{urinationLogs.length}</strong>
            </div>
          </div>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* CSV Option */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <FileSpreadsheet className="w-5 h-5" />
                  <span className="font-bold text-sm text-white">جدول Excel / CSV</span>
                </div>
                <p className="text-xs text-slate-400">
                  ملف جدول بيانات متوافق مع Excel متضمن الأوقات، الكميات، والألوان.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    handleDownload(
                      generateCSV(),
                      `irtiwaa-log-${new Date().toISOString().slice(0, 10)}.csv`,
                      'text/csv;charset=utf-8;'
                    )
                  }
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(generateCSV(), 'csv')}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                  title="نسخ إلى الحافظة"
                >
                  {copiedType === 'csv' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* JSON Option */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <FileJson className="w-5 h-5" />
                  <span className="font-bold text-sm text-white">تنسيق JSON</span>
                </div>
                <p className="text-xs text-slate-400">
                  ملف بيانات تقني منظم للنسخ الاحتياطي والبرمجة.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    handleDownload(
                      generateJSON(),
                      `irtiwaa-backup-${new Date().toISOString().slice(0, 10)}.json`,
                      'application/json;charset=utf-8;'
                    )
                  }
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(generateJSON(), 'json')}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                  title="نسخ إلى الحافظة"
                >
                  {copiedType === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone: Clear Today's Data */}
          <div className="pt-3 border-t border-slate-800">
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح جميع سجلات اليوم</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>هل أنت متأكد من مسح بيانات اليوم بالكامل؟</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClearToday();
                      setConfirmClear(false);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                  >
                    تأكيد المسح
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
