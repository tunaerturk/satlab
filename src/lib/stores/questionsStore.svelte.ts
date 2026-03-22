import { browser } from '$app/environment';
import { getQuestions } from '$lib/getQuestions';
import type { RWSATQuestions } from '$lib/types';
import { writable } from 'svelte/store';

export const questionsStore = writable<RWSATQuestions>([]);

export const loadQuestions = async () => {
	if (!browser) return;
	if (!navigator.serviceWorker.controller) {
		getQuestions('INI,CAS,EOI,SEC').then((data) => {
			questionsStore.set(data);
		});
	}
	await navigator.serviceWorker.ready;
	navigator.serviceWorker.controller?.postMessage({
		type: 'FETCH_QUESTIONS'
	});
	navigator.serviceWorker.addEventListener('message', (event) => {
		const data = event.data;

		if (data.type === 'QUESTIONS_READY') {
			questionsStore.set(data.payload);

			getQuestions('INI,CAS,EOI,SEC').then((data) => {
				questionsStore.set(data);

				navigator.serviceWorker.controller?.postMessage({
					type: 'SAVE_QUESTIONS',
					payload: data
				});
			});
		}

		if (data.type === 'QUESTIONS_NOT_FOUND') {
			getQuestions('INI,CAS,EOI,SEC').then((data) => {
				questionsStore.set(data);

				navigator.serviceWorker.controller?.postMessage({
					type: 'SAVE_QUESTIONS',
					payload: data
				});
			});
		}
	});
};
