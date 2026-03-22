import { browser } from '$app/environment';
import { getQuestions } from '$lib/getQuestions';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	//const questions = await getQuestions("INI,CAS,EOI,SEC");
	const userAnswers = browser ? JSON.parse(localStorage.getItem('userAnswers') || '{}') : [];
	return {
		userAnswers
	};
};
