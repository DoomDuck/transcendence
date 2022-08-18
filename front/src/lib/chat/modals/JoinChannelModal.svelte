<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import type { JoinChannelToServer } from 'backFrontCommon';
	import { createEventDispatcher } from 'svelte';
	export let show = false;

	const dispatch = createEventDispatcher<{ joinChannel: JoinChannelToServer }>();
	let channelName: string;
	let password: string | undefined;

	function handleSubmit() {
		show = false;
		dispatch('joinChannel', {
			channel: channelName,
			password
		});
	}

	function handleBlur() {
		channelName = channelName.trim();
	}
</script>

<Modal bind:show>
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
