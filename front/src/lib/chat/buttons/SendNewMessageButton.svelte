<script lang="ts">
	import SendNewMessageModal from '../modals/SendNewMessageModal.svelte';

	export let target: number | undefined = undefined;

	let show = false;
</script>

<div on:click={() => (show = true)}>
	<slot />
</div>

<SendNewMessageModal bind:show bind:predefinedTarget={target} />
