import { Router } from 'express';
import {
  notificationSettings, saveSubscription
} from '../services/notifications.js';

const router = Router();

router.get('/settings', (req, res) => {
  const { publicKey, pushConfigured, emailConfigured, reminderTime, timezone } = notificationSettings();
  res.json({ publicKey, pushConfigured, emailConfigured, reminderTime, timezone });
});

router.post('/subscribe', async (req, res) => {
  try {
    if (!notificationSettings().pushConfigured) {
      return res.status(503).json({ error: 'Browser push is not configured on the server' });
    }
    await saveSubscription(req.body?.subscription);
    res.status(201).json({ message: 'Browser subscribed to study reminders' });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Subscription failed' });
  }
});

export default router;
