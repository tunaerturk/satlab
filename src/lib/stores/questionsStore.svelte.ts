import { browser } from '$app/environment';
import { getQuestions } from '$lib/getQuestions';
import type { RWSATQuestions } from '$lib/types';
import { writable } from 'svelte/store';

export const rw_questions = writable<RWSATQuestions>([]);
export const math_questions = writable<RWSATQuestions>([]);

export const loadQuestions = async () => {
	if (!browser) return;
	if (!navigator.serviceWorker.controller) {
		getQuestions('INI,CAS,EOI,SEC', 1).then((data) => {
			rw_questions.set(data);
		});
		getQuestions('H,P,Q,S', 2).then((data) => {
			math_questions.set(data.filter((q) => q.external_id));
		});
	}
	await navigator.serviceWorker.ready;
	navigator.serviceWorker.controller?.postMessage({
		type: 'FETCH_QUESTIONS',
	});
	navigator.serviceWorker.addEventListener('message', (event) => {
		const data = event.data;

		if (data.type === 'QUESTIONS_READY') {
			rw_questions.set(data.payload[0]);
			math_questions.set(data.payload[1]);
			

			getQuestions('INI,CAS,EOI,SEC', 1).then((data) => {
				rw_questions.set(data);

				navigator.serviceWorker.controller?.postMessage({
					type: 'SAVE_QUESTIONS',
					payload: data
				});
			});

			getQuestions('H,P,Q,S', 2).then((data) => {
				math_questions.set(data.filter((q) => q.external_id));

				navigator.serviceWorker.controller?.postMessage({
					type: 'SAVE_QUESTIONS',
					payload: data,
					category: 'math'
				});
			});
		}

		if (data.type === 'QUESTIONS_NOT_FOUND') {
			getQuestions('INI,CAS,EOI,SEC', 1).then((data) => {
				rw_questions.set(data);

				navigator.serviceWorker.controller?.postMessage({
					type: 'SAVE_QUESTIONS',
					payload: data,
					category: 'rw'
				});
			});

			getQuestions('H,P,Q,S', 2).then((data) => {
				math_questions.set(data.filter((q) => q.external_id));

				navigator.serviceWorker.controller?.postMessage({
					type: 'SAVE_QUESTIONS',
					payload: data,
					category: 'math'
				});
			});
		}
	});
};
