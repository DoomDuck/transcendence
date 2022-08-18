<script lang="ts">
	import SendNewMessageModal from '../modals/SendNewMessageModal.svelte';

	let show = false;
</script>

<img
	id="btn-new-message"
	src="pencil.png"
	width="40"
	height="40"
	alt="write msg"
	on:click={() => (show = true)}
/>

<SendNewMessageModal bind:show on:msgToUser />

<style>
	#btn-new-message {
		float: right;
	}
</style>
