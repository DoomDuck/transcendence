<script lang='ts'>
	import Modal from './Modal.svelte'
	import Switch from './Switch.svelte'
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	let createChan = false;
	let mode = 'normal';
</script>

<img src="addGroup.png" alt="Create a channel" width=50px height=50px on:click={() => createChan = true }>

{#if createChan}
	<Modal on:close={() => {createChan = false}}>
		<div id="createChannel">
			<Switch optionOne='Private Channel' optionTwo='Public Channel'/>
			<input id="destinataire" type="search" placeholder="Members :" required /> 
			<button on:click={() => (dispatch('close'))}> 
				Create channel
			</button>
		</div>
	</Modal>
{/if}

<style>
	#createChannel{
		display:flex;
		flex-direction: column;
		width: 250px;
		gap: 10px;
		padding: 10px;
	}
	img{
		float:right;
	}
</style>