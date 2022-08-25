<script lang="ts">
	import GameInviteModal from '../modals/GameInviteModal.svelte';
	import type { ChatUserDto } from 'backFrontCommon';

	let show = false;
	export let user: ChatUserDto;
</script>

<img
	on:click={() => (show = true)}
	class="play"
	src="joystick.png"
	alt="play"
	width="40px"
	height="40px"
/>

<GameInviteModal bind:show {user} />

<style>
	.play {
		margin-left: auto;
		padding: 5%;
	}
</style>
