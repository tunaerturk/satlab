<script lang="ts">
	import { goto } from '$app/navigation';
	import { question_viewer } from '$lib/stores/questionViewer.svelte';
</script>

<input
	class="purple-button"
	type="button"
	value="&#8592;"
	onclick={() => {
		question_viewer.update((current) => ({
			...current,
			showAnswer: false
		}));
		goto(`/question/${$question_viewer.prevId}`);
	}}
/>
