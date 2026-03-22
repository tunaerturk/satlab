<script lang="ts">
	import { goto } from '$app/navigation';
	import { question_viewer } from '$lib/stores/questionViewer.svelte';
</script>

<input
	class="purple-button"
	type="button"
	value="&#8594;"
	onclick={() => {
		goto(`/question/${$question_viewer.nextId}`);
	}}
/>
