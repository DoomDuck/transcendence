<script lang="ts">
	import { myself, getUser } from '$lib/state';
	import FriendsListItem from '$lib/FriendsListItem.svelte';
	import DeStore from '$lib/DeStore.svelte';
</script>

<div class="friendsList">
	<h1>Friends List</h1>
	{#each $myself.friendlist.map(getUser) as friend}
		<DeStore component={FriendsListItem} {friend} />
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
		display: flex;
		flex-direction: column;
		align-items: center;
		/* gap: 30px; */
	}
</style>
