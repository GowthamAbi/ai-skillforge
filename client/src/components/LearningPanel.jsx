import {
  useState
} from 'react';
import {
  api
} from '../api/api';
import ProjectSubmission from './ProjectSubmission';
export default function LearningPanel( {
  day,reload
}) {
  const [dayMsg,setDayMsg]=useState(''),[answers,
  setAnswers]=useState([]),[result,setResult]=useState(null),
  [q,setQ]=useState(''),[reply,setReply]=useState(''),
  [busy,setBusy]=useState(false);
  const submit=async()=> {
    const r=await api(`/days/${day.day}/quiz`,
    {
      method:'POST',body:JSON.stringify( {
        answers
      })
    });
    setResult(r);
    reload()
  };
  const ask=async()=> {
    if(!q.trim())return;
    setBusy(true);
    try {
      const r=await api('/doubt', {
        method:'POST',body:JSON.stringify( {
          day:day.day,question:q
        })
      });
      setReply(r.answer)
    }finally {
      setBusy(false)
    }
  };
  const submitDay=async()=> {
    setDayMsg("");
    try {
      const r=await api(`/days/${day.day}/submit`,
      {
        method:"POST"
      });
      setDayMsg(r.message);
      reload()
    }catch(e) {
      setDayMsg(e.message||"Complete all requirements first")
    }
  };
  const resetDay=async()=> {
    if(!confirm(`Reset Day ${day.day}? This clears current day progress.`))return;
    setAnswers([]);
    setResult(null);
    setDayMsg("");
    try {
      const r=await api(`/days/${day.day}/reset`,
      {
        method:"POST"
      });
      setDayMsg(r.message);
      reload()
    }catch(e) {
      setDayMsg(e.message||"Reset failed")
    }
  };
  return <div className="space-y-4"><ProjectSubmission day= {
    day
  } reload= {
    reload
  }/><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-xs font-bold text-cyan-400"> {
    day.course
  }</p><h3 className="mt-1 text-xl font-bold">Course videos</h3><div className="mt-3 space-y-2"> {
    day.videos.map(v=><label key= {
      v._id
    } className="flex gap-3 text-sm"><input type="checkbox" checked= {
      v.completed
    } onChange= {
      async()=> {
        await api(`/days/${day.day}/video/${v._id}`,
        {
          method:'PATCH',body:JSON.stringify( {
            completed:!v.completed
          })
        });
        reload()
      }
    }/><span className= {
      v.completed?'line-through text-slate-500':''
    }> {
      v.title
    } <b className="text-slate-500"> {
      v.duration
    }</b></span></label>)
  }</div></section><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="text-xl font-bold">MCQ + Recheck</h3> {
    day.mcqs.map((m,i)=><div className="mt-4" key= {
      i
    }><p className="font-semibold"> {
      i+1
    }. {
      m.question
    }</p> {
      m.options.map((o,j)=><label className="mt-1 block text-sm" key= {
        j
      }><input type="radio" name= {
        `q${i}`
      } className="mr-2" onChange= {
        ()=> {
          const a=[...answers];
          a[i]=j;
          setAnswers(a)
        }
      }/> {
        o
      }</label>)
    }</div>)
  }<button onClick= {
    submit
  } className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950">Submit / Recheck</button> {
    result&&<p className="mt-3">Score: <b> {
      result.score
    }/ {
      result.total
    }</b> · Wrong: {
      result.wrong.length
    }</p>
  }</section><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="text-xl font-bold">Ask AI Mentor</h3><textarea value= {
    q
  } onChange= {
    e=>setQ(e.target.value)
  } className="mt-3 min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950 p-3" placeholder= {
    `Ask a doubt about ${day.topic}...`
  }/><button onClick= {
    ask
  } disabled= {
    busy
  } className="mt-2 rounded-xl bg-violet-500 px-4 py-2 font-bold"> {
    busy?'Thinking…':'Ask doubt'
  }</button> {
    reply&&<p className="mt-4 whitespace-pre-wrap text-sm text-slate-300"> {
      reply
    }</p>
  }</section><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="text-xl font-bold">Finish Day {
    day.day
  }</h3><p className="mt-2 text-sm text-slate-400">Complete all videos,
   tasks, MCQ (70%+), and pass the project AI review. Only Submit Day unlocks the next day.</p><div className="mt-4 flex flex-wrap gap-3"><button onClick= {
    resetDay
  } className="rounded-xl border border-rose-700 px-4 py-2 font-bold text-rose-300">Reset Day</button><button onClick= {
    submitDay
  } disabled= {
    day.daySubmitted
  } className="rounded-xl bg-emerald-500 px-4 py-2 font-bold text-slate-950 disabled:opacity-50"> {
    day.daySubmitted?"Day Submitted ✓":"Submit Day"
  }</button></div> {
    dayMsg&&<p className="mt-3 whitespace-pre-wrap text-sm"> {
      dayMsg
    }</p>
  }</section></div>
}
