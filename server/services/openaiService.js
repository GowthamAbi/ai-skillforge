import OpenAI from "openai";
const client=()=>process.env.OPENAI_API_KEY?new OpenAI( {
  apiKey:process.env.OPENAI_API_KEY
}):null;
export async function askTutor(message, history = []) {
  const c = client();
  if (!c) {
    const error = new Error("AI Tutor is not configured. Add OPENAI_API_KEY to the backend environment.");
    error.status = 503;
    throw error;
  }
  const safeHistory = history
    .filter(item => item && ["user", "assistant"].includes(item.role) && typeof item.text === "string")
    .slice(-10)
    .map(item => ({ role: item.role, content: item.text.slice(0, 4000) }));
  const response = await c.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    instructions: "You are the AI SkillForge personal tutor. Teach AI, Python, data science, machine learning, deep learning, NLP and generative AI clearly. Use practical examples, explain technical ideas step by step, point out mistakes kindly, and finish with one short check question when useful. Match the learner's language. Never claim to execute code; the Practice Lab is separate.",
    input: [...safeHistory, { role: "user", content: message.slice(0, 4000) }],
    max_output_tokens: 900
  });
  return response.output_text || "I couldn't generate a text response. Please try again.";
}

export async function mentor(day,github) {
  const c=client();
  if(!c)return {
    score:0,feedback:"Add OPENAI_API_KEY to enable AI mentor scoring."
  };
  const r=await c.responses.create( {
    model:process.env.OPENAI_MODEL||"gpt-5.5",
    input:`Score this study day 0-100. Return JSON {"score":number,"feedback":string}. Topic:${day.topic}; minutes:${day.studyMinutes}; tasks:${day.tasks.map(t=>`${t.title}:${t.completed}`).join(',')}; github:${JSON.stringify(github)}`
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
    model:process.env.OPENAI_MODEL||"gpt-5.5",
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
    model:process.env.OPENAI_MODEL||"gpt-5.5",
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
