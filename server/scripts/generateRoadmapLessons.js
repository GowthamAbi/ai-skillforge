import 'dotenv/config';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import { AI_PHASES, flattenTopics } from '../../client/src/data/aiRoadmap.js';
import GeneratedRoadmapLesson from '../models/GeneratedRoadmapLesson.js';

const apiKey = process.env.OPENAI_API_KEY?.trim();
if (!apiKey) throw new Error('OPENAI_API_KEY is missing. Add it to the server environment; never put it in frontend code.');
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing.');

const openai = new OpenAI({ apiKey });
const model = process.env.OPENAI_MODEL || 'gpt-5.6-mini';
const topics = flattenTopics();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function promptFor(topic) {
  return `Create one complete, original, technically accurate lesson for an AI/software engineering curriculum.
Topic: ${topic.title}
Phase: ${topic.phaseTitle}
Course: ${topic.groupTitle}
Section: ${topic.sectionTitle}

Return ONLY valid JSON with this exact shape:
{
 "outcomes": ["5 measurable learning outcomes"],
 "theory": [{"heading":"Detailed concept heading","body":"A substantial teaching explanation: definition, how it works, when/why used, important details and limitations. 120-180 words.","example":"A worked concrete example with values and interpretation."}],
 "flow": ["6-8 ordered steps"],
 "codeExamples": [
  {"language":"python","code":"complete runnable Python example","expectedOutput":"exact output","explanation":"Explain the implementation"},
  {"language":"javascript","code":"complete runnable Node.js example","expectedOutput":"exact output","explanation":"Explain the implementation"},
  {"language":"java","code":"complete runnable Java class Main example","expectedOutput":"exact output","explanation":"Explain the implementation"}
 ],
 "tasks": [
  {"level":"Easy","prompt":"topic-specific coding task","hint":"useful hint","starterCode":"valid starter code in Python","testCases":[{"input":"","expectedOutput":"exact expected output"}]},
  {"level":"Medium","prompt":"more challenging topic-specific task","hint":"useful hint","starterCode":"valid starter code in Python","testCases":[{"input":"","expectedOutput":"exact expected output"}]},
  {"level":"Practical","prompt":"real-world scenario using garment/elastic production, quality, machine downtime, or delivery where relevant; otherwise a domain-appropriate AI task","hint":"useful hint","starterCode":"valid starter code in Python","testCases":[{"input":"","expectedOutput":"exact expected output"}]}
 ],
 "quiz": [
  {"question":"topic-specific question","options":["A","B","C","D"],"answer":0,"explanation":"why this is correct"}
 ],
 "revisionSummary":"Concise but meaningful recap of the core ideas"
}
Requirements:
- Exactly 6 theory sections; each body must teach this specific topic, not generic study advice.
- Exactly 3 code examples, one per requested language, each runnable as provided. Java must use public class Main.
- Exactly 3 tasks, each specific to this topic, with at least 2 deterministic test cases.
- Exactly 5 quiz questions; each must test this topic, with one unambiguous correct answer.
- Avoid placeholders, TODO, pseudocode, fabricated libraries/APIs, and generic filler.
- Use realistic examples, explain edge cases and common mistakes.
- Keep each language's code and expected output internally consistent.
- Return JSON only.`;
}

await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || 'aitraning' });
console.log(`Generating ${topics.length} lessons with ${model}. Existing lessons will be skipped.`);
let generated = 0, skipped = 0, failed = 0;
for (let index = 0; index < topics.length; index++) {
  const topic = topics[index];
  if (await GeneratedRoadmapLesson.exists({ topicId: topic.id })) {
    skipped++;
    continue;
  }
  let saved = false;
  for (let attempt = 1; attempt <= 3 && !saved; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a senior technical educator and coding assessment author. Produce precise, executable, topic-specific learning material.' },
          { role: 'user', content: promptFor(topic) }
        ]
      });
      const content = response.choices?.[0]?.message?.content;
      if (!content) throw new Error('Model returned an empty response');
      const lesson = JSON.parse(content);
      if (!Array.isArray(lesson.theory) || lesson.theory.length !== 6 ||
          !Array.isArray(lesson.codeExamples) || lesson.codeExamples.length !== 3 ||
          !Array.isArray(lesson.tasks) || lesson.tasks.length !== 3 ||
          !Array.isArray(lesson.quiz) || lesson.quiz.length !== 5) {
        throw new Error('Generated lesson failed structural validation');
      }
      for (const language of ['python', 'javascript', 'java']) {
        if (!lesson.codeExamples.some(item => item.language === language && item.code && item.expectedOutput !== undefined)) {
          throw new Error(`Missing executable ${language} example`);
        }
      }
      if (lesson.tasks.some(item => !Array.isArray(item.testCases) || item.testCases.length < 2)) {
        throw new Error('Each task must include at least two test cases');
      }
      await GeneratedRoadmapLesson.updateOne(
        { topicId: topic.id },
        { $set: { topicId: topic.id, title: topic.title, phaseTitle: topic.phaseTitle, groupTitle: topic.groupTitle, sectionTitle: topic.sectionTitle, ...lesson, generatedAt: new Date(), model } },
        { upsert: true, runValidators: true }
      );
      generated++;
      saved = true;
      console.log(`[${index + 1}/${topics.length}] SAVED ${topic.id} — ${topic.title}`);
    } catch (error) {
      console.error(`[${index + 1}/${topics.length}] attempt ${attempt} failed for ${topic.title}:`, error.message);
      if (attempt < 3) await sleep(attempt * 2500);
    }
  }
  if (!saved) failed++;
  await sleep(350);
}
console.log(JSON.stringify({ total: topics.length, generated, skipped, failed }));
await mongoose.disconnect();
if (failed) process.exitCode = 1;
