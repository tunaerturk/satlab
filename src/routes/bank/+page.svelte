<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import type { PageProps } from '../$types';
	import { FilterQuestions, Pagination } from '$lib/classes/questionBankClasses.svelte';
	import { math_questions, rw_questions } from '$lib/stores/questionsStore.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { userAnswers } from '$lib/stores/userStore.svelte';
	import { categoryState } from '$lib/stores/generalStores.svelte';

	let { data }: PageProps = $props();
	let questions = $derived({ $math_questions, $rw_questions });
	let activeQuestions = $derived(
		$categoryState === 'math' ? questions.$math_questions : questions.$rw_questions
	);

	let screenWidth = $state(0);

	let mobileShowFilterOptions = $state(false);

	function difficultyLabel(d: string) {
		if (d === 'H') return 'Hard';
		if (d === 'M') return 'Medium';
		if (d === 'E') return 'Easy';
		return d;
	}

	let filterQuestions: FilterQuestions = $derived(
		new FilterQuestions(activeQuestions, userAnswers)
	);

	let pagination: Pagination = $derived(new Pagination(filterQuestions.filteredQuestions));
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="page-title">
	<div class="category-container">
		<input
			class="category-button {$categoryState === 'math' ? 'category-button-selected' : ''}"
			type="button"
			value="Math"
			onclick={() => categoryState.set("math")}
		/>
		<p>Question Bank</p>
		<input
			class="category-button {$categoryState === 'rw' ? 'category-button-selected' : ''}"
			type="button"
			value="Read & Write"
			onclick={() => categoryState.set("rw")}
		/>
	</div>
	<div class="question-id-text">
		{filterQuestions.filteredQuestions.length} of {activeQuestions.length}
	</div>
	{#if screenWidth > 600}
		{@render filterOptions()}
	{:else}
		<input
			class="purple-button"
			type="button"
			value="Filter Options"
			onclick={() => {
				mobileShowFilterOptions = mobileShowFilterOptions ? false : true;
			}}
		/>
	{/if}
	<div class="pagination-container">
		<input class="purple-button" type="button" value="&#8592;" onclick={pagination.previousPage} />
		<input
			class="pagination-items-input"
			type="text"
			name=""
			id=""
			bind:value={pagination.itemsPerPage}
		/>
		<input class="purple-button" type="button" value="&#8594;" onclick={pagination.nextPage} />
	</div>
</div>

{#snippet filterOptions()}
	<div transition:fly class="filter-options">
		<input
			class="filter-option"
			type="text"
			placeholder="Search"
			bind:value={filterQuestions.searchQuery}
		/>
		<select
			class="filter-option"
			name="domains"
			id="domains"
			bind:value={filterQuestions.domainOption}
		>
			<option value="">All Domains</option>
			{#each filterQuestions.domains as domain}
				<option value={domain}>{domain}</option>
			{/each}
		</select>
		<select
			class="filter-option"
			name="skills"
			id="skills"
			bind:value={filterQuestions.skillOption}
		>
			<option value="">All Skills</option>
			{#each filterQuestions.skills as skill}
				<option value={skill}>{skill}</option>
			{/each}
		</select>
		<select
			class="filter-option"
			name="difficulties"
			id="difficulties"
			bind:value={filterQuestions.difficultyOption}
		>
			<option value="">All Difficulties</option>
			{#each filterQuestions.difficulties as difficulty}
				<option value={difficulty}>{difficultyLabel(difficulty)}</option>
			{/each}
		</select>
		<select class="filter-option" bind:value={filterQuestions.statusOption}>
			<option value="">Any Status</option>
			<option value="unsolved">Unsolved</option>
			<option value="solved">Solved (All)</option>
			<option value="correct">Solved (Correct)</option>
			<option value="incorrect">Solved (Incorrect)</option>
		</select>
	</div>
{/snippet}

{#if mobileShowFilterOptions}
	{@render filterOptions()}
{/if}
<div class="questions-grid">
	{#if screenWidth > 600}
		<div class="questions-grid-header">
			<div>QUESTION ID</div>
			<div>STATUS</div>
			<div>DOMAIN</div>
			<div>SKILL</div>
			<div>DIFFICULTY</div>
			<div>UPDATED</div>
			<div>ACTION</div>
		</div>
	{/if}
	{#each pagination.paginatedQuestions as question}
			<div class="question-row">
				{#if screenWidth > 600}
					<div class="questions-grid-item truncate-text">{question.external_id}</div>
				{/if}
				{#if screenWidth > 600}
					{#if userAnswers[question.external_id]}
						<div
							class="questions-grid-item status-tag status-{userAnswers[question.external_id]
								.isCorrect
								? 'correct'
								: 'incorrect'}"
						>
							{userAnswers[question.external_id].isCorrect ? 'CORRECT' : 'INCORRECT'}
						</div>
					{:else}
						<div class="questions-grid-item status-tag status-unsolved">UNSOLVED</div>
					{/if}
				{/if}
				<div class="questions-grid-item">{question.primary_class_cd_desc}</div>
				<div class="questions-grid-item">{question.skill_desc}</div>
				{#if screenWidth > 600}
					<div
						class="questions-grid-item difficulty-tag difficulty-{question.difficulty.toLowerCase()}"
					>
						{difficultyLabel(question.difficulty)}
					</div>
				{/if}
				<div class="questions-grid-item">{new Date(question.updateDate).toLocaleDateString()}</div>
				<div class="questions-grid-item">
					<input
						class="view-button"
						type="button"
						value="View →"
						onclick={() => goto(`/question/${question.external_id}`)}
					/>
				</div>
			</div>
	{/each}
	{#if activeQuestions.length === 0}
		<Loading />
	{/if}
</div>
