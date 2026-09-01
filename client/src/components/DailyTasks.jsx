export default function DailyTasks( {
  day,onToggle
}) {
  return <div className="space-y-3"> {
    day.tasks.map(t=><button key= {
      t._id
    } onClick= {
      ()=>onToggle(day,t)
    } className= {
      `w-full rounded-xl border p-3 text-left ${t.completed?'border-emerald-800 bg-emerald-950/20':'border-slate-800 bg-slate-950/40'}`
    }><div className="flex gap-3"><span> {
      t.completed?'✅':'⬜'
    }</span><div className="min-w-0"><div className="flex flex-wrap gap-2 text-xs"><span className="font-bold text-cyan-300"> {
      t.startTime
    }– {
      t.endTime
    }</span><span className="text-slate-500"> {
      t.durationMinutes
    } min · {
      t.label
    }</span></div><p className="mt-1 text-sm text-slate-200"> {
      t.title
    }</p></div></div></button>)
  }</div>
}
