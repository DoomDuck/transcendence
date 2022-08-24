<script lang="ts">
	import { goto } from '$app/navigation';
	import { state } from '$lib/ts/state';
	import { onMount } from 'svelte';

	onMount(() => {
		state.gameParams = undefined;
	});

	function play(online: boolean, observe?: boolean, matchMaking?: boolean) {
		state.gameParams = {
			online,
			observe,
			matchMaking
		};
		goto('/ChooseGameMode');
	}
</script>

<h4><div on:click={() => play(true, false, true)}>Play Online</div></h4>
<h4><div on:click={() => play(false)}>Play Offline</div></h4>
<h4><div on:click={() => play(true, true)}>Observe</div></h4>
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
