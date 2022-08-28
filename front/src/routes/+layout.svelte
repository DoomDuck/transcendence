<script lang="ts">
	import Popups from '$lib/Popups.svelte';
	import {
		ChannelConversation,
		channelConvs,
		UserConversation,
		userConvs
	} from '$lib/ts/chatUtils';
	import { state } from '$lib/ts/state';
	import { ChatEvent, RequestFeedbackDto, type UserHistoryDto } from 'backFrontCommon';
	import { onMount } from 'svelte';
	// import { state } from '$lib/ts/state';

	// let previousRoute: string = '/';
	// $: {
	// 	if (window.location.href != previousRoute) {
	// 		if (previousRoute == '/Play' && state.gameParams?.matchMaking) {
	// 			console.log('QUITING PLAY ROUTE');
	// 		}
	// 		previousRoute = window.location.href;
	// 	}
	// }

	onMount(() => {});
</script>

<div id="background">
	<slot />
	<Popups />
</div>

<style>
	
	#background {
		background-image: url('/starsSky.png');
		background-size: cover;
		width: 100%;
		height: 100%;
	}

	:global(h1, h2, h3, h4) {
		font-family: 'Press Start 2P';
		font-style: normal;
		color: #6028ff;
	}

	:global(h1) {
		line-height: 500%;
		-webkit-text-stroke: 2px #ff29ea;
		text-shadow: 6px 6px 6px purple, 6px 6px 6px purple;
	}

	:global(h4) {
		line-height: 350%;
		-webkit-text-stroke: 1px #ff29ea;
		text-shadow: 5px 5px 5px purple, 5px 5px 5px purple;
	}

	:global(a) {
		all: unset;
	}

</style>
