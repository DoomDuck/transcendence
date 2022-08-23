<script lang="ts">
	import type { GameInviteDto } from './ts/gameInvite';
	import { gameInvitsMethods } from './ts/gameInvite';

	export let invite: GameInviteDto;

	$: alertCategory = invite.valid ? 'alert-warning' : 'alert-danger';

	// DEBUG
	function debug() {
		gameInvitsMethods.revoke(invite.sender, 'NOPE');
	}
</script>

<div class="popup">
	<div class="alert {alertCategory} alert-dismissible fade show" role="alert" style="margin: 0">
		{#if invite.valid}
			You have been invited by {invite.senderName} to play
			<button type="button" class="btn btn-primary text-right">Accept</button>
		{:else}
			{invite.errorMessage}
		{/if}
		<button type="button" aria-label="Close" on:click={debug}>
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
</div>
