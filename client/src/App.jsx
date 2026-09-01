import {
  useEffect,useState
} from 'react';
import {
  api
} from './api/api';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Tasks from './pages/Tasks';
import Github from './pages/Github';
import Analytics from './pages/Analytics';
export default function App() {
  const [data,setData]=useState(null),[git,
  setGit]=useState(null),[page,setPage]=useState('dashboard'),
  [selectedDay,setSelectedDay]=useState(null),
  [busy,setBusy]=useState(false),[error,setError]=useState('');
  const load=async()=> {
    try {
      setError('');
      const d=await api('/dashboard');
      setData(d);
      try {
        setGit(await api('/github'))
      }catch {
        setGit( {
          configured:false,commits:0,repos:[]
        })
      }
    }catch(e) {
      setError(e.message)
    }
  };
  useEffect(()=> {
    load()
  },[]);
  if(error)return <div className="p-10 text-red-300"> {
    error
  }<button onClick= {
    load
  } className="ml-3 rounded bg-red-500 px-3 py-2 text-white">Retry</button></div>;
  if(!data)return <div className="p-10">Loading SkillForge…</div>;
  if(!data.current)return <div className="p-10">No roadmap found. Run <code>npm run seed</code> in server.</div>;
  const toggle=async(day,t)=> {
    await api(`/days/${day.day}/task/${t._id}`,
    {
      method:'PATCH',body:JSON.stringify( {
        completed:!t.completed
      })
    });
    await load()
  };
  const saveTime=async(day,minutes)=> {
    await api(`/days/${day.day}/time`, {
      method:'PATCH',body:JSON.stringify( {
        studyMinutes:minutes
      })
    });
    await load()
  };
  const score=async()=> {
    setBusy(true);
    try {
      await api(`/days/${data.current.day}/score`,
      {
        method:'POST'
      });
      await load()
    }finally {
      setBusy(false)
    }
  };
  const openDay=(n)=> {
    setSelectedDay(n);
    setPage('tasks')
  };
  const day=selectedDay?data.days.find(d=>d.day===selectedDay)||data.current:data.current;
  let content;
  if(page==='roadmap')content=<Roadmap days= {
    data.days
  } onSelect= {
    openDay
  }/>;
  else if(page==='tasks')content=<Tasks day= {
    day
  } onToggle= {
    toggle
  } onSaveTime= {
    saveTime
  } onBack= {
    ()=>setPage('dashboard')
  }/>;
  else if(page==='github')content=<Github git= {
    git
  } current= {
    data.current
  }/>;
  else if(page==='analytics')content=<Analytics data= {
    data
  }/>;
  else content=<Dashboard data= {
    data
  } git= {
    git
  } onToggle= {
    toggle
  } onSaveTime= {
    saveTime
  } onScore= {
    score
  } busy= {
    busy
  } setPage= {
    setPage
  } reload= {
    load
  }/>;
  return <div className="min-h-screen bg-slate-950 text-slate-100"><div className="mx-auto flex max-w-[1500px] flex-col gap-5 p-4 lg:flex-row lg:p-6"><Sidebar page= {
    page
  } setPage= {
    p=> {
      setPage(p);
      if(p!=='tasks')setSelectedDay(null)
    }
  }/><main className="min-w-0 flex-1"> {
    content
  }</main></div></div>
}
