<script lang="ts">
	import Switch from '$lib/Switch.svelte';
	import type { ChatUserDto } from 'backFrontCommon';
	import { gameInviteMethods } from '$lib/ts/gameInvite';
	import Modal from '$lib/Modal.svelte';

	export let show = false;
	export let user: ChatUserDto;

	let mode: number;

	function sendInvite() {
		gameInviteMethods.send({ target: user.id, classic: mode == 0 });
		show = false;
	}
</script>

<Modal bind:show>
	<div id="invitation">
		<Switch options={['Classic Mode', 'WeIrD Mode']} bind:mode />
		<button on:click={sendInvite}>
			Invit {user.name} to play
		</button>
	</div>
</Modal>

<style>
	#invitation {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding: 15px;
	}
</style>
