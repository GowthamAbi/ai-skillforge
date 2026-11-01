import { ArrowLeft, BrainCircuit, FlaskConical, Home, BookOpen, Code2, FolderKanban, ClipboardList, ChartNoAxesCombined, LockKeyhole } from 'lucide-react';
import AIResearchLab from './AIResearchLab';

const links = [
  ['Dashboard','dashboard',Home],['Learning Roadmap','roadmap',BookOpen],['Practice Lab','practice',Code2],
  ['Projects','projects',FolderKanban],['Quizzes & Assessments','assessments',ClipboardList],
  ['AI Tutor','tutor',BrainCircuit],['Progress & Analytics','analytics',ChartNoAxesCombined],
  ['AI Research Lab','research',FlaskConical],['Private Mode','private',LockKeyhole]
];

export default function ResearchLabModule({navigate}) {
  return <div className="min-h-screen bg-[#070c16] text-white">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-slate-800 bg-[#09111f] px-4 py-5 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600"><BrainCircuit size={26}/></span><div><div className="font-black">AI Skill Forge <span className="text-violet-400">6.0</span></div><div className="text-[11px] text-slate-400">Personal AI Academy</div></div></div>
      <nav className="space-y-1">{links.map(([label,target,Icon])=><button key={target} onClick={()=>navigate(target)} className={'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold '+(target==='research'?'border border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-100':'text-slate-300 hover:bg-slate-800')}><Icon size={18}/>{label}</button>)}</nav>
      <div className="mt-auto rounded-xl border border-slate-800 bg-[#101a2b] p-3"><div className="text-sm font-bold">Research workspace</div><div className="mt-1 text-xs text-slate-400">Experiment · Evaluate · Discover</div></div>
    </aside>
    <main className="min-w-0 lg:pl-[250px]">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-[#070c16]/95 px-4 py-3 backdrop-blur sm:px-7"><div className="flex items-center gap-3"><FlaskConical className="text-fuchsia-300"/><div><div className="text-sm font-extrabold">AI Research Lab <span className="text-fuchsia-300">05</span></div><div className="text-[11px] text-slate-400">Research, experiments and discovery</div></div></div><button onClick={()=>navigate('dashboard')} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#111b2b] px-3 py-2 text-xs font-bold"><ArrowLeft size={14}/> Dashboard</button></header>
      <div className="mx-auto max-w-[1500px] p-2 sm:p-5"><AIResearchLab/></div>
    </main>
  </div>;
}
