<script lang="ts">
	import Switch from '$lib/Switch.svelte';
	import type { ChatUserDto } from 'backFrontCommon';
	import { gameInviteMethods } from '$lib/ts/gameInvite';
	export let user: ChatUserDto;
	// const dispatch = createEventDispatcher<{sendGameInvite: GameInviteToServer}>();
</script>

<div id="invitation">
	<Switch optionOne="Classic Mode" optionTwo="Special Mode" />
	<a sveltekit:prefetch href="/WaitingRoom">
		<!-- <button on:click={ () => dispatch('sendGameInvite', { target: user.id }) }> -->
		<button on:click={() => gameInviteMethods.send(user.id)}>
			Invit {user.name} to play
		</button>
	</a>
</div>

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
