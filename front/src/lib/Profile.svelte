<script lang="ts">
	import type { UserInfo } from 'backFrontCommon';
	import ProfileStats from './ProfileStats.svelte';
	import AvatarIcon from '$lib/AvatarIcon.svelte';
	import { myself, observeGame, sendBlockUser, sendFriendInvite, sendUnblockUser } from './state';
	import SendNewMessageButton from './chat/buttons/SendNewMessageButton.svelte';

	export let user: UserInfo;
</script>

<div id="profile">
	<div id="informations">
		<AvatarIcon type={'user'} imageURL={user.avatar ?? 'errorUser.png'} />
		<h3>{user.name}</h3>
		<div>ID: {user.id}</div>
		{#if $myself.friendlist.includes(user.id)}
			<span>Your friend already :)</span>
		{:else}
			<button on:click={() => sendFriendInvite({ target: user.id })}>Add to friends</button>
		{/if}
		{#if $myself.blocked.includes(user.id)}
			<span>You blocked this person :(</span>
			<button on:click={() => sendUnblockUser({ target: user.id })}>Unblock</button>
		{:else}
			<button on:click={() => sendBlockUser({ target: user.id })}>Block</button>
			<SendNewMessageButton target={user.id}>
				<button>Send message</button>
			</SendNewMessageButton>
		{/if}
	</div>
	<ProfileStats {user} />
	{#if user.inGame}
		<div id="statusLine">
			<p>Status: In Game</p>
			<button on:click={() => observeGame(user.id)}> Watch </button>
		</div>
	{:else}
		<p>Status: Not in game</p>
	{/if}
</div>

<style>
	h3 {
		font-family: 'Lato', sans-serif;
		color: #ff00b8;
		text-align: center;
	}
	div {
		color: #c9c7c7;
		text-align: center;
		text-align: center;
	}
	#informations {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	#profile {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-family: 'Lato', sans-serif;
	}
	#statusLine {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	p {
		color: #c9c7c7;
		text-align: center;
	}
</style>
