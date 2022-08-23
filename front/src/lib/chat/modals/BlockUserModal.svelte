<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/Modal.svelte';
	import type { ChatUserDto } from 'backFrontCommon';

	export let user: ChatUserDto;
	export let show = false;

	const dispatch = createEventDispatcher<{ blockUser: ChatUserDto }>();

	function handleBlockUser() {
		dispatch('blockUser', user);
		show = false;
	}
</script>

<Modal bind:show>
	<div>
		<h4>Confirm blocking user {user.name} ?</h4>
		<div>
			<button on:click={handleBlockUser}>Yes</button>
			<button on:click={() => (show = false)}>Cancel</button>
		</div>
	</div>
</Modal>
