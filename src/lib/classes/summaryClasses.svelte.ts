import { userAnswers } from '$lib/stores/userStore.svelte';
import type { RWSATQuestions, RWSATQuestionsItem } from '$lib/types';

export class SummaryStats {
	totalAttempted: number;
	totalCorrect: number;
	accuracy: number;

	questions: RWSATQuestions;
	constructor(questions: RWSATQuestions) {
		this.questions = questions;

		this.totalAttempted = $derived(Object.keys(userAnswers).length);
		this.totalCorrect = $derived(Object.values(userAnswers).filter((e: any) => e.isCorrect).length);
		this.accuracy = $derived(
			this.totalAttempted > 0 ? Math.round((this.totalCorrect / this.totalAttempted) * 100) : 0
		);
	}

	difficultyStats: () => Record<string, { attempted: number; correct: number }> = $derived(() => {
		const stats: Record<string, { attempted: number; correct: number }> = {
			E: { attempted: 0, correct: 0 },
			M: { attempted: 0, correct: 0 },
			H: { attempted: 0, correct: 0 }
		};

		Object.entries(userAnswers).forEach(([id, ans]) => {
			const q = this.questions.find((q: RWSATQuestionsItem) => q.external_id === id);
			if (q && stats[q.difficulty]) {
				stats[q.difficulty].attempted++;
				if (ans.isCorrect) stats[q.difficulty].correct++;
			}
		});

		return stats;
	});

	// Domain Breakdown
	domainStats: () => [
		string,
		{
			attempted: number;
			correct: number;
		}
	][] = $derived(() => {
		const stats: Record<string, { attempted: number; correct: number }> = {};

		Object.entries(userAnswers).forEach(([id, ans]) => {
			const q = this.questions.find((q: RWSATQuestionsItem) => q.external_id === id);
			if (q) {
				const domain = q.primary_class_cd_desc;
				if (!stats[domain]) stats[domain] = { attempted: 0, correct: 0 };
				stats[domain].attempted++;
				if (ans.isCorrect) stats[domain].correct++;
			}
		});

		return Object.entries(stats).sort((a, b) => b[1].attempted - a[1].attempted);
	});

	// Skill Breakdown
	skillStats: () => [
		string,
		{
			attempted: number;
			correct: number;
		}
	][] = $derived(() => {
		const stats: Record<string, { attempted: number; correct: number }> = {};

		Object.entries(userAnswers).forEach(([id, ans]) => {
			const q = this.questions.find((q: RWSATQuestionsItem) => q.external_id === id);
			if (q) {
				const skill = q.skill_desc;
				if (!stats[skill]) stats[skill] = { attempted: 0, correct: 0 };
				stats[skill].attempted++;
				if (ans.isCorrect) stats[skill].correct++;
			}
		});

		return Object.entries(stats).sort((a, b) => b[1].attempted - a[1].attempted);
	});

	// Daily Breakdown
	dailyStats: () => [
		string,
		{
			attempted: number;
			correct: number;
		}
	][] = $derived(() => {
		const stats: Record<string, { attempted: number; correct: number }> = {};

		Object.entries(userAnswers).forEach(([_, ans]) => {
			// Local date YYYY-MM-DD
			const date = ans.timestamp ? new Date(ans.timestamp).toLocaleDateString() : 'Previous Data';
			if (!stats[date]) stats[date] = { attempted: 0, correct: 0 };
			stats[date].attempted++;
			if (ans.isCorrect) stats[date].correct++;
		});

		return Object.entries(stats).sort((a, b) => {
			if (a[0] === 'Previous Data') return 1;
			if (b[0] === 'Previous Data') return -1;
			return new Date(b[0]).getTime() - new Date(a[0]).getTime();
		});
	});
}
