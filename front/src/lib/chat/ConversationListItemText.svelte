<script lang="ts">
	import PendingText from '$lib/PendingText.svelte';

	export let text: string | Promise<string>;
</script>

<div class="item-text">
	<PendingText tag="h5" {text} />
</div>

<style>
	.item-text {
		font-size: 1em;
		color: #ff00b8;
	}
</style>
