import { useEffect, useState } from 'react';
import { api } from '../api/api';

function toUInt8Array(base64url) {
  const padding = '='.repeat((4 - base64url.length % 4) % 4);
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), ch => ch.charCodeAt(0));
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api('/notifications/settings').then(setSettings).catch(() => {
      setMessage('Notification settings could not be loaded');
    });
  }, []);

  const enable = async () => {
    setBusy(true);
    setMessage('');
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) ||
          !('Notification' in window)) {
        throw new Error('This browser does not support background Web Push.');
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Allow notifications in your browser settings.');
      }
      const worker = await navigator.serviceWorker.register('/sw.js');
      const ready = await navigator.serviceWorker.ready;
      const subscription = await ready.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: toUInt8Array(settings.publicKey)
      });
      await api('/notifications/subscribe', {
        method: 'POST', body: JSON.stringify({ subscription: subscription.toJSON() })
      });
      setMessage('Subscribed. Your device can receive background reminders at 9 PM IST, if the server is running.');
    } catch (error) {
      setMessage(error.message || 'Could not enable notifications');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h3 className="text-xl font-bold">9 PM study reminder</h3>
      <p className="mt-2 text-sm text-slate-400">
        Notifications are sent at 9:00 PM IST on scheduled study days.
        Paused days are skipped. Browser permission is required.
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Background reminders require a supported browser, HTTPS, VAPID server keys
        and a running server. Closing the browser is supported by Web Push when
        the platform permits it, but delivery is not guaranteed.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={enable}
          disabled={busy || !settings?.pushConfigured}
          className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950 disabled:opacity-50">
          {busy ? 'Enabling…' : '🔔 Enable browser reminders'}
        </button>
        <span className="self-center text-xs text-slate-400">
          {settings ? (settings.pushConfigured ? 'Push server ready' : 'Push server setup required')
            : 'Checking notification setup…'}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Email fallback: {settings?.emailConfigured ? 'configured' : 'not configured'}
      </p>
      {message && <p role="status" className="mt-3 text-sm text-cyan-200">{message}</p>}
    </section>
  );
}
