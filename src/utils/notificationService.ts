export interface NotificationSettings {
  enabled: boolean;
  intervalHours: number; // e.g. 1, 2, 3, 4 (default 2)
  startHour: number; // e.g. 8 (08:00 AM)
  endHour: number; // e.g. 23 (11:00 PM)
  soundEnabled: boolean;
  lastNotifiedTimestamp?: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  intervalHours: 2,
  startHour: 8,
  endHour: 23,
  soundEnabled: true,
};

/**
 * Checks if a reminder should be triggered given the user's settings and last drink timestamp.
 */
export function shouldSendReminder(
  settings: NotificationSettings,
  lastWaterTimestamp: string | null,
  currentTime: Date = new Date()
): { shouldNotify: boolean; reason?: string; elapsedMinutes: number } {
  if (!settings.enabled) {
    return { shouldNotify: false, reason: 'التنبيهات معطلة', elapsedMinutes: 0 };
  }

  const currentHour = currentTime.getHours();

  // Check active hours (e.g. 8 to 23)
  if (currentHour < settings.startHour || currentHour >= settings.endHour) {
    return {
      shouldNotify: false,
      reason: 'خارج ساعات الاستيقاظ المحددة (فترة الهدوء الليلي)',
      elapsedMinutes: 0,
    };
  }

  // Calculate elapsed time from last drink, or from start of day if none logged today
  let baselineMs: number;
  if (lastWaterTimestamp) {
    baselineMs = new Date(lastWaterTimestamp).getTime();
  } else {
    // If no drink today, count from start of active hours today
    const startOfActiveDay = new Date(currentTime);
    startOfActiveDay.setHours(settings.startHour, 0, 0, 0);
    baselineMs = startOfActiveDay.getTime();
  }

  const nowMs = currentTime.getTime();
  const elapsedMs = Math.max(0, nowMs - baselineMs);
  const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
  const intervalMinutes = settings.intervalHours * 60;

  if (elapsedMinutes < intervalMinutes) {
    return {
      shouldNotify: false,
      reason: `لم تنقضِ مدة ${settings.intervalHours} ساعة بعد (انقضت ${elapsedMinutes} دقيقة)`,
      elapsedMinutes,
    };
  }

  // Check if we already notified within the current cooldown window (interval / 2)
  if (settings.lastNotifiedTimestamp) {
    const lastNotifiedMs = new Date(settings.lastNotifiedTimestamp).getTime();
    const minsSinceLastNotify = Math.floor((nowMs - lastNotifiedMs) / (1000 * 60));
    // Don't re-notify within 30 minutes of the previous notification
    if (minsSinceLastNotify < 30) {
      return {
        shouldNotify: false,
        reason: 'تم إرسال تنبيه مؤخراً (في فترة التهدئة)',
        elapsedMinutes,
      };
    }
  }

  return {
    shouldNotify: true,
    elapsedMinutes,
  };
}

/**
 * Requests browser push notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return 'denied';
  }
}

/**
 * Sends a native browser notification if permitted
 */
export function sendBrowserNotification(title: string, body: string): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png',
        dir: 'rtl',
        lang: 'ar',
      });
      return true;
    } catch (e) {
      console.warn('Native notification error:', e);
      return false;
    }
  }
  return false;
}

/**
 * Plays a pleasant soft water drop chime sound using Web Audio API
 */
export function playWaterChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Create 2 harmonic sine oscillator nodes for a water droplet resonance
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.2); // D6

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.55);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (e) {
    // Audio context may require user interaction
  }
}
