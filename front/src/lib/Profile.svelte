<script lang="ts">
	import type { UserInfo } from 'backFrontCommon';

	import ProfileStats from './ProfileStats.svelte';
	import AvatarIcon from '$lib/AvatarIcon.svelte';
	export let user: UserInfo;
</script>

<div id="profile">
	<div id='informations'>
		<AvatarIcon type={'user'} imageURL={user.avatar ?? 'errorUser.png'} />
		<h3>{user.name}</h3>
		<div>ID: {user.id}</div>
	</div>
	<ProfileStats {user} />
</div>

<style>
	h3 {
		font-family: 'Lato', sans-serif;
		color: #ff00b8;
		text-align: center;
	}
	div {
		color: #c9c7c7;
		text-align: center;
		text-align: center;
	}
	#informations{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	#profile {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-family: 'Lato', sans-serif;

	}
</style>
