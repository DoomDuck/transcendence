<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { chatMethods } from '$lib/ts/chat';
	export let show = false;

	let channelName: string;
	let password: string | undefined;

	function handleSubmit() {
		show = false;
		chatMethods.sendJoinChannel({
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
		<input bind:value={password} 
			placeholder="Optionnal password"
		/>
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
