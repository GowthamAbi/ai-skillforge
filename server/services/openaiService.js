import OpenAI from 'openai';
export async function mentor(day,github){
 if(!process.env.OPENAI_API_KEY) return {score:0,feedback:'Add OPENAI_API_KEY to enable AI mentor scoring.'};
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const prompt=`You are an AI engineering study mentor. Score this day 0-100. Topic: ${day.topic}. Study minutes: ${day.studyMinutes}. Tasks: ${day.tasks.map(t=>`${t.title}:${t.completed}`).join(', ')}. GitHub: ${JSON.stringify(github)}. Return concise JSON with score (number) and feedback (string).`;
 const r=await client.responses.create({model:process.env.OPENAI_MODEL||'gpt-5.6-luna',input:prompt});
 try{return JSON.parse(r.output_text);}catch{return {score:0,feedback:r.output_text};}
}
