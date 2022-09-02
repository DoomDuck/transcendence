<script lang="ts">
	import { ChannelInfo, ChannelRights, ChannelUser } from 'backFrontCommon';
	import type { Id } from 'backFrontCommon';
	import SelectDurationButton from './chat/buttons/SelectDurationButton.svelte';
	import { banUser, muteUser } from './ts/channels';
	import UserMiniature from './UserMiniature.svelte';
	import {
		sendDeleteChannel,
		sendLeaveChannel,
		sendSetNewAdminToServer,
		sendUnbanUser,
		myself
	} from '$lib/state';
	import { beforeUpdate, onMount } from 'svelte';
	import UserName from './chat/UserName.svelte';

	export let channel: string;
	export let channelInfo: ChannelInfo;

	let me: ChannelUser | undefined;
	let others: ChannelUser[];

	beforeUpdate(() => {
		const i = channelInfo.users.findIndex((user) => user.id == $myself.id);
		if (i != -1) {
			me = channelInfo.users[i];
			others = channelInfo.users.filter((_, j) => j != i);
		} else {
			others = [...channelInfo.users];
		}
		console.log(JSON.stringify(others));
		console.log(JSON.stringify(channelInfo.bannedUsers));
	});

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
				<UserName userId={user.id} />
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
	{#if me?.rights != ChannelRights.ADMIN}
		<div class="channel-details-users">
			{#each channelInfo.bannedUsers as userId}
				<div class="channel-details-user banned">
					<UserMiniature {userId} />
					<UserName {userId} />
					<button on:click={() => sendUnbanUser({ channel, target: userId })}>Unban</button>
				</div>
			{/each}
		</div>
	{/if}
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
	.banned {
		opacity: 0.7;
	}
	#delete-button {
		background-color: #a80a2f;
	}
</style>
