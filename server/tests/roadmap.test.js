import test from 'node:test';
import assert from 'node:assert/strict';
import { roadmap } from '../data/roadmap.js';

test('roadmap has exactly fifty unique study days', () => {
  assert.equal(roadmap.length, 50);
  assert.deepEqual(roadmap.map(d => d.day), Array.from({ length: 50 }, (_, i) => i + 1));
});
test('every day provides tasks, videos, quiz and project without an API key', () => {
  for (const day of roadmap) {
    assert.ok(day.tasks.length >= 1, 'Missing tasks day ' + day.day);
    if (day.day <= 47) assert.ok(day.videos.length >= 1, 'Missing videos day ' + day.day);
    else {
      assert.equal(day.videos.length, 0, 'Capstone/revision days are practice-only');
      assert.ok(day.tasks.some(task => task.type === 'practice'));
    }
    assert.ok(day.mcqs.length >= 1, 'Missing MCQ day ' + day.day);
    assert.ok(day.project?.requirements?.length >= 1, 'Missing project day ' + day.day);
  }
});
