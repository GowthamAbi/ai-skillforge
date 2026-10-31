import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Bell, BookOpen, BrainCircuit, ChartNoAxesCombined, CheckCircle2, Code2, FolderKanban, GraduationCap, LockKeyhole, Menu, Search, ShieldCheck, Sparkles, Target, Trophy, X, Layers3, CalendarCheck, PlayCircle } from 'lucide-react';
import { AI_PHASES, flattenTopics } from '../data/aiRoadmap';
import { api } from '../api/api';

const navigation = [
  ['dashboard','Dashboard',Activity],['roadmap','Learning Roadmap',BookOpen],
  ['tutor','AI Tutor',BrainCircuit],['practice','Practice Lab',Code2],
  ['projects','Projects',FolderKanban],['assessments','Quizzes & Assessments',Target],
  ['analytics','Progress & Analytics',ChartNoAxesCombined],['private','Private Mode',LockKeyhole]
];

const dailyGoals = [
  'Complete one roadmap lesson',
  'Practise 5 Python coding exercises',
  'Review notes and mistakes',
  'Work on a mini project'
];

function Stat({icon:Icon,value,label,tint}) {
  return <div className="rounded-2xl border border-slate-800/90 bg-[#101a2b] p-4 transition hover:-translate-y-0.5 hover:border-violet-400/30 sm:p-5">
    <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${tint}`}><Icon size={21}/></div>
    <div className="text-2xl font-black text-white">{value}</div><div className="mt-1 text-xs text-slate-400">{label}</div>
  </div>;
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
      .catch(()=>{if(active)setNotice('Progress sync is currently unavailable. Your learning roadmap is still accessible.');});
    return ()=>{active=false;};
  },[]);
  const go=id=>{
    setMobileOpen(false);
    navigate(id);
  };
  const sidebar=<>
    <div className="mb-8 flex items-center gap-3 px-2">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 shadow-lg shadow-violet-900/40"><BrainCircuit size={27}/></div>
      <div><div className="text-lg font-black tracking-tight">AI Skill Forge <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">5.0</span></div><div className="text-[11px] text-slate-400">Personal AI Learning Academy</div></div>
    </div>
    <nav className="space-y-1">{navigation.map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${id==='dashboard'?'border border-indigo-400/30 bg-gradient-to-r from-indigo-600/35 to-violet-600/15 text-white shadow-inner':'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Icon size={18}/>{label}{id==='tutor'&&<span className="ml-auto rounded-full bg-violet-600 px-2 py-0.5 text-[10px]">5.0</span>}</button>)}</nav>
    <div className="mt-8 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4"><div className="flex items-center gap-2 text-sm font-bold text-violet-200"><ShieldCheck size={17}/> Personal Learning Space</div><p className="mt-2 text-xs leading-5 text-slate-400">A focused workspace for your complete AI and ML learning journey.</p></div>
    <div className="mt-auto pt-8"><div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold">G</div><div><div className="text-sm font-bold">Gowtham Abi</div><div className="text-[11px] text-slate-500">AI/ML Learner</div></div></div></div>
  </>;
  return <div className="min-h-screen bg-[#060b16] text-white">
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true"><div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-violet-700/10 blur-3xl"/><div className="absolute left-1/3 top-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl"/></div>
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[258px] flex-col border-r border-slate-800/90 bg-[#09111f] px-4 py-6 lg:flex">{sidebar}</aside>
    {mobileOpen&&<div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={()=>setMobileOpen(false)}><aside className="flex h-full w-[285px] flex-col bg-[#09111f] p-4" onClick={e=>e.stopPropagation()}><button className="mb-5 self-end" onClick={()=>setMobileOpen(false)}><X/></button>{sidebar}</aside></div>}
    <main className="relative min-w-0 lg:pl-[258px]">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-800/90 bg-[#060b16]/90 px-4 py-3 backdrop-blur-xl sm:px-7">
        <button className="lg:hidden" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Menu/></button>
        <div className="relative max-w-xl flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search lessons, projects, tools, or topics..." className="w-full rounded-xl border border-slate-700 bg-[#111b2c] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-violet-500"/></div>
        <div className="ml-auto flex items-center gap-3"><span className="hidden items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-2 text-xs font-bold text-violet-200 sm:flex"><Sparkles size={13}/> AI SKILL FORGE 5.0</span><button aria-label="Notifications" className="rounded-full p-2 text-slate-400 hover:bg-slate-800"><Bell size={19}/></button><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold">G</div></div>
      </header>
      <div className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-7">
        <section className="relative overflow-hidden rounded-3xl border border-violet-400/25 bg-gradient-to-br from-[#20145a] via-[#111d43] to-[#10152c] p-6 shadow-2xl shadow-indigo-950/30 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl"/>
          <div className="pointer-events-none absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent"/>
          <div className="relative grid gap-7 xl:grid-cols-[1fr_auto] xl:items-center">
            <div className="max-w-3xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1.5 text-[11px] font-bold tracking-widest text-violet-100"><Sparkles size={13}/> AI SKILL FORGE 5.0</div><h1 className="text-3xl font-black leading-tight sm:text-5xl">Master AI, ML, DL, NLP,<br className="hidden sm:block"/> AI Engineering & <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-fuchsia-300 bg-clip-text text-transparent">GenAI.</span></h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">A complete, practical learning journey — from Python foundations to production-ready AI applications.</p><div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-slate-100">{['LEARN','PRACTISE','BUILD','ASSESS','DEPLOY','GROW'].map(x=><span key={x} className="rounded-full border border-white/15 bg-white/5 px-3 py-2">✓ {x}</span>)}</div></div>
            <div className="relative grid min-w-[230px] gap-3 rounded-2xl border border-white/15 bg-[#080f22]/60 p-4 backdrop-blur"><div className="mb-1 text-xs font-bold uppercase tracking-widest text-cyan-200">Your learning system</div>{['Complete AI/ML roadmap','Real-world datasets & projects','AI Tutor and coding practice','Track skills and progress','Build a job-ready portfolio'].map(x=><div key={x} className="flex items-center gap-2 text-xs text-slate-200"><CheckCircle2 size={16} className="shrink-0 text-emerald-400"/>{x}</div>)}</div>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Stat icon={Layers3} value={AI_PHASES.length} label="Major learning tracks" tint="bg-blue-500/15 text-blue-300"/><Stat icon={BookOpen} value={topics.length} label="Roadmap lesson topics" tint="bg-cyan-500/15 text-cyan-300"/><Stat icon={Code2} value={totalModules} label="Learning modules" tint="bg-violet-500/15 text-violet-300"/><Stat icon={ChartNoAxesCombined} value={`${percent}%`} label="Recorded topic completion" tint="bg-emerald-500/15 text-emerald-300"/></section>
        {notice&&<p role="status" className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-200">{notice}</p>}
        <div className="grid gap-5 2xl:grid-cols-[1.15fr_.85fr]">
          <section className="rounded-2xl border border-slate-800 bg-[#0d1728]/95 p-5 sm:p-6"><div className="mb-5 flex items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-cyan-300"><Target size={19}/><span className="text-[10px] font-bold tracking-widest">YOUR AI/ML JOURNEY</span></div><h2 className="mt-1 text-lg font-extrabold">Complete Learning Roadmap</h2><p className="mt-1 text-xs text-slate-400">7 structured phases · Follow the curriculum in order</p></div><button onClick={()=>go('roadmap')} className="flex shrink-0 items-center gap-1 text-xs font-bold text-violet-300 hover:text-white">Full roadmap <ArrowRight size={15}/></button></div>
            <div className="relative space-y-2.5 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-gradient-to-b before:from-violet-400 before:to-slate-700">{filtered.slice(0,7).map((p,i)=><button key={p.id} onClick={()=>go('roadmap')} className="relative flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-[#121e30] p-3 text-left transition hover:border-violet-400/50 hover:bg-[#17243a]"><div className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-black ${i===0?'border-violet-300 bg-violet-600 shadow-lg shadow-violet-900/60':'border-slate-600 bg-slate-800 text-slate-200'}`}>{i+1}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{p.title.replace(/^Phase \\d+ — /,'')}</div><div className="mt-1 line-clamp-1 text-xs text-slate-400">{p.description}</div></div><span className="hidden rounded-full bg-slate-700/80 px-2.5 py-1 text-[10px] text-slate-300 sm:block">{p.duration||'Self-paced'}</span><ArrowRight size={16} className="shrink-0 text-slate-500"/></button>)}</div>
          </section>
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-[#0d1728] p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-cyan-300"><PlayCircle size={19}/><span className="text-[10px] font-bold tracking-widest">PICK UP WHERE YOU LEFT OFF</span></div><h2 className="mt-1 text-lg font-extrabold">Continue Learning</h2></div><GraduationCap className="text-cyan-300" size={25}/></div><div className="mt-4 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#152b4a] to-[#17183b] p-4"><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-bold text-cyan-200">PHASE 1 · PROGRAMMING FOUNDATIONS</span><h3 className="mt-3 text-xl font-black">Python & Data Science</h3><p className="mt-1 text-sm text-slate-300">Python, NumPy, Pandas, data cleaning, preprocessing and EDA.</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{width:`${percent}%`}}/></div><div className="mt-2 text-right text-[11px] text-slate-400">{percent}% recorded completion</div><button onClick={()=>go('roadmap')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-extrabold shadow-lg shadow-indigo-950/50">Continue Roadmap <ArrowRight size={17}/></button></div></div>
            <div className="grid grid-cols-2 gap-3"><button onClick={()=>go('tutor')} className="rounded-xl border border-slate-800 bg-[#111d30] p-4 text-left transition hover:border-violet-400/50"><BrainCircuit className="mb-2 text-violet-300" size={23}/><b className="text-sm">AI Tutor 5.0</b><p className="mt-1 text-[11px] leading-5 text-slate-400">Ask, understand and debug</p><ArrowRight className="mt-2 text-violet-300" size={15}/></button><button onClick={()=>go('practice')} className="rounded-xl border border-slate-800 bg-[#111d30] p-4 text-left transition hover:border-cyan-400/50"><Code2 className="mb-2 text-cyan-300" size={23}/><b className="text-sm">Practice Lab</b><p className="mt-1 text-[11px] leading-5 text-slate-400">Write and run Python code</p><ArrowRight className="mt-2 text-cyan-300" size={15}/></button><button onClick={()=>go('assessments')} className="rounded-xl border border-slate-800 bg-[#111d30] p-4 text-left transition hover:border-fuchsia-400/50"><Trophy className="mb-2 text-fuchsia-300" size={23}/><b className="text-sm">Quizzes</b><p className="mt-1 text-[11px] leading-5 text-slate-400">Test your understanding</p><ArrowRight className="mt-2 text-fuchsia-300" size={15}/></button><button onClick={()=>go('projects')} className="rounded-xl border border-slate-800 bg-[#111d30] p-4 text-left transition hover:border-amber-400/50"><FolderKanban className="mb-2 text-amber-300" size={23}/><b className="text-sm">Projects</b><p className="mt-1 text-[11px] leading-5 text-slate-400">Build practical solutions</p><ArrowRight className="mt-2 text-amber-300" size={15}/></button></div>
          </section>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-slate-800 bg-[#0d1728] p-5"><div className="flex items-center gap-2"><FolderKanban className="text-violet-300"/><h2 className="font-extrabold">Featured Real-World Project</h2></div><div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid h-28 w-full shrink-0 place-items-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/20 sm:w-36"><ChartNoAxesCombined size={48} className="text-cyan-300"/></div><div className="min-w-0 flex-1"><span className="text-[10px] font-bold tracking-widest text-cyan-300">MACHINE LEARNING · PRODUCTION DATA</span><h3 className="mt-1 text-lg font-bold">Elastic Production Analysis</h3><p className="mt-1 text-xs leading-5 text-slate-400">Explore production quantity, machine downtime, quality defects and delivery performance using practical datasets.</p><button onClick={()=>go('projects')} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-violet-300 hover:text-white">Explore projects <ArrowRight size={14}/></button></div></div></section>
          <section className="rounded-2xl border border-slate-800 bg-[#0d1728] p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><CalendarCheck className="text-violet-300"/><h2 className="font-extrabold">Your Learning Plan</h2></div><span className="rounded-full bg-violet-500/15 px-3 py-1 text-[10px] font-bold text-violet-200">Today's goals</span></div><div className="mt-4 space-y-3">{dailyGoals.map((goal,i)=><label key={goal} className="flex cursor-pointer items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={goals[i]} onChange={e=>setGoals(old=>old.map((v,j)=>i===j?e.target.checked:v))} className="h-4 w-4 accent-violet-500"/><span className={goals[i]?'text-slate-500 line-through':''}>{goal}</span></label>)}</div><p className="mt-4 text-[11px] text-slate-500">{goals.filter(Boolean).length} of {dailyGoals.length} goals checked in this session.</p></section>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 py-4 text-[11px] text-slate-500"><span>AI Skill Forge 5.0 · Personal AI Learning Academy</span><span>Curriculum follows your AI/ML roadmap · Responsive workspace</span></footer>
      </div>
    </main>
  </div>;
}
