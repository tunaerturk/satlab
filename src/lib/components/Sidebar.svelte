<script lang="ts">
	import { goto } from '$app/navigation';
	import { icons } from '$lib/stores/generalStores.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { fly } from 'svelte/transition';

	let { activePage = $bindable('') } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="sidebar" transition:fly>
	<img class="sidebar-logo" src={$icons.satLAB} alt="" />
	<div class="sidebar-link {activePage === '/' ? 'sidebar-active' : ''}" onclick={() => goto('/')}>
		<img src={$icons.home} alt="" />
		<p>Home</p>
	</div>
	<div
		class="sidebar-link {activePage === '/bank' ? 'sidebar-active' : ''}"
		onclick={() => goto('/bank')}
	>
		<img src={$icons.bank} alt="" />
		<p>Bank</p>
	</div>
	<div
		class="sidebar-link {activePage === '/summary' ? 'sidebar-active' : ''}"
		onclick={() => goto('/summary')}
	>
		<img src={$icons.summary} alt="" />
		<p>Summary</p>
	</div>
	<div class="sidebar-link {activePage == '/donate' ? 'sidebar-active' : ''}">
		<img src={$icons.donate} alt="" onclick={() => goto('/donate')} />
		<p>Donate</p>
	</div>
	<div class="sidebar-link disabled {activePage === '/settings' ? 'sidebar-active' : ''}">
		<img src={$icons.settings} alt="" onclick={() => goto('/settings')} />
		<p>Settings</p>
	</div>
	<div style="margin-bottom: 20px;">
		<ThemeToggle />
	</div>
</div>
