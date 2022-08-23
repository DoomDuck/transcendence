<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let imageURL: string;

	const dispatch = createEventDispatcher();

	function handleClick(event: MouseEvent) {
		dispatch('clickOnImage');
		event.stopPropagation();
	}
</script>

<img class="rounded-image" src={imageURL} alt="contact" on:click={handleClick} />

<style>
	.rounded-image {
		overflow: hidden;
		-webkit-border-radius: 50px;
		border-radius: 30px;
		width: 60px;
		height: 60px;
		margin-left: 1%;
		margin-right: 2%;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
