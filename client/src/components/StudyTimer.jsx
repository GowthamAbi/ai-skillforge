export default function StudyTimer( {
  day,onSave
}) {
  return <form onSubmit= {
    e=> {
      e.preventDefault();
      onSave(day,Number(e.currentTarget.minutes.value))
    }
  } className="flex gap-2"><input name="minutes" type="number" min="0" max="600" defaultValue= {
    day.studyMinutes||0
  } className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 p-3"/><button className="rounded-xl bg-cyan-500 px-4 font-bold text-slate-950">Save study minutes</button></form>
}
