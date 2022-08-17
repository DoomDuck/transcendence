<script lang="ts">
	import UserMiniature from '$lib/UserMiniature.svelte';
	import type { ChatUserDto, Id } from 'backFrontCommon';
	import { users } from '$lib/users';

	export let friends: Id[];
</script>

<div>
	<div id="online"><br /> Online friends</div>
	<div class="onlineFriends">
		{#each friends as userId}
			<UserMiniature {userId} />
		{/each}
	</div>
</div>

<style>
	.onlineFriends {
		width: 80vw;
		height: 80px;
		/* background: #140128; */
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
	}

	#online {
		color: #fa1ec7;
		width: 80vw;
		height: 40px;
		background: #12072e;
	}
</style>
