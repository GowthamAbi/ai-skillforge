import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api/api';

const makeCell = (code = '') => ({ id: `cell-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, code, result: null });

export default function NotebookEditor({
  topicId, initialCode, onCodeChange, codeLanguage, setCodeLanguage,
  detailedLesson, generatedLesson, runningCode, setRunningCode, setNotice
}) {
  const [cells, setCells] = useState(() => [makeCell(initialCode || '')]);
  const [stdin, setStdin] = useState('');
  const [saving, setSaving] = useState(false);
  const initializedTopic = useRef(topicId);
  const firstSave = useRef(true);

  useEffect(() => {
    let active = true;
    initializedTopic.current = topicId;
    firstSave.current = true;
    setCells([makeCell(initialCode || '')]);
    setStdin('');
    api(`/path/code/${encodeURIComponent(topicId)}`, { pathApi: true })
      .then(({ workspace }) => {
        if (!active || !workspace) return;
        const language = workspace.language || 'python';
        setCodeLanguage(language);
        const draft = workspace.codeDrafts?.[language];
        if (typeof draft === 'string' && draft.trim()) {
          setCells([makeCell(draft)]);
          onCodeChange(draft);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, [topicId]);

  const combinedCode = cells.map(cell => cell.code).filter(Boolean).join('\n\n');
  useEffect(() => {
    onCodeChange(combinedCode);
    if (firstSave.current) { firstSave.current = false; return; }
    if (!combinedCode.trim()) return;
    const timer = window.setTimeout(async () => {
      setSaving(true);
      try {
        await api(`/path/code/${encodeURIComponent(topicId)}`, {
          method: 'PATCH', pathApi: true,
          body: JSON.stringify({ language: codeLanguage, code: combinedCode })
        });
        setNotice('Notebook autosaved.');
      } catch (error) {
        setNotice(`Autosave failed: ${error.message}`);
      } finally { setSaving(false); }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cells, codeLanguage, topicId]);

  const updateCell = (id, code) => setCells(old => old.map(cell => cell.id === id ? { ...cell, code, result: null } : cell));
  const addCell = (afterId) => setCells(old => {
    const index = old.findIndex(cell => cell.id === afterId);
    const next = [...old];
    next.splice(index + 1, 0, makeCell(''));
    return next;
  });
  const removeCell = (id) => setCells(old => old.length === 1 ? [makeCell('')] : old.filter(cell => cell.id !== id));

  const runCell = async (cell) => {
    if (!cell.code.trim()) return;
    const selectedIndex = cells.findIndex(item => item.id === cell.id);
    const executionCode = codeLanguage === 'java' ? cell.code : cells.slice(0, selectedIndex + 1).map(item => item.code).filter(Boolean).join('\\n\\n');
    setRunningCode(true);
    setCells(old => old.map(item => item.id === cell.id ? { ...item, result: { status: 'running', stdout: '', stderr: '' } } : item));
    try {
      const result = await api(`/path/code/${encodeURIComponent(topicId)}/run`, {
        method: 'POST', pathApi: true,
        body: JSON.stringify({ language: codeLanguage, code: executionCode, stdin })
      });
      setCells(old => old.map(item => item.id === cell.id ? { ...item, result } : item));
      setNotice(result.status === 'success' ? 'Cell executed successfully.' : 'Cell execution returned an error. See its output.');
    } catch (error) {
      setCells(old => old.map(item => item.id === cell.id ? {
        ...item, result: { status: 'runner-error', stderr: error.message || 'Code runner unavailable.' }
      } : item));
    } finally { setRunningCode(false); }
  };

  const runAllCells = async () => {\n    const executionCode = cells.map(item => item.code).filter(Boolean).join('\\n\\n');\n    if (!executionCode.trim()) return;\n    setRunningCode(true);\n    setCells(old => old.map(item => ({ ...item, result: null })));\n    try {\n      const result = await api(`/path/code/${encodeURIComponent(topicId)}/run`, { method: 'POST', pathApi: true, body: JSON.stringify({ language: codeLanguage, code: executionCode, stdin }) });\n      setCells(old => old.map((item, index) => index === old.length - 1 ? { ...item, result } : item));\n      setNotice(result.status === 'success' ? 'All notebook cells executed.' : 'Notebook execution returned an error. See the last cell output.');\n    } catch (error) {\n      setCells(old => old.map((item, index) => index === old.length - 1 ? { ...item, result: { status: 'runner-error', stderr: error.message || 'Code runner unavailable.' } } : item));\n    } finally { setRunningCode(false); }\n  };\n\n  const resetKernel = () => { setCells(old => old.map(item => ({ ...item, result: null }))); setStdin(''); setNotice('Execution outputs cleared. Your code cells are preserved.'); };\n\n  const saveNow = async () => {
    setSaving(true);
    try {
      await api(`/path/code/${encodeURIComponent(topicId)}`, {
        method: 'PATCH', pathApi: true,
        body: JSON.stringify({ language: codeLanguage, code: combinedCode })
      });
      setNotice('Notebook saved to MongoDB.');
    } catch (error) { setNotice(`Save failed: ${error.message}`); }
    finally { setSaving(false); }
  };

  const expected = detailedLesson?.output || generatedLesson?.codeExamples?.[0]?.expectedOutput || '';
  const explanation = detailedLesson?.codeExplanation || [];
  return <section className="rounded-2xl border border-violet-100 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="text-lg font-extrabold">2. Coding Practice — Notebook</h3><p className="mt-1 text-sm text-slate-600">Write code in separate cells and run each cell individually, like a notebook.</p></div>
      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">Jupyter-style workspace</span>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <label className="text-xs font-bold">Language
        <select value={codeLanguage} onChange={async event => {
          const next = event.target.value;
          setCodeLanguage(next);
          try {
            const saved = await api(`/path/code/${encodeURIComponent(topicId)}`, { pathApi: true });
            const draft = saved.workspace?.codeDrafts?.[next];
            const sample = generatedLesson?.codeExamples?.find(item => item.language === next)?.code;
            const starter = draft || sample || (next === 'python' ? '# Write Python code here' : next === 'javascript' ? '// Write JavaScript code here' : 'public class Main { public static void main(String[] args) {\\n  // Write Java code here\\n} }');
            setCells([makeCell(starter)]);
            onCodeChange(starter);
          } catch { setCells([makeCell('')]); }
        }} className="ml-2 rounded-lg border border-slate-300 bg-white p-2">
          <option value="python">Python</option><option value="javascript">JavaScript</option><option value="java">Java</option>
        </select>
      </label>
      <button onClick={() => addCell(cells[cells.length - 1].id)} className="rounded-lg bg-violet-100 px-3 py-2 text-xs font-bold text-violet-800">＋ Code</button>
      <button onClick={runAllCells} disabled={runningCode || !combinedCode.trim()} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">▶ Run all</button>\n      <button onClick={resetKernel} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">Reset outputs</button>\n      <button onClick={saveNow} disabled={saving} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold">{saving ? 'Saving…' : 'Save notebook'}</button>
      <span className="text-xs text-slate-500">{saving ? 'Saving changes…' : 'Autosave enabled'}</span>
    </div>
    <div className="mt-4 space-y-4">
      {cells.map((cell, index) => <article key={cell.id} className="overflow-hidden rounded-xl border border-slate-200">
        <div className="flex items-center justify-between bg-slate-50 px-3 py-2">
          <span className="text-xs font-bold text-slate-600">In [{index + 1}]</span>
          <div className="flex gap-2">
            <button onClick={() => runCell(cell)} disabled={runningCode || !cell.code.trim()} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50">{cell.result?.status === 'running' ? 'Running…' : '▶ Run cell'}</button>
            <button onClick={() => addCell(cell.id)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold">＋</button>
            <button onClick={() => removeCell(cell.id)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-rose-600">×</button>
          </div>
        </div>
        <textarea value={cell.code} onChange={event => updateCell(cell.id, event.target.value)} spellCheck={false} className="min-h-36 w-full resize-y bg-[#111827] p-4 font-mono text-sm leading-6 text-emerald-100 outline-none" placeholder={codeLanguage === 'python' ? '# Write Python code in this cell…' : '// Write code in this cell…'} />
        {cell.result && <div className="border-t border-slate-800 bg-slate-950 p-3 text-xs">
          <div className="flex flex-wrap justify-between gap-2"><b className={cell.result.status === 'success' ? 'text-emerald-300' : 'text-rose-300'}>{cell.result.status === 'success' ? '✓ Cell completed' : cell.result.status === 'running' ? 'Running cell…' : cell.result.status === 'compile-error' ? 'Compile error' : cell.result.status === 'runtime-error' ? 'Runtime error' : cell.result.status === 'timeout' ? 'Timed out' : 'Runner unavailable'}</b><span className="text-slate-400">{cell.result.durationMs ?? 0} ms</span></div>
          <pre className="mt-2 whitespace-pre-wrap text-emerald-200">{cell.result.stdout || '(No output)'}</pre>
          {cell.result.stderr && <pre className="mt-2 whitespace-pre-wrap text-rose-300">{cell.result.stderr}</pre>}
        </div>}
      </article>)}
    </div>
    <label className="mt-4 block text-xs font-semibold">Program input (stdin)
      <textarea value={stdin} onChange={event => setStdin(event.target.value)} className="mt-1 min-h-16 w-full rounded-lg border border-slate-200 p-3 font-mono text-xs" placeholder="Optional input for input() / Scanner / readline" />
    </label>
    <div className="mt-4 rounded-xl bg-slate-50 p-4"><b className="text-sm">Expected output</b><pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{expected || 'Run the cell to see its output.'}</pre></div>
    {explanation.length > 0 && <><h4 className="mt-4 font-bold">Line-by-line explanation</h4><div className="mt-2 space-y-2">{explanation.map(([line, detail], index) => <div key={index} className="rounded-lg bg-violet-50 p-3"><code className="text-xs text-violet-900">{line}</code><p className="mt-1 text-xs leading-5 text-slate-700">{detail}</p></div>)}</div></>}
    {detailedLesson?.practical && <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm leading-6"><b>Real-world application:</b> {detailedLesson.practical}</div>}
    <p className="mt-3 text-xs leading-5 text-amber-700">Python and JavaScript cells re-run earlier cells in order, making earlier variables available. Run all executes the notebook top to bottom. This is not a persistent live kernel; Java cells run independently.</p>
  </section>;
}
