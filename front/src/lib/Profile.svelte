<script lang="ts">
	import type { ChatUserDto } from 'backFrontCommon';

	import ProfileStats from './ProfileStats.svelte';
	import RoundedImage from '$lib/RoundedImage.svelte';
	// export let image: string;
	// export let name: string;
	// export let iD = 35214;
	// export let bestScore = 359;
	// export let wonGamesRatio = '50%';
	// export let classement = '3';
	export let user: ChatUserDto;
</script>

<div id="profile">
	<div>
		<!-- <img class="roundedImageProfile" src={image} alt="profilepic" /> -->
		<RoundedImage imageURL={user.image} />
		<h3>{user.name}</h3>
		<p>ID: {user.id}</p>
	</div>
	<ProfileStats profile={user.profile} />
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
