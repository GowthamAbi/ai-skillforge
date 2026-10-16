/* SkillForge study reminder service worker. Served from the site origin. */
self.addEventListener('push', event => {
  let message = {};
  try { message = event.data?.json() || {}; } catch { message = {}; }
  const title = message.title || 'AI SkillForge';
  event.waitUntil(self.registration.showNotification(title, {
    body: message.body || 'Your scheduled study reminder is ready.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'ai-skillforge-study-reminder',
    renotify: false,
    data: { url: '/' }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/', self.location.origin);
  if (url.origin !== self.location.origin) return;
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = clients.find(client => client.url.startsWith(self.location.origin));
    if (existing) {
      await existing.focus();
      return;
    }
    await self.clients.openWindow(url.href);
  })());
});
