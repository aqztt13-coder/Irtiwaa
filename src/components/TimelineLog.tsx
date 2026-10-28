import React, { useState } from 'react';
import {
  ListFilter,
  RotateCcw,
  Trash2,
  Droplets,
  Activity,
  AlertCircle,
  Moon,
} from 'lucide-react';
import {
  WaterLogItem,
  UrinationLogItem,
  URINE_COLOR_SCALE,
  formatTimeEnglish,
  formatNumberEnglish,
} from '../utils/hydrationMath';

interface TimelineLogProps {
  waterLogs: WaterLogItem[];
  urinationLogs: UrinationLogItem[];
  onDeleteWater: (id: string) => void;
  onDeleteUrination: (id: string) => void;
  onUndoLast: () => void;
  canUndo: boolean;
}

type TimelineItem =
  | ({ itemType: 'water' } & WaterLogItem)
  | ({ itemType: 'urination' } & UrinationLogItem);

export const TimelineLog: React.FC<TimelineLogProps> = ({
  waterLogs,
  urinationLogs,
  onDeleteWater,
  onDeleteUrination,
  onUndoLast,
  canUndo,
}) => {
  const [filter, setFilter] = useState<'all' | 'water' | 'urination'>('all');

  const unifiedItems: TimelineItem[] = [
    ...waterLogs.map((w) => ({ ...w, itemType: 'water' as const })),
    ...urinationLogs.map((u) => ({ ...u, itemType: 'urination' as const })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredItems = unifiedItems.filter((item) => {
    if (filter === 'water') return item.itemType === 'water';
    if (filter === 'urination') return item.itemType === 'urination';
    return true;
  });

  return (
    <div className="p-6 rounded-3xl glass-panel-elevated relative overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 light:bg-cyan-50 border border-cyan-500/30 light:border-cyan-200 text-cyan-400 light:text-cyan-600">
            <ListFilter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-['Tajawal']">
              السجل الزمني للماء والتبول
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">تسلسل شرب الماء والمخرجات لحظة بلحظة</p>
          </div>
        </div>

        {/* Action button: Undo last entry */}
        <div className="flex items-center gap-2">
          {canUndo && (
            <button
              onClick={onUndoLast}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 light:text-amber-700 light:bg-amber-50 light:border-amber-200 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
              title="تراجع عن آخر عملية مسجلة"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تراجع عن آخر إدخال</span>
            </button>
          )}

          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 text-xs font-medium font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 dark:text-cyan-300 light:bg-white light:text-cyan-800 light:shadow-sm border border-cyan-500/40 light:border-slate-200 font-bold'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200'
              }`}
            >
              الكل ({unifiedItems.length})
            </button>
            <button
              onClick={() => setFilter('water')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'water'
                  ? 'bg-cyan-500/20 text-cyan-300 dark:text-cyan-300 light:bg-white light:text-cyan-800 light:shadow-sm border border-cyan-500/40 light:border-slate-200 font-bold'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200'
              }`}
            >
              ماء ({waterLogs.length})
            </button>
            <button
              onClick={() => setFilter('urination')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'urination'
                  ? 'bg-amber-500/20 text-amber-300 dark:text-amber-300 light:bg-white light:text-amber-800 light:shadow-sm border border-amber-500/40 light:border-slate-200 font-bold'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200'
              }`}
            >
              تبول ({urinationLogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Items list */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-10 rounded-2xl bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 border border-dashed border-slate-800 dark:border-slate-800 light:border-slate-200">
          <p className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">لا توجد عمليات مسجلة لليوم بعد</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-400 mt-1">
            سجل كوب ماء أو عملية تبول لتظهر تفاصيلها في هذا السجل الزمني
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            if (item.itemType === 'water') {
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-white light:shadow-sm hover:bg-slate-800/70 light:hover:bg-slate-50 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 light:bg-cyan-50 border border-cyan-500/25 light:border-cyan-200 flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-cyan-400 light:text-cyan-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white dark:text-white light:text-slate-900">شرب ماء</span>
                        <span className="text-xs font-mono font-bold text-cyan-400 light:text-cyan-700">
                          +{formatNumberEnglish(item.amountMl)} مل
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono">
                        {formatTimeEnglish(item.timestamp)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteWater(item.id)}
                    className="p-2 rounded-xl text-slate-400 dark:text-slate-400 light:text-slate-400 hover:text-red-400 light:hover:text-red-600 hover:bg-red-500/10 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                    title="حذف هذا الإدخال"
                    aria-label="حذف شرب الماء"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            } else {
              const colorInfo =
                URINE_COLOR_SCALE.find((c) => c.level === item.colorLevel) || URINE_COLOR_SCALE[2];
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50/40 light:shadow-sm hover:bg-amber-950/30 light:hover:bg-amber-50/70 border border-amber-800/30 dark:border-amber-800/30 light:border-amber-200 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/15 light:bg-amber-100 border border-amber-500/30 light:border-amber-200 flex items-center justify-center text-amber-400 light:text-amber-700">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-amber-300 dark:text-amber-300 light:text-amber-900">عملية تبول</span>
                        <span className="text-xs font-mono font-bold text-amber-400 dark:text-amber-400 light:text-amber-700">
                          ~{formatNumberEnglish(item.amountMl)} مل
                        </span>

                        {/* Color Chip */}
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20 light:border-slate-300"
                            style={{ backgroundColor: colorInfo.color }}
                          />
                          <span className="text-[10px] text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono">
                            درجة {item.colorLevel}: {colorInfo.title}
                          </span>
                        </div>
                      </div>

                      {/* Flags and Time */}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono">
                          {formatTimeEnglish(item.timestamp)}
                        </span>
                        {item.isUrgent && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 light:bg-amber-100 light:text-amber-800 font-semibold">
                            <AlertCircle className="w-2.5 h-2.5" /> إلحاح
                          </span>
                        )}
                        {item.isNocturnal && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 light:bg-indigo-100 light:text-indigo-800 font-semibold">
                            <Moon className="w-2.5 h-2.5" /> ليلي
                          </span>
                        )}
                        {item.notes && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 italic">
                            ({item.notes})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteUrination(item.id)}
                    className="p-2 rounded-xl text-slate-400 dark:text-slate-400 light:text-slate-400 hover:text-red-400 light:hover:text-red-600 hover:bg-red-500/10 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                    title="حذف هذا الإدخال"
                    aria-label="حذف التبول"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
