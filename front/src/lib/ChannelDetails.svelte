<script lang="ts">
	import { ChannelRights, type Id } from 'backFrontCommon';
	import SelectDurationButton from './chat/buttons/SelectDurationButton.svelte';
	import PendingText from './PendingText.svelte';
	import { banUser, muteUser, type ChannelDetailsData } from './ts/channels';
	import { users } from './ts/users';
	import UserMiniature from './UserMiniature.svelte';

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
				<PendingText tag="p" text={$users.findOrFetchProp(user.id, 'name')} />
				<p>Role: {channelRightsString(user.rights)}</p>
				{#if user.muted}
					<p>(muted)</p>
				{/if}
				<!-- TODO: do not show if user is not admin -->
				<!-- {#if me?.rights != ChannelRights.USER} -->
				<SelectDurationButton on:selectDuration={(event) => onMuteUser(user.id, event.detail)}
					>Mute</SelectDurationButton
				>
				<SelectDurationButton on:selectDuration={(event) => onBanUser(user.id, event.detail)}
					>Ban</SelectDurationButton
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
