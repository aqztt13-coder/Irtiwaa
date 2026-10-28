import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  WaterLogItem,
  UrinationLogItem,
  UserTargetSettings,
  calculateDailyTarget,
  calculateHydrationSummary,
  calculateUrinationSummary,
} from './utils/hydrationMath';
import {
  NotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
  shouldSendReminder,
  sendBrowserNotification,
  playWaterChime,
} from './utils/notificationService';
import { Navbar } from './components/Navbar';
import { HydrationRing } from './components/HydrationRing';
import { QuickAddWater } from './components/QuickAddWater';
import { UrinationTrackerCard } from './components/UrinationTrackerCard';
import { BioStatusCards } from './components/BioStatusCards';
import { HourlyChart } from './components/HourlyChart';
import { TimelineLog } from './components/TimelineLog';
import { UrinationModal } from './components/UrinationModal';
import { TargetCalculatorModal } from './components/TargetCalculatorModal';
import { ExportDataModal } from './components/ExportDataModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { InAppReminderBanner } from './components/InAppReminderBanner';
import { MobileTabBar, MobileTab } from './components/MobileTabBar';
import { PWAInstallModal } from './components/PWAInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('irtiwaa_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Settings state
  const [settings, setSettings] = useState<UserTargetSettings>(() => {
    const saved = localStorage.getItem('irtiwaa_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      weightKg: 70,
      activityLevel: 'moderate',
      climate: 'normal',
      customTargetMl: 2500,
    };
  });

  // Water Logs (Clean start - Zero demo data)
  const [waterLogs, setWaterLogs] = useState<WaterLogItem[]>(() => {
    const saved = localStorage.getItem('irtiwaa_water_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  // Urination Logs (Clean start - Zero demo data)
  const [urinationLogs, setUrinationLogs] = useState<UrinationLogItem[]>(() => {
    const saved = localStorage.getItem('irtiwaa_urination_logs_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('irtiwaa_notification_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  });

  // Mobile active tab
  const [mobileTab, setMobileTab] = useState<MobileTab>('dashboard');

  // Modals state
  const [isUrinationModalOpen, setIsUrinationModalOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // In-app floating reminder banner
  const [reminderBanner, setReminderBanner] = useState<{ isVisible: boolean; message: string }>({
    isVisible: false,
    message: '',
  });

  // Sync Theme with HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('irtiwaa_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('irtiwaa_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('irtiwaa_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist Water Logs
  useEffect(() => {
    localStorage.setItem('irtiwaa_water_logs', JSON.stringify(waterLogs));
  }, [waterLogs]);

  // Persist Urination Logs
  useEffect(() => {
    localStorage.setItem('irtiwaa_urination_logs_v2', JSON.stringify(urinationLogs));
  }, [urinationLogs]);

  // Persist Notification Settings
  useEffect(() => {
    localStorage.setItem('irtiwaa_notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Computed Summaries
  const dailyTargetMl = useMemo(() => calculateDailyTarget(settings), [settings]);
  const hydrationSummary = useMemo(
    () => calculateHydrationSummary(waterLogs, dailyTargetMl),
    [waterLogs, dailyTargetMl]
  );
  const urinationSummary = useMemo(
    () => calculateUrinationSummary(urinationLogs),
    [urinationLogs]
  );

  // Timestamps for live elapsed time (memoized to avoid re-sorting on every render)
  const lastWater = useMemo(() => {
    if (waterLogs.length === 0) return null;
    return [...waterLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  }, [waterLogs]);

  const lastUrination = useMemo(() => {
    if (urinationLogs.length === 0) return null;
    return [...urinationLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  }, [urinationLogs]);

  // Keep a ref to notificationSettings to avoid re-creating the interval when settings update
  const notificationSettingsRef = React.useRef(notificationSettings);
  notificationSettingsRef.current = notificationSettings;

  const lastWaterTimestamp = lastWater?.timestamp || null;

  // Periodic Reminder Interval Check (Every 45 seconds)
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    const checkInterval = setInterval(() => {
      const currentConfig = notificationSettingsRef.current;
      const checkResult = shouldSendReminder(
        currentConfig,
        lastWaterTimestamp,
        new Date()
      );

      if (checkResult.shouldNotify) {
        const msg = `مضت ${currentConfig.intervalHours} ${
          currentConfig.intervalHours === 1 ? 'ساعة' : 'ساعتان'
        } دون تسجيل شرب ماء. احرص على ترطيب كليتيك وجسمك الآن!`;

        if (currentConfig.soundEnabled) {
          playWaterChime();
        }

        sendBrowserNotification('ارتواء | حان وقت شرب الماء 💧', msg);

        setReminderBanner({
          isVisible: true,
          message: msg,
        });

        // Update last notified time
        setNotificationSettings((prev) => ({
          ...prev,
          lastNotifiedTimestamp: new Date().toISOString(),
        }));
      }
    }, 45000);

    return () => clearInterval(checkInterval);
  }, [notificationSettings.enabled, lastWaterTimestamp]);

  // Trigger test reminder
  const handleTriggerTestReminder = () => {
    setReminderBanner({
      isVisible: true,
      message: 'تنبيه تجريبي: حافظ على شرب الماء بانتظام لصحة الكلى والنشاط الحيوي!',
    });
  };

  // Handlers
  const handleAddWater = (amountMl: number) => {
    const newItem: WaterLogItem = {
      id: 'w-' + Date.now(),
      timestamp: new Date().toISOString(),
      amountMl,
    };
    setWaterLogs((prev) => [newItem, ...prev]);
  };

  const handleSaveUrination = (data: {
    amountMl: number;
    colorLevel: number;
    timestamp: string;
    isUrgent: boolean;
    isNocturnal: boolean;
    notes?: string;
  }) => {
    const newItem: UrinationLogItem = {
      id: 'u-' + Date.now(),
      ...data,
    };
    setUrinationLogs((prev) => [newItem, ...prev]);
  };

  const handleDeleteWater = (id: string) => {
    setWaterLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteUrination = (id: string) => {
    setUrinationLogs((prev) => prev.filter((item) => item.id !== id));
  };

  // Undo latest entry
  const canUndo = waterLogs.length > 0 || urinationLogs.length > 0;
  const handleUndoLast = () => {
    if (!canUndo) return;
    const latestWaterTime = lastWater ? new Date(lastWater.timestamp).getTime() : 0;
    const latestUrinationTime = lastUrination ? new Date(lastUrination.timestamp).getTime() : 0;

    if (latestWaterTime >= latestUrinationTime && lastWater) {
      handleDeleteWater(lastWater.id);
    } else if (lastUrination) {
      handleDeleteUrination(lastUrination.id);
    }
  };

  const handleClearToday = () => {
    setWaterLogs([]);
    setUrinationLogs([]);
  };

  const scrollToQuickWater = () => {
    setMobileTab('dashboard');
    const el = document.getElementById('quick-water-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-[#0B1120] text-slate-100' : 'bg-slate-50 text-slate-900'
      } transition-colors flex flex-col font-['IBM_Plex_Sans_Arabic',sans-serif]`}
    >
      {/* Top Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenNotificationSettings={() => setIsNotificationModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isNotificationsEnabled={notificationSettings.enabled}
        onResetToday={handleClearToday}
        canReset={waterLogs.length > 0 || urinationLogs.length > 0}
      />

      {/* Floating In-App Reminder Banner */}
      <InAppReminderBanner
        isVisible={reminderBanner.isVisible}
        message={reminderBanner.message}
        onQuickDrink={(amount) => {
          handleAddWater(amount);
          setReminderBanner({ isVisible: false, message: '' });
        }}
        onDismiss={() => setReminderBanner({ isVisible: false, message: '' })}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        {/* Mobile View Switching */}
        <div className="lg:hidden mb-4">
          {mobileTab === 'dashboard' && (
            <div className="space-y-5">
              {/* Water Progress Ring */}
              <HydrationRing
                currentWaterMl={hydrationSummary.totalWaterMl}
                targetMl={dailyTargetMl}
                progressPercent={hydrationSummary.progressPercent}
                remainingMl={hydrationSummary.remainingMl}
              />

              {/* Bio Status & Live Timers */}
              <BioStatusCards
                lastFluidTimestamp={lastWater ? lastWater.timestamp : null}
                lastUrinationTimestamp={lastUrination ? lastUrination.timestamp : null}
                totalEffectiveInMl={hydrationSummary.totalWaterMl}
                totalUrineOutMl={urinationSummary.totalOutputMl}
              />

              {/* Urination Card */}
              <UrinationTrackerCard
                onOpenModal={() => setIsUrinationModalOpen(true)}
                count={urinationSummary.count}
                totalOutputMl={urinationSummary.totalOutputMl}
                averageColorLevel={urinationSummary.averageColorLevel}
                urgencyCount={urinationSummary.urgencyCount}
                nocturnalCount={urinationSummary.nocturnalCount}
              />

              {/* Quick Add Water */}
              <div id="quick-water-section">
                <QuickAddWater onAddWater={handleAddWater} />
              </div>

              {/* Hourly Chart preview */}
              <HourlyChart
                waterLogs={waterLogs}
                urinationLogs={urinationLogs}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {mobileTab === 'timeline' && (
            <div className="space-y-4">
              <TimelineLog
                waterLogs={waterLogs}
                urinationLogs={urinationLogs}
                onDeleteWater={handleDeleteWater}
                onDeleteUrination={handleDeleteUrination}
                onUndoLast={handleUndoLast}
                canUndo={canUndo}
              />
            </div>
          )}

          {mobileTab === 'analytics' && (
            <div className="space-y-4">
              <HourlyChart
                waterLogs={waterLogs}
                urinationLogs={urinationLogs}
                isDarkMode={isDarkMode}
              />
              <BioStatusCards
                lastFluidTimestamp={lastWater ? lastWater.timestamp : null}
                lastUrinationTimestamp={lastUrination ? lastUrination.timestamp : null}
                totalEffectiveInMl={hydrationSummary.totalWaterMl}
                totalUrineOutMl={urinationSummary.totalOutputMl}
              />
            </div>
          )}
        </div>

        {/* Desktop Bento Grid Dashboard (3 Columns) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-start">
          {/* Column 1 (Left): Water Ring & Urination Summary (4 cols) */}
          <div className="col-span-4 space-y-6">
            <HydrationRing
              currentWaterMl={hydrationSummary.totalWaterMl}
              targetMl={dailyTargetMl}
              progressPercent={hydrationSummary.progressPercent}
              remainingMl={hydrationSummary.remainingMl}
            />

            <UrinationTrackerCard
              onOpenModal={() => setIsUrinationModalOpen(true)}
              count={urinationSummary.count}
              totalOutputMl={urinationSummary.totalOutputMl}
              averageColorLevel={urinationSummary.averageColorLevel}
              urgencyCount={urinationSummary.urgencyCount}
              nocturnalCount={urinationSummary.nocturnalCount}
            />
          </div>

          {/* Column 2 (Center & Right): Quick Add Water, Live Counters, Hourly Chart, Timeline (8 cols) */}
          <div className="col-span-8 space-y-6">
            {/* Live Bio Status Counters & Fluid Balance */}
            <BioStatusCards
              lastFluidTimestamp={lastWater ? lastWater.timestamp : null}
              lastUrinationTimestamp={lastUrination ? lastUrination.timestamp : null}
              totalEffectiveInMl={hydrationSummary.totalWaterMl}
              totalUrineOutMl={urinationSummary.totalOutputMl}
            />

            {/* Quick Add Water Station */}
            <div id="quick-water-section">
              <QuickAddWater onAddWater={handleAddWater} />
            </div>

            {/* Hourly Distribution Chart (Chart.js) */}
            <HourlyChart
              waterLogs={waterLogs}
              urinationLogs={urinationLogs}
              isDarkMode={isDarkMode}
            />

            {/* Unified Chronological Timeline */}
            <TimelineLog
              waterLogs={waterLogs}
              urinationLogs={urinationLogs}
              onDeleteWater={handleDeleteWater}
              onDeleteUrination={handleDeleteUrination}
              onUndoLast={handleUndoLast}
              canUndo={canUndo}
            />
          </div>
        </div>
      </main>

      {/* Floating Bottom Tab Bar for Mobile iOS */}
      <MobileTabBar
        currentTab={mobileTab}
        onSelectTab={(tab) => setMobileTab(tab)}
        onOpenQuickWater={scrollToQuickWater}
        onOpenUrinationModal={() => setIsUrinationModalOpen(true)}
      />

      {/* Modals */}
      <UrinationModal
        isOpen={isUrinationModalOpen}
        onClose={() => setIsUrinationModalOpen(false)}
        onSaveUrination={handleSaveUrination}
      />

      <TargetCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        currentSettings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
      />

      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        waterLogs={waterLogs}
        urinationLogs={urinationLogs}
        onClearToday={handleClearToday}
      />

      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={notificationSettings}
        onSaveSettings={(newSettings) => setNotificationSettings(newSettings)}
        onTriggerTestReminder={handleTriggerTestReminder}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />

      {/* PWA Install Guide Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
