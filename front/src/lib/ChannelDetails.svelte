<script lang="ts">
	import { ChannelRights } from 'backFrontCommon';
	import PendingText from './PendingText.svelte';
	import type { ChannelDetailsData } from './ts/channels';
	import { users } from './ts/users';
	import UserMiniature from './UserMiniature.svelte';

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
</script>

<div id="channel-details">
	{#if me}
		<p>You are in this channel</p>
		<p>You are {channelRightsString(me.rights)}</p>
		{#if me.muted}
			<p>You are currently muted</p>
		{/if}
	{:else}
		<h1>You are not in this channel</h1>
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
				<!-- TODO: -->
				<!-- MUTE, BAN, SET AS ADMIN -->
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
