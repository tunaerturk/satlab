import type { RWSATQuestions } from '$lib/types';

export class Pagination {
	currentPage: number;
	itemsPerPage: number;
	paginatedQuestions: RWSATQuestions;
	filteredQuestions: RWSATQuestions;

	constructor(filteredQuestions: RWSATQuestions) {
		this.currentPage = $state(1);
		this.itemsPerPage = $state(10);
		this.filteredQuestions = filteredQuestions;
		this.paginatedQuestions = $derived(
			this.filteredQuestions.slice(
				(this.currentPage - 1) * this.itemsPerPage,
				this.currentPage * this.itemsPerPage
			)
		);
	}

	nextPage = () => {
		this.currentPage =
			this.currentPage < this.filteredQuestions.length / this.itemsPerPage
				? this.currentPage + 1
				: 1;
	};

	previousPage = () => {
		this.currentPage = this.currentPage > 0 ? this.currentPage - 1 : 1;
	};
}

export class FilterQuestions {
	searchQuery: string;
	skillOption: string;
	difficultyOption: string;
	statusOption: string;
	domainOption: string;

	filteredQuestions: RWSATQuestions;

	domains: string[];
	skills: string[];
	difficulties: string[];

	constructor(questions: RWSATQuestions, userAnswers: Record<string, any>) {
		this.domains = $derived([...new Set(questions.map((q) => q.primary_class_cd_desc))]);
		this.skills = $derived([...new Set(questions.map((q) => q.skill_desc))]);
		this.difficulties = $derived([...new Set(questions.map((q) => q.difficulty))]);

		this.searchQuery = $state('');
		this.skillOption = $state('');
		this.domainOption = $state('');
		this.difficultyOption = $state('');
		this.statusOption = $state('');

		this.filteredQuestions = $derived(
			questions.filter((q) => {
				if (
					this.searchQuery &&
					!q.external_id.toLowerCase().includes(this.searchQuery.toLowerCase())
				)
					return false;
				if (
					this.domainOption &&
					!(q.primary_class_cd_desc.toLowerCase() == this.domainOption.toLowerCase())
				)
					return false;
				if (this.skillOption && !(q.skill_desc.toLowerCase() == this.skillOption.toLowerCase()))
					return false;
				if (
					this.difficultyOption &&
					q.difficulty.toLowerCase() !== this.difficultyOption.toLowerCase()
				)
					return false;

				const answer = userAnswers[q.external_id];
				if (this.statusOption === 'unsolved' && answer) return false;
				if (this.statusOption === 'solved' && !answer) return false;
				if (this.statusOption === 'correct' && answer?.isCorrect !== true) return false;
				if (this.statusOption === 'incorrect' && answer?.isCorrect !== false) return false;

				return true;
			})
		);
	}
}
