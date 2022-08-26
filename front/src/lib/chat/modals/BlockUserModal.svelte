<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/Modal.svelte';
	import type { UserInfo } from 'backFrontCommon';

	export let user: UserInfo;
	export let show = false;

	const dispatch = createEventDispatcher<{ blockUser: UserInfo }>();

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
