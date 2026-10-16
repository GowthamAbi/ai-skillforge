const DAY_MS = 86_400_000;

export function isValidISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(value + 'T00:00:00.000Z');
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

export function dateInIndia(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const read = key => parts.find(part => part.type === key)?.value;
  return read('year') + '-' + read('month') + '-' + read('day');
}

export function addDays(date, days) {
  if (!isValidISODate(date) || !Number.isSafeInteger(days)) throw new Error('Invalid date or day count');
  return new Date(Date.parse(date + 'T00:00:00.000Z') + days * DAY_MS).toISOString().slice(0, 10);
}

export function getStudySchedule(startDate, pausedDates = [], now = new Date()) {
  const today = dateInIndia(now);
  if (!isValidISODate(startDate)) {
    return {
      started: false, status: 'not-started', startDate: null, today,
      pausedDates: [], plannedDay: 0, todaysDay: null, nextStudyDate: null, scheduleDates: []
    };
  }
  const paused = [...new Set(pausedDates.filter(d => isValidISODate(d) && d >= startDate))].sort();
  const pauseSet = new Set(paused);
  const dates = [];
  let date = startDate;
  while (dates.length < 50) {
    if (!pauseSet.has(date)) dates.push(date);
    if (dates.length < 50) date = addDays(date, 1);
  }
  const todaysIndex = dates.indexOf(today);
  const plannedDay = dates.filter(date => date <= today).length;
  const status = today < startDate ? 'upcoming'
    : pauseSet.has(today) ? 'paused'
    : todaysIndex >= 0 ? 'active'
    : 'schedule-ended';
  return {
    started: true, startDate, today, pausedDates: paused, status,
    plannedDay, todaysDay: todaysIndex < 0 ? null : todaysIndex + 1,
    nextStudyDate: dates.find(date => date >= today) || null,
    scheduleDates: dates
  };
}
