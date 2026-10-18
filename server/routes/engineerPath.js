import { Router } from 'express';
import EngineerJourney from '../models/EngineerJourney.js';
import { COURSE_SUMMARY, LESSON_BY_ID, PATH_DAYS, PATH_MODULES, validUdemyLectureLink } from '../data/pathCurriculum.js';
import { lessonQuiz } from '../data/pathQuiz.js';
import { dateInIndia } from '../utils/studySchedule.js';
import { rankCardForDay } from '../services/rankCard.js';
import { emailRankCard, reportEmailConfigured } from '../services/rankCardEmail.js';

const router = Router();
const KEY = 'single-learner'; // Legacy SkillForge is also a single-learner app.
const SCORE_REQUIRED = 80;
const todayIST = () => dateInIndia();

async function findJourney() {
  return EngineerJourney.findOneAndUpdate(
    { key: KEY },
    { $setOnInsert: { key: KEY, startDate: '2026-10-19' } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}
const findLesson = (state, id) => state.lessons.find(item => item.lessonId === id);
const findDay = (state, n) => state.days.find(item => item.day === n);
const findProject = (state, id) => state.projects.find(item => item.moduleId === id);
const findModuleTest = (state, id) => state.moduleTests.find(item => item.moduleId === id);
const pass = item => Boolean(item?.quizAttempts?.some(a => a.total > 0 && a.score / a.total * 100 >= SCORE_REQUIRED));
const testPass = item => Boolean(item?.attempts?.some(a => a.total > 0 && a.score / a.total * 100 >= SCORE_REQUIRED));
const moduleForDay = n => PATH_MODULES.find(m => m.to === n);
const unlockedDay = state => PATH_DAYS.find(day => !findDay(state, day.day)?.completedAt)?.day || PATH_DAYS.length;
function finalTestQuestions(module) {
  const seen = new Set();
  const relevantDays = module.id === 'capstone'
    ? PATH_DAYS.filter(day => day.day < module.from)
    : PATH_DAYS.filter(day => day.day >= module.from && day.day <= module.to);
  return relevantDays
    .flatMap(day => day.lessons.flatMap(lesson => lessonQuiz(lesson)))
    .filter(question => {
      if (seen.has(question.question)) return false;
      seen.add(question.question);
      return true;
    }).slice(0, 10);
}

function serialize(state) {
  const watched = new Map(state.lessons.map(item => [item.lessonId, item]));
  const sessions = new Map(state.days.map(item => [item.day, item]));
  const moduleProjects = new Map(state.projects.map(item => [item.moduleId, item]));
  const days = PATH_DAYS.map(day => ({
    ...day,
    studyMinutes: sessions.get(day.day)?.studyMinutes || 0,
    completedAt: sessions.get(day.day)?.completedAt || null,
    lessons: day.lessons.map(item => {
      const record = watched.get(item.id);
      return {
        ...item, watched: Boolean(record?.watchedAt),
        quizPassed: pass(record),
        bestScore: record?.quizAttempts?.length ? Math.max(...record.quizAttempts.map(a => a.total ? Math.round(a.score / a.total * 100) : 0)) : null,
        deepLink: record?.deepLink || null
      };
    })
  }));
  const doneDays = days.filter(day => day.completedAt).length;
  const current = days.find(day => !day.completedAt) || days.at(-1);
  const totalWatched = state.lessons.filter(item => item.watchedAt).length;
  const totalPassed = state.lessons.filter(pass).length;
  const dateNow = todayIST();
  const dueDays = days.filter(day => day.date <= dateNow).length;
  // Consistency falls when a scheduled day is missed; completing early is always credited.
  const consistencyRate = dueDays ? Math.min(100, Math.round(doneDays / dueDays * 100)) : 100;
  // Completed roadmap sessions streak; a missed scheduled date resets the live streak.
  const actualCompletionDates = [...new Set(days.filter(day => day.completedAt)
    .map(day => dateInIndia(new Date(day.completedAt))))].sort().reverse();
  let streak = 0;
  const recent = actualCompletionDates[0];
  const previousDate = new Date(`${dateNow}T00:00:00Z`);
  previousDate.setUTCDate(previousDate.getUTCDate() - 1);
  if (recent === dateNow || recent === previousDate.toISOString().slice(0, 10)) {
    let expected = recent;
    for (const actual of actualCompletionDates) {
      if (actual !== expected) break;
      streak++;
      const previous = new Date(`${expected}T00:00:00Z`);
      previous.setUTCDate(previous.getUTCDate() - 1);
      expected = previous.toISOString().slice(0, 10);
    }
  }
  return {
    startDate: state.startDate,
    targetMinutes: 240,
    firstUnfinishedDay: current?.day || 1,
    totalDays: days.length,
    courses: COURSE_SUMMARY,
    modules: PATH_MODULES.map(module => {
      const project = moduleProjects.get(module.id);
      const test = findModuleTest(state, module.id);
      return { ...module, testPassed: testPass(test),
        bestTestScore: test?.attempts?.length ? Math.max(...test.attempts.map(a => a.total ? Math.round(a.score/a.total*100) : 0)) : null,
        project: project ? {
        status: project.status, filename: project.filename,
        githubUrl: project.githubUrl, submittedAt: project.submittedAt
      } : null };
    }),
    stats: { completedDays: doneDays, watchedVideos: totalWatched, passedQuizzes: totalPassed, totalVideos: PATH_DAYS.reduce((count, day) => count + day.lessons.length, 0), streak: Math.max(0, streak), consistencyRate },
    days
  };
}

router.get('/dashboard', async (_req, res) => {
  try { res.json(serialize(await findJourney())); }
  catch (error) { res.status(500).json({ error: error.message || 'Learning path could not load' }); }
});

router.get('/rank-cards', async (_req, res) => {
  try {
    const state = await findJourney();
    res.json({
      emailConfigured: reportEmailConfigured(),
      cards: state.days.filter(day => day.completedAt)
        .map(day => rankCardForDay(state, day.day)).filter(Boolean)
        .sort((a, b) => b.day - a.day)
    });
  } catch (error) { res.status(500).json({ error: error.message || 'Rank cards could not load' }); }
});

router.get('/lessons/:id/quiz', async (req, res) => {
  const lesson = LESSON_BY_ID.get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const questions = lessonQuiz(lesson).map(({ id, question, options }) => ({ id, question, options }));
  res.json({ lessonId: lesson.id, questions, passMark: SCORE_REQUIRED, source: 'Free topic-based question bank; not a video transcript' });
});

router.post('/lessons/:id/link', async (req, res) => {
  const lesson = LESSON_BY_ID.get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const link = String(req.body?.url || '').trim();
  if (!validUdemyLectureLink(link) || !new URL(link).pathname.startsWith(new URL(lesson.courseUrl).pathname + 'learn/')) {
    return res.status(400).json({ error: 'Paste the specific lecture link from the matching Udemy course (https://www.udemy.com/course/.../learn/lecture/123...)' });
  }
  const state = await findJourney();
  let record = findLesson(state, lesson.id);
  if (!record) { state.lessons.push({ lessonId: lesson.id }); record = findLesson(state, lesson.id); }
  record.deepLink = link;
  await state.save();
  res.json({ message: 'Exact Udemy lecture link saved', deepLink: link });
});

router.post('/lessons/:id/watched', async (req, res) => {
  const lesson = LESSON_BY_ID.get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const state = await findJourney();
  const day = PATH_DAYS.find(item => item.lessons.some(v => v.id === lesson.id));
  if (day.day > unlockedDay(state)) return res.status(403).json({ error: 'Finish the previous day first' });
  let record = findLesson(state, lesson.id);
  if (!record) { state.lessons.push({ lessonId: lesson.id }); record = findLesson(state, lesson.id); }
  record.watchedAt ||= new Date();
  await state.save();
  res.json({ watched: true, note: 'Self-marked complete; Udemy watch history is not automatically synced' });
});

router.post('/lessons/:id/quiz', async (req, res) => {
  const lesson = LESSON_BY_ID.get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const answers = req.body?.answers;
  const questions = lessonQuiz(lesson);
  if (!Array.isArray(answers) || answers.length !== questions.length || answers.some(n => !Number.isInteger(n) || n < 0 || n > 3)) {
    return res.status(400).json({ error: 'Answer all five questions before submitting' });
  }
  const state = await findJourney();
  const record = findLesson(state, lesson.id);
  if (!record?.watchedAt) return res.status(403).json({ error: 'Mark the video watched to unlock its quiz' });
  const score = questions.filter((question, index) => question.answer === answers[index]).length;
  record.quizAttempts.push({ score, total: questions.length });
  await state.save();
  res.json({ score, total: questions.length, passed: score / questions.length * 100 >= SCORE_REQUIRED,
    review: questions.map((question, i) => ({ index: i, correct: question.answer === answers[i], correctAnswer: question.answer, explanation: question.explanation })) });
});

router.post('/days/:day/time', async (req, res) => {
  const n = Number(req.params.day);
  const minutes = Number(req.body?.minutes);
  if (!Number.isInteger(n) || n < 1 || n > PATH_DAYS.length) return res.status(404).json({ error: 'Day not found' });
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 30) return res.status(400).json({ error: 'Log 1–30 elapsed focus minutes per sync' });
  const state = await findJourney();
  if (n !== unlockedDay(state)) return res.status(403).json({ error: 'Only the current study day can track new time' });
  let record = findDay(state, n);
  if (!record) { state.days.push({ day: n }); record = findDay(state, n); }
  record.studyMinutes = Math.min(240, (record.studyMinutes || 0) + minutes);
  await state.save();
  res.json({ studyMinutes: record.studyMinutes, targetMinutes: 240 });
});

router.post('/modules/:moduleId/project', async (req, res) => {
  const module = PATH_MODULES.find(item => item.id === req.params.moduleId);
  if (!module) return res.status(404).json({ error: 'Module not found' });
  const state = await findJourney();
  if (unlockedDay(state) < module.to) return res.status(403).json({ error: 'Finish the module lessons before submitting its project' });
  const code = String(req.body?.code || '').trim();
  const filename = String(req.body?.filename || '').slice(0, 100);
  const githubUrl = String(req.body?.githubUrl || '').trim();
  const confirmations = req.body?.confirmations;
  if (code.length > 30000) return res.status(400).json({ error: 'Upload the main code file under 30,000 characters; use GitHub for large projects' });
  if (code.length < 20 && !/^https:\/\/github\.com\/[^/]+\/[^/]+/.test(githubUrl)) return res.status(400).json({ error: 'Upload a code file or provide a GitHub repository URL' });
  if (!Array.isArray(confirmations) || confirmations.length !== 3 || !confirmations.every(Boolean)) return res.status(400).json({ error: 'Run the code and confirm all three project checks' });
  let project = findProject(state, module.id);
  if (!project) { state.projects.push({ moduleId: module.id }); project = findProject(state, module.id); }
  Object.assign(project, { code, filename, githubUrl, confirmations, status: 'self-reviewed', submittedAt: new Date() });
  await state.save();
  res.json({ message: 'Project submitted with free learner self-check (not AI reviewed).', status: project.status });
});

router.get('/modules/:moduleId/test', async (req, res) => {
  const module = PATH_MODULES.find(item => item.id === req.params.moduleId);
  if (!module) return res.status(404).json({error:'Module not found'});
  const questions = finalTestQuestions(module).map((q,i)=>({id:`${module.id}-final-${i+1}`,question:q.question,options:q.options}));
  res.json({moduleId:module.id,passMark:SCORE_REQUIRED,questions,source:'Free curated practice bank'});
});

router.post('/modules/:moduleId/test', async (req, res) => {
  const module = PATH_MODULES.find(item => item.id === req.params.moduleId);
  if (!module) return res.status(404).json({error:'Module not found'});
  const state = await findJourney();
  if (unlockedDay(state) < module.to) return res.status(403).json({error:'Finish earlier study days before the module test'});
  const questions = finalTestQuestions(module);
  const answers = req.body?.answers;
  if (!Array.isArray(answers) || answers.length !== questions.length || answers.some(n=>!Number.isInteger(n)||n<0||n>3)) {
    return res.status(400).json({error:`Answer all ${questions.length} questions first`});
  }
  const score = questions.filter((q,i)=>q.answer===answers[i]).length;
  let test = findModuleTest(state,module.id);
  if (!test) {state.moduleTests.push({moduleId:module.id});test=findModuleTest(state,module.id);}
  test.attempts.push({score,total:questions.length});
  await state.save();
  res.json({score,total:questions.length,passed:score/questions.length*100>=SCORE_REQUIRED,
    review:questions.map((q,i)=>({correct:q.answer===answers[i],correctAnswer:q.answer,explanation:q.explanation}))});
});

router.post('/days/:day/complete', async (req, res) => {
  const n = Number(req.params.day);
  const selected = PATH_DAYS[n - 1];
  if (!selected) return res.status(404).json({ error: 'Day not found' });
  const state = await findJourney();
  if (n !== unlockedDay(state)) return res.status(409).json({ error: 'Complete the current day in order' });
  const records = selected.lessons.map(lesson => findLesson(state, lesson.id));
  const pending = [];
  if (records.some(record => !record?.watchedAt)) pending.push('Mark every video watched');
  if (records.some(record => !pass(record))) pending.push('Pass every video quiz (80%+)');
  const record = findDay(state, n);
  if ((record?.studyMinutes || 0) < 240) pending.push('Finish 240 minutes of focused study');
  const module = moduleForDay(n);
  if (module && !testPass(findModuleTest(state,module.id))) pending.push('Pass module final test (80%+)');
  if (module && findProject(state, module.id)?.status !== 'self-reviewed') pending.push('Upload the module project with self-check');
  if (pending.length) return res.status(400).json({ error: 'Finish these steps first', pending });
  record.completedAt = new Date();
  await state.save();
  const rankCard = rankCardForDay(state, n);
  let emailStatus = 'not_configured';
  try { emailStatus = await emailRankCard(rankCard); }
  catch (error) {
    emailStatus = 'failed';
    console.error('Rank card email failed:', error.message);
  }
  res.json({
    message: `Day ${n} complete. The next 4-hour day is unlocked immediately.`,
    nextDay: Math.min(n + 1, PATH_DAYS.length),
    rankCard, emailStatus
  });
});

export default router;
