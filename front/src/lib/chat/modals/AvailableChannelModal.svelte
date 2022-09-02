<script lang="ts">
	import { sendJoinChannel, socket } from '$lib/state';
	import { ChannelSummary, GetInfoEvent, RequestFeedbackDto } from 'backFrontCommon';

	let channels: ChannelSummary[] = [];

	socket!.emit(GetInfoEvent.GET_CHANNELS_LIST, (feedback: RequestFeedbackDto<ChannelSummary[]>) => {
		if (feedback.success) channels = feedback.result!;
		else console.error('could not get channels list');
	});
</script>

<div id="available-channels">
	{#each channels as channelSummary}
		<span>channel.name</span>
		<!-- {#if }

    {:else}

    {/if}
    <span>Already registered</span> -->
		<button on:click={() => sendJoinChannel({ channel: channelSummary.channel })}>Join</button>
	{/each}
</div>

<style>
	#available-channels {
		display: grid;
		grid-template-columns: 9fr 1fr;
		width: 30vw;
	}
</style>
