import { useEffect, useState } from 'react';
import { ArrowLeft, Beaker, BookOpen, BrainCircuit, ChartNoAxesCombined, ClipboardList, FlaskConical, Plus, Save, Sparkles, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'ai-skillforge-research-lab-v1';
const emptyExperiment = { title:'', question:'', dataset:'', baseline:'', metric:'', notes:'' };

function readExperiments() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}

const workflow = [
  { title:'01 · Research question', detail:'Define the problem, why it matters, and a question you can test.', icon:BookOpen },
  { title:'02 · Dataset and baseline', detail:'Record the data source, target, features, and a simple baseline.', icon:ClipboardList },
  { title:'03 · Run experiments', detail:'Change one factor at a time and keep reproducible notes.', icon:Beaker },
  { title:'04 · Evaluate results', detail:'Compare suitable metrics, inspect errors, and note limitations.', icon:ChartNoAxesCombined }
];

export default function AIResearchLab() {
  const [experiments, setExperiments] = useState(readExperiments);
  const [form, setForm] = useState(emptyExperiment);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments)); }
    catch { setNotice('Could not save in this browser. Check available storage.'); }
  }, [experiments]);

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const saveExperiment = event => {
    event.preventDefault();
    if (!form.title.trim() || !form.question.trim()) {
      setNotice('Add an experiment title and research question first.');
      return;
    }
    setExperiments(current => [{ ...form, id: Date.now(), createdAt: new Date().toISOString() }, ...current]);
    setForm(emptyExperiment);
    setNotice('Experiment saved in this browser.');
  };
  const removeExperiment = id => setExperiments(current => current.filter(item => item.id !== id));

  return (
    <main className="min-h-screen bg-[#070d18] px-4 py-7 text-white sm:px-7 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-200"><FlaskConical size={29}/></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-[.2em] text-fuchsia-300">05 · EXPERIMENT AND DISCOVER</p>
            <h1 className="mt-1 text-3xl font-black sm:text-4xl">AI Research Lab</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Plan practical AI experiments, compare approaches, record findings, and build evidence for your projects.</p>
          </div>
        </header>

        <section className="mb-7 rounded-3xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-950/50 via-[#15162e] to-[#101b31] p-5 sm:p-7">
          <div className="flex items-center gap-2 text-fuchsia-200"><Sparkles size={18}/><span className="text-xs font-bold tracking-widest">RESEARCH WORKFLOW</span></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {workflow.map(({ title, detail, icon: Icon }) => <article key={title} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <Icon size={21} className="text-fuchsia-200"/>
              <h2 className="mt-3 text-sm font-bold">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
            </article>)}
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.8fr)]">
          <form onSubmit={saveExperiment} className="rounded-3xl border border-slate-700 bg-[#101a2b] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2"><Plus size={19} className="text-fuchsia-300"/><h2 className="text-lg font-extrabold">Create an experiment</h2></div>
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-300">Experiment title *
                <input value={form.title} onChange={e=>update('title',e.target.value)} placeholder="e.g. Predict elastic quality defects" className="mt-2 w-full rounded-xl border border-slate-600 bg-[#091323] px-3 py-3 text-sm text-white outline-none focus:border-fuchsia-400"/>
              </label>
              <label className="block text-xs font-semibold text-slate-300">Research question *
                <textarea value={form.question} onChange={e=>update('question',e.target.value)} rows={3} placeholder="What problem are you trying to investigate?" className="mt-2 w-full rounded-xl border border-slate-600 bg-[#091323] px-3 py-3 text-sm text-white outline-none focus:border-fuchsia-400"/>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-slate-300">Dataset / data source
                  <input value={form.dataset} onChange={e=>update('dataset',e.target.value)} placeholder="CSV, public dataset, source…" className="mt-2 w-full rounded-xl border border-slate-600 bg-[#091323] px-3 py-3 text-sm text-white outline-none focus:border-fuchsia-400"/>
                </label>
                <label className="block text-xs font-semibold text-slate-300">Baseline approach
                  <input value={form.baseline} onChange={e=>update('baseline',e.target.value)} placeholder="e.g. Logistic Regression" className="mt-2 w-full rounded-xl border border-slate-600 bg-[#091323] px-3 py-3 text-sm text-white outline-none focus:border-fuchsia-400"/>
                </label>
                <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">Evaluation metric
                  <input value={form.metric} onChange={e=>update('metric',e.target.value)} placeholder="e.g. F1-score, MAE, accuracy" className="mt-2 w-full rounded-xl border border-slate-600 bg-[#091323] px-3 py-3 text-sm text-white outline-none focus:border-fuchsia-400"/>
                </label>
              </div>
              <label className="block text-xs font-semibold text-slate-300">Notes and expected outcome
                <textarea value={form.notes} onChange={e=>update('notes',e.target.value)} rows={3} placeholder="Hypothesis, experiment settings, observations…" className="mt-2 w-full rounded-xl border border-slate-600 bg-[#091323] px-3 py-3 text-sm text-white outline-none focus:border-fuchsia-400"/>
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-fuchsia-500"><Save size={16}/> Save experiment</button>
              {notice && <p role="status" className="text-xs text-fuchsia-200">{notice}</p>}
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-[#101a2b] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-xs font-bold tracking-widest text-slate-400">YOUR WORKSPACE</p><h2 className="mt-1 text-lg font-extrabold">Saved experiments</h2></div>
              <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-bold text-fuchsia-200">{experiments.length} saved</span>
            </div>
            {experiments.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-slate-600 p-6 text-center">
              <BrainCircuit size={30} className="mx-auto text-slate-500"/>
              <p className="mt-3 text-sm font-semibold text-slate-300">No experiments yet</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Create your first research plan. It will appear here.</p>
            </div> : <div className="mt-4 space-y-3">
              {experiments.map(item => <article key={item.id} className="rounded-2xl border border-slate-700 bg-[#0b1423] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><h3 className="break-words text-sm font-bold text-white">{item.title}</h3><p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-400">{item.question}</p></div>
                  <button type="button" onClick={()=>removeExperiment(item.id)} aria-label={'Delete '+item.title} className="rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"><Trash2 size={16}/></button>
                </div>
                {(item.dataset || item.baseline || item.metric) && <div className="mt-3 space-y-1 border-t border-slate-700 pt-3 text-[11px] text-slate-400">
                  {item.dataset && <p><b className="text-slate-300">Dataset:</b> {item.dataset}</p>}
                  {item.baseline && <p><b className="text-slate-300">Baseline:</b> {item.baseline}</p>}
                  {item.metric && <p><b className="text-slate-300">Metric:</b> {item.metric}</p>}
                </div>}
                {item.notes && <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-slate-400">{item.notes}</p>}
              </article>)}
            </div>}
            <p className="mt-5 border-t border-slate-700 pt-4 text-[11px] leading-5 text-slate-500">Saved in this browser only. This workspace is not yet synced to your account or MongoDB.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
