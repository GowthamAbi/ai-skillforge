import test from 'node:test';
import assert from 'node:assert/strict';
import { COURSE_SUMMARY, PATH_DAYS, PATH_LESSONS, PATH_MODULES, validUdemyLectureLink } from '../data/pathCurriculum.js';
import { lessonQuiz, topicCategory } from '../data/pathQuiz.js';

test('old 50-day roadmap becomes a separate four-course AI Engineer Path', () => {
  assert.equal(PATH_DAYS.length, 50);
  assert.equal(PATH_LESSONS.length, 532);
  assert.deepEqual(COURSE_SUMMARY.map(course => course.importedLectures), [67, 210, 132, 123]);
  assert.deepEqual(COURSE_SUMMARY.map(course => course.totalLectures), [75, 210, 132, 124]);
  assert.equal(new Set(PATH_LESSONS.map(v => v.id)).size, PATH_LESSONS.length);
  assert.equal(PATH_DAYS[0].date, '2026-10-19');
  assert.equal(PATH_DAYS.at(-1).day, 50);
});

test('each imported video has a known title, duration, course and instructor', () => {
  for (const video of PATH_LESSONS) {
    assert.ok(video.title.trim());
    assert.ok(video.durationSeconds > 0, video.title);
    assert.ok(video.courseUrl.startsWith('https://www.udemy.com/course/'));
    assert.ok(video.instructor);
    assert.ok(video.roadmapVideoNumber > 0);
  }
});

test('no-video capstone days and module-end projects are represented', () => {
  assert.deepEqual(PATH_DAYS.slice(-3).map(day => day.lessons.length), [0, 0, 0]);
  assert.deepEqual(PATH_MODULES.map(m => m.to), [10, 25, 39, 47, 50]);
});

test('every video gets a complete five-question, API-free practice quiz', () => {
  for (const video of PATH_LESSONS) {
    const questions = lessonQuiz(video);
    assert.equal(questions.length, 5);
    for (const item of questions) {
      assert.equal(item.options.length, 4);
      assert.ok(item.answer >= 0 && item.answer < 4);
      assert.ok(item.explanation);
    }
  }
  assert.equal(topicCategory({title:'Semantic Search with RAG'}), 'rag');
  assert.equal(topicCategory({title:'Building an MCP agent'}), 'agent');
});

test('exact Udemy lecture links are validated, not fabricated', () => {
  assert.ok(validUdemyLectureLink('https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/learn/lecture/12345#overview'));
  assert.equal(validUdemyLectureLink('https://www.udemy.com/course/example/'), false);
  assert.equal(validUdemyLectureLink('https://evil-udemy.com/course/x/learn/lecture/123'), false);
  assert.equal(validUdemyLectureLink('javascript:alert(1)'), false);
});
