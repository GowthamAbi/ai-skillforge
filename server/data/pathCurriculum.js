import { roadmap } from './roadmap.js';

// Lecture names and durations come from the existing, reviewed 50-day roadmap.
// Udemy's internal lecture IDs were not included in that data; never fabricate them.
export const PATH_COURSES = [
  { id: 'tamil', source: 'Course 1 — AI & GenAI Foundations', title: 'Applied Generative AI: Inference to Agents – தமிழ்', instructor: 'Salman Faroz', account: 1, courseUrl: 'https://www.udemy.com/course/applied-generative-ai-inference-to-agents-tamil/', totalLectures: 75 },
  { id: 'core', source: 'Course 2 — LLM Engineering', title: 'AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents', instructor: 'Ed Donner · Ligency', account: 2, courseUrl: 'https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/', totalLectures: 210 },
  { id: 'agentic', source: 'Course 3 — Agentic AI Engineering', title: 'AI Engineer Agentic Track: The Complete Agent & MCP Course', instructor: 'Ed Donner · Ligency', account: 2, courseUrl: 'https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/', totalLectures: 132 },
  { id: 'production', source: 'Course 4 — Production AI', title: 'AI Engineer Production Track: Deploy LLMs & Agents at Scale', instructor: 'Ed Donner · Ligency', account: 2, courseUrl: 'https://www.udemy.com/course/generative-and-agentic-ai-in-production/', totalLectures: 124 }
];

export const PATH_MODULES = [
  { id: 'foundation', from: 1, to: 10, title: 'Tamil GenAI Foundations', brief: 'Build a RAG learning assistant with retrieved citations and a small interface.' },
  { id: 'llm', from: 11, to: 25, title: 'LLM Engineering', brief: 'Build a useful knowledge assistant with ingestion, retrieval, evaluation and a clear README.' },
  { id: 'agents', from: 26, to: 39, title: 'Agentic AI & MCP', brief: 'Build an agent with tools, observable actions and human approval for risky operations.' },
  { id: 'production', from: 40, to: 47, title: 'Production AI', brief: 'Deploy a secure containerized AI service with tests, monitoring and CI/CD.' },
  { id: 'capstone', from: 48, to: 50, title: 'Career Capstone', brief: 'Deliver a polished AI Engineer portfolio project, architecture diagram, deployment URL and demo.' }
];

const groups = new Map(PATH_COURSES.map(course => [course.source, { ...course, count: 0 }]));
const parseSeconds = duration => {
  const parts = String(duration || '0:00').split(':').map(Number);
  return parts.reduce((seconds, part) => seconds * 60 + (Number.isFinite(part) ? part : 0), 0);
};
export const PATH_DAYS = roadmap.map(day => {
  const course = groups.get(day.course);
  return {
    day: day.day,
    date: new Date(Date.UTC(2026, 9, 19 + day.day - 1)).toISOString().slice(0, 10),
    topic: day.topic,
    title: day.title,
    codeTask: day.project?.title || 'Portfolio and interview revision',
    moduleId: PATH_MODULES.find(m => day.day >= m.from && day.day <= m.to)?.id,
    lessons: day.videos.map(video => {
      course.count += 1;
      return {
        id: `${course.id}-${String(course.count).padStart(3, '0')}`,
        title: video.title,
        duration: video.duration,
        durationSeconds: parseSeconds(video.duration),
        // This is the order in the reviewed study roadmap, not a verified Udemy lecture ID.
        roadmapVideoNumber: course.count,
        courseId: course.id,
        course: course.title,
        instructor: course.instructor,
        courseUrl: course.courseUrl,
        account: course.account,
        section: `Study day ${day.day}: ${day.topic}`
      };
    })
  };
});

export const PATH_LESSONS = PATH_DAYS.flatMap(day => day.lessons);
export const LESSON_BY_ID = new Map(PATH_LESSONS.map(lesson => [lesson.id, lesson]));
export const COURSE_SUMMARY = PATH_COURSES.map(course => ({
  ...course,
  importedLectures: groups.get(course.source)?.count || 0
}));

export function validUdemyLectureLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'udemy.com' || url.hostname.endsWith('.udemy.com')) &&
      /^\/course\/[^/]+\/learn\/lecture\/\d+/.test(url.pathname);
  } catch { return false; }
}
