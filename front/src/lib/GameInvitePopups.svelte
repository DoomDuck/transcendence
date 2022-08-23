<script lang="ts">
	import GameInvitePopup from './GameInvitePopup.svelte';
	import { invits, type GameInviteDto } from '$lib/ts/gameInvite';

	invits.subscribe(() => {
		console.log('updating...');
	});
</script>

<div id="game-invite-popups">
	{#each $invits as invite (invite.sender)}
		<GameInvitePopup {invite} />
	{/each}
</div>

<style>
	#game-invite-popups {
		position: absolute;
		display: flex;
		flex-direction: column;
		right: 0;
	}
</style>
