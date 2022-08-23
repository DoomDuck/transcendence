<script lang="ts">
	import GameInviteModal from '../modals/GameInviteModal.svelte';
	import Modal from '$lib/Modal.svelte';
	import type { ChatUserDto } from 'backFrontCommon';

	let invitModal = false;
	export let user: ChatUserDto;
</script>

<img
	on:click={() => (invitModal = true)}
	class="play"
	src="joystick.png"
	alt="play"
	width="40px"
	height="40px"
/>
{#if invitModal}
	<Modal on:close={() => (invitModal = false)}>
		<GameInviteModal {user} />
	</Modal>
{/if}

<style>
	.play {
		margin-left: auto;
		padding: 5%;
	}
</style>
