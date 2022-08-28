<script lang="ts">
	import { state } from '$lib/ts/state';
	import { ChatEvent } from 'backFrontCommon';
	import { onDestroy, onMount } from 'svelte';

	const classic = state.gameParams?.classic ?? false;

	onMount(() => {
		state.socket.emit(ChatEvent.JOIN_MATCHMAKING, classic);
	});

	onDestroy(() => {
		state.socket.emit(ChatEvent.QUIT_MATCHMAKING);
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
