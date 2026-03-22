<script>
	import { goto } from '$app/navigation';
	import { icons } from '$lib/stores/generalStores.svelte';
	import ThemeToggle from '../ThemeToggle.svelte';

	let { activePage = $bindable() } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="m-navbar">
	<div class="m-nav-container">
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
	</div>
	<div class="m-nav-link" onclick={() => goto('/')}>
		<img class="m-nav-logo" src={$icons.satLAB} alt="" />
	</div>
	<div class="m-nav-container">
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
	</div>
</div>
