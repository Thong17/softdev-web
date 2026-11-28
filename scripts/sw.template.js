/* eslint-disable no-restricted-globals */
// The app's service worker, written to build/sw.js by scripts/build-sw.js.
// It keeps the built app on the device so it opens with no connection
// (offline customer onboarding). API calls, uploads and map tiles are never
// cached: they always go to the network.
const VERSION = '__VERSION__'
const PRECACHE = __PRECACHE__
const CACHE = `softdev-shell-${VERSION}`
const SHELL = '/index.html'
// A slow connection opens the saved app instead of waiting this long
const NAVIGATION_TIMEOUT = 4000
const precached = new Set(PRECACHE)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('softdev-shell-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

const withTimeout = (promise, ms) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout')), ms)
  promise.then((value) => { clearTimeout(timer); resolve(value) }, (err) => { clearTimeout(timer); reject(err) })
})

// Pages: the newest app when the network answers quickly, the saved one otherwise
const handleNavigation = async (request) => {
  const cache = await caches.open(CACHE)
  try {
    const response = await withTimeout(fetch(request), NAVIGATION_TIMEOUT)
    if (response.ok) cache.put(SHELL, response.clone())
    return response
  } catch (err) {
    const shell = await cache.match(SHELL)
    if (shell) return shell
    throw err
  }
}

// Built files have a hash in the name, so a saved copy never goes stale
const handleStatic = async (request) => {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (request.mode === 'navigate') return event.respondWith(handleNavigation(request))
  if (precached.has(url.pathname) || url.pathname.startsWith('/static/')) event.respondWith(handleStatic(request))
})
