<script lang="ts">
	import JoinChannelModal from './JoinChannelModal.svelte';

	let show = false;
</script>

<button alt="Create a channel" width="50px" height="50px" on:click={() => (show = true)}
	>Join a channel</button
>

<JoinChannelModal bind:show on:joinChannel />
