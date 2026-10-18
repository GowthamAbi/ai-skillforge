import test from 'node:test';
import assert from 'node:assert/strict';
import { PATH_DAYS } from '../data/pathCurriculum.js';
import { rankCardForDay } from '../services/rankCard.js';
import { rankCardEmailHtml } from '../services/rankCardEmail.js';

function completedJourney() {
  const first = PATH_DAYS[0];
  return {
    days: [{ day: 1, studyMinutes: 240, completedAt: new Date('2026-10-19T18:00:00Z') }],
    lessons: first.lessons.map(item => ({
      lessonId: item.id, watchedAt: new Date('2026-10-19T17:00:00Z'),
      quizAttempts: [{ score: 4, total: 5 }]
    })),
    projects: [], moduleTests: []
  };
}

test('rank card is only generated after recorded day completion', () => {
  const state = completedJourney();
  state.days[0].completedAt = null;
  assert.equal(rankCardForDay(state, 1), null);
  assert.equal(rankCardForDay(state, 999), null);
});

test('rank cards use recorded 4-hour focus and quiz data for XP and grade', () => {
  const state = completedJourney();
  const card = rankCardForDay(state, 1);
  assert.equal(card.rank, 'B+');
  assert.equal(card.studyMinutes, 240);
  assert.equal(card.quizAccuracy, 80);
  assert.equal(card.watched, PATH_DAYS[0].lessons.length);
  assert.equal(card.quizzesPassed, PATH_DAYS[0].lessons.length);
  assert.equal(card.xp, 240 + PATH_DAYS[0].lessons.length * 35);
  assert.equal(card.streak, 1);
  assert.ok(card.badges.some(item => item.label === '4H FOCUS'));
  assert.ok(!card.badges.some(item => item.label === 'PROJECT SHIPPED'));
});

test('rank cards award bonus only for tracked scores and consecutive dates', () => {
  const state = completedJourney();
  const second = PATH_DAYS[1];
  state.days.push({ day: 2, studyMinutes: 240, completedAt: new Date('2026-10-20T18:00:00Z') });
  state.lessons.push(...second.lessons.map(item => ({
    lessonId: item.id, watchedAt: new Date('2026-10-20T17:00:00Z'),
    quizAttempts: [{ score: 5, total: 5 }]
  })));
  const card = rankCardForDay(state, 2);
  assert.equal(card.rank, 'S');
  assert.equal(card.streak, 2);
  assert.ok(card.badges.some(item => item.label === 'QUIZ ACE'));
  assert.ok(!card.badges.some(item => item.label === '2-DAY STREAK'));
});

test('rank card mail HTML escapes lesson names', () => {
  const card = rankCardForDay(completedJourney(), 1);
  card.lessons[0].title = '<img src=x onerror=alert(1)>';
  const html = rankCardEmailHtml(card);
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;img src=x'));
  assert.ok(html.includes('DAY 1'));
});
