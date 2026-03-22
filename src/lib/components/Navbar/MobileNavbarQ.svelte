<script lang="ts">
	import { goto } from '$app/navigation';
	import { icons } from '$lib/stores/generalStores.svelte';
	import { question_viewer } from '$lib/stores/questionViewer.svelte';
	import { fade } from 'svelte/transition';
	import QPageControlLeft from '../question-viewer/Q-PageControlLeft.svelte';
	import QPageControls from '../question-viewer/Q-PageControlLeft.svelte';
	import QPageControlRight from '../question-viewer/Q-PageControlRight.svelte';
	import ThemeToggle from '../ThemeToggle.svelte';

	let { activePage = $bindable() } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="m-navbar">
	<div class="m-nav-container">
		{#if $question_viewer.showPageControls}
			<QPageControlLeft />
		{:else}
			<div
				class="m-nav-link {activePage === '/bank' ? 'm-nav-link-active' : ''}"
				onclick={() => goto('/bank')}
			>
				<img class="m-nav-icon" src={$icons.bank} alt="" />
				<div>Bank</div>
			</div>
			<div
				class="m-nav-link {activePage === '/summary' ? 'm-nav-link-active' : ''}"
				onclick={() => goto('/summary')}
			>
				<img class="m-nav-icon" src={$icons.summary} alt="" />
				<div>Summary</div>
			</div>
		{/if}
	</div>
	<div
		class="m-nav-link"
		onclick={() =>
			question_viewer.update((c) => ({
				...c,
				showPageControls: $question_viewer.showPageControls ? false : true
			}))}
	>
		<img class="m-nav-logo" src={$icons.satLAB} alt="" />
	</div>
	<div class="m-nav-container">
		{#if $question_viewer.showPageControls}
			<QPageControlRight />
		{:else}
			<div
				class="m-nav-link {activePage === '/donate' ? 'm-nav-link-active' : ''}"
				onclick={() => goto('/donate')}
			>
				<img class="m-nav-icon" src={$icons.donate} alt="" />
				<div>Donate</div>
			</div>
			<div
				class="m-nav-link {activePage === '/settings' ? 'm-nav-link-active' : ''}"
				onclick={() => goto('settings')}
			>
				<img class="m-nav-icon" src={$icons.settings} alt="" />
				<div>Settings</div>
			</div>
			<div class="m-nav-link">
				<ThemeToggle />
			</div>
		{/if}
	</div>
</div>
