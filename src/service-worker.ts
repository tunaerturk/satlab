/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

const saveQuestionsToCache = async (questions: any) => {
	const cache = await caches.open('questions-cache');
	const data = JSON.stringify(questions);
	const response = new Response(data, {
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length.toString()
		}
	});

	await cache.put('offline-questions', response);
};

const getQuestionsFromCache = async () => {
	const cache = await caches.open('questions-cache');
	const response = await cache.match('offline-questions');

	if (!response) return [];

	try {
		return await response.json();
	} catch (err) {
		console.error('Cache parse error:', err);
		return [];
	}
};
self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		cache.addAll(ASSETS);
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

		if (ASSETS.includes(url.pathname)) {
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		try {
			const response = await fetch(event.request);
			const isNotExtension = url.protocol.includes('http');
			const isSuccess = response.status === 200;

			if (isSuccess) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		return new Response('No internet', { status: 404 });
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
		const savePromise = saveQuestionsToCache(data);
		if (event.waitUntil) event.waitUntil(savePromise);
	}
});
