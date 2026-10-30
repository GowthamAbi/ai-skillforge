import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, CheckCircle2, ChevronDown, ChevronRight, Circle, Code2, ClipboardCheck, Clock3, FolderOpen, Lightbulb, ListChecks, PanelLeftClose, RotateCcw, Target } from 'lucide-react';
import { api } from '../api/api';
import { AI_PHASES, flattenTopics } from '../data/aiRoadmap';
import { PYTHON_FOUNDATION_LESSON } from '../data/lessons/pythonFoundation';
import { PYTHON_SYNTAX_LESSON } from '../data/lessons/pythonSyntax';
import { PYTHON_VARIABLES_LESSON } from '../data/lessons/pythonVariables';
import { PYTHON_INPUT_OUTPUT_LESSON } from '../data/lessons/pythonInputOutput';
import { PYTHON_CONDITIONALS_LESSON, PYTHON_LOOPS_LESSON } from '../data/lessons/pythonControlFlow';
import { buildCompleteLesson } from '../data/lessons/buildCompleteLesson';

const STAGES = [
  { id:'concept', title:'Concept learning', time:'20–30 minutes', description:'Learn the theory, key technical terms, diagrams, and basic examples.', icon:BookOpen },
  { id:'coding', title:'Coding practice', time:'20–30 minutes', description:'Write the code yourself, understand the output, and experiment by changing it.', icon:Code2 },
  { id:'task', title:'Task and Problem Solving', time:'20–30 minutes', description:'Work from easy to medium to practical tasks. Use hints, attempt each task, and test your solution.', icon:Target },
  { id:'revision', title:'Revision and Assessment', time:'10–20 minutes', description:'Complete a quiz, review your mistake notebook, and revise the previous lesson.', icon:ClipboardCheck }
];
const LESSON_HINTS = {
  'Python Programming':'Start with a small input/output example, then modify the code to explore how it works.',
  'Mathematics for AI':'Instead of memorizing formulas, calculate with small numbers by hand and verify the results in Python.',
  'Data Analysis and Tools':'Use a small table or dataset, inspect the data, and explain your findings.',
  'Machine Learning':'Explore the relationships between features, targets, training data, and predictions using a practical dataset.',
  'Deep Learning':'Draw a diagram showing the flow between inputs, weights, outputs, loss, and training.',
  'NLP (Natural Language Processing)':'Use a short sentence to explore how text is converted into tokens or features.',
  'Generative AI (GenAI)':'Compare prompts, model outputs, context, and answer quality; verify incorrect answers.',
  'AI Engineering':'Consider how you would integrate, test, secure, and monitor this concept in a production application.',
  'Advanced Specialization and Capstone':'Turn this lesson into a small, testable feature for your capstone project.'
};
const EXAMPLE_BY_GROUP = {
  python:'Example: Create a small script that takes production quantities as input and calculates the total, average, or whether the target was reached.',
  math:'Example: Calculate average daily production, variation, or the relationship between two variables.',
  data:'Example: Find missing values, duplicates, daily totals, and rejection rates in a production CSV file.',
  mlfund:'Example: Use historical machine breakdown and maintenance data to estimate breakdown risk.',
  supervised:'Example: Classify breakdown versus no breakdown using features such as temperature, machine age, and shift.',
  unsupervised:'Example: Group production records that have similar rejection patterns.',
  mleval:'Example: Compare predictions with actual results and calculate error, precision, and recall.',
  nn:'Example: Assign weights to input features, calculate the output, and understand how weights are updated to reduce loss.',
  frameworks:'Example: Create a small tensor and explore its shape, operations, gradients, and model-training steps.',
  architectures:'Example: Identify normal versus defective patterns in elastic-surface images, or process a sequence of sentences.',
  text:'Example: Split a sentence such as “delivery delayed” into tokens and compare the normalized text.',
  nlptasks:'Example: Classify customer feedback as positive, neutral, or negative.',
  modernnlp:'Example: Compare how encoder-style and decoder-style models handle the same prompt.',
  genfund:'Example: Observe how generated answers change when the prompt or context changes for the same input.',
  prompt:'Example: Improve the vague prompt “explain AI” by adding a role, context, constraints, and an output format.',
  apis:'Example: Send an API request from the backend and log the response, error handling, and usage cost.',
  rag:'Example: Chunk your syllabus PDF, retrieve relevant chunks, and generate a grounded answer.',
  finetune:'Example: Compare prompting, RAG, and fine-tuning to choose the best approach for a specific use case.',
  agents:'Example: Build an assistant that plans a task, calls tools, and pauses for user approval before important actions.',
  software:'Example: Build an API endpoint with input validation, error handling, and automated tests.',
  architecture:'Example: Diagram the flow from frontend to backend, model API, and database.',
  quality:'Example: Create an evaluation set of 10 representative questions and test answer correctness and privacy.',
  deploy:'Example: Deploy the application using environment variables, then check its health endpoint and logs.',
  advancedeng:'Example: Measure latency, cost, and quality to decide when fallback handling or caching is appropriate.',
  research:'Example: Summarize a paper’s problem, method, dataset, baseline, metrics, and limitations on one page.',
  capstone:'Example: Integrate the transcription → correction → feedback → history → revision workflow into the LinguaPro AI Speaking Coach.'
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
  const [learningNotes, setLearningNotes] = useState('');
  const [taskAnswer, setTaskAnswer] = useState('');
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [runResult, setRunResult] = useState(null);
  const [runningCode, setRunningCode] = useState(false);
  const [stdin, setStdin] = useState('');
  const [generatedLesson, setGeneratedLesson] = useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [taskCheckResult, setTaskCheckResult] = useState(null);

  const load = useCallback(async () => {
    try {
      const result = await api('/path/roadmap-progress', { pathApi:true });
      setProgress(result.progress || {});
      setNotice('');
    } catch (error) {
      setNotice(`Could not load progress from the server: ${error.message}. Try again after the backend integration is deployed.`);
    } finally { setLoaded(true); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const topic = allTopics.find(item => item.id === selectedId) || allTopics[0];
  useEffect(() => {
    if (!topic || !loaded) return;
    const saved = getTopicRecord(progress, topic.id);
    let starterCode = '# Topic: ' + topic.title + '\n# Write and test your implementation here.\n';
    if (topic.title === PYTHON_FOUNDATION_LESSON.title) starterCode = PYTHON_FOUNDATION_LESSON.code;
    else if (topic.title === PYTHON_SYNTAX_LESSON.title) starterCode = PYTHON_SYNTAX_LESSON.code;
    else if (topic.title === PYTHON_VARIABLES_LESSON.title) starterCode = PYTHON_VARIABLES_LESSON.code;
    else if (topic.title === PYTHON_INPUT_OUTPUT_LESSON.title) starterCode = PYTHON_INPUT_OUTPUT_LESSON.code;
    else if (topic.title === PYTHON_CONDITIONALS_LESSON.title) starterCode = PYTHON_CONDITIONALS_LESSON.code;
    else if (topic.title === PYTHON_LOOPS_LESSON.title) starterCode = PYTHON_LOOPS_LESSON.code;
    else starterCode = buildCompleteLesson(topic).code;
    setCode(saved.codeDraft || starterCode);
    setLearningNotes(saved.learningNotes || '');
    setTaskAnswer(saved.taskAnswer || '');
    setCheckedQuestions(Object.fromEntries((saved.quizAnswers || []).map((answer, index) => [index, answer])));
    setQuizSubmitted(Boolean(saved.quizPassed));
  }, [selectedId, loaded, progress]);
  const baseLesson = topic?.title === PYTHON_FOUNDATION_LESSON.title ? PYTHON_FOUNDATION_LESSON : topic?.title === PYTHON_SYNTAX_LESSON.title ? PYTHON_SYNTAX_LESSON : topic?.title === PYTHON_VARIABLES_LESSON.title ? PYTHON_VARIABLES_LESSON : topic?.title === PYTHON_INPUT_OUTPUT_LESSON.title ? PYTHON_INPUT_OUTPUT_LESSON : topic?.title === PYTHON_CONDITIONALS_LESSON.title ? PYTHON_CONDITIONALS_LESSON : topic?.title === PYTHON_LOOPS_LESSON.title ? PYTHON_LOOPS_LESSON : topic ? buildCompleteLesson(topic) : null;
  const detailedLesson = generatedLesson || baseLesson;
  useEffect(() => {
    let active = true;
    if (!topic) return;
    setGeneratedLesson(null);
    api(`/path/roadmap-lessons/${encodeURIComponent(topic.id)}`, { pathApi:true })
      .then(result => {
        if (!active || !result.lesson) return;
        const saved = result.lesson;
        const pythonExample = saved.codeExamples?.find(item => item.language === 'python') || saved.codeExamples?.[0];
        setGeneratedLesson({
          ...saved,
          code: pythonExample?.code || '',
          output: pythonExample?.expectedOutput || '',
          codeExplanation: pythonExample?.explanation ? [[ 'Complete worked example', pythonExample.explanation ]] : []
        });
      }).catch(() => {});
    api(`/path/code/${encodeURIComponent(topic.id)}`, { pathApi:true })
      .then(result => {
        if (!active || !result.workspace) return;
        const workspace = result.workspace;
        setCodeLanguage(workspace.language || 'python');
        const savedCode = workspace.codeDrafts?.[workspace.language || 'python'];
        if (savedCode) setCode(savedCode);
      }).catch(() => {});
    return () => { active = false; };
  }, [selectedId, topic?.id]);
  const runCode = async () => {
    if (!topic || !code.trim()) return;
    setRunningCode(true); setRunResult(null);
    try {
      const result = await api(`/path/code/${encodeURIComponent(topic.id)}/run`, {
        method: 'POST', pathApi: true,
        body: JSON.stringify({ language: codeLanguage, code, stdin })
      });
      setRunResult(result);
      if (result.status === 'success') setNotice('Code executed successfully. Run history saved.');
      else setNotice('Code execution finished with an error. Check the output panel.');
    } catch (error) {
      setRunResult({ status: 'runner-error', stderr: error.message || 'Code runner unavailable.' });
    } finally { setRunningCode(false); }
  };
  const checkSelectedTask = async () => {
    const task = detailedLesson?.tasks?.[selectedTaskIndex];
    if (!task?.testCases?.length) {
      setTaskCheckResult({ error: 'Automated test cases are not available for this lesson yet. Use Run Code to inspect your program output.' });
      return;
    }
    setRunningCode(true); setTaskCheckResult(null);
    try {
      const result = await api(`/path/code/${encodeURIComponent(topic.id)}/check`, {
        method: 'POST', pathApi: true,
        body: JSON.stringify({ language: codeLanguage, code, testCases: task.testCases })
      });
      setTaskCheckResult(result);
      setNotice(result.passed ? 'Task passed all test cases.' : 'Task failed one or more test cases. Review expected and actual output.');
    } catch (error) {
      setTaskCheckResult({ error: error.message || 'Task checking failed.' });
    } finally { setRunningCode(false); }
  };
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
        body:JSON.stringify({completedStages, completed, codeDraft:code, learningNotes, taskAnswer})
      });
      setProgress(old=>({...old,[topicId]:{...old[topicId],...result.record}}));
      setNotice(result.message || 'Progress saved.');
    } catch (error) {
      setNotice(`Could not save progress: ${error.message}. Check the backend deployment and API route.`);
    } finally { setSaving(false); }
  };
  const chooseTopic = (item) => {
    setSelectedId(item.id); setActiveView('lesson'); setMobileMenu(false); setCheckedQuestions({}); setQuizSubmitted(false);
    api(`/path/roadmap-progress/${encodeURIComponent(item.id)}`, {method:'PATCH', pathApi:true, body:JSON.stringify({opened:true})})
      .then(result=>setProgress(old=>({...old,[item.id]:{...old[item.id],...result.record}}))).catch(()=>{});
    const phase = AI_PHASES.find(p=>p.id===item.phaseId);
    setPhaseOpen(phase?.id || 'p1'); setGroupOpen(item.groupId); setSectionOpen(item.sectionTitle);
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const showDashboard = () => { setActiveView('dashboard'); setMobileMenu(false); window.scrollTo({top:0,behavior:'smooth'}); };
  const quizOptions = detailedLesson?.quiz || [
    {q:'What is the best way to truly understand this topic?', options:['Memorize only the definition','Try an example, explain the result, and experiment with changes','Copy code without running it'], answer:1},
    {q:'What should you do after coding practice?', options:['Understand the output and test changes to the code','Move to the next topic without checking the output','Close without saving the code'],answer:0},
    {q:'What should you do after a wrong quiz answer?', options:['Ignore the mistake','Record the mistake, revise the concept, and try again','Skip the entire lesson'],answer:1}
  ];
  const submitQuiz = async () => {
    const passed = quizOptions.every((q,i)=>checkedQuestions[i]===q.answer);
    setQuizSubmitted(true);
    setNotice(passed ? 'Quiz passed. Complete the revision stage to finish this topic.' : 'Some quiz answers are incorrect. Review the correct answers, revise the lesson, and try again.');
    try {
      const result = await api(`/path/roadmap-progress/${encodeURIComponent(topic.id)}`, {method:'PATCH', pathApi:true, body:JSON.stringify({quizAnswers:quizOptions.map((_,i)=>checkedQuestions[i] ?? -1), quizScore:quizOptions.filter((q,i)=>checkedQuestions[i]===q.answer).length, quizTotal:quizOptions.length, quizPassed:passed})});
      setProgress(old=>({...old,[topic.id]:{...old[topic.id],...result.record}}));
    } catch (error) { setNotice(`Quiz result could not be saved: ${error.message}`); }
  };
  const finishTopic = async () => {
    const stages = STAGES.map(stage=>stage.id);
    if (!STAGES.every(stage => topicRecord.completedStages.includes(stage.id))) {
      setNotice('Complete all four stages individually: Concept Learning, Coding Practice, Task and Problem Solving, and Revision and Assessment.');
      return;
    }
    if (!quizSubmitted || !quizOptions.every((q,i)=>checkedQuestions[i]===q.answer)) {
      setNotice('To complete this topic, answer all three checkpoint questions correctly.');
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
      <div className="mt-5 rounded-xl bg-indigo-500/10 p-3 text-[11px] leading-5 text-slate-400">Learn → Practice → Solve → Revise. Progress updates only after a topic is completed.</div>
    </aside>
    <main className="min-w-0 flex-1 px-3 pb-10 pt-4 sm:px-6 sm:py-7 xl:px-9">
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3"><div className="flex items-start gap-2"><button onClick={()=>setMobileMenu(true)} className="mt-1 rounded-lg border border-violet-100 bg-white p-2 text-violet-700 lg:hidden" aria-label="Open syllabus menu"><BookOpen size={18}/></button><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-violet-600">AI SkillForge / AI Roadmap</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{activeView==='dashboard'?'Your AI learning roadmap':topic?.title}</h2><p className="mt-1 text-sm text-slate-500">{activeView==='dashboard'?'Topics across the syllabus that are pending, in progress, or completed.':'Learn the concept, write code, complete the task, and track your progress.'}</p></div></div><button onClick={showDashboard} className="flex items-center gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2 text-xs font-bold text-violet-800 hover:bg-violet-50"><ArrowLeft size={15}/> Dashboard</button></header>
        {notice&&<div role="status" className="mb-5 rounded-xl border border-violet-100 bg-white px-4 py-3 text-xs leading-5 text-violet-900">{notice}</div>}
        {!loaded?<div className="rounded-2xl bg-white p-8 text-sm text-slate-500">Loading roadmap progress…</div>:activeView==='dashboard'?<>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Activity} label="OVERALL PROGRESS" value={`${overallPct}%`} note={`${allDone} / ${allTopics.length} topics completed`}/>
            <Metric icon={BookOpen} label="TOTAL TOPICS" value={allTopics.length} note="7 phases · full curriculum"/>
            <Metric icon={Clock3} label="PENDING TOPICS" value={allTopics.length-allDone} note="Topics remaining to learn"/>
            <Metric icon={CheckCircle2} label="COMPLETED PHASES" value={AI_PHASES.filter(p=>phaseStats[p.id]?.percent===100).length} note="All topics completed"/>
          </div>
          <section className="mt-5 rounded-2xl bg-gradient-to-br from-[#22164b] via-[#352071] to-[#4c35a4] p-5 text-white shadow-lg sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[.2em] text-violet-200">CONTINUE YOUR JOURNEY</p><h3 className="mt-2 text-2xl font-black">Learn AI from the ground up.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100/80">Each lesson includes concept learning, practical coding, a problem-solving task, and revision. Progress is tracked topic by topic.</p></div><span className="rounded-2xl bg-white/10 p-3"><BrainCircuit size={35}/></span></div><button onClick={()=>chooseTopic(allTopics.find(t=>!getTopicRecord(progress,t.id).completed)||allTopics[0])} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-violet-900 hover:bg-violet-100">Continue next pending topic <ArrowRight size={16}/></button></section>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">{AI_PHASES.map(phase=><section key={phase.id} className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-600">{phase.duration||'Learning phase'}</p><h3 className="mt-1 text-lg font-extrabold">{phase.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{phase.description}</p></div><span className="text-xl font-black text-violet-700">{phaseStats[phase.id]?.percent||0}%</span></div><div className="mt-3"><Bar value={phaseStats[phase.id]?.percent||0}/></div><p className="mt-2 text-xs text-slate-500">{phaseStats[phase.id]?.done||0} completed · {(phaseStats[phase.id]?.total||0)-(phaseStats[phase.id]?.done||0)} pending</p><div className="mt-4 space-y-2">{phase.groups.map(group=><button key={group.id} onClick={()=>{setPhaseOpen(phase.id);setGroupOpen(group.id);setSectionOpen(group.sections[0]?.title||'');setActiveView('dashboard');setMobileMenu(true)}} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 text-left hover:border-violet-200 hover:bg-violet-50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-violet-700"><BookOpen size={15}/></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold">{group.title}</span><span className="mt-0.5 block text-[10px] text-slate-500">{group.sections.length} subheadings</span></span><ChevronRight size={15} className="text-slate-400"/></button>)}</div></section>)}</div>
        </>:topic&&<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(285px,1fr)]">
          <div className="space-y-4">
            <section className="rounded-2xl bg-gradient-to-r from-[#211548] to-[#45308d] p-5 text-white sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-violet-200">{topic.phaseTitle}</p><p className="mt-2 text-xs text-violet-200">{topic.groupTitle} / {topic.sectionTitle}</p><h3 className="mt-2 text-2xl font-black">{topic.title}</h3><p className="mt-3 text-sm leading-6 text-violet-100/90">{LESSON_HINTS[topic.groupTitle]||'Understand the concept through a small example, coding practice, and a real-world task.'}</p><div className="mt-5 flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">4 learning stages</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">{topicRecord.completedStages.length}/4 stages done</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">{topicRecord.completed?'Completed':'In progress'}</span></div></section>
            {detailedLesson && <div className="space-y-4">
              <section className="rounded-2xl border border-violet-100 bg-white p-5"><h3 className="text-lg font-extrabold">Learning outcomes</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">{detailedLesson.outcomes.map(item=><li key={item}>{item}</li>)}</ul></section>
              <section className={detailedLesson ? "hidden" : "rounded-2xl border border-violet-100 bg-white p-5"}><div className="flex items-center gap-2"><Lightbulb className="text-amber-500" size={19}/><h3 className="font-extrabold">1. Concept Learning — Detailed theory</h3></div>{detailedLesson.theory.map(item=><article key={item.heading} className="mt-5 border-b border-slate-100 pb-4 last:border-0"><h4 className="font-bold text-violet-900">{item.heading}</h4><p className="mt-2 text-sm leading-7 text-slate-700">{item.body}</p><div className="mt-3 rounded-xl bg-violet-50 p-3 text-sm leading-6 text-violet-950"><b>Example:</b> {item.example}</div></article>)}<div className="mt-4 rounded-xl bg-slate-50 p-4"><b className="text-sm">How a Python program runs</b><div className="mt-3 flex flex-wrap items-center gap-2">{detailedLesson.flow.map((item,i)=><React.Fragment key={item}><span className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-900">{item}</span>{i<detailedLesson.flow.length-1&&<ArrowRight size={15} className="text-violet-500"/>}</React.Fragment>)}</div></div><label className="mt-4 block text-xs font-bold text-slate-700">My learning notes<textarea value={learningNotes} onChange={e=>setLearningNotes(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Write definitions, examples, questions, and mistakes…"/></label><button onClick={()=>saveTopic(topic.id,topicRecord.completedStages||[],topicRecord.completed||false)} className="mt-2 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white">Save notes</button><StageButton stage={STAGES[0]} completed={topicRecord.completedStages.includes('concept')} saving={saving} onClick={()=>stageToggle('concept')}/></section>
              <section className="rounded-2xl border border-violet-100 bg-white p-5"><h3 className="font-extrabold">2. Coding Practice — Working Python code</h3><p className="mt-2 text-sm text-slate-600">Run this in Google Colab, Jupyter Notebook, or a local Python 3 editor.</p><div className="mt-3 flex flex-wrap items-center gap-2"><label className="text-xs font-bold">Language<select value={codeLanguage} onChange={async e=>{const next=e.target.value;setCodeLanguage(next);setRunResult(null);try{const saved=await api(`/path/code/${encodeURIComponent(topic.id)}`,{pathApi:true});const draft=saved.workspace?.codeDrafts?.[next];if(draft!==undefined)setCode(draft);else {const sample=generatedLesson?.codeExamples?.find(item=>item.language===next);setCode(sample?.code || (next==='python'?'# Write your Python solution here':next==='javascript'?'// Write your JavaScript solution here':'public class Main { public static void main(String[] args) {\\n    // Write your Java solution here\\n  } }'));}}catch{setCode('');}}} className="ml-2 rounded-lg border border-slate-300 bg-white p-2"><option value="python">Python</option><option value="javascript">JavaScript</option><option value="java">Java</option></select></label><button onClick={runCode} disabled={runningCode||!code.trim()} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{runningCode?'Running…':'▶ Run Code'}</button><button onClick={()=>api(`/path/code/${encodeURIComponent(topic.id)}`,{method:'PATCH',pathApi:true,body:JSON.stringify({language:codeLanguage,code})}).then(()=>setNotice('Code saved to MongoDB.')).catch(error=>setNotice(error.message))} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold">Save draft</button></div><textarea value={code} onChange={e=>setCode(e.target.value)} spellCheck={false} className="mt-3 min-h-64 w-full rounded-xl bg-[#111827] p-4 font-mono text-xs leading-6 text-emerald-100"/><label className="mt-3 block text-xs font-semibold">Program input (stdin)<textarea value={stdin} onChange={e=>setStdin(e.target.value)} className="mt-1 min-h-16 w-full rounded-lg border border-slate-200 p-2 font-mono text-xs" placeholder="Optional input for input() / Scanner / readline"/></label>{runResult&&<div className="mt-3 rounded-xl border border-slate-200 bg-slate-950 p-3 text-xs text-slate-100"><div className="flex flex-wrap items-center justify-between gap-2"><b className={runResult.status==='success'?'text-emerald-300':'text-rose-300'}>{runResult.status==='success'?'✓ Run Successful':runResult.status==='compile-error'?'Compile Error':runResult.status==='runtime-error'?'Runtime Error':runResult.status==='timeout'?'Timed Out':'Runner Error'}</b><span className="text-slate-400">{runResult.durationMs??0} ms · Exit: {runResult.exitCode??'—'}</span></div><pre className="mt-3 whitespace-pre-wrap text-emerald-200">{runResult.stdout||'(No output)'}</pre>{runResult.stderr&&<pre className="mt-3 whitespace-pre-wrap text-rose-300">{runResult.stderr}</pre>}</div>}<div className="mt-3 rounded-xl bg-slate-50 p-3"><b className="text-sm">Expected output</b><pre className="mt-2 whitespace-pre-wrap text-xs leading-6 text-slate-700">{detailedLesson.output}</pre></div><h4 className="mt-4 font-bold">Line-by-line explanation</h4><div className="mt-2 space-y-2">{detailedLesson.codeExplanation.map(([line,explain])=><div key={line} className="rounded-lg bg-violet-50 p-3"><code className="text-xs text-violet-900">{line}</code><p className="mt-1 text-xs leading-5 text-slate-700">{explain}</p></div>)}</div><div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm leading-6"><b>Real-world application:</b> {detailedLesson.practical}</div><button onClick={()=>{navigator.clipboard?.writeText(code);setNotice('Code copied. Paste it into Google Colab or Jupyter.')}} className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold">Copy code</button><button onClick={()=>saveTopic(topic.id,topicRecord.completedStages||[],topicRecord.completed||false)} disabled={saving} className="ml-2 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white">Save code</button><StageButton stage={STAGES[1]} completed={topicRecord.completedStages.includes('coding')} saving={saving} onClick={()=>stageToggle('coding')}/></section>
              <section className="rounded-2xl border border-violet-100 bg-white p-5"><h3 className="font-extrabold">3. Task and Problem Solving</h3><p className="mt-2 text-sm text-slate-600">Solve each task yourself before checking the hint.</p><div className="mt-3 flex flex-wrap items-center gap-2"><label className="text-xs font-bold">Task to test<select value={selectedTaskIndex} onChange={e=>{setSelectedTaskIndex(Number(e.target.value));setTaskCheckResult(null)}} className="ml-2 rounded-lg border border-slate-300 bg-white p-2">{detailedLesson.tasks.map((task,index)=><option key={task.level} value={index}>{task.level}</option>)}</select></label><button onClick={checkSelectedTask} disabled={runningCode||!code.trim()} className="rounded-lg bg-indigo-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{runningCode?'Checking…':'Check Task · Test Cases'}</button></div>{taskCheckResult&&<div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">{taskCheckResult.error?<p className="text-rose-700">{taskCheckResult.error}</p>:<><b className={taskCheckResult.passed?'text-emerald-700':'text-rose-700'}>{taskCheckResult.passed?'✓ Task Passed':'✕ Task Failed'} · {taskCheckResult.passedCount}/{taskCheckResult.total} tests passed</b><div className="mt-2 space-y-2">{taskCheckResult.cases?.map(test=><div key={test.index} className="rounded-lg bg-white p-2"><b className={test.passed?'text-emerald-700':'text-rose-700'}>Test {test.index}: {test.passed?'PASS':'FAIL'}</b>{!test.passed&&<><p className="mt-1">Expected: <code>{test.expected}</code></p><p>Received: <code>{test.actual || '(empty output)'}</code></p>{test.stderr&&<pre className="mt-1 whitespace-pre-wrap text-rose-700">{test.stderr}</pre>}</>}</div>)}</div></>}</div>}{detailedLesson.tasks.map(task=><article key={task.level} className="mt-3 rounded-xl border border-slate-100 p-4"><b className="text-sm text-violet-900">{task.level} task</b><p className="mt-2 text-sm leading-6">{task.prompt}</p><details className="mt-2 text-xs text-slate-600"><summary className="cursor-pointer font-bold text-violet-700">Show hint</summary><p className="mt-2 leading-5">{task.hint}</p></details></article>)}<label className="mt-4 block text-xs font-bold">Your task solution<textarea value={taskAnswer} onChange={e=>setTaskAnswer(e.target.value)} className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Write your code, calculation, and result…"/></label><button onClick={()=>saveTopic(topic.id,topicRecord.completedStages||[],topicRecord.completed||false)} className="mt-2 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white">Save task solution</button><StageButton stage={STAGES[2]} completed={topicRecord.completedStages.includes('task')} saving={saving} onClick={()=>stageToggle('task')}/></section>
              <section className="rounded-2xl border border-violet-100 bg-white p-5"><h3 className="font-extrabold">4. Revision and Assessment</h3><p className="mt-2 text-sm text-slate-600">Answer all five lesson-specific questions. Review the explanation for every answer.</p>{quizOptions.map((q,i)=><fieldset key={q.question} className="mt-4 border-t border-slate-100 pt-3"><legend className="text-sm font-bold">{i+1}. {q.question}</legend><div className="mt-2 space-y-2">{q.options.map((option,j)=><label key={option} className="flex cursor-pointer gap-2 rounded-lg border p-3 text-xs"><input type="radio" name={`detailed-quiz-${topic.id}-${i}`} checked={checkedQuestions[i]===j} onChange={()=>{setCheckedQuestions(old=>({...old,[i]:j}));setQuizSubmitted(false)}}/>{option}</label>)}</div>{quizSubmitted&&<p className="mt-2 text-xs font-semibold text-violet-800">{q.explanation}</p>}</fieldset>)}<button onClick={submitQuiz} disabled={Object.keys(checkedQuestions).length!==quizOptions.length} className="mt-4 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white">Submit assessment</button><StageButton stage={STAGES[3]} completed={topicRecord.completedStages.includes('revision')} saving={saving} onClick={()=>stageToggle('revision')}/><button onClick={finishTopic} className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">Complete this topic</button></section>
            </div>}
            <section className="rounded-2xl border border-violet-100 bg-white p-5"><div className="flex items-center gap-2"><Lightbulb size={19} className="text-amber-500"/><h3 className="font-extrabold">1. Concept Learning</h3></div><p className="mt-3 text-sm leading-7 text-slate-700">Today's topic <b>{topic.title}</b>. First, describe in your own words its purpose, expected inputs and outputs, and the real-world problem it solves.</p><div className="mt-3 rounded-xl bg-violet-50 p-4 text-sm leading-6 text-violet-950"><b>Practical Example:</b> {EXAMPLE_BY_GROUP[topic.groupId]||'Choose an example from work or everyday life and break it into input → process → output.'}</div><p className="mt-3 text-xs leading-5 text-slate-500">Learning note: This is a guided study scaffold. A complete theory article has not yet been written for every topic, so add your own notes as you study.</p><label className="mt-3 block text-xs font-bold text-slate-700">My learning notes<textarea value={learningNotes} onChange={e=>setLearningNotes(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-violet-400" placeholder="Write definitions, examples, questions, and mistakes…"/></label><button onClick={()=>saveTopic(topic.id, topicRecord.completedStages || [], topicRecord.completed || false)} disabled={saving} className="mt-2 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Save notes</button><StageButton stage={STAGES[0]} completed={topicRecord.completedStages.includes('concept')} saving={saving} onClick={()=>stageToggle('concept')}/></section>
            <section className={detailedLesson ? "hidden" : "rounded-2xl border border-violet-100 bg-white p-5"}><div className="flex items-center gap-2"><Code2 size={19} className="text-indigo-600"/><h3 className="font-extrabold">2. Coding practice</h3></div><p className="mt-2 text-sm leading-6 text-slate-600">Use the practice workspace below to write code for this topic. Run it in a Python environment or Google Colab and verify the output.</p><textarea value={code} onChange={e=>setCode(e.target.value)} spellCheck={false} className="mt-3 min-h-44 w-full rounded-xl border border-slate-200 bg-[#111827] p-4 font-mono text-xs leading-6 text-emerald-100 outline-none focus:border-violet-400"/><button onClick={()=>{navigator.clipboard?.writeText(code);setNotice('Code copied. Run it in Google Colab or a Python editor.')}} className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Copy code</button><div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><b>Expected output:</b><p className="mt-1">The output depends on how you implement the TODO sections. Run the code and record the actual result.</p><span className="mt-2 block">Code explanation: Write your implementation inside the function. The main guard calls main() when the file is run directly. This starter template is not a topic-specific solution.</span></div><button onClick={()=>saveTopic(topic.id, topicRecord.completedStages || [], topicRecord.completed || false)} disabled={saving} className="mt-2 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{saving?'Saving…':'Save code'}</button><StageButton stage={STAGES[1]} completed={topicRecord.completedStages.includes('coding')} saving={saving} onClick={()=>stageToggle('coding')}/></section>
            <section className={detailedLesson ? "hidden" : "rounded-2xl border border-violet-100 bg-white p-5"}><div className="flex items-center gap-2"><Target size={19} className="text-emerald-600"/><h3 className="font-extrabold">3. Task and Problem Solving</h3></div><p className="mt-3 text-sm leading-7 text-slate-700"><b>Task:</b> {topic.title} Use the concept to create a small program, calculation, or workflow with your own input. Verify the output manually.</p><div className="mt-3 space-y-2 text-xs leading-5 text-slate-600">{['Easy: Create a small example that demonstrates the concept.','Medium: Add two edge cases and verify the output.','Practical: Apply it to elastic production, machine breakdown, rejection, or delivery data.'].map(item=><div key={item} className="flex gap-2 rounded-lg bg-slate-50 p-3"><Check size={14} className="mt-0.5 shrink-0 text-violet-600"/>{item}</div>)}</div><label className="mt-3 block text-xs font-bold text-slate-700">Your task solution<textarea value={taskAnswer} onChange={e=>setTaskAnswer(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-violet-400" placeholder="Write your approach, code, calculations, and result…"/></label><button onClick={()=>saveTopic(topic.id, topicRecord.completedStages || [], topicRecord.completed || false)} disabled={saving} className="mt-2 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Save task answer</button><StageButton stage={STAGES[2]} completed={topicRecord.completedStages.includes('task')} saving={saving} onClick={()=>stageToggle('task')}/></section>
            <section className={detailedLesson ? "hidden" : "rounded-2xl border border-violet-100 bg-white p-5"}><div className="flex items-center gap-2"><RotateCcw size={19} className="text-amber-600"/><h3 className="font-extrabold">4. Revision and Assessment</h3></div><p className="mt-2 text-sm leading-6 text-slate-600">Select one answer for each question and submit the quiz. All answers must be correct.</p>{quizOptions.map((q,i)=><fieldset key={q.q} className="mt-4 border-t border-slate-100 pt-3"><legend className="text-sm font-bold leading-6">{i+1}. {q.q}</legend><div className="mt-2 space-y-2">{q.options.map((option,j)=><label key={option} className={`flex cursor-pointer gap-2 rounded-lg border p-2.5 text-xs ${checkedQuestions[i]===j?'border-violet-400 bg-violet-50':'border-slate-200'}`}><input type="radio" name={`quiz-${topic.id}-${i}`} checked={checkedQuestions[i]===j} onChange={()=>{setCheckedQuestions(old=>({...old,[i]:j}));setQuizSubmitted(false)}} className="accent-violet-600"/>{option}</label>)}</div>{quizSubmitted&&<p className={`mt-2 text-xs font-semibold ${checkedQuestions[i]===q.answer?'text-emerald-700':'text-rose-600'}`}>{checkedQuestions[i]===q.answer?'Correct answer ✓':`Correct answer: ${q.options[q.answer]}`}</p>}</fieldset>)}<button onClick={submitQuiz} disabled={Object.keys(checkedQuestions).length!==quizOptions.length} className="mt-4 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-40">Submit checkpoint quiz</button><StageButton stage={STAGES[3]} completed={topicRecord.completedStages.includes('revision')} saving={saving} onClick={()=>stageToggle('revision')}/><div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>finishTopic()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-40"><CheckCircle2 size={17}/> Mark topic completed</button><button onClick={()=>{setCheckedQuestions({});setQuizSubmitted(false);setNotice('Quiz reset. Try again.')}} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-xs font-bold text-slate-600"><RotateCcw size={15}/> Retry quiz</button></div><p className="mt-3 text-[11px] leading-5 text-slate-500">To complete the topic, finish all four stages and answer every checkpoint question correctly.</p></section>
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
