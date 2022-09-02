<script lang="ts">
	import { myself, disconnect, sendUnblockUser } from '$lib/state';
	import TotpSetupButton from '$lib/TotpSetupButton.svelte';
	import ProfileParams from '$lib/ProfileParams.svelte';
	import UserMiniature from '$lib/UserMiniature.svelte';
	import UserName from '$lib/chat/UserName.svelte';
</script>

<div id="app">
	<ProfileParams avatar={$myself.avatar} name={$myself.name} />
	<div id="blockedProfiles">
		<div class="blocked">
			<div class="blockedInfos">
				{#each $myself.blocked as userId}
					<div>
						<UserMiniature {userId} />
						<UserName {userId} />
						<button on:click={() => sendUnblockUser({ target: userId })}> unblock </button>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div id="lastParams">
		<TotpSetupButton />
		<button id="disco" on:click={disconnect}> Disconnect </button>
	</div>
</div>

<style>
	* {
		font-family: 'Lato', sans-serif;
		color: #06bcff;
	}

	#app {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	#blockedProfiles {
		width: 50vw;
		height: 600px;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		border: 1px solid #ff00b8;
	}
	.blocked {
		width: 50vw;
		height: 100px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.roundedImage {
		overflow: hidden;
		-webkit-border-radius: 50px;
		-moz-border-radius: 50px;
		border-radius: 30px;
		width: 60px;
		height: 60px;
		margin: 20px;
	}
	.blockedInfos {
		display: flex;
		flex-direction: row;
		justify-content: right;
		align-items: center;
	}
	button {
		margin: 20px;
	}
	#lastParams {
		width: 50vw;
		height: 80px;
		border: 1px solid #ff00b8;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	#disco {
		float: right;
		width: 150px;
		height: 30px;
	}
</style>
