import React, { useEffect, useRef, useMemo } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
} from 'chart.js';
import { BarChart3 } from 'lucide-react';
import { getHourlyDistribution, WaterLogItem, UrinationLogItem } from '../utils/hydrationMath';

// Register ChartJS modules once
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController
);

interface HourlyChartProps {
  waterLogs: WaterLogItem[];
  urinationLogs: UrinationLogItem[];
  isDarkMode: boolean;
}

export const HourlyChart: React.FC<HourlyChartProps> = ({
  waterLogs,
  urinationLogs,
  isDarkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Memoize distribution calculation so arrays don't re-allocate on every render
  const { labels, intakeData, outputData } = useMemo(() => {
    return getHourlyDistribution(waterLogs, urinationLogs);
  }, [waterLogs, urinationLogs]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const textColor = isDarkMode ? '#94A3B8' : '#475569';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // If chart already exists and theme is identical, simply update dataset values in-place
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = labels;
      chartInstanceRef.current.data.datasets[0].data = intakeData;
      chartInstanceRef.current.data.datasets[1].data = outputData;
      chartInstanceRef.current.update('none'); // no animation on incremental update to save CPU
      return;
    }

    // Otherwise, create the chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'شرب الماء (مل)',
            data: intakeData,
            backgroundColor: isDarkMode ? 'rgba(6, 182, 212, 0.75)' : 'rgba(8, 145, 178, 0.85)',
            hoverBackgroundColor: '#06B6D4',
            borderColor: isDarkMode ? '#06B6D4' : '#0891B2',
            borderWidth: 1.5,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'مخرجات التبول (مل)',
            data: outputData,
            backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.75)' : 'rgba(217, 119, 6, 0.85)',
            hoverBackgroundColor: '#F59E0B',
            borderColor: isDarkMode ? '#F59E0B' : '#D97706',
            borderWidth: 1.5,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 350,
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            rtl: true,
            labels: {
              color: isDarkMode ? '#F8FAFC' : '#0F172A',
              font: {
                family: "'IBM Plex Sans Arabic', sans-serif",
                size: 12,
                weight: 600,
              },
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
              padding: 16,
            },
          },
          tooltip: {
            rtl: true,
            textDirection: 'rtl',
            titleFont: {
              family: "'IBM Plex Sans Arabic', sans-serif",
              size: 13,
              weight: 700,
            },
            bodyFont: {
              family: "'IBM Plex Sans Arabic', sans-serif",
              size: 12,
            },
            padding: 12,
            cornerRadius: 12,
            backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            titleColor: isDarkMode ? '#FFFFFF' : '#0F172A',
            bodyColor: isDarkMode ? '#E2E8F0' : '#334155',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(203, 213, 225, 0.9)',
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return ` ${label}: ${value} مل`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              font: {
                family: "'IBM Plex Sans Arabic', sans-serif",
                size: 10,
              },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 12,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              font: {
                family: "'IBM Plex Sans Arabic', sans-serif",
                size: 10,
              },
              callback: (value) => `${value} مل`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [labels, intakeData, outputData, isDarkMode]);

  const hasData = waterLogs.length > 0 || urinationLogs.length > 0;

  return (
    <div className="p-6 rounded-3xl glass-panel-elevated relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 light:bg-cyan-50 border border-cyan-500/30 light:border-cyan-200 text-cyan-400 light:text-cyan-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-['Tajawal']">
              التوزيع الزمني للماء والتبول
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">مقارنة الساعات على مدار اليوم (24 ساعة)</p>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full relative">
        <canvas ref={canvasRef} className="w-full h-full" />

        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 dark:bg-slate-900/70 backdrop-blur-[2px] rounded-2xl pointer-events-none">
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">لا توجد بيانات مسجلة لليوم بعد</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              سجل كوب ماء أو عملية تبول لتظهر المقارنة البيانية
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
