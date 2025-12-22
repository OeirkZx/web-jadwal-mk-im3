// Service Worker for PWA - Offline Support
const CACHE_NAME = 'jadwal-im-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './manifest.json',
    // Data files
    './js/data/config.js',
    './js/data/dosen.js',
    './js/data/jadwal.js',
    './js/data/matakuliah.js',
    // Utility files
    './js/utils/date.js',
    './js/utils/whatsapp.js',
    './js/utils/storage.js',
    './js/utils/dataManager.js',
    // Components
    './js/components/header.js',
    './js/components/navbar.js',
    './js/components/scheduleCard.js',
    './js/components/lecturerModal.js',
    './js/components/adminModal.js',
    // Pages
    './js/pages/home.js',
    './js/pages/weekly.js',
    './js/pages/lecturers.js',
    './js/pages/login.js',
    './js/pages/admin/dashboard.js',
    './js/pages/admin/manageDosen.js',
    './js/pages/admin/manageJadwal.js',
    './js/pages/admin/manageMataKuliah.js',
    // Main app
    './js/app.js',
    // Icons
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching static assets...');
            // Cache static assets
            return cache.addAll(STATIC_ASSETS).then(() => {
                // Try to cache external assets (don't fail if they can't be cached)
                return Promise.allSettled(
                    EXTERNAL_ASSETS.map(url =>
                        cache.add(url).catch(err => {
                            console.log(`[SW] Could not cache external: ${url}`);
                        })
                    )
                );
            });
        }).then(() => {
            console.log('[SW] Installation complete!');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Claiming clients...');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if available
            if (cachedResponse) {
                // Fetch updated version in background
                event.waitUntil(
                    fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, networkResponse.clone());
                            });
                        }
                    }).catch(() => { })
                );
                return cachedResponse;
            }

            // If not in cache, fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Cache the fetched response
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                // Return empty response for other requests
                return new Response('', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
});

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
});
