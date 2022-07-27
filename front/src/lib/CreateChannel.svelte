<script lang='ts'>
	import Modal from './Modal.svelte'

	let createChan = false;
</script>

<img src="CreateChannel.png" alt="Create a channel" width=50px height=50px on:click={() => createChan = true }>

{#if createChan}
	<Modal on:close={() => {createChan = false}}>
		
	</Modal>
{/if}

<style>
	img{
		float:right;
	}
</style>