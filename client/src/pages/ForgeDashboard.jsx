import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Bell, BookOpen, BrainCircuit, ChartNoAxesCombined, CheckCircle2, ChevronRight, Code2, FolderKanban, GraduationCap, LockKeyhole, Menu, Search, ShieldCheck, Sparkles, Target, Trophy, X } from 'lucide-react';
import { AI_PHASES, flattenTopics } from '../data/aiRoadmap';
import { api } from '../api/api';

const navigation = [
  ['dashboard','Dashboard',Activity],['roadmap','Learning Roadmap',BookOpen],
  ['tutor','AI Tutor',BrainCircuit],['practice','Practice Lab',Code2],
  ['projects','Projects',FolderKanban],['assessments','Quizzes & Assessments',Target],
  ['analytics','Progress & Analytics',ChartNoAxesCombined],['private','Private Mode',LockKeyhole]
];

function Stat({icon:Icon,value,label,tint}) {
  return <div className="rounded-2xl border border-slate-800 bg-[#101a2b] p-4 sm:p-5">
    <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${tint}`}><Icon size={21}/></div>
    <div className="text-2xl font-black text-white">{value}</div><div className="mt-1 text-xs text-slate-400">{label}</div>
  </div>;
}

export default function ForgeDashboard({navigate}) {
  const [progress,setProgress]=useState({});
  const [query,setQuery]=useState('');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [notice,setNotice]=useState('');
  const topics=useMemo(()=>flattenTopics(),[]);
  const totalModules=AI_PHASES.reduce((n,p)=>n+p.groups.length,0);
  const completed=Object.values(progress||{}).filter(x=>x?.completed).length;
  const completedStages=Object.values(progress||{}).reduce((n,x)=>n+(x?.completedStages?.length||0),0);
  const percent=topics.length?Math.round(completed/topics.length*100):0;
  useEffect(()=>{
    let active=true;
    api('/path/roadmap-progress',{pathApi:true}).then(r=>{if(active)setProgress(r.progress||{});})
      .catch(e=>{if(active)setNotice('Progress service is not connected yet. Your existing roadmap remains available.');});
    return ()=>{active=false;};
  },[]);
  const filtered=AI_PHASES.filter(p=>(p.title+' '+p.description).toLowerCase().includes(query.toLowerCase()));
  const go=id=>{
    setMobileOpen(false);
    if(id==='roadmap') navigate('roadmap');
    else if(id==='dashboard') navigate('dashboard');
    else if(id==='practice') navigate('roadmap');
    else if(id==='tutor'||id==='projects'||id==='assessments'||id==='analytics'||id==='private') navigate(id);
  };
  const sidebar=<>
    <div className="mb-8 flex items-center gap-3 px-2">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 shadow-lg shadow-violet-900/40"><BrainCircuit size={27}/></div>
      <div><div className="text-lg font-black tracking-tight">AI Skill Forge <span className="text-violet-400">2.0</span></div><div className="text-[11px] text-slate-400">Personal AI Academy</div></div>
    </div>
    <nav className="space-y-1">{navigation.map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${id==='dashboard'?'border border-indigo-400/30 bg-indigo-500/20 text-white':'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Icon size={18}/>{label}{id==='tutor'&&<span className="ml-auto rounded-full bg-violet-600 px-2 py-0.5 text-[10px]">NEW</span>}</button>)}</nav>
    <div className="mt-8 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4"><div className="flex items-center gap-2 text-sm font-bold text-violet-200"><ShieldCheck size={17}/> Private Academy</div><p className="mt-2 text-xs leading-5 text-slate-400">A focused, single-learner space for your AI journey.</p></div>
    <div className="mt-auto pt-8"><div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 font-bold">G</div><div><div className="text-sm font-bold">Personal Learner</div><div className="text-[11px] text-slate-500">AI Engineer Track</div></div></div></div>
  </>;
  return <div className="min-h-screen bg-[#070d18] text-white">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[258px] flex-col border-r border-slate-800 bg-[#0a1220] px-4 py-6 lg:flex">{sidebar}</aside>
    {mobileOpen&&<div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={()=>setMobileOpen(false)}><aside className="flex h-full w-[285px] flex-col bg-[#0a1220] p-4" onClick={e=>e.stopPropagation()}><button className="mb-5 self-end" onClick={()=>setMobileOpen(false)}><X/></button>{sidebar}</aside></div>}
    <main className="min-w-0 lg:pl-[258px]">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-800 bg-[#070d18]/90 px-4 py-3 backdrop-blur sm:px-7">
        <button className="lg:hidden" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Menu/></button>
        <div className="relative max-w-xl flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search learning paths and topics..." className="w-full rounded-xl border border-slate-700 bg-[#111b2c] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-violet-500"/></div>
        <div className="ml-auto flex items-center gap-3"><span className="hidden items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-2 text-xs font-bold text-violet-200 sm:flex"><LockKeyhole size={13}/> Private Mode</span><button aria-label="Notifications" className="rounded-full p-2 text-slate-400 hover:bg-slate-800"><Bell size={19}/></button><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold">G</div></div>
      </header>
      <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-7">
        <section className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-r from-[#17265a] via-[#17204a] to-[#11152f] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"/>
          <div className="relative max-w-3xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-bold tracking-widest text-cyan-200"><Sparkles size={13}/> YOUR PERSONAL AI ACADEMY</div><h1 className="text-3xl font-black leading-tight sm:text-5xl">Build your future with <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">AI skills.</span></h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Learn the foundations, practise with code, build real-world projects, and measure your progress — all in one private workspace.</p><div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-200">{['LEARN','PRACTISE','BUILD','ASSESS','MASTER'].map(x=><span key={x} className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{x}</span>)}</div></div>
          <div className="relative mt-7 grid gap-2 sm:absolute sm:bottom-7 sm:right-7 sm:mt-0 sm:w-64">{['Structured learning roadmap','AI-powered learning support','Hands-on coding practice','Real-world portfolio projects','Track your learning progress'].map(x=><div key={x} className="flex items-center gap-2 text-xs text-slate-200"><CheckCircle2 size={16} className="shrink-0 text-emerald-400"/>{x}</div>)}</div>
        </section>
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Stat icon={BookOpen} value={AI_PHASES.length} label="Learning phases" tint="bg-blue-500/15 text-blue-300"/><Stat icon={Code2} value={topics.length} label="Curriculum topics" tint="bg-cyan-500/15 text-cyan-300"/><Stat icon={FolderKanban} value={totalModules} label="Learning modules" tint="bg-violet-500/15 text-violet-300"/><Stat icon={ChartNoAxesCombined} value={`${percent}%`} label="Topic completion" tint="bg-emerald-500/15 text-emerald-300"/></section>
        {notice&&<p role="status" className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-200">{notice}</p>}
        <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-[#0e1828] p-5 sm:p-6"><div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold">Learning Roadmap</h2><p className="mt-1 text-xs text-slate-400">Your complete AI and machine learning journey</p></div><button onClick={()=>navigate('roadmap')} className="flex shrink-0 items-center gap-1 text-xs font-bold text-violet-300 hover:text-white">Full roadmap <ArrowRight size={15}/></button></div><div className="space-y-3">{filtered.slice(0,5).map((p,i)=><button key={p.id} onClick={()=>navigate('roadmap')} className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-[#121e30] p-3 text-left transition hover:border-violet-400/50"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black ${i===0?'bg-violet-600':'bg-slate-700'}`}>{i+1}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{p.title}</div><div className="mt-1 line-clamp-1 text-xs text-slate-400">{p.description}</div></div><span className="hidden rounded-full bg-slate-700 px-2.5 py-1 text-[10px] text-slate-300 sm:block">{p.duration}</span><ChevronRight size={17} className="text-slate-500"/></button>)}</div></section>
          <section className="rounded-2xl border border-slate-800 bg-[#0e1828] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold">Continue Learning</h2><p className="mt-1 text-xs text-slate-400">Pick up from your AI roadmap</p></div><GraduationCap className="text-cyan-300" size={26}/></div><div className="mt-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#152b4a] to-[#17183b] p-5"><div className="flex items-center justify-between"><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-bold text-cyan-200">PHASE 1 · FOUNDATIONS</span><span className="text-xs text-slate-400">{percent}% complete</span></div><h3 className="mt-4 text-2xl font-black">Python & Data Science</h3><p className="mt-2 text-sm text-slate-300">Start with Python, mathematics, NumPy, Pandas and data analysis.</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{width:`${percent}%`}}/></div><button onClick={()=>navigate('roadmap')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-extrabold shadow-lg shadow-indigo-950/50">Continue Learning <ArrowRight size={17}/></button></div><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={()=>navigate('tutor')} className="rounded-xl border border-slate-800 bg-[#121e30] p-3 text-left hover:border-violet-400/40"><BrainCircuit className="mb-2 text-violet-300"/><b className="text-sm">AI Tutor</b><p className="mt-1 text-[11px] text-slate-400">Get help with concepts</p></button><button onClick={()=>navigate('practice')} className="rounded-xl border border-slate-800 bg-[#121e30] p-3 text-left hover:border-cyan-400/40"><Code2 className="mb-2 text-cyan-300"/><b className="text-sm">Practice Lab</b><p className="mt-1 text-[11px] text-slate-400">Run and test code</p></button><button onClick={()=>navigate('assessments')} className="rounded-xl border border-slate-800 bg-[#121e30] p-3 text-left hover:border-violet-400/40"><Trophy className="mb-2 text-amber-300"/><b className="text-sm">Assessments</b><p className="mt-1 text-[11px] text-slate-400">Check your understanding</p></button><button onClick={()=>navigate('projects')} className="rounded-xl border border-slate-800 bg-[#121e30] p-3 text-left hover:border-amber-400/40"><FolderKanban className="mb-2 text-amber-300"/><b className="text-sm">Projects</b><p className="mt-1 text-[11px] text-slate-400">Build practical skills</p></button></div></section>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 py-4 text-[11px] text-slate-500"><span>AI Skill Forge 2.0 · Personal AI Academy</span><span>English-only learning experience · Private workspace</span></footer>
      </div>
    </main>
  </div>;
}
