import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, BrainCircuit, GraduationCap, Sparkles, Zap } from 'lucide-react';
import LegacyApp from './LegacyApp';
import EngineerPath from './pages/EngineerPath';

function readView() {
  const path = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  return ['old', 'path'].includes(path) ? path : 'home';
}

function Landing({ navigate }) {
  return (
    <div className="portal-shell min-h-screen overflow-hidden bg-[#070d1c] text-white">
      <div className="portal-orb portal-orb-one" aria-hidden="true" />
      <div className="portal-orb portal-orb-two" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-12 sm:px-8">
        <header className="mb-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="portal-logo"><Sparkles size={23} /></span>
            <span className="text-xl font-extrabold tracking-tight">AI SkillForge</span>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wider text-slate-300">PERSONAL LEARNING SPACE</span>
        </header>
        <div className="mx-auto mb-11 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-indigo-200"><Zap size={14} /> CHOOSE YOUR JOURNEY</div>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">One place. <span className="portal-gradient-text">Two ways to grow.</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">Continue the roadmap you already know, or enter your new video-by-video AI Engineer learning experience.</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <button type="button" onClick={() => navigate('old')} className="portal-card portal-card-old group text-left">
            <span className="portal-card-shine" aria-hidden="true" />
            <span className="portal-icon portal-icon-cyan"><BookOpen size={35} strokeWidth={1.65}/></span>
            <span className="mt-7 block text-xs font-bold tracking-[.22em] text-cyan-300">01 · ORIGINAL EXPERIENCE</span>
            <span className="mt-3 block text-3xl font-bold">Old SkillForge</span>
            <span className="mt-3 block max-w-sm text-sm leading-7 text-slate-400">Your existing 50-day roadmap, timetable, projects, progress and familiar sidebar — unchanged.</span>
            <span className="mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-cyan-200">Open classic dashboard <ArrowRight className="transition-transform group-hover:translate-x-1" size={20}/></span>
          </button>
          <button type="button" onClick={() => navigate('path')} className="portal-card portal-card-new group text-left">
            <span className="portal-card-shine" aria-hidden="true" />
            <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1.5 text-[11px] font-bold text-indigo-200"><Sparkles size={12}/> NEW</span>
            <span className="portal-icon portal-icon-violet"><BrainCircuit size={38} strokeWidth={1.65}/></span>
            <span className="mt-7 block text-xs font-bold tracking-[.22em] text-indigo-300">02 · GUIDED AI LEARNING</span>
            <span className="mt-3 block text-3xl font-bold">AI Engineer Path</span>
            <span className="mt-3 block max-w-sm text-sm leading-7 text-slate-400">Exact course lessons, Udemy links, free quizzes, 4-hour focus sessions, GitHub projects and career milestones.</span>
            <span className="mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-indigo-200">Start learning <ArrowRight className="transition-transform group-hover:translate-x-1" size={20}/></span>
          </button>
        </div>
        <footer className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500"><GraduationCap size={17}/> Built for your AI Engineer journey · 4 hours a day</footer>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState(readView);
  useEffect(() => {
    const update = () => setView(readView());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const navigate = target => {
    window.location.hash = target === 'home' ? '' : `/${target}`;
    setView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (view === 'home') return <Landing navigate={navigate}/>;
  return <>
    <button type="button" onClick={() => navigate('home')} className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-[#111b32] px-4 py-3 text-xs font-bold text-white shadow-2xl transition hover:bg-indigo-600" aria-label="Switch between Old and New learning dashboards"><ArrowLeft size={15}/> Switch mode</button>
    {view === 'old' ? <LegacyApp/> : <EngineerPath/>}
  </>;
}
