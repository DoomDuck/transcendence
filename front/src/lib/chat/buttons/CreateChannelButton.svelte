<script lang="ts">
	import CreateChannelModal from '../modals/CreateChannelModal.svelte';
	let show = false;
</script>

<img
	src="addGroup.png"
	alt="Create a channel"
	width="50px"
	height="50px"
	on:click={() => (show = true)}
/>

<CreateChannelModal bind:show on:createChannel />

<style>
	img {
		float: right;
	}
</style>
