<script lang="ts">
	import { clearGameParams, playGame } from '$lib/state';
	import { onMount } from 'svelte';

	onMount(clearGameParams);
</script>

<h4><div on:click={() => playGame(true, false, true)}>Play Online</div></h4>
<h4><div on:click={() => playGame(false)}>Play Offline</div></h4>
<h4><div on:click={() => playGame(true, true)}>Observe</div></h4>
<h4><a href="/FriendsList"> Challenge a friend </a></h4>
<h4><a href="/Leaderboard"> Leaderboard </a></h4>

<style>
	h4 {
		line-height: 300%;
	}

	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}

	a {
		all: unset;
	}
</style>
