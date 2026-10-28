import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldSendReminder, NotificationSettings } from './notificationService';

test('shouldSendReminder returns false if notifications disabled', () => {
  const settings: NotificationSettings = {
    enabled: false,
    intervalHours: 2,
    startHour: 8,
    endHour: 23,
    soundEnabled: true,
  };
  const result = shouldSendReminder(settings, null, new Date(2026, 9, 27, 14, 0));
  assert.equal(result.shouldNotify, false);
});

test('shouldSendReminder returns false during quiet night hours', () => {
  const settings: NotificationSettings = {
    enabled: true,
    intervalHours: 2,
    startHour: 8,
    endHour: 23,
    soundEnabled: true,
  };
  // 3:00 AM (night)
  const nightTime = new Date(2026, 9, 27, 3, 0);
  const result = shouldSendReminder(settings, null, nightTime);
  assert.equal(result.shouldNotify, false);
});

test('shouldSendReminder triggers when 2 hours have elapsed during day', () => {
  const settings: NotificationSettings = {
    enabled: true,
    intervalHours: 2,
    startHour: 8,
    endHour: 23,
    soundEnabled: true,
  };
  // Last drink was at 10:00 AM, now is 12:15 PM (2 hours and 15 mins later)
  const lastDrink = new Date(2026, 9, 27, 10, 0).toISOString();
  const currentTime = new Date(2026, 9, 27, 12, 15);

  const result = shouldSendReminder(settings, lastDrink, currentTime);
  assert.equal(result.shouldNotify, true);
  assert.equal(result.elapsedMinutes, 135);
});

test('shouldSendReminder returns false when only 45 minutes have elapsed', () => {
  const settings: NotificationSettings = {
    enabled: true,
    intervalHours: 2,
    startHour: 8,
    endHour: 23,
    soundEnabled: true,
  };
  // Last drink was at 11:30 AM, now is 12:15 PM (45 minutes later)
  const lastDrink = new Date(2026, 9, 27, 11, 30).toISOString();
  const currentTime = new Date(2026, 9, 27, 12, 15);

  const result = shouldSendReminder(settings, lastDrink, currentTime);
  assert.equal(result.shouldNotify, false);
});
