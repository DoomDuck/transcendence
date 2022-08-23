<script lang="ts">
	import { onMount } from 'svelte';
	import { popupMethods, type CanBePopup } from './ts/popups';

	export let popup: CanBePopup;

	let acceptButton: HTMLButtonElement;
	let closeButton: HTMLButtonElement;
	onMount(() => {
		if (popup.hasButton && popup.onAccept) {
			acceptButton.onclick = popup.onAccept.bind(popup);
		}
		closeButton.onclick = () => {
			if (popup.onClose) popup.onClose();
			popupMethods.removePopup(popup);
		};
	});
</script>

<svelte:head>
	<script
		src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
		integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
		crossorigin="anonymous"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"
		integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
		crossorigin="anonymous"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"
		integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
		crossorigin="anonymous"></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
		integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="popup">
	<div
		class="alert {popup.popupCategory} alert-dismissible fade show"
		role="alert"
		style="margin: 0"
	>
		{popup.text}
		{#if popup.hasButton}
			<button type="button" class="btn btn-primary text-right" bind:this={acceptButton}
				>{popup.buttonLabel}</button
			>
		{/if}
		<button type="button" aria-label="Close" bind:this={closeButton}>
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
</div>
