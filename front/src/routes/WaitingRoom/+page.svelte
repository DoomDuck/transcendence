<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';

	import { socket, gameParams } from '$lib/state';
	import { ChatEvent, ChatFeedbackDto } from 'backFrontCommon';
	import { onDestroy, onMount } from 'svelte';

	const classic = gameParams?.classic ?? false;

	onMount(() => {
		socket!.emit(ChatEvent.JOIN_MATCHMAKING, classic, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
			} else {
				goto('/Main', { replaceState: true }).then(() => alert(feedback.errorMessage));
			}
		});
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
		display: flex;
		width: 100%;
		height: 100%;
	}
</style>
