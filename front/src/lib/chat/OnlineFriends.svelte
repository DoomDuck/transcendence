<script lang="ts">
	import UserMiniature from '$lib/UserMiniature.svelte';
	import type { Id } from 'backFrontCommon';
	import AddFriendButton from './buttons/AddFriendButton.svelte';

	export let friends: Id[];
</script>

<div>
	<div id="online">
		<!-- <br> -->
		<div class="title-line">
			<span class="title-element">Online friends</span>
			<div class="title-element"><AddFriendButton /></div>
		</div>
		<!-- <br> -->
	</div>
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
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
	}

	#online {
		color: #fa1ec7;
		width: 80vw;
		background: #12072e;
	}

	.title-line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		/* align-content: flex-start; */
		/* gap: 25px; */
	}

	.title-element {
		margin: 10px;
	}
</style>
