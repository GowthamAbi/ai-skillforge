import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Bell, BookOpen, BrainCircuit, ChartNoAxesCombined, CheckCircle2, Code2, FolderKanban, GraduationCap, LockKeyhole, Menu, Search, ShieldCheck, Sparkles, Target, Trophy, X, Layers3, CalendarCheck, PlayCircle, Cpu, Database, BarChart3, FlaskConical, Settings, FolderOpen, ClipboardList } from 'lucide-react';
import { AI_PHASES, flattenTopics } from '../data/aiRoadmap';
import { api } from '../api/api';

const navigation = [
  ['dashboard','Dashboard',Activity,'dashboard'],
  ['roadmap','Learning Roadmap',BookOpen,'roadmap'],
  ['roadmap','Courses',Layers3,'roadmap'],
  ['practice','Practice Lab',Code2,'practice'],
  ['projects','Projects',FolderKanban,'projects'],
  ['assessments','Quizzes & Assessments',ClipboardList,'assessments'],
  ['tutor','AI Tutor',BrainCircuit,'tutor'],
  ['analytics','Progress & Analytics',ChartNoAxesCombined,'analytics'],
  ['research','Resources',FolderOpen,'research'],
  ['private','Settings',Settings,'private']
];

const moduleCards = [
  {title:'Module 01: NumPy',desc:'Arrays, operations, statistics and practical exercises.',icon:Cpu,status:'In Progress',tone:'violet'},
  {title:'Module 02: Pandas',desc:'DataFrames, data manipulation and real datasets.',icon:Database,status:'Upcoming',tone:'cyan'},
  {title:'Module 03: Data Cleaning',desc:'Handle missing data, duplicates, outliers and data quality.',icon:CheckCircle2,status:'Upcoming',tone:'blue'},
  {title:'Module 04: Data Preprocessing',desc:'Encoding, scaling, transformation and pipelines.',icon:BarChart3,status:'Upcoming',tone:'amber'}
];
const dailyGoals = ['Complete one roadmap lesson','Practise 5 Python coding exercises','Review notes and mistakes','Work on a mini project'];

function Stat({icon:Icon,value,label,tint}) {
  return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-800 bg-[#111b2b] p-3.5 sm:p-4">
    <div className={'grid h-12 w-12 shrink-0 place-items-center rounded-xl '+tint}><Icon size={23}/></div>
    <div className="min-w-0"><div className="text-2xl font-black leading-none text-white">{value}</div><div className="mt-1 text-xs text-slate-400">{label}</div></div>
  </div>;
}

function SectionTitle({icon:Icon,title,sub,action,onAction}) {
  return <div className="mb-4 flex items-center justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2 text-cyan-300"><Icon size={18}/><h2 className="truncate text-sm font-extrabold text-white sm:text-base">{title}</h2></div>{sub&&<p className="mt-1 text-[11px] text-slate-400">{sub}</p>}</div>{action&&<button onClick={onAction} className="shrink-0 text-xs font-bold text-violet-300 hover:text-white">{action} →</button>}</div>;
}

export default function ForgeDashboard({navigate}) {
  const [progress,setProgress]=useState({});
  const [query,setQuery]=useState('');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [notice,setNotice]=useState('');
  const [goals,setGoals]=useState([false,false,false,false]);
  const topics=useMemo(()=>flattenTopics(),[]);
  const totalModules=AI_PHASES.reduce((n,p)=>n+p.groups.length,0);
  const completed=Object.values(progress||{}).filter(x=>x?.completed).length;
  const percent=topics.length?Math.round(completed/topics.length*100):0;
  const filtered=AI_PHASES.filter(p=>(p.title+' '+p.description+' '+p.groups.map(g=>g.title).join(' ')).toLowerCase().includes(query.toLowerCase()));
  useEffect(()=>{
    let active=true;
    api('/path/roadmap-progress',{pathApi:true}).then(r=>{if(active)setProgress(r.progress||{});})
      .catch(()=>{if(active)setNotice('Progress sync is currently unavailable. Your roadmap is still accessible.');});
    return ()=>{active=false;};
  },[]);
  const go=id=>{setMobileOpen(false);navigate(id);};
  const sidebar=<>
    <div className="mb-7 flex items-center gap-3 px-2"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 shadow-lg shadow-violet-900/40"><BrainCircuit size={27}/></div><div className="min-w-0"><div className="whitespace-nowrap text-[17px] font-black tracking-tight">AI Skill Forge <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">5.0</span></div><div className="text-[11px] text-slate-400">Personal AI Academy</div></div></div>
    <nav className="space-y-1">{navigation.map(([id,label,Icon,target],i)=><button key={label} onClick={()=>go(target)} className={'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold transition '+(label==='Dashboard'?'border border-indigo-400/30 bg-gradient-to-r from-indigo-600/35 to-violet-600/15 text-white':'text-slate-300 hover:bg-slate-800/80 hover:text-white')}><Icon size={18} className="shrink-0"/><span>{label}</span>{label==='AI Tutor'&&<span className="ml-auto rounded-full bg-violet-600 px-2 py-0.5 text-[10px]">New</span>}</button>)}</nav>
    <div className="mt-auto pt-7"><div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#101a2b] p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold">G</div><div><div className="text-sm font-bold">Gowtham Abi</div><div className="text-[11px] text-slate-500">Personal Learner</div></div></div></div>
  </>;
  return <div className="min-h-screen bg-[#070c16] text-white">
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true"><div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-violet-700/10 blur-3xl"/><div className="absolute left-1/3 top-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl"/></div>
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[265px] flex-col border-r border-slate-800/90 bg-[#09111f] px-4 py-5 lg:flex">{sidebar}</aside>
    {mobileOpen&&<div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={()=>setMobileOpen(false)}><aside className="flex h-full w-[285px] flex-col bg-[#09111f] p-4" onClick={e=>e.stopPropagation()}><button className="mb-5 self-end" onClick={()=>setMobileOpen(false)}><X/></button>{sidebar}</aside></div>}
    <main className="relative min-w-0 lg:pl-[265px]">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-800/90 bg-[#070c16]/95 px-4 py-3 backdrop-blur-xl sm:px-7">
        <button className="lg:hidden" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Menu/></button>
        <div className="relative max-w-xl flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search lessons, topics, projects..." className="w-full rounded-xl border border-slate-700 bg-[#111b2c] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-violet-500"/></div>
        <div className="ml-auto flex items-center gap-3"><button className="hidden items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-2 text-xs font-bold text-violet-200 sm:flex"><LockKeyhole size={13}/> Private Mode</button><button aria-label="Notifications" className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800"><Bell size={19}/><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500"/></button><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold">G</div></div>
      </header>
      <div className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-7">
        <section className="relative min-h-[220px] overflow-hidden rounded-2xl border border-indigo-400/25 bg-gradient-to-r from-[#18265c] via-[#101b42] to-[#141034] p-6 shadow-2xl shadow-indigo-950/30 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"/><div className="pointer-events-none absolute right-[22%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent"/>
          <div className="relative grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
            <div className="max-w-3xl"><p className="text-sm font-semibold text-slate-200">Welcome to</p><h1 className="mt-1 text-4xl font-black leading-none tracking-tight sm:text-5xl">AI Skill Forge <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">5.0</span></h1><p className="mt-3 text-sm font-medium text-slate-200 sm:text-base">Your Personal AI-Powered Learning Platform</p><p className="mt-4 text-xs font-semibold tracking-wide text-cyan-100 sm:text-sm">Learn&nbsp; • &nbsp;Practice&nbsp; • &nbsp;Build&nbsp; • &nbsp;Assess&nbsp; • &nbsp;Master</p></div>
            <div className="rounded-xl border border-violet-300/30 bg-[#0a1028]/75 p-4 backdrop-blur"><div className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><Cpu className="text-cyan-300"/> Your Learning System</div>{['Structured Learning Roadmap','AI Tutor for Instant Help','Hands-on Coding Practice','Real-World Projects','Track Your Progress'].map(x=><div key={x} className="flex items-center gap-2 py-1.5 text-xs text-slate-200"><CheckCircle2 size={16} className="shrink-0 text-emerald-400"/>{x}</div>)}</div>
            <div className="pointer-events-none absolute right-[30%] top-1/2 hidden -translate-y-1/2 lg:block"><div className="grid h-28 w-28 place-items-center rounded-[28px] border border-cyan-300/50 bg-gradient-to-br from-cyan-400/20 via-indigo-500/30 to-fuchsia-500/30 shadow-[0_0_65px_rgba(99,102,241,.35)] rotate-12"><BrainCircuit size={65} className="text-cyan-200 -rotate-12"/></div></div>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5"><Stat icon={BookOpen} value={totalModules} label="Learning Modules" tint="bg-blue-500/15 text-blue-300"/><Stat icon={Code2} value={topics.length+'+'} label="Hands-on Topics" tint="bg-emerald-500/15 text-emerald-300"/><Stat icon={FolderKanban} value="20+" label="Real-World Projects" tint="bg-cyan-500/15 text-cyan-300"/><Stat icon={Trophy} value="150+" label="Quiz Questions" tint="bg-amber-500/15 text-amber-300"/><Stat icon={ChartNoAxesCombined} value={percent+'%'} label="Overall Progress" tint="bg-violet-500/15 text-violet-300"/></section>
        {notice&&<p role="status" className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-200">{notice}</p>}
        <div className="grid gap-5 2xl:grid-cols-[1.12fr_.88fr]">
          <section className="rounded-2xl border border-slate-800 bg-[#0e1726] p-5 sm:p-6"><SectionTitle icon={Target} title="Learning Roadmap – AI/ML Engineer Track" sub="Follow your complete AI/ML curriculum" action="View Full Roadmap" onAction={()=>go('roadmap')}/><div className="mb-4 flex items-center justify-between text-[11px] text-slate-400"><span>{AI_PHASES.length} structured phases</span><span>Total Duration: 6 Months + Capstone</span></div><div className="relative space-y-2.5 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-gradient-to-b before:from-violet-400 before:to-slate-700">{moduleCards.map((m,i)=><button key={m.title} onClick={()=>go('roadmap')} className={'relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition '+(i===0?'border-violet-400/70 bg-gradient-to-r from-violet-500/20 to-indigo-500/10 shadow-[0_0_20px_rgba(124,58,237,.12)]':'border-slate-800 bg-[#121e30] hover:border-violet-400/40')}><span className={'relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-black '+(i===0?'border-violet-300 bg-violet-600 shadow-lg shadow-violet-900/60':'border-slate-600 bg-slate-800 text-slate-200')}>{i+1}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{m.title}</span><span className="mt-1 block text-[11px] text-slate-400">{m.desc}</span></span><span className={'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold '+(i===0?'bg-violet-600/80 text-white':'bg-slate-700 text-slate-300')}>{m.status}</span></button>)}</div></section>
          <section className="space-y-4"><div className="rounded-2xl border border-slate-800 bg-[#0e1726] p-5"><SectionTitle icon={PlayCircle} title="Continue Learning" sub="Pick up where you left off"/><div className="grid gap-4 sm:grid-cols-[155px_1fr] sm:items-center"><div className="flex min-h-[112px] items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-[#0e3b61] via-[#12305b] to-[#271c62]"><div className="text-center"><Cpu size={36} className="mx-auto text-cyan-300"/><div className="mt-1 text-sm font-black">Module 01</div><div className="text-xs text-slate-300">NumPy</div></div></div><div><h3 className="text-sm font-extrabold">Module 01: NumPy</h3><p className="mt-1 text-xs text-slate-400">Lesson 1.1: NumPy arrays and fundamentals</p><div className="mt-3 flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-300" style={{width:percent+'%'}}/></div><span className="text-[10px] font-bold text-slate-300">{percent}%</span></div><button onClick={()=>go('roadmap')} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-xs font-bold text-white"><PlayCircle size={15}/> Continue Lesson</button></div></div></div>
            <div className="grid grid-cols-2 gap-3">{[[BrainCircuit,'AI Tutor','Ask questions, get explanations','tutor','text-blue-300'],[Code2,'Practice Lab','Write, run and test Python','practice','text-cyan-300'],[ClipboardList,'Quizzes','Test your understanding','assessments','text-violet-300'],[FolderKanban,'Projects','Build real-world AI/ML projects','projects','text-amber-300']].map(([Icon,title,desc,target,tone])=><button key={title} onClick={()=>go(target)} className="rounded-xl border border-slate-800 bg-[#111c2c] p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-400/50"><Icon size={24} className={tone}/><div className="mt-2 flex items-center justify-between gap-2"><b className="text-sm">{title}</b><ArrowRight size={15} className="text-slate-500"/></div><p className="mt-1 text-[11px] leading-4 text-slate-400">{desc}</p></button>)}</div></section>
        </div>
        <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-slate-800 bg-[#0e1726] p-5"><SectionTitle icon={FlaskConical} title="Featured Real-World Project" sub="Apply your learning to practical problems"/><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid h-28 w-full shrink-0 place-items-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/20 sm:w-36"><BarChart3 size={48} className="text-cyan-300"/></div><div className="min-w-0 flex-1"><span className="text-[10px] font-bold tracking-widest text-cyan-300">MACHINE LEARNING · PRODUCTION DATA</span><h3 className="mt-1 text-lg font-bold">Elastic Production Analysis</h3><p className="mt-1 text-xs leading-5 text-slate-400">Analyze production quantity, machine downtime, quality defects and delivery performance using real production-style datasets.</p><button onClick={()=>go('projects')} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-violet-300">Explore Project <ArrowRight size={14}/></button></div></div></section>
          <section className="rounded-2xl border border-slate-800 bg-[#0e1726] p-5"><SectionTitle icon={CalendarCheck} title="Your Learning Plan" sub="Today's goals"/><div className="space-y-3">{dailyGoals.map((goal,i)=><label key={goal} className="flex cursor-pointer items-center gap-3 text-xs text-slate-300"><input type="checkbox" checked={goals[i]} onChange={e=>setGoals(old=>old.map((v,j)=>i===j?e.target.checked:v))} className="h-4 w-4 accent-violet-500"/><span className={goals[i]?'text-slate-500 line-through':''}>{goal}</span></label>)}</div><p className="mt-4 text-[11px] text-slate-500">{goals.filter(Boolean).length} of {dailyGoals.length} goals completed in this session.</p></section></div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 py-4 text-[11px] text-slate-500"><span>AI Skill Forge 5.0 · Personal AI Learning Academy</span><span>Rootmap-driven curriculum · Responsive desktop and mobile</span></footer>
      </div>
    </main>
  </div>;
}
