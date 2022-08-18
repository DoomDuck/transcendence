<script lang="ts">
	import GameInvitButton from './chat/buttons/GameInviteButton.svelte';
	import UserMiniature from './UserMiniature.svelte';
	import type { ChatUserDto } from 'backFrontCommon';

	export let friend: ChatUserDto;
</script>

<div class="friend">
	<UserMiniature userId={friend.id} />
	<p class="name">{friend.name}</p>
	<GameInvitButton name={friend.name} />
</div>

<style>
	.friend {
		width: 80vw;
		height: 70px;
		background: #05053d;
		display: flex;
		align-items: center;
		border: 1px solid #a80a2f;
	}

	.name {
		color: #a80a2f;
	}
</style>
