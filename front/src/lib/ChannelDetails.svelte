<script lang="ts">
	import { ChannelRights } from 'backFrontCommon';
	import type { Id } from 'backFrontCommon';
	import SelectDurationButton from './chat/buttons/SelectDurationButton.svelte';
	import { banUser, muteUser } from './ts/channels';
	import type { ChannelDetailsData } from './ts/channels';
	import UserMiniature from './UserMiniature.svelte';
	import PendingText from './PendingText.svelte';
	import { getUser } from '$lib/state';

	export let channel: string;
	export let channelDetailsData: ChannelDetailsData;
	const me = channelDetailsData.me;
	const others = channelDetailsData.others;

	function channelRightsString(rights: ChannelRights): string {
		switch (rights) {
			case ChannelRights.OWNER:
				return 'Owner';
			case ChannelRights.ADMIN:
				return 'Admin';
			case ChannelRights.USER: return 'a simple user';
		}
	}

	function onMuteUser(userId: Id, duration: number) {
		muteUser({
			channel,
			target: userId,
			duration
		});
	}
	function onBanUser(userId: Id, duration: number) {
		banUser({
			channel,
			target: userId,
			duration
		});
	}
</script>

<div id="channel-details">
	{#if me}
		<p>You are in this channel</p>
		<p>You are {channelRightsString(me.rights)}</p>
		{#if me.muted}
			<p>You are currently muted</p>
		{/if}
	{:else}
		<p>You are not in this channel</p>
	{/if}
	<br />
	<div class="channel-details-users">
		{#each others as user}
			<div class="channel-details-user">
			<UserMiniature userId={user.id} />
				<PendingText tag="p" text={getUser(user.id).then(u => u.name)} />
				<p>{channelRightsString(user.rights)}</p>
				{#if user.muted}
					<p>(muted)</p>
				{/if}
				<!-- TODO: do not show if user is not admin -->
				<!-- {#if me?.rights != ChannelRights.USER} -->
				<SelectDurationButton source='muteIcon.png' on:selectDuration={(event) => onMuteUser(user.id, event.detail)}
					> </SelectDurationButton
				>
				<SelectDurationButton source='banIcon.png' on:selectDuration={(event) => onBanUser(user.id, event.detail)}
					> </SelectDurationButton
				>
				<!-- {/if} -->
			</div>
		{/each}
	</div>
</div>

<style>
	#channel-details {
		display: flex;
		flex-direction: column;
	}
	.channel-details-user {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
