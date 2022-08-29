<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import AvatarIcon from '$lib/AvatarIcon.svelte';
	import ChannelDetails from './ChannelDetails.svelte';
	import { getChannelInfo, treatChannelInfo, type ChannelDetailsData } from './ts/channels';
	import { ChannelInfo } from 'backFrontCommon';

	export let channel: string;

	let showDetails = false;
	let channelDetailsData: ChannelDetailsData;
	function click() {
		getChannelInfo(channel)
			.then(treatChannelInfo)
			.then((chanData) => {
				channelDetailsData = chanData;
				showDetails = true;
			});
	}
</script>

<AvatarIcon type={'channel'} imageURL="group_conv_icon.png" on:clickOnImage={click} />
<Modal bind:show={showDetails}>
	<ChannelDetails {channelDetailsData} />
</Modal>
