import {
  Router
} from "express";
import Day from "../models/Day.js";
import Doubt from "../models/Doubt.js";
import {
  githubToday
} from "../services/githubService.js";
import {
  mentor,answerDoubt,reviewProject
} from "../services/openaiService.js";
const router=Router();
const stats=days=> {
  const total=days.reduce((n,d)=>n+d.tasks.length,
  0),done=days.reduce((n,d)=>n+d.tasks.filter(t=>t.completed).length,
  0),completedDays=days.filter(d=>d.tasks.length&&d.tasks.every(t=>t.completed)).length,
  totalMinutes=days.reduce((n,d)=>n+(d.studyMinutes||0),
  0),current=days.find(d=>d.tasks.some(t=>!t.completed))||days.at(-1)||null;
  let streak=0;
  for(const d of days) {
    if(d.tasks.length&&d.tasks.every(t=>t.completed))streak++;
    else if(d.day<=(current?.day||1))streak=0;
    else break
  }const quiz=days.flatMap(d=>d.quizAttempts||[]),
  quizAccuracy=quiz.length?Math.round(quiz.reduce((n,
  a)=>n+a.score,0)/quiz.reduce((n,a)=>n+a.total,
  0)*100):0;
  return {
    totalTasks:total,completedTasks:done,completedDays,
    totalMinutes,current,completion:total?Math.round(done/total*100):0,
    streak,quizAccuracy,strikeRate:Math.round(((total?done/total:0)*.6+(quizAccuracy/100)*.4)*100)
  }
};
router.get('/days',async(req,res)=>res.json(await Day.find().sort( {
  day:1
})));
router.get('/days/:day',async(req,res)=> {
  const d=await Day.findOne( {
    day:+req.params.day
  });
  d?res.json(d):res.status(404).json( {
    error:'Day not found'
  })
});
router.get('/dashboard',async(req,res)=> {
  try {
    const days=await Day.find().sort( {
      day:1
    });
    res.json( {
      days,...stats(days)
    })
  }catch {
    res.status(500).json( {
      error:'Failed to load dashboard'
    })
  }
});
router.patch('/days/:day/task/:id',async(req,
res)=> {
  const d=await Day.findOne( {
    day:+req.params.day
  });
  const t=d?.tasks.id(req.params.id);
  if(!t)return res.status(404).json( {
    error:'Task not found'
  });
  t.completed=!!req.body.completed;
  await d.save();
  res.json(d)
});
router.patch('/days/:day/video/:id',async(req,
res)=> {
  const d=await Day.findOne( {
    day:+req.params.day
  });
  const v=d?.videos.id(req.params.id);
  if(!v)return res.status(404).json( {
    error:'Video not found'
  });
  v.completed=!!req.body.completed;
  await d.save();
  res.json(d)
});
router.patch('/days/:day/time',async(req,
res)=> {
  const d=await Day.findOneAndUpdate( {
    day:+req.params.day
  }, {
    $set: {
      studyMinutes:Math.max(0,+req.body.studyMinutes||0)
    }
  }, {
    new:true
  });
  d?res.json(d):res.status(404).json( {
    error:'Day not found'
  })
});
router.post('/days/:day/quiz',async(req,
res)=> {
  const d=await Day.findOne( {
    day:+req.params.day
  });
  if(!d)return res.status(404).json( {
    error:'Day not found'
  });
  const answers=req.body.answers||[],wrong=[];
  let score=0;
  d.mcqs.forEach((q,i)=>answers[i]===q.answer?score++:wrong.push(i));
  d.quizAttempts.push( {
    answers,score,total:d.mcqs.length,wrong
  });
  await d.save();
  res.json( {
    score,total:d.mcqs.length,wrong,attempts:d.quizAttempts
  })
});
router.patch('/days/:day/project',async(req,
res)=> {
  const d=await Day.findOneAndUpdate( {
    day:+req.params.day
  }, {
    $set: {
      'project.status':req.body.status||'not-started',
      'project.githubUrl':req.body.githubUrl||''
    }
  }, {
    new:true
  });
  res.json(d)
});
router.post('/days/:day/project/submit',
async(req,res)=> {
  try {
    const n=+req.params.day,d=await Day.findOne( {
      day:n
    });
    if(!d)return res.status(404).json( {
      error:'Day not found'
    });
    if(n>1) {
      const prev=await Day.findOne( {
        day:n-1
      });
      if(!prev?.daySubmitted)return res.status(403).json( {
        error:`Submit Day ${n-1} to unlock Day ${n}`
      })
    }const code=String(req.body.code||'').trim(),
    filename=String(req.body.filename||'pasted-code');
    if(!code)return res.status(400).json( {
      error:'Paste or upload your project code first'
    });
    if(code.length>30000)return res.status(400).json( {
      error:'Code is too large. Submit the main project file under 30,000 characters.'
    });
    d.project.status='reviewing';
    d.project.submission=code;
    d.project.filename=filename;
    await d.save();
    const r=await reviewProject(d,code,filename);
    d.project.score=r.score;
    d.project.status=r.passed?'passed':'failed';
    d.project.feedback=r.feedback||'';
    d.project.corrections=r.corrections||[];
    d.project.attempts.push( {
      score:r.score,passed:r.passed,feedback:r.feedback||'',
      corrections:r.corrections||[]
    });
    await d.save();
    res.json( {
      project:d.project,nextDayUnlocked:r.passed
    })
  }catch(e) {
    res.status(500).json( {
      error:e.message||'Project review failed'
    })
  }
});
router.post('/days/:day/submit',async(req,
res)=> {
  const n=+req.params.day,d=await Day.findOne( {
    day:n
  });
  if(!d)return res.status(404).json( {
    error:'Day not found'
  });
  if(n>1) {
    const prev=await Day.findOne( {
      day:n-1
    });
    if(!prev?.daySubmitted)return res.status(403).json( {
      error:`Submit Day ${n-1} first`
    })
  }const videosDone=d.videos.every(v=>v.completed),
  tasksDone=d.tasks.every(t=>t.completed),
  best=d.quizAttempts.length?Math.max(...d.quizAttempts.map(a=>a.total?Math.round(a.score/a.total*100):0)):0,
  mcqPassed=d.mcqs.length===0||best>=70,projectPassed=d.project?.status==='passed';
  const pending=[];
  if(!videosDone)pending.push('Complete all course videos');
  if(!tasksDone)pending.push('Complete all daily tasks');
  if(!mcqPassed)pending.push('Pass MCQ with at least 70%');
  if(!projectPassed)pending.push('Pass AI project review');
  if(pending.length)return res.status(400).json( {
    error:'Day is not ready to submit',pending
  });
  d.daySubmitted=true;
  d.submittedAt=new Date();
  await d.save();
  res.json( {
    message:`Day ${n} completed. Day ${n+1} unlocked.`,
    day:d
  })
});
router.post('/days/:day/reset',async(req,
res)=> {
  const d=await Day.findOne( {
    day:+req.params.day
  });
  if(!d)return res.status(404).json( {
    error:'Day not found'
  });
  d.videos.forEach(v=>v.completed=false);
  d.tasks.forEach(t=>t.completed=false);
  d.quizAttempts=[];
  d.studyMinutes=0;
  d.score=0;
  d.feedback='';
  d.daySubmitted=false;
  d.submittedAt=null;
  if(d.project) {
    d.project.status='not-started';
    d.project.githubUrl='';
    d.project.submission='';
    d.project.filename='';
    d.project.score=0;
    d.project.feedback='';
    d.project.corrections=[];
    d.project.attempts=[]
  }await d.save();
  res.json( {
    message:`Day ${d.day} reset successfully`,
    day:d
  })
});
router.get('/doubts',async(req,res)=>res.json(await Doubt.find().sort( {
  createdAt:-1
}).limit(30)));
router.post('/doubt',async(req,res)=> {
  const d=await Day.findOne( {
    day:+req.body.day
  });
  if(!d)return res.status(404).json( {
    error:'Day not found'
  });
  const answer=await answerDoubt(d,req.body.question);
  res.json(await Doubt.create( {
    day:d.day,topic:d.topic,question:req.body.question,
    answer
  }))
});
router.get('/github',async(req,res)=> {
  try {
    res.json(await githubToday())
  }catch {
    res.status(500).json( {
      error:'Failed to load GitHub activity'
    })
  }
});
router.post('/days/:day/score',async(req,
res)=> {
  try {
    const d=await Day.findOne( {
      day:+req.params.day
    });
    let git= {
      commits:0
    };
    try {
      git=await githubToday()
    }catch {
    }const r=await mentor(d,git);
    d.score=Math.max(0,Math.min(100,+r.score||0));
    d.feedback=r.feedback||'';
    await d.save();
    res.json(d)
  }catch(e) {
    res.status(500).json( {
      error:e.message||'AI evaluation failed'
    })
  }
});
export default router;
