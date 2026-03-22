import { browser } from '$app/environment';
let initialAnswers = browser ? JSON.parse(localStorage.getItem('userAnswers') || '{}') : {};
export let userAnswers = $state(
	<Record<string, { answerId: string; isCorrect: boolean; timestamp: number }>>initialAnswers
);

export const saveAnswer = (questionId: string, answerId: string, isCorrect: boolean) => {
	userAnswers[questionId] = { answerId, isCorrect, timestamp: Date.now() };
	if (browser) {
		localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
	}
};

export const resetAnswers = () => {
	if (browser) {
		localStorage.setItem('userAnswers', JSON.stringify({}));
	}
	Object.keys(userAnswers).forEach((key) => delete userAnswers[key]);
};
