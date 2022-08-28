<script lang="ts">
	import { myInfo, getUser } from '$lib/state';
	import FriendsListItem from '$lib/FriendsListItem.svelte';
</script>

<div class="friendsList">
	<h1>Friends List</h1>
	{#each $myInfo.friendlist.map(getUser) as friendPromise}
		{#await friendPromise then friend}
			<FriendsListItem {friend} />
		{/await}
	{/each}
</div>

<style>
	* {
		font-family: 'Press Start 2P';
	}

	h1 {
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
		background-image: url('/starsSky.png');
		background-size: cover;
		width: 100vw;
		height: 100vh;
		overflow-y: scroll;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow-y: scroll;
		gap: 30px;
	}
</style>
