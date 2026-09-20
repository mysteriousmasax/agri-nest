/**
 * AGRI-NEST Service Worker
 * Provides offline caching, background sync, and push notification support
 */

const CACHE_NAME = 'agri-nest-v2';
const STATIC_CACHE = 'agri-nest-static-v2';
const DYNAMIC_CACHE = 'agri-nest-dynamic-v2';
const IMAGE_CACHE = 'agri-nest-images-v2';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/design-tokens.css',
  './assets/css/components.css',
  './assets/css/utilities.css',
  './assets/js/state.js',
  './assets/js/roles.js',
  './assets/js/theme.js',
  './assets/js/router.js',
  './assets/js/app-core.js',
  './assets/js/shell.js',
  './assets/js/api.js',
  './assets/js/db.js',
  './assets/js/ai-learning-engine.js',
  './assets/js/ecosystem-engine.js',
  './assets/js/data-loader.js',
  './assets/css/tailwind-compat.css',
  './assets/icons/icon.svg',
];

const PAGE_ROUTE = /\/pages\/.*\.html$/;

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] Skip cache:', url, err))
        )
      )
    )
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first for pages, cache-first for static, stale-while-revalidate for images
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests except Google Fonts & CDN
  if (url.origin !== self.location.origin) {
    // Cache Google Fonts stylesheets
    if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          });
        })
      );
      return;
    }

    // Stale-while-revalidate for images (Unsplash, Google)
    if (url.hostname.includes('googleusercontent.com') || url.hostname.includes('unsplash')) {
      event.respondWith(
        caches.open(IMAGE_CACHE).then((cache) => {
          return cache.match(request).then((cached) => {
            const fetchPromise = fetch(request).then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            }).catch(() => cached);
            return cached || fetchPromise;
          });
        })
      );
      return;
    }

    // Tailwind CDN: network only (can't cache)
    if (url.hostname.includes('cdn.tailwindcss.com')) return;
    return;
  }

  // Page partials: Network-first with cache fallback
  if (PAGE_ROUTE.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || new Response(
              '<div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">' +
              '<span class="material-symbols-outlined text-6xl text-on-surface-variant mb-4">cloud_off</span>' +
              '<h2 class="font-headline-lg text-primary mb-2">You\'re Offline</h2>' +
              '<p class="text-on-surface-variant">This page isn\'t available offline yet. Check your connection and try again.</p>' +
              '</div>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        })
    );
    return;
  }

  // Static assets: Cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// Background Sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'agri-nest-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // Process queued operations from IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction('outbox', 'readonly');
    const store = tx.objectStore('outbox');
    const items = await store.getAll();

    for (const item of items) {
      // In production, this would POST to the real API
      console.log('[SW] Syncing offline item:', item);
    }

    // Clear outbox after sync
    const clearTx = db.transaction('outbox', 'readwrite');
    clearTx.objectStore('outbox').clear();
  } catch (err) {
    console.error('[SW] Sync failed:', err);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('agri-nest-offline', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'AGRI-NEST Update';
  const options = {
    body: data.body || 'You have a new notification',
    icon: './assets/icons/icon.svg',
    badge: './assets/icons/icon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || './',
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes('agri-nest') && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
