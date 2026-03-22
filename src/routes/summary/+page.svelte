<script lang="ts">
	import { resetAnswers } from '$lib/stores/userStore.svelte';
	import type { PageProps } from '../$types';
	import { SummaryStats } from '$lib/classes/summaryClasses.svelte';
	import { questionsStore } from '$lib/stores/questionsStore.svelte';

	let { data }: PageProps = $props();

	let summaryStats: SummaryStats = $derived(new SummaryStats($questionsStore));
	const diffMap: Record<string, string> = { E: 'Easy', M: 'Medium', H: 'Hard' };
</script>

<div class="page-title">
	<p>Summary</p>
	<input type="button" value="Reset" class="purple-button" onclick={() => resetAnswers()} />
</div>

<div class="summary-flexbox">
	<div class="summary-stats-grid">
		<div class="summary-stat-box">
			<div class="summary-stat-title">TOTAL ATTEMPTED</div>
			<p>{summaryStats.totalAttempted}</p>
		</div>
		<div class="summary-stat-box">
			<div class="summary-stat-title">TOTAL CORRECT</div>
			<p>{summaryStats.totalCorrect}</p>
		</div>
		<div class="summary-stat-box">
			<div class="summary-stat-title">OVERALL ACCURACY</div>
			<p>{summaryStats.accuracy}%</p>
		</div>
	</div>
	<div class="summary-category-stats-grid">
		<div class="summary-category-stat-box">
			<strong>By Difficulty</strong>
			{#each Object.entries(summaryStats.difficultyStats()) as [diff, data]}
				<div class="summary-category-stat-box-item">
					<div>{diffMap[diff] || diff}</div>
					<div>
						<progress
							value={data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0}
							max="100"
						></progress>
					</div>
					<div>{data.correct}/{data.attempted}</div>
				</div>
			{/each}
		</div>
		<div class="summary-category-stat-box">
			<strong>By Domain</strong>
			{#each summaryStats.domainStats() as [domain, data]}
				<div class="summary-category-stat-box-item">
					<div class="truncate-text">{domain}</div>
					<div>
						<progress
							value={data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0}
							max="100"
						></progress>
					</div>
					<div>{data.correct}/{data.attempted}</div>
				</div>
			{/each}
		</div>
		<div class="summary-category-stat-box">
			<strong>By Skill</strong>
			{#each summaryStats.skillStats() as [skill, data]}
				<div class="summary-category-stat-box-item">
					<div class="truncate-text">{skill}</div>
					<div>
						<progress
							value={data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0}
							max="100"
						></progress>
					</div>
					<div>{data.correct}/{data.attempted}</div>
				</div>
			{/each}
		</div>
		<div class="summary-category-stat-box">
			<strong>Daily Performance</strong>
			{#each summaryStats.dailyStats() as [date, data]}
				<div class="summary-category-stat-box-item">
					<div class="truncate-text">{date}</div>
					<div>
						<progress
							value={data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0}
							max="100"
						></progress>
					</div>
					<div>{data.correct}/{data.attempted}</div>
				</div>
			{/each}
		</div>
	</div>
</div>
