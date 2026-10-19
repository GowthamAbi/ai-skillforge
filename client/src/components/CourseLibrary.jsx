import { useState } from 'react';
import { Archive, ArrowRight, ExternalLink, LibraryBig, Pencil, PlusCircle, Sparkles } from 'lucide-react';
import { api } from '../api/api';

const empty = { title: '', instructor: '', url: '', account: '1', priority: 'supporting', category: 'general' };
const input = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';
const priorityNames = { core: 'Core', supporting: 'Supporting', optional: 'Optional' };
const colors = { core: 'bg-indigo-100 text-indigo-700', supporting: 'bg-emerald-100 text-emerald-700', optional: 'bg-slate-100 text-slate-600' };

export default function CourseLibrary({ library, onChanged, onGoSmart }) {
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const courses = library?.courses || [];
  const skillOptions = library?.skillChecklist || [];
  const categories = [{ id: 'general', label: 'General / other' }, ...skillOptions];
  const shown = courses.filter(course => filter === 'all' || course.priority === filter);
  const save = async event => {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true);
    try {
      const result = await api('/path/courses', { method: 'POST', body: JSON.stringify({ ...form, account: Number(form.account) }) });
      setForm(empty); setNotice(result.message); await onChanged();
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  };
  const updatePriority = async (course, priority) => {
    setError(''); setBusy(true);
    try {
      await api(`/path/courses/${course.id}`, { method: 'PATCH', body: JSON.stringify({ priority }) });
      await onChanged();
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  };
  const archive = async course => {
    if (!window.confirm(`Archive "${course.title}" and its added lessons? Your prior quiz history will be kept.`)) return;
    setError(''); setBusy(true);
    try {
      const result = await api(`/path/courses/${course.id}`, { method: 'DELETE' });
      setNotice(result.message); await onChanged();
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  };
  const editCourse = async event => {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true);
    try {
      const result = await api(`/path/courses/${editing.id}`, { method: 'PATCH', body: JSON.stringify(editing) });
      setEditing(null); setNotice(result.message); await onChanged();
    } catch(error) { setError(error.message); }
    finally { setBusy(false); }
  };
  const useSuggestion = suggestion => {
    setForm({ ...empty, account: '1', title: suggestion.title, priority: suggestion.priority, category: suggestion.category });
    document.getElementById('skillforge-add-course')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div className="min-w-0 space-y-5">
    <div className="overflow-hidden rounded-[26px] bg-gradient-to-r from-[#242265] via-[#4933a6] to-[#14769b] p-5 text-white sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><div className="min-w-0"><p className="text-xs font-extrabold tracking-[.18em] text-indigo-200">PERSONAL COURSE LIBRARY</p><h3 className="mt-2 text-2xl font-black sm:text-3xl">All your learning. One career path.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">The original four courses stay fixed. Add the other Udemy courses you own, organize their priority, and choose only the extra lessons you need.</p></div><LibraryBig size={55} className="shrink-0 text-cyan-200"/></div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[courses.length,'Courses in library'],[courses.filter(c=>c.isCore).length,'Curated core'],[courses.filter(c=>!c.isCore).length,'Added by you'],[library?.extras?.length || 0,'Extra lessons']].map(([value,label])=><div key={label} className="rounded-2xl bg-white/10 p-3"><p className="text-2xl font-black">{value}</p><p className="mt-1 text-xs text-indigo-100">{label}</p></div>)}</div>
    </div>

    <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-extrabold text-slate-900">Your courses</h3><div className="flex flex-wrap gap-1.5">{['all','core','supporting','optional'].map(value=><button type="button" key={value} onClick={()=>setFilter(value)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter===value?'bg-indigo-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{value==='all'?'All':priorityNames[value]}</button>)}</div></div>
      <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">{shown.map(course=><article key={course.id} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/60 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${colors[course.priority]}`}>{priorityNames[course.priority]}</span><span className="text-[11px] font-bold text-slate-400">ACCOUNT {course.account} {course.isCore?'· BUILT-IN':''}</span></div><h4 className="mt-3 text-base font-extrabold leading-snug text-slate-900">{course.title}</h4><p className="mt-1 text-xs text-slate-500">{course.instructor || 'Instructor not entered'}</p><div className="mt-4 flex flex-wrap items-center gap-2">{(course.url || course.courseUrl) && <a href={course.url || course.courseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">Open Udemy <ExternalLink size={13}/></a>}{!course.isCore && <><label className="sr-only" htmlFor={`priority-${course.id}`}>Priority for {course.title}</label><select id={`priority-${course.id}`} disabled={busy} value={course.priority} onChange={event=>updatePriority(course,event.target.value)} className="max-w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700"><option value="core">Core</option><option value="supporting">Supporting</option><option value="optional">Optional</option></select><button type="button" onClick={()=>setEditing({ id:course.id, title:course.title, instructor:course.instructor || '', url:course.url || '', category:course.category || 'general' })} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50"><Pencil size={13}/>Edit</button><button type="button" disabled={busy} onClick={()=>archive(course)} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"><Archive size={13}/>Archive</button></>}</div></article>)}</div>
      {editing && <form onSubmit={editCourse} className="mt-4 grid gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:grid-cols-2"><h4 className="text-sm font-extrabold text-indigo-900 sm:col-span-2">Edit course details</h4><label className="text-xs font-bold text-slate-600 sm:col-span-2">Title<input required minLength={3} maxLength={160} className={input} value={editing.title} onChange={event=>setEditing(f=>({...f,title:event.target.value}))}/></label><label className="text-xs font-bold text-slate-600">Instructor<input maxLength={100} className={input} value={editing.instructor} onChange={event=>setEditing(f=>({...f,instructor:event.target.value}))}/></label><label className="text-xs font-bold text-slate-600">Udemy URL<input type="url" className={input} value={editing.url} onChange={event=>setEditing(f=>({...f,url:event.target.value}))}/></label><label className="text-xs font-bold text-slate-600 sm:col-span-2">Category<select className={input} value={editing.category} onChange={event=>setEditing(f=>({...f,category:event.target.value}))}>{categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label><button type="submit" disabled={busy} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Save changes</button><button type="button" onClick={()=>setEditing(null)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">Cancel</button></form>}
      {!shown.length && <p className="mt-4 text-sm text-slate-500">No courses in this category yet.</p>}
    </section>

    <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6" id="skillforge-add-course"><div className="flex items-center gap-2 text-indigo-700"><PlusCircle size={21}/><h3 className="text-lg font-extrabold text-slate-900">Add a Udemy course</h3></div><p className="mt-2 text-xs leading-5 text-slate-500">Add a course title even if you haven't copied its Udemy link yet. This does not automatically import private Udemy videos.</p>
      <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold text-slate-600 sm:col-span-2">Course name *<input required minLength={3} maxLength={160} className={input} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Machine Learning in Tamil"/></label>
        <label className="text-xs font-bold text-slate-600">Instructor (optional)<input maxLength={100} className={input} value={form.instructor} onChange={e=>setForm(f=>({...f,instructor:e.target.value}))} placeholder="Instructor name"/></label>
        <label className="text-xs font-bold text-slate-600">Udemy course URL (optional)<input type="url" className={input} value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))} placeholder="https://www.udemy.com/course/..."/></label>
        <label className="text-xs font-bold text-slate-600">Account<select className={input} value={form.account} onChange={e=>setForm(f=>({...f,account:e.target.value}))}><option value="1">Udemy Account 1</option><option value="2">Udemy Account 2</option></select></label>
        <label className="text-xs font-bold text-slate-600">Priority<select className={input} value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}><option value="core">Core · must learn</option><option value="supporting">Supporting · selected lessons</option><option value="optional">Optional · reference only</option></select></label>
        <label className="text-xs font-bold text-slate-600 sm:col-span-2">Skill category<select className={input} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{categories.map(item=><option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <button type="submit" disabled={busy} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 sm:col-span-2"><PlusCircle size={17}/>{busy?'Saving…':'Add course to my library'}</button>
      </form>
      {error && <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{notice && <p role="status" className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}
    </section>

    <section className="rounded-[22px] border border-slate-200 bg-white p-4 sm:p-6"><div className="flex items-center gap-2"><Sparkles className="text-amber-500" size={20}/><h3 className="text-lg font-extrabold text-slate-900">Suggested courses from your earlier review</h3></div><p className="mt-2 text-xs leading-5 text-slate-500">These seven names were previously discussed, but their complete syllabi and individual lesson URLs have not been imported. Tap a suggestion to prefill the form—not to auto-enroll.</p><div className="mt-4 grid gap-2 md:grid-cols-2">{(library?.suggestions || []).map(item=><button key={item.title} type="button" disabled={courses.some(c=>c.title.toLowerCase()===item.title.toLowerCase())} onClick={()=>useSuggestion(item)} className="flex min-w-0 items-start justify-between gap-2 rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50 disabled:cursor-default disabled:opacity-45"><span className="min-w-0"><span className="block text-sm font-bold text-slate-800">{item.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.note}</span></span><PlusCircle className="mt-0.5 shrink-0 text-indigo-500" size={18}/></button>)}</div></section>

    <button type="button" onClick={onGoSmart} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#141d43] px-5 py-4 text-sm font-bold text-white hover:bg-indigo-700">Choose extra lessons in Smart Learning <ArrowRight size={18}/></button>
  </div>;
}
