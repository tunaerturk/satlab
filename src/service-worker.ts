/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

const saveQuestionsToCache = async (questions: any, cacheName: string) => {
	const cache = await caches.open('questions-cache');
	const data = JSON.stringify(questions);
	const response = new Response(data, {
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length.toString()
		}
	});

	await cache.put(cacheName, response);
};

const getQuestionsFromCache = async () => {
	const cache = await caches.open('questions-cache');
	const rw_response = await cache.match("offline-rw-questions");
	const math_response = await cache.match("offline-math-questions")

	if (!rw_response && !math_response) return [];

	try {
		const rw_data = rw_response ? await rw_response.json() : []
		const math_Data = math_response ? await math_response.json(): []
		return [rw_data, math_Data]
	} catch (err) {
		console.error('Cache parse error:', err);
		return [];
	}
};
self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
		await self.skipWaiting();
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE && key !== 'questions-cache') {
				await caches.delete(key);
			}
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);
		const isHttp = url.protocol == 'http:' || url.protocol == 'https:';

		if (!isHttp) {
			return fetch(event.request);
		}

		if (event.request.mode === 'navigate') {
			try {
				const response = await fetch(event.request);
				if (response.ok) {
					cache.put(event.request, response.clone());
				}
				return response;
			} catch {
				const cachedResponse = (await cache.match(event.request)) || (await cache.match('/'));

				if (cachedResponse) {
					return cachedResponse;
				} else {
					return new Response('Offline', {
						status: 503,
						headers: { 'Content-Type': 'text/plain' }
					});
				}
			}
		}

		if (ASSETS.includes(url.pathname)) {
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		return fetch(event.request);
	}

	//
	event.respondWith(respond());
});

self.addEventListener('message', async (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
	if (event.data.type === 'FETCH_QUESTIONS') {
		getQuestionsFromCache().then((data) => {
			if (data && data.length > 0) {
				event.source?.postMessage({ type: 'QUESTIONS_READY', payload: data });
			} else {
				event.source?.postMessage({ type: 'QUESTIONS_NOT_FOUND' });
			}
		});
	}

	if (event.data.type === 'SAVE_QUESTIONS') {
		const data = [...event.data.payload].slice(0, 50);
		// We use waitUntil if the event supports it to keep the SW alive
		if (event.data.category === 'math') {
			const savePromise = saveQuestionsToCache(data, 'offline-math-questions');
			if (event.waitUntil) event.waitUntil(savePromise);
		} else {
			const savePromise = saveQuestionsToCache(data, 'offline-rw-questions');
			if (event.waitUntil) event.waitUntil(savePromise);
		}
	}
});
