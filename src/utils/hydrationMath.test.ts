import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDailyTarget,
  calculateHydrationSummary,
  calculateUrinationSummary,
  calculateFluidBalance,
  URINE_COLOR_SCALE,
  formatNumberEnglish,
  formatTimeEnglish,
} from './hydrationMath';

test('calculateDailyTarget handles weight, activity, and climate for water', () => {
  assert.equal(
    calculateDailyTarget({ weightKg: 70, activityLevel: 'sedentary', climate: 'normal' }),
    2450
  );

  assert.equal(
    calculateDailyTarget({ weightKg: 70, activityLevel: 'active', climate: 'hot' }),
    3750
  );

  assert.equal(
    calculateDailyTarget({ weightKg: 70, activityLevel: 'active', climate: 'hot', customTargetMl: 3000 }),
    3000
  );
});

test('calculateHydrationSummary accurately computes total water and progress', () => {
  const logs = [
    { id: '1', timestamp: new Date().toISOString(), amountMl: 500 },
    { id: '2', timestamp: new Date().toISOString(), amountMl: 250 },
  ];
  const summary = calculateHydrationSummary(logs, 2000);
  assert.equal(summary.totalWaterMl, 750);
  assert.equal(summary.progressPercent, 38);
  assert.equal(summary.remainingMl, 1250);
});

test('calculateUrinationSummary tracks count, volume, average color, and nocturia', () => {
  const logs = [
    { id: 'u1', timestamp: new Date().toISOString(), amountMl: 300, colorLevel: 2, isUrgent: false, isNocturnal: false },
    { id: 'u2', timestamp: new Date().toISOString(), amountMl: 450, colorLevel: 4, isUrgent: true, isNocturnal: true },
  ];
  const summary = calculateUrinationSummary(logs);
  assert.equal(summary.count, 2);
  assert.equal(summary.totalOutputMl, 750);
  assert.equal(summary.averageColorLevel, 3);
  assert.equal(summary.urgencyCount, 1);
  assert.equal(summary.nocturnalCount, 1);
});

test('calculateFluidBalance provides clinical classification for water and urine', () => {
  const balanced = calculateFluidBalance(1500, 1000);
  assert.equal(balanced.netBalanceMl, 500);
  assert.equal(balanced.statusArabic, 'توازن مائي مثالي');
  assert.equal(balanced.badgeColor, 'emerald');

  const deficit = calculateFluidBalance(500, 1200);
  assert.equal(deficit.netBalanceMl, -700);
  assert.equal(deficit.statusArabic, 'عجز ماء (اشرب ماء)');
  assert.equal(deficit.badgeColor, 'amber');
});

test('URINE_COLOR_SCALE has exactly 8 defined clinical grades', () => {
  assert.equal(URINE_COLOR_SCALE.length, 8);
  assert.equal(URINE_COLOR_SCALE[0].level, 1);
  assert.equal(URINE_COLOR_SCALE[7].level, 8);
});

test('formatNumberEnglish produces English numerals with commas', () => {
  assert.equal(formatNumberEnglish(2500), '2,500');
  assert.equal(formatNumberEnglish(330), '330');
  assert.equal(formatNumberEnglish(0), '0');
});

test('formatTimeEnglish formats with English digits and Arabic AM/PM', () => {
  const morning = new Date(2026, 9, 27, 8, 30).toISOString();
  assert.equal(formatTimeEnglish(morning), '08:30 ص');

  const afternoon = new Date(2026, 9, 27, 14, 5).toISOString();
  assert.equal(formatTimeEnglish(afternoon), '02:05 م');
});
