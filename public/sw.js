/* Service Worker for Web Push */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch (e) {
    payload = { title: 'Task Update', body: event.data ? event.data.text() : 'You have a task update' };
  }

  const title = payload.title || 'Task Update';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/logo192.png',
    badge: payload.badge || '/logo192.png',
    data: {
      url: payload.url || '/dashboard',
      ...payload.data,
    },
    tag: payload.tag || 'task-notification',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        try {
          const url = new URL(client.url);
          if (client.url.includes(targetUrl) || url.pathname === targetUrl) {
            if ('focus' in client) return client.focus();
          }
        } catch (e) {
          // ignore URL parsing issues
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});