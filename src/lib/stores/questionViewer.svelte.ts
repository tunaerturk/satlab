import { writable } from 'svelte/store';

export let question_viewer = writable({
	prevId: '',
	activeId: '',
	nextId: '',
	showAnswer: false,

	showPageControls: true
});
