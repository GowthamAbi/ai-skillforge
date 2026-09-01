export default function Github( {
  git,current
}) {
  return <div><p className="text-sm font-bold text-cyan-400">GITHUB VERIFICATION</p><h2 className="text-3xl font-black">Daily coding evidence</h2><div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><b className="text-3xl"> {
    git?.commits??0
  }</b><p className="text-slate-400">Commits today</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><b className="text-xl"> {
    git?.configured?'Connected':'Not connected'
  }</b><p className="text-slate-400">GitHub API</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><b className="text-xl"> {
    typeof current.project==='string'?current.project:current.project?.title||'No project'
  }</b><p className="text-slate-400">Today's project target</p></div></div><div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="font-bold">Repositories active today</h3><p className="mt-2 text-slate-400">{git?.repos?.length?git.repos.join(',
   '):'No repositories detected today.'}</p><p className="mt-4 text-sm text-slate-500">Use meaningful commits for your coding/project blocks. The AI mentor uses GitHub activity as evidence when evaluating the day.</p></div></div>}
