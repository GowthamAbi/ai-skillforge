const title=p=>typeof p==='string'?p:p?.title||'No project';
export default function Roadmap( {
  days,onSelect
}) {
  return <div><div className="mb-6"><p className="text-sm font-bold text-cyan-400">50-DAY ROADMAP</p><h2 className="text-3xl font-black">Learn → Build → Pass → Unlock</h2><p className="mt-2 text-slate-400">Complete everything → Submit Day → Unlock Next Day.</p></div><div className="grid gap-3"> {
    (days||[]).map((d,i)=> {
      const tasks=d.tasks||[],done=tasks.filter(t=>t.completed).length,
      p=tasks.length?Math.round(done/tasks.length*100):0,
      locked=i>0&&!days[i-1]?.daySubmitted;
      return <button disabled= {
        locked
      } key= {
        d.day
      } onClick= {
        ()=>onSelect(d.day)
      } className= {
        `rounded-2xl border p-4 text-left ${locked?'cursor-not-allowed border-slate-900 bg-slate-950 opacity-50':'border-slate-800 bg-slate-900/70 hover:border-cyan-800'}`
      }><div className="flex justify-between gap-3"><div><span className="text-xs font-bold text-cyan-400">DAY {
        d.day
      } · {
        locked?'🔒 LOCKED':'🔓 OPEN'
      }</span><p className="mt-1 text-xs font-bold text-emerald-400"> {
        d.course
      }</p><h3 className="text-lg font-bold"> {
        d.topic
      }</h3><p className="mt-2 text-sm"><b className="text-violet-300">Project:</b> {
        title(d.project)
      }</p><p className="text-xs text-slate-500">Project: {
        d.project?.status||'not-started'
      } · Day: {
        d.daySubmitted?'SUBMITTED':'NOT SUBMITTED'
      }</p></div><div className="text-right"><b> {
        p
      }%</b><p className="text-xs text-slate-500"> {
        done
      }/ {
        tasks.length
      }</p></div></div></button>
    })
  }</div></div>
}
