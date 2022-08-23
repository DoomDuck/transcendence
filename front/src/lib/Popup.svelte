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
