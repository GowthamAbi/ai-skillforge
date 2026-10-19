import { PATH_DAYS, PATH_MODULES } from '../data/pathCurriculum.js';
import { dateInIndia } from '../utils/studySchedule.js';

const bestPercentage = attempts => attempts?.length
  ? Math.max(...attempts.map(attempt => attempt.total ? Math.round(attempt.score / attempt.total * 100) : 0))
  : null;

function streakOnDate(state, completedAt) {
  const dates = new Set(state.days
    .filter(day => day.completedAt && new Date(day.completedAt) <= new Date(completedAt))
    .map(day => dateInIndia(new Date(day.completedAt))));
  let current = dateInIndia(new Date(completedAt));
  let streak = 0;
  while (dates.has(current)) {
    streak++;
    const previous = new Date(`${current}T00:00:00Z`);
    previous.setUTCDate(previous.getUTCDate() - 1);
    current = previous.toISOString().slice(0, 10);
  }
  return streak;
}

// A transparent, fixed-rule reward: only verified SkillForge actions count.
// Code-task and interview practice aren't marked done without tracking evidence.
export function rankCardForDay(state, dayNumber) {
  const plan = PATH_DAYS[dayNumber - 1];
  const progress = state.days.find(day => day.day === dayNumber);
  if (!plan || !progress?.completedAt) return null;

  const lessons = plan.lessons.map(lesson => {
    const saved = state.lessons.find(item => item.lessonId === lesson.id);
    return {
      title: lesson.title,
      watched: Boolean(saved?.watchedAt),
      quizScore: bestPercentage(saved?.quizAttempts)
    };
  });
  const watched = lessons.filter(lesson => lesson.watched).length;
  const quizzesPassed = lessons.filter(lesson => lesson.quizScore >= 80).length;
  const module = PATH_MODULES.find(item => item.to === dayNumber);
  const moduleTest = module && state.moduleTests.find(item => item.moduleId === module.id);
  const moduleTestScore = bestPercentage(moduleTest?.attempts);
  const projectSubmitted = Boolean(module && state.projects.some(item => item.moduleId === module.id && item.status === 'self-reviewed'));
  const quizScores = lessons.map(lesson => lesson.quizScore).filter(score => score !== null);
  if (moduleTestScore !== null) quizScores.push(moduleTestScore);
  const accuracy = quizScores.length ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length) : null;
  const rank = accuracy === null ? 'FINISHER' : accuracy >= 95 ? 'S' : accuracy >= 90 ? 'A+' : accuracy >= 85 ? 'A' : 'B+';
  const streak = streakOnDate(state, progress.completedAt);
  const xp = Math.min(240, progress.studyMinutes || 0) + watched * 15 + quizzesPassed * 20 +
    (moduleTestScore >= 80 ? 75 : 0) + (projectSubmitted ? 100 : 0);
  const badges = [
    { icon: '⚡', label: '4H FOCUS' },
    ...(accuracy !== null && accuracy >= 90 ? [{ icon: '🧠', label: 'QUIZ ACE' }] : []),
    ...(streak >= 3 ? [{ icon: '🔥', label: `${streak}-DAY STREAK` }] : []),
    ...(projectSubmitted ? [{ icon: '🚀', label: 'PROJECT SHIPPED' }] : []),
    ...(moduleTestScore >= 80 ? [{ icon: '🏅', label: 'MODULE CLEARED' }] : [])
  ];
  return {
    day: dayNumber, scheduledDate: plan.date, completedAt: progress.completedAt,
    topic: plan.topic, studyMinutes: progress.studyMinutes || 0, targetMinutes: 240,
    watched, totalVideos: plan.lessons.length,
    quizzesPassed, totalQuizzes: plan.lessons.length,
    quizAccuracy: accuracy, rank, xp, streak, badges,
    lessons: lessons.filter(lesson => lesson.watched).map(lesson => ({ title: lesson.title, quizScore: lesson.quizScore })),
    module: module ? { title: module.title, testScore: moduleTestScore, projectSubmitted } : null,
    motivation: rank === 'S' ? 'Legendary mastery. Keep the momentum alive!' :
      rank === 'A+' || rank === 'A' ? 'Excellent work! Another day closer to AI Engineer.' :
      'You showed up and finished. Consistency builds careers.'
  };
}
