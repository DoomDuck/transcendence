<script lang="ts">
	import GameInvitBox from './GameInvitBox.svelte';
	import Modal from './Modal.svelte';

	let invitModal = false;
	export let name: string;
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
		<GameInvitBox {name} />
	</Modal>
{/if}

<style>
	.play {
		margin-left: auto;
		padding: 5%;
	}
</style>
