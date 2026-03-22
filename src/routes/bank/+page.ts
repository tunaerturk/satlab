import { loadQuestions } from '$lib/stores/questionsStore.svelte';

export let load = async () => {
	loadQuestions();
};
