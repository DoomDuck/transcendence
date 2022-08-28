<script lang="ts">
	import FriendsListItem from '$lib/FriendsListItem.svelte';
	import { users } from '$lib/ts/users';
	import type { UserInfo } from 'backFrontCommon';

	let nameSearch = () => {};

	// DEBUG : loading all users as friend
	let friends: UserInfo[] = [];
	[0, 1, 2].forEach((id) => {
		$users.findOrFetch(id).then((_) => {
			friends.push(_);
			friends = friends;
		});
	});
</script>

<div class="friendsList">
	<h1>Friends List</h1>
	{#each friends as friend}
		<FriendsListItem {friend} />
	{/each}
</div>

<style>
	* {
		font-family: 'Press Start 2P';
	}
	h1 {
		text-shadow: unset;
		color: #0b0b41;
		-webkit-text-stroke: 2px #a80a2f;
		font-size: 3em;
		line-height: 300%;
		text-align: center;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 2em;
		}
	}


	.friendsList {
		width: 100vw;
		height: 100vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* gap: 30px; */
	}
</style>
