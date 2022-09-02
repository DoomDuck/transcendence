<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import AvatarIcon from '$lib/AvatarIcon.svelte';
	import ChannelDetails from './ChannelDetails.svelte';
	import { getChannelInfo, treatChannelInfo } from './ts/channels';
	import type { ChannelDetailsData } from './ts/channels';
	import { getChannel, myself } from '$lib/state';
	import { ChannelCategory } from 'backFrontCommon';

	export let channel: string;

	const channelStore = getChannel(channel);
	let showDetails = false;
	let channelDetailsData: ChannelDetailsData;

	function channelImageFromType(category: ChannelCategory) {
		switch (category) {
			case ChannelCategory.PUBLIC:
				return 'group_conv_icon.png';
			case ChannelCategory.PROTECTED:
				return 'key.png';
			case ChannelCategory.PRIVATE:
				return 'hidden.png';
		}
	}

	function click() {
		channelDetailsData = treatChannelInfo($myself.id, $channelStore);
		console.log(JSON.stringify(channelDetailsData));
		showDetails = true;
	}
</script>

<AvatarIcon
	type={'channel'}
	imageURL={channelImageFromType($channelStore.channelType)}
	on:clickOnImage={click}
/>
<Modal bind:show={showDetails}>
	<ChannelDetails {channel} {channelDetailsData} />
</Modal>
