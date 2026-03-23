import { getQuestion } from '$lib/getQuestion';
import { loadQuestions } from '$lib/stores/questionsStore.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const question = await getQuestion(params.external_id);
	loadQuestions();

	return {
		question
	};
};
