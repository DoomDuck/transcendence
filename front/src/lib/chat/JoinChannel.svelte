<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import { ChannelCategory } from 'chat/constants';

	const dispatch = createEventDispatcher();

	let joinChanModal = false;
	let channelName: string;
	let password: string | undefined;

	function handleClickOpenModal() {
		joinChanModal = true;
	}
	function handleSubmit() {
		joinChanModal = false;
		dispatch('joinChannel', {
			channel: channelName,
			password
		});
	}

	function handleBlur() {
		channelName = channelName.trim();
	}
</script>

<button alt="Create a channel" width="50px" height="50px" on:click={handleClickOpenModal}
	>Join a channel</button
>

{#if joinChanModal}
	<Modal>
		<form id="joinChannel" on:submit|preventDefault={handleSubmit}>
			<input
				id="channelName"
				placeholder="Channel Name"
				bind:value={channelName}
				on:blur={handleBlur}
				required
			/>
			<div id="password">
				<span>Password (optional): </span>
				<input bind:value={password} />
			</div>
			<input type="submit" value="Join channel" />
		</form>
	</Modal>
{/if}

<style>
	#joinChannel {
		display: flex;
		flex-direction: column;
		width: 250px;
		gap: 20px;
		padding: 10px;
	}
	#password {
		display: flex;
		flex-direction: row;
	}
	#password input {
		flex-grow: 1;
	}
</style>
