import { Router } from 'express';
import RoadmapCodeWorkspace from '../models/RoadmapCodeWorkspace.js';

const router = Router();
const LANGUAGES = {
  python: { version: '3.10.0', filename: 'main.py' },
  javascript: { version: '18.15.0', filename: 'main.js' },
  java: { version: '15.0.2', filename: 'Main.java' }
};

router.get('/:topicId', async (req, res) => {
  try {
    const workspace = await RoadmapCodeWorkspace.findOne({ topicId: req.params.topicId }).lean();
    res.json({ workspace: workspace || null });
  } catch {
    res.status(500).json({ error: 'Could not load code workspace.' });
  }
});

router.patch('/:topicId', async (req, res) => {
  try {
    const { language, code } = req.body || {};
    if (!LANGUAGES[language]) return res.status(400).json({ error: 'Choose Python, JavaScript, or Java.' });
    if (typeof code !== 'string' || code.length > 30000) return res.status(400).json({ error: 'Code must be text under 30,000 characters.' });
    const workspace = await RoadmapCodeWorkspace.findOneAndUpdate(
      { topicId: req.params.topicId },
      { $set: { language, [`codeDrafts.${language}`]: code, updatedAt: new Date() }, $setOnInsert: { topicId: req.params.topicId } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ workspace });
  } catch {
    res.status(500).json({ error: 'Could not save code workspace.' });
  }
});

router.post('/:topicId/run', async (req, res) => {
  const { language, code, stdin = '' } = req.body || {};
  const config = LANGUAGES[language];
  if (!config) return res.status(400).json({ error: 'Choose Python, JavaScript, or Java.' });
  if (typeof code !== 'string' || !code.trim() || code.length > 30000) return res.status(400).json({ error: 'Enter code (maximum 30,000 characters).' });
  if (typeof stdin !== 'string' || stdin.length > 10000) return res.status(400).json({ error: 'Input is too long.' });

  const started = Date.now();
  let result;
  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        language,
        version: config.version,
        files: [{ name: config.filename, content: code }],
        stdin,
        run_timeout: 5000,
        compile_timeout: 10000
      })
    });
    if (!response.ok) throw new Error(`Code runner returned HTTP ${response.status}`);
    result = await response.json();
  } catch (error) {
    return res.status(502).json({ status: 'runner-error', error: error.name === 'TimeoutError' ? 'Code runner request timed out. Try again.' : 'Code runner is temporarily unavailable. Try again shortly.' });
  }

  const compile = result.compile || null;
  const run = result.run || {};
  const stderr = [compile?.stderr, compile?.output, run.stderr].filter(Boolean).join('\n').slice(0, 12000);
  const stdout = String(run.stdout || '').slice(0, 12000);
  const exitCode = typeof run.code === 'number' ? run.code : null;
  const status = compile?.code !== undefined && compile.code !== 0
    ? 'compile-error'
    : run.signal === 'SIGKILL' ? 'timeout'
    : exitCode === 0 ? 'success' : 'runtime-error';
  const durationMs = Date.now() - started;

  try {
    const workspace = await RoadmapCodeWorkspace.findOneAndUpdate(
      { topicId: req.params.topicId },
      {
        $set: { language, [`codeDrafts.${language}`]: code, updatedAt: new Date() },
        $setOnInsert: { topicId: req.params.topicId },
        $push: { attempts: { $each: [{ language, code, stdin, stdout, stderr, exitCode, status, durationMs }], $slice: -30 } }
      },
      { new: true, upsert: true, runValidators: true }
    );
    return res.json({ status, stdout, stderr, exitCode, durationMs, attemptsSaved: workspace.attempts.length });
  } catch {
    return res.status(500).json({ error: 'Code ran, but saving the attempt failed.' });
  }
});

export default router;
