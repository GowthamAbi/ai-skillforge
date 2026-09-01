import OpenAI from "openai";
const client=()=>process.env.OPENAI_API_KEY?new OpenAI( {
  apiKey:process.env.OPENAI_API_KEY
}):null;
export async function mentor(day,github) {
  const c=client();
  if(!c)return {
    score:0,feedback:"Add OPENAI_API_KEY to enable AI mentor scoring."
  };
  const r=await c.responses.create( {
    model:process.env.OPENAI_MODEL||"gpt-5.6-mini",
    input:`Score this study day 0-100. Return JSON {"score":number,"feedback":string}. Topic:${day.topic}; minutes:${day.studyMinutes}; tasks:${day.tasks.map(t=>`$ {
      t.title
    }:$ {
      t.completed
    }`).join(',')}; github:${JSON.stringify(github)}`
  });
  try {
    return JSON.parse(r.output_text)
  }catch {
    return {
      score:0,feedback:r.output_text
    }
  }
}
export async function answerDoubt(day,question) {
  const c=client();
  if(!c)return"Add OPENAI_API_KEY to enable doubt answers.";
  const r=await c.responses.create( {
    model:process.env.OPENAI_MODEL||"gpt-5.6-mini",
    input:`You are a practical AI engineering tutor. Course:${day.course}; Topic:${day.topic}. Answer simply with concept, small example, interview point and one check question. Doubt:${question}`
  });
  return r.output_text
}
export async function reviewProject(day,
code,filename) {
  const c=client();
  if(!c)return {
    score:0,passed:false,feedback:"Add OPENAI_API_KEY to review projects.",
    corrections:["AI review is not configured."]
  };
  const input=`Review a learner project. NEVER provide the full corrected solution/code. Only assess the submitted code, identify problems and give concise hints for the learner to fix and resubmit. Pass only at score >=70 and only if core requirements are met. Return ONLY JSON {"score":number,"passed":boolean,"feedback":string,"corrections":[string]}. Project:${day.project.title}. Topic:${day.topic}. Requirements:${(day.project.requirements||[]).join(' | ')}. Filename:${filename||'pasted-code'}. Submitted code:
${code.slice(0,30000)}`;
  const r=await c.responses.create( {
    model:process.env.OPENAI_MODEL||"gpt-5.6-mini",
    input
  });
  try {
    const x=JSON.parse(r.output_text);
    x.score=Math.max(0,Math.min(100,+x.score||0));
    x.passed=x.score>=70&&!!x.passed;
    return x
  }catch {
    return {
      score:0,passed:false,feedback:"Review response could not be parsed.",
      corrections:[r.output_text.slice(0,1000)]
    }
  }
}
