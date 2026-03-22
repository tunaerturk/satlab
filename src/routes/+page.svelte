<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { icons } from '$lib/stores/generalStores.svelte';

	function getDisplayMode(): boolean | null {
		if (browser) {
			if (window.matchMedia('(display-mode: standalone)').matches) {
				return true;
			} else {
				return false;
			}
		}

		return null;
	}

	let pwaMode: boolean | null = $state(false);

	onMount(() => {
		pwaMode = getDisplayMode();
	});
</script>

<div class="page-title">
	<div>Home</div>
</div>

<div class="main-flexbox">
	<img class="home-logo" src={$icons.satLAB} alt="" />

	<p>
		Welcome to <strong>satLAB</strong>, an open-source SAT study utility designed to help you study
	</p>
	{#if !pwaMode}
		<p>
			Our Progressive Web App (PWA) is available for
			<strong>Windows, macOS, Linux, Android, and iOS</strong>.
		</p>
		<p>To install satLAB on your device:</p>
		<ul>
			<li>
				<strong>Windows & macOS & Linux:</strong> Open the site in your browser and look for the "Install"
				or "+" icon in the address bar to add it to your desktop.
			</li>
			<li>
				<strong>Android:</strong> Open satLAB in Chrome, tap the three-dot menu, and select "Add to Home
				screen".
			</li>
			<li>
				<strong>iOS:</strong> Open satLAB in Safari, tap the Share icon, then select "Add to Home Screen".
			</li>
		</ul>
		<p>
			Once installed, you can access satLAB like a native app, even offline, making it easier than
			ever to study anytime, anywhere.
		</p>
	{/if}

	<input class="purple-button" type="button" value="Donate" onclick={() => goto('/donate')} />
</div>

<style>
	.main-flexbox {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.main-flexbox p {
		max-width: 400px;
		text-align: center;
	}

	.home-logo {
		width: 150px;
	}
</style>
