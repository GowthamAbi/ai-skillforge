export default function StatCard( {
  label,value,sub
}) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="text-2xl font-bold"> {
    value
  }</div><p className="mt-1 text-slate-300"> {
    label
  }</p> {
    sub&&<p className="mt-1 text-xs text-slate-500"> {
      sub
    }</p>
  }</div>
}
