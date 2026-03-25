<script lang="ts">
	import QPageControlLeft from '$lib/components/question-viewer/Q-PageControlLeft.svelte';
	import QPageControlRight from '$lib/components/question-viewer/Q-PageControlRight.svelte';
	import { question_viewer } from '$lib/stores/questionViewer.svelte';
	import { saveAnswer, userAnswers } from '$lib/stores/userStore.svelte';
	import { fade, fly } from 'svelte/transition';
	import type { PageProps } from './$types';
	import { PageTimer, SelectTooltip } from '$lib/classes/questionViewerClasses.svelte';
	import { math_questions, rw_questions } from '$lib/stores/questionsStore.svelte';
	import type { RWSATQuestion } from '$lib/types';

	let { data }: PageProps = $props();

	let question = $derived(data.question);
	let questions = $derived((question.stimulus ? $rw_questions : $math_questions) ?? []);

	let showAnswer = $state(false);
	let showCalculator = $state(false);
	let selectedAnswerId = $state('');
	let answerTextBox = $state('');

	let pageTimer: PageTimer = $state(new PageTimer());

	let selectTooltip: SelectTooltip = new SelectTooltip();

	const getLetter = (index: number) => String.fromCharCode(65 + index);

	let currentIndex = $derived(questions.findIndex((q) => q.external_id === question.externalid));
	let prevId = $derived(currentIndex > 0 ? questions[currentIndex - 1].external_id : '');
	let nextId = $derived(
		currentIndex < questions.length - 1 ? questions[currentIndex + 1].external_id : ''
	);
	let activeId = $derived(question.externalid);

	$effect(() => {
		showAnswer = false;
		selectedAnswerId = '';

		question_viewer.set({
			prevId: prevId,
			activeId: activeId,
			nextId: nextId,
			showAnswer: false,
			showPageControls: true
		});
	});

	function difficultyLabel(d: string) {
		if (d === 'H') return 'Hard';
		if (d === 'M') return 'Medium';
		if (d === 'E') return 'Easy';
		return d;
	}
	let screenWidth = $state(0);

	let submitAnswer = (answerOption?: any, i?: number) => {
		if (question) {
			if (answerOption && i) {
				const isCorrect = question.correct_answer.includes(getLetter(i));
				selectedAnswerId = answerOption.id;
				saveAnswer(question.externalid, answerOption.id, isCorrect);
				showAnswer = true;
			} else {
				const isCorrect = question.correct_answer.includes(answerTextBox);
				saveAnswer(question.externalid, answerTextBox, isCorrect);
				showAnswer = true;
			}
		}
	};
</script>

<svelte:window bind:innerWidth={screenWidth} />

{#snippet explanation()}
	<div transition:fade class="question-explanation-container" style="opacity: {showAnswer ? 1 : 0}">
		<div class="question-correct-answer">Correct Answer: {question.correct_answer}</div>
		{@html question.rationale}
	</div>
{/snippet}

<div class="question-viewer">
	<div class="question-page-header">
		{#if screenWidth > 600}
			<div class="page-controls">
				{#if prevId}
					<QPageControlLeft />
				{:else}
					<div style="width: 40px;"></div>
				{/if}
				<div class="page-title">
					<div>Question Viewer</div>
					<div class="question-id-text">Question ID: {question.externalid}</div>
					{#if questions[currentIndex]}
						<div class="question-id-text">
							{questions[currentIndex].primary_class_cd_desc}: {questions[currentIndex].skill_desc}
							<strong class="difficulty-{questions[currentIndex].difficulty.toLowerCase()}">
								{difficultyLabel(questions[currentIndex].difficulty)}
							</strong>
						</div>
					{/if}
				</div>
				{#if nextId}
					<QPageControlRight />
				{:else}
					<div style="width: 40px;"></div>
				{/if}
			</div>
		{:else}
			<div class="page-title">
				<div>Question Viewer</div>
				<div class="question-id-text">Question ID: {question.externalid}</div>
				{#if questions[currentIndex]}
					<div class="question-id-text">
						{questions[currentIndex].primary_class_cd_desc}: {questions[currentIndex].skill_desc}
						<strong class="difficulty-{questions[currentIndex].difficulty.toLowerCase()}">
							{difficultyLabel(questions[currentIndex].difficulty)}
						</strong>
					</div>
				{/if}
			</div>
		{/if}
		<div class="question-controls">
			<div class="timer-container">
				{#if screenWidth > 600}
					<input
						class="timer-button {showCalculator ? 'timer-red' : ''}"
						type="button"
						value="🧮"
						onclick={() => showCalculator = showCalculator ? false : true}
					/>
				{/if}
				<input
					class="timer-button {pageTimer.active ? 'timer-red' : ''}"
					type="button"
					value="&#9201;"
					onclick={pageTimer.toggle}
				/>
				<p>Time: {Math.floor(pageTimer.time / 60)}:{pageTimer.time % 60}</p>
				{#if !pageTimer.active && pageTimer.time > 0}
					<input
						class="timer-button timer-red"
						type="button"
						value="&#x21BB;"
						onclick={pageTimer.reset}
					/>
				{/if}
			</div>

			<div transition:fly class="show-answer-container">
				<p>Show Answer</p>
				<input class="show-answer-input" type="checkbox" name="" id="" bind:checked={showAnswer} />
			</div>
		</div>
	</div>

	<div class="question-container">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		{#if question.stimulus}
			<div
				class="question-paragraph"
				onmouseup={selectTooltip.handleSelection}
				ontouchend={selectTooltip.handleSelection}
			>
				{@html question.stimulus}

				{#if selectTooltip.visible}
					<div
						transition:fly
						class="select-tooltip"
						style="top: {selectTooltip.coords.y + 40}px; left: {selectTooltip.coords.y}px;"
					>
						<div class="select-tooltip-container">
							<p>{selectTooltip.text}</p>
							<input
								class="purple-button"
								type="button"
								value="Explain"
								onclick={selectTooltip.handleClick}
							/>
						</div>
						{#if selectTooltip.result.show}
							<div transition:fly class="select-tooltip-container">
								{selectTooltip.result.text}
							</div>
						{/if}
					</div>
				{/if}
				{#if showAnswer && screenWidth > 600}
					{@render explanation()}
				{/if}
			</div>
		{:else}
			{#if screenWidth > 600 && showCalculator}
				<iframe transition:fade
					class="desmos-calculator"
					src="https://www.desmos.com/testing/collegeboard/graphing"
					title="desmos calculator"
					frameborder="0"
				></iframe>
			{/if}
			{#if showAnswer && screenWidth > 600}
				{@render explanation()}
			{/if}
		{/if}
		<div class="question-answers">
			{@html question.stem}
			{#if question.answerOptions.length === 0}
				<div class="user-input-container">
					<input
						type="text"
						placeholder="Enter Your Answer"
						bind:value={answerTextBox}
						onkeydown={(event) => {
							if (event.key === 'Enter') submitAnswer();
						}}
					/>
					<input type="button" value="Submit" onclick={submitAnswer} />
				</div>
			{/if}
			{#each question.answerOptions as answerOption, i}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="question-answer" onclick={() => submitAnswer(answerOption, i)}>
					<button
						class="question-answer-button {showAnswer &&
						question.correct_answer.includes(getLetter(i))
							? 'question-answer-button-correct'
							: ''} {!question.correct_answer.includes(getLetter(i)) &&
						selectedAnswerId === answerOption.id
							? 'question-answer-button-selected'
							: ''}">{getLetter(i)}</button
					>
					{@html answerOption.content}
				</div>
			{/each}
		</div>
		{#if showAnswer && screenWidth < 600}
			{@render explanation()}
		{/if}
	</div>
</div>
