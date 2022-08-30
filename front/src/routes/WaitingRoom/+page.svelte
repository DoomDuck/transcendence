<script lang="ts">
	import { socket, gameParams } from '$lib/state';
	import { ChatEvent } from 'backFrontCommon';
	import { onDestroy, onMount } from 'svelte';

	const classic = gameParams?.classic ?? false;

	onMount(() => {
		socket!.emit(ChatEvent.JOIN_MATCHMAKING, classic);
	});

	onDestroy(() => {
		socket!.emit(ChatEvent.QUIT_MATCHMAKING);
	});
</script>

<div class="waitingRoom">
	<img src="matchPong.gif" alt="waitingPong" width="1000vw" height="500px" />
</div>

<style>
	img {
		text-align: center;
		margin: auto;
	}
	.waitingRoom {
		background-image: url('/starsSky.png');
		background-size: cover;
		display: flex;
		width: 100%;
		height: 100%;
	}
</style>
