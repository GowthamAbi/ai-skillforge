import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, BrainCircuit, GraduationCap, Languages, FlaskConical, Sparkles, Zap } from 'lucide-react';
import LegacyApp from './LegacyApp';
import EngineerPath from './pages/EngineerPath';
import EnglishSpeaking from './pages/EnglishSpeaking';
import AIRoadmap from './pages/AIRoadmap';
import ForgeDashboard from './pages/ForgeDashboard';
import AIResearchLab from './pages/AIResearchLab';
import ResearchLabModule from './pages/ResearchLabModule';
import SkillForgeSix from './pages/SkillForgeSix';
import ForgeWorkspace from './pages/ForgeWorkspace';
import { useLanguage } from './i18n/LanguageContext';

function readView() {
  const path = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  return ['old', 'path', 'english', 'roadmap', 'dashboard', 'tutor', 'practice', 'projects', 'assessments', 'analytics', 'private', 'curriculum', 'research', 'research6', 'skillforge6'].includes(path) ? path : 'home';
}

function Landing({ navigate, t }) {
  return (
    <div className="portal-shell min-h-screen overflow-hidden bg-[#070d1c] text-white">
      <div className="portal-orb portal-orb-one" aria-hidden="true" />
      <div className="portal-orb portal-orb-two" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-7 sm:px-8 sm:py-12">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3 sm:mb-14">
          <div className="flex min-w-0 items-center gap-3"><span className="portal-logo shrink-0"><Sparkles size={23} /></span>
            <span className="text-lg font-extrabold tracking-tight sm:text-xl">AI SkillForge</span>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-300 sm:px-4 sm:py-2 sm:text-xs">{t('home.space')}</span>
        </header>
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-11">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-indigo-200"><Zap size={14} /> {t('home.choose')}</div>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-6xl">{t('home.headline')} <span className="portal-gradient-text">{t('home.headline2')}</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:mt-6 sm:text-lg">{t('home.intro')}</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 md:gap-6">
          <button type="button" onClick={() => navigate('old')} className="portal-card portal-card-old group text-left">
            <span className="portal-card-shine" aria-hidden="true" />
            <span className="portal-icon portal-icon-cyan"><BookOpen size={35} strokeWidth={1.65}/></span>
            <span className="mt-7 block text-xs font-bold tracking-[.22em] text-cyan-300">{t('home.old.eyebrow')}</span>
            <span className="mt-3 block text-3xl font-bold">{t("home.old.title")}</span>
            <span className="mt-3 block max-w-sm text-sm leading-7 text-slate-400">{t('home.old.description')}</span>
            <span className="mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-cyan-200">{t('home.old.action')} <ArrowRight className="transition-transform group-hover:translate-x-1" size={20}/></span>
          </button>
          <button type="button" onClick={() => navigate('path')} className="portal-card portal-card-new group text-left">
            <span className="portal-card-shine" aria-hidden="true" />
            <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1.5 text-[11px] font-bold text-indigo-200"><Sparkles size={12}/> NEW</span>
            <span className="portal-icon portal-icon-violet"><BrainCircuit size={38} strokeWidth={1.65}/></span>
            <span className="mt-7 block text-xs font-bold tracking-[.22em] text-indigo-300">{t('home.path.eyebrow')}</span>
            <span className="mt-3 block text-3xl font-bold">{t("home.path.title")}</span>
            <span className="mt-3 block max-w-sm text-sm leading-7 text-slate-400">{t('home.path.description')}</span>
            <span className="mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-indigo-200">{t('home.path.action')} <ArrowRight className="transition-transform group-hover:translate-x-1" size={20}/></span>
          </button>
          <button type="button" onClick={() => navigate('english')} className="portal-card portal-card-english group text-left">
            <span className="portal-card-shine" aria-hidden="true" />
            <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-[11px] font-bold text-emerald-200"><Sparkles size={12}/> NEW</span>
            <span className="portal-icon portal-icon-english"><Languages size={38} strokeWidth={1.65}/></span>
            <span className="mt-7 block text-xs font-bold tracking-[.22em] text-emerald-300">{t('home.english.eyebrow')}</span>
            <span className="mt-3 block text-3xl font-bold">{t("home.english.title")}</span>
            <span className="mt-3 block max-w-sm text-sm leading-7 text-slate-400">{t('home.english.description')}</span>
            <span className="mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-emerald-200">{t('home.english.action')} <ArrowRight className="transition-transform group-hover:translate-x-1" size={20}/></span>
          </button>
          <button type="button" onClick={() => navigate('roadmap')} className="portal-card portal-card-new group text-left">
            <span className="portal-card-shine" aria-hidden="true" />
            <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-3 py-1.5 text-[11px] font-bold text-violet-200"><Sparkles size={12}/> NEW</span>
            <span className="portal-icon portal-icon-violet"><BrainCircuit size={38} strokeWidth={1.65}/></span>
            <span className="mt-7 block text-xs font-bold tracking-[.22em] text-violet-300">{t('home.roadmap.eyebrow')}</span>
            <span className="mt-3 block text-3xl font-bold">{t("home.roadmap.title")}</span>
            <span className="mt-3 block max-w-sm text-sm leading-7 text-slate-400">{t('home.roadmap.description')}</span>
            <span className="mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-violet-200">{t('home.roadmap.action')} <ArrowRight className="transition-transform group-hover:translate-x-1" size={20}/></span>
          </button>
          <button type="button" onClick={() => navigate('research')} className="portal-card portal-card-research group text-left">
            <span className="portal-card-shine" aria-hidden="true" />
            <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-fuchsia-500/20 px-3 py-1.5 text-[11px] font-bold text-fuchsia-200"><Sparkles size={12}/> NEW</span>
            <span className="portal-icon portal-icon-research"><FlaskConical size={38} strokeWidth={1.65}/></span>
            <span className="mt-7 block text-xs font-bold tracking-[.22em] text-fuchsia-300">{t('home.research.eyebrow')}</span>
            <span className="mt-3 block text-3xl font-bold">{t('home.research.title')}</span>
            <span className="mt-3 block max-w-sm text-sm leading-7 text-slate-400">{t('home.research.description')}</span>
            <span className="mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-fuchsia-200">{t('home.research.action')} <ArrowRight className="transition-transform group-hover:translate-x-1" size={20}/></span>
          </button>
          <button type="button" onClick={() => navigate('research6')} className="portal-card portal-card-research group text-left">
            <span className="portal-card-shine" aria-hidden="true" />
            <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-fuchsia-500/20 px-3 py-1.5 text-[11px] font-bold text-fuchsia-200"><Sparkles size={12}/> NEW</span>
            <span className="portal-icon portal-icon-research"><FlaskConical size={38} strokeWidth={1.65}/></span>
            <span className="mt-7 block text-xs font-bold tracking-[.22em] text-fuchsia-300">{t('home.research.eyebrow')}</span>
            <span className="mt-3 block text-3xl font-bold">{t('home.research.title')}</span>
            <span className="mt-3 block max-w-sm text-sm leading-7 text-slate-400">{t('home.research.description')}</span>
            <span className="mt-9 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-fuchsia-200">{t('home.research.action')} <ArrowRight className="transition-transform group-hover:translate-x-1" size={20}/></span>
          </button>
        </div>
        <footer className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-500 sm:mt-12 sm:text-sm"><GraduationCap className="shrink-0" size={17}/> {t('home.footer')}</footer>
      </div>
    </div>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-switcher flex items-center gap-1 rounded-full border border-white/15 bg-[#111b32]/95 p-1 text-white shadow-xl backdrop-blur" role="group" aria-label={t('language.label')}>
      
      <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={'language-option ' + (language === 'en' ? 'is-active' : '')}>English</button>
    </div>
  );
}

export default function App() {
  const { t } = useLanguage();
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
  if (view === 'home') return <Landing navigate={navigate} t={t}/>;
  if (view === 'dashboard') return <ForgeDashboard navigate={navigate}/>;
  if (view === 'skillforge6') return <SkillForgeSix navigateHome={() => navigate('home')}/>;
  return <div className="app-language-bar">
    
    <button type="button" onClick={() => navigate('home')} className="mobile-safe-bottom fixed bottom-2 right-3 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-[#111b32] px-4 pt-3 text-xs font-bold text-white shadow-2xl transition hover:bg-indigo-600 sm:bottom-4 sm:right-4" aria-label={t('switch.mode')}><ArrowLeft size={15}/> {t('switch.mode')}</button>
    {view === 'old' ? <LegacyApp/> : view === 'path' ? <EngineerPath/> : view === 'roadmap' || view === 'curriculum' ? <AIRoadmap/> : view === 'english' ? <EnglishSpeaking/> : view === 'research' ? <AIResearchLab/> : view === 'research6' ? <ResearchLabModule navigate={navigate}/> : ['tutor','practice','projects','assessments','analytics','private'].includes(view) ? <ForgeWorkspace view={view} navigate={navigate}/> : <div className="min-h-screen bg-[#070d18] p-6 text-white"><div className="mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6"><h1 className="text-2xl font-bold">Feature</h1><button onClick={()=>navigate('dashboard')} className="mt-5 rounded-xl bg-violet-600 px-4 py-2 font-bold">Back to Dashboard</button></div></div>}
  </div>;
}
