import test from 'node:test';
import assert from 'node:assert/strict';
import { PATH_DAYS, PATH_LESSONS } from '../data/pathCurriculum.js';
import { lessonQuiz, topicCategory } from '../data/pathQuiz.js';
import {
  COURSE_SUGGESTIONS, SKILL_AREAS, dailyBudget, findDayForExtra,
  possibleOverlaps, sameUdemyCourse, serializeLibrary, skillChecklist, skillForTitle,
  validCourseUrl, validLectureOrCourseUrl
} from '../services/smartLearning.js';

test('Udemy links accept only HTTPS on genuine Udemy course hosts', () => {
  assert.equal(validCourseUrl(''), true);
  assert.equal(validCourseUrl('https://www.udemy.com/course/python-masterclass/'), true);
  assert.equal(validLectureOrCourseUrl('https://www.udemy.com/course/course-name/learn/lecture/123'), true);
  assert.equal(validCourseUrl('https://notudemy.com/course/fake/'), false);
  assert.equal(validCourseUrl('javascript:alert(1)'), false);
  assert.equal(validCourseUrl('https://www.udemy.com/user/someone'), false);
  assert.equal(sameUdemyCourse('https://www.udemy.com/course/python-masterclass/learn/lecture/123','https://www.udemy.com/course/python-masterclass/'),true);
  assert.equal(sameUdemyCourse('https://www.udemy.com/course/other-course/learn/lecture/123','https://www.udemy.com/course/python-masterclass/'),false);
});

test('duplicate detection uses real title-token overlap, never auto-skips', () => {
  const pool = [
    { id: 'one', title: 'Building a RAG Knowledge Base with LangChain', course: 'LLM Core' },
    { id: 'two', title: 'Python Lists and Loops', course: 'ML Basics' },
    { id: 'three', title: 'Building an MCP Agent', course: 'Agentic' }
  ];
  const overlaps = possibleOverlaps({ id: 'extra', title: 'Building RAG Knowledge Base with LangChain' }, pool);
  assert.equal(overlaps[0].id, 'one');
  assert.equal(overlaps.some(match => match.id === 'two'), false);
  assert.deepEqual(possibleOverlaps({ id: 'new', title: 'SQL outer joins and indexes' }, pool), []);
});

test('optional lessons take available coding minutes but never exceed the 4-hour plan', () => {
  const baseline = dailyBudget(PATH_DAYS[1]);
  assert.equal(baseline.day, 2);
  assert.equal(baseline.videoMinutes + baseline.quizMinutes + baseline.careerMinutes + baseline.codingMinutes, 240);
  const lesson = { id: 'extra1', title: 'Python practice', durationMinutes: 30, assignedDay: 2 };
  const planned = dailyBudget(PATH_DAYS[1], [lesson]);
  assert.equal(planned.extraMinutes, 30);
  assert.equal(planned.codingMinutes, baseline.codingMinutes - 30);
  assert.equal(planned.videoMinutes + planned.quizMinutes + planned.extraMinutes + planned.careerMinutes + planned.codingMinutes, 240);
  assert.equal(planned.allocations[0].fits, true);
  assert.equal(dailyBudget(PATH_DAYS[1], [{ ...lesson, skippedAt: new Date() }]).extraMinutes, 0);
  assert.equal(dailyBudget(PATH_DAYS[1], [{ ...lesson, archivedAt: new Date() }]).extraMinutes, 0);
  assert.equal(findDayForExtra({ durationMinutes: 30 }, [], 1), 2);
  assert.equal(findDayForExtra({ durationMinutes: 180 }, [], 1), null);
});

test('added Python, SQL and full-stack lessons receive five relevant free questions', () => {
  for (const category of ['python', 'sql', 'fullstack', 'ml']) {
    const lesson = { id: `extra-${category}`, title: 'Extra practice lesson', category };
    assert.equal(lessonQuiz(lesson).length, 5);
    assert.ok(lessonQuiz(lesson).every(item => item.options.length === 4 && item.explanation));
  }
  assert.equal(topicCategory({ title: 'Python Pandas basics' }), 'python');
  assert.equal(topicCategory({ title: 'SQL JOIN and GROUP BY' }), 'sql');
  assert.equal(skillForTitle('Docker and Terraform deployment'), 'deployment');
});

test('library serialization preserves core courses and user-added course history', () => {
  const lesson = { id: 'extra-1', courseId: 'my-course', title: PATH_LESSONS[0].title, category: 'llm', durationMinutes: 20, assignedDay: 2 };
  const mock = {
    customCourses: [{ id: 'my-course', title: 'My Udemy Course', account: 1, priority: 'supporting', url: '' }],
    customLessons: [lesson],
    lessons: [{ lessonId: 'extra-1', watchedAt: new Date(), quizAttempts: [{ score: 4, total: 5 }] }]
  };
  const library = serializeLibrary(mock);
  assert.equal(library.courses.length, 5);
  assert.equal(library.courses.filter(item => item.isCore).length, 4);
  assert.equal(library.extras.length, 1);
  assert.equal(library.extras[0].quizPassed, true);
  assert.ok(library.extras[0].overlaps.some(match => match.id === PATH_LESSONS[0].id));
  assert.equal(library.dayBudgets.length, 50);
  assert.equal(COURSE_SUGGESTIONS.length, 7);
  assert.equal(skillChecklist(mock.lessons,mock.customLessons).length, SKILL_AREAS.length);
});
