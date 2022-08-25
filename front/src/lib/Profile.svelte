<script lang="ts">
	import type { UserInfo } from 'backFrontCommon';

	import ProfileStats from './ProfileStats.svelte';
	import AvatarIcon from '$lib/AvatarIcon.svelte';
	export let user: UserInfo;
</script>

<div id="profile">
	<div>
		<AvatarIcon type={'user'} imageURL={user.avatar ?? 'errorUser.png'} />
		<h3>{user.name}</h3>
		<p>ID: {user.id}</p>
	</div>
	<ProfileStats {user} />
</div>

<style>
	h3 {
		color: #ff00b8;
		text-align: center;
		line-height: 0px;
	}

	p {
		color: #c9c7c7;
		text-align: center;
		font-size: smaller;
		line-height: 0%;
	}

	#profile {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-family: 'Lato', sans-serif;
		width: 250px;
	}
</style>
