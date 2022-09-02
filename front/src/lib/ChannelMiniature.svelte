<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import AvatarIcon from '$lib/AvatarIcon.svelte';
	import ChannelDetails from './ChannelDetails.svelte';
	import { getChannelInfo, treatChannelInfo } from './ts/channels';
	import type { ChannelDetailsData } from './ts/channels';
	import { getChannel, myself } from '$lib/state';
	import { ChannelType } from 'backFrontCommon';

	export let channel: string;

	const channelStore = getChannel(channel);
	let showDetails = false;
	let channelDetailsData: ChannelDetailsData;

	function channelImageFromType(channelType: ChannelType) {
		switch (channelType) {
			case ChannelType.PUBLIC:
				return 'group_conv_icon.png';
			case ChannelType.PASSWORD_PROTECTED:
				return 'key.png';
			case ChannelType.PRIVATE:
				return 'hidden.png';
		}
	}

	function click() {
		channelDetailsData = treatChannelInfo($myself.id, $channelStore);
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
