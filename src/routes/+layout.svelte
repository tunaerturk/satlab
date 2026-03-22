<script lang="ts">
	let { children } = $props();

	import '../styles/general.css';
	import '../styles/question-bank.css';
	import '../styles/question-viewer.css';
	import '../styles/sidebar.css';
	import '../styles/summary.css';
	import '../styles/mobile-navbar.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import MobileNavbar from '$lib/components/Navbar/MobileNavbar.svelte';
	import { icons } from '$lib/stores/generalStores.svelte';
	import { themeStore } from '$lib/stores/generalStores.svelte';

	let loading = $state(true);

	import { icons_, iconsDark } from '$lib/assets/icons';
	import { fly } from 'svelte/transition';
	import Loading from '$lib/components/Loading.svelte';

	let activePage = $derived(page.url.pathname);

	let screenWidth = $state(0);

	const detectSWUpdate = async () => {
		const registration = await navigator.serviceWorker.ready;
		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
					if (confirm('New Update Available! Reload to update?')) {
						newSW.postMessage({ type: 'SKIP_WAITING' });
						window.location.reload();
					}
				}
			});
		});
	};

	onMount(() => {
		detectSWUpdate();
		themeStore.applyTheme();

		const unsubscribe = themeStore.current.subscribe((theme) => {
			if (theme === 'dark') {
				icons.set(iconsDark);
			} else {
				icons.set(icons_);
			}
		});

		loading = false;

		return unsubscribe;
	});
</script>

<svelte:window bind:innerWidth={screenWidth} />

<svelte:head>
	<title>satLAB</title>
</svelte:head>

<!-- svelte-ignore a11y_no_static_element_interactions -->

{#if !loading}
	{#if screenWidth > 600}
		<Sidebar bind:activePage />
	{:else}
		<MobileNavbar {activePage} />
	{/if}
	{@render children()}
{:else}
	<Loading />
{/if}
