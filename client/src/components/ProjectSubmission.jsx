import {
  useState,useEffect
} from 'react';
import {
  api
} from '../api/api';
export default function ProjectSubmission( {
  day,reload,capabilities
}) {
  const [code,setCode]=useState(day.project?.submission||''),
  [name,setName]=useState(day.project?.filename||''),
  [busy,setBusy]=useState(false),[err,setErr]=useState(''),
  [checks,setChecks]=useState([]);
  useEffect(()=>{
    setCode(day.project?.submission||'');
    setName(day.project?.filename||'');
    setChecks([]);
    setErr('');
  },[day.day]);
  const upload=e=> {
    const f=e.target.files?.[0];
    if(!f)return;
    if(f.size>1000000) {
      setErr('File too large. Upload a main code file under 1 MB.');
      return
    }const r=new FileReader();
    r.onload=()=> {
      setCode(String(r.result||''));
      setName(f.name);
      setErr('')
    };
    r.readAsText(f)
  };
  const submit=async()=> {
    setBusy(true);
    setErr('');
    try {
      await api(`/days/${day.day}/project/submit`,
      {
        method:'POST',body:JSON.stringify( {
          code,filename:name||'pasted-code'
        })
      });
      await reload()
    }catch(e) {
      setErr(e.message)
    }finally {
      setBusy(false)
    }
  };
  const submitSelfReview=async()=>{
    setBusy(true);
    setErr('');
    try{
      await api(`/days/${day.day}/project/self-review`,{
        method:'POST',body:JSON.stringify({
          code,filename:name||'pasted-code',confirmations:checks
        })
      });
      await reload();
    }catch(e){setErr(e.message);}
    finally{setBusy(false);}
  };
  const p=day.project|| {
  };
  return <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="flex flex-wrap justify-between gap-2"><div><p className="text-xs font-bold text-violet-300">PROJECT TASK · DAY {
    day.day
  }</p><h3 className="mt-1 text-xl font-bold"> {
    p.title||'Project'
  }</h3></div><b className= {
    ['passed','self-reviewed'].includes(p.status)?'text-emerald-400':p.status==='failed'?'text-red-400':'text-amber-300'
  }> {
    (p.status||'not-started').toUpperCase()
  }</b></div><div className="mt-3 text-sm text-slate-300"> {
    (p.requirements||[]).map((x,i)=><p key= {
      i
    }>• {
      x
    }</p>)
  }</div><p className="mt-4 text-xs text-slate-500">Only the task is shown. Build the answer yourself,
   then upload or paste your code for review.</p><input type="file" accept=".py,.js,.jsx,.ts,.tsx,.json,.html,.css,.md,.txt" onChange= {
    upload
  } className="mt-4 block w-full text-sm"/><textarea value= {
    code
  } onChange= {
    e=>setCode(e.target.value)
  } placeholder="Paste your project code here..." className="mt-3 min-h-56 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-sm"/><button disabled= {
    busy||!code.trim()||!capabilities?.openaiConfigured
  } onClick= {
    submit
  } className="mt-3 rounded-xl bg-violet-500 px-4 py-2 font-bold disabled:opacity-50"> {
    busy?'AI reviewing…':p.status==='failed'?'Upload correction & recheck':'Submit for AI review'
  }</button> {
    !capabilities?.openaiConfigured&&<p className="mt-3 text-sm text-amber-300">OpenAI API is not configured. You can complete the project with the free self-check below. Self-check is not AI verification.</p>
  }<div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 p-4"><h4 className="font-bold">Free offline project self-check</h4><p className="mt-1 text-xs text-slate-400">Run and test your code first. Then confirm each requirement yourself. This is not graded by AI.</p><div className="mt-3 space-y-2">{(p.requirements||[]).map((requirement,i)=><label key={i} className="flex items-start gap-2 text-sm"><input type="checkbox" checked={checks[i]||false} onChange={e=>setChecks(previous=>(p.requirements||[]).map((_,index)=>index===i?e.target.checked:!!previous[index]))} className="mt-1"/><span>{requirement}</span></label>)}</div><button type="button" disabled={busy||code.trim().length<20||checks.length!==(p.requirements||[]).length||!checks.every(Boolean)} onClick={submitSelfReview} className="mt-3 rounded-xl border border-emerald-500 px-4 py-2 font-bold text-emerald-300 disabled:opacity-40">{busy?'Saving…':'Save self-check & continue'}</button></div> {
    err&&<p className="mt-3 text-sm text-red-400"> {
      err
    }</p>
  } {
    p.attempts?.length>0&&<div className="mt-4 rounded-xl bg-slate-950 p-4"><p className="font-bold">Latest review · {
      p.score
    }/100</p><p className="mt-2 text-sm text-slate-300"> {
      p.feedback
    }</p> {
      p.corrections?.length>0&&<div className="mt-3"><b className="text-sm">Fix and resubmit:</b> {
        p.corrections.map((x,i)=><p className="mt-1 text-sm text-amber-200" key= {
          i
        }> {
          i+1
        }. {
          x
        }</p>)
      }</div>
    }<p className="mt-3 text-xs text-slate-500">Attempts: {
      p.attempts.length
    } · Pass mark: 70</p></div>
  } {
    ['passed','self-reviewed'].includes(p.status)&&<p className="mt-4 font-bold text-emerald-400">{p.status==='passed'?'AI review passed':'Self-check complete (not AI verified)'} ✓ Submit Day to unlock the next day.</p>
  }</section>
}
