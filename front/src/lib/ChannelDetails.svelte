<script lang="ts">
	import { ChannelRights } from 'backFrontCommon';
	import type { Id } from 'backFrontCommon';
	import SelectDurationButton from './chat/buttons/SelectDurationButton.svelte';
	import { banUser, muteUser } from './ts/channels';
	import type { ChannelDetailsData } from './ts/channels';
	import UserMiniature from './UserMiniature.svelte';
	import DeStore from '$lib/DeStore.svelte';
	import Text from '$lib/Text.svelte';
	import {
		getUser,
		sendDeleteChannel,
		sendLeaveChannel,
		sendSetNewAdminToServer,
		storeMap
	} from '$lib/state';

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
			case ChannelRights.USER:
				return 'a simple user';
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
				<h5><DeStore component={Text} data={storeMap(getUser(user.id), (u) => u.name)} /></h5>
				<p>Role: {channelRightsString(user.rights)}</p>
				{#if user.muted}
					<p>(muted)</p>
				{/if}
				{#if me?.rights != ChannelRights.USER}
					<SelectDurationButton on:selectDuration={(event) => onMuteUser(user.id, event.detail)}
						>Mute</SelectDurationButton
					>
					<SelectDurationButton on:selectDuration={(event) => onBanUser(user.id, event.detail)}
						>Ban</SelectDurationButton
					>
					{#if user.rights == ChannelRights.USER}
						<button on:click={() => sendSetNewAdminToServer({ channel, target: user.id })}
							>Set Admin</button
						>
					{/if}
				{/if}
			</div>
		{/each}
	</div>
	<button id="leave-button" on:click={() => sendLeaveChannel({ channel })}>Leave Channel</button>
	{#if me?.rights == ChannelRights.OWNER}
		<button id="delete-button" on:click={() => sendDeleteChannel({ channel })}
			>Delete channel</button
		>
	{/if}
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
	#delete-button {
		background-color: #a80a2f;
	}
</style>
