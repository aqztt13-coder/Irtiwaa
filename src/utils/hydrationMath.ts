export interface UrineColorInfo {
  level: number;
  color: string;
  title: string;
  status: 'excellent' | 'optimal' | 'good' | 'moderate' | 'mild_dehydration' | 'dehydrated' | 'severe_dehydration' | 'critical';
  advice: string;
}

export const URINE_COLOR_SCALE: UrineColorInfo[] = [
  {
    level: 1,
    color: '#FEF9C3', // Very pale yellow
    title: 'مرتوٍ جداً (فائق)',
    status: 'excellent',
    advice: 'جسمك مرتوٍ بالكامل، لا داعي للإفراط في شرب الماء.',
  },
  {
    level: 2,
    color: '#FEF08A', // Pale straw
    title: 'مرتوٍ بشكل مثالي',
    status: 'optimal',
    advice: 'المستوى الصحي الأمثل للترطيب ونشاط الكلى.',
  },
  {
    level: 3,
    color: '#FDE047', // Light yellow
    title: 'طبيعي وجيد',
    status: 'good',
    advice: 'مستوى طبيعي، حافظ على وتيرة شرب الماء المعتادة.',
  },
  {
    level: 4,
    color: '#FACC15', // Honey yellow
    title: 'ترطيب معتدل (يحتاج لكوب)',
    status: 'moderate',
    advice: 'مستوى مقبول ولكن يُفضل شرب كوب ماء (250 مل) الآن.',
  },
  {
    level: 5,
    color: '#EAB308', // Deep amber yellow
    title: 'بداية جفاف خفيف',
    status: 'mild_dehydration',
    advice: 'جسمك يفقد سوائل، اشرب كوبين من الماء خلال الساعة القادمة.',
  },
  {
    level: 6,
    color: '#CA8A04', // Amber
    title: 'جفاف ملحوظ',
    status: 'dehydrated',
    advice: 'جفاف واضح! تناول 500 مل ماء فوراً واسترح قليلاً.',
  },
  {
    level: 7,
    color: '#A16207', // Dark amber
    title: 'جفاف شديد',
    status: 'severe_dehydration',
    advice: 'جفاف شديد، تناول الماء فوراً وتجنب الإجهاد الحراري.',
  },
  {
    level: 8,
    color: '#78350F', // Brownish
    title: 'جفاف حاد / تحذير',
    status: 'critical',
    advice: 'حالة جفاف حرجة، إذا استمر هذا اللون راجع الطبيب المختص.',
  },
];

export interface WaterLogItem {
  id: string;
  timestamp: string; // ISO string
  amountMl: number;
}

export interface UrinationLogItem {
  id: string;
  timestamp: string; // ISO string
  amountMl: number; // e.g. 150 (قليل), 300 (متوسط), 450 (غزير)
  colorLevel: number; // 1 to 8
  isUrgent?: boolean;
  isNocturnal?: boolean; // استيقاظ ليلي
  notes?: string;
}

export interface UserTargetSettings {
  weightKg: number;
  activityLevel: 'sedentary' | 'moderate' | 'active'; // +0, +400, +800
  climate: 'normal' | 'hot'; // +0, +500
  customTargetMl?: number; // optional manual override
}

/**
 * Calculates recommended daily water intake based on clinical guidelines:
 * 35 ml per kg of body weight + adjustments for activity and climate.
 */
export function calculateDailyTarget(settings: UserTargetSettings): number {
  if (settings.customTargetMl && settings.customTargetMl > 500) {
    return settings.customTargetMl;
  }
  const base = settings.weightKg * 35;
  const activityBonus =
    settings.activityLevel === 'active'
      ? 800
      : settings.activityLevel === 'moderate'
      ? 400
      : 0;
  const climateBonus = settings.climate === 'hot' ? 500 : 0;
  return Math.round(base + activityBonus + climateBonus);
}

/**
 * Calculates total water intake and goal progress.
 */
export function calculateHydrationSummary(
  waterLogs: WaterLogItem[],
  targetMl: number
): {
  totalWaterMl: number;
  progressPercent: number;
  remainingMl: number;
} {
  const totalWaterMl = waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
  const progressPercent = targetMl > 0 ? Math.min(100, Math.round((totalWaterMl / targetMl) * 100)) : 0;
  const remainingMl = Math.max(0, targetMl - totalWaterMl);

  return {
    totalWaterMl,
    progressPercent,
    remainingMl,
  };
}

/**
 * Calculates summary of urination output for the day.
 */
export function calculateUrinationSummary(urinationLogs: UrinationLogItem[]): {
  count: number;
  totalOutputMl: number;
  averageColorLevel: number;
  urgencyCount: number;
  nocturnalCount: number;
} {
  const count = urinationLogs.length;
  const totalOutputMl = urinationLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
  const avgColor =
    count > 0
      ? Math.round((urinationLogs.reduce((acc, curr) => acc + curr.colorLevel, 0) / count) * 10) / 10
      : 0;
  const urgencyCount = urinationLogs.filter((u) => u.isUrgent).length;
  const nocturnalCount = urinationLogs.filter((u) => u.isNocturnal).length;

  return {
    count,
    totalOutputMl,
    averageColorLevel: avgColor,
    urgencyCount,
    nocturnalCount,
  };
}

/**
 * Calculates fluid balance (Water In vs Urine Out).
 */
export function calculateFluidBalance(
  totalWaterInMl: number,
  totalUrineOutMl: number
): {
  netBalanceMl: number;
  statusArabic: string;
  badgeColor: 'emerald' | 'cyan' | 'amber';
} {
  const netBalanceMl = totalWaterInMl - totalUrineOutMl;

  if (totalWaterInMl === 0 && totalUrineOutMl === 0) {
    return {
      netBalanceMl: 0,
      statusArabic: 'في انتظار التسجيل',
      badgeColor: 'cyan',
    };
  }

  if (netBalanceMl >= -200 && netBalanceMl <= 900) {
    return {
      netBalanceMl,
      statusArabic: 'توازن مائي مثالي',
      badgeColor: 'emerald',
    };
  } else if (netBalanceMl > 900) {
    return {
      netBalanceMl,
      statusArabic: 'فائض ماء صحي',
      badgeColor: 'cyan',
    };
  } else {
    return {
      netBalanceMl,
      statusArabic: 'عجز ماء (اشرب ماء)',
      badgeColor: 'amber',
    };
  }
}

/**
 * Formats time elapsed into human readable Arabic string
 */
export function formatTimeElapsedArabic(isoTimestamp: string | null): string {
  if (!isoTimestamp) return 'لم يُسجل اليوم';

  const diffMs = Math.max(0, Date.now() - new Date(isoTimestamp).getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'الآن';
  if (diffMins === 1) return 'منذ دقيقة واحدة';
  if (diffMins === 2) return 'منذ دقيقتين';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;

  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;

  if (diffHours === 1) return remainingMins > 0 ? `منذ ساعة و ${remainingMins} د` : 'منذ ساعة واحدة';
  if (diffHours === 2) return remainingMins > 0 ? `منذ ساعتين و ${remainingMins} د` : 'منذ ساعتين';
  if (diffHours < 11) return `منذ ${diffHours} ساعات`;
  return `منذ ${diffHours} ساعة`;
}

/**
 * Formats numbers into English/Western digits with commas (e.g., 2,500)
 */
export function formatNumberEnglish(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Formats ISO timestamp to English digits with Arabic AM/PM (e.g. "08:30 ص", "02:15 م")
 */
export function formatTimeEnglish(isoString: string): string {
  const d = new Date(isoString);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12 || 12;
  const hoursStr = String(hours).padStart(2, '0');
  return `${hoursStr}:${minutes} ${period}`;
}

/**
 * Generates an hourly breakdown of water intake vs urination for Chart.js
 */
export function getHourlyDistribution(
  waterLogs: WaterLogItem[],
  urinationLogs: UrinationLogItem[]
): {
  labels: string[];
  intakeData: number[];
  outputData: number[];
} {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const labels = hours.map((h) => {
    const period = h < 12 ? 'ص' : 'م';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12} ${period}`;
  });

  const intakeData = new Array(24).fill(0);
  const outputData = new Array(24).fill(0);

  waterLogs.forEach((item) => {
    const hour = new Date(item.timestamp).getHours();
    if (hour >= 0 && hour < 24) {
      intakeData[hour] += item.amountMl;
    }
  });

  urinationLogs.forEach((item) => {
    const hour = new Date(item.timestamp).getHours();
    if (hour >= 0 && hour < 24) {
      outputData[hour] += item.amountMl;
    }
  });

  return {
    labels,
    intakeData,
    outputData,
  };
}
