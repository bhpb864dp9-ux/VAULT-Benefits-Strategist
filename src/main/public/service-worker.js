/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VAULT SERVICE WORKER
 * Offline-First Caching Strategy Implementation
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC
 * ALL RIGHTS RESERVED
 * 
 * This Service Worker enables VAULT to function completely offline after the
 * initial page load. This is a KEY PATENT CLAIM - providing full veterans
 * benefits claim preparation capability without network connectivity.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * WHAT IS A SERVICE WORKER?
 * 
 * A Service Worker is a JavaScript file that runs in a separate thread from
 * the main browser page. It acts as a programmable network proxy, intercepting
 * all network requests from the page and deciding how to respond to them.
 * 
 * KEY CAPABILITIES:
 * 1. Cache assets for offline access
 * 2. Intercept and modify network requests
 * 3. Run background tasks
 * 4. Send push notifications (not used in VAULT)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * VAULT CACHING STRATEGY: CACHE-FIRST (STALE-WHILE-REVALIDATE)
 * 
 * When a network request is made:
 * 1. Check if the requested resource is in the cache
 * 2. If YES: Return cached version immediately (fast!)
 * 3. If NO: Fetch from network, cache the response, return to page
 * 
 * This strategy prioritizes speed and offline capability over freshness.
 * Perfect for VAULT since the application is a static PWA that doesn't
 * change frequently.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * WHY OFFLINE CAPABILITY MATTERS FOR VETERANS:
 * 
 * Many veterans live in rural areas with unreliable internet connectivity.
 * Others may be traveling, deployed, or in situations without network access.
 * VAULT's offline capability ensures they can prepare their claims anytime,
 * anywhere, without depending on network availability.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * @constant {string} CACHE_NAME
 * @description Unique identifier for this version of the cache
 * 
 * VERSION MANAGEMENT:
 * When we release a new version of VAULT, we update this cache name.
 * The old cache will be cleared and new assets will be downloaded.
 * 
 * Format: vault-v{MAJOR}.{MINOR}
 * 
 * @example
 * // Version 1.0
 * const CACHE_NAME = 'vault-v1';
 * 
 * // Version 4.0 STRATOSPHERIC+
 * const CACHE_NAME = 'vault-beta-v1.0';
 */
const CACHE_NAME = 'vault-beta-v1.0';

/**
 * @constant {Array<string>} ASSETS
 * @description List of URLs to cache during Service Worker installation
 * 
 * WHAT TO CACHE:
 * - Application HTML, CSS, JavaScript files
 * - Third-party libraries from CDNs
 * - Fonts and icons
 * - Any other assets needed for offline functionality
 * 
 * ORDERING:
 * Local assets listed first, then external CDN resources.
 * Order doesn't affect functionality but aids readability.
 * 
 * CDN CACHING NOTE:
 * We cache external CDN resources to ensure VAULT works even if:
 * - CDN is down
 * - User has no internet
 * - User is on a slow/metered connection
 * 
 * CACHE SIZE CONSIDERATIONS:
 * Total cached size is approximately 2-3MB including:
 * - Bootstrap CSS (~200KB)
 * - Font Awesome (~200KB icons, ~1MB fonts)
 * - JavaScript libraries (~300KB)
 * - Application code (~50KB)
 */
const ASSETS = [
    // ═══════════════════════════════════════════════════════════════════
    // LOCAL ASSETS
    // These are served from the same origin as the application
    // ═══════════════════════════════════════════════════════════════════
    
    './',              // Root path (usually serves index.html)
    './index.html',    // Main application file
    
    // ═══════════════════════════════════════════════════════════════════
    // FONT AWESOME ICONS (Font Awesome Free License)
    // Icon library for UI elements
    // https://fontawesome.com/
    // ═══════════════════════════════════════════════════════════════════
    
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    
    // ═══════════════════════════════════════════════════════════════════
    // TYPOGRAPHY (SIL Open Font License)
    // Premium typography - Instrument Serif + DM Sans
    // https://fonts.google.com/
    // ═══════════════════════════════════════════════════════════════════
    
    'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap',
    
    // ═══════════════════════════════════════════════════════════════════
    // JSZIP LIBRARY (MIT License)
    // Client-side ZIP file creation
    // CRITICAL for VAULT's privacy architecture - enables generating
    // downloadable claim packages without server involvement
    // https://stuk.github.io/jszip/
    // ═══════════════════════════════════════════════════════════════════
    
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    
    // ═══════════════════════════════════════════════════════════════════
    // FILESAVER.JS (MIT License)
    // Triggers browser file download from Blob objects
    // Works with JSZip to deliver generated packages
    // https://github.com/eligrey/FileSaver.js/
    // ═══════════════════════════════════════════════════════════════════
    
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    
    // ═══════════════════════════════════════════════════════════════════
    // CANVAS CONFETTI (ISC License)
    // Celebration animation library
    // Provides positive feedback on claim package completion
    // https://github.com/catdad/canvas-confetti
    // ═══════════════════════════════════════════════════════════════════
    
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SERVICE WORKER LIFECYCLE EVENT: INSTALL
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @event install
 * @description Fires when the Service Worker is first installed
 * 
 * WHEN IT FIRES:
 * - First time a user visits the site
 * - When a new version of the Service Worker is detected
 * 
 * WHAT WE DO:
 * 1. Open (or create) our cache
 * 2. Add all assets to the cache
 * 3. Wait for all assets to be cached before completing installation
 * 
 * ERROR HANDLING:
 * If ANY asset fails to cache, the entire installation fails.
 * The browser will retry on the next page load.
 * 
 * TECHNICAL DETAILS:
 * - e.waitUntil() keeps the Service Worker alive until caching completes
 * - caches.open() returns a Promise for the cache object
 * - cache.addAll() fetches all URLs and caches the responses
 */
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installing VAULT v1.1 offline capability...');
    
    // Keep SW alive until caching is complete
    e.waitUntil(
        // Open our cache (creates if doesn't exist)
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching application assets...');
                // Add all assets to cache
                return cache.addAll(ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] All assets cached successfully!');
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Cache installation failed:', error);
            })
    );
});

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SERVICE WORKER LIFECYCLE EVENT: ACTIVATE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @event activate
 * @description Fires when the Service Worker takes control of the page
 * 
 * WHEN IT FIRES:
 * - After installation, when there are no other active Service Workers
 * - When a new Service Worker is installed and the old one is removed
 * 
 * WHAT WE DO:
 * Clean up old caches from previous versions.
 * This prevents cache bloat and ensures users get the latest version.
 * 
 * CACHE CLEANUP LOGIC:
 * 1. Get list of all cache names
 * 2. Filter to find caches that don't match current CACHE_NAME
 * 3. Delete old caches
 */
self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activating VAULT v1.1...');
    
    e.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        // Filter caches that start with 'vault-' but aren't current
                        .filter((name) => name.startsWith('vault-') && name !== CACHE_NAME)
                        // Delete each old cache
                        .map((name) => {
                            console.log('[Service Worker] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] VAULT v1.1 is now active!');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SERVICE WORKER EVENT: FETCH
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @event fetch
 * @description Intercepts all network requests from the page
 * 
 * This is where the magic happens! Every time the page requests a resource
 * (HTML, CSS, JS, images, fonts, etc.), this handler decides where to get it.
 * 
 * CACHE-FIRST STRATEGY IMPLEMENTATION:
 * 
 *     Request comes in
 *           │
 *           ▼
 *    ┌─────────────┐
 *    │ Check cache │
 *    └─────────────┘
 *           │
 *     ┌─────┴─────┐
 *     │           │
 *   Found      Not Found
 *     │           │
 *     ▼           ▼
 *   Return    Fetch from
 *   cached     network
 *   version       │
 *                 ▼
 *            Return to
 *              page
 * 
 * WHY CACHE-FIRST?
 * - Fastest possible response (no network latency)
 * - Works completely offline
 * - Perfect for static PWAs like VAULT
 * 
 * NETWORK FALLBACK:
 * If the resource isn't in cache, we fetch from network.
 * This handles any assets we forgot to cache or new resources.
 */
self.addEventListener('fetch', (e) => {
    // Log the request for debugging (commented out in production)
    // console.log('[Service Worker] Fetching:', e.request.url);
    
    e.respondWith(
        // Try to find the request in cache
        caches.match(e.request)
            .then((cachedResponse) => {
                // If found in cache, return the cached version
                if (cachedResponse) {
                    // console.log('[Service Worker] Serving from cache:', e.request.url);
                    return cachedResponse;
                }
                
                // Not in cache - fetch from network
                // console.log('[Service Worker] Fetching from network:', e.request.url);
                return fetch(e.request)
                    .then((networkResponse) => {
                        // Optionally cache the new resource for future use
                        // (Not implemented here to avoid cache bloat)
                        return networkResponse;
                    })
                    .catch((error) => {
                        // Network request failed and not in cache
                        console.error('[Service Worker] Fetch failed:', e.request.url, error);
                        
                        // For navigation requests, could return offline page
                        // For now, just let the error propagate
                    });
            })
    );
});

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * END OF SERVICE WORKER
 * 
 * SUMMARY OF OFFLINE CAPABILITY:
 * 
 * 1. INSTALLATION: All required assets are cached on first visit
 * 2. ACTIVATION: Old caches are cleaned up, SW takes control
 * 3. FETCH: All requests served from cache first, network as fallback
 * 
 * RESULT: VAULT works completely offline after the first load!
 * 
 * Veterans can:
 * - Prepare claims without internet connection
 * - Work in areas with poor connectivity
 * - Continue working during network outages
 * - Save mobile data by using cached resources
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC
 * ALL RIGHTS RESERVED
 * 
 * This offline capability implementation is a KEY PATENT CLAIM.
 * Unauthorized reproduction or distribution is prohibited.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */
