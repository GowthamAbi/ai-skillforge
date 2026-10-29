import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, CheckCircle2, ChevronDown, ChevronRight, Circle, Code2, ClipboardCheck, Clock3, FolderOpen, Lightbulb, ListChecks, PanelLeftClose, RotateCcw, Target } from 'lucide-react';
import { api } from '../api/api';
import { AI_PHASES, flattenTopics } from '../data/aiRoadmap';

const STAGES = [
  { id:'concept', title:'Concept learning', time:'20–30 நிமிடங்கள்', description:'தமிழில் theory, English technical terms, diagrams மற்றும் அடிப்படை examples.', icon:BookOpen },
  { id:'coding', title:'Coding practice', time:'20–30 நிமிடங்கள்', description:'Code-ஐ நீங்களே எழுதுங்கள்; output-ஐப் புரிந்துகொண்டு மாற்றிப் பாருங்கள்.', icon:Code2 },
  { id:'task', title:'Task and problem solving', time:'20–30 நிமிடங்கள்', description:'Easy → Medium → Practical task; hint பார்த்து முயற்சி செய்து test செய்யுங்கள்.', icon:Target },
  { id:'revision', title:'Revision and assessment', time:'10–20 நிமிடங்கள்', description:'Quiz, mistakes notebook மற்றும் previous lesson revision.', icon:ClipboardCheck }
];
const LESSON_HINTS = {
  'Python Programming':'இந்த topic-ஐ முதலில் சிறிய input/output உதாரணத்துடன் புரிந்துகொண்டு, பின்னர் code-ஐ மாற்றிப் பாருங்கள்.',
  'Mathematics for AI':'Formula-வை மனப்பாடம் செய்வதைவிட, சிறிய numbers-ஐ வைத்து கையால் கணக்கிட்டு Python-ல் சரிபாருங்கள்.',
  'Data Analysis and Tools':'ஒரு சிறிய table அல்லது dataset எடுத்துக்கொண்டு, data-ஐ inspect செய்து result-ஐ விளக்குங்கள்.',
  'Machine Learning':'Features, target, training data மற்றும் prediction இடையிலான தொடர்பை நடைமுறை dataset-ல் கண்டறியுங்கள்.',
  'Deep Learning':'Input, weights, output, loss மற்றும் training ஆகியவற்றின் flow-ஐ diagram-ஆக வரைந்து பாருங்கள்.',
  'NLP (Natural Language Processing)':'ஒரு சிறிய sentence-ஐ எடுத்துக்கொண்டு, text எப்படி tokens அல்லது features ஆக மாறுகிறது என்பதைப் பாருங்கள்.',
  'Generative AI (GenAI)':'Prompt, model output, context மற்றும் answer quality-ஐ ஒப்பிட்டு, தவறான பதில்களைச் சரிபாருங்கள்.',
  'AI Engineering':'இந்த concept-ஐ production application-ல் எப்படி integrate, test, secure மற்றும் monitor செய்வீர்கள் என்று சிந்தியுங்கள்.',
  'Advanced Specialization and Capstone':'இந்த lesson-ஐ உங்கள் capstone project-இல் இணைக்க ஒரு சிறிய, test செய்யக்கூடிய feature-ஆக மாற்றுங்கள்.'
};
const EXAMPLE_BY_GROUP = {
  python:'உதாரணம்: production quantity-ஐ input கொடுத்து, மொத்தம், average அல்லது target-ஐ அடைந்ததா எனக் கணக்கிடும் சிறிய script.',
  math:'உதாரணம்: தினசரி production quantity-யின் average, variation அல்லது இரண்டு variables இடையேயான தொடர்பைக் கணக்கிடுதல்.',
  data:'உதாரணம்: production CSV-ல் missing values, duplicates, daily totals மற்றும் rejection rate-ஐக் கண்டுபிடித்தல்.',
  mlfund:'உதாரணம்: கடந்த machine breakdown மற்றும் maintenance data-ஐப் பயன்படுத்தி breakdown risk-ஐ estimate செய்தல்.',
  supervised:'உதாரணம்: temperature, machine age, shift போன்ற features-ல் இருந்து breakdown / no-breakdown classification செய்தல்.',
  unsupervised:'உதாரணம்: rejection pattern ஒத்த production records-ஐ குழுக்களாகப் பிரித்தல்.',
  mleval:'உதாரணம்: prediction முடிவை actual result-உடன் ஒப்பிட்டு error மற்றும் precision/recall-ஐக் கணக்கிடுதல்.',
  nn:'உதாரணம்: input features-க்கு weights கொடுத்து output கணக்கிட்டு, loss குறைய weights update ஆகும் முறையைப் புரிந்துகொள்ளுதல்.',
  frameworks:'உதாரணம்: சிறிய tensor உருவாக்கி shape, operation, gradient மற்றும் model training steps-ஐப் பாருங்கள்.',
  architectures:'உதாரணம்: elastic surface image-இல் normal / defective pattern அறிதல் அல்லது sentence sequence-ஐ process செய்தல்.',
  text:'உதாரணம்: “delivery delayed” போன்ற sentence-ஐ tokens ஆகப் பிரித்து, normalized text-ஐ ஒப்பிடுதல்.',
  nlptasks:'உதாரணம்: customer feedback-ஐ positive, neutral, negative என வகைப்படுத்துதல்.',
  modernnlp:'உதாரணம்: ஒரே prompt-ஐ encoder / decoder style models எவ்வாறு handle செய்கின்றன என்பதை ஒப்பிடுதல்.',
  genfund:'உதாரணம்: ஒரே input-க்கு prompt/context மாறும்போது generated answer எப்படி மாறுகிறது எனப் பாருங்கள்.',
  prompt:'உதாரணம்: “explain AI” என்ற vague prompt-ஐ role, context, constraints மற்றும் output format சேர்த்து மேம்படுத்துதல்.',
  apis:'உதாரணம்: backend-இல் API request அனுப்பி response, error handling மற்றும் usage cost-ஐ log செய்தல்.',
  rag:'உதாரணம்: உங்களுடைய syllabus PDF-ஐ chunks செய்து, தொடர்புடைய chunk-ஐ retrieve செய்து grounded answer உருவாக்குதல்.',
  finetune:'உதாரணம்: prompting, RAG, fine-tuning ஆகியவற்றில் எது ஒரு குறிப்பிட்ட use case-க்கு ஏற்றது என்று ஒப்பிடுதல்.',
  agents:'உதாரணம்: task-ஐ திட்டமிட்டு tool call செய்து, முக்கியமான செயலை user approval-க்கு நிறுத்தும் assistant.',
  software:'உதாரணம்: input validation, error handling மற்றும் automated tests கொண்ட API endpoint உருவாக்குதல்.',
  architecture:'உதாரணம்: frontend → backend → model API → database flow-ஐ diagram-ஆக அமைத்தல்.',
  quality:'உதாரணம்: 10 representative questions கொண்ட evaluation set உருவாக்கி answer correctness மற்றும் privacy-ஐச் சோதித்தல்.',
  deploy:'உதாரணம்: environment variables பயன்படுத்தி application deploy செய்து health check மற்றும் logs சரிபார்த்தல்.',
  advancedeng:'உதாரணம்: latency, cost மற்றும் quality-ஐ அளந்து fallback / caching சேர்ப்பது எப்போது பொருத்தம் என முடிவு செய்தல்.',
  research:'உதாரணம்: paper-இல் உள்ள problem, method, dataset, baseline, metric மற்றும் limitation-ஐ ஒரு பக்கத்தில் சுருக்குதல்.',
  capstone:'உதாரணம்: LinguaPro AI Speaking Coach-ல் transcription → correction → feedback → history → revision workflow-ஐ இணைத்தல்.'
};

function getTopicRecord(progress, id) { return progress?.[id] || { completedStages:[], completed:false }; }
function pct(n,d) { return d ? Math.round(n / d * 100) : 0; }
function Bar({ value }) { return <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all" style={{width:`${value}%`}}/></div>; }

export default function AIRoadmap() {
  const allTopics = useMemo(() => flattenTopics(), []);
  const [progress, setProgress] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [phaseOpen, setPhaseOpen] = useState('p1');
  const [groupOpen, setGroupOpen] = useState('python');
  const [sectionOpen, setSectionOpen] = useState('Python Basics');
  const [selectedId, setSelectedId] = useState(allTopics[0]?.id || '');
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [code, setCode] = useState('production_quantity = [120, 135, 128, 142, 130]\n\naverage = sum(production_quantity) / len(production_quantity)\nprint("Average production:", average)');
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const load = useCallback(async () => {
    try {
      const result = await api('/path/roadmap-progress', { pathApi:true });
      setProgress(result.progress || {});
      setNotice('');
    } catch (error) {
      setNotice(`Progress server-ல் load ஆகவில்லை: ${error.message}. இந்த branch-ல் backend இணைப்பு deploy செய்யப்பட்ட பிறகு மீண்டும் முயற்சிக்கவும்.`);
    } finally { setLoaded(true); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const topic = allTopics.find(item => item.id === selectedId) || allTopics[0];
  useEffect(() => { if (topic) setCode(['# Topic: ' + topic.title, '# Write a small example that demonstrates this concept.', '', 'def main():', '    # TODO: implement and test this concept', '    pass', '', 'if __name__ == "__main__":', '    main()'].join(String.fromCharCode(10))); }, [selectedId]);
  const topicRecord = topic ? getTopicRecord(progress, topic.id) : {completedStages:[],completed:false};
  const allDone = allTopics.filter(t => getTopicRecord(progress,t.id).completed).length;
  const overallPct = pct(allDone, allTopics.length);
  const phaseStats = useMemo(() => Object.fromEntries(AI_PHASES.map(phase => {
    const topics = phase.groups.flatMap(g => g.sections.flatMap(s => s.topics.map(title => allTopics.find(t => t.phaseId===phase.id && t.groupId===g.id && t.sectionTitle===s.title && t.title===title)).filter(Boolean)));
    const done = topics.filter(t => getTopicRecord(progress,t.id).completed).length;
    return [phase.id, {total:topics.length,done,percent:pct(done,topics.length)}];
  })), [allTopics, progress]);
  const groupTopics = groupOpen ? allTopics.filter(t=>t.groupId===groupOpen) : [];
  const stageToggle = async (stageId) => {
    if (!topic) return;
    const previous = topicRecord.completedStages || [];
    const next = previous.includes(stageId) ? previous.filter(s=>s!==stageId) : [...previous,stageId];
    const completed = STAGES.every(stage => next.includes(stage.id)) && quizSubmitted;
    await saveTopic(topic.id, next, completed);
  };
  const saveTopic = async (topicId, completedStages, completed) => {
    setSaving(true); setNotice('');
    try {
      const result = await api(`/path/roadmap-progress/${encodeURIComponent(topicId)}`, {
        method:'PATCH', pathApi:true,
        body:JSON.stringify({completedStages, completed})
      });
      setProgress(old=>({...old,[topicId]:result.record}));
      setNotice(result.message || 'Progress saved.');
    } catch (error) {
      setNotice(`Progress save ஆகவில்லை: ${error.message}. Backend deployment / API route சரிபார்க்கவும்.`);
    } finally { setSaving(false); }
  };
  const chooseTopic = (item) => {
    setSelectedId(item.id); setActiveView('lesson'); setMobileMenu(false); setCheckedQuestions({}); setQuizSubmitted(false);
    const phase = AI_PHASES.find(p=>p.id===item.phaseId);
    setPhaseOpen(phase?.id || 'p1'); setGroupOpen(item.groupId); setSectionOpen(item.sectionTitle);
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const showDashboard = () => { setActiveView('dashboard'); setMobileMenu(false); window.scrollTo({top:0,behavior:'smooth'}); };
  const quizOptions = [
    {q:'இந்த topic-ஐ உண்மையாகப் புரிந்துகொள்ள சிறந்த வழி எது?', options:['Definition மட்டும் மனப்பாடம் செய்வது','Example-ஐ முயன்று, result-ஐ விளக்கி, மாற்றிப் பார்ப்பது','Code copy செய்து run செய்யாமல் இருப்பது'], answer:1},
    {q:'Coding practice முடிந்த பிறகு என்ன செய்ய வேண்டும்?', options:['Output-ஐப் புரிந்துகொண்டு code-ஐ மாற்றிச் சோதிக்க வேண்டும்','Output-ஐப் பார்க்காமல் அடுத்த topic-க்கு செல்ல வேண்டும்','Code-ஐ save செய்யாமல் மூட வேண்டும்'],answer:0},
    {q:'ஒரு quiz-ல் தவறு செய்தால்?', options:['தவறை மறந்து விட வேண்டும்','Mistake-ஐ note செய்து concept-ஐ revise செய்து மீண்டும் முயற்சிக்க வேண்டும்','Lesson-ஐ முழுவதும் skip செய்ய வேண்டும்'],answer:1}
  ];
  const submitQuiz = () => {
    setQuizSubmitted(true);
    setNotice(quizOptions.every((q,i)=>checkedQuestions[i]===q.answer) ? 'Quiz சரியாக முடிந்தது. Revision stage-ஐ முடித்து topic-ஐ complete செய்யலாம்.' : 'Quiz-ல் சில பதில்கள் தவறு. Correct answers-ஐப் பார்த்து lesson-ஐ revise செய்து மீண்டும் முயற்சிக்கவும்.');
  };
  const finishTopic = async () => {
    const stages = STAGES.map(stage=>stage.id);
    if (!STAGES.every(stage => topicRecord.completedStages.includes(stage.id))) {
      setNotice('முதலில் Concept, Coding, Task, Revision ஆகிய நான்கு stages-ஐ தனித்தனியாக complete செய்யுங்கள்.');
      return;
    }
    if (!quizSubmitted || !quizOptions.every((q,i)=>checkedQuestions[i]===q.answer)) {
      setNotice('Topic complete செய்ய, 3-question checkpoint-ஐ சரியாக முடிக்க வேண்டும்.');
      return;
    }
    await saveTopic(topic.id, stages, true);
  };

  return <div className="min-h-screen bg-[#f5f3ff] text-slate-900 lg:flex">
    <aside className={`${mobileMenu?'block':'hidden'} fixed inset-0 z-40 overflow-y-auto bg-[#15102d] px-3 py-4 text-white lg:static lg:block lg:min-h-screen lg:w-[305px] lg:shrink-0 lg:px-4 lg:py-5`}>
      <div className="mb-5 flex items-center justify-between gap-2 px-1"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500"><BrainCircuit size={23}/></span><div><h1 className="text-lg font-extrabold">AI Roadmap</h1><p className="text-[10px] font-bold tracking-widest text-violet-300">7 PHASE · MASTER SYLLABUS</p></div></div><button onClick={()=>setMobileMenu(false)} className="rounded-lg p-2 hover:bg-white/10 lg:hidden" aria-label="Close menu"><PanelLeftClose size={19}/></button></div>
      <button onClick={showDashboard} className={`mb-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold ${activeView==='dashboard'?'bg-violet-600 text-white':'text-slate-300 hover:bg-white/10'}`}><Activity size={18}/> Dashboard <span className="ml-auto text-xs">{overallPct}%</span></button>
      <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between text-xs"><span className="font-semibold text-slate-300">Overall completion</span><b>{overallPct}%</b></div><div className="mt-2"><div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-indigo-300" style={{width:`${overallPct}%`}}/></div></div><p className="mt-2 text-[11px] text-slate-400">{allDone} / {allTopics.length} topics completed</p></div>
      <div className="space-y-2">
        {AI_PHASES.map(phase=><div key={phase.id} className="rounded-xl border border-white/10 bg-white/[.025]">
          <button onClick={()=>setPhaseOpen(old=>old===phase.id?'':phase.id)} className="flex w-full items-start gap-2 px-3 py-3 text-left hover:bg-white/5"><span className="mt-0.5 text-violet-300">{phaseOpen===phase.id?<ChevronDown size={16}/>:<ChevronRight size={16}/>}</span><span className="min-w-0 flex-1"><span className="block text-xs font-bold leading-5">{phase.title}</span><span className="mt-1 block text-[10px] text-slate-400">{phaseStats[phase.id]?.done}/{phaseStats[phase.id]?.total} topics · {phaseStats[phase.id]?.percent}%</span><span className="mt-2 block"><div className="h-1 rounded-full bg-white/10"><div className="h-1 rounded-full bg-violet-400" style={{width:`${phaseStats[phase.id]?.percent||0}%`}}/></div></span></span></button>
          {phaseOpen===phase.id&&<div className="space-y-1 px-2 pb-2">{phase.groups.map(group=><div key={group.id}>
            <button onClick={()=>{setGroupOpen(old=>old===group.id?'':group.id);setSectionOpen(group.sections[0]?.title||'');setActiveView('dashboard')}} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold ${groupOpen===group.id?'bg-violet-500/20 text-violet-100':'text-slate-300 hover:bg-white/5'}`}><FolderOpen size={14} className="shrink-0"/><span className="flex-1">{group.title}</span>{groupOpen===group.id?<ChevronDown size={13}/>:<ChevronRight size={13}/>}</button>
            {groupOpen===group.id&&<div className="ml-3 border-l border-white/15 pl-2">{group.sections.map(section=><div key={section.title}>
              <button onClick={()=>{setSectionOpen(old=>old===section.title?'':section.title);setActiveView('dashboard')}} className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] font-bold text-slate-300 hover:bg-white/5"><ChevronRight size={11}/><span className="flex-1">{section.title}</span></button>
              {sectionOpen===section.title&&<div className="space-y-0.5 pb-1">{section.topics.map((title,index)=>{const item=allTopics.find(t=>t.phaseId===phase.id&&t.groupId===group.id&&t.sectionTitle===section.title&&t.title===title);const isDone=item&&getTopicRecord(progress,item.id).completed;return <button key={title} onClick={()=>item&&chooseTopic(item)} className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-[11px] leading-4 ${selectedId===item?.id&&activeView==='lesson'?'bg-violet-500/25 text-white':'text-slate-400 hover:bg-white/5 hover:text-white'}`}>{isDone?<CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-300"/>:<Circle size={12} className="mt-0.5 shrink-0 opacity-60"/>}<span>{index+1}. {title}</span></button>})}</div>}
            </div>)}</div>}
          </div>)}</div>}
        </div>)}
      </div>
      <div className="mt-5 rounded-xl bg-indigo-500/10 p-3 text-[11px] leading-5 text-slate-400">Learn → Practice → Solve → Revise. ஒரு topic-ஐ complete செய்த பிறகே progress update ஆகும்.</div>
    </aside>
    <main className="min-w-0 flex-1 px-3 pb-10 pt-4 sm:px-6 sm:py-7 xl:px-9">
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3"><div className="flex items-start gap-2"><button onClick={()=>setMobileMenu(true)} className="mt-1 rounded-lg border border-violet-100 bg-white p-2 text-violet-700 lg:hidden" aria-label="Open syllabus menu"><BookOpen size={18}/></button><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-violet-600">AI SkillForge / AI Roadmap</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{activeView==='dashboard'?'Your AI learning roadmap':topic?.title}</h2><p className="mt-1 text-sm text-slate-500">{activeView==='dashboard'?'முழு syllabus-ல் pending, in progress மற்றும் completed topics.':'தமிழில் கற்று, code செய்து, task செய்து, உங்கள் progress-ஐ பதிவு செய்யுங்கள்.'}</p></div></div><button onClick={showDashboard} className="flex items-center gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2 text-xs font-bold text-violet-800 hover:bg-violet-50"><ArrowLeft size={15}/> Dashboard</button></header>
        {notice&&<div role="status" className="mb-5 rounded-xl border border-violet-100 bg-white px-4 py-3 text-xs leading-5 text-violet-900">{notice}</div>}
        {!loaded?<div className="rounded-2xl bg-white p-8 text-sm text-slate-500">Loading roadmap progress…</div>:activeView==='dashboard'?<>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Activity} label="OVERALL PROGRESS" value={`${overallPct}%`} note={`${allDone} / ${allTopics.length} topics completed`}/>
            <Metric icon={BookOpen} label="TOTAL TOPICS" value={allTopics.length} note="7 phases · full curriculum"/>
            <Metric icon={Clock3} label="PENDING TOPICS" value={allTopics.length-allDone} note="இன்னும் கற்க வேண்டியவை"/>
            <Metric icon={CheckCircle2} label="COMPLETED PHASES" value={AI_PHASES.filter(p=>phaseStats[p.id]?.percent===100).length} note="எல்லா topics-யும் complete"/>
          </div>
          <section className="mt-5 rounded-2xl bg-gradient-to-br from-[#22164b] via-[#352071] to-[#4c35a4] p-5 text-white shadow-lg sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[.2em] text-violet-200">CONTINUE YOUR JOURNEY</p><h3 className="mt-2 text-2xl font-black">AI-ஐ அடிப்படையிலிருந்து கற்றுக்கொள்வோம்.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100/80">ஒவ்வொரு lesson-லும் concept, practical code, problem-solving task மற்றும் revision இருக்கும். Progress topic-wise கணக்கிடப்படும்.</p></div><span className="rounded-2xl bg-white/10 p-3"><BrainCircuit size={35}/></span></div><button onClick={()=>chooseTopic(allTopics.find(t=>!getTopicRecord(progress,t.id).completed)||allTopics[0])} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-violet-900 hover:bg-violet-100">Continue next pending topic <ArrowRight size={16}/></button></section>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">{AI_PHASES.map(phase=><section key={phase.id} className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-600">{phase.duration||'Learning phase'}</p><h3 className="mt-1 text-lg font-extrabold">{phase.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{phase.description}</p></div><span className="text-xl font-black text-violet-700">{phaseStats[phase.id]?.percent||0}%</span></div><div className="mt-3"><Bar value={phaseStats[phase.id]?.percent||0}/></div><p className="mt-2 text-xs text-slate-500">{phaseStats[phase.id]?.done||0} completed · {(phaseStats[phase.id]?.total||0)-(phaseStats[phase.id]?.done||0)} pending</p><div className="mt-4 space-y-2">{phase.groups.map(group=><button key={group.id} onClick={()=>{setPhaseOpen(phase.id);setGroupOpen(group.id);setSectionOpen(group.sections[0]?.title||'');setActiveView('dashboard');setMobileMenu(true)}} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 text-left hover:border-violet-200 hover:bg-violet-50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-violet-700"><BookOpen size={15}/></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold">{group.title}</span><span className="mt-0.5 block text-[10px] text-slate-500">{group.sections.length} subheadings</span></span><ChevronRight size={15} className="text-slate-400"/></button>)}</div></section>)}</div>
        </>:topic&&<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(285px,1fr)]">
          <div className="space-y-4">
            <section className="rounded-2xl bg-gradient-to-r from-[#211548] to-[#45308d] p-5 text-white sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-violet-200">{topic.phaseTitle}</p><p className="mt-2 text-xs text-violet-200">{topic.groupTitle} / {topic.sectionTitle}</p><h3 className="mt-2 text-2xl font-black">{topic.title}</h3><p className="mt-3 text-sm leading-6 text-violet-100/90">{LESSON_HINTS[topic.groupTitle]||'Concept-ஐ சிறிய example, coding practice மற்றும் real-world task மூலம் புரிந்துகொள்ளுங்கள்.'}</p><div className="mt-5 flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">4 learning stages</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">{topicRecord.completedStages.length}/4 stages done</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">{topicRecord.completed?'Completed':'In progress'}</span></div></section>
            <section className="rounded-2xl border border-violet-100 bg-white p-5"><div className="flex items-center gap-2"><Lightbulb size={19} className="text-amber-500"/><h3 className="font-extrabold">1. Concept learning · தமிழில்</h3></div><p className="mt-3 text-sm leading-7 text-slate-700">இன்றைய topic <b>{topic.title}</b>. முதலில் இதன் நோக்கம் என்ன, எந்த input கிடைக்கிறது, என்ன output எதிர்பார்க்கிறோம், எந்த real-world problem-ஐ தீர்க்கிறது என்று உங்கள் சொற்களில் எழுதுங்கள்.</p><div className="mt-3 rounded-xl bg-violet-50 p-4 text-sm leading-6 text-violet-950"><b>நடைமுறை உதாரணம்:</b> {EXAMPLE_BY_GROUP[topic.groupId]||'உங்கள் வேலை அல்லது அன்றாட வாழ்க்கையில் இந்த concept பயன்படும் ஒரு example-ஐத் தேர்ந்தெடுத்து, input → process → output என்று பிரித்துப் பாருங்கள்.'}</div><p className="mt-3 text-xs leading-5 text-slate-500">Learning note: இது topic-க்கான guided study scaffold. ஒவ்வொரு topic-க்கும் முழுமையான தனிப்பட்ட theory article இன்னும் எழுதப்படவில்லை; இந்த page-ல் நீங்கள் குறிப்புகள் சேர்த்துப் படிக்கலாம்.</p><StageButton stage={STAGES[0]} completed={topicRecord.completedStages.includes('concept')} saving={saving} onClick={()=>stageToggle('concept')}/></section>
            <section className="rounded-2xl border border-violet-100 bg-white p-5"><div className="flex items-center gap-2"><Code2 size={19} className="text-indigo-600"/><h3 className="font-extrabold">2. Coding practice</h3></div><p className="mt-2 text-sm leading-6 text-slate-600">கீழே topic-க்கான practice workspace உள்ளது. உங்கள் concept-க்கு ஏற்ற code எழுதுங்கள்; output-ஐ Python environment / Google Colab-ல் run செய்து சரிபாருங்கள்.</p><textarea value={code} onChange={e=>setCode(e.target.value)} spellCheck={false} className="mt-3 min-h-44 w-full rounded-xl border border-slate-200 bg-[#111827] p-4 font-mono text-xs leading-6 text-emerald-100 outline-none focus:border-violet-400"/><button onClick={()=>{navigator.clipboard?.writeText(code);setNotice('Code copied. Google Colab அல்லது Python editor-ல் run செய்யுங்கள்.')}} className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Copy code</button><div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><b>Expected output:</b><p className="mt-1">TODO பகுதிகளை நீங்கள் எழுதும் விதத்தைப் பொறுத்து output மாறும். Run செய்து actual result-ஐ note செய்யுங்கள்.</p><span className="mt-2 block">Code explanation: function-க்குள் உங்கள் implementation எழுதுங்கள்; main guard மூலம் file நேரடியாக run செய்யப்படும் போது main() அழைக்கப்படும். இந்த starter template மட்டும் topic-specific solution அல்ல.</span></div><StageButton stage={STAGES[1]} completed={topicRecord.completedStages.includes('coding')} saving={saving} onClick={()=>stageToggle('coding')}/></section>
            <section className="rounded-2xl border border-violet-100 bg-white p-5"><div className="flex items-center gap-2"><Target size={19} className="text-emerald-600"/><h3 className="font-extrabold">3. Task and problem solving</h3></div><p className="mt-3 text-sm leading-7 text-slate-700"><b>Task:</b> {topic.title} concept-ஐப் பயன்படுத்தி, உங்கள் சொந்த input-இல் ஒரு சிறிய program / calculation / workflow உருவாக்குங்கள். Output-ஐ manually verify செய்யுங்கள்.</p><div className="mt-3 space-y-2 text-xs leading-5 text-slate-600">{['Easy: concept-ஐ விளக்கும் மிகச் சிறிய example உருவாக்கவும்.','Medium: இரண்டு edge cases சேர்த்து output சரிபார்க்கவும்.','Practical: elastic production, breakdown, rejection அல்லது delivery data-வில் பயன்படுத்தவும்.'].map(item=><div key={item} className="flex gap-2 rounded-lg bg-slate-50 p-3"><Check size={14} className="mt-0.5 shrink-0 text-violet-600"/>{item}</div>)}</div><StageButton stage={STAGES[2]} completed={topicRecord.completedStages.includes('task')} saving={saving} onClick={()=>stageToggle('task')}/></section>
            <section className="rounded-2xl border border-violet-100 bg-white p-5"><div className="flex items-center gap-2"><RotateCcw size={19} className="text-amber-600"/><h3 className="font-extrabold">4. Revision and assessment</h3></div><p className="mt-2 text-sm leading-6 text-slate-600">ஒவ்வொரு கேள்விக்கும் ஒரு பதிலைத் தேர்வு செய்து quiz முடிக்கவும். எல்லா கேள்விகளுக்கும் சரியான பதில் தேவை.</p>{quizOptions.map((q,i)=><fieldset key={q.q} className="mt-4 border-t border-slate-100 pt-3"><legend className="text-sm font-bold leading-6">{i+1}. {q.q}</legend><div className="mt-2 space-y-2">{q.options.map((option,j)=><label key={option} className={`flex cursor-pointer gap-2 rounded-lg border p-2.5 text-xs ${checkedQuestions[i]===j?'border-violet-400 bg-violet-50':'border-slate-200'}`}><input type="radio" name={`quiz-${topic.id}-${i}`} checked={checkedQuestions[i]===j} onChange={()=>{setCheckedQuestions(old=>({...old,[i]:j}));setQuizSubmitted(false)}} className="accent-violet-600"/>{option}</label>)}</div>{quizSubmitted&&<p className={`mt-2 text-xs font-semibold ${checkedQuestions[i]===q.answer?'text-emerald-700':'text-rose-600'}`}>{checkedQuestions[i]===q.answer?'சரியான பதில் ✓':`சரியான பதில்: ${q.options[q.answer]}`}</p>}</fieldset>)}<button onClick={submitQuiz} disabled={Object.keys(checkedQuestions).length!==quizOptions.length} className="mt-4 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-40">Submit checkpoint quiz</button><StageButton stage={STAGES[3]} completed={topicRecord.completedStages.includes('revision')} saving={saving} onClick={()=>stageToggle('revision')}/><div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>finishTopic()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-40"><CheckCircle2 size={17}/> Mark topic completed</button><button onClick={()=>{setCheckedQuestions({});setQuizSubmitted(false);setNotice('Quiz reset. மீண்டும் முயற்சிக்கவும்.')}} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-xs font-bold text-slate-600"><RotateCcw size={15}/> Retry quiz</button></div><p className="mt-3 text-[11px] leading-5 text-slate-500">Topic complete ஆக நான்கு stages-ஐ முடித்து, இந்த checkpoint quiz-ல் சரியான பதில்கள் தேர்வு செய்யப்பட வேண்டும்.</p></section>
          </div>
          <div className="space-y-4 xl:sticky xl:top-5">
            <section className="rounded-2xl border border-violet-100 bg-white p-5"><h3 className="font-extrabold">Lesson progress</h3><p className="mt-1 text-xs text-slate-500">{topicRecord.completedStages.length} of 4 stages completed</p><div className="mt-3"><Bar value={pct(topicRecord.completedStages.length,4)}/></div><div className="mt-4 space-y-3">{STAGES.map((stage,i)=>{const Icon=stage.icon;const done=topicRecord.completedStages.includes(stage.id);return <div key={stage.id} className="flex items-start gap-3"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${done?'bg-emerald-100 text-emerald-700':'bg-violet-100 text-violet-700'}`}>{done?<CheckCircle2 size={16}/>:<Icon size={16}/>}</span><div className="min-w-0 flex-1"><p className="text-xs font-bold">{stage.title}</p><p className="mt-1 text-[11px] text-slate-500">{stage.time}</p></div></div>})}</div><div className="mt-5 rounded-xl bg-violet-50 p-3 text-xs leading-5 text-violet-900"><b>Next suggested action</b><br/>{STAGES.find(stage=>!topicRecord.completedStages.includes(stage.id))?.title||'All stages marked done. Complete the checkpoint quiz to finish.'}</div></section>
            <section className="rounded-2xl border border-violet-100 bg-white p-5"><h3 className="font-extrabold">Navigation</h3><p className="mt-1 text-xs text-slate-500">Related topics in this subheading</p><div className="mt-3 space-y-2">{groupTopics.filter(item=>item.sectionTitle===topic.sectionTitle).map(item=><button key={item.id} onClick={()=>chooseTopic(item)} className={`flex w-full items-start gap-2 rounded-lg p-2 text-left text-xs leading-5 ${item.id===topic.id?'bg-violet-50 font-bold text-violet-900':'text-slate-600 hover:bg-slate-50'}`}>{getTopicRecord(progress,item.id).completed?<CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600"/>:<Circle size={14} className="mt-0.5 shrink-0 text-slate-300"/>}<span>{item.title}</span></button>)}</div><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>{const i=allTopics.findIndex(item=>item.id===topic.id);if(i>0)chooseTopic(allTopics[i-1])}} disabled={allTopics.findIndex(item=>item.id===topic.id)<=0} className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold disabled:opacity-30"><ArrowLeft size={13}/> Previous</button><button onClick={()=>{const i=allTopics.findIndex(item=>item.id===topic.id);if(i<allTopics.length-1)chooseTopic(allTopics[i+1])}} disabled={allTopics.findIndex(item=>item.id===topic.id)>=allTopics.length-1} className="flex items-center justify-center gap-1 rounded-lg bg-violet-700 px-2 py-2 text-xs font-bold text-white disabled:opacity-30">Next <ArrowRight size={13}/></button></div></section>
          </div>
        </div>}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-violet-100 pt-4 text-[10px] text-slate-400"><span>AI SkillForge · Full AI Roadmap</span><span>Progress represents marked stages and passed local checkpoint content; it is not a certification.</span></footer>
      </div>
    </main>
  </div>;
}

function Metric({icon:Icon,label,value,note}) { return <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><Icon size={19}/></span><div className="min-w-0"><p className="text-[10px] font-extrabold tracking-widest text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div></div><p className="mt-2 text-[11px] text-slate-500">{note}</p></section>; }
function StageButton({stage,completed,saving,onClick}) { const Icon=stage.icon; return <button disabled={saving} onClick={onClick} className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition disabled:opacity-50 ${completed?'border-emerald-200 bg-emerald-50 text-emerald-800':'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100'}`}><Icon size={15}/>{completed?'Mark stage incomplete':`Mark stage complete · ${stage.time}`}</button>; }
