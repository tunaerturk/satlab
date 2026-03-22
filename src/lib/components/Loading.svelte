<script>
	import { icons } from '$lib/stores/generalStores.svelte';
	import { fly } from 'svelte/transition';
</script>

<div transition:fly class="loading-overlay">
	<img src={$icons.satLAB} alt="" />
	<div class="loading-spinner"></div>
	<p>Loading...</p>
</div>
