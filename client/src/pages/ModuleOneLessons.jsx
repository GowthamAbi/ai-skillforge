import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, Target, Trophy } from 'lucide-react';

const lessons = [
  {
    title: 'AI Foundations – What is Artificial Intelligence?',
    duration: '20 min',
    objective: 'Understand what AI means and identify the purpose of an AI system.',
    explanation: 'Artificial Intelligence (AI) is the field of building computer systems that perform tasks which normally require human intelligence. An AI system receives information, processes it using a method or model, and produces an output such as a prediction, recommendation, generated response or action.',
    points: ['Input: the information given to the system.', 'Processing: rules, a model or an AI method analyses the input.', 'Output: a prediction, recommendation, generated content or action.', 'Evaluation: check whether the output is accurate, useful and safe.'],
    example: 'Garment production example: provide historical machine records as input; an AI model may estimate the risk of a machine breakdown. The estimate is a decision-support signal, not a guarantee.'
  },
  {
    title: 'Evolution – From Machine Learning to GenAI and Agentic AI',
    duration: '25 min',
    objective: 'Describe the progression highlighted in the programme: Machine Learning, Generative AI and Agentic AI.',
    explanation: 'Machine Learning (ML) learns patterns from data to make predictions or decisions. Generative AI (GenAI) creates new content such as text, images or code in response to a prompt. Agentic AI refers to systems designed to pursue a goal through a sequence of steps, using tools or other capabilities when appropriate.',
    points: ['Machine Learning: learn patterns from examples and predict an outcome.', 'Generative AI: generate new content from instructions and context.', 'Agentic AI: plan and carry out multi-step tasks with tools, while operating within defined permissions.', 'These are related areas; a modern application can combine more than one.'],
    example: 'Production example: ML estimates tomorrow’s output; GenAI drafts a shift summary; an agentic workflow could gather approved production data, prepare a report and request a supervisor’s approval before sharing it.'
  },
  {
    title: 'AI System Types',
    duration: '20 min',
    objective: 'Recognise common system behaviours and match them to a task.',
    explanation: 'AI systems are built for different purposes. Some classify an item into a category, some predict a numeric value, some detect objects or patterns, some recommend an option, and generative systems create new content. The correct type depends on the problem and the data available.',
    points: ['Classification: choose a category, such as acceptable or defective.', 'Regression / prediction: estimate a numeric value, such as production quantity.', 'Detection: locate an object or event in an image or signal.', 'Recommendation: suggest a relevant next option.', 'Generation: create text, code, images or other content.'],
    example: 'If the task is to estimate the number of pieces produced tomorrow, it is a prediction problem. If the task is to label an elastic sample as pass or fail, it is a classification problem.'
  },
  {
    title: 'Industry Applications',
    duration: '25 min',
    objective: 'Identify how AI can be applied in different industries.',
    explanation: 'The programme highlights applications across healthcare, finance, e-commerce and manufacturing. AI is used to analyse information, automate parts of a workflow, support decisions and build intelligent applications. The use case should be selected based on a real business problem.',
    points: ['Healthcare: support analysis of medical information and images.', 'Finance: identify unusual transactions and support risk analysis.', 'E-commerce: recommend products and forecast demand.', 'Manufacturing: inspect product quality, analyse downtime and support production planning.'],
    example: 'Manufacturing example: combine machine downtime, defect counts and production quantities to identify recurring patterns. A supervisor can use the analysis to prioritise investigation.'
  },
  {
    title: 'Career Paths and Skills',
    duration: '20 min',
    objective: 'Recognise the career areas named in the programme and the skills they use.',
    explanation: 'The programme identifies AI and ML engineering as career opportunities and names skills across Python, Machine Learning, Deep Learning, NLP, Computer Vision, Generative AI and Agentic AI. Different roles focus on different parts of building, evaluating and deploying AI solutions.',
    points: ['AI / ML Engineer: develops and integrates AI or ML solutions.', 'Data-focused roles: prepare, analyse and interpret data for modelling.', 'Deep Learning / Computer Vision roles: work with neural networks and image or video data.', 'NLP / GenAI roles: build systems that work with language and generated content.', 'Agentic AI roles: design tool-using workflows with clear controls and evaluation.'],
    example: 'A practical learning sequence is to build foundations first, then Python and data skills, followed by ML, deep learning and specialised AI applications as shown in the 22-module roadmap.'
  }
];

const quiz = [
  {q:'Which area learns patterns from data to make predictions?',options:['Generative AI','Machine Learning','Agentic AI','Word processing'],answer:1,why:'Machine Learning learns patterns from examples to make predictions or decisions.'},
  {q:'Which system is primarily designed to create new text or images from a prompt?',options:['Generative AI','A database table','A spreadsheet formula','A file system'],answer:0,why:'Generative AI creates new content based on prompts and context.'},
  {q:'An application that carries out a multi-step task using approved tools is closest to:',options:['A static chart','Agentic AI','A simple calculator','A file format'],answer:1,why:'Agentic AI systems can work through steps and use tools within defined permissions.'},
  {q:'Predicting tomorrow’s production quantity is an example of:',options:['Image generation','Numeric prediction','Text translation','Object detection'],answer:1,why:'The expected output is a numeric value, so it is a prediction / regression-style task.'},
  {q:'Which industry was specifically included in the programme examples?',options:['Manufacturing','Astrology','Space tourism only','None of these'],answer:0,why:'The programme names manufacturing along with healthcare, finance and e-commerce.'}
];

export default function ModuleOneLessons({ completed=false, onComplete=()=>{}, onBack=()=>{} }) {
  const [open,setOpen]=useState(0);
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const score=quiz.reduce((n,item,i)=>n+(answers[i]===item.answer?1:0),0);
  const passed=submitted&&score>=4;
  return <div className="space-y-5">
    <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-white"><ArrowLeft size={16}/> Back to curriculum</button>
    <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#102d4c] via-[#111a37] to-[#171034] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">MODULE 01 · 2 HOURS</span><span className="text-xs text-slate-300">5 lessons · practical activity · quiz</span></div>
      <h1 className="mt-4 text-2xl font-black sm:text-3xl">AI Landscape & Current Trends</h1>
      <p className="mt-2 text-sm text-slate-300">AI Foundations, Career Paths & Industry Applications</p>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">Explore the evolution of AI from Machine Learning to Generative AI and Agentic AI. Discover AI system types, industry applications and high-demand career paths.</p>
    </section>
    <section className="rounded-2xl border border-slate-800 bg-[#101a2b] p-4 sm:p-5">
      <h2 className="flex items-center gap-2 font-extrabold"><Target size={18} className="text-cyan-300"/> Learning outcomes</h2>
      <ul className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">{['Explain AI foundations in simple terms','Compare ML, Generative AI and Agentic AI','Identify different AI system types','Give examples of AI in key industries','Recognise AI-related career paths'].map(x=><li key={x} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400"/>{x}</li>)}</ul>
    </section>
    <section className="space-y-3">
      <div className="flex items-center justify-between"><h2 className="font-extrabold">Lesson content</h2><span className="text-xs text-slate-400">Select each lesson to study</span></div>
      {lessons.map((lesson,i)=><article key={lesson.title} className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101a2b]">
        <button onClick={()=>setOpen(open===i?-1:i)} className="flex w-full items-center gap-3 p-4 text-left"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-500/10 text-sm font-black text-cyan-200">{String(i+1).padStart(2,'0')}</span><span className="min-w-0 flex-1"><b className="block text-sm">{lesson.title}</b><small className="text-slate-400">{lesson.duration}</small></span>{open===i?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</button>
        {open===i&&<div className="space-y-4 border-t border-slate-800 p-4 sm:p-5"><div><h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Lesson objective</h3><p className="mt-2 text-sm text-slate-300">{lesson.objective}</p></div><div><h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Explanation</h3><p className="mt-2 text-sm leading-7 text-slate-300">{lesson.explanation}</p></div><ul className="space-y-2">{lesson.points.map(point=><li key={point} className="rounded-xl border border-slate-800 bg-[#0b1423] p-3 text-sm leading-6 text-slate-300">{point}</li>)}</ul><div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4"><h3 className="flex items-center gap-2 text-sm font-bold text-emerald-200"><Lightbulb size={16}/> Practical example</h3><p className="mt-2 text-sm leading-6 text-slate-300">{lesson.example}</p></div></div>}
      </article>)}
    </section>
    <section className="rounded-2xl border border-violet-400/20 bg-[#101a2b] p-4 sm:p-5">
      <h2 className="font-extrabold">Practical activity – Identify the AI problem</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">For each situation, decide what the system should do. Write your answers in your notes, then compare with the guide.</p>
      <div className="mt-4 space-y-3 text-sm"><div className="rounded-xl bg-[#0b1423] p-3"><b>Task A:</b> Predict tomorrow’s elastic production quantity.<p className="mt-1 text-slate-400">Guide: numeric prediction using historical production data.</p></div><div className="rounded-xl bg-[#0b1423] p-3"><b>Task B:</b> Label an elastic sample as acceptable or defective.<p className="mt-1 text-slate-400">Guide: classification using labelled quality examples.</p></div><div className="rounded-xl bg-[#0b1423] p-3"><b>Task C:</b> Draft a daily production summary from approved shift records.<p className="mt-1 text-slate-400">Guide: Generative AI can draft the summary; a person should verify it.</p></div></div>
    </section>
    <section className="rounded-2xl border border-slate-800 bg-[#101a2b] p-4 sm:p-5">
      <div className="flex items-center gap-2"><BookOpen size={18} className="text-violet-300"/><h2 className="font-extrabold">Knowledge check</h2></div>
      <p className="mt-1 text-xs text-slate-400">Answer all five questions. You need 4 correct answers to complete this module.</p>
      <div className="mt-4 space-y-4">{quiz.map((item,i)=><div key={item.q} className="rounded-xl border border-slate-800 bg-[#0b1423] p-4"><p className="text-sm font-bold">{i+1}. {item.q}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{item.options.map((option,j)=><button key={option} disabled={submitted} onClick={()=>setAnswers(v=>({...v,[i]:j}))} className={'rounded-lg border px-3 py-2 text-left text-xs '+(answers[i]===j?'border-violet-400 bg-violet-500/15 text-white':'border-slate-700 text-slate-300 hover:border-slate-500')}>{option}</button>)}</div>{submitted&&<p className={'mt-3 text-xs '+(answers[i]===item.answer?'text-emerald-300':'text-amber-200')}>{answers[i]===item.answer?'Correct. ':'Review: '}{item.why}</p>}</div>)}</div>
      {!submitted?<button disabled={Object.keys(answers).length!==quiz.length} onClick={()=>setSubmitted(true)} className="mt-4 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">Submit answers</button>:<div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#0b1423] p-4"><div><b className="flex items-center gap-2">{passed?<Trophy className="text-emerald-300"/>:<BookOpen className="text-amber-300"}/> Score: {score}/5</b><p className="mt-1 text-xs text-slate-400">{passed?'Module assessment passed.': 'You need at least 4/5. Review the lessons and try again.'}</p></div><div className="flex gap-2">{!passed&&<button onClick={()=>{setAnswers({});setSubmitted(false);}} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold">Try again</button>}{passed&&!completed&&<button onClick={onComplete} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold">Complete Module 01</button>}{(passed||completed)&&<span className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-200">Completed ✓</span>}</div></div>}
    </section>
  </div>;
}
