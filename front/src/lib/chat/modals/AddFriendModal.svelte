<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { sendFriendInvite } from '$lib/state';
	import PositiveIntegerInput from '../PositiveIntegerInput.svelte';

	export let show: boolean = false;
	let content: string;

	function handleSubmit() {
		sendFriendInvite({ target: +content });
		close();
	}
	function close() {
		content = '';
		show = false;
	}
</script>

<Modal bind:show on:close={() => (show = false)}>
	<form id="addNewFriend" on:submit|preventDefault={handleSubmit}>
		Add a friend
		<PositiveIntegerInput placeholder="Friend's ID:" bind:content />
		<br />
		<div>
			<input type="submit" value="Add" />
			<button on:click={close}>Cancel</button>
		</div>
	</form>
</Modal>
