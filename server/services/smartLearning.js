// Local, explainable study planning. No Udemy scraping or paid AI service.
import { PATH_COURSES, PATH_DAYS, PATH_LESSONS } from '../data/pathCurriculum.js';

export const SKILL_AREAS = [
  { id: 'python', label: 'Python', hint: 'Write, debug and test Python applications' },
  { id: 'sql', label: 'SQL & data', hint: 'Query, clean and prepare data' },
  { id: 'ml', label: 'Machine Learning', hint: 'Train and evaluate conventional ML models' },
  { id: 'llm', label: 'LLM Engineering', hint: 'Build useful model-backed applications' },
  { id: 'rag', label: 'RAG & vectors', hint: 'Retrieve, ground and evaluate answers' },
  { id: 'agents', label: 'AI Agents & MCP', hint: 'Integrate tools and agent workflows safely' },
  { id: 'deployment', label: 'Cloud & DevOps', hint: 'Deploy, secure, test and monitor services' },
  { id: 'evaluation', label: 'AI evaluation', hint: 'Measure quality, reliability and safety' },
  { id: 'fullstack', label: 'API & full-stack', hint: 'Ship a working application and interface' }
];

export const COURSE_SUGGESTIONS = [
  { title: 'Machine Learning in Tamil', priority: 'supporting', category: 'ml', note: 'Complete the useful ML foundation sections you already started' },
  { title: 'Machine Learning A–Z 2026', priority: 'optional', category: 'ml', note: 'Alternative ML explanations; avoid repeating the Tamil course' },
  { title: 'ML Deployment & n8n AI Agents – தமிழ்', priority: 'supporting', category: 'deployment', note: 'Use for hands-on deployment and workflow practice' },
  { title: 'AWS Cloud Practitioner 2026', priority: 'supporting', category: 'deployment', note: 'Use the cloud fundamentals relevant to your projects' },
  { title: 'Full Stack MERN & GenAI 2026', priority: 'optional', category: 'fullstack', note: 'Use when building an AI app frontend or backend' },
  { title: 'Decoding DevOps with AI', priority: 'supporting', category: 'deployment', note: 'Prioritize Docker, CI/CD and deployment lessons' },
  { title: 'Complete Full-Stack Web Development Bootcamp', priority: 'optional', category: 'fullstack', note: 'Reuse your nearly completed web development knowledge' }
];

export function validCourseUrl(raw) {
  if (!raw) return true; // Allow courses known by title until the learner pastes the URL.
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' &&
      (url.hostname === 'udemy.com' || url.hostname.endsWith('.udemy.com')) &&
      /^\/course\/[^/]+\/?/.test(url.pathname);
  } catch { return false; }
}

export function validLectureOrCourseUrl(raw) {
  return !raw || validCourseUrl(raw);
}

export function sameUdemyCourse(videoUrl, courseUrl) {
  if (!videoUrl || !courseUrl) return true;
  if (!validLectureOrCourseUrl(videoUrl) || !validCourseUrl(courseUrl)) return false;
  const slug = value => new URL(value).pathname.match(/^\/course\/([^/]+)/)?.[1]?.toLowerCase();
  return Boolean(slug(videoUrl) && slug(videoUrl) === slug(courseUrl));
}

const patterns = [
  ['sql', /\bsql\b|postgres|mysql|database quer|\bjoins?\b|data cleaning/i],
  ['python', /\bpython\b|pandas|numpy|fastapi|pytest|\bpip\b/i],
  ['rag', /\brag\b|retriev|vector store|chunking|rerank|knowledge base|semantic search/i],
  ['agents', /\bagents?\b|langgraph|crewai|tool.call|\bmcp\b|autogen|multi.agent|workflow/i],
  ['deployment', /deploy|docker|\baws\b|cloud|terraform|kubernetes|ci\/cd|serverless|lambda|monitor|production|devops|observab/i],
  ['evaluation', /evaluat|benchmark|test set|guardrail|prompt injection|faithfulness|metrics/i],
  ['ml', /machine learning|regression|classification|scikit|feature engineering|train.test|neural network|fine.tun|\blora\b|\bqlora\b/i],
  ['fullstack', /react|node\.js|express|next\.js|frontend|backend|\bapi\b|\bmern\b|web development/i],
  ['llm', /\bllm\b|language model|inference|transformer|tokeniz|prompt|ollama|gemini|openai|\bgpt\b|generative ai/i]
];

export function skillForTitle(title) {
  return patterns.find(([, pattern]) => pattern.test(title || ''))?.[0] || 'general';
}

const STOP = new Set('the a an and or to of in on for with by how why what is are do using use build building create creating from your my our this that intro introduction basics beginner fundamentals overview tutorial course video lesson day part step ai engineer engineering complete practical hands hands-on project learn learning'.split(' '));
export function titleTokens(title) {
  return [...new Set(String(title || '').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').split(/\s+/)
    .filter(word => word.length > 1 && !STOP.has(word) && !/^\d+$/.test(word)))];
}

export function possibleOverlaps(lesson, candidates = PATH_LESSONS, limit = 3) {
  const first = titleTokens(lesson.title);
  if (!first.length) return [];
  return candidates.filter(item => item.id !== lesson.id).map(item => {
    const second = titleTokens(item.title);
    const common = first.filter(word => second.includes(word)).length;
    const ratio = common / Math.max(1, Math.min(first.length, second.length));
    const exact = first.length === second.length && common === first.length;
    return { id: item.id, title: item.title, course: item.course || '', common, ratio, exact };
  }).filter(item => item.exact || (item.common >= 2 && item.ratio >= .66))
    .sort((a, b) => Number(b.exact) - Number(a.exact) || b.ratio - a.ratio)
    .slice(0, limit).map(({ id, title, course }) => ({ id, title, course }));
}

const QUIZ_MINUTES = 30;
const CAREER_MINUTES = 20;
const MINIMUM_CODING_MINUTES = 35;
export function dailyBudget(day, extras = []) {
  const videoMinutes = Math.ceil(day.lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0) / 60);
  const baseCodingMinutes = Math.max(0, 240 - videoMinutes - QUIZ_MINUTES - CAREER_MINUTES);
  const extraCapacity = Math.max(0, baseCodingMinutes - MINIMUM_CODING_MINUTES);
  const allocated = [];
  let extraMinutes = 0;
  for (const item of extras.filter(item => item.assignedDay === day.day && !item.skippedAt && !item.archivedAt)) {
    const fits = extraMinutes + item.durationMinutes <= extraCapacity;
    allocated.push({ id: item.id, title: item.title, minutes: item.durationMinutes, fits });
    if (fits) extraMinutes += item.durationMinutes;
  }
  return {
    day: day.day, targetMinutes: 240, videoMinutes, quizMinutes: QUIZ_MINUTES,
    careerMinutes: CAREER_MINUTES, extraMinutes,
    codingMinutes: baseCodingMinutes - extraMinutes,
    extraCapacity, extraRemainingMinutes: extraCapacity - extraMinutes,
    allocations: allocated
  };
}

export function findDayForExtra(lesson, extras = [], startingDay = 1) {
  const start = Math.max(1, Number(startingDay) || 1);
  for (const day of PATH_DAYS.slice(start - 1)) {
    if (dailyBudget(day, extras).extraRemainingMinutes >= lesson.durationMinutes) return day.day;
  }
  return null;
}

export function skillChecklist(progressRecords = [], customLessons = []) {
  const records = new Map(progressRecords.map(record => [record.lessonId, record]));
  const lessons = [
    ...PATH_LESSONS,
    ...customLessons.filter(item => !item.skippedAt && !item.archivedAt).map(item => ({ ...item, course: 'Extra learning' }))
  ];
  return SKILL_AREAS.map(area => {
    const relevant = lessons.filter(item => (item.category || skillForTitle(item.title)) === area.id);
    const watched = relevant.filter(item => records.get(item.id)?.watchedAt).length;
    const passed = relevant.filter(item => records.get(item.id)?.quizAttempts?.some(a => a.total && a.score / a.total >= .8)).length;
    return { ...area, trackedLessons: relevant.length, watched, quizzesPassed: passed };
  });
}

export function serializeLibrary(state) {
  const customCourses = (state.customCourses || []).filter(item => !item.archivedAt);
  const customLessons = (state.customLessons || []).filter(item => !item.archivedAt);
  const records = new Map((state.lessons || []).map(record => [record.lessonId, record]));
  const coreCourses = PATH_COURSES.map(course => ({ ...course, priority: 'core', isCore: true, url: course.courseUrl }));
  const plain = item => typeof item.toObject === 'function' ? item.toObject() : item;
  const courses = [...coreCourses, ...customCourses.map(course => ({ ...plain(course), isCore: false }))];
  const extras = customLessons.map(item => {
    const lesson = plain(item);
    const record = records.get(lesson.id);
    return {
      ...lesson,
      watched: Boolean(record?.watchedAt),
      quizPassed: Boolean(record?.quizAttempts?.some(a => a.total && a.score / a.total >= .8)),
      overlaps: possibleOverlaps(lesson, [...PATH_LESSONS, ...customLessons]),
      courseTitle: courses.find(course => course.id === lesson.courseId)?.title || 'Extra course'
    };
  });
  return {
    courses, extras, suggestions: COURSE_SUGGESTIONS,
    skillChecklist: skillChecklist(state.lessons || [], customLessons),
    dayBudgets: PATH_DAYS.map(day => dailyBudget(day, customLessons))
  };
}
