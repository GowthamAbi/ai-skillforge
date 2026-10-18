import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowLeft, ArrowRight, Bell, BookOpen, BriefcaseBusiness, CalendarDays,
  CheckCircle2, ChevronRight, CircleHelp, Clock3, Code2, ExternalLink, Flame,
  GraduationCap, ListChecks, Link2, LockKeyhole, Pause, Play, Rocket,
  Save, Send, ShieldCheck, Sparkles, Target, Timer, Trophy, UploadCloud
} from 'lucide-react';
import { api } from '../api/api';
import NotificationSettings from '../components/NotificationSettings';

const nav = [
  ['dashboard', 'Dashboard', Activity], ['courses', 'Udemy Courses', BookOpen],
  ['lessons', 'Daily Lessons', Play], ['quizzes', 'Quizzes & Tests', ListChecks],
  ['projects', 'Coding Projects', Code2], ['career', 'Job Preparation', BriefcaseBusiness],
  ['progress', 'Progress', Trophy], ['alerts', 'Brave Alerts', Bell]
];
const asTime = minutes => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
const fmt = date => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });

function Panel({ children, className = '' }) { return <section className={`rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_35px_rgba(35,44,93,.035)] ${className}`}>{children}</section>; }
function Badge({ children, variant = 'indigo' }) { const color = variant === 'green' ? 'bg-emerald-100 text-emerald-700' : variant === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-700'; return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>{children}</span>; }
function Metric({ icon: Icon, title, value, sub, tint }) { return <Panel className="flex items-center gap-4 p-5"><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${tint}`}><Icon size={26}/></span><div className="min-w-0"><p className="text-[11px] font-extrabold tracking-widest text-slate-500">{title}</p><p className="mt-1 text-[25px] font-extrabold leading-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{sub}</p></div></Panel>; }

function FocusTimer({ day, onChanged }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [saving, setSaving] = useState(false);
  const lastSent = useRef(Date.now());
  const active = useRef(false);
  const savingRef = useRef(false);
  const dayRef = useRef(day.day);
  useEffect(() => { setRunning(false); setElapsed(0); active.current = false; dayRef.current = day.day; }, [day.day]);
  const sync = useCallback(async () => {
    if (savingRef.current || !active.current) return;
    const minutes = Math.floor((Date.now() - lastSent.current) / 60000);
    if (minutes < 1) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const amount = Math.min(30, minutes);
      await api(`/path/days/${dayRef.current}/time`, { method: 'POST', body: JSON.stringify({ minutes: amount }) });
      lastSent.current += amount * 60000;
      onChanged();
    } catch (error) { setRunning(false); active.current = false; window.alert(error.message); }
    finally { savingRef.current = false; setSaving(false); }
  }, [onChanged]);
  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => { setElapsed(Math.floor((Date.now() - lastSent.current) / 1000)); sync(); }, 1000);
    const visible = () => { if (!document.hidden) sync(); };
    document.addEventListener('visibilitychange', visible);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', visible); };
  }, [running, sync]);
  const toggle = () => {
    if (running) {
      active.current = false;
      setRunning(false);
      setElapsed(0);
    } else {
      lastSent.current = Date.now();
      active.current = true;
      setRunning(true);
    }
  };
  const percent = Math.min(100, Math.round(day.studyMinutes / 240 * 100));
  return <Panel className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-wider text-slate-500">FOCUS TIMER · DAY {day.day}</p><h3 className="mt-1 text-lg font-bold text-slate-900">Study whenever you're ready</h3></div><Timer className="text-indigo-500" size={28}/></div>
    <div className="mt-5 flex items-center justify-between"><span className="text-3xl font-extrabold text-slate-900">{asTime(day.studyMinutes)} <span className="text-sm font-medium text-slate-400">/ 4h</span></span><Badge variant={percent === 100 ? 'green' : 'indigo'}>{percent}%</Badge></div>
    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400 transition-all" style={{width:`${percent}%`}}/></div>
    <p className="mt-2 text-xs text-slate-500">Only active timer minutes are counted. Keep the SkillForge tab open while studying on Udemy.</p>
    <button disabled={day.completedAt || percent === 100 || saving} onClick={toggle} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white ${running?'bg-amber-500':'bg-indigo-600 hover:bg-indigo-700'} disabled:opacity-40`}>{running ? <Pause size={18}/> : <Play size={18}/>} {running?'Pause focus': 'Start focus'} {running && <span className="text-xs">({Math.floor(elapsed / 60)}m {elapsed % 60}s)</span>}</button>
  </Panel>;
}

function QuizBox({ lesson, onChanged }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    setQuiz(null); setResult(null); setAnswers({}); setError('');
    if (!lesson?.watched) return;
    api(`/path/lessons/${lesson.id}/quiz`).then(setQuiz).catch(error => setError(error.message));
  }, [lesson?.id, lesson?.watched]);
  if (!lesson) return <p className="text-sm text-slate-500">Select a video to see its test.</p>;
  if (!lesson.watched) return <div className="py-9 text-center"><LockKeyhole className="mx-auto text-slate-400" size={28}/><p className="mt-3 font-bold text-slate-900">Quiz unlocks after the video</p><p className="mt-1 text-xs text-slate-500">Watch → mark watched → answer 5 free MCQs</p></div>;
  if (!quiz) return <p className="py-5 text-sm text-slate-500">Loading free topic practice questions… {error}</p>;
  const submit = async () => {
    setBusy(true); setError('');
    try {
      const r = await api(`/path/lessons/${lesson.id}/quiz`, { method: 'POST', body: JSON.stringify({ answers: quiz.questions.map((_, index) => answers[index]) }) });
      setResult(r); onChanged();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold tracking-wider text-indigo-600">VIDEO CHECKPOINT</p><h3 className="mt-1 text-xl font-extrabold text-slate-900">5-question quiz</h3></div><Badge variant={lesson.quizPassed?'green':'indigo'}>Pass mark 80%</Badge></div>
    <p className="mt-2 text-xs text-slate-500">Free pre-written topic-based practice, not an AI-generated video transcript test.</p>
    {quiz.questions.map((question, index) => <fieldset key={question.id} className="mt-5 border-t border-slate-100 pt-4"><legend className="text-sm font-bold leading-6 text-slate-800">{index+1}. {question.question}</legend><div className="mt-2 grid gap-2">{question.options.map((option, number) => <label key={number} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${answers[index]===number?'border-indigo-400 bg-indigo-50 text-indigo-900':'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}><input type="radio" name={`lesson-${lesson.id}-q${index}`} checked={answers[index]===number} onChange={() => setAnswers(old=>({...old,[index]:number}))} className="mt-1 accent-indigo-600"/>{option}</label>)}</div>{result && <p className={`mt-2 text-xs ${result.review[index].correct?'text-emerald-700':'text-amber-700'}`}>{result.review[index].correct?'Correct ✓':'Review: '+question.options[result.review[index].correctAnswer]} · {result.review[index].explanation}</p>}</fieldset>)}
    {error && <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p>}
    {result && <div className={`mt-5 rounded-xl p-4 text-sm font-bold ${result.passed?'bg-emerald-50 text-emerald-800':'bg-amber-50 text-amber-800'}`}>Your result: {result.score}/{result.total} · {result.passed?'PASSED! Continue to the next video.':'Review and retry to reach 80%.'}</div>}
    <button onClick={submit} disabled={busy || Object.keys(answers).length < quiz.questions.length} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-40"><Send size={17}/>{busy?'Checking answers…':'Submit quiz / Retry'}</button>
  </div>;
}

function VideoLesson({ lesson, onChanged, onQuiz }) {
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(lesson.deepLink || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { setUrl(lesson.deepLink || ''); setEditing(false); setError(''); }, [lesson.id, lesson.deepLink]);
  const saveLink = async () => {
    setBusy(true); setError('');
    try { await api(`/path/lessons/${lesson.id}/link`, { method:'POST', body: JSON.stringify({url}) }); setEditing(false); onChanged(); }
    catch(error) { setError(error.message); }
    finally { setBusy(false); }
  };
  const watch = () => window.open(lesson.deepLink || lesson.courseUrl, '_blank', 'noopener,noreferrer');
  const watched = async () => {
    setBusy(true); setError('');
    try { await api(`/path/lessons/${lesson.id}/watched`, { method:'POST' }); onChanged(); }
    catch(error) { setError(error.message); }
    finally { setBusy(false); }
  };
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><Badge variant={lesson.quizPassed?'green':lesson.watched?'amber':'indigo'}>{lesson.quizPassed?'WATCHED + TEST PASSED':lesson.watched?'WATCHED · QUIZ PENDING':'STEP 01 · WATCH'}</Badge><h3 className="mt-3 text-lg font-extrabold leading-snug text-slate-900">{lesson.title}</h3></div><div className="flex items-center gap-1 text-sm font-semibold text-slate-500"><Clock3 size={15}/>{lesson.duration}</div></div>
    <dl className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2"><div><dt className="font-semibold text-slate-400">COURSE</dt><dd className="mt-1 leading-5">{lesson.course}</dd></div><div><dt className="font-semibold text-slate-400">INSTRUCTOR</dt><dd className="mt-1">{lesson.instructor}</dd></div><div><dt className="font-semibold text-slate-400">STUDY SECTION</dt><dd className="mt-1">{lesson.section}</dd></div><div><dt className="font-semibold text-slate-400">IMPORTED VIDEO ORDER</dt><dd className="mt-1">#{lesson.roadmapVideoNumber} · Udemy lecture ID {lesson.deepLink?'linked':'not yet verified'}</dd></div></dl>
    <div className="mt-5 flex flex-wrap gap-2"><button onClick={watch} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"><ExternalLink size={16}/>{lesson.deepLink?'Watch exact video on Udemy':'Open course on Udemy'}</button><button disabled={lesson.watched||busy} onClick={watched} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><CheckCircle2 size={16}/>{lesson.watched?'Watched ✓':'Mark as watched'}</button><button onClick={() => setEditing(!editing)} className="flex items-center gap-1 px-2 py-2 text-xs font-semibold text-indigo-700"><Link2 size={14}/>{lesson.deepLink?'Edit video URL':'Add direct video URL'}</button><button disabled={!lesson.watched} onClick={()=>onQuiz(lesson)} className="flex items-center gap-1 px-2 py-2 text-xs font-bold text-indigo-700 disabled:opacity-40"><CircleHelp size={15}/>Take test</button></div>
    {editing && <div className="mt-4 rounded-xl bg-indigo-50 p-3"><p className="text-xs text-slate-600">Copy the exact lecture URL from your signed-in Udemy player once; the button will open that video next time.</p><input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.udemy.com/course/.../learn/lecture/123456" className="mt-2 w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs text-slate-900"/><button onClick={saveLink} disabled={busy} className="mt-2 flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white"><Save size={13}/>Save exact link</button></div>}
    {error && <p role="alert" className="mt-3 text-xs text-rose-600">{error}</p>}
  </div>;
}

function ProjectForm({ module, currentDay, onChanged }) {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [checks, setChecks] = useState([false,false,false]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const checksText = ['I ran the project successfully and checked expected outputs', 'My README explains setup, limitations and demo steps', 'No secret key, credentials or sensitive data are included'];
  const selectFile = async event => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > 30000) { setError('Please upload one main text/code file smaller than 30 KB; share larger projects using GitHub.'); return; }
    setFile(await selected.text()); setFilename(selected.name); setError('');
  };
  const submit = async () => {
    setSaving(true); setError('');
    try { await api(`/path/modules/${module.id}/project`, { method: 'POST', body: JSON.stringify({code:file,filename,githubUrl,confirmations:checks}) }); onChanged(); }
    catch(error) { setError(error.message); }
    finally { setSaving(false); }
  };
  const locked = currentDay < module.to;
  return <Panel className="p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-bold tracking-wider text-indigo-600">MODULE PROJECT · DAYS {module.from}–{module.to}</p><h3 className="mt-2 text-xl font-extrabold text-slate-900">{module.title}</h3></div><Badge variant={module.project?.status==='self-reviewed'?'green':locked?'amber':'indigo'}>{module.project?.status==='self-reviewed'?'SUBMITTED':locked?'LOCKED UNTIL MODULE END':'READY TO SUBMIT'}</Badge></div><p className="mt-3 text-sm leading-6 text-slate-600">{module.brief}</p>
    {locked ? <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs text-amber-800"><LockKeyhole size={15} className="mr-1 inline"/>Complete earlier study days to unlock this module's project.</p> : <>
      <label className="mt-5 block text-xs font-bold text-slate-600">GitHub repository URL (preferred)</label><input type="url" value={githubUrl} onChange={event => setGithubUrl(event.target.value)} placeholder="https://github.com/username/project" className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900"/>
      <label className="mt-4 block text-xs font-bold text-slate-600">Or upload one main code file</label><input type="file" accept=".py,.js,.jsx,.ts,.tsx,.json,.html,.css,.md,.txt" onChange={selectFile} className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-700"/>{filename && <p className="mt-1 text-xs text-emerald-700"><UploadCloud size={13} className="mr-1 inline"/>{filename} ready</p>}
      <div className="mt-4 space-y-2">{checksText.map((item,i)=><label key={item} className="flex items-start gap-3 text-xs leading-5 text-slate-600"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(old=>old.map((b,j)=>i===j?e.target.checked:b))} className="mt-1 accent-indigo-600"/>{item}</label>)}</div>
      <p className="mt-3 text-xs text-slate-500">Free learner self-check; upload is stored as text with progress. This is not an automatic code review.</p><button onClick={submit} disabled={saving || !checks.every(Boolean)} className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-40"><UploadCloud size={16}/>{saving?'Submitting…':'Submit module project'}</button>
    </>}{error && <p role="alert" className="mt-3 text-xs text-rose-600">{error}</p>}</Panel>;
}

function ModuleFinalTest({ module, currentDay, onChanged }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const locked = currentDay < module.to;
  useEffect(() => {
    setQuiz(null); setAnswers({}); setResult(null); setError('');
    if (!locked) api(`/path/modules/${module.id}/test`).then(setQuiz).catch(err=>setError(err.message));
  }, [module.id, locked]);
  const submit = async () => {
    setBusy(true);setError('');
    try {
      const r=await api(`/path/modules/${module.id}/test`,{method:'POST',body:JSON.stringify({answers:quiz.questions.map((_,index)=>answers[index])})});
      setResult(r);onChanged();
    } catch(err){setError(err.message);}
    finally{setBusy(false);}
  };
  return <Panel className="p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold text-indigo-600">MODULE KNOWLEDGE TEST</p><h3 className="mt-1 text-xl font-extrabold">{module.title} · Final test</h3></div><Badge variant={module.testPassed?'green':locked?'amber':'indigo'}>{module.testPassed?'PASSED':locked?'LOCKED':'80% TO PASS'}</Badge></div>
    <p className="mt-2 text-xs text-slate-500">10 free checkpoint questions from the module topics. A separate test in addition to the 5-question quiz after each video.</p>
    {locked?<div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-500"><LockKeyhole size={14} className="mr-1 inline"/>Available after earlier study days.</div>:!quiz?<p className="mt-4 text-xs text-slate-500">Loading test… {error}</p>:<>
      {quiz.questions.map((q,index)=><fieldset key={q.id} className="mt-4 border-t border-slate-100 pt-4"><legend className="text-sm font-bold">{index+1}. {q.question}</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{q.options.map((option,i)=><label key={i} className={`flex cursor-pointer gap-2 rounded-lg border p-2.5 text-xs ${answers[index]===i?'border-indigo-400 bg-indigo-50':'border-slate-200'}`}><input type="radio" name={`module-${module.id}-${index}`} checked={answers[index]===i} onChange={()=>setAnswers(old=>({...old,[index]:i}))} className="accent-indigo-600"/>{option}</label>)}</div>{result&&<p className={`mt-1 text-xs ${result.review[index].correct?'text-emerald-700':'text-amber-700'}`}>{result.review[index].explanation}</p>}</fieldset>)}
      {result&&<p className={`mt-4 rounded-xl p-3 text-sm font-bold ${result.passed?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-800'}`}>{result.score}/{result.total} · {result.passed?'Passed!':'Retry after revising.'}</p>}
      {error&&<p role="alert" className="mt-3 text-xs text-rose-600">{error}</p>}
      <button onClick={submit} disabled={busy||Object.keys(answers).length<quiz.questions.length} className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-40"><ListChecks size={16}/>{busy?'Grading…':'Submit final test / Retry'}</button>
    </>}
  </Panel>;
}

export default function EngineerPath() {
  const [data, setData] = useState(null);
  const [section, setSection] = useState('dashboard');
  const [selectedDay, setSelectedDay] = useState(null);
  const [quizLessonId, setQuizLessonId] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const next = await api('/path/dashboard');
      setData(next); setError('');
      setSelectedDay(prev => prev || next.firstUnfinishedDay);
    } catch (error) { setError(error.message); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const day = data?.days.find(item=>item.day===selectedDay) || data?.days[data.firstUnfinishedDay-1];
  const lessonList = day?.lessons || [];
  const nextLesson = lessonList.find(lesson=>!lesson.quizPassed) || lessonList[0];
  const quizLesson = lessonList.find(lesson=>lesson.id===quizLessonId) || nextLesson;
  const moduleEnd = data?.modules.find(item=>item.to===day?.day);
  const allVideos = useMemo(()=>data?.days.flatMap(d=>d.lessons)||[],[data]);
  const selectedCourse = data?.courses.find(course=>course.id===nextLesson?.courseId);
  const isUnlocked = day?.day <= data?.firstUnfinishedDay;
  const chooseDay = number => { setSelectedDay(number); setQuizLessonId(null); setSection('lessons'); window.scrollTo({top:0,behavior:'smooth'}); };
  const chooseQuiz = lesson => { setQuizLessonId(lesson.id); setSection('quizzes'); window.scrollTo({top:0,behavior:'smooth'}); };
  const completeDay = async () => {
    setBusy(true); setStatus('');
    try { const result = await api(`/path/days/${day.day}/complete`, { method:'POST' }); setStatus(result.message); await load(); setSelectedDay(result.nextDay); }
    catch(error) { setStatus(error.pending?.join(', ') || error.message); }
    finally { setBusy(false); }
  };
  const tab = name => { setSection(name); setStatus(''); window.scrollTo({top:0,behavior:'smooth'}); };
  const quizDone = lessonList.filter(lesson => lesson.quizPassed).length;
  const watched = lessonList.filter(lesson => lesson.watched).length;
  const videoMinutes = Math.ceil(lessonList.reduce((minutes, lesson) => minutes + lesson.durationSeconds / 60, 0));
  const quizMinutes = 30;
  const careerMinutes = 20;
  const codingMinutes = Math.max(0, 240 - videoMinutes - quizMinutes - careerMinutes);

  return <div className="min-h-screen bg-[#f5f7fc] text-slate-900 lg:flex">
    <aside className="shrink-0 bg-[#0d1730] px-4 py-6 text-white lg:min-h-screen lg:w-64 lg:px-5">
      <div className="mb-6 flex items-center gap-3 px-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400"><Sparkles size={22}/></span><div><h1 className="text-xl font-extrabold">AI SkillForge</h1><p className="text-[10px] font-bold tracking-widest text-indigo-300">ENGINEER PATH</p></div></div>
      <nav aria-label="AI Engineer Path" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">{nav.map(([id,label,Icon]) => <button type="button" key={id} onClick={()=>tab(id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition lg:w-full ${section===id?'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-800/20':'text-slate-400 hover:bg-white/10 hover:text-white'}`}><Icon size={18}/>{label}</button>)}</nav>
      <div className="mt-12 hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block"><GraduationCap size={23} className="text-indigo-300"/><p className="mt-3 text-sm font-bold">Your next career move</p><p className="mt-1 text-xs leading-5 text-slate-400">Study 4h daily. Ship projects. Build proof on GitHub.</p></div>
    </aside>
    <main className="min-w-0 flex-1 p-4 pb-24 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-[1470px]">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-medium text-slate-400">Learning <ChevronRight size={12} className="inline"/> AI Engineer Path <ChevronRight size={12} className="inline"/> <span className="text-slate-700">{nav.find(item=>item[0]===section)?.[1]}</span></p><h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{section==='dashboard'?'Good morning, Gowtham 👋':nav.find(item=>item[0]===section)?.[1]}</h2><p className="mt-1 text-sm text-slate-500">Your personalized AI Engineer journey · no paid quiz API needed</p></div><div className="flex flex-wrap items-center gap-2"><Badge><CalendarDays size={13}/> Starts 19 Oct 2026</Badge><Badge><Clock3 size={13}/>4 hours / day</Badge></div></header>
        {error && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><span>Could not load live learning data: {error}. The original dashboard is unchanged.</span><button onClick={load} className="rounded-lg bg-rose-100 px-3 py-2 font-bold">Retry</button></div>}
        {!data ? <Panel className="p-10 text-center"><span className="mx-auto block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"/><p className="mt-4 text-sm text-slate-500">Connecting to your AI Engineer Path…</p></Panel> : <>
          {section==='dashboard' && <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={Clock3} title="TODAY'S PLAN" value={`${day.studyMinutes} / 240 min`} sub="Start any time · 4-hour goal" tint="bg-indigo-100 text-indigo-600"/><Metric icon={BookOpen} title="VIDEOS IMPORTED" value={`${data.stats.watchedVideos} / ${data.stats.totalVideos}`} sub="Verified roadmap titles & durations" tint="bg-cyan-100 text-cyan-600"/><Metric icon={Flame} title="STUDY STREAK" value={`${data.stats.streak} days`} sub={`Consistency ${data.stats.consistencyRate}%`} tint="bg-orange-100 text-orange-600"/><Metric icon={Trophy} title="QUIZZES PASSED" value={`${data.stats.passedQuizzes}`} sub="5 questions for each video" tint="bg-emerald-100 text-emerald-600"/></div>
            <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(290px,1fr)]"><div className="space-y-4">
              <Panel className="p-5 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-extrabold tracking-widest text-indigo-600">START HERE · DAY {day.day} OF {data.totalDays}</p><h3 className="mt-1 text-xl font-extrabold">Today's learning</h3></div><button onClick={()=>tab('lessons')} className="flex items-center gap-1 text-xs font-bold text-indigo-700">View all lessons <ArrowRight size={14}/></button></div><p className="mb-4 text-sm text-slate-600">{day.topic}</p>
                {nextLesson ? <VideoLesson lesson={nextLesson} onChanged={load} onQuiz={chooseQuiz}/> : <div className="rounded-2xl bg-emerald-50 p-5"><CheckCircle2 className="text-emerald-600"/><h4 className="mt-2 font-bold">All videos in this study block are done!</h4><p className="text-sm text-slate-600">Finish coding and complete the day.</p></div>}
                <div className="mt-4 grid grid-cols-4 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center text-[11px] font-semibold text-slate-600">{[['1','Watch'],['2','Quiz'],['3','Code'],['4','Complete']].map(([n,name],i)=><div key={n}><span className={`mx-auto mb-1 grid h-8 w-8 place-items-center rounded-full ${i===0?'bg-indigo-600 text-white':'bg-slate-200 text-slate-600'}`}>{n}</span>{name}</div>)}</div>
              </Panel>
              <Panel className="p-5"><h3 className="text-lg font-bold">Today's 4-hour plan</h3><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{[[`${videoMinutes} min`,'Udemy lessons','bg-indigo-100 text-indigo-600',Play],[`${codingMinutes} min`,'Hands-on coding','bg-emerald-100 text-emerald-600',Code2],[`${quizMinutes} min`,'Quiz + review','bg-amber-100 text-amber-600',ListChecks],[`${careerMinutes} min`,'Job preparation','bg-blue-100 text-blue-600',BriefcaseBusiness]].map(([time,label,tint,Icon])=><div key={label} className="rounded-xl border border-slate-100 p-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${tint}`}><Icon size={18}/></span><p className="mt-3 text-sm font-extrabold">{time}</p><p className="text-xs text-slate-500">{label}</p></div>)}</div><p className="mt-3 text-xs text-slate-500">Video allocation uses the sum of imported video lengths for this day; other blocks fill the 240-minute target.</p></Panel>
              <Panel className="p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-indigo-600">TODAY'S CODING TASK</p><h3 className="mt-1 text-lg font-extrabold">{day.codeTask}</h3></div><Code2 size={26} className="text-indigo-500"/></div><p className="mt-2 text-xs text-slate-500">Practice this topic and commit working code to GitHub. Full project submissions are due at the end of each module.</p><button onClick={()=>tab('projects')} className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-700">See module projects <ArrowRight size={14}/></button></Panel>
            </div><div className="space-y-4"><Panel className="p-5"><h3 className="text-lg font-extrabold">After watching · Quick test</h3><p className="mt-1 text-xs text-slate-500">Every video has 5 free questions. Passing score 80%.</p><div className="mt-4"><QuizBox lesson={quizLesson} onChanged={load}/></div></Panel><FocusTimer day={day} onChanged={load}/></div></div>
            <Panel className="mt-5 p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-extrabold">Your study calendar</h3><button onClick={()=>tab('lessons')} className="text-xs font-bold text-indigo-700">All 50 days <ArrowRight size={13} className="inline"/></button></div><div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">{data.days.slice(Math.max(0, data.firstUnfinishedDay-1), Math.max(0, data.firstUnfinishedDay-1)+7).map(item=><button key={item.day} onClick={()=>chooseDay(item.day)} className={`rounded-xl border px-2 py-3 text-center ${item.day===day.day?'border-indigo-400 bg-indigo-50 text-indigo-700':'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><span className="block text-xs font-bold">Day {item.day}</span><span className="mt-1 block text-[11px]">{fmt(item.date)}</span><span className="mt-2 block text-[10px]">{item.completedAt?'Complete':item.day<=data.firstUnfinishedDay?'Available':'Planned'}</span></button>)}</div></Panel>
          </>}
          {section==='courses' && <div className="grid gap-4 md:grid-cols-2">{data.courses.map((course,index)=><Panel key={course.id} className="p-6"><div className="flex items-start justify-between"><span className={`grid h-14 w-14 place-items-center rounded-2xl ${index===0?'bg-emerald-100 text-emerald-700':'bg-indigo-100 text-indigo-700'}`}><BookOpen size={28}/></span><Badge>UDEMY ACCOUNT {course.account}</Badge></div><h3 className="mt-5 text-xl font-extrabold leading-7">{course.title}</h3><p className="mt-2 text-sm text-slate-500">Instructor: {course.instructor}</p><p className="mt-4 text-sm text-slate-700">{course.importedLectures} / {course.totalLectures} lecture entries included in the study plan</p><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{width:`${Math.round(course.importedLectures/course.totalLectures*100)}%`}}/></div><p className="mt-3 text-xs text-slate-500">Title/duration import is not an Udemy completion sync. Deep links require the individual lecture IDs.</p><a className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white" href={course.courseUrl} target="_blank" rel="noopener noreferrer">Open course on Udemy <ExternalLink size={16}/></a></Panel>)}</div>}
          {section==='lessons' && <div className="grid gap-4 xl:grid-cols-[285px_minmax(0,1fr)]"><Panel className="max-h-[650px] overflow-y-auto p-4"><h3 className="mb-3 text-sm font-extrabold text-slate-700">50 study blocks</h3><div className="space-y-1">{data.days.map(item=><button key={item.day} onClick={()=>{setSelectedDay(item.day);setQuizLessonId(null)}} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-xs ${day.day===item.day?'bg-indigo-100 font-bold text-indigo-800':'text-slate-600 hover:bg-slate-50'}`}><span className="min-w-0"><b className="mr-2">D{item.day}</b><span className="line-clamp-1">{item.topic}</span></span>{item.completedAt?<CheckCircle2 size={16} className="shrink-0 text-emerald-600"/>:item.day>data.firstUnfinishedDay?<LockKeyhole size={13} className="shrink-0 text-slate-400"/>:null}</button>)}</div></Panel><div className="space-y-4"><Panel className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><Badge>DAY {day.day} · {fmt(day.date)}</Badge><h3 className="mt-2 text-xl font-extrabold">{day.topic}</h3><p className="mt-1 text-sm text-slate-500">{watched}/{lessonList.length} watched · {quizDone}/{lessonList.length} quizzes passed · {asTime(day.studyMinutes)}/4h</p></div>{day.completedAt?<Badge variant="green">COMPLETE</Badge>:!isUnlocked?<Badge variant="amber">LOCKED</Badge>:null}</div></Panel>
                {!isUnlocked?<Panel className="p-6 text-center"><LockKeyhole className="mx-auto text-slate-400"/><p className="mt-2 text-sm">Submit the previous day first to open these lessons.</p></Panel>:<>{lessonList.length ? lessonList.map(item=><VideoLesson key={item.id} lesson={item} onChanged={load} onQuiz={chooseQuiz}/>):<Panel className="p-6"><h3 className="font-bold">Capstone / Career Preparation</h3><p className="mt-2 text-sm text-slate-500">No new Udemy videos scheduled. Focus on the project, portfolio and interview practice.</p></Panel>}
                  <Panel className="p-5"><h3 className="font-bold">Coding task: {day.codeTask}</h3><p className="mt-2 text-xs text-slate-500">Use the 4-hour focus timer on Dashboard, complete every free quiz and upload the end-of-module project.</p><button onClick={()=>tab('dashboard')} className="mt-4 rounded-lg bg-indigo-100 px-3 py-2 text-xs font-bold text-indigo-700">Open focus timer</button></Panel>
                  {moduleEnd && <><ModuleFinalTest module={moduleEnd} currentDay={data.firstUnfinishedDay} onChanged={load}/><ProjectForm module={moduleEnd} currentDay={data.firstUnfinishedDay} onChanged={load}/></>}
                  <Panel className="p-5"><h3 className="text-lg font-extrabold">Finish Day {day.day}</h3><p className="mt-2 text-xs text-slate-500">Required: all videos marked watched, all quizzes passed ≥80%, 240 focus minutes, plus the final test and project at a module boundary. The next 4-hour block unlocks immediately.</p>{status && <p className="mt-3 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800">{status}</p>}<button disabled={busy || Boolean(day.completedAt)} onClick={completeDay} className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white disabled:opacity-40"><CheckCircle2 size={18}/>{busy?'Checking…':day.completedAt?'Day completed ✓':'Submit day & unlock next 4 hours'}</button></Panel>
                </>}
              </div></div>}
          {section==='quizzes' && <div className="grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)]"><Panel className="p-4"><h3 className="text-lg font-bold">Day {day.day} video tests</h3><p className="mb-4 mt-1 text-xs text-slate-500">{quizDone} of {lessonList.length} passed</p>{lessonList.map(item=><button key={item.id} onClick={()=>setQuizLessonId(item.id)} className={`mb-2 flex w-full items-start gap-2 rounded-xl border p-3 text-left text-xs ${quizLesson?.id===item.id?'border-indigo-300 bg-indigo-50':'border-slate-100 hover:bg-slate-50'}`}>{item.quizPassed?<CheckCircle2 className="shrink-0 text-emerald-600" size={17}/>:item.watched?<CircleHelp className="shrink-0 text-indigo-600" size={17}/>:<LockKeyhole className="shrink-0 text-slate-400" size={17}/>}<span>{item.title}</span></button>)}</Panel><Panel className="p-5 sm:p-7">{quizLesson && <div className="mb-4 border-b border-slate-100 pb-4"><p className="text-xs text-indigo-600">{quizLesson.course}</p><h3 className="mt-1 text-lg font-bold">{quizLesson.title}</h3></div>}<QuizBox lesson={quizLesson} onChanged={load}/></Panel></div>}
          {section==='projects' && <div className="grid gap-4 lg:grid-cols-2">{data.modules.map(item=><div key={item.id} className="space-y-4"><ProjectForm module={item} currentDay={data.firstUnfinishedDay} onChanged={load}/><ModuleFinalTest module={item} currentDay={data.firstUnfinishedDay} onChanged={load}/></div>)}</div>}
          {section==='career' && <div className="grid gap-4 lg:grid-cols-2"><Panel className="p-6"><BriefcaseBusiness className="text-indigo-600" size={34}/><h3 className="mt-4 text-xl font-extrabold">AI Engineer job-readiness</h3><p className="mt-2 text-sm leading-6 text-slate-600">Spend 20 minutes per study day preparing your GitHub, resume, architecture explanations and interview answers.</p><div className="mt-5 space-y-3">{['Write a 2-minute walkthrough of today’s concept','Commit code with a useful README and setup instructions','Explain one trade-off, failure case and test','Prepare Python, SQL, ML, RAG and agent interview examples'].map((x,i)=><div key={x} className="flex items-center gap-3 text-sm text-slate-600"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{i+1}</span>{x}</div>)}</div></Panel><Panel className="p-6"><Rocket size={34} className="text-emerald-600"/><h3 className="mt-4 text-xl font-extrabold">Portfolio finish line</h3><p className="mt-2 text-sm leading-6 text-slate-600">Days 48–50: integrate a capstone, add tests and deployment, publish a demo video, then complete a mock technical interview.</p><button onClick={()=>chooseDay(48)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white">View capstone days <ArrowRight size={16}/></button></Panel></div>}
          {section==='progress' && <div className="grid gap-4 lg:grid-cols-2"><Panel className="p-6"><h3 className="text-xl font-extrabold">Journey progress</h3><p className="mt-4 text-4xl font-black text-indigo-700">{Math.round(data.stats.completedDays/data.totalDays*100)}%</p><p className="mt-1 text-sm text-slate-500">{data.stats.completedDays} of {data.totalDays} study days finished</p><div className="mt-4 h-3 rounded-full bg-indigo-100"><div className="h-3 rounded-full bg-indigo-600" style={{width:`${data.stats.completedDays/data.totalDays*100}%`}}/></div><div className="mt-6 grid grid-cols-2 gap-4"><div><p className="text-2xl font-extrabold">{data.stats.streak}</p><p className="text-xs text-slate-500">Consecutive calendar days</p></div><div><p className="text-2xl font-extrabold">{data.stats.consistencyRate}%</p><p className="text-xs text-slate-500">Scheduled-day completion rate</p></div></div></Panel><Panel className="p-6"><h3 className="text-xl font-extrabold">Video mastery</h3><p className="mt-2 text-sm text-slate-500">Videos watched and their checkpoint tests</p><div className="mt-5 space-y-5">{data.courses.map(course=>{const selected=allVideos.filter(v=>v.courseId===course.id);const passed=selected.filter(v=>v.quizPassed).length;return <div key={course.id}><div className="flex items-center justify-between gap-3 text-xs"><span className="font-bold">{course.title}</span><span className="shrink-0 text-slate-500">{passed}/{selected.length}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{width:`${selected.length?passed/selected.length*100:0}%`}}/></div></div>})}</div></Panel></div>}
          {section==='alerts' && <div className="grid gap-4 lg:grid-cols-2"><Panel className="p-6"><Bell size={32} className="text-indigo-600"/><h3 className="mt-4 text-xl font-extrabold">Study reminders at 9:00 PM IST</h3><p className="mt-2 text-sm leading-6 text-slate-600">Your alert time is 9 PM. Your study start is flexible: start, pause or resume the focus timer whenever you want. Brave needs HTTPS, notification permission, a service worker and configured server push keys.</p><div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">Browser notifications may be delayed or blocked by device settings or a sleeping free-tier server. Enabling a reminder does not guarantee delivery.</div></Panel><div className="rounded-xl bg-[#0e172e] text-white"><NotificationSettings mode="path"/></div></div>}
        </>}
      </div>
    </main>
  </div>;
}
