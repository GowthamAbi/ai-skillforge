import assert from 'node:assert/strict';
import test from 'node:test';
import { isValidISODate, addDays, dateInIndia, getStudySchedule } from '../utils/studySchedule.js';

const instant = date => new Date(date + 'T06:00:00.000Z');

test('invalid dates and leap days', () => {
  assert.equal(isValidISODate('2026-02-30'), false);
  assert.equal(isValidISODate('2028-02-29'), true);
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
});

test('India local date uses IST', () => {
  assert.equal(dateInIndia(new Date('2026-10-15T19:00:00Z')), '2026-10-16');
});

test('no study dates before start', () => {
  const plan = getStudySchedule('2026-10-20', [], instant('2026-10-16'));
  assert.equal(plan.status, 'upcoming');
  assert.equal(plan.plannedDay, 0);
  assert.equal(plan.nextStudyDate, '2026-10-20');
});

test('all 50 study dates are unique', () => {
  const plan = getStudySchedule('2026-10-16', [], instant('2026-10-16'));
  assert.equal(plan.todaysDay, 1);
  assert.equal(new Set(plan.scheduleDates).size, 50);
  assert.equal(plan.scheduleDates[49], addDays('2026-10-16', 49));
});

test('paused date postpones later study sessions', () => {
  const plan = getStudySchedule('2026-10-16', ['2026-10-17'], instant('2026-10-17'));
  assert.equal(plan.status, 'paused');
  assert.equal(plan.plannedDay, 1);
  assert.equal(plan.nextStudyDate, '2026-10-18');
  assert.deepEqual(plan.scheduleDates.slice(0, 3), ['2026-10-16', '2026-10-18', '2026-10-19']);
});

test('duplicate pauses and pauses before start are ignored', () => {
  const plan = getStudySchedule('2026-10-16', ['2026-10-15', '2026-10-17', '2026-10-17'], instant('2026-10-16'));
  assert.deepEqual(plan.pausedDates, ['2026-10-17']);
});

test('resuming a paused day restores the original sequence', () => {
  const plan = getStudySchedule('2026-10-16', [], instant('2026-10-17'));
  assert.equal(plan.todaysDay, 2);
  assert.equal(plan.nextStudyDate, '2026-10-17');
});

test('no next study session after day 50', () => {
  const plan = getStudySchedule('2026-10-16', [], instant('2027-01-01'));
  assert.equal(plan.status, 'schedule-ended');
  assert.equal(plan.nextStudyDate, null);
  assert.equal(plan.plannedDay, 50);
});

test('missing start date is handled', () => {
  const plan = getStudySchedule(null);
  assert.equal(plan.started, false);
  assert.deepEqual(plan.scheduleDates, []);
});
