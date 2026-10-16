import { useEffect, useState } from 'react';
import { api } from '../api/api';

const prettyDate = date => date
  ? new Date(date + 'T12:00:00Z').toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'
    })
  : 'Not scheduled';

export default function StudyPlanner({ schedule, onChange }) {
  const today = schedule?.today || '';
  const [startDate, setStartDate] = useState(today);
  const [pauseDate, setPauseDate] = useState(today);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (today) {
      setStartDate(value => value || today);
      setPauseDate(value => value || today);
    }
  }, [today]);

  if (!schedule) return null;

  const send = async (endpoint, body) => {
    setBusy(true);
    setMessage('');
    try {
      const result = await api('/study-plan/' + endpoint, {
        method: 'POST', body: JSON.stringify(body)
      });
      setMessage(result.message || 'Study calendar updated');
      await onChange();
    } catch (error) {
      setMessage(error.message || 'Could not update study calendar');
    } finally {
      setBusy(false);
    }
  };

  const isPausedToday = schedule.pausedDates?.includes(today);
  const inputClass = 'block rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100';

  return (
    <section className="mb-5 rounded-2xl border border-cyan-900 bg-slate-900/80 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-widest text-cyan-400">STUDY CALENDAR · IST</p>
          <h3 className="mt-1 text-xl font-bold">Start, pause &amp; resume your 50-day plan</h3>
        </div>
        <span className="rounded-full border border-slate-600 px-3 py-1 text-xs font-bold uppercase text-slate-300">
          {schedule.status.replace(/-/g, ' ')}
        </span>
      </div>

      {!schedule.started ? (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm text-slate-300">
            <span className="mb-2 block">When will you start?</span>
            <input aria-label="Study plan start date" type="date" value={startDate}
              onChange={e => setStartDate(e.target.value)} className={inputClass}/>
          </label>
          <button type="button" onClick={() => send('start', { startDate })}
            disabled={busy || !startDate}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">
            {busy ? 'Saving…' : '▶ Start learning'}
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-950/70 p-3">
              <p className="text-xs text-slate-400">Start date</p>
              <p className="mt-1 font-bold">{prettyDate(schedule.startDate)}</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 p-3">
              <p className="text-xs text-slate-400">Calendar day</p>
              <p className="mt-1 font-bold">{schedule.todaysDay ? schedule.todaysDay + ' / 50' : 'Rest / upcoming'}</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 p-3">
              <p className="text-xs text-slate-400">Next scheduled study date</p>
              <p className="mt-1 font-bold">{prettyDate(schedule.nextStudyDate)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Pausing a date moves remaining study sessions forward without deleting completed tasks or scores.
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <button type="button" disabled={busy || today < schedule.startDate}
              onClick={() => send(isPausedToday ? 'resume' : 'pause', { date: today })}
              className={'rounded-xl px-4 py-3 font-bold disabled:opacity-50 ' +
                (isPausedToday ? 'bg-emerald-500 text-slate-950' : 'border border-amber-600 text-amber-300')}>
              {isPausedToday ? '▶ Resume today' : '⏸ Pause today'}
            </button>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Cannot study on a particular date?</span>
              <input type="date" aria-label="Date to pause" min={schedule.startDate} value={pauseDate}
                onChange={e => setPauseDate(e.target.value)} className={inputClass}/>
            </label>
            <button type="button" disabled={busy || !pauseDate || pauseDate < schedule.startDate}
              onClick={() => send('pause', { date: pauseDate })}
              className="rounded-xl border border-slate-600 px-4 py-3 font-bold disabled:opacity-50">
              Skip this date
            </button>
          </div>
          {schedule.pausedDates?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-300">Paused dates ({schedule.pausedDates.length})</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {schedule.pausedDates.map(date => (
                  <button type="button" key={date} disabled={busy} onClick={() => send('resume', { date })}
                    title="Remove pause and restore this study date"
                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 disabled:opacity-50">
                    {prettyDate(date)} · Resume ×
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {message && <p role="status" className="mt-3 text-sm text-cyan-200">{message}</p>}
    </section>
  );
}
