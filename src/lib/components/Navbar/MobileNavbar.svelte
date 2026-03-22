<script lang="ts">
	import { goto } from '$app/navigation';
	import type { navIcons } from '$lib/types';
	import MobileNavbarN from './MobileNavbarN.svelte';
	import MobileNavbarQ from './MobileNavbarQ.svelte';

	let { activePage = $bindable() } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

{#if activePage.startsWith('/question')}
	<MobileNavbarQ bind:activePage />
{:else}
	<MobileNavbarN bind:activePage />
{/if}
